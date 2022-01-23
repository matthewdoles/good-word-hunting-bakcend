const { generateLobbyNumber } = require('./util');

const lobbies = [];

const createLobby = () => {
  lobby = { gameInProgress: false, lobbyId: generateLobbyNumber(4), users: [] };
  lobbies.push(lobby);
  return lobby;
};

const addUser = ({ id, username, profileImage, isAdmin, lobbyId }) => {
  if (!username) {
    return {
      error: 'Username required!',
    };
  }

  const lobbyIndex = lobbies.findIndex((lobby) => lobby.lobbyId === lobbyId);

  if (lobbyIndex == -1) {
    return;
  }

  const existingUser = lobbies[lobbyIndex].users.find((user) => {
    return user.id === id;
  });

  if (existingUser) {
    return {
      error: 'User already present',
    };
  }

  const user = { id, username, profileImage, isAdmin, lobbyId };
  lobbies[lobbyIndex].users.push(user);
  return { user };
};

const removeUser = (lobbyId, userId) => {
  const lobbyIndex = lobbies.findIndex((lobby) => lobby.lobbyId === lobbyId);
  if (lobbyIndex == -1) {
    return;
  }
  const userIndex = lobbies[lobbyIndex].users.findIndex(
    (user) => user.id === userId
  );

  if (userIndex != -1) {
    return lobbies[lobbyIndex].users.splice(userIndex, 1)[0];
  }
};

const removeUserWithouLobbyId = (userId) => {
  let user;
  lobbies.forEach((lobby) => {
    const userIndex = lobby.users.findIndex((user) => user.id === userId);
    if (userIndex != -1) {
      user = lobby.users.splice(userIndex, 1)[0];
    }
  });
  return user;
};

const getUsersInLobby = (lobbyId) => {
  const lobbyIndex = lobbies.findIndex((lobby) => lobby.lobbyId === lobbyId);
  if (lobbyIndex == -1) {
    return;
  }
  return lobbies[lobbyIndex].users;
};

const startLobbyGame = (lobbyId) => {
  const lobbyIndex = lobbies.findIndex((lobby) => lobby.lobbyId === lobbyId);
  if (lobbyIndex == -1) {
    return;
  }
  lobbies[lobbyIndex].gameInProgress = true;
};

const getLobbyGameProgress = (lobbyId) => {
  const lobbyIndex = lobbies.findIndex((lobby) => lobby.lobbyId === lobbyId);
  if (lobbyIndex == -1) {
    return;
  }
  return lobbies[lobbyIndex].gameInProgress;
};

module.exports = {
  addUser,
  createLobby,
  removeUser,
  getUsersInLobby,
  removeUserWithouLobbyId,
  startLobbyGame,
  getLobbyGameProgress,
};
