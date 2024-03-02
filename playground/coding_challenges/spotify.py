import requests
import hashlib
import base64
import random
import os
from flask import Blueprint, request, session, redirect, jsonify, render_template

spotify = Blueprint("spotify", __name__, template_folder="templates")


@spotify.route("/spotify-tastes", methods=["GET", "POST"])
def spotify_tastes():
    return redirect("/spotify-login")
    # return render_template("coding-challenges/spotify.html.jinja")


@spotify.route("/spotify-auth", methods=["GET"])
def auth():
    code = request.args["code"]
    token_url = "https://accounts.spotify.com/api/token"
    print(session["code_verifier"])
    params_dict = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://127.0.0.1:5000/spotify-auth",
        "client_id": os.environ["CLIENT_ID"],
        "code_verifier": session["code_verifier"],
    }
    headers_dict = {"Content-Type": "application/x-www-form-urlencoded"}
    r = requests.post(token_url, params=params_dict, headers=headers_dict)
    print(r.text)


@spotify.route("/spotify-login", methods=["GET"])
def login():
    authURL = "https://accounts.spotify.com/authorize"
    code_verifier = code_generator(64)
    session["code_verifier"] = code_verifier
    print(session["code_verifier"])
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
    r = requests.get(authURL, params=param_dict)
    return redirect(r.url)


def code_generator(length):
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    value = ""
    for i in range(length):
        value += possible[random.randint(0, len(possible) - 1)]
    return value


def hash_code(code):
    # https://docs.python.org/3/library/hashlib.html#usage
    encoded_code = code.encode(encoding="UTF-8")
    return hashlib.sha256(encoded_code).hexdigest()


def code_challenge(hashed_code):
    encoded_hash = hashed_code.encode("ascii")
    return base64.b64encode(encoded_hash)
