from typing import Literal
from flask import Flask, url_for, request, jsonify, render_template
from flask_cors import CORS
from flasgger import Swagger

from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from sqlalchemy.orm import sessionmaker, scoped_session
from datetime import datetime

from io import BytesIO
from PIL import Image
import base64

# 함수 가져오기
from elastic import *
from AI import *
from elasticsearch import Elasticsearch
from elasticsearch import helpers
from celery import chain
import time
app = Flask(__name__)
CORS(app)
swagger = Swagger(app)
import tasks
# from tasks import es
es = Elasticsearch('http://elasticsearch:9200')


def elastic_info():
    return es.info()

def elastic_health():
    return es.cluster.health()

result=[]
@app.before_first_request
def http_first():
    global embeddings
    global session
    global text_ph
    embeddings, session, text_ph = initialize_book_list(es)



@app.route('/info')
def api_info():

    return jsonify(elastic_info())

@app.route('/health')
def api_health():
    return jsonify(elastic_health())


# 책 라벨로 유사도 검색
@app.route('/search')
def api_search():
    label="bear moon"
    # elastic search로 추천 도서 목록 찾기
    # book_list = find_book_list(label, tasks.embeddings, tasks.session, es, tasks.text_ph)
    book_list = []
    return jsonify(book_list)
    

@app.route('/')
def home_page():
    return "home page_model server"

@app.route('/model/image', methods=['POST'])
def get_book_list():
    """
    추천 도서 목록을 리턴
    ---
    description: Post a image to model server
    parameters:
      - name: body
        in: body
        required: true
        description: image of a toy
        type: object
        properties:
          image:
          type: string
          example: "toy.jpg"
    definitions:
      Booklist:
        type: array
        items:
          $ref: "#/definitions/BookID"
      BookID:
        type: integer
        example: 1

    responses:
      200:
        description: A list of IDs of Books
        schema:
          $ref: "#/definitions/Booklist"

    """

    # api 서버에서 이미지 받아오기
    image = request.get_data(as_text=Literal[True])
    image = Image.open(BytesIO(base64.b64decode(image)))

    ### 수아님 코드 작성 부분
    # image를 파라미터로 넣어서 밑에 label에 string 형태로 리턴해주시면 됩니다!

    # label = find_label(image)
    
    label="bear moon"
    # elastic search로 추천 도서 목록 찾기
    book_list = find_book_list(label, embeddings, session, es, text_ph)

    return jsonify(book_list)

@app.route('/model/progress', methods=['POST'])
def progress():
    task_id = request.get_data(as_text=Literal[True])
    try:
        result = tasks.get_job_state(task_id)
    except:
        return jsonify("failed to get job")
    return jsonify(result)

@app.route('/model/result', methods=['POST'])
def result():
    task_id = request.get_data(as_text=Literal[True])
    try:
        result = tasks.get_job_result(task_id)
    except:
        return jsonify("Can not find result")
    return jsonify(result)

@app.route('/test', methods=['GET', 'POST'])
def test():
    task1 = tasks.find_label_from_image.s("stringtypeimage")
    task2 = tasks.find_id_from_label.s()
    chaining = chain((task1, task2))
    chain_task = chaining()
    return jsonify(str(chain_task.id))

# 테스트코드
@app.route('/simpletest', methods=['GET'])
def simple():
    time.sleep(5)
    return jsonify("modelserver")