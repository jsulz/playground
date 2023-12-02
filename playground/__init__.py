import os

from flask import Flask
from . import playground
from . import birthday_paradox


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    app.register_blueprint(playground.play)
    app.register_blueprint(birthday_paradox.bp)

    return app
