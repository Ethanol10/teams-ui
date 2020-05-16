import React from "react";
import "./TaskColumn.scss";
import { Card, CardContent, Typography } from "@material-ui/core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteTaskColumn } from "../../../helpers/db";

const TaskColumn = ({ boardId, column, tasks }) => {
  const handleDeleteColumn = async () => {
    try {
      await deleteTaskColumn(boardId, column.id);
    } catch (err) {
      alert(`An error occurred when deleting column ${err.message}`); // TODO: Dont use alerts for error messages..
    }
  };
  return (
    <div className="task-column-container">
      <div className="header-lockup">
        <Typography variant="h5" component="h2">
          {column.name}
        </Typography>
        <FontAwesomeIcon
          onClick={handleDeleteColumn}
          icon={faTimes}
          size="1x"
        />
      </div>
      <div className="task-list">
        <ul>
          {tasks.map((task, index) => {
            return (
              // TODO: Dont use index as key, use task id when we have it..
              <li key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textPrimary" gutterBottom>
                      {task.name}
                    </Typography>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TaskColumn;
