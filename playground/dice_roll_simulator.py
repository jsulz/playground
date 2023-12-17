from flask import render_template, Blueprint

drs = Blueprint("dice_roll_simulator", __name__, template_folder="templates")


@drs.route("/million-dice-statistics", methods=["GET", "POST"])
def simulate():
    return render_template("bbospp/dice_roll_simulator.html.jinja")
