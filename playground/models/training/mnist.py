"""Trains a simple keras neural network on the MNIST dataset.
"""

import keras
import keras.datasets.mnist as mnist
import matplotlib.pyplot as plt
import pandas as pd

# load the mnist dataset
(x_train_full, y_train_full), (x_test, y_test) = mnist.load_data()

# split the training set into a training and validation set and normalize the data
x_valid, x_train = x_train_full[:5000] / 255.0, x_train_full[5000:] / 255.0
y_valid, y_train = y_train_full[:5000], y_train_full[5000:]

# create a simple neural network using the sequential api
model = keras.models.Sequential(
    [
        keras.layers.Flatten(input_shape=[28, 28]),
        keras.layers.Dense(300, activation="relu"),
        keras.layers.Dense(100, activation="relu"),
        keras.layers.Dense(10, activation="softmax"),
    ]
)

# compile the model
# https://keras.io/api/losses/probabilistic_losses/#sparsecategoricalcrossentropy-class
model.compile(
    loss="sparse_categorical_crossentropy", optimizer="sgd", metrics=["accuracy"]
)

# train the model
history = model.fit(x_train, y_train, epochs=30, validation_data=(x_valid, y_valid))

# plot the learning curves and save them
pd.DataFrame(history.history).plot(figsize=(8, 5))
plt.grid(True)
plt.gca().set_ylim(0, 1)
plt.savefig("experiment_images/mnist_learning_curves.png")

# save the model
model.save("../artifacts/mnist_model.keras")