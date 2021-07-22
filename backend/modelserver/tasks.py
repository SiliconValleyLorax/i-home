import time
from celery import Celery, current_task
from celery.result import AsyncResult
from elasticsearch import Elasticsearch
from elastic import *
import random

celery = Celery('tasks', backend="rpc://", broker='amqp://rabbitmq:rabbitmq@rabbit:5672')

# es = Elasticsearch('http://elasticsearch:9200')

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

# def http_first():
#     print("initializing...")
#     global embeddings
#     global session
#     global text_ph
#     embeddings, session, text_ph = initialize_book_list(es)

@celery.task()
def examplefunc(a, b):
    print("example funnction executed")
    time.sleep(5)
    return a+b

@celery.task()
def examplefunc2(a, b):
    print("example funnction2 executed")
    time.sleep(5)
    return a*b

@celery.task()
def find_label_from_image(image_string):
    """
    str(image) -> str(label)
    학습시킨 AI 모델 들어가는 함수
    """
    print("detecting label")
    time.sleep(3)
    return "bear moon"

@celery.task()
def find_id_from_label(label):
    """
    str(label) -> list[Integer](idx list)
    """
    print("searching for books")
    # book_list = find_book_list(label, embeddings, session, es, text_ph)
    time.sleep(3)
    book_list = [random.random()]
    return book_list