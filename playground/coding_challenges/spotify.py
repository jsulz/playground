from flask import Blueprint, request, session, jsonify, render_template

spotify = Blueprint("spotify", __name__, template_folder="templates")


@spotify.route("/spotify-tastes", methods=["GET", "POST"])
def spotify_tastes():
    try:
        session["spotify"]
    except KeyError:
        print("wow")
    return render_template("coding-challenges/spotify.html.jinja")
