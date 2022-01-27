import { lobbies } from '../index.js';

export const generateLobbyNumber = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const createLobby = () => {
  const lobbyId = generateLobbyNumber(4);
  const lobbyIndex = getLobbyIdIndex(lobbyId);
  if (lobbyIndex != -1) {
    createLobby();
  }

  const lobby = {
    doneGuessing: false,
    gameInProgress: false,
    lobbyId: lobbyId,
    media: {},
    round: 1,
    users: [],
  };
  lobbies.push(lobby);
  return lobby.lobbyId;
};

export const getLobbyIdIndex = (id) =>
  lobbies.findIndex((lobby) => lobby.lobbyId === id);

export const removeIfEmptyLobby = (lobbyIndex) => {
  if (lobbies[lobbyIndex].users.length === 0) {
    lobbies.splice(lobbyIndex, 1);
    return true;
  }
  return false;
};

export const addUser = (
  lobbyIndex,
  { id, username, profileImage, isAdmin, lobbyId }
) => {
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
  return user.id;
};

export const removeUser = (lobbyIndex, userIndex) =>
  lobbies[lobbyIndex].users.splice(userIndex, 1);

export const removeUserWithouLobbyId = (userId) => {
  let user;
  lobbies.forEach((lobby) => {
    const userIndex = lobby.users.findIndex((user) => user.id === userId);
    if (userIndex != -1) {
      user = lobby.users.splice(userIndex, 1)[0];
    }
  });
  return user;
};

export const getUserIndex = (lobbyIndex, userId) =>
  lobbies[lobbyIndex].users.findIndex((user) => user.id === userId);

export const checkUsersDoneGuessing = (lobbyIndex) => {
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
