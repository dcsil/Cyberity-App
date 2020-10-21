from flask import Blueprint

bp = Blueprint("routes", __name__)

@bp.route("/")
def test_bp_route():
    return 'Test Blueprint works!'