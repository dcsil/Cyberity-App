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
    if environment == "production":
        app = Flask(__name__, static_folder='../../client/build',
                    instance_relative_config=True)
    else:
        app = Flask(__name__, instance_relative_config=True)

    #CORS(app)
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)
    app.config['SECRET_KEY'] = '11152020bOBrOSsScYbEriTY'
    app.config["JWT_SECRET_KEY"] = "BAfASFBasf9bblkjnGYAGIfa@&b332"
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_SECURE'] = False
    app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'
    app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/refreshtoken/'
    app.config['JWT_COOKIE_CSRF_PROTECT'] = True


    JWTManager(app)
    # Initalize MongoDB
    mongo_uri = os.getenv("MONGO_URI", None)
    if not mongo_uri:
        mongo_uri = "mongodb://localhost:27017/myDatabase"
    mongo = db.mongo
    mongo.init_app(app, mongo_uri)

    # Register Blueprints
    app.register_blueprint(routes.bp)

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.route('/testdb')
    def testdb():
        mongo.db.users.insert({'name': "Mark2.0"})
        return "Inserted"

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app


    