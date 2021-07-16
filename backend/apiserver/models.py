from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Sequence, Integer, DateTime, TIMESTAMP
# from sqlalchemy.sql import func
# from sqlalchemy.types import TIMESTAMP
from datetime import datetime
# db = SQLAlchemy()
from app import db
class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, Sequence('books_id_seq'), primary_key=True)
    title = db.Column(db.String(), nullable=False)
    author = db.Column(db.String(), nullable=False)
    img_url = db.Column(db.String(), nullable=False)
    desc = db.Column(db.String())
    created_at = db.Column(db.TIMESTAMP, index=True, default=datetime.now)
    updated_at =db.Column(db.TIMESTAMP, index=True, default=datetime.now, onupdate=datetime.now)
    def __init__(self, title, author, img_url, desc):
        # self.id = id
        self.title = title
        self.author = author
        self.img_url = img_url
        self.desc = desc
    def __repr__(self):
        return f"<Book: {self.title}>"