import json
from flask import Flask, request, jsonify
from sqlalchemy.sql.expression import false, true
from flask_cors import CORS
from flasgger import Swagger
import requests
import openpyxl

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

@app.before_first_request
def https_first_request():
    filename = 'Book.xlsx'
    if(session.query(Book).count() == 0):
        book_data = read_from_file(filename)
        print(book_data)
        # db.drop_all()        
        try:
            for i in range(len(book_data)):
                # book_obj = Book(book_data[i][2], book_data[i][4], book_data[i][3], book_data[i][8])
                book_obj = Book(book_data[i][0], book_data[i][1], book_data[i][2], book_data[i][3], book_data[i][4], book_data[i][5])
                print(book_data[i][0], book_data[i][1], book_data[i][2], book_data[i][3], book_data[i][4], book_data[i][5])
                session.add(book_obj)
                print(book_obj)
                print('book object 들어감')
            session.commit()
        except Exception as e:
            session.rollback()
            print(500, "Error: 데이터 저장 실패")
    else:
        print(Book.query.count())

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
    return "api server"

def check_image_type(image_header):
    image_type = image_header.split("/")[-1].split(";")[0].upper()
    accepted_list = ["JPG", "JPEG", "PNG", "HEIC"]
    print("type:", image_type)
    if image_type in accepted_list:
        return True
    return False

@app.route('/api/image', methods=['POST'])
def send_image():
    """
    이미지를 model server에 넘기고, modelserver에서 받은 uuid를 반환한다.
    ---
    description: Post a image to model server and return uuid from model server
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
      400:
        description: failed to read image
    """
    if request.method != "POST":
        return jsonify(None), 405
    try:
        image = request.get_json()["image"].split(",")
        if not check_image_type(image[0]):
            return jsonify(None), 400
        res = requests.post("http://modelserver:7000/model/image", image[-1]).json()
        return jsonify(res)
    except:
        return jsonify(None), 400

@app.route('/api/book/<int:id>', methods=['GET'])
def get_book(id):
    """
    DB에서 id에 해당하는 책 정보 불러오기
    ---
    description: get information of the book
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
          desc_ko:
            type: string
            example: "세대에서 세대에 걸쳐 전 세계 어디선가 30초마다 팔리는 고전 그림책! 아기들, 아기 샤워, 생일, 그리고 다른 새로운 시작들을 위해 선물로 줄 튼튼하고 아름다운 책!"
    responses:
      200:
        description: the information of the Book
        schema:
          $ref: "#/definitions/Book_info"
      404:
        description: Can't find the information of requested book 
      405:
        description: Invalid request
    """
    if request.method != 'GET':
        return jsonify("INVALID request"), 405
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
        return jsonify(bookObject), 200
    except NoResultFound:
        print ("Requested Book Not Found")
        return jsonify("Failed to get book information"), 404

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
  results = []
  connection = engine.raw_connection()
  cursor = connection.cursor()
  cursor.execute("select * from task_results")
  for row in CursorByName(cursor):
    results.append(row)
  for i in range(len(results)):
    if(results[i]["id"] == task_id):
      return results[i]["result"]       
  return None

@app.route('/api/result/<task_id>', methods=['GET'])
def result(task_id):
    """
    uuid를 받아 해당 id에 해당하는 Task의 현재 상황과 결과를 반환한다.
    ---
    parameters:
      - name: body
        in: path
        type: string
        example: "8e770c08-f118-48a3-97ba-32a5367da94c"
        required: true
        description: uuid to distinguish tasks
    definitions:
      response:
        type: object
        properties:
          state:
            type: string
            enum: ["SUCCESS", "PROCESSING", "FAIL"]
          result:
            type: array
            items:
              $ref: "#/definitions/book"
      book:
        type: object
        properties:
          id:
            type: integer
            example: 31
          title:
            type: string
            example: "School Bus"
          image:
            type: string
            example: "https://images-na.ssl-images-amazon.com/images/I/51-tr+wUaWL._SY404_BO1,204,203,200_.jpg"
          slogan:
            type: string
            example: "노란 버스를 타고 학교에 가요!"
    responses:
      200:
        description: An information of the Book
        schema:
          $ref: "#/definitions/response"
      202:
        description: still processing
        examples:
          application/json: {"state":"PROCESSING", "result":[]}          
      405:
        description: Invalid request
      500:
        description: failed to find label
        examples:
          application/json: {"state":"FAIL", "result":[]}
      
    """
    if request.method != "GET":
      return jsonify("INVALID request"), 405

    data = {"state":"", "result":[]}
    
    try:
        book_list = get_data(task_id)
        if book_list == None:
            data["state"] = "PROCESSING"
            return jsonify(data), 202
        elif book_list == []:
            data["state"] = "FAIL"
            return jsonify(data), 500
        else:
            data["state"] = "SUCCESS"
    except:
        data["state"] = "PROCESSING"
        return jsonify(data), 202
    
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
    return jsonify(data), 200