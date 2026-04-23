const users = [];
const messages = [];

let userCounter = 1;
let messageCounter = 1;

function createUserId() {
  const id = `local-user-${userCounter}`;
  userCounter += 1;
  return id;
}

function createMessageId() {
  const id = `local-message-${messageCounter}`;
  messageCounter += 1;
  return id;
}

module.exports = {
  users,
  messages,
  createUserId,
  createMessageId
};
