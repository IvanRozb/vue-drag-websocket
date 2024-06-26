# Vue Interactive Workspace & WebSocket Project

This project implements an interactive workspace and real-time interaction with a server using the WebSocket protocol.
Project deployed at vercel: [Vue Drag & WebSocket](https://vue-drag-websocket.vercel.app/)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Type check

```sh
npm run type-check
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Format with [Prettier](https://prettier.io/)

```sh
npm run format
```

## Interactive workspace

### Libraries/resources used:
- ```vue-konva/konva``` - the library that provides system for handling interactive movement, resizing of blocks. One of the most popular libraries for canvas handling.
- ```localstorage``` - the build-in solution that provides the way to store the data, so it would be restores if browser is closed/updated
- ```vuex``` - one of the most popular state-management library for Vue

### Algorithms and Data Structures
In this section I used an array as the main data structure as it stores the data about list of blocks which user interacts with.
<br/>
Because Vue renders components based on tree placement, I changed the way simple Konva projects handle zIndex.
<br/>
Instead, when user selects the block I manually removing this block from an array and place it as the first one.
<br/>
Because this array is reactive, the DOM is updating too, rendering the block first and making an effect of changing layers.
<br/>
<br/>
Also, the transforms are all made by ```DISCRETE_UNIT```(default: 50) in Konva, so each transformation is rounded by that unit.
<br/>
<br/>
Setting and getting by key from localstorage is also implemented.
<br/>
<br/>
And other algorithms are implemented such as removing, restoring the item from an array.

## Interaction with the server using the WebSocket protocol

### Libraries/resources used:
- ```websocket-ts``` - provide typescript version of build-in WebSocket
- [Blockchain WebSocket API](https://www.blockchain.com/explorer/api/api_websocket) - the API used for getting unsubscribed transactions data
- ```vuex``` - one of the most popular state-management library for Vue

### Algorithms and Data Structures
In this section I used only an array as the only data structure as the user need to see only the list of transactions.
<br/>
<br/>
In this section I used pushing item to an array and clearing an array as two main algorithms.

## Additional info
Also for navigation between sections I made its own component that uses ```vue-router``` library and home section as an entry point.
