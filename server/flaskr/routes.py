from flask import Blueprint, render_template, abort, request, Response
from flask.json import jsonify
from jinja2 import TemplateNotFound
from flaskr.db import mongo
from werkzeug.security import check_password_hash, generate_password_hash
import os
from bson import json_util
from bson.objectid import ObjectId
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


environment = os.environ['FLASK_ENV']
if environment == "production":
    bp = Blueprint("routes", __name__, template_folder='../../client/build')
else:
    bp = Blueprint("routes", __name__)


@bp.route("/api/userThreat/<id>", methods=["PATCH"])
@jwt_required
def userThreat(id=None):
    print(request.json)
    try:
        req = request.get_json()
        print(req)

        updated = mongo.db.userThreats.update(
            { "_id" : ObjectId(id)},
            { "$set": req }
        )
        print(updated)

        if updated['ok']:
            return "Updated user threat status", 200
        else:
            return "No user status updated", 404
    except:
        return "Error", 500


@bp.route("/api/getAllThreats", methods=["GET"])
@bp.route("/api/getAllThreats/<num>", methods=["GET"])
@jwt_required
def getAllThreats(num=None):
    """
    Return Format:
    [
        {
            _id: ObjectId,
            detectionDate: Str,
            status: ['active', 'contained', 'false'],
            name: Str
            email: Str:
            role: Str,
            department: Str,
            last_activity_date: Str,
            phone: Str
        },
        ...
    ]
    """
    try: 
        threats = list(mongo.db.userThreats.aggregate([
            {'$lookup': {
                'from': "employees",
                'localField': "user_id",
                'foreignField': "_id",
                'as': "fromItems"
            }},
            {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
            {'$project': { 'fromItems': 0 }},
            {'$sort': {'detectionDate': 1}}
        ]))

        if num:
            threats = threats[-num:]

        return Response(json_util.dumps(threats), mimetype='application/json'), 200

    except:
        return "There was an Error", 400


@bp.route("/api/getEmployees", methods=["GET"])
@bp.route("/api/getEmployees/<search>", methods=["GET"])
@jwt_required
def getEmployees(searchTerm=""):
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
            if threatContainmentRatio >= 0.8:
                rating = 'S'
            elif threatContainmentRatio >= 0.7:
                rating = 'A'
            elif threatContainmentRatio >= 0.6:
                rating = 'B'
            elif threatContainmentRatio >= 0.4:
                rating = 'C'
            elif threatContainmentRatio >= 0.3:
                rating = 'D'
            elif threatContainmentRatio >= 0.2:
                rating = 'E'
            else:
                rating = 'F'

        return json_util.dumps(rating) , 200
    return "Could not get security rating", 400