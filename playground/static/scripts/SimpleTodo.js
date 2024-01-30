import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function SimpleTodo() {
  const [taskState, setTaskState] = useState([]);

  useEffect(() => {
    const value = window.localStorage.getItem("taskState");
    const valueParse = JSON.parse(value) ? JSON.parse(value) : [];
    setTaskState(valueParse);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("taskState", JSON.stringify(taskState));
  }, [taskState]);

  const handleNew = (newTask) => {
    const today = new Date();
    const dateString = today.toLocaleString("en-US");
    setTaskState(
      taskState.concat({
        id: uuidv4(),
        name: newTask.name,
        status: "todo",
        date: dateString,
      })
    );
  };
  const deleteAll = (e) => {
    e.preventDefault();
    setTaskState([]);
  };

  const handleEdit = (task_id, newTask) => {
    const newList = taskState.map((item) => {
      if (item.id == task_id) {
        item.name = newTask.name;
        item.status = newTask.status;
      }
      return item;
    });
    setTaskState(newList);
  };

  const handleDelete = (id) => {
    const filteredTaskList = taskState.filter((item) => item.id !== id);
    setTaskState(filteredTaskList);
  };

  return (
    <>
      <AddItem addNew={handleNew} deleteAll={deleteAll} />
      {taskState.length > 0 ? (
        <TodoTable
          tasks={taskState}
          editTask={handleEdit}
          deleteTask={handleDelete}
        />
      ) : (
        <div className="text-center">
          <h3>Add a new task to see your task list here.</h3>
        </div>
      )}
    </>
  );
}

const AddItem = ({ addNew, deleteAll }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTask = Object.fromEntries(formData);
    addNew(newTask);
  };
  return (
    <div className="row">
      <form onSubmit={handleSubmit}>
        <div className="col-6 mb-3">
          <label className="form-label" for="task">
            Task Name
          </label>
          <input type="text" id="name" name="name" className="form-control" />
        </div>
        <div className="col-md-6 mb-3">
          <button type="submit" className="col me-2  btn btn-primary">
            Add Task
          </button>
          <button
            type="reset"
            className="col btn btn-primary"
            onClick={deleteAll}
          >
            Delete List
          </button>
        </div>
      </form>
    </div>
  );
};

const TodoTable = ({ tasks, editTask, deleteTask }) => {
  return (
    <div className="table-responsive-lg">
      <table className="table table-hover table-striped">
        <thead>
          <th scope="col">Date Created</th>
          <th scope="col">Task</th>
          <th scope="col">Status</th>
          <th scope="col">Edit</th>
          <th scope="col">Delete</th>
        </thead>
        <tbody className="table-group-divider">
          {tasks.map((item) => (
            <TodoItem
              task={item}
              key={item.id}
              edit={editTask}
              delTask={deleteTask}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TodoItem = ({ task, edit, delTask }) => {
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
    <>
      <tr>
        <td>{task["date"]}</td>
        <td>{task["name"]}</td>
        <td>
          <button type="button" className={`btn btn-${statusClass}`} disabled>
            {task["status"].toUpperCase()}
          </button>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-outline-primary"
            data-bs-toggle="modal"
            data-bs-target={`#modal-${task.id}`}
          >
            <i className="bi bi-pencil"></i>
          </button>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => delTask(task.id)}
          >
            <i className="bi bi-trash"></i>
          </button>
        </td>
      </tr>
      <EditModal task={task} edit={edit} />
    </>
  );
};

const EditModal = ({ task, edit }) => {
  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTask = Object.fromEntries(formData.entries());
    e.target[0].value = "";
    edit(task.id, newTask);
  };
  const statuses = ["todo", "in-progress", "done"];
  const options = statuses.map((status) => {
    if (status === task.status) {
      return (
        <option value={status} selected>
          {status.toUpperCase()}
        </option>
      );
    }
    return <option value={status}>{status.toUpperCase()}</option>;
  });

  return (
    <div
      className="modal fade"
      id={`modal-${task.id}`}
      tabindex="-1"
      aria-labelledby="taskModal"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="taskLabel">
              Edit Task
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label for="task" className="col-form-label">
                  Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  required
                  placeholder={task.name}
                />
              </div>
              <div className="mb-3">
                <label for="status" className="col-form-label">
                  Status:
                </label>
                <select
                  className="form-select form-select-sm"
                  aria-label="Select status"
                  name="status"
                >
                  {options}
                </select>
              </div>
              <button
                type="submit"
                className="me-2 btn btn-primary"
                data-bs-dismiss="modal"
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </form>
          </div>
          <div className="modal-footer"></div>
        </div>
      </div>
    </div>
  );
};
