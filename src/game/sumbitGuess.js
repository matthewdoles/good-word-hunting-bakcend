import {
  checkUsersDoneGuessing,
  getLobbyIdIndex,
  getUserIndex,
} from '../functions/util.js';
import { lobbies } from '../index.js';

export const submitGuess = (io, socket) => {
  socket.on(
    'submitUserGuess',
    ({ userId, lobbyId, guess, points }, callback) => {
      const lobbyIndex = getLobbyIdIndex(lobbyId);
      if (lobbyIndex == -1) {
        return callback('Cannot find lobby.');
      }
      const userIndex = getUserIndex(lobbyIndex, userId);
      if (userIndex == -1) {
        return callback('Cannot find user in lobby.');
      }

      lobbies[lobbyIndex].users[userIndex].guess = guess;
      lobbies[lobbyIndex].users[userIndex].isGuessing = false;
      lobbies[lobbyIndex].users[userIndex].scoreAdded = points;
      lobbies[lobbyIndex].users[userIndex].score =
        lobbies[lobbyIndex].users[userIndex].score + points;

      io.to(lobbyId).emit('updateLobbyUsers', {
        users: lobbies[lobbyIndex].users,
      });

      if (checkUsersDoneGuessing(lobbyId)) {
        io.to(lobbyId).emit('lobbyDoneGuessing');
      }
    }
  );
};
