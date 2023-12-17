from flask import Flask, render_template
from . import playground
from . import birthday_paradox
from . import factor_finder
from . import dice_roll_simulator


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    app.register_blueprint(playground.play)
    app.register_blueprint(birthday_paradox.bp)
    app.register_blueprint(factor_finder.ff)
    app.register_blueprint(dice_roll_simulator.drs)

    app.register_error_handler(404, page_not_found)

    return app


def page_not_found(e):
    return render_template("pages/404.html.jinja"), 404
