from flask import Blueprint, render_template, abort, request
from flask.json import jsonify
from jinja2 import TemplateNotFound
from flaskr.db import mongo
from werkzeug.security import check_password_hash, generate_password_hash
import os
from bson import json_util
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


environment = os.environ['FLASK_ENV']
if environment == "production":
    bp = Blueprint("routes", __name__, template_folder='../../client/build')
else:
    bp = Blueprint("routes", __name__)


@bp.route("/api/getAllThreats", methods=["GET"])
def getAllThreats():
    active = mongo.db.activeThreats.aggregate([
        {'$lookup': {
            'from': "employees",
            'localField': "user_id",
            'foreignField': "_id",
            'as': "fromItems"
        }},
        {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
        { "$project": { 'fromItems': 0 }}
    ])

    contained = mongo.db.contianedThreats.aggregate([
        {'$lookup': {
            'from': "employees",
            'localField': "user_id",
            'foreignField': "_id",
            'as': "fromItems"
        }},
        {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
        { "$project": { 'fromItems': 0 }}
    ])

    return json_util.dumps(list(active) + list(contained))


@bp.route("/api/getEmployees", methods=["GET"])
def getEmployees():
    searchTerm = ""
    if request.json and 'searchTerm' in request.json:
        searchTerm = request.json['searchTerm']

    employees = list(mongo.db.employees.find({'name': {'$regex': searchTerm, '$options': 'i'}}))

    return json_util.dumps(employees), 200


@bp.route('/api/register', methods=('GET', 'POST'))
def register():
    if request.method == 'POST':
        username = request.json['username']
        password = request.json['password']
        name = request.json['name']
        email = request.json['email']

        if (username == '') or (password == '') or (name == '') or (email == ''):
            return "Missing/Incorrect Information", 422
        if mongo.db.users.find_one({'username': username}):
            return "Username Already Exists", 403
        mongo.db.users.insert({'username': username, 'password': generate_password_hash(password), 'name': name, 'email': email})
        return "User successfully created", 201
    return "Could not register", 400

@bp.route('/api/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        username = request.json['username']
        password = request.json['password']
        user = mongo.db.users.find_one({'username': username})
        if user:
            if check_password_hash(user['password'], password):
                token = create_access_token(identity=str(user['_id']))
                return jsonify({"token": token}), 200
        return "Incorrect credentials", 403
    return "Could not login,", 400

@bp.route('/api/checkauth', methods=["GET"])
@jwt_required
def checkAuthentication():
    if request.method == 'GET':
        return "Success", 200
    return "Failure", 400
