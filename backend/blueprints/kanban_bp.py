from flask import Blueprint
from backend.models.Kanban import Kanban
from backend.models.Framework import FrameWorks

from backend.config import db
from flask import Flask, request, jsonify
from flask_cors import CORS


kanban_bp = Blueprint('kanban', __name__)
CORS(kanban_bp)


@kanban_bp.route('/<int:fwid>', methods=['GET'])
def getTasks(fwid):
    item = db.session.query(FrameWorks).get(fwid)
    if (not item):
        return jsonify({'message': 'Item not found'}), 404
    tasks = db.session.query(Kanban).filter(Kanban.Fwid == fwid).all()
    response_data = {
        'name': item.name,
        'tasks': [task.to_dict() for task in tasks]
    }
    print(jsonify([task.to_dict() for task in tasks]))
    print("Hello from Kanban")
    return jsonify(response_data)


@kanban_bp.route('/<int:fwid>', methods=['POST'])
def addTask(fwid):
    try:
        data = request.get_json()
        new_task = Kanban(
            name=data.get('name'),
            Fwid=data.get('fwid'),
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify(new_task.to_dict()), 201
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500


@kanban_bp.route('/status_update', methods=['PUT'])
def updateTask():
    try:
        data = request.get_json()
        task_id = data.get('id')
        item = db.session.query(Kanban).get(task_id)
        if not item:
            return jsonify({'message': 'Item not found'}), 404

        # Update the item's attributes
        item.status = data.get('status')
        # Commit the changes to the database
        db.session.commit()
        print(item)
        return jsonify(item.to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal server error'}), 500


@kanban_bp.route('/update_name', methods=['PUT'])
def updateName():
    try:
        data = request.get_json()
        task_id = data.get('id')
        item = db.session.query(Kanban).get(task_id)
        if not item:
            return jsonify({'message': 'Item not found'}), 404

        # Update the item's attributes
        item.name = data.get('name')
        # Commit the changes to the database
        db.session.commit()
        print(item)
        return jsonify(item.to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal server error'}), 500


@kanban_bp.route('/delete_task/<int:task_id>', methods=['DELETE'])
def deleteTask(task_id):
    try:
        item = db.session.query(Kanban).get(task_id)
        if not item:
            return jsonify({'message': 'Item not found'}), 404
        db.session.delete(item)
        # Commit the changes to the database
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        # Rollback the session in case of an error
        db.session.rollback()
        print(e)
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        # Optional: Ensure the session is always closed
        db.session.close()


@kanban_bp.route('/delete_framework/<int:fwid>', methods=['DELETE'])
def deleteFramework(fwid):
    try:
        # Attempt to delete rows
        db.session.query(Kanban).filter(Kanban.Fwid == fwid).delete()
        db.session.commit()
        return jsonify({'message': 'FW deleted successfully'}), 200

    except Exception as e:

        db.session.rollback()
        print(f"Error during delete: {e}")
        return jsonify({'error': 'Internal server error'}), 500
    finally:

        db.session.close()
