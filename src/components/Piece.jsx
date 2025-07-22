
import './Piece.css';

const Piece = ({ type, color }) => {

  const pieceSymbols = {
    king: { white: '♔', black: '♚' },
    queen: { white: '♕', black: '♛' },
    rook: { white: '♖', black: '♜' },
    bishop: { white: '♗', black: '♝' },
    knight: { white: '♘', black: '♞' },
    pawn: { white: '♙', black: '♟' },
  };

  return (
    <div className={`piece ${color}`}>
      {pieceSymbols[type][color]}
    </div>
  );
};

export default Piece;