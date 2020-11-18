from flask import Blueprint, render_template, abort, request, Response
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
@jwt_required
def getAllThreats():
    """
    Return Format:
    [
        {
            _id: ObjectId,
            detectionDate: Str,
            status: Str,
            name: Str
            email: Str:
            role: Str,
            department: Str,
            last_activity_date: Str,
            phone: Str,
            flagged: Bool
        },
        ...
    ]
    """
    try: 
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
        contained = mongo.db.containedThreats.aggregate([
            {'$lookup': {
                'from': "employees",
                'localField': "user_id",
                'foreignField': "_id",
                'as': "fromItems"
            }},
            {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
            { "$project": { 'fromItems': 0 }}
        ])

        return Response(json_util.dumps(list(active) + list(contained)), mimetype='application/json'), 200

    except:
        return "There was an Error", 400

@bp.route("/api/getEmployees", methods=["GET"])
@jwt_required
def getEmployees():
    """
    Return Format:
    [
        {
            _id: ObjectId,
            name: Str
            email: Str:
            role: Str,
            department: Str,
            last_activity_date: Str,
            phone: Str,
            flagged: Bool
        },
        ...
    ]
    """
    try:
        searchTerm = ""
        if request.json and 'searchTerm' in request.json:
            searchTerm = request.json['searchTerm']

        employees = list(mongo.db.employees.find({'name': {'$regex': searchTerm, '$options': 'i'}}))

        return Response(json_util.dumps(employees), mimetype='application/json'), 200
    
    except:
        return "There was an Error", 400


@bp.route('/api/register', methods=('GET', 'POST'))
def register():
    try: 
        if request.method == 'POST':
            if not all(k in request.json for k in ('username', 'password', 'name', 'email')):
                return "Missing parameters", 404

            username = request.json['username']
            password = request.json['password']
            name = request.json['name']
            email = request.json['email']

            if (username == '') or (password == '') or (name == '') or (email == ''):
                return "Missing/Incorrect Information", 422
            if mongo.db.users.find_one({'username': username}):
                return "Username Already Exists", 403
            mongo.db.users.insert_one({'username': username, 'password': generate_password_hash(password), 'name': name, 'email': email})
            return "User successfully created", 201
        return "Could not register", 400
    
    except:
        return "There was an Error", 400

@bp.route('/api/login', methods=('GET', 'POST'))
def login():
    try:
        if request.method == 'POST':
            if not all(k in request.json for k in ('username', 'password')):
                return "Missing parameters", 404

            username = request.json['username']
            password = request.json['password']

            user = mongo.db.users.find_one({'username': username})
            if user:
                if check_password_hash(user['password'], password):
                    token = create_access_token(identity=str(user['_id']))
                    return jsonify({"token": token}), 200
            return "Incorrect credentials", 403
        return "Could not login,", 400

    except:
        return "There was an Error", 400

@bp.route('/api/checkauth', methods=["GET"])
@jwt_required
def checkAuthentication():
    if request.method == 'GET':
        return "Success", 200
    return "Failure", 400

@bp.route('/api/truePositiveRate', methods=["GET"])
@jwt_required
def truePositiveRate():
    if request.method == 'GET':
        return "Success", 200
    return "Could not get true positive rate", 400

@bp.route('/api/numContainedThreats', methods=["GET"])
@jwt_required
def numContainedThreats():
    if request.method == 'GET':
        contained = mongo.db.containedThreats.aggregate([
            {'$lookup': {
                'from': "employees",
                'localField': "user_id",
                'foreignField': "_id",
                'as': "fromItems"
            }},
            {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
            { "$project": { 'fromItems': 0 }}
        ])
        return json_util.dumps(len(list(contained))), 200
    return "Could not get number of contained threats", 400

@bp.route('/api/numActiveThreats', methods=["GET"])
@jwt_required
def numActiveThreatsThreats():
    if request.method == 'GET':
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

        return json_util.dumps(len(list(active))), 200
    return "Could not get number of active threats", 400

@bp.route('/api/numTotalThreats', methods=["GET"])
@jwt_required
def numTotalThreats():
    if request.method == 'GET':
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

        contained = mongo.db.containedThreats.aggregate([
            {'$lookup': {
                'from': "employees",
                'localField': "user_id",
                'foreignField': "_id",
                'as': "fromItems"
            }},
            {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
            { "$project": { 'fromItems': 0 }}
        ])
        return json_util.dumps(len(list(active)) + len(list(contained))), 200
    return "Could not get number of total threats", 400


@bp.route('/api/securityRating', methods=["GET"])
@jwt_required
def securityRating():
    if request.method == 'GET':
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

        contained = mongo.db.containedThreats.aggregate([
            {'$lookup': {
                'from': "employees",
                'localField': "user_id",
                'foreignField': "_id",
                'as': "fromItems"
            }},
            {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
            { "$project": { 'fromItems': 0 }}
        ])
        numCT = len(list(contained))
        numLT = len(list(active))
        numTT = numLT + numCT
        rating = 'S'
        if numTT != 0:
            threatContainmentRatio = float(numCT) / float(numTT)
            if threatContainmentRatio >= 0.9:
                rating = 'S'
            elif threatContainmentRatio >= 0.8:
                rating = 'A'
            elif threatContainmentRatio >= 0.7:
                rating = 'B'
            elif threatContainmentRatio >= 0.6:
                rating = 'C'
            elif threatContainmentRatio >= 0.5:
                rating = 'D'
            elif threatContainmentRatio >= 0.4:
                rating = 'E'
            else:
                rating = 'F'

        return json_util.dumps(rating) , 200
    return "Could not get security rating", 400