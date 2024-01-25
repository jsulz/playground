import React, { useState } from "react";

export default function SimpleTodo() {
  const taskList = [
    { name: "This is a very long task name", status: "todo" },
    { name: "Thing 2", status: "in-progress" },
    { name: "Thing 3", status: "done" },
  ];
  //const [taskList, setTaskList] = useState([]);
  return (
    <>
      <AddItem />
      <TodoTable tasks={taskList} />
    </>
  );
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
        <div className="col-md-6 mb-3">
          <button type="submit" className="col me-2  btn btn-primary">
            Add Task
          </button>
          <button
            type="reset"
            className="col btn btn-primary"
            onClick={handleSubmit}
          >
            Delete List
          </button>
        </div>
      </form>
    </div>
  );
};

const TodoTable = ({ tasks }) => {
  return (
    <div className="table-responsive-lg">
      <table className="table">
        <thead>
          <th scope="col">#</th>
          <th scope="col">Task</th>
          <th scope="col">Status</th>
          <th scope="col">Edit</th>
          <th scope="col">Delete</th>
        </thead>
        <tbody>
          {tasks.map((item, index) => (
            <TodoItem task={item} key={index} count={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TodoItem = ({ task, count }) => {
  let statusClass = null;
  switch (task["status"]) {
    case "todo":
      statusClass = "secondary";
      break;
    case "in-progress":
      statusClass = "warning";
      break;
    case "done":
      statusClass = "success";
      break;

    default:
      statusClass = "primary";
      break;
  }
  return (
    <tr>
      <td>{count + 1}</td>
      <td>{task["name"]}</td>
      <td>
        <button type="button" className={`btn btn-${statusClass}`}>
          {task["status"].toUpperCase()}
        </button>
      </td>
      <td>
        <button type="button" className="btn btn-outline-primary">
          <i class="bi bi-pencil"></i>
        </button>
      </td>
      <td>
        <button type="button" className="btn btn-outline-primary">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};
