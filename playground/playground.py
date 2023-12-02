from flask import render_template
from flask import Blueprint

play = Blueprint("playground", __name__)


@play.route("/")
def home():
    return render_template("base.html")
