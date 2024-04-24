import os
from flask import Blueprint, render_template, request
import keras
import base64
from PIL import Image
import io
import numpy as np

# create a blueprint for the mnist predictor
mnist_predictor = Blueprint("mnist_predictor", __name__, template_folder="templates")
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"


@mnist_predictor.route("/mnist-predictor", methods=["GET"])
def mnist():
    # return the template file for this route
    return render_template("ml/mnist_predictor.html.jinja")


@mnist_predictor.route("/mnist-predict", methods=["POST"])
def predict():

    # convert the request body, which is a base64 encoded image, to an actual image
    data = request.get_json()
    image_data = data["image"]
    image_data = image_data.split(",")[1]  # To skip the data type prefix
    image_bytes = base64.b64decode(image_data)

    # Convert the image to greyscale and resize the image to the expected input
    image = Image.open(io.BytesIO(image_bytes)).convert("L")
    image = image.resize((28, 28))

    # Convert the image to a numpy array and normalize the values
    final = np.array(image, dtype=np.float32) / 255.0

    print(
        os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../artifacts/mnist_model.keras")
        )
    )

    # load the mnist_model from the artifacts directory
    model = keras.models.load_model(
        os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../artifacts/mnist_model.keras")
        )
    )
    # make a prediction using the test data
    prediction = model.predict(final[None, ...])

    # return the prediction
    return {"prediction": float(np.argmax(prediction))}
