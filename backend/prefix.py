from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from backend.config import app
from backend.blueprints.kanban_bp import kanban_bp

app.register_blueprint(kanban_bp, url_prefix='/kanban')
