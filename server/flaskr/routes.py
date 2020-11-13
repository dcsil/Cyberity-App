from flask import Blueprint, render_template, abort, request
from jinja2 import TemplateNotFound
from flaskr.db import mongo
import os
from bson import json_util

environment = os.environ['FLASK_ENV']
if environment == "production":
    bp = Blueprint("routes", __name__, template_folder='../../client/build')
else:
    bp = Blueprint("routes", __name__)

@bp.route("/api/getEmployees", methods=["GET"])
def test_bp_route():
    searchTerm = ""
    print("This is the request *********:", request.json)
    if request.json and 'searchTerm' in request.json:
        searchTerm = request.json['searchTerm']

    employees = list(mongo.db.employees.find({'name': {'$regex': searchTerm, '$options': 'i'}}))

    print("these are the employees\n", employees)
    return json_util.dumps(employees)