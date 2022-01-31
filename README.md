# Good Word Hunting

### Description

This is the backend code for [Good Word Hunting](https://github.com/matthewdoles/good-word-hunting), the primary function of this backend is to host the [Socket.io](https://socket.io/) server which enables and manages multiplayer on the frontend.

### URL

Frontend Multiplayer: [https://good-word-hunting.vercel.app/multiplayer](https://good-word-hunting.vercel.app/multiplayer)

### Deployment

The backend is hosted on [Heroku](https://heroku.com/), and has CORS policies which only enable the frontend to communicate with it. Deployments can be manually triggered from within the project on Heroku or on commit/merge to the main branch.

### Design

This documentation will focus more so on the backend portions of multiplayer for Good Word Hunting. More thorough details on how the frontend interacts and consumes this backend can be found in it's dedicated repository: [https://github.com/matthewdoles/good-word-hunting](https://github.com/matthewdoles/good-word-hunting).

The backend can be broken into two distinct features:

#### Lobby

The frontend will intially start communicating with the backend when a user chooses to create or join a lobby - both scenarios having their own listener events in the backend.

When creating a new lobby, it will create a new lobby and randomly generate a unique lobby code, add the requesting user to that lobby, and emit events back to the frontend with the newly generated lobby information. When joining a new lobby, the unique code lobby is entered in a frontend form which is then present in the event listener parameters. The code is used to add the requesting user to the existing lobby. Likewise, events are emitted back to the frontend w/ information confirming the user was added to the lobby - and information on the game if it already happens to be in progress.

In regards to managing lobbies, their is also events to listen when a user leaves a lobby whether it be manually (leaveLobby.js) or disconnecting from the socket entirely via something like a page refresh (disconnect.js). In both scenarios, the user is removed from the lobbies array of users. Then the lobby is checked if it has no users in it - if the lobby is empty it is removed allowing it to be reused in the future and keeping the running list of active lobbies clean. If the lobby is not empty, the lobby is checked to ensure an admin is present. The admin is the only user in the frontend as of now that can control when the game or new round is started. If the admin leaves, a new admin is appointed and the lobby informed.

#### Game

The backend has two highly similar event listeners which initiate the start of the game (startGame.js) or new round (startNewRound.js). The primary differnece being, the start game will indicate to the frontend that they will no longer be in the pre-game lobby awaiting game start. When starting a new round, the current round number is incremented where as it is not in startGame.js. In addition, all the users isGuessing state is set back to true which is an inidicator to notify the frontend when all users are done guessing.

Which leads into the final event listener: submitting a guess (submitGuess.js). This event listener records the users guess, new point total, and updates their isGuessing indicator to false. In the frontend, the user will be shown UI to indicate if other users are still guessing. On every sumbit guess, the last thing it will do is check if all users in the lobby are done guessing and then emit an event to the frontend when the lobby is done guessing. At that point, each user in the frontend has the game results not only for their individual guess, but all users in the lobby and is shared via a post-round screen.
