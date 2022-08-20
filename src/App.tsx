import { useState } from "react";
import "./App.css";

function App() {
  const [gameOver, setGameOver] = useState(false);
  const [sortedCards, setSortedCards] = useState<number[]>([]);
  const [finalScore, setFinalScore] = useState(0);

  const reduceFunc = (total: number, current: number) => {
    return total + current;
  };

  const generateNewCard = () => {
    if (gameOver) return;

    const randNum = Math.ceil(Math.random() * 13);
    let sum;

    if (sortedCards.length > 0) {
      sum = sortedCards.reduce(reduceFunc) + randNum;
    } else {
      sum = randNum;
    }

    setSortedCards((prev) => {
      return [...prev, randNum];
    });

    if (sum > 21) {
      setFinalScore(sum);
      setGameOver(true);
    }
  };

  const sumScore = () => {
    if (gameOver) return;
    const sum = sortedCards.reduce(reduceFunc);
    setFinalScore(sum);
    setGameOver(true);
  };

  return (
    <div className="container">
      <div>
        <p>{gameOver && `Fim de jogo! Sua pontuação foi de ${finalScore}`}</p>
      </div>
      <div className="container_cards">
        <div className="deck" onClick={() => generateNewCard()}>
          DECK
        </div>
        <div className="card">
          {sortedCards.map((i, index) => {
            return (
              <div key={index}>
                <p>{i}, </p>
              </div>
            );
          })}
        </div>
      </div>

      <button
        className="button_stop"
        onClick={() => {
          sumScore();
        }}
      >
        Parar
      </button>
    </div>
  );
}

export default App;
