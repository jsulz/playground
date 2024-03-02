import requests
import hashlib
import base64
import random
import os
import time
from flask import Blueprint, request, session, redirect, jsonify, render_template

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
    # If they do, then build up the page
    # return redirect("/spotify-login")
    # return render_template("coding-challenges/spotify.html.jinja")


@spotify.route("/spotify-auth", methods=["GET"])
def auth():
    code = request.args["code"]
    token_url = "https://accounts.spotify.com/api/token"
    params_dict = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://127.0.0.1:5000/spotify-auth",
        "client_id": os.environ["CLIENT_ID"],
        "code_verifier": session["code_verifier"],
    }
    headers_dict = {"Content-Type": "application/x-www-form-urlencoded"}
    # Check the status and if it's something that we don't like, flash something and return

    r = requests.post(token_url, params=params_dict, headers=headers_dict, timeout=10)
    r_json = r.json()
    session["access_token"] = r_json["access_token"]
    session["refresh_token"] = r_json["refresh_token"]
    session["token_expiry_time"] = int(time.time()) + r.json["expires_in"]
    results = {"no_token": False}

    return render_template("coding-challenges/spotify.html.jinja", results=results)


@spotify.route("/spotify-login", methods=["GET"])
def login():
    authURL = "https://accounts.spotify.com/authorize"
    code_verifier = code_generator(64)
    session["code_verifier"] = code_verifier
    code_hashed = hash_code(code_verifier)
    challenge_code = code_challenge(code_hashed)
    param_dict = {
        "client_id": os.environ["CLIENT_ID"],
        "response_type": "code",
        "redirect_uri": "http://127.0.0.1:5000/spotify-auth",
        "scope": "user-top-read",
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
    headers_dict = {
        "Content-Type": "application/x-www-form-urlencoded",
    }
    param_dict = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "client_id": os.environ["CLIENT_ID"],
    }

    r = requests.post(token_url, params=param_dict, headers=headers_dict)

    # @TODO check statuses/handle failures
    r_json = r.json()

    # @TODO Pull this all off into it's own function
    session["access_token"] = r_json["access_token"]
    session["refresh_token"] = r_json["refresh_token"]
    session["token_expiry_time"] = int(time.time()) + r.json["expires_in"]

    return r_json["access_token"], r_json["refresh_token"]
