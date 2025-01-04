import { useState } from "react"
import { clsx } from "clsx"
import { languages } from "./languages"
import { getFarewellText } from "./utils"
import { randomWord } from "./utils"

export default function App() { 
    // State values
    const [currentWord, setCurrentWord] = useState(()=>randomWord())
    const [guessedLetters, setGuessedLetters] = useState([])

    // Derived values
    const wrongGuessCount =
        guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const isGameWon =
        currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length - 1
    const isGameOver = isGameWon || isGameLost
    const lastGuess = guessedLetters[guessedLetters.length -1]
    const isLastGuessIncorrect = lastGuess && ![...currentWord].includes(lastGuess)

    // Static values
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters =>
            prevLetters.includes(letter) ?
                prevLetters :
                [...prevLetters, letter]
        )
    }

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        const className = clsx("chip", isLanguageLost && "lost")
        return (
            <span
                className={className}
                style={styles}
                key={lang.name}
            >
                {lang.name}
            </span>
        )
    })

    const letterElements = currentWord.split("").map((letter, index) => {
        const missedClass = clsx({
            missedletter : isGameOver && !guessedLetters.includes(letter)})
      
        return <span className={missedClass} key={index}>
      {guessedLetters.includes(letter) || isGameOver ? letter.toUpperCase():""
       }
  </span>

       
     
    })

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })

        return (
            <button
            disabled = {isGameOver}
                className={className}
                key={letter}
                onClick={() => addGuessedLetter(letter)}
            >
                {letter.toUpperCase()}
            </button>
        )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell : isLastGuessIncorrect && !isGameOver
    })

    function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {

            return (
              <p className="farewell-message">
              {getFarewellText(languages[wrongGuessCount - 1].name)}
              </p>
            )
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        } 
        if(isGameLost) {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }
    }

    function newGame (){
      setGuessedLetters([])
      setCurrentWord(()=>randomWord())
    }

    return (
        <main>
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the
                programming world safe from Assembly!</p>
            </header>

            <section className={gameStatusClass}>
                {renderGameStatus()}
            </section>

            <section className="language-chips">
                {languageElements}
            </section>

            <section className="word">
                {letterElements}
            </section>

            <section className="keyboard">
                {keyboardElements}
            </section>

            {isGameOver && <button onClick={newGame} className="new-game">New Game</button>}
        </main>
    )
}
