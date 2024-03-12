from flask import render_template
from flask import Blueprint
import markdown
from os.path import join, dirname, realpath

play = Blueprint("playground", __name__, template_folder="templates")


@play.route("/")
def home():
    return render_template("pages/home.html.jinja")


@play.route("/about")
def about():
    about_path = join(dirname(realpath(__file__)), "static/content/about.md")
    with open(about_path, encoding="utf-8") as f:
        text = f.read()
    html = markdown.markdown(text)
    results = {"html": html, "title": "About"}
    return render_template("pages/base_page.html.jinja", results=results)
