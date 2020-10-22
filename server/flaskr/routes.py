from flask import Blueprint
from flaskr.db import mongo

bp = Blueprint("routes", __name__)

@bp.route("/")
def test_bp_route():
    mongo.db.users.insert({'name': "Jay"})
    return 'Test Blueprint works!'