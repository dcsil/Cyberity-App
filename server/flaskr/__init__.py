import os
from flask import Flask
from flask_pymongo import PyMongo
from flaskr import routes, db
#from flask_cors import CORS

def create_app(test_config=None):
    # create and configure the app    
    environment = os.environ['FLASK_ENV']
    if environment == "production":
        app = Flask(__name__, static_folder='../../client/build', 
                    static_url_path='/',
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

    # Initalize MongoDB
    mongo_uri = os.getenv("MONGO_URI", None)
    if not mongo_uri:
        mongo_uri = "mongodb://localhost:27017/myDatabase"
    mongo = db.mongo
    mongo.init_app(app, mongo_uri)

    # Register Blueprints
    app.register_blueprint(routes.bp)

    # a simple page that says hello
    @app.route('/api/hello', methods=['GET'])
    def hello():
        return 'Hello, World!'

    @app.route('/api/testdb', methods=['POST'])
    def testdb():
        mongo.db.users.insert({'name': "Mark2.0"})
        return "Inserted"


    return app