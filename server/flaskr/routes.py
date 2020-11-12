from flask import Blueprint, render_template, abort, request
from flask.json import jsonify
from jinja2 import TemplateNotFound
from flaskr.db import mongo
from werkzeug.security import check_password_hash, generate_password_hash
import os

environment = os.environ['FLASK_ENV']
if environment == "production":
    bp = Blueprint("routes", __name__, template_folder='../../client/build')
else:
    bp = Blueprint("routes", __name__)

# @bp.route("/")
# def test_bp_route():
#     mongo.db.users.insert({'name': "Jay"})
#     try:
#         return render_template('index.html')
#     except TemplateNotFound:
#         abort(404)

@bp.route('/api/register', methods=('GET', 'POST'))
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        name = request.form['name']
        email = request.form['email']

        if (not username) or (not password) or (not name) or (not email):
            return "Missing information", 400
        if mongo.db.users.find_one({'username': username}):
            return "User {} Already Exists".format(username), 403
        mongo.db.users.insert({'username': username, 'password': generate_password_hash(password), 'name': name, 'email': email})
        return "User successfully created", 201
    return "Could not register,", 400

@bp.route('/api/signin', methods=('GET', 'POST'))
def signin():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = mongo.db.users.find_one({'username': username})
        if user:
            if check_password_hash(user['password'], password):
                return "signin successfull", 200
        return "Incorrect credentials", 403
    return "Could not signin,", 400