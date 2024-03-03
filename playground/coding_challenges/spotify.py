import requests
import hashlib
import base64
import random
import os
import time
from flask import (
    Blueprint,
    request,
    session,
    redirect,
    jsonify,
    render_template,
    make_response,
    url_for,
)

spotify = Blueprint("spotify", __name__, template_folder="templates")


@spotify.route("/spotify-tastes", methods=["GET", "POST"])
def spotify_tastes():
    # check to see if the user has the session set that would indicate we have a refresh and access token
    # if they don't, then show a template that has a link to the login option
    access_tokens = get_access_token()
    if not access_tokens:
        results = {
            "no_token": True,
        }
        return render_template("coding-challenges/spotify.html.jinja", results=results)

    # If they do, then return a render and the front-end will make the API calls necessary to build up the frontend
    return render_template("coding-challenges/spotify.html.jinja", results={})
    # return redirect("/spotify-login")
    # return render_template("coding-challenges/spotify.html.jinja")


@spotify.route("/spotify-user-info", methods=["GET"])
def get_user_info():
    # https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
    access_tokens = get_access_token()
    header_dict = {"Authorization": f"Bearer {access_tokens['access_token']}"}
    r = requests.get("https://api.spotify.com/v1/me", headers=header_dict, timeout=5)
    r_json = r.json()
    images = [r_json["images"][-1]["url"]] if len(r_json["images"]) > 0 else []
    data = {
        "display_name": r_json["display_name"],
        "email": r_json["email"],
        "followers": r_json["followers"]["total"],
        "image": images,
    }
    return make_response(jsonify({"data": data}), 200)


@spotify.route("/spotify-user-history", methods=["GET"])
def get_user_top():

    access_tokens = get_access_token()
    item_type = request.args["type"]
    time_range = request.args["time_range"]
    resource = f"https://api.spotify.com/v1/me/top/{item_type}"

    header_dict = {"Authorization": f"Bearer {access_tokens['access_token']}"}
    params_dict = {"time_range": time_range}

    r = requests.get(resource, headers=header_dict, params=params_dict)
    r_json = r.json()
    data = []
    if item_type == "tracks":
        for item in r_json["items"]:
            track = {
                "album": {
                    "name": item["album"]["name"],
                    "image": item["album"]["images"][-1]["url"],
                    "release_date": item["album"]["release_date"],
                },
                "artists": [artist["name"] for artist in item["artists"]],
                "name": item["name"],
                "popularity": item["popularity"],
                "duration": item["duration_ms"],
                "preview_url": item["preview_url"],
            }
            data.append(track)

    if item_type == "artists":
        for item in r_json["items"]:
            artist = {
                "name": item["name"],
                "popularity": item["popularity"],
                "followers": item["followers"]["total"],
                "genres": item["genres"],
                "image": item["images"][-1]["url"],
            }
            data.append(artist)

    return make_response(jsonify({"data": data}), 200)


@spotify.route("/spotify-recommendations", methods=["GET"])
def get_user_recommendations():
    pass


@spotify.route("/spotify-clear-session", methods=["GET", "POST"])
def clear_session():
    # @TODO Handle a bunch of stuff related to guard conditions

    # pop all the session variables we set
    session.pop("access_token", None)
    session.pop("refresh_token", None)
    session.pop("token_expiry_time", None)

    # return a successful response; the front end will reload the page
    return make_response(jsonify({"success": "variables cleared"}), 200)


@spotify.route("/spotify-auth", methods=["GET"])
def auth():
    code = request.args["code"]
    redirect_url = os.environ["SPOTIFY_REDIRECT_URL"]
    token_url = "https://accounts.spotify.com/api/token"
    params_dict = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_url,
        "client_id": os.environ["CLIENT_ID"],
        "code_verifier": session["code_verifier"],
    }
    headers_dict = {"Content-Type": "application/x-www-form-urlencoded"}
    # Check the status and if it's something that we don't like, flash something and return

    r = requests.post(token_url, params=params_dict, headers=headers_dict, timeout=10)
    r_json = r.json()
    # print(r_json)
    session["access_token"] = r_json["access_token"]
    session["refresh_token"] = r_json["refresh_token"]
    session["token_expiry_time"] = int(time.time()) + r_json["expires_in"]

    return redirect(url_for("spotify.spotify_tastes"))


@spotify.route("/spotify-login", methods=["GET"])
def login():
    authURL = "https://accounts.spotify.com/authorize"
    code_verifier = code_generator(64)
    session["code_verifier"] = code_verifier
    code_hashed = hash_code(code_verifier)
    challenge_code = code_challenge(code_hashed)
    redirect_url = os.environ["SPOTIFY_REDIRECT_URL"]
    param_dict = {
        "client_id": os.environ["CLIENT_ID"],
        "response_type": "code",
        "redirect_uri": redirect_url,
        "scope": "user-top-read,user-read-private,user-read-email user-read-recently-played",
        "code_challenge_method": "S256",
        "code_challenge": challenge_code,
    }
    r_url = requests.get(authURL, params=param_dict, timeout=10)
    r_url = r_url.url
    return redirect(r_url)


def code_generator(length):
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    value = ""
    for i in range(length):
        value += possible[random.randint(0, len(possible) - 1)]
    return value


def hash_code(code):
    # https://docs.python.org/3/library/hashlib.html#usage
    encoded_code = code.encode(encoding="UTF-8")
    return hashlib.sha256(encoded_code).digest()


def code_challenge(hashed_code):
    challenge = base64.urlsafe_b64encode(hashed_code)
    challenge = challenge.decode("utf-8")
    return challenge.replace("=", "")


def get_access_token():
    # if the session doesn't have the right info, then return false
    try:
        access_token = session["access_token"]
        refresh_token = session["refresh_token"]
        token_expiry_time = session["token_expiry_time"]
    except KeyError:
        return False
    # if the current time is greater than the token_expiry_time then get a new token
    print(token_expiry_time, int(time.time()))
    if token_expiry_time < int(time.time()):
        access_token, refresh_token = refresh_access_token(refresh_token)

    # And finally return the tokens
    tokens = {
        "access_token": access_token,
        "refresh_token": refresh_token,
    }
    return tokens


def refresh_access_token(refresh_token):
    # https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens
    token_url = "https://accounts.spotify.com/api/token"
    print(refresh_token)
    headers_dict = {
        "Content-Type": "application/x-www-form-urlencoded",
    }
    body_data = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "client_id": os.environ["CLIENT_ID"],
    }

    r = requests.post(token_url, data=body_data, headers=headers_dict, timeout=10)

    # @TODO check statuses/handle failures
    r_json = r.json()
    # print(r_json)

    # @TODO Pull this all off into it's own function
    session["access_token"] = r_json["access_token"]
    session["refresh_token"] = r_json["refresh_token"]
    session["token_expiry_time"] = int(time.time()) + r_json["expires_in"]

    return r_json["access_token"], r_json["refresh_token"]
