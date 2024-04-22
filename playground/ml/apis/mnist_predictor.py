import os
from flask import Blueprint, render_template
import keras

# create a blueprint for the mnist predictor
mnist_predictor = Blueprint("mnist_predictor", __name__, template_folder="templates")

# load the mnist dataset
(x_train_full, y_train_full), (x_test, y_test) = keras.datasets.mnist.load_data()
# normalize the test data
x_test = x_test / 255.0


@mnist_predictor.route("/mnist-predictor", methods=["GET"])
def mnist():
    # return the template file for this route
    return render_template("ml/mnist_predictor.html.jinja")


@mnist_predictor.route("/mnist-predict", methods=["GET"])
def predict():
    # load the mnist_model from the artifacts directory
    model = keras.models.load_model(
        os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../artifacts/mnist_model.keras")
        )
    )
    # make a prediction using the test data
    prediction = model.predict(x_test[0][None, ...])
    # print the prediction and the actual value
    print(f"Prediction: {prediction}")
    print(f"Actual: {y_test}")

    # return the prediction
