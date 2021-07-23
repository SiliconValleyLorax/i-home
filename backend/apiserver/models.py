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
    category = db.Column(db.String(), nullable=False)
    title = db.Column(db.String(), nullable=False)
    author = db.Column(db.String(), nullable=False)
    img_src = db.Column(db.String(), nullable=False)
    desc = db.Column(db.String())
    kr_slogran = db.Column(db.String())
    created_at = db.Column(db.TIMESTAMP, index=True, default=datetime.now)
    updated_at =db.Column(db.TIMESTAMP, index=True, default=datetime.now, onupdate=datetime.now)
    def __init__(self, category, title, author, img_src, desc, kr_slogran):
        # self.id = id
        self.category = category
        self.title = title
        self.author = author
        self.img_src = img_src
        self.desc = desc
        self.kr_slogran = kr_slogran
    def __repr__(self):
        return f"<Book: {self.title}>"
