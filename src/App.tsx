import { useEffect, useState } from "react";
import pokerCard from "./images/pokerCard.svg";
import axios from "axios";
import "./App.css";

interface DeckTypes {
  deckId: string;
}

interface CardType {
  code: string;
  image: string;
  value: number;
}

function App() {
  const [gameOver, setGameOver] = useState(false);
  const [sortedCards, setSortedCards] = useState<CardType[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [deck, setDeck] = useState("");

  useEffect(() => {
    const getInitialDeck = async () => {
      const deckRequest = await axios.post("http://localhost:8080/deck");
      const deck: DeckTypes = deckRequest.data;
      setDeck(deck.deckId);
    };

    getInitialDeck();
  }, [setDeck]);

  const reduceFunc = (total: number, current: number) => {
    return total + current;
  };

  const generateNewCard = async () => {
    if (gameOver) return;

    const cardRequest = await axios.get(`http://localhost:8080/card/${deck}`);

    const newCard: CardType = cardRequest.data.card;

    const newState = [...sortedCards, newCard];

    const cardsValue = newState.map((i) => {
      return i.value;
    });

    setSortedCards((prev) => {
      return [...prev, newCard];
    });

    const sum = cardsValue.reduce(reduceFunc);

    if (sum > 20) {
      setFinalScore(sum);
      setGameOver(true);
      await axios.delete(`http://localhost:8080/deck/${deck}`);
    }
  };

  const sumScore = async () => {
    if (gameOver) return;

    const cardsValue = sortedCards.map((i) => {
      return i.value;
    });
    const sum = cardsValue.reduce(reduceFunc);

    setFinalScore(sum);
    setGameOver(true);

    await axios.delete(`http://localhost:8080/deck/${deck}`);
  };

  const rules = () => {
    if (finalScore === 21) {
      return `Parabéns! Você conseguiu a pontuação perfeita de 21 pontos!`;
    } else if (finalScore >= 18 && finalScore < 21) {
      return `Parabéns! Você venceu com ${finalScore} pontos!`;
    } else if (finalScore < 18) {
      return `Você perdeu! Você conseguiu apenas ${finalScore} pontos!`;
    } else {
      return `Você perdeu! Você fez um total de ${finalScore} pontos!`;
    }
  };

  return (
    <div className="container">
      <div className="container_cards">
        <div
          className={gameOver ? "deck end" : "deck"}
          onClick={() => generateNewCard()}
        >
          <img src={pokerCard} alt="poker-deck-card" />
        </div>
        <div className={gameOver ? "card end" : "card"}>
          {sortedCards.map((i, index) => {
            return (
              <div className="single_card" key={index}>
                <img src={i.image} alt={i.code} />
              </div>
            );
          })}
        </div>
      </div>

      <div className={finalScore > 21 ? "message fail" : "message"}>
        <p>{gameOver && rules()}</p>
      </div>

      <div className="buttons">
        <button
          className={gameOver ? "button_stop btn_end" : "button_stop"}
          disabled={gameOver ? true : false}
          onClick={() => {
            sumScore();
          }}
        >
          Parar
        </button>
        <button
          className="button_reload"
          onClick={() => {
            window.location.reload();
          }}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}

export default App;
