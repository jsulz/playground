import React from "react";
import ReactDOM from "react-dom";
import SimpleTodo from "./SimpleTodo";

let simpletodoID = document.getElementById("simple-todo");
if (simpletodoID != null) {
  // Render first component
  ReactDOM.render(<SimpleTodo />, document.getElementById("simple-todo"));
}
