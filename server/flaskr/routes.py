from flask import Blueprint, render_template, abort, request, Response
from flask.helpers import total_seconds
from flask.json import jsonify
from jinja2 import TemplateNotFound
from flaskr.db import mongo
from werkzeug.security import check_password_hash, generate_password_hash
import os
from bson import json_util
from bson.objectid import ObjectId
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies
)

environment = os.environ['FLASK_ENV']
if environment == "production":
    bp = Blueprint("routes", __name__, template_folder='../../client/build')
else:
    bp = Blueprint("routes", __name__)

@bp.route("/api/userThreat/<id>", methods=["PATCH"])
@jwt_required
def userThreat(id=None):
    try:
        req = request.get_json()

        updated = mongo.db.userThreats.update(
            { "_id" : ObjectId(id)},
            { "$set": req }
        )

        if updated['ok']:
            return "Updated user threat status", 200
        else:
            return "No user status updated", 404
    except:
        return "Error", 500

@bp.route("/api/getAllThreats", methods=["GET"])
@bp.route("/api/getAllThreats/<int:num>", methods=["GET"])
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
        if num:
            threats = list(mongo.db.userThreats.aggregate([
                {'$lookup': {
                    'from': "employees",
                    'localField': "user_id",
                    'foreignField': "_id",
                    'as': "fromItems"
                }},
                {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
                {'$project': { 'fromItems': 0 }},
                {'$sort': {'detectionDate': -1}},
                { "$limit" : num}
            ]))
        else:
            threats = list(mongo.db.userThreats.aggregate([
                {'$lookup': {
                    'from': "employees",
                    'localField': "user_id",
                    'foreignField': "_id",
                    'as': "fromItems"
                }},
                {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
                {'$project': { 'fromItems': 0 }},
                {'$sort': {'detectionDate': -1}},
            ]))
        return Response(json_util.dumps(threats), mimetype='application/json'), 200

    except:
        return "There was an Error", 400

@bp.route('/api/getFalseThreats', methods=["GET"])
@bp.route("/api/getFalseThreats/<int:num>", methods=["GET"])
@jwt_required
def getFalseThreats(num=None):
    try:
        if request.method == 'GET':
            if num:
                false = list(mongo.db.userThreats.aggregate([
                    {'$lookup': {
                        'from': "employees",
                        'localField': "user_id",
                        'foreignField': "_id",
                        'as': "fromItems"
                    }},
                    {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
                    {'$project': { 'fromItems': 0 }},
                    {'$sort': {'detectionDate': -1}},
                    { "$limit" : num},
                    {'$match' : {'status': "false"}}
                ]))
            else:
                false = list(mongo.db.userThreats.aggregate([
                    {'$lookup': {
                        'from': "employees",
                        'localField': "user_id",
                        'foreignField': "_id",
                        'as': "fromItems"
                    }},
                    {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
                    {'$project': { 'fromItems': 0 }},
                    {'$sort': {'detectionDate': -1}},
                    {'$match' : {'status': "false"}}
                ]))
            return Response(json_util.dumps(false), mimetype='application/json'), 200
        return "Could not get false threats", 400
    except:
        return "There was an Error", 400

@bp.route('/api/getActiveThreats', methods=["GET"])
@bp.route("/api/getActiveThreats/<int:num>", methods=["GET"])
@jwt_required
def getActiveThreats(num=None):
    try:
        if request.method == 'GET':
            if num:
                active = list(mongo.db.userThreats.aggregate([
                    {'$lookup': {
                        'from': "employees",
                        'localField': "user_id",
                        'foreignField': "_id",
                        'as': "fromItems"
                    }},
                    {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
                    {'$project': { 'fromItems': 0 }},
                    {'$sort': {'detectionDate': -1}},
                    { "$limit" : num},
                    {'$match' : {'status': "active"}}
                ]))
            else:
                active = list(mongo.db.userThreats.aggregate([
                    {'$lookup': {
                        'from': "employees",
                        'localField': "user_id",
                        'foreignField': "_id",
                        'as': "fromItems"
                    }},
                    {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
                    {'$project': { 'fromItems': 0 }},
                    {'$sort': {'detectionDate': -1}},
                    {'$match' : {'status': "active"}}
                ]))
            return Response(json_util.dumps(active), mimetype='application/json'), 200
        return "Could not get active threats", 400
    except:
        return "There was an Error", 400

@bp.route('/api/getContainedThreats', methods=["GET"])
@bp.route("/api/getContainedThreats/<int:num>", methods=["GET"])
@jwt_required
def getContainedThreats(num=None):
    try:
        if request.method == 'GET':
            if num:
                contained = list(mongo.db.userThreats.aggregate([
                    {'$lookup': {
                        'from': "employees",
                        'localField': "user_id",
                        'foreignField': "_id",
                        'as': "fromItems"
                    }},
                    {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
                    {'$project': { 'fromItems': 0 }},
                    {'$sort': {'detectionDate': -1}},
                    { "$limit" : num},
                    {'$match' : {'status': "contained"}}
                ]))
            else:
                contained = list(mongo.db.userThreats.aggregate([
                    {'$lookup': {
                        'from': "employees",
                        'localField': "user_id",
                        'foreignField': "_id",
                        'as': "fromItems"
                    }},
                    {'$replaceRoot': { 'newRoot': {'$mergeObjects': [ { '$arrayElemAt': [ "$fromItems", 0 ] }, "$$ROOT" ] } }},
                    {'$project': { 'fromItems': 0 }},
                    {'$sort': {'detectionDate': -1}},
                    {'$match' : {'status': "contained"}}
                ]))
            return Response(json_util.dumps(contained), mimetype='application/json'), 200
        return "Could not get contained threats", 400
    except:
        return "There was an Error", 400

@bp.route("/api/getEmployees", methods=["GET"])
@bp.route("/api/getEmployees/<string:search>", methods=["GET"])
@jwt_required
def getEmployees(search=""):
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
        employees = list(mongo.db.employees.find({'name': {'$regex': search, '$options': 'i'}}))
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
    
@bp.route('/api/refreshtoken/', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    try:
         # Create the new access token
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)

        # Set the access JWT and CSRF double submit protection cookies
        # in this response
        resp = jsonify({})
        set_access_cookies(resp, access_token)
        return resp, 200
    except :
        return "Could not login,", 400

@bp.route('/api/logout', methods=['POST'])
def logout():
    try:
        resp = jsonify({})
        unset_jwt_cookies(resp)
        return resp, 200
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
                    access_token = create_access_token(identity=str(user['_id']))
                    refresh_token = create_refresh_token(identity=str(user['_id']))
                    resp = jsonify({})
                    set_access_cookies(resp, access_token)
                    set_refresh_cookies(resp, refresh_token)
                    return resp, 200
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
    try:
        if request.method == 'GET':
            false_count = mongo.db.userThreats.count_documents({"status": "false"})
            total_count = mongo.db.userThreats.count_documents({})
            return json_util.dumps(float(total_count - false_count) / float(total_count)), 200
        return "Could not get true positive rate", 400
    except:
        return "There was an Error", 400

@bp.route('/api/numContainedThreats', methods=["GET"])
@jwt_required
def numContainedThreats():
    try:
        if request.method == 'GET':
            contained_count = mongo.db.userThreats.count_documents({"status":"contained"})
            return json_util.dumps(contained_count), 200
        return "Could not get number of contained threats", 400
    except:
        return "There was an Error", 400

@bp.route('/api/numActiveThreats', methods=["GET"])
@jwt_required
def numActiveThreatsThreats():
    try:
        if request.method == 'GET':
            active_count = mongo.db.userThreats.count_documents({"status":"active"})
            return json_util.dumps(active_count), 200
        return "Could not get number of active threats", 400
    except:
        return "There was an Error", 400

@bp.route('/api/numFalseThreats', methods=["GET"])
@jwt_required
def numFalseThreatsThreats():
    try:
        if request.method == 'GET':
            false_count = mongo.db.userThreats.count_documents({"status":"false"})
            return json_util.dumps(false_count), 200
        return "Could not get number of false positive threats", 400
    except:
        return "There was an Error", 400

@bp.route('/api/numTotalThreats', methods=["GET"])
@jwt_required
def numTotalThreats():
    try:
        if request.method == 'GET':
            total_count = mongo.db.userThreats.count_documents({})
            return json_util.dumps(total_count), 200
        return "Could not get number of total threats", 400
    except:
        return "There was an Error", 400

@bp.route('/api/securityRating', methods=["GET"])
@jwt_required
def securityRating():
    try:
        if request.method == 'GET':
            contained_count = mongo.db.userThreats.count_documents({"status":"contained"})
            total_count = mongo.db.userThreats.count_documents({})
            rating = 'S'
            if total_count != 0:
                threatContainmentRatio = float(contained_count) / float(total_count)
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

            return json_util.dumps(rating), 200
        return "Could not get security rating", 400
    except:
        return "There was an Error", 400