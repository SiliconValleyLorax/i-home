# Pull latest official node image
FROM node:latest

# Set working directory
# EXPOSE 3000

WORKDIR /frontend
COPY . /frontend

# Make variable API_URL to put uri into url
# uri 변수 형태로 받아서 url에 넣어 작동하도록 함
ARG API_URL
ENV REACT_APP_HOST_IP_ADDRESS $API_URL


COPY . ./
ENV PATH /frontend/node_modules/.bin:$PATH
COPY package.json /frontend/package.json
COPY package-lock.json /frontend/package-lock.json


RUN npm install --silent
# RUN npm install react-scripts -g

# 개발용
CMD ["npm", "start"]

# 배포용
# RUN npm run build

