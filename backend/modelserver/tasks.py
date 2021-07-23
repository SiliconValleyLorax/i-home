import time
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
from AI import show_inference
celery = Celery('tasks', backend="db+postgresql://postgres:postgres@postgres:5432/book_list", broker='amqp://rabbitmq:rabbitmq@rabbit:5672')

Base = declarative_base()
url = 'postgresql://postgres:postgres@postgres/book_list'
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

def get_job_state(task_id):
    """
    return celery job from task id
    """
    try:
        job = AsyncResult(task_id, app=celery)
    except:
        return "Failed to get state"
    return job.state

def get_job_result(task_id):
    try:
        job = AsyncResult(task_id, app=celery)
    except:
        return "Failed to get job result"
    return job.result

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



@celery.task()
def find_label_from_image(image):
    """
    str(image) -> str(label)
    학습시킨 AI 모델 들어가는 함수
    """
    print("detecting label")
    image = Image.open(BytesIO(base64.b64decode(image)))
    label= show_inference(image)
    time.sleep(3)
    return label

@celery.task(base=ElasticTask)
def find_id_from_label(label):
    """
    str(label) -> list[Integer](idx list)
    """
    print("searching for books")
    time.sleep(3)
    embed = find_id_from_label.embed
    es = find_id_from_label.es
    print("celery task get :", embed, es)
    book_list = find_book_list(label, embed, es)

    # DB에 결과 집어 넣고 return "Complete" / 사실 리턴 값 필요 없음...
    return book_list

@celery.task(base=DB)
def insert_data(idList, random_id):
    #데이터 넣기
    insert_data.insert(random_id, idList)
    return "SUCCESS"
