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

export async function createTaskboard() {
  const columnsKey = await db.ref("columns").push();
  return db.ref("taskboards").push({
    name: "New Taskboard",
    description: "This is a new taskboard",
    createdBy: "userid1",
    createdTimestamp: Date.now(),
    columnsKey: columnsKey.key,
  });
}

/**
 * Create a new column in the database.
 * The return value is void in all cases.
 * @param {string} columnsKey - The unique key that all columns are created under
 * @param {string} name - The name of the column
 */
// TODO: This will also need to push into groups.<group-id>.taskboards when that exists
export function createTaskColumn(columnsKey, name) {
  return db.ref(`columns/${columnsKey}`).push({
    name,
    createdTimestamp: Date.now(),
  });
}

export function deleteTaskColumn(columnsKey, id) {
  return db.ref(`columns/${columnsKey}/${id}`).update({
    deletedTimestamp: Date.now(),
  });
}
