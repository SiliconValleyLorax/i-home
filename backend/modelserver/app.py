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
import tensorflow.compat.v1 as tf
import tensorflow_hub as hub
import pandas as pd
import time
import openpyxl

app = Flask(__name__)
CORS(app)
swagger = Swagger(app)

es = Elasticsearch('http://elasticsearch:9200')
tf.compat.v1.disable_eager_execution()

def elastic_info():
    return es.info()

def elastic_health():
    return es.cluster.health()

result=[]
@app.before_first_request
def http_first():
    print ("HTTP first_request")
    ## 텍스트 임베딩 모델 다운로드 
    print("Downloading pre-trained embeddings from tensorflow hub...")
    embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")
    text_ph = tf.placeholder(tf.string)
    embeddings = embed(text_ph)
    print("Done.")

    ## tensorflow session 다운로드
    print("Creating tensorflow session...")
    session = tf.Session()
    session.run(tf.global_variables_initializer())
    session.run(tf.tables_initializer())
    print("Done.")
    
    # 텍스트 임베딩 함수
    def embed_text(text):
        vectors = session.run(embeddings, feed_dict={text_ph: text})
        return [vector.tolist() for vector in vectors]

    
    data=pd.read_excel('./book_data.xlsx', header=1)
    index_name="book_test"
    if es.indices.exists(index=index_name):
        es.indices.delete(index=index_name)
    # 인덱스 생성
    es.indices.create(index=index_name, body={
        "mappings":{
            "properties":{
                "idx":{
                    "type" :"integer"
                },
                "title":{
                    "type": "keyword"
                },
                "description":{
                    "type":"text"
                },
                "text-vector":{
                    "type": "dense_vector",
                    "dims": 512
                }
            }
        }
    })
    # 데이터 집어넣기
    for i in range(len(data)):
        title=data.loc[i,:]['Title']
        try:
            description=data.loc[i,:]['Description'].replace("\n"," ").replace("'",'').replace('"','').strip()
        except:
            description=str(data.loc[i,:]['Description'])
        try:
            text_vector=embed_text([title+description])[0]
            doc={'idx':i,'title':title,'description':description, 'text-vector':text_vector}
            print(i,title)
        except:
            print('no data')
            print('마지막 인덱스', i)
            break
        es.index(index=index_name, id=i, body=doc)
        
    es.indices.refresh(index=index_name)

    label="bear moon"
    query=label
    query_vector=embed_text([query])[0]
    index_name="book_test"
    script_query={
        "script_score":{
            "query":{"match_all":{}},
            "script":{
                "source": "cosineSimilarity(params.query_vector, doc['text-vector']) + 1.0",
                "params": {"query_vector": query_vector}
            }
        }
    }
    search_start=time.time()
    response=es.search(
        index=index_name,
        body={
            "size": 5,
            "query":script_query,
            "_source": {"includes":["idx","title","description"]}
        }
    )
    search_time = time.time() - search_start
    print()
    print("{} total hits.".format(response["hits"]["total"]["value"]))
    print("search time: {:.2f} ms".format(search_time * 1000))
    for hit in response["hits"]["hits"]:
        print("id: {}, score: {}".format(hit["_id"], hit["_score"]))
        print(hit["_source"])
        print()
        tmp=[hit["_id"], hit["_score"],hit["_source"]]
        result.append(tmp)
    


@app.route('/info')
def api_info():

    return jsonify(elastic_info())

@app.route('/health')
def api_health():
    return jsonify(elastic_health())


# 책 라벨로 유사도 검색
@app.route('/search')
def api_search():
    return jsonify(result)
    

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

    label = find_label(image)
    # elastic search로 추천 도서 목록 찾기
    book_list = find_book_list(label)

    return jsonify(book_list)


@app.route('/test', methods=['GET', 'POST'])
def test():
    print("model server called")
    return jsonify("from model server")

