from flask import render_template, Blueprint

frc = Blueprint("first_react_component", __name__, template_folder="templates")


@frc.route("/first-react-component")
def first_component():
    return render_template("react-playground/playgroundsfirstcomponent.html.jinja")
