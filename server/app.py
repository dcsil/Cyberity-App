from flask import Flask
import os
import boto3


if environment == "development":
    app = Flask(__name__)
elif environment == "production":
    app = Flask(__name__, static_folder='../client/build', static_url_path='/')

# Routes
@app.route('/api')
def home():
    if environment == "development":
        return "Hello world"
    elif environment == "production":
        return app.send_static_file('index.html')