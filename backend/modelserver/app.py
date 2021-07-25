from typing import Literal
from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger

import uuid

# 함수 가져오기
from celery import chain

app = Flask(__name__)
app.config.from_object("config.DevelopmentConfig")

CORS(app)
swagger = Swagger(app)

import tasks

@app.route('/')
def home_page():
    return "model server"

@app.route('/model/image', methods=['POST'])
def get_book_list():
    """
    이미지를 작업 queue에 넣고, 각 요청에 대한 uuid 반환
    ---
    description: put image into task queue and return uuid for each request
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
      uuid:
        type: string
        example: "8e770c08-f118-48a3-97ba-32a5367da94c"
    responses:
      200:
        description: unique id
        schema:
          $ref: "#/definitions/uuid"

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