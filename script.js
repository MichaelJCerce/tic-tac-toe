const gameBoard = (function () {
  let currentPlayer = 0;
  const currentState = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const getCurrentPlayer = function () {
    let temp = currentPlayer;
    currentPlayer = (currentPlayer + 1) % 2;
    return temp;
  };

  const print = function () {
    for (let i = 0; i < currentState.length; ++i) {
      const row = [];
      for (let j = 0; j < currentState[0].length; ++j) {
        row.push(currentState[i][j]);
      }
      console.log(row);
    }
    console.log("=========================");
  };

  const reset = function () {
    currentPlayer = 0;
    for (let i = 0; i < this.currentState.length; ++i) {
      for (let j = 0; j < this.currentState[0].length; ++j) {
        this.currentState[i][j] = null;
      }
    }
  };

  return { currentState, getCurrentPlayer, print, reset };
})();

const gameController = (function () {
  const checkTie = function (currentState) {
    for (let i = 0; i < currentState.length; ++i) {
      for (let j = 0; j < currentState[0].length; ++j) {
        if (currentState[i][j] === null) {
          return false;
        }
      }
    }
    return true;
  };

  const checkWin = function (currentState) {
    for (let i = 0; i < currentState.length; ++i) {
      for (let j = 0; j < currentState[0].length; ++j) {
        if (
          currentState[i][j] === null ||
          currentState[i][j] !== currentState[i][0]
        ) {
          break;
        }
        if (j === currentState[0].length - 1) {
          return true;
        }
      }
    }

    for (let i = 0; i < currentState.length; ++i) {
      for (let j = 0; j < currentState[0].length; ++j) {
        if (
          currentState[j][i] === null ||
          currentState[j][i] !== currentState[0][i]
        ) {
          break;
        }
        if (j === currentState[0].length - 1) {
          return true;
        }
      }
    }

    for (let i = 0; i < currentState.length; ++i) {
      if (
        currentState[i][i] === null ||
        currentState[i][i] !== currentState[0][0]
      ) {
        break;
      }

      if (i === currentState.length - 1) {
        return true;
      }
    }

    for (let i = 0; i < currentState.length; ++i) {
      if (
        currentState[i][currentState[0].length - 1 - i] === null ||
        currentState[i][currentState[0].length - 1 - i] !==
          currentState[0][currentState[0].length - 1]
      ) {
        break;
      }

      if (i === currentState.length - 1) {
        return true;
      }
    }

    return false;
  };

  const makeMove = function (currentState, currentPlayer, boardSpot) {
    if (
      boardSpot[0] < 0 ||
      boardSpot[0] >= currentState.length ||
      boardSpot[1] < 0 ||
      boardSpot[1] >= currentState[0].length
    ) {
      return false;
    }
    if (currentState[boardSpot[0]][boardSpot[1]] === null) {
      currentState[boardSpot[0]][boardSpot[1]] = currentPlayer.mark;
      return true;
    } else {
      return false;
    }
  };

  return { checkTie, checkWin, makeMove };
})();

function createUser(name, mark) {
  return { name, mark };
}

const steve = createUser("Steve", "x");
const bob = createUser("Bob", "o");
const players = [steve, bob];
while (true) {
  const currentPlayer = players[gameBoard.getCurrentPlayer()];
  let response = prompt(`${currentPlayer.name}'s turn`);
  if (!response) {
    break;
  }
  while (
    !gameController.makeMove(
      gameBoard.currentState,
      currentPlayer,
      response.split(",")
    )
  ) {
    response = prompt(`${currentPlayer.name}'s turn`);
  }

  gameBoard.print();

  if (
    gameController.checkWin(gameBoard.currentState) ||
    gameController.checkTie(gameBoard.currentState)
  ) {
    if (gameController.checkWin(gameBoard.currentState)) {
      console.log(`${currentPlayer.name} wins!`);
    } else {
      console.log("Tie!");
    }

    response = prompt("play again?[y/n]");
    if (response === "y") {
      gameBoard.reset();
    } else {
      break;
    }
  }
}
