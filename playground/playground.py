from flask import render_template
from flask import Blueprint

play = Blueprint("playground", __name__)


@play.route("/")
def home():
    return render_template("home.html.jinja")


@play.route("/about")
def about():
    return render_template("about.html.jinja")


@play.route("/contact")
def contact():
    return render_template("contact.html.jinja")
