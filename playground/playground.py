from flask import render_template
from flask import Blueprint

play = Blueprint("playground", __name__, template_folder="templates")


@play.route("/")
def home():
    return render_template("pages/home.html.jinja")


@play.route("/about")
def about():
    return render_template("pages/about.html.jinja")


@play.route("/first-react-component")
def first_component():
    return render_template("react-playground/playgroundsfirstcomponent.html.jinja")
