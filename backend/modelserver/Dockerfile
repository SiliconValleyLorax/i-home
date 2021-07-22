# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.7

EXPOSE 7000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

WORKDIR /modelserver
COPY requirements.txt /modelserver/

RUN pip install --upgrade pip
RUN pip install -r requirements.txt


COPY . /modelserver/

# 개발용
CMD ["python", "wsgi.py"]
