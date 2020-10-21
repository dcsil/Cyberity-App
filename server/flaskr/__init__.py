import os
from flask import Flask
from flask_pymongo import PyMongo
from flaskr import routes


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # Setup MongoDB
    mongo_uri = os.getenv("MONGO_URI", None):
    if not mongo_uri:
        mongo_uri =  "mongodb://localhost:27017/myDatabase"
    app.config["MONGO_URI"] = mongo_uri
    mongo = PyMongo(app)

    # Register Blueprints
    app.register_blueprint(routes.bp)

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.route('/testdb')
    def testdb():
        mongo.db.users.insert({'name': "Mark"})
        return "Inserted"

    return app