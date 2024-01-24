from flask import render_template, Blueprint

ds = Blueprint("distribution_series", __name__, template_folder="templates")


@ds.route("/gaussian")
def gaussian():
    return render_template("react-playground/gaussian.html.jinja")
