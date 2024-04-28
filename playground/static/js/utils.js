(() => {
  "use strict";

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const toastTrigger = document.getElementById("copy-select-all");
  const toastLive = document.getElementById("liveToast");

  if (toastTrigger) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);
    toastTrigger.addEventListener("click", async () => {
      toastBootstrap.show();
      await sleep(3000);
      toastBootstrap.hide();
    });
  }

  const selectAllButton = document.getElementById("copy-select-all");
  if (selectAllButton) {
    selectAllButton.addEventListener("click", async () => {
      try {
        const element = document.querySelector(".user-select-all");
        await navigator.clipboard.writeText(element.textContent);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    });
  }

  const diceCount = document.getElementById("dicecount");
  const diceCountLabel = document.getElementById("dicecountBlock");
  if (diceCount) {
    diceCountLabel.textContent = "Dice: " + diceCount.value;
    diceCount.addEventListener("input", (event) => {
      diceCountLabel.textContent = "Dice: " + event.target.value;
    });
  }

  const diceSides = document.getElementById("dicesides");
  const diceSidesLabel = document.getElementById("dicesideBlock");
  if (diceSides) {
    diceSidesLabel.textContent = "Sides: " + diceSides.value;
    diceSides.addEventListener("input", (event) => {
      diceSidesLabel.textContent = "Sides: " + event.target.value;
    });
  }

  const firstNumber = document.getElementById("firstnumber");
  const firstNumberLabel = document.getElementById("firstnumberBlock");
  if (firstNumber) {
    firstNumberLabel.textContent = "Current Number: " + firstNumber.value;
    firstNumber.addEventListener("input", (event) => {
      firstNumberLabel.textContent = "Current Number: " + event.target.value;
    });
  }

  const secondNumber = document.getElementById("secondnumber");
  const secondNumberLabel = document.getElementById("secondnumberBlock");
  if (secondNumber) {
    secondNumberLabel.textContent = "Current Number: " + secondNumber.value;
    secondNumber.addEventListener("input", (event) => {
      secondNumberLabel.textContent = "Current Number: " + event.target.value;
    });
  }

  const netflixTemplateId = document.getElementById("netflix");
  if (netflixTemplateId) {
    const netflixHTML = document.getElementsByTagName("html")[0];
    netflixHTML.id = "netflix";
  }
})();

const mnistEl = document.getElementById("mnist");
if (mnistEl != null) {
  var canvas = document.querySelector("#mnist");
  var ctx = canvas.getContext("2d");

  var sketch = document.querySelector("#mnist");
  var sketch_style = getComputedStyle(sketch);
  canvas.width = parseInt(sketch_style.getPropertyValue("width"));
  canvas.height = parseInt(sketch_style.getPropertyValue("height"));

  var mouse = { x: 0, y: 0 };
  var last_mouse = { x: 0, y: 0 };

  /* Mouse Capturing Work */
  canvas.addEventListener(
    "mousemove",
    function (e) {
      last_mouse.x = mouse.x;
      last_mouse.y = mouse.y;

      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
    },
    false
  );

  /* Mouse Capturing Work */
  canvas.addEventListener(
    "touchmove",
    function (e) {
      last_mouse.x = mouse.x;
      last_mouse.y = mouse.y;

      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
    },
    false
  );

  /* Drawing on Paint App */
  ctx.lineWidth = 10;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener(
    "mousedown",
    function (e) {
      canvas.addEventListener("mousemove", onPaint, false);
    },
    false
  );

  canvas.addEventListener(
    "touchstart",
    function (e) {
      canvas.addEventListener("touchstart", onPaint, false);
    },
    false
  );

  canvas.addEventListener(
    "mouseup",
    function () {
      canvas.removeEventListener("mousemove", onPaint, false);
    },
    false
  );

  canvas.addEventListener(
    "touchend",
    function () {
      canvas.removeEventListener("touchend", onPaint, false);
    },
    false
  );

  var onPaint = function () {
    ctx.beginPath();
    ctx.moveTo(last_mouse.x, last_mouse.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.closePath();
    ctx.stroke();
  };
}

const clearCanvas = () => {
  var canvas = document.querySelector("#mnist");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 10;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const predictMNIST = () => {
  const image = canvas.toDataURL("image/png");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: image }),
  };
  fetch("/mnist-predict", options)
    .then((response) => response.json())
    .then((data) => {
      const prediction = document.getElementById("mnist-prediction");
      prediction.textContent = `Prediction: ${data.prediction}`;
    });
};
