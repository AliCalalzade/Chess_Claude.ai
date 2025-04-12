import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// Satranç taşlarını temsil etmek için semboller
const pieces = {
  wP: '♙', // beyaz piyon
  wR: '♖', // beyaz kale
  wN: '♘', // beyaz at
  wB: '♗', // beyaz fil
  wQ: '♕', // beyaz vezir
  wK: '♔', // beyaz şah
  bP: '♟', // siyah piyon
  bR: '♜', // siyah kale
  bN: '♞', // siyah at
  bB: '♝', // siyah fil
  bQ: '♛', // siyah vezir
  bK: '♚', // siyah şah
};

const ChessGame = () => {
  // Oyun tahtasının başlangıç durumu
  const initialBoard = [
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [turn, setTurn] = useState('w'); // 'w' beyaz, 'b' siyah
  const [whiteKingPosition, setWhiteKingPosition] = useState([7, 4]);
  const [blackKingPosition, setBlackKingPosition] = useState([0, 4]);
  const [check, setCheck] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Kare seçildiğinde
  const selectSquare = (row, col) => {
    if (gameOver) return;

    // Eğer bir taş seçilmemişse ve seçilen kare boş değilse
    if (!selectedPiece && board[row][col] && board[row][col][0] === turn) {
      // Taşı seç
      setSelectedPiece({ row, col, piece: board[row][col] });
      // Geçerli hamleleri hesapla
      const moves = getValidMoves(row, col, board[row][col], board);
      setValidMoves(moves);
    } else if (selectedPiece) {
      // Eğer bir taş seçildiyse ve geçerli bir hareket yapılıyorsa
      const isValidMove = validMoves.some(move => move[0] === row && move[1] === col);

      if (isValidMove) {
        makeMove(selectedPiece.row, selectedPiece.col, row, col);
      } else if (board[row][col] && board[row][col][0] === turn) {
        // Farklı bir kendi taşını seçerse
        setSelectedPiece({ row, col, piece: board[row][col] });
        const moves = getValidMoves(row, col, board[row][col], board);
        setValidMoves(moves);
      } else {
        // Geçersiz bir hamle, seçimi temizle
        setSelectedPiece(null);
        setValidMoves([]);
      }
    }
  };

  // Bir taşı hareket ettirme
  const makeMove = (fromRow, fromCol, toRow, toCol) => {
    const newBoard = [...board.map(row => [...row])];
    const movingPiece = newBoard[fromRow][fromCol];

    // Şah pozisyonlarını güncelle
    if (movingPiece === 'wK') {
      setWhiteKingPosition([toRow, toCol]);
    } else if (movingPiece === 'bK') {
      setBlackKingPosition([toRow, toCol]);
    }

    // Piyonun vezire dönüşmesi kontrolü
    if (movingPiece === 'wP' && toRow === 0) {
      newBoard[toRow][toCol] = 'wQ'; // Beyaz piyon vezire dönüşür
    } else if (movingPiece === 'bP' && toRow === 7) {
      newBoard[toRow][toCol] = 'bQ'; // Siyah piyon vezire dönüşür
    } else {
      newBoard[toRow][toCol] = movingPiece;
    }

    newBoard[fromRow][fromCol] = null;
    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);

    // Sıra değişimi
    const nextTurn = turn === 'w' ? 'b' : 'w';
    setTurn(nextTurn);

    // Şah ve mat kontrolü
    setTimeout(() => {
      const kingPos = nextTurn === 'w' ? whiteKingPosition : blackKingPosition;
      const isInCheck = isKingInCheck(newBoard, nextTurn, kingPos[0], kingPos[1]);

      if (isInCheck) {
        setCheck(nextTurn);

        // Mat kontrolü
        const hasMoves = checkForAvailableMoves(newBoard, nextTurn);
        if (!hasMoves) {
          setGameOver(true);
          Alert.alert('Oyun Bitti', `${nextTurn === 'w' ? 'Siyah' : 'Beyaz'} Kazandı - Şah Mat!`);
        } else {
          Alert.alert('Şah!', `${nextTurn === 'w' ? 'Beyaz' : 'Siyah'} şahta!`);
        }
      } else {
        setCheck(null);

        // Pat durumu kontrolü (şahta değil ama hareket edemiyor)
        const hasMoves = checkForAvailableMoves(newBoard, nextTurn);
        if (!hasMoves) {
          setGameOver(true);
          Alert.alert('Oyun Bitti', 'Berabere - Pat!');
        }
      }
    }, 100);
  };

  // Şah kontrolü
  const isKingInCheck = (board, color, kingRow, kingCol) => {
    const opponentColor = color === 'w' ? 'b' : 'w';

    // Tahtadaki tüm karşı renkteki taşları bul
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece[0] === opponentColor) {
          const moves = getValidMoves(row, col, piece, board, true);
          // Eğer karşı renkteki herhangi bir taş şahı tehdit ediyorsa
          if (moves.some(move => move[0] === kingRow && move[1] === kingCol)) {
            return true;
          }
        }
      }
    }

    return false;
  };

  // Oyuncunun hala oynayabileceği hamleleri olup olmadığını kontrol et
  const checkForAvailableMoves = (board, color) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece[0] === color) {
          const moves = getValidMoves(row, col, piece, board);
          if (moves.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Taşlar için geçerli hamleleri hesapla
  const getValidMoves = (row, col, piece, currentBoard, checkingOnly = false) => {
    const moves = [];
    const pieceType = piece.substring(1);
    const pieceColor = piece[0];

    // Rakip rengi belirle
    const opponentColor = pieceColor === 'w' ? 'b' : 'w';

    // Piyon hareketleri
    if (pieceType === 'P') {
      const direction = pieceColor === 'w' ? -1 : 1;
      const startRow = pieceColor === 'w' ? 6 : 1;

      // İleri hareket
      if (row + direction >= 0 && row + direction < 8 && !currentBoard[row + direction][col]) {
        moves.push([row + direction, col]);

        // İlk hamle için çift ilerleme
        if (row === startRow && !currentBoard[row + 2 * direction][col]) {
          moves.push([row + 2 * direction, col]);
        }
      }

      // Çapraz yeme
      for (const dCol of [-1, 1]) {
        if (col + dCol >= 0 && col + dCol < 8 &&
          row + direction >= 0 && row + direction < 8 &&
          currentBoard[row + direction][col + dCol] &&
          currentBoard[row + direction][col + dCol][0] === opponentColor) {
          moves.push([row + direction, col + dCol]);
        }
      }
    }

    // Kale hareketleri
    if (pieceType === 'R' || pieceType === 'Q') {
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Yukarı, aşağı, sol, sağ

      for (const [dRow, dCol] of directions) {
        let newRow = row + dRow;
        let newCol = col + dCol;

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          if (!currentBoard[newRow][newCol]) {
            moves.push([newRow, newCol]);
          } else if (currentBoard[newRow][newCol][0] === opponentColor) {
            moves.push([newRow, newCol]);
            break;
          } else {
            break;
          }

          newRow += dRow;
          newCol += dCol;
        }
      }
    }

    // Fil hareketleri
    if (pieceType === 'B' || pieceType === 'Q') {
      const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]]; // Çaprazlar

      for (const [dRow, dCol] of directions) {
        let newRow = row + dRow;
        let newCol = col + dCol;

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          if (!currentBoard[newRow][newCol]) {
            moves.push([newRow, newCol]);
          } else if (currentBoard[newRow][newCol][0] === opponentColor) {
            moves.push([newRow, newCol]);
            break;
          } else {
            break;
          }

          newRow += dRow;
          newCol += dCol;
        }
      }
    }

    // At hareketleri
    if (pieceType === 'N') {
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];

      for (const [dRow, dCol] of knightMoves) {
        const newRow = row + dRow;
        const newCol = col + dCol;

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          if (!currentBoard[newRow][newCol] || currentBoard[newRow][newCol][0] === opponentColor) {
            moves.push([newRow, newCol]);
          }
        }
      }
    }

    // Şah hareketleri
    if (pieceType === 'K') {
      const kingMoves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];

      for (const [dRow, dCol] of kingMoves) {
        const newRow = row + dRow;
        const newCol = col + dCol;

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          if (!currentBoard[newRow][newCol] || currentBoard[newRow][newCol][0] === opponentColor) {
            // Şahın kendini şaha sokacak hareketleri engelle (basit kontrol)
            if (!checkingOnly) {
              const tempBoard = [...currentBoard.map(r => [...r])];
              tempBoard[newRow][newCol] = piece;
              tempBoard[row][col] = null;

              // Yeni pozisyonda şah kontrolü
              if (!isKingInCheck(tempBoard, pieceColor, newRow, newCol)) {
                moves.push([newRow, newCol]);
              }
            } else {
              moves.push([newRow, newCol]);
            }
          }
        }
      }
    }

    // Eğer şah kontrolü yapılmıyorsa, hamlenin şah kontrolünden çıkarıp çıkarmadığını kontrol et
    if (!checkingOnly && pieceType !== 'K') {
      return moves.filter(([toRow, toCol]) => {
        const tempBoard = [...currentBoard.map(r => [...r])];
        tempBoard[toRow][toCol] = piece;
        tempBoard[row][col] = null;

        const kingPos = pieceColor === 'w' ? whiteKingPosition : blackKingPosition;
        return !isKingInCheck(tempBoard, pieceColor, kingPos[0], kingPos[1]);
      });
    }

    return moves;
  };

  // Oyunu sıfırla
  const resetGame = () => {
    setBoard(initialBoard);
    setSelectedPiece(null);
    setValidMoves([]);
    setTurn('w');
    setWhiteKingPosition([7, 4]);
    setBlackKingPosition([0, 4]);
    setCheck(null);
    setGameOver(false);
  };

  // Bir karenin rengini belirle
  const getSquareColor = (row, col) => {
    const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
    const isValidMove = validMoves.some(move => move[0] === row && move[1] === col);
    const isCheck = (check === 'w' && row === whiteKingPosition[0] && col === whiteKingPosition[1]) ||
      (check === 'b' && row === blackKingPosition[0] && col === blackKingPosition[1]);

    if (isSelected) {
      return '#4a8fe2'; // Seçili kare mavi
    } else if (isValidMove) {
      return board[row][col] ? '#ff6b6b' : '#8eff8e'; // Geçerli hedef kare (yeme: kırmızı, boş: yeşil)
    } else if (isCheck) {
      return '#ff0000'; // Şah durumunda kırmızı
    } else {
      return (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863'; // Normal tahta deseni
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.turnText}>
        {gameOver ? "Oyun Bitti" : `Sıra: ${turn === 'w' ? 'Beyaz' : 'Siyah'}`}
        {check ? ` - ŞAH!` : ''}
      </Text>

      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((piece, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.square,
                  { backgroundColor: getSquareColor(rowIndex, colIndex) }
                ]}
                onPress={() => selectSquare(rowIndex, colIndex)}
              >
                <Text style={styles.piece}>
                  {piece ? pieces[piece] : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Oyunu Sıfırla</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  turnText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  board: {
    borderWidth: 2,
    borderColor: '#444',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  piece: {
    fontSize: 28,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#4a8fe2',
    padding: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChessGame;