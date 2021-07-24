from io import BytesIO
import io
from flask import Flask, request, jsonify, redirect
from sqlalchemy.orm import exc
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
from translate import *
db.create_all()
CORS(app)
url = 'postgresql://postgres:postgres@postgres/ihome_db'
engine = sqlalchemy.create_engine(url)
Session = scoped_session(sessionmaker(bind=engine))
session = Session()
def initialize():
    if(session.query(Book).count() == 0):
        book_data = read_from_file(filename)
        # db.drop_all()        
        try:
            for i in range(len(book_data)):
                # book_obj = Book(book_data[i][2], book_data[i][4], book_data[i][3], book_data[i][8])
                book_obj = Book(book_data[i][0], book_data[i][1], book_data[i][2], book_data[i][3], book_data[i][4], book_data[i][5])
                session.add(book_obj)
                print(book_obj)
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
filename = 'Book.xlsx'
def read_from_file(filepath):
    workbook = openpyxl.load_workbook(filename=filepath)
    sheet = workbook.worksheets[0]
    tmp = []
    for i in range(2,sheet.max_row+1): 
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
        res = requests.get("http://modelserver:7000/test")
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
    res = requests.post("http://modelserver:7000/model/image", image).json()
    return jsonify(res)
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
            "image": book_detail.img_src,
            "desc_ko": get_translate(book_detail.desc)
        }
        return jsonify(bookObject)
    except NoResultFound:
        print ("Requested Book Not Found")
@app.route('/api/testpapago')
def test_papago():
  text="hi my name is seoyeon"
  return get_translate(text)
class CursorByName():
    def __init__(self, cursor):
        self._cursor = cursor
    def __iter__(self):
        return self
    def __next__(self):
        row = self._cursor.__next__()
        return { description[0]: row[col] for col, description in enumerate(self._cursor.description) }


def get_data(task_id):
  book_list = None
  results = []
  connection = engine.raw_connection()
  cursor = connection.cursor()
  cursor.execute("select * from task_results")
  for row in CursorByName(cursor):
    results.append(row)
  for i in range(len(results)):
    if(results[i]["id"] == task_id):
      book_list = results[i]["result"]
  return book_list

@app.route('/api/result', methods=['POST'])
def result():
    data = {"state":"", "result":[]}
    try:
      task_id = request.get_json()["taskID"]
    except:
      data["state"] = "PROCESSING"
      return data
    try:
      book_list = None
      while (book_list == None):
        book_list = get_data(task_id)
      print(book_list)
      data["state"] = "SUCCESS"
    except:
      data["state"] = "PROCESSING"
    
    try:
        book_info_list = []
        for book in book_list:
            book_detail = session.query(Book).filter(Book.id == book["id"]).one()
            bookObject = {
            "id": book_detail.id,
            "title": book_detail.title,
            "slogan": book_detail.slogan,
            "image": book_detail.img_src
            }
            book_info_list.append(bookObject)
        data["result"] = book_info_list
    except NoResultFound:
        data["state"] = "FAILURE"
        print ("Requested Book Not Found")
    return jsonify(data)