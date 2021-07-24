from celery import Celery, Task
from celery.result import AsyncResult
from elastic import *
from io import BytesIO
from PIL import Image
import base64
# from flask_app import app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from AI import *
celery = Celery('tasks', backend="db+postgresql://postgres:postgres@postgres:5432/ihome_db", broker='amqp://rabbitmq:rabbitmq@rabbit:5672')

Base = declarative_base()
url = 'postgresql://postgres:postgres@postgres/ihome_db'
engine = sqlalchemy.create_engine(url)
Session = scoped_session(sessionmaker(bind=engine))
session = Session()

class TaskResult(Base):
    __tablename__ = 'task_results'
    id = Column(String, primary_key=True)
    result = Column(ARRAY(JSONB))
    
    def __init__(self, id, result):
        self.id = id
        self.result = result
    def __repr__(self):
        return f"<Task {self.id}>"


class DB(Task):
    _check = False
        
    def insert(self, random_id, result):
        # if not self._check:
        #     TaskResult.__table__.drop(engine)
        #     TaskResult.__table__.create(engine)
        #     self._check = True
        # if not engine.dialects.has_table(engine, TaskResult):
        #     TaskResult.__table__.create(engine)
        TaskResult.__table__.create(engine, checkfirst=True)
        task_obj = TaskResult(id=random_id, result=result)
        session.add(task_obj)
        session.commit()

class ElasticTask(Task):
    _embed = None
    _es = None

    @property
    def embed(self):
        if self._embed == None:
            self._embed = initialize_book_list()
        return self._embed

    @property
    def es(self):
        if self._es == None:
            self._es = getEs()
        return self._es

class AITask(Task):
    _model = None

    @property
    def model(self):
        if self._model == None:
            self._model = getModel()
        return self._model

@celery.task(base=AITask)
def find_label_from_image(image):
    """
    str(image) -> str(label)
    학습시킨 AI 모델 들어가는 함수
    """
    print("detecting label")
    image = Image.open(BytesIO(base64.b64decode(image)))
    model = find_label_from_image.model
    try:
        label= show_inference(model, image)
    except:
        return None
    return label

@celery.task(base=ElasticTask)
def find_id_from_label(label):
    """
    str(label) -> list[Integer](idx list)
    """
    if label == None:
        return []
    print("searching for books")
    embed = find_id_from_label.embed
    es = find_id_from_label.es
    book_list = find_book_list(label, embed, es)

    return book_list

@celery.task(base=DB)
def insert_data(idList, random_id):
    # DB에 데이터 저장
    insert_data.insert(random_id, idList)
    return "SUCCESS"
