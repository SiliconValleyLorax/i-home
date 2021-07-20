import time
from celery import Celery, current_task
from celery.result import AsyncResult

celery = Celery('tasks', backend="rpc://", broker='amqp://rabbitmq:rabbitmq@rabbit:5672')

def get_job(task_id):
    """
    return celery job from task id
    """
    return AsyncResult(task_id, app=celery)

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
    time.sleep(3)
    return "bear moon"

@celery.task()
def find_id_from_label(label):
    """
    str(label) -> list[Integer](idx list)
    """
    time.sleep(3)
    return [[51], [18], [24], [1], [5]]