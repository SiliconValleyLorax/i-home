
import tensorflow.compat.v1 as tf1
import tensorflow_hub as hub
import pandas as pd
import time
import openpyxl
import json, os

from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from sqlalchemy.orm import sessionmaker, scoped_session
import datetime
from app import db, engine, cursor
tf1.compat.v1.disable_eager_execution()

class CursorByName():
    def __init__(self, cursor):
        self._cursor = cursor
    
    def __iter__(self):
        return self

    def __next__(self):
        row = self._cursor.__next__()

        return { description[0]: row[col] for col, description in enumerate(self._cursor.description) }

def default(o):
    if isinstance(o, (datetime.date, datetime.datetime)):
        return o.isoformat()

def find_book_list(label, embeddings, session, es, text_ph):
    
    def embed_text(text):
        vectors = session.run(embeddings, feed_dict={text_ph: text})
        return [vector.tolist() for vector in vectors]
    
    query=label
    query_vector=embed_text([query])[0]
    index_name="book_test"
    script_query={
        "script_score":{
            "query":{"match_all":{}},
            "script":{
                "source": "cosineSimilarity(params.query_vector, doc['text-vector']) + 1.0",
                "params": {"query_vector": query_vector}
            }
        }
    }
    search_start=time.time()
    response=es.search(
        index=index_name,
        body={
            "size": 5,
            "query":script_query,
            "_source": {"includes":["idx","title","description"]}
        }
    )
    result=[]
    search_time = time.time() - search_start
    print()
    print("{} total hits.".format(response["hits"]["total"]["value"]))
    print("search time: {:.2f} ms".format(search_time * 1000))
    for hit in response["hits"]["hits"]:
        print("id: {}, score: {}".format(hit["_id"], hit["_score"]))
        print(hit["_source"])
        print()
        tmp=[hit["_id"], hit["_score"],hit["_source"]]
        result.append(tmp)
    return result

def insert_book_list(session, embeddings, es, text_ph):
# 텍스트 임베딩 함수
    def embed_text(text):
        vectors = session.run(embeddings, feed_dict={text_ph: text})
        return [vector.tolist() for vector in vectors]

    cursor.execute("select * from books")
    # data = list(cursor.fetchall())
    data = []
    for row in CursorByName(cursor):
        data.append(json.loads(json.dumps(row, default=default)))
    
    index_name="book_test"
    if es.indices.exists(index=index_name):
        es.indices.delete(index=index_name)
    # 인덱스 생성
    es.indices.create(index=index_name, body={
        "mappings":{
            "properties":{
                "idx":{
                    "type" :"integer"
                },
                "title":{
                    "type": "keyword"
                },
                "description":{
                    "type":"text"
                },
                "text-vector":{
                    "type": "dense_vector",
                    "dims": 512
                }
            }
        }
    })
    # 데이터 집어넣기
    for i in range(len(data)):
        title = data[i]['title']
        try:
            description=data[i]['desc'].replace("\n"," ").replace("'",'').replace('"','').strip()
        except:
            description=""
        try:
            text_vector=embed_text([title+description])[0]
            doc={'idx':i+1,'title':title,'description':description, 'text-vector':text_vector}
        except:
            print('no data')
            print('마지막 인덱스', i)
            break
        es.index(index=index_name, id=i, body=doc)
        
    es.indices.refresh(index=index_name)

def initialize_book_list(es):
    print ("HTTP first_request")
    ## 텍스트 임베딩 모델 다운로드 
    print("Downloading pre-trained embeddings from tensorflow hub...")
    os.environ["TFHUB_CACHE_DIR"] = "/tmp/tfhub"
    embed = hub.load("./models/sentence-encoder/4")
    text_ph = tf1.placeholder(tf1.string)
    embeddings = embed(text_ph)
    print("Done.")

    ## tensorflow session 다운로드
    print("Creating tensorflow session...")
    session = tf1.Session()
    session.run(tf1.global_variables_initializer())
    session.run(tf1.tables_initializer())
    print("Done.")
    
    insert_book_list(session, embeddings, es, text_ph)

    return embeddings, session, text_ph
