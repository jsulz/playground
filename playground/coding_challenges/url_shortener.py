from flask import Blueprint, render_template, request, make_response, redirect, jsonify
from google.cloud import firestore
import hashlib

url = Blueprint("url_shortener", __name__, template_folder="templates")


@url.route("/url-shortener", methods=["GET"])
def url_shortener():
    return render_template("coding-challenges/urlshortener.html.jinja")


@url.route("/us/shorten", methods=["POST"])
def shorten():
    if not request.is_json:
        response = make_response(
            jsonify({"unsupported": "Unsupported Media Type"}), 415
        )
        return response
    request_body = request.get_json()

    try:
        long_url = request_body["url"]
    except AttributeError:
        response = make_response(jsonify({"error": "Missing field: url"}), 400)
        return response

    key = hashlib.blake2b(long_url.encode(), digest_size=3, usedforsecurity=False)

    ds = firestore.Client(project="sylvan-byway-406923", database="url-shortener")
    doc_ref = ds.collection("urls").document(key.hexdigest())
    doc_ref.set(
        {
            "key": key.hexdigest(),
            "short_url": request.host_url + "us/" + key.hexdigest(),
            "long_url": long_url,
        }
    )
    response = make_response(
        jsonify(
            {
                "key": key.hexdigest(),
                "short_url": request.host_url + "us/" + key.hexdigest(),
                "long_url": long_url,
            }
        ),
        200,
    )
    return response


@url.route("/us/<string:key>", methods=["GET", "DELETE"])
def visit(key):
    if request.method == "GET":
        ds = firestore.Client(project="sylvan-byway-406923", database="url-shortener")
        doc_ref = ds.collection("urls").document(key)
        doc = doc_ref.get()
        if not doc.exists:
            response = make_response(jsonify({"error": "URL not found"}), 404)
            return response

        doc_data = doc.to_dict()
        return redirect(location=doc_data["long_url"])

    if request.method == "DELETE":
        ds = firestore.Client(project="sylvan-byway-406923", database="url-shortener")
        doc_ref = ds.collection("urls").document(key)
        doc = doc_ref.get()
        if not doc.exists:
            response = make_response(jsonify({"error": "URL not found"}), 404)
            return response
        doc_ref.delete()
        response = make_response(jsonify({"success": "Deletion success"}), 200)
        return response

    response = make_response(jsonify({"disallowed": "Method not allowed"}), 405)
    return response


@url.route("/us/all", methods=["GET"])
def get_all():
    pass
