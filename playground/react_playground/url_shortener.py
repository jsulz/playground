from flask import Blueprint, render_template

url = Blueprint("url_shortener", __name__, template_folder="templates")


@url.route("/url-shortener", methods=["GET"])
def url_shortener():
    return render_template("react-playground/urlshortener.html.jinja")
