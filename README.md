
## 00. Project Introduction

> **AI 가 찾아주는 아이의 취향과 그림책 추천 서비스  "iHome" 을 소개합니다.**

|  |  |
| --- | --- |
| ![README/Untitled.png](README/Untitled.png) | ![README/Untitled%201.png](README/Untitled%201.png) |



### Needs

" **데이터 셋 수집 어려움 "**

5~7세 아이들은 직접 프로필을 작성하는데에 어려움이 있어. 아이들의 정확한 취향을 파악하기 어렵다.

또한 아이들의 개인정보를 기반으로  추천시스템을 개발하기에 이미 수집된 데이터가 부족하기 때문에 Cold Start 문제가 발생할 수 있다.

따라서  **이미지 인식을 통한 취향 파악과 라벨을 기준으로 한 유사도 검색 및 추천 기능 도입**으로 으로 이 문제를 해결하려고 한다.

### Main **POC**

**아이가 좋아하는 사물 (장난감, 장소)을 업로드 및 촬영하여**

**1) 객체 (사물, 색감, 분위기) 를 추출하고
2)  유사도 검색을 통해 

아이 취향에 알맞는 도서를 추천해주는 AI 서비스다.**

![README/Untitled%202.png](README/Untitled%202.png)

---

## 01. Software Architecture

![README/Untitled%203.png](README/Untitled%203.png)

 

### AI

- Google Colab :
- Tensorflow
- Object Detection : SSD
- Text Embedding : universal-sentence-encoder

Google Colab 환경에서 Tensorflow로 모델을 학습 시켰습니다. 학습된 모델을 저장하여 flask 서버 상에서 api와 연결하여, object detection을 수행하고 label을 반환하는 프로세스입니다. Object Detection 모델은 SSD를 사용하였습니다. 

Tensorflow의 universal-sentence-encoder를 사용해 책 리스트의 텍스트 메타 데이터를 벡터 값으로 변환 시켰습니다. 앞서 도출된 label 값을 임베딩하여, 엘라스틱서치에 벡터 값으로 변환된 라벨 값을 input으로 주고 cosine similarity 쿼리를 사용해, 유사도 검색을 수행했습니다. 

[TensorFlow Hub](https://tfhub.dev/google/universal-sentence-encoder/4)

### Backend

- Webserver : NGINX (middleware : gunicorn)
- API Server : Flask
- Model Server : Flask
- Database : PostgreSQL
- Message Broker / Worker : RabbitMQ, Worker

### Frontend

- React

### Search Engine

- Elasticsearch ( Cosinesimilarity )

### Container Virtualization & Deploy

- Docker
- AWS / EC2

---

## 03. 팀원

- Frontend : 홍명주 김서연 (후반)
- Backend : 김하연 박지영
- AI : 한수아, 로빈
- DevOps: 김서연
