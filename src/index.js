import { createServer } from 'http';
import { Server } from 'socket.io';

import { createNewLobby } from './lobby/createNewLobby.js';
import { disconnect } from './standard/disconnect.js';
import { joinLobby } from './lobby/joinLobby.js';
import { leaveLobby } from './lobby/leaveLobby.js';
import { startGame } from './game/startGame.js';
import { startNewRound } from './game/startNewRound.js';
import { submitGuess } from './game/sumbitGuess.js';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://good-word-hunting.vercel.app'
        : 'http://localhost:3000',
  },
});

export const lobbies = [];

io.on('connection', (socket) => {
  createNewLobby(io, socket);
  disconnect(io, socket);
  joinLobby(io, socket);
  leaveLobby(io, socket);
  startGame(io, socket);
  startNewRound(io, socket);
  submitGuess(io, socket);
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});
