import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  // State to hold the value of the health input
  const [healthValue, setHealthValue] = useState(100);

  // Function to update the health range input when the number input changes
  const updateRangeFromNumber = (value) => {
    setHealthValue(value);
  };

  // Function to update the health number input when the range input changes
  const updateNumberFromRange = (event) => {
    const value = event.target.value;
    setHealthValue(value);
  };

  // Function to validate and enforce the 1-100 range for the health number input
  const validateHealthNumber = (value) => {
    if (value >= 1 && value <= 100) {
      updateNumberFromRange({ target: { value } });
    } else {
      // Display a pop-up message
      alert("Health % must be in the range 1-100");
    }
  };

  // Set up an event listener to update the number input when the range input changes
  useEffect(() => {
    const healthRange = document.getElementById("healthRange");
    healthRange.addEventListener("input", updateNumberFromRange);
    return () => {
      healthRange.removeEventListener("input", updateNumberFromRange);
    };
  }, []);

  // State to hold the value of the level input
  const [levelValue, setLevelValue] = useState(1);

  // Function to update the level input value
  const updateLevelValue = (value) => {
    if (value >= 1 && value <= 100) {
      setLevelValue(value);
    } else {
      // Display a pop-up message
      alert("Level must be in the range 1-100");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <strong>Pokemon Catch Rate Calculator</strong>
        </h1>
        <form>
          <label>Pokemon</label> <label>Level</label><br></br>
          <input type="text" name="pokemon" placeholder="Example: Bulbasaur"/>
          <input
            type="number"
            name="level"
            min="1"
            max="100"
            value={levelValue}
            onInput={(e) => updateLevelValue(parseInt(e.target.value, 10))}
          /> <br></br>

          <label for="health">Health %</label> <br></br>
          <input
            type="range"
            id="healthRange"
            name="health"
            min="1"
            max="100"
            value={healthValue}
            onInput={(e) => updateRangeFromNumber(e.target.value)}
          />
          <input
            type="number"
            id="healthNumber"
            name="health"
            min="1"
            max="100"
            value={healthValue}
            placeholder="%"
            onInput={(e) => validateHealthNumber(parseInt(e.target.value, 10))}
          /> <br></br>

          <label for="ball">Ball</label> <br></br>
          <input list="balls" name="ball" placeholder="Example: Poke Ball"/>
          <datalist id="balls">
            <option value="Poke Ball"></option>
            <option value="Great Ball"></option>
            <option value="Ultra Ball"></option>
          </datalist> <br></br>

          <label for="statuses">Status</label> <br></br>
          <input list="statuses" name="status" placeholder="Example: Burn"/>
          <datalist id="statuses">
            <option value="Burn"></option>
            <option value="Freeze"></option>
            <option value="Paralysis"></option>
            <option value="Poison"></option>
            <option value="Sleep"></option>
          </datalist> <br></br>

          <label for="calc">Show Calculations</label>
          <input type="checkbox" value="calc"/> <br></br>

          <p>Results to be implemented</p>
        </form>

        <p>
          © John Tran <a href="https://github.com/johnyu013/cs361-project">Update Logs</a>
        </p>
      </header>
    </div>
  );
}

export default App;
