const { generateLobbyNumber } = require('./util');

const lobbies = [];

const createLobby = () => {
  lobby = {
    doneGuessing: false,
    gameInProgress: false,
    lobbyId: generateLobbyNumber(4),
    mediaId: '',
    users: [],
  };
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

  const user = {
    id,
    username,
    profileImage,
    isAdmin,
    lobbyId,
    isGuessing: true,
    guess: '',
    score: 0,
    scoreAdded: 0,
  };
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

const startLobbyGame = (lobbyId, mediaId) => {
  const lobbyIndex = lobbies.findIndex((lobby) => lobby.lobbyId === lobbyId);
  if (lobbyIndex == -1) {
    return;
  }
  lobbies[lobbyIndex].gameInProgress = true;
  lobbies[lobbyIndex].mediaId = mediaId;
};

const getLobbyGameProgress = (lobbyId) => {
  const lobbyIndex = lobbies.findIndex((lobby) => lobby.lobbyId === lobbyId);
  if (lobbyIndex == -1) {
    return;
  }
  return {
    gameInProgress: lobbies[lobbyIndex].gameInProgress,
    mediaId: lobbies[lobbyIndex].mediaId,
  };
};

const submitUserGuess = (userId, lobbyId, guess, points) => {
  const lobbyIndex = lobbies.findIndex((lobby) => lobby.lobbyId === lobbyId);
  if (lobbyIndex == -1) {
    return;
  }
  const userIndex = lobbies[lobbyIndex].users.findIndex(
    (user) => user.id === userId
  );
  if (userIndex != -1) {
    lobbies[lobbyIndex].users[userIndex].guess = guess;
    lobbies[lobbyIndex].users[userIndex].isGuessing = false;
    lobbies[lobbyIndex].users[userIndex].score =
      lobbies[lobbyIndex].users[userIndex].score + points;
    lobbies[lobbyIndex].users[userIndex].scoreAdded = points;

    return lobbies[lobbyIndex].users[userIndex];
  }
};

const checkUsersDoneGuessing = (lobbyId) => {
  const lobbyIndex = lobbies.findIndex((lobby) => lobby.lobbyId === lobbyId);
  if (lobbyIndex == -1) {
    return false;
  }
  let doneGuessing = true;
  lobbies[lobbyIndex].users.forEach((user) => {
    if (user.isGuessing) {
      doneGuessing = false;
    }
  });
  if (doneGuessing) {
    lobbies[lobbyIndex].doneGuessing = doneGuessing;
  }
  return doneGuessing;
};

module.exports = {
  addUser,
  checkUsersDoneGuessing,
  createLobby,
  removeUser,
  getUsersInLobby,
  removeUserWithouLobbyId,
  startLobbyGame,
  submitUserGuess,
  getLobbyGameProgress,
};
