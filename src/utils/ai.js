
import { isValidMove } from './gameLogic';


const PIECE_VALUES = {
  pawn: 10,
  knight: 30,
  bishop: 30,
  rook: 50,
  queen: 90,
  king: 900
};

const evaluateBoard = (board) => {
  let score = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const value = PIECE_VALUES[piece.type];
        
        score += piece.color === 'black' ? value : -value;
      }
    }
  }
  
  return score;
};


const getAllPossibleMoves = (gameState, player) => {
  const { board } = gameState;
  const moves = [];
  
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (piece && piece.color === player) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(gameState, { row: fromRow, col: fromCol }, { row: toRow, col: toCol })) {
              moves.push({
                from: { row: fromRow, col: fromCol },
                to: { row: toRow, col: toCol },
                piece: piece.type
              });
            }
          }
        }
      }
    }
  }
  
  return moves;
};


const simulateMove = (gameState, move) => {
  const newBoard = gameState.board.map(row => [...row]);
  const piece = newBoard[move.from.row][move.from.col];
  
  newBoard[move.to.row][move.to.col] = piece;
  newBoard[move.from.row][move.from.col] = null;
  
  return {
    board: newBoard,
    currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white'
  };
};


export const makeAIMove = (gameState) => {
  const possibleMoves = getAllPossibleMoves(gameState, 'black');
  if (possibleMoves.length === 0) return null;

  
  const capturingMoves = possibleMoves.filter(move => {
    const targetPiece = gameState.board[move.to.row][move.to.col];
    return targetPiece && targetPiece.color === 'white';
  });

  
  if (capturingMoves.length > 0) {
    capturingMoves.sort((a, b) => {
      const aValue = gameState.board[a.to.row][a.to.col] 
        ? PIECE_VALUES[gameState.board[a.to.row][a.to.col].type] 
        : 0;
      const bValue = gameState.board[b.to.row][b.to.col] 
        ? PIECE_VALUES[gameState.board[b.to.row][b.to.col].type] 
        : 0;
      return bValue - aValue; 
    });
    
    
    return capturingMoves[0];
  }


  const checkingMoves = possibleMoves.filter(move => {
    const newState = simulateMove(gameState, move);

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = newState.board[row][col];
        if (piece && piece.type === 'king' && piece.color === 'white') {
          return true;
        }
      }
    }
    return false;
  });

  if (checkingMoves.length > 0) {
    return checkingMoves[Math.floor(Math.random() * checkingMoves.length)];
  }


  const developingMoves = possibleMoves.filter(move => 
    ['knight', 'bishop', 'queen'].includes(move.piece) &&
    move.from.row >= 6 && 
    move.to.row <= 5     
  );

  if (developingMoves.length > 0) {
    return developingMoves[Math.floor(Math.random() * developingMoves.length)];
  }


  return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
};