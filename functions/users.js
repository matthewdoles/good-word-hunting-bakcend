const users = [];

const addUser = ({ id, username, room }) => {
  if (!username) {
    return {
      error: 'Username required!',
    };
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.id === id;
  });

  if (existingUser) {
    return {
      error: 'User already present',
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUsersInRoom,
};
