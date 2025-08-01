from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import ark_hasher
import secrets
from datetime import datetime, timedelta
import mysql.connector

# Create blueprint
credentials_bp = Blueprint('credentials', __name__)

DB_CONFIG = {
    'host': 'localhost',
    'user': 'ArkUser',
    'password': 'HeRman40513212!?',
    'database': 'ArkControllerData'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

def verify_password(password, hash):
    try:
        return ark_hasher.PasswordHasher.verify_password(password, hash)
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

    if username and password and not session_key:
        if connection:
            cursor = connection.cursor()
            cursor.execute("SELECT id, username, password_hash FROM users WHERE username = %s", (username,))
            user = cursor.fetchone()
            
            if user and verify_password(password, user[2]):
                user_id = user[0]
                session_key = generate_session_key()
                expires_at = datetime.now() + timedelta(minutes=15)

                cursor.execute("SELECT user_id FROM user_sessions WHERE user_id = %s", (user_id,))
                existing_session = cursor.fetchone()
                if existing_session:
                    cursor.execute("UPDATE user_sessions SET session_key = %s, expires_at = %s WHERE user_id = %s", (session_key, expires_at, user_id))
                else:
                    cursor.execute("INSERT INTO user_sessions (user_id, session_key, expires_at) VALUES (%s, %s, %s)", (user_id, session_key, expires_at))

                connection.commit()

                cursor.close()
                connection.close()
                return jsonify({"status": 1, "session_key": session_key}), 200
            else:
                return jsonify({"status": 0, "message": "Invalid credentials"}), 401
        else:
            return jsonify({"status": 0, "message": "Database connection error"}), 500
    elif session_key:
        if connection:
            cursor = connection.cursor()
            cursor.execute("SELECT user_id FROM user_sessions WHERE session_key = %s AND expires_at > NOW()", (session_key,))
            data = cursor.fetchone()

            if data:
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
    CORS(app, origins=['http://localhost:3000', 'https://www.darkyon.com'])
    app.register_blueprint(credentials_bp)
    return app

# For standalone testing
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)