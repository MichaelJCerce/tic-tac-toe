const gameBoard = (function () {
  let currentPlayer = 0;
  const currentState = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  let gameStarted = false;
  const players = [];

  const getCurrentPlayer = function () {
    return players[currentPlayer];
  };

  const getCurrentState = function () {
    return currentState;
  };

  const isGameStarted = function () {
    return gameStarted;
  };

  const resetState = function () {
    currentPlayer = 0;
    for (let i = 0; i < currentState.length; ++i) {
      for (let j = 0; j < currentState[0].length; ++j) {
        currentState[i][j] = null;
      }
    }
    gameStarted = false;
    players.pop();
    players.pop();
  };

  const setCurrentPlayer = function () {
    currentPlayer = (currentPlayer + 1) % 2;
  };

  const setCurrentState = function (row, col, mark) {
    currentState[row][col] = mark;
  };

  const startGame = function (playerX, playerO) {
    players.push(playerX);
    players.push(playerO);
    gameStarted = true;
  };

  return {
    getCurrentPlayer,
    getCurrentState,
    isGameStarted,
    resetState,
    setCurrentPlayer,
    setCurrentState,
    startGame,
  };
})();

const gameController = (function () {
  const isTie = function (currentState) {
    for (let i = 0; i < currentState.length; ++i) {
      for (let j = 0; j < currentState[0].length; ++j) {
        if (currentState[i][j] === null) {
          return false;
        }
      }
    }

    return true;
  };

  const isWin = function (currentState) {
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

  const makeMove = function (board, boardSpace) {
    const currentState = board.getCurrentState();
    const [row, col] = boardSpace.dataset.cell.split(",");
    if (
      !board.isGameStarted() ||
      currentState[row][col] !== null ||
      isTie(currentState) ||
      isWin(currentState)
    ) {
      return;
    }

    const player = board.getCurrentPlayer();

    gameBoard.setCurrentState(row, col, player.mark);
    displayController.markSpot(boardSpace, player.mark);

    if (isWin(currentState)) {
      displayController.setWinStatus(player);
    } else if (isTie(currentState)) {
      displayController.setTieStatus();
    } else {
      board.setCurrentPlayer();
      displayController.setPlayerStatus(board.getCurrentPlayer());
    }
  };

  const resetGame = function (board) {
    board.resetState();
  };

  const startGame = function (board, playerXName, playerOName) {
    if (board.isGameStarted()) {
      return;
    }

    const playerX = createUser(playerXName.trim(), "x");
    const playerO = createUser(playerOName.trim(), "o");

    board.startGame(playerX, playerO);
    displayController.setPlayerStatus(playerX);
  };

  return {
    makeMove,
    resetGame,
    startGame,
  };
})();

const displayController = (function () {
  const spaces = document.querySelectorAll(".space");
  const start = document.querySelector(".start");
  const reset = document.querySelector(".reset");
  const playerX = document.querySelector("#player-x");
  const playerO = document.querySelector("#player-o");
  const gameStatus = document.querySelector(".game-status");

  spaces.forEach((spot) => {
    spot.addEventListener("click", () => {
      gameController.makeMove(gameBoard, spot);
    });
  });

  start.addEventListener("click", function (e) {
    e.preventDefault();

    if (playerX.value === "" && playerO.value === "") {
      gameStatus.textContent = "need to give each player a name";
    } else if (playerX.value === "") {
      gameStatus.textContent = "need to give player x a name";
    } else if (playerO.value === "") {
      gameStatus.textContent = "need to give player o a name";
    } else if (playerX.value.trim() === playerO.value.trim()) {
      gameStatus.textContent = "players must have different names";
    } else {
      playerX.disabled = true;
      playerO.disabled = true;
      gameController.startGame(gameBoard, playerX.value, playerO.value);
    }
  });

  reset.addEventListener("click", function (e) {
    e.preventDefault();

    gameController.resetGame(gameBoard);
    spaces.forEach((spot) => {
      spot.textContent = "";
    });
    playerX.disabled = false;
    playerO.disabled = false;
    gameStatus.textContent = "";
  });

  const markSpot = function (spot, mark) {
    spot.textContent = mark;
  };

  const setPlayerStatus = function (currentPlayer) {
    if (currentPlayer.name[currentPlayer.name.length - 1] === "s") {
      gameStatus.textContent = `${currentPlayer.name}' turn`;
    } else {
      gameStatus.textContent = `${currentPlayer.name}'s turn`;
    }
  };

  const setTieStatus = function () {
    gameStatus.textContent = "Tie!";
  };

  const setWinStatus = function (currentPlayer) {
    gameStatus.textContent = `${currentPlayer.name} wins!`;
  };

  return { markSpot, setPlayerStatus, setTieStatus, setWinStatus };
})();

function createUser(name, mark) {
  return { name, mark };
}
