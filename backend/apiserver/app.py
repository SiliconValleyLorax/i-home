from io import BytesIO
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger
from PIL import Image
import base64
import json
import requests
import pandas as pd
import openpyxl

# from torchvision import models
# import torchvision.transforms as transforms
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.orm.exc import NoResultFound

app = Flask(__name__)
swagger = Swagger(app)
app.config.from_object("config.DevelopmentConfig")
db = SQLAlchemy(app)
from models import *
db.create_all()
CORS(app)


url = 'postgresql://postgres:postgres@postgres/book_list'
engine = sqlalchemy.create_engine(url)
Session = scoped_session(sessionmaker(bind=engine))
session = Session()

@app.before_first_request
def http_first():
    if(session.query(Book).count() == 0):
        book_data = read_from_file(filename)
        # db.drop_all()        
        try:
            for i in range(len(book_data)):
                book_obj = Book(book_data[i][2], book_data[i][4], book_data[i][3], book_data[i][8])
                session.add(book_obj)
            session.commit()
        except Exception as e:
            session.rollback()
            print(500, "Error: 데이터 저장 실패")
    else:
        print(Book.query.count())
    
@app.route('/api/find', methods=['GET', 'POST'])
def find():
    books = Book.query.all()
    results = [
        {"id":book.id, "title":book.title, "author":book.author, "image":book.img_url} for book in books
    ]
    return jsonify(results)

filename = 'book_data.xlsx'

def read_from_file(filepath):
    workbook = openpyxl.load_workbook(filename=filepath)
    sheet = workbook.worksheets[0]
    tmp = []
    for i in range(3,sheet.max_row+1): 
        tmp.append([]) 
        for cell in sheet[i]: 
            tmp[-1].append(cell.value)
    print(len(tmp))
    return tmp

@app.route('/')
def home_page():
    return "home page"

@app.route('/api/test')
def test():
    print("api test called")
    try:
        res = requests.get("http://modelserver:8000/test")
        print(res.json())
        return res.json()
    except:
        return "hello World"

@app.route('/api/send_image_ex', methods=['POST'])
def send_image_ex():
    image = request.get_json()["image"].split(",")[-1]
    image = Image.open(BytesIO(base64.b64decode(image)))
    try:
        class_name = '0','모델 결과 (아직 모델 안들어갔음!! )'
    except:
        class_name='객체 검출 실패'
    rgb_array = []
    rgb_image = image.convert("RGB")
    x, y = image.size
    rgb_array = rgb_image.getcolors(x*y)
    rgb_array.sort(key=lambda x:x[0], reverse=True)
    color_array = []
    # 임의로 30개 설정, 만약 다섯개보다 적을 경우 (거의 그럴 일 없겠지만) 예외 처리 필요
    for i in range(30):
        # 편의를 위해 to hex
        color_array.append([rgb_array[i][0], '#{:02x}{:02x}{:02x}'.format(rgb_array[i][1][0], rgb_array[i][1][1], rgb_array[i][1][2])])
    return jsonify([color_array, x*y, class_name])

@app.route('/api/image', methods=['POST'])
def send_image():
    """
    이미지를 model server에 넘기고, 추천 그림책 리스트 받아서 리턴한다.
    ---
    description: Post a image to api server
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
          $ref: "#/definitions/Book"
      Book:
        type: object
        properties:
          id:
            type: integer
            example: 1
          title:
            type: string
            example: "The Very Hungry Caterpillar"
          author:
            type: string
            example: "by Eric Carle"
          image:
            type: string
            example: "https://m.media-amazon.com/images/I/71KilybDOoL._AC_UY218_.jpg"
    responses:
      200:
        description: A list of Books
        schema:
          $ref: "#/definitions/Booklist"


    """
    image = request.get_json()["image"].split(",")[-1]
    res = requests.post("http://modelserver:8000/model/image", image).json()
    book_list = []

    try:
        for book in res:
            print("id: ", book[0])
            book_detail = session.query(Book).filter(Book.id == int(book[0])+1).one()
            bookObject = {
            "id": book_detail.id,
            "title": book_detail.title,
            "author": book_detail.author,
            "image": book_detail.img_url
            }
            book_list.append(bookObject)
        return jsonify(book_list)
    except NoResultFound:
        print ("Requested Book Not Found")

@app.route('/api/book/<int:id>', methods=['GET'])
def get_book(id):
    """

    DB에서 id에 해당하는 책 정보 불러오기
    ---
    parameters:
      - name: id
        in: path
        type: integer
        example: 1
        required: true
        description: Numeric id of the book to get

    definitions:
      Book_info:
        type: object
        properties:
          id:
            type: integer
            example: 1
          title:
            type: string
            example: "The Very Hungry Caterpillar"
          author:
            type: string
            example: "by Eric Carle"
          image:
            type: string
            example: "https://m.media-amazon.com/images/I/71KilybDOoL._AC_UY218_.jpg"
          desc:
            type: string
            example: "THE all-time classic picture book, from generation to generation, sold somewhere in the world every 30 seconds! A sturdy and beautiful book to give as a gift for new babies, baby showers, birthdays, and other new beginnings!"
    responses:
      200:
        description: An information of the Book
        schema:
          $ref: "#/definitions/Book_info"

    """
    try:
        book_detail = session.query(Book).filter(Book.id == id).one()
        bookObject = {
            "id": book_detail.id,
            "title": book_detail.title,
            "author": book_detail.author,
            "desc": book_detail.desc,
            "image": book_detail.img_url
        }
        return jsonify(bookObject)

    except NoResultFound:
        print ("Requested Book Not Found")

@app.route('/api/progress', methods=['POST'])
def progress():
    task_id = request.get_json()["taskID"]
    response = requests.post("http://modelserver:8000/model/progress", task_id)
    return response.json()

@app.route('/api/result', methods=['POST'])
def result():
    task_id = request.get_json()["taskID"]
    response = requests.post("http://modelserver:8000/model/result", task_id).json()

    book_list = []

    # try:
    #     for book in response:
    #         print("id: ", book[0])
    #         book_detail = session.query(Book).filter(Book.id == int(book[0])+1).one()
    #         bookObject = {
    #         "id": book_detail.id,
    #         "title": book_detail.title,
    #         "author": book_detail.author,
    #         "image": book_detail.img_url
    #         }
    #         book_list.append(bookObject)
    #     return jsonify(book_list)
    # except NoResultFound:
    #     print ("Requested Book Not Found")
    return jsonify(response)
    
if __name__ == "__main__":

    app.run(host='0.0.0.0', debug=False, port=5000)