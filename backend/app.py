from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


from datetime import datetime

from backend.config import db
from backend.prefix import app
from backend.models.Framework import FrameWorks


# Define the Task model


# Create the database tables
with app.app_context():
    db.create_all()

# Define routes for CRUD operations


@app.route('/frameworks', methods=['GET'])
def get_tasks():
    tasks = FrameWorks.query.all()
    return jsonify([task.to_dict() for task in tasks])


@app.route('/frameworks', methods=['POST'])
def add_task():
    data = request.get_json()

    new_task = FrameWorks(
        name=data.get('name'),
        Framework=data.get('Framework')
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201


@app.route('/frameworks/<int:fwid>', methods=['PUT'])
def update_name(fwid):
    try:
        data = request.get_json()
        name = data.get('name')
        item = db.session.query(FrameWorks).get(fwid)
        item.name = name
        db.session.commit()
        return jsonify(item.to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/frameworks/<int:fwid>', methods=['DELETE'])
def delete_framework(fwid):
    try:
        item = db.session.query(FrameWorks).get(fwid)
        if not item:
            return jsonify({'message': 'Item not found'}), 404
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        db.session.close()


if __name__ == '__main__':
    app.run(debug=True)
