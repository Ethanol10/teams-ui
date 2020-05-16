import { db } from "../services/firebase";

export function readChats() {
  let abc = [];
  db.ref("chats").on("value", (snapshot) => {
    snapshot.forEach((snap) => {
      abc.push(snap.val());
    });
    return abc;
  });
}

export function writeChats(message) {
  return db.ref("chats").push({
    content: message.content,
    timestamp: message.timestamp,
    uid: message.uid,
  });
}

export async function createTaskboard(userId) {
  return db.ref("taskboards").push({
    name: "New Taskboard",
    description: "This is a new taskboard",
    createdBy: userId,
    createdTimestamp: Date.now(),
  });
}

/**
 * Create a new column in the database.
 * The return value is void in all cases.
 * @param {string} columnsKey - The unique key that all columns are created under
 * @param {string} name - The name of the column
 */
export function createTaskColumn(boardId, name) {
  return db.ref(`columns/${boardId}`).push({
    name,
    createdTimestamp: Date.now(),
  });
}

export function deleteTaskColumn(boardId, id) {
  return db.ref(`columns/${boardId}/${id}`).update({
    deletedTimestamp: Date.now(),
  });
}
