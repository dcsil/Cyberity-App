from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound
from flaskr.db import mongo
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