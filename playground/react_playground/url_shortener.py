from flask import Blueprint, render_template
from google.cloud import firestore
import hashlib

url = Blueprint("url_shortener", __name__, template_folder="templates")


@url.route("/url-shortener", methods=["GET"])
def url_shortener():
    ds = firestore.Client(project="sylvan-byway-406923", database="url-shortener")
    long_url = "http://www.google.com/"
    key = hashlib.blake2b(long_url.encode(), digest_size=5, usedforsecurity=False)
    doc_ref = ds.collection("test_urls").document(key.hexdigest())
    doc_ref.set({"short_url": "/" + key.hexdigest(), "long_url": long_url})
    return render_template("react-playground/urlshortener.html.jinja")
