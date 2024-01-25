import React from "react";

export default function SimpleTodo() {
  const list = [{ title: "Thing 1", status: "todo" }];
  return <AddItem />;
}

const AddItem = () => {
  const handleSubmit = (e) => {
    console.log(e);
    e.preventDefault();
  };
  return (
    <div className="row">
      <form onSubmit={handleSubmit}>
        <div className="col-6 mb-3">
          <label className="form-label" for="task">
            Task Name
          </label>
          <input type="text" id="task" name="task" className="form-control" />
        </div>
        <div className="col-6 mb3">
          <button type="submit" className="col-3 me-2  btn btn-primary">
            Add Task
          </button>
          <button
            type="reset"
            className="col-3 btn btn-primary"
            onClick={handleSubmit}
          >
            Delete List
          </button>
        </div>
      </form>
    </div>
  );
};

const TodoTable = () => {
  return <h2>Hello</h2>;
};

const TodoItem = () => {
  return <h2>World</h2>;
};
