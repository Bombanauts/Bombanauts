# Bombanauts

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg?)](http://bombanauts.herokuapp.com/) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?)](https://github.com/Bombanauts/Bombanauts/blob/master/LICENSE) [![Build Status](https://travis-ci.org/Bombanauts/Bombanauts.svg?branch=master)](https://travis-ci.org/Bombanauts/Bombanauts)

### Introduction
[Bombanauts](http://bombanauts.herokuapp.com/), inspired by the original [Bomberman](https://en.wikipedia.org/wiki/Bomberman) game, is a 3D multiplayer online battle arena (MOBA) game where players can throw bombs at each other, make boxes explode, and even other players! Bombs explode into a cross of fire down the aisles destroying crates that stand in their way. When the flames make contact with the wooden boxes (and players :smiling_imp:) they explode!

<img src="/public/assets/images/explosions.png" width=100%>

### Gameplay
Players spawn in the 4 different corners and must destroy crates to get to each other and fight till the last one is standing or the timer runs out. Each map is randomly generated for a unique game every time!

### Architecture
Bombanauts is built using [Three.js](https://threejs.org/) for 3D rendering and [Cannon.js](http://www.cannonjs.org/) as its physics engine, with [Node.js](https://nodejs.org/en/) and [Socket.io](http://socket.io/) to handle server-client interaction, dual [Redux](http://redux.js.org/) stores to handle game state on both the client and server sides, and [React.js](https://facebook.github.io/react/) for front end interfaces.

The server handles the master game state, and emits all bomb and player location data down to each player, as well as game logic and win conditions. Physics and rendering operations are then handled on the client side, with client side socket emissions for kills and destroying crates that update the master game state on the server.

### How Do I Play?
Your goal is to blow up the other players before they blow you up! Destroy crates to get to the other players and show no mercy!

### Controls
**Press** `WASD` to move around

**Press** `SPACE` to throw a high velocity bomb

**Click** to plant a bomb in front of you

**Press** `ENTER` to open the chat

**Press** ` (Back Tick) to close the chat

**Press** `ESC` to regain control of the cursor (and to see the instructions again)

**Click** the speaker image to mute and unmute the volume

**Move** the mouse to look around


### Tips and Tricks
- Be careful! You can kill yourself!
- If you aim carefully you can throw a bomb around a corner!
- You cannot throw bombs over walls, boxes, or boulders.
- You have a strong throwing arm. Throw bombs at other bombs to bounce them away.
- Bombs can bounce off of everything! (including other players and bombs!).
- The explosions from your bombs may give away your location to other players.
- Throwing bombs allows for distance, but planting bombs will give you more precision over where they are placed.

### Installation
If you want to play locally or modify our game we encourage it!

**Fork** and **clone** this repository.

Then insall the dependencies

```
npm install
```

Start webpack

```
npm run build-watch
```

To start the server

```
npm start
```

Then go to [http://localhost:1337/](http://localhost:1337/) and destroy!


### Special Thanks and Credits

Thank you to our teaching fellows [tessaSAC](https://github.com/tessaSAC), [leafoflegend](https://github.com/leafoflegend), and [babbins](https://github.com/babbins) for the consultations and project management.

Thank you to our Instructors [danceoval](https://github.com/danceoval) and [intersim](https://github.com/intersim) for the code feedback and reviews.

Thank you [yomotsu](https://github.com/yomotsu/VolumetricFire) for the awesome fire animation!

And finally thank you to [Agamari](https://github.com/kentywang/Agamari) for inspiring us to build a game! Check them out!

