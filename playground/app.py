from os.path import join, dirname, realpath
import markdown
import os
from flask import Flask, render_template
from playground.bbospp import (
    birthday_paradox,
    factor_finder,
    dice_roll_simulator,
    numbers,
    pig_latin_encoder,
    multtable,
)
from playground.react_playground import (
    first_react_component,
    distribution_series,
    simpletodo,
    netflix,
)
from playground.coding_challenges import url_shortener, spotify
from playground.ml.apis import mnist_predictor
from . import playground


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    app.secret_key = os.environ["SESSION_SECRET"]

    app.register_blueprint(playground.play)
    app.register_blueprint(birthday_paradox.bp)
    app.register_blueprint(factor_finder.ff)
    app.register_blueprint(dice_roll_simulator.drs)
    app.register_blueprint(numbers.nsc)
    app.register_blueprint(pig_latin_encoder.ple)
    app.register_blueprint(multtable.mtg)
    app.register_blueprint(first_react_component.frc)
    app.register_blueprint(distribution_series.ds)
    app.register_blueprint(simpletodo.stodo)
    app.register_blueprint(url_shortener.url)
    app.register_blueprint(netflix.netflix)
    app.register_blueprint(spotify.spotify)
    app.register_blueprint(mnist_predictor.mnist_predictor)

    app.register_error_handler(404, page_not_found)

    return app


def page_not_found(e):
    error_path = join(dirname(realpath(__file__)), "static/content/404.md")
    with open(error_path, encoding="utf-8") as f:
        text = f.read()
    html = markdown.markdown(text)
    results = {"html": html, "title": "404"}
    return render_template("pages/base_page.html.jinja", results=results), 404
