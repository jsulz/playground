from flask import Blueprint, render_template, request, make_response, jsonify
import pandas as pd
import datetime
from dateutil import tz
import calendar
import warnings

warnings.simplefilter(action="ignore", category=FutureWarning)

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
            {
                "title": "Movies + Episodes Watched",
                "count": df["Title"].shape[0],
            },
            {
                "title": "Hours Watched",
                "count": float_format_helper(df["Duration"].sum()),
            },
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

        # Compare Movies and TV
        df_movies = df[df["Title_1"].isnull()]
        df_tv = df[df["Title_1"].notnull()]
        movie_tv_count_comp = {
            "title": "Count of Movies and TV Watched",
            "data": [
                {"name": "Movies", "value": df_movies["Title"].shape[0]},
                {"name": "TV", "value": df_tv["Title"].shape[0]},
            ],
        }
        movie_tv_dur_comp = {
            "title": "Duration of Movies and TV Watched",
            "data": [
                {
                    "name": "Movies",
                    "value": float_format_helper(df_movies["Duration"].sum()),
                },
                {"name": "Tv", "value": float_format_helper(df_tv["Duration"].sum())},
            ],
        }
        final["comparisonMoviesTv"] = [movie_tv_count_comp, movie_tv_dur_comp]

        # Get device data
        df_devices = (
            df.groupby("Device Type")["Device Type"]
            .value_counts()
            .sort_values(ascending=False)
            .to_dict()
        )
        device_arr = []
        for device, count in df_devices.items():
            device_arr.append({"name": device, "value": count})
        device_headers = ["Device Name", "Total Views"]

        # Get country data
        df_countries = (
            df.groupby("Country")["Country"]
            .value_counts()
            .sort_values(ascending=False)
            .to_dict()
        )
        countries_arr = []
        for countries, count in df_countries.items():
            countries_arr.append({"name": countries, "value": count})
        country_headers = ["Country", "Total Views"]

        final["devices"] = {"deviceData": device_arr, "deviceHeaders": device_headers}
        final["countries"] = {
            "countriesData": countries_arr,
            "countriesHeaders": country_headers,
        }

        topWatches = (
            df.groupby("Title_0")[["Duration"]]
            .sum()
            .sort_values(by="Duration", ascending=False)[:10]
            .to_dict()["Duration"]
        )
        topWatches_arr = []
        for show_name, duration in topWatches.items():
            topWatches_arr.append(
                {"name": show_name, "duration": float_format_helper(duration)}
            )

        final["topWatches"] = topWatches_arr

        return make_response(jsonify(final))
    return make_response(jsonify({"Error": "Not allowed"}), 405)


def time_spent_by_helper(df, period):
    grouping = df.groupby(period)[["Duration"]].sum().to_dict()["Duration"]
    period_arr = []
    for curr_period, duration in grouping.items():
        if period == "Month":
            curr_period = calendar.month_name[curr_period]
        if period == "Day":
            curr_period = calendar.day_name[curr_period - 1]
        period_obj = {"name": curr_period, "hours": float_format_helper(duration)}
        period_arr.append(period_obj)

    return period_arr


def float_format_helper(curr_num):
    return float(f"{curr_num:.2f}")
