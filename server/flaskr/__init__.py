import os
from flask import Flask, send_from_directory
from flask_pymongo import PyMongo
from flaskr import routes, db
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies
)
from datetime import timedelta

def create_app(test_config=None):
    # create and configure the app    
    environment = os.environ['FLASK_ENV']
    cookie_prod = os.environ['COOKIE_PROD']
    mongo_uri = os.getenv("MONGO_URI", None)
    if environment == "production":
        app = Flask(__name__, static_folder='../../client/build',
                    instance_relative_config=True)
    else:
        app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    app.config['SECRET_KEY'] = '11152020bOBrOSsScYbEriTY'
    app.config["JWT_SECRET_KEY"] = "BAfASFBasf9bblkjnGYAGIfa@&b332"
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    if os.environ['COOKIE_PROD'] == "production":
        app.config['JWT_COOKIE_SECURE'] = True
    else:
        app.config['JWT_COOKIE_SECURE'] = False
    app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'

    JWTManager(app)
    if not mongo_uri:
        mongo_uri = "mongodb://localhost:27017/myDatabase"
    mongo = db.mongo
    mongo.init_app(app, mongo_uri)
    app.register_blueprint(routes.bp)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app