console.log('Welcome to the Tic-Tac-Toe console')

// Two Player Characters
const playerCharacters = ['X', 'O']

// Current Player Character - Starts as the Starting Character
// Will need to add ability to pick character
let currentPlayerCharacterIndex = 0

// Game Board - 3x3 Grid
let gameBoard

// How many moves have been made in a game
let movesMade = 0

// Initialize a winner variable
let winner = false

// Function to initialize the game board as needed
function initializeGameBoard () {
  gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
}

// Function to display the player turn information
function displayPlayerTurn () {
  const playerTurnElement = document.getElementById('playerTurn')

  const gameIsOver = !canMakeMove()
  if (gameIsOver) {
    if (winner) {
      playerTurnElement.textContent = `Winner: ${winner}`
    } else {
      playerTurnElement.textContent = 'Tie Game'
    }
  } else {
    playerTurnElement.textContent = `Current Player: ${playerCharacters[currentPlayerCharacterIndex]}`
  }
}

// a few functions to check each way for a winner
function checkColumnForWinner (columnIndex) {
  // will need to be all the same character
  const playerCharacter = gameBoard[0][columnIndex]
  if (!playerCharacter) {
    // '' is falsy so we can check like this
    return false
  }
  // scan the column in a loop
  for (let i = 0; i < 3; i++) {
    if (playerCharacter !== gameBoard[i][columnIndex]) {
      return false
    }
  }
  return playerCharacter
}

function checkRowForWinner (rowIndex) {
  // will need to be all the same character
  const playerCharacter = gameBoard[rowIndex][0]
  if (!playerCharacter) {
    // '' is falsy so we can check like this
    return false
  }
  // scan the row in a loop
  for (let i = 0; i < 3; i++) {
    if (playerCharacter !== gameBoard[rowIndex][i]) {
      return false
    }
  }
  return playerCharacter
}

function checkLeftToRightTopToBottomDiagonalForWinner () {
  // will need to be all the same character
  const playerCharacter = gameBoard[0][0]
  if (!playerCharacter) {
    // '' is falsy so we can check like this
    return false
  }
  // scan the diagonal in a loop
  for (let i = 0; i < 3; i++) {
    if (playerCharacter !== gameBoard[i][i]) {
      return false
    }
  }
  return playerCharacter
}

function checkLeftToRightBottomToTopDiagonalForWinner () {
  // will need to be all the same character
  const playerCharacter = gameBoard[0][2]
  if (!playerCharacter) {
    // '' is falsy so we can check like this
    return false
  }
  // scan the diagonal in a loop
  for (let i = 0; i < 3; i++) {
    if (playerCharacter !== gameBoard[i][2 - i]) {
      return false
    }
  }
  return playerCharacter
}

// function to check all ways for a winner
function checkForWinner (rowIndex, columnIndex) {

  // check if we have a winner in the given row
  const rowWinner = checkRowForWinner(rowIndex)
  if (rowWinner) {
    return rowWinner
  }
  // check if we have a winner in the given column
  const columnWinner = checkColumnForWinner(columnIndex)
  if (columnWinner) {
    return columnWinner
  }

  // then the diagonals
  return (
    checkLeftToRightTopToBottomDiagonalForWinner() ||
    checkLeftToRightBottomToTopDiagonalForWinner() ||
    false
  )
}

// check if we are able to make any more moves, if not the game is over
function canMakeMove () {
  return movesMade < 9 && !winner
}

function matchDisplayBoardToGameBoard () {
  const gameIsOver = !canMakeMove()
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const button = document.querySelector(
        `table tr:nth-child(${i + 1}) td:nth-child(${j + 1}) button`
      )
      button.textContent = gameBoard[i][j]
      button.disabled = gameBoard[i][j] || gameIsOver
      button.parentElement.ariaLabel = `Row ${i + 1}, Column ${j + 1} - ${
        gameBoard[i][j] || 'Not Yet Played'
      }`
    }
  }
}

function makeMove (rowIndex, columnIndex) {
  // game already over
  if (!canMakeMove()) {
    return false
  }
  // space already taken
  if (gameBoard[rowIndex][columnIndex]) {
    return false
  }
  // make the move
  gameBoard[rowIndex][columnIndex] =
    playerCharacters[currentPlayerCharacterIndex]

  // let move counter go up
  movesMade++

  // check if that move was a winner
  winner = checkForWinner(rowIndex, columnIndex)

  // change player
  currentPlayerCharacterIndex = (currentPlayerCharacterIndex + 1) % 2
  matchDisplayBoardToGameBoard()
  displayPlayerTurn()
  return true
}

// Function to create the innards of the table displaying our game board
function createBoardTableCells () {
  // Grab the table element
  const boardTable = document.querySelector('table')
  for (let row = 0; row < 3; row++) {
    // create three rows
    const tableRow = document.createElement('tr')
    tableRow.setAttribute('role', 'row')
    for (let col = 0; col < 3; col++) {
      // and three columns
      const tableCell = document.createElement('td')
      // while we were researching, we found since it is td already we don't need to do this
      // however the accessible-table-grid.js still needs gridcell for looking things up
      // we could make it look for td instead, but will just add the gridcell role
      tableCell.setAttribute('role', 'gridcell')
      // add the row and col attributes for the accessible-table-grid.js
      // tableCell.dataset.col = col
      // tableCell.dataset.row = row
      // make a button for this cell
      const button = document.createElement('button')
      button.setAttribute('type', 'button')
      // no tabbing directly to the button, but instead to the table cell
      button.setAttribute('tabindex', '-1')
      // want to still be able to click and make something happen
      button.setAttribute('onclick', `makeMove(${row}, ${col})`);

      tableCell.appendChild(button)
      tableRow.appendChild(tableCell)
    }
    boardTable.appendChild(tableRow)
  }
}

createBoardTableCells()

function newGame (startingCharacter) {
  initializeGameBoard()
  // reset how many moves have been made
  movesMade = 0
  // reset the winner
  winner = false
  currentPlayerCharacterIndex = playerCharacters.indexOf(startingCharacter)
  // make a default first player if not passed in
  if(currentPlayerCharacterIndex === -1) {
    currentPlayerCharacterIndex = 0
  }
  displayPlayerTurn()
  matchDisplayBoardToGameBoard()
}

newGame('X')
