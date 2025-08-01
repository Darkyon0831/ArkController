from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import ark_hasher
import secrets

import mysql.connector

# Create blueprint
credentials_bp = Blueprint('credentials', __name__)

DB_CONFIG = {
    'host': 'localhost',
    'user': 'ArkUser',
    'password': 'HeRMan40513212!?',
    'database': 'ArkControllerData'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

def verify_pasword(password, hash):
    try:
        return ark_hasher.verify_password(password, hash)
    except Exception as e:
        print(f"Error verifying password: {e}")
        return False

def generate_session_key():
    return secrets.token_urlsafe(32)

@credentials_bp.route('/check_credentials', methods=['POST'])
def check_credentials():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    session_key = data.get('session_key')

    connection = get_db_connection()

    if username and password amd not session_key:
        if connection:
            cursor = connection.cursor()
            cursor.execute("SELECT id, username, password_hash FROM users WHERE username = %s", (username,))
            user = cursor.fetchone()
            
            if user and verify_password(password, user['password_hash']):
                # Valid credentials
                user_id = user['id']
                session_key = generate_session_key()
                expires_at = datetime.now() + timedelta(minutes=15)
                cursor.execute("INSERT INTO user_sessions (user_id, session_key, expires_at) VALUES (%s, %s, %s)", (user_id, session_key, expires_at))
                connection.commit()

                cursor.close()
                connection.close()
                return jsonify({"status": 1, "session_key": session_key}), 200
            else:
                return jsonify({"status": 0, "message": "Invalid credentials"}), 401
        else:
            return jsonify({"status": 0, "message": "Database connection error"}), 500
    elif session_key and username:
        if connection:
            cursor = connection.cursor()
            cursor.execute("SELECT session_key FROM user_sessions WHERE user_id = (SELECT id FROM users WHERE username = %s)", (username,))
            data = cursor.fetchone()

            if data[0] == session_key:
                cursor.close()
                connection.close()
                return jsonify({"status": 1, "message": "Session valid"}), 200
            else:
                cursor.close()
                connection.close()
                return jsonify({"status": 0, "message": "Invalid session"}), 401
        else:
            return jsonify({"status": 0, "message": "Database connection error"}), 500
    else:
        return jsonify({"status": 0, "message": "Invalid request"}), 400

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