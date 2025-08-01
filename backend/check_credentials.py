from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS

# Create blueprint
credentials_bp = Blueprint('credentials', __name__)

@credentials_bp.route('/check_credentials', methods=['GET'])
def check_credentials():
    username = request.args.get('username')
    password = request.args.get('password')
    session_key = request.args.get('session_key')
    
    if username and password:
        if username == "admin" and password == "password":
            return jsonify({"status": "success", "session_key": "abc123"})
        else:
            return jsonify({"status": "error", "message": "Invalid credentials"})
    elif session_key:
        return jsonify({"status": "valid", "session_key": session_key})
    else:
        return jsonify({"status": "error", "message": "Missing parameters"})

@credentials_bp.route('/favicon.ico')
def favicon():
    return '', 204

# Create app for standalone testing
def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(credentials_bp)
    return app

# For standalone testing
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)