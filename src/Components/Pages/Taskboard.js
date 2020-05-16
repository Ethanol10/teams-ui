import React, { useEffect } from "react";
import "./Taskboard.scss";
import TaskColumn from "../Presentational/TaskColumn/TaskColumn";
import NewTaskColumn from "../Presentational/NewTaskColumn/NewTaskColumn";
import { db } from "../../services/firebase";
import { readUrlQueryParam } from "../../helpers/utils";

// These are just example tasks, we should be reading these from the database...
const exampleTasks = [
  {
    name: "Assign a leader to a subgroup",
    description:
      "We will need to assign a leader to the frontend subgroup and the backend subgroup",
    createdDate: Date.now(),
  },
  {
    name: "Create tasks",
    description: "Users should be able to create tasks on their own",
    createdDate: Date.now() - 300000,
  },
];

const Taskboard = () => {
  const [taskboardData, setTaskboardData] = React.useState({});
  const [isBoardLoaded, setIsBoardLoaded] = React.useState(false);
  const [columns, setColumns] = React.useState([]);
  const [readError, setReadError] = React.useState(false); // TODO: use this

  useEffect(() => {
    const boardId = readUrlQueryParam("id");
    const getTaskboardData = async () => {
      try {
        const result = await db.ref(`/taskboards/${boardId}`).once("value");
        setTaskboardData({
          id: result.key,
          ...result.val(),
        });
      } catch (err) {
        console.log("An error occurred when getting taskboard data", err);
        setTaskboardData({});
      }
      setIsBoardLoaded(true);
    };
    getTaskboardData();
  }, []);

  useEffect(() => {
    if (!Object.keys(taskboardData).length) return;
    try {
      const columns = db.ref(`columns/${taskboardData.id}`);
      columns.on("value", (snapshot) => {
        const tmpCols = [];
        snapshot.forEach((col) => {
          const val = col.val();
          if (val.deletedTimestamp) return; // Don't display deleted columns
          tmpCols.push({
            id: col.key,
            ...val,
          });
        });
        setColumns(tmpCols);
        setReadError(false);
      });
    } catch (err) {
      setReadError(true);
      alert(`An error occurred when reading data... ${err.message}`); // TODO: Dont use an alert, do this properly...
    }
    return () => db.ref(`columns/${taskboardData.id}`).off("value");
  }, [taskboardData]);

  console.log("Readerror is ", readError); // Just keeping this here until we look at using readError
  // TODO: Handle empty taskboard data, display board doesnt exist etc...
  return (
    <div id="taskboard-container">
      <div className="taskboard-navbar">
        <p>Board Title Here</p>
      </div>
      <div className="taskboard-canvas">
        {isBoardLoaded ? (
          <div className="taskboard">
            {columns.map((column) => {
              return (
                <TaskColumn
                  boardId={taskboardData.id}
                  key={column.id}
                  column={column}
                  tasks={exampleTasks}
                />
              );
            })}
            <NewTaskColumn boardId={taskboardData.id} />
          </div>
        ) : (
          <div className="loading-lockup">
            <div className="spinner-border text-success" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Taskboard;
