#!/usr/bin/python3
from flask import Flask

import sys
import os

# Add your project directory to Python path
sys.path.insert(0, "/var/www/html/ArkController/backend/")
sys.path.insert(0, "/var/www/html/ArkController/backend/venv/lib/python3.10/site-packages")

from check_credentials import credentials_bp

main_app = Flask(__name__)

main_app.register_blueprint(credentials_bp)

application = main_app