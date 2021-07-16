# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.8

EXPOSE 5000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

WORKDIR /apiserver
COPY requirements.txt /apiserver/

RUN pip install --upgrade pip
RUN pip install -r requirements.txt


COPY . /apiserver/

# ENTRYPOINT ["flask"]
# CMD ["run", "--host", "0.0.0.0"]
CMD ["python", "app.py"]