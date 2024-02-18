from flask import Blueprint, render_template

netflix = Blueprint("netflix", __name__, template_folder="templates")


@netflix.route("/netflix", methods=["GET"])
def netflix_home():
    return render_template("/react-playground/netflix.html.jinja")
