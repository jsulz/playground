from flask import request, render_template, Blueprint
import base64
from io import BytesIO
from matplotlib.figure import Figure
from random import randint

drs = Blueprint("dice_roll_simulator", __name__, template_folder="templates")


@drs.route("/million-dice-statistics", methods=["GET", "POST"])
def simulate():
    if request.method == "POST":
        results = {}
        MAX_SIDES = 20
        MAX_DICE = 10
        TRIALS = 1000000
        try:
            results["dice"] = int(request.form["dicecount"])
            results["sides"] = int(request.form["dicesides"])
        except ValueError:
            results["error"] = True
            render_template("bbospp/dice_roll_simulator.html.jinja", results=results)

        if results["dice"] > MAX_DICE or results["sides"] > MAX_SIDES:
            results["error"] = True
            render_template("bbospp/dice_roll_simulator.html.jinja", results=results)

        dice_rolls = {}

        common_roll = {"best": None, "count": -float("inf")}

        # Run the simulation, storing each roll result in the dict
        for _ in range(TRIALS + 1):
            roll = 0
            for _ in range(results["dice"]):
                roll += randint(1, results["sides"])
            if roll in dice_rolls:
                dice_rolls[roll] += 1
                if dice_rolls[roll] > common_roll["count"]:
                    common_roll["best"] = roll
                    common_roll["count"] = dice_rolls[roll]
            else:
                dice_rolls[roll] = 1

        common_roll["probability"] = common_roll["count"] / TRIALS
        common_roll["probability"] = f"{common_roll["probability"]:.2%}"

        results["trials"] = TRIALS
        results["best"] = common_roll
        results["chart_src"] = build_chart(dice_rolls, TRIALS)

        return render_template("bbospp/dice_roll_simulator.html.jinja", results=results)
    return render_template("bbospp/dice_roll_simulator.html.jinja")


def build_chart(data, trials):
    x_vals = [x / trials for x in list(data.values())]
    y_vals = list(data.keys())

    fig = Figure(figsize=(7,10))
    ax = fig.add_subplot()

    ax.barh(y_vals, x_vals, align="center", color="red")
    ax.set_yticks(y_vals, labels=y_vals)
    ax.invert_yaxis()
    ax.set_xlabel("Probability of Rolling")
    ax.set_ylabel("Dice Roll Values")

    buf = BytesIO()
    fig.savefig(buf, format="png", transparent=True)

    chart_data = base64.b64encode(buf.getbuffer()).decode("ascii")

    return f"data:image/png;base64,{chart_data}"
