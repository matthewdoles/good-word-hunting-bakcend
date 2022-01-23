const lobby = { gameInProgress: false, users: [] };

const addUser = ({ id, username, profileImage, isAdmin, room }) => {
  if (!username) {
    return {
      error: 'Username required!',
    };
  }

  const existingUser = lobby.users.find((user) => {
    return user.room === room && user.id === id;
  });

  if (existingUser) {
    return {
      error: 'User already present',
    };
  }

  const user = { id, username, profileImage, isAdmin, room };
  lobby.users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = lobby.users.findIndex((user) => user.id === id);

  if (index != -1) {
    return lobby.users.splice(index, 1)[0];
  }
};

const getUsersInRoom = (room) => {
  return lobby.users.filter((user) => user.room === room);
};

const getGameInProgress = () => {
  return lobby.gameInProgress;
};

const startGame = () => {
  lobby.gameInProgress = true;
};

module.exports = {
  addUser,
  removeUser,
  getUsersInRoom,
  getGameInProgress,
  startGame,
};
