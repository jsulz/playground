from flask import Blueprint, render_template, request, make_response, jsonify
import pandas as pd
import datetime
from dateutil import tz
import calendar

netflix = Blueprint(
    "netflix", __name__, template_folder="templates", static_folder="../static"
)


@netflix.route("/netflix", methods=["GET"])
def netflix_home():
    return render_template("/react-playground/netflix.html.jinja")


@netflix.route("/netflix/api/v1/deepdive", methods=["GET"])
def netflix_data():
    MAX_YEAR = 2024
    if request.method == "GET":
        try:
            start_year = int(request.args["start_year"])
        except KeyError:
            start_year = 2009
        except ValueError:
            return make_response(
                jsonify({"Error": "start_year must be an integer"}), 400
            )

        if start_year > MAX_YEAR:
            return make_response(
                jsonify({"Error": "start_year cannot be after 2024"}), 400
            )

        # Load the DF with the proper rows based on the start_year
        pst = tz.gettz("America/Los_Angeles")
        start = datetime.datetime(year=start_year, month=1, day=1, tzinfo=pst)
        df = pd.read_csv(netflix.static_folder + "/datafiles/netflix_cleaned_data.csv")
        df["Start Time"] = pd.to_datetime(df["Start Time"], utc=True)
        df["PST Start Time"] = pd.to_datetime(df["PST Start Time"], utc=False)
        df = df[df["PST Start Time"] > start]

        # The final response object
        final = {}

        # Get totals information
        totals = [
            {"title": "Movies + Episodes Watched", "count": df["Title"].nunique()},
            {"title": "Hours Watched", "count": df["Duration"].sum()},
        ]
        final["totals"] = totals

        # Get byTimePeriod information
        time_spent_by = {}
        periods = ["Year", "Day", "Month"]
        for period in periods:
            curr_arr = time_spent_by_helper(df, period)
            key_str = "by" + period
            time_spent_by[key_str] = curr_arr

        final["timeSpentBy"] = time_spent_by

        return make_response(jsonify(final))
    return make_response(jsonify({"Error": "Not allowed"}), 405)


def time_spent_by_helper(df, period):
    grouping = df.groupby(period)[["Duration"]].sum().to_dict()["Duration"]
    period_arr = []
    for curr_period, duration in grouping.items():
        if period == "Month":
            curr_period = calendar.month_name[curr_period]
        period_obj = {"name": curr_period, "hours": duration}
        period_arr.append(period_obj)

    return period_arr
