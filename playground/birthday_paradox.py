from random import randint
from datetime import datetime, timedelta
from collections import Counter
import base64
from io import BytesIO
from flask import Blueprint, request, render_template
from matplotlib.figure import Figure

bp = Blueprint("birthday_paradox", __name__, template_folder="templates")


@bp.route("/birthday-paradox", methods=["GET", "POST"])
def birthday_paradox():
    """Handles the form post and runs a series of trials to get a probability.

    Returns:
        template: A template response.
    """
    if request.method == "POST":
        num_people = None
        results = {}
        try:
            num_people = int(request.form["people"])
        except ValueError:
            results["error"] = True
            return render_template("bbospp/birthday.html.jinja", results=results)

        results["people"] = num_people
        results["error"] = False

        total = 0
        count = {}
        random_birthdays = None
        trials = 100000
        random_trial = randint(0, trials)
        for i in range(trials):
            # Set up a year starting at January 1st
            this_year = datetime(year=2023, month=1, day=1)
            birthdays = []
            trial_count = 0

            # For however many birthdays we need to create
            for _ in range(num_people):
                # Create a randomly generated offset and add it to the year and save it
                day_offset = randint(0, 365)
                offset = timedelta(days=day_offset)
                birthday = this_year + offset
                birthdays.append(birthday)

            if i == random_trial:
                random_birthdays = Counter(birthdays)

            shared_birthdays = set()
            shared_birthday = False

            # Look at each birthday in the array
            for birthday in birthdays:
                # If a birthday is already in the set, then there is a shared birthday
                if birthday in shared_birthdays:
                    shared_birthday = True
                    trial_count += 1
                else:
                    shared_birthdays.add(birthday)

            if trial_count in count:
                count[trial_count] += 1
            else:
                count[trial_count] = 0

            if shared_birthday:
                total += 1

        probability = f"{total / trials:.2%}"
        count = dict(sorted(count.items()))
        chart_src = build_chart(count)

        results["trials"] = trials
        results["total"] = total
        results["people"] = num_people
        results["probability"] = probability
        results["chart_src"] = chart_src

        return render_template("bbospp/birthday.html.jinja", results=results)

    return render_template("bbospp/birthday.html.jinja")


def build_chart(data):
    """Creates a bar chart ths shows the count of shared birthdays
    as a function of the number of trials.

    Args:
        data (dict): Shows a count:trials pairing for birthdays

    Returns:
        bytes: Chart data to return in an image.
    """
    y_vals = list(data.keys())
    x_vals = list(data.values())

    fig = Figure(figsize=(7, 5))
    ax = fig.add_subplot()

    ax.barh(y_vals, x_vals, align="center", color="red")
    ax.set_yticks(y_vals, labels=y_vals)
    ax.invert_yaxis()
    ax.set_xlabel("Number of Trials")
    ax.set_ylabel("Number of Shared Birthdays")

    buf = BytesIO()
    fig.savefig(buf, format="png", transparent=True)

    chart_data = base64.b64encode(buf.getbuffer()).decode("ascii")

    return f"data:image/png;base64,{chart_data}"
