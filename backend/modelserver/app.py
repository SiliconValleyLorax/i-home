from flask import Flask, url_for, request, jsonify, render_template
from flask_cors import CORS
from flasgger import Swagger

from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from sqlalchemy.orm import sessionmaker, scoped_session
from datetime import datetime


# 함수 가져오기
from elastic import *
from AI import *
from elasticsearch import Elasticsearch
from elasticsearch import helpers

app = Flask(__name__)
CORS(app)
swagger = Swagger(app)

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
    book_list = find_book_list(label, embeddings, session, es, text_ph)
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
    추천 도서 목록을 리턴
    """

    # api 서버에서 이미지 받아오기 - 현재 byte 타입으로 들어오고 있어요
    image = request.data
    print(image)

    # label = find_label(image)
    label="bear moon"
    # elastic search로 추천 도서 목록 찾기
    book_list = find_book_list(label, embeddings, session, es, text_ph)

    return jsonify(book_list)


@app.route('/test', methods=['GET', 'POST'])
def test():
    print("model server called")
    return jsonify("from model server")

