const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const { addUser, removeUser, getUsersInRoom } = require('./functions/users');
const { generateRoomNumber } = require('./functions/util');

io.on('connection', (socket) => {
  socket.on('createRoom', (username, callback) => {
    const roomNumber = generateRoomNumber(4);
    const { error, user } = addUser({
      id: socket.id,
      username,
      room: roomNumber,
    });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on('joinRoom', (userInfo, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      username: userInfo.username,
      room: userInfo.roomNumber,
    });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

httpServer.listen(8080, () => {
  console.log('listening on *:8080');
});
