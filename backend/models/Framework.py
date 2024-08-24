from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from ..config import db


class FrameWorks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    Framework = db.Column(db.String(30), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at,
            'FrameWork': self.Framework
        }
