from typing import Literal
from flask import Flask, url_for, request, jsonify
from flask_cors import CORS
from flasgger import Swagger

from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from sqlalchemy import create_engine

from io import BytesIO
from PIL import Image
import base64
import uuid

# 함수 가져오기
from elasticsearch import Elasticsearch
from elasticsearch import helpers
from celery import chain
import time

app = Flask(__name__)
app.config.from_object("config.DevelopmentConfig")

CORS(app)
swagger = Swagger(app)

import tasks

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

    # get image from api server
    image = request.get_data(as_text=Literal[True])

    # generate uuid to distinguish each job
    random_id = uuid.uuid4()

    # 1. object detection from the image
    # 2. similarity search
    # 3. save result in DB
    # chain 3 subtasks

    task1 = tasks.find_label_from_image.s(image)
    task2 = tasks.find_id_from_label.s()
    task3 = tasks.insert_data.s(random_id)
    chaining = chain((task1, task2, task3))
    
    # execute task
    chaining()
    
    # return uuid
    return jsonify(str(random_id))

@app.route('/test', methods=['GET', 'POST'])
def test():
    random_id = uuid.uuid4()
    print(random_id)
    task1 = tasks.find_label_from_image.s("stringtypeimage")
    task2 = tasks.find_id_from_label.s()
    task3 = tasks.insert_data.s(random_id)
    chaining = chain((task1, task2, task3))
    chain_task = chaining()
    # return jsonify(str(chain_task.id))
    return jsonify(str(random_id))