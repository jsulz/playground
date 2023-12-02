from random import randint
from datetime import datetime, timedelta
from collections import Counter
from flask import Blueprint, request, render_template

bp = Blueprint("birthday_paradox", __name__)


@bp.route("/birthday-paradox", methods=["GET", "POST"])
def birthday_paradox():
    if request.method == "POST":
        num_people = int(request.form["people"])

        total = 0
        count = {}
        random_birthdays = None
        random_trial = randint(0, 100000)
        for i in range(100000):
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

        return render_template("birthday.html", birthdays=total / 100000)

    return render_template("birthday.html")
