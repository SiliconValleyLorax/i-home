# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.8

EXPOSE 8000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

WORKDIR /modelserver
COPY requirements.txt /modelserver/

RUN pip install --upgrade pip
RUN pip install -r requirements.txt


COPY . /modelserver/

CMD ["python", "app.py"]
