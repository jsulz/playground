from flask import render_template
from flask import Blueprint
import markdown

play = Blueprint("playground", __name__, template_folder="templates")


@play.route("/")
def home():
    return render_template("pages/home.html.jinja")


@play.route("/about")
def about():
    with open("static/content/about.md", encoding="utf-8") as f:
        text = f.read()
    html = markdown.markdown(text)
    results = {"html": html}
    print(results)
    return render_template("pages/about.html.jinja", results=results)
