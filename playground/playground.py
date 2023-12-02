from flask import Flask
from flask import request
from flask import render_template
from random import randint
from datetime import datetime, timedelta
import collections
import os

app = Flask(__name__)


@app.route("/")
def hello_world():
    print(request)
    return render_template("base.html")


@app.route("/birthday-paradox", methods=["GET", "POST"])
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
                random_birthdays = collections.Counter(birthdays)

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


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
