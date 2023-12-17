from flask import Blueprint, render_template, request

nsc = Blueprint("numbers", __name__, template_folder="templates")


@nsc.route("/numeral-system-converter", methods=["GET", "POST"])
def numerical_system_counter():
    if request.method == "POST":
        accepted = {"int", "bin", "oct", "hex"}
        results = {}
        if request.form["convert-from"] not in accepted:
            results["error"] = True
            return render_template("bbospp/numbers.html.jinja", results=results)
        if request.form["convert-to"] not in accepted:
            results["error"] = True
            return render_template("bbospp/numbers.html.jinja", results=results)

        convert = {"int": 10, "bin": 2, "oct": 8, "hex": 16}

        try:
            num = int(request.form["number"], convert[request.form["convert-from"]])
        except ValueError:
            results["error"] = True
            return render_template("bbospp/numbers.html.jinja", results=results)

        new_num = None

        if request.form["convert-to"] == "bin":
            new_num = f"{num:b}"
        elif request.form["convert-to"] == "oct":
            new_num = f"{num:o}"
        elif request.form["convert-to"] == "hex":
            new_num = f"{num:x}"
        elif request.form["convert-to"] == "int":
            new_num = str(num)

        results["convert_to"] = new_num
        results["convert_from"] = num

        return render_template("bbospp/numbers.html.jinja", results=results)

    return render_template("bbospp/numbers.html.jinja")
