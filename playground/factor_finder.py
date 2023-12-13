import math
from flask import Blueprint, request, render_template

ff = Blueprint("factor_finder", __name__, template_folder="templates")


@ff.route("/factor-finder", methods=["GET", "POST"])
def factor_finder():
    if request.method == "POST":
        results = {}
        results["error"] = False
        number = None
        try:
            number = int(request.form["factor"])
        except ValueError:
            results["error"] = True
            render_template("bbospp/factorfinder.html.jinja", results=results)

        factors = []
        for i in range(1, int(math.sqrt(number)) + 1):
            if number % i == 0:
                factors.append(i)
                factors.append(number // i)

        factors = sorted(factors)

        prime = True if len(factors) == 2 else False

        factors_str = [str(i) for i in factors]

        results["factors"] = ", ".join(factors_str)
        results["total_factors"] = len(factors)
        results["number"] = number
        results["prime"] = prime

        return render_template("bbospp/factorfinder.html.jinja", results=results)

    return render_template("bbospp/factorfinder.html.jinja")
