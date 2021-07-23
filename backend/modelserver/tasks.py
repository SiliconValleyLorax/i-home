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
    embed = find_id_from_label.embed
    es = find_id_from_label.es
    print("celery task get :", embed, es)
    book_list = find_book_list(label, embed, es)

    # DB에 결과 집어 넣고 return "Complete" / 사실 리턴 값 필요 없음...
    return book_list