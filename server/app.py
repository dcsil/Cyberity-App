from flask import Flask, jsonify, request
import os
import boto3
import time
import random

# Get the service resource.
dynamodb = boto3.resource('dynamodb')
environment = os.environ['FLASK_ENV']

if environment == "development":
    app = Flask(__name__)
elif environment == "production":
    app = Flask(__name__, static_folder='frontend/build', static_url_path='/')

# Routes
@app.route('/api')
def home():
    if environment == "development":
        return "Hello world"
    elif environment == "production":
       return app.send_static_file('index.html')

