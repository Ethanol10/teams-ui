import React from "react";
import "./NewTaskColumn.scss";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Typography } from "@material-ui/core";
import { createTaskColumn } from "../../../helpers/db";

const NewTaskColumn = ({ columnsKey }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState("");

  const handleSetIsEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTaskColumn(columnsKey, name);
      handleCancelEditing();
    } catch (err) {
      alert(`An error occurred when creating a new column ${err.message}`);
    }
  };

  return (
    <div id="new-task-column-container">
      <form onSubmit={handleSubmit}>
        {isEditing ? (
          <div id="add-column-selected">
            <input
              onChange={handleNameChange}
              value={name}
              placeholder="Enter list name..."
            />
            <div id="button-lockup">
              <Button type="submit">Add List</Button>
              <Button onClick={handleCancelEditing}>
                <FontAwesomeIcon icon={faTimes} size="2x" />
              </Button>
            </div>
          </div>
        ) : (
          <div id="add-column">
            <button onClick={handleSetIsEditing}>
              <FontAwesomeIcon icon={faPlus} size="1x" />
              <Typography component="p">Add another list</Typography>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewTaskColumn;
