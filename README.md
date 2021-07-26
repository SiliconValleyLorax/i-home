# README.md

## 00. Project Introduction

> **AI 가 찾아주는 아이의 취향과 그림책 추천 서비스  "iHome" 을 소개합니다.**

|   |   |
|---|---|
|![README/Splash_Screen.png](README/Splash_Screen.png)   | ![README/%EC%86%8C%EA%B0%9C_% alED%99%94%EB%A9%B4.png](README/%EC%86%8C%EA%B0%9C_%ED%99%94%EB%A9%B4.png)  |


### Needs

> 5~7세 아이들은 직접 프로필을 작성하는데에 어려움이 있어. 아이들의 정확한 취향을 파악하기 어렵다. 또한 아이들의 개인정보를 기반으로 추천시스템을 개발하기에 이미 수집된 데이터가 부족하기 때문에 Cold Start 문제가 발생할 수 있다. 따라서 **이미지 인식을 통한 취향 파악과 라벨을 기준으로 한 유사도 검색 및 추천 기능 도입**으로 으로 이 문제를 해결하려고 한다.

### Main **POC**

아이가 좋아하는 사물 (장난감, 장소)을 업로드 및 촬영하여

**1) 객체 (사물, 색감, 분위기) 를 추출하고
2)  유사도 검색을 통해** 

아이 취향에 알맞는 도서를 추천해주는 AI 서비스다.

![README/Untitled.png](README/Untitled.png)

---

## 01. Software Architecture

 

![README/Untitled%201.png](README/Untitled%201.png)

### AI

- Google Colab
- Tensorflow
- Object Detection : SSD

Google Colab 환경에서 Tensorflow로 모델을 학습 시켰습니다. 학습된 모델을 저장하여 flask 서버 상에서 api와 연결하여, object detection을 수행하고 label을 반환하는 프로세스입니다. Object Detection 모델은 SSD를 사용하였습니다. 

[ 객체 인식 예시 ]

|   |   |
|---|---|
|![README/Untitled%202.png](README/Untitled%202.png)  | ![README/Untitled%203.png](README/Untitled%203.png)  |



### Backend

- **Webserver : NGINX (middleware : gunicorn)**

가볍지만 높은 성능을 보이는 리버스 프록시 웹서버인 Nginx와 Flask와의 통신을 도와주는 Gunicorn 인터페이스를 사용하여 REST API통신을 하는 서버를 구축했습니다.

- **API Server / Model Server : Flask**

Python 기반의 가벼운 웹 프레임워크입니다. 최소한의 구조를 제공하고 복잡하지 않아서, 개발 시간을 단축할 수 있습니다. 저희는 백엔드 서버를 프론트엔드와 통신하는 API서버와, 객체 검출과 유사도 검색을 하는 등의 주요 기능을 수행하는 모델서버로 분리하였습니다. 이를 통해 서버의 부하를 줄이고, 마이크로 서비스 방식을 추구했습니다.

- **Database : PostgreSQL**

오픈소스 객체-관계형 데이터베이스 시스템(ORDBMS)으로 데이터 저장 및 관리에 사용합니다.

SQLAlchemy, Python 기반의 ORM(Object-relational mapping)으로 직접 SQL 쿼리문을 작성하지 않고 데이터를 처리합니다. API Server(Flask)에서 도서 데이터 스키마 정의, 데이터 삽입 및 조회에 사용하였습니다.

- **Message Broker / Worker : RabbitMQ, Worker**

- RabbitMQ

Python은 인터프리티 언어로, 싱글 스레드로 작동합니다. 이런 파이썬의 한계를 극복하기 위해 메세지 큐를 사용합니다.

- Celery

Python의 느린 속도를 보완하기 위해 비동기 작업을 위한 worker로 Celery를 사용합니다.

Celery의 Result Backend을 PostgreSQL로 설정합니다. 매 Task의 UUID를 생성해 Primary key로 지정하고 Task의 결과값인 추천 도서 목록의 인덱스를 함께 저장합니다. Frontend에서 Task의 결과가 PostgreSQL에 저장되는 시점까지 주기적으로 요청을 보내면 API Server로부터 쿼리의 결과를 반환받아 출력합니다.

이런 비동기 방식의 처리를 통해, 서버가 항상 응답이 가능한 상태가 유지되도록 합니다.

### Frontend

- **React**

각 페이지마다 사용자 응답에 따라 인터페이스를 변경시키기 위해 REACT 프레임워크를 사용했습니다. app.js를 기본 페이지로 두고 각각의 구현 페이지를 컴포넌트로 가져와 url 페이지 분기로 출력하는 형식입니다.

**[사용 라이브러리]**

**react-router-dom**
페이지 로딩 없이 페이지에 필요한 컴포넌트를 불러와 렌더링하는 라이브러리 react-router-dom을 사용하여 페이지를 구성했습니다.

**react-webcam**
모바일 뿐만 아니라 pc에서도 장난감 사진을 캡쳐하기 위해 pc용 웹캠 모듈을 사용했습니다.

**axios**
캡쳐한 장난감 사진 파일을 back으로 보내고, ai 검색 결과 책 목록 데이터를 response.data로 가져올 때 axios 라이브러리를 사용합니다.

### Search Engine

- **Elasticsearch ( Cosinesimilarity )**

Tensorflow의 universal-sentence-encoder를 사용해 책 리스트의 텍스트 메타 데이터를 벡터 값으로 변환 시켰습니다. 앞서 도출된 label 값을 임베딩하여, 엘라스틱서치에 벡터 값으로 변환된 라벨 값을 input으로 주고 cosine similarity 쿼리를 사용해, 유사도 검색을 수행했습니다. 

[TensorFlow Hub](https://tfhub.dev/google/universal-sentence-encoder/4)

### Container Virtualization & Deploy

- **Docker**

Docker Compose 파일을 통해 컨테이너를 구축하여 필요한 이미지를 통합적으로 개발하고 관리하였습니다.

- **NHN Cloud**

NHN 클라우드 서비스 Toast에서 인스턴스를 생성하여 도커를 설치하고, 컨테이너를 빌드해 해당 서비스를 배포하였습니다.

---

## 03. 팀원

[Untitled](https://www.notion.so/a9b2dfbbbab94fbb9a6f134e0c6a2a55)
