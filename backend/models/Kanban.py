from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from backend.config import db


class Kanban(db.Model):
    Fwid = db.Column(db.Integer, nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(30), default='To-Do')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at,
            'status': self.status,
            'Framework': self.Fwid
        }
