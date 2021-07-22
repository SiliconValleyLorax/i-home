import time
from celery import Celery, Task
from celery.result import AsyncResult
from elastic import *

celery = Celery('tasks', backend="rpc://", broker='amqp://rabbitmq:rabbitmq@rabbit:5672')

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
    _embeddings = None
    _session = None
    _text_ph = None
    _es = None
    _star = None
    @property
    def embeddings(self):
        if self._embeddings == None:
            self._embeddings, self._session, self._text_ph = initialize_book_list()
        return self._embeddings
    @property
    def session(self):
        if self._session == None:
            self._embeddings, self._session, self._text_ph = initialize_book_list()
        return self._session
    @property
    def text_ph(self):
        if self._text_ph == None:
            self._embeddings, self._session, self._text_ph = initialize_book_list()
        return self._text_ph
    
    @property
    def es(self):
        if self._es == None:
            self._es = getEs()
        return self._es

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

@celery.task(base=ElasticTask)
def find_id_from_label(label):
    """
    str(label) -> list[Integer](idx list)
    """
    print("searching for books")
    time.sleep(3)
    embeddings = find_id_from_label.embeddings
    session = find_id_from_label.session
    text_ph = find_id_from_label.text_ph
    es = find_id_from_label.es
    print("celery task get :", embeddings, session, text_ph, es)
    book_list = find_book_list(label, embeddings, session, es, text_ph)


    # DB에 결과 집어 넣고 return "Complete" / 사실 리턴 값 필요 없음...
    return book_list