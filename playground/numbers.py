from flask import Blueprint, render_template, request

nsc = Blueprint("numbers", __name__, template_folder="templates")


@nsc.route("/numeral-system-converter", methods=["GET", "POST"])
def numerical_system_counter():
    print(request.method)
    return render_template("bbospp/numbers.html.jinja")
