from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)

with app.app_context():
    result = db.engine.execute('PRAGMA table_info(task)')
    for row in result:
        print(row)

