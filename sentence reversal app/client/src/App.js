import React, { useState } from 'react';
import './App.css';

function App() {
    const [sentence, setSentence] = useState('');
    const [reversedSentence, setReversedSentence] = useState('');

    const handleSubmit = async () => {
      try {
          const response = await fetch('http://localhost:5000/reverse-sentence', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ sentence }),
          });
  
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          setReversedSentence(data.reversedSentence);
      } catch (error) {
          console.error('Error:', error);
          setReversedSentence('Error occurred. Please try again.');
      }
  };
  
    return (
        <div className="App">
            <h1>Sentence Reversal App</h1>
            <input
                type="text"
                placeholder="Enter a sentence"
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
            {reversedSentence && (
                <div>
                    <h2>Reversed Sentence:</h2>
                    <p>{reversedSentence}</p>
                </div>
            )}
        </div>
    );
}

export default App;
