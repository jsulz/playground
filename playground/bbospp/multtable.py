from flask import Blueprint, render_template, request, Response
import tempfile
import csv

mtg = Blueprint("mult-table", __name__, template_folder="templates")


@mtg.route("/mult-table", methods=["GET", "POST"])
def table_generator():
    if request.method == "POST":
        MAX = 26
        results = {}
        rows = request.form["firstnumber"]
        columns = request.form["secondnumber"]

        try:
            rows = int(rows) + 1
            columns = int(columns) + 1
        except ValueError:
            results["error"] = True
            return render_template("bbospp/multtable.html.jinja", results=results)

        if columns > MAX or rows > MAX:
            results["error"] = True
            return render_template("bbospp/multtable.html.jinja", results=results)

        table = [[None for _ in range(columns)] for _ in range(rows)]
        for r in range(rows):
            for c in range(columns):
                table[r][c] = r * c

        results["table"] = table
        results["table_header"] = [i for i in range(columns)]
        results["rows"] = rows
        results["columns"] = columns

        return render_template("bbospp/multtable.html.jinja", results=results)

    return render_template("bbospp/multtable.html.jinja")


@mtg.route("/download-mult-table", methods=["POST"])
def download_generator():
    if request.method == "POST":
        rows = int(request.form["firstnumber"])
        columns = int(request.form["secondnumber"])

        table = [[None for _ in range(columns)] for _ in range(rows)]
        for r in range(rows):
            for c in range(columns):
                table[r][c] = r * c

        fp = tempfile.NamedTemporaryFile(mode="w+t")
        writer = csv.writer(fp, delimiter=",", quotechar='"')
        writer.writerows(table)
        fp.seek(0)
        return Response(
            fp,
            mimetype="text/csv",
            headers={
                "Content-disposition": "attachment; filename=download-mult-table.csv"
            },
        )
