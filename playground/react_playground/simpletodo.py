from flask import Blueprint, render_template

stodo = Blueprint("simpletodo", __name__, template_folder="templates")


@stodo.route("/simple-todo", methods=["GET"])
def simple_todo():
    return render_template("react-playground/simpletodo.html.jinja")
