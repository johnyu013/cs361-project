import React, { useState, useEffect, Component } from 'react';
import axios from 'axios';
import formulaImage from './formula.svg';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    console.error('Error caught by boundary:', error, errorInfo);
    // You can log the error or perform other actions here
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong. Please try again.</p>;
      // You can customize the fallback UI here
    }

    return this.props.children;
  }
}

function App() {
  // State to hold the value of the health input
  const [healthValue, setHealthValue] = useState(100);

  // State to hold the Pokemon data, including the image URL
  const [pokemonData, setPokemonData] = useState(null);

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
      alert("Health % must be in the range -100");
    }
  };

  useEffect(() => {
    const pokemonInput = document.getElementById("pokemonInput");

    const handleInputBlur = async () => {
      const pokemonName = pokemonInput.value.trim();
      if (pokemonName !== '') {
        try {
          const response = await axios.get(`http://localhost:3001/pokemon/${pokemonName.toLowerCase()}`);

          console.log('API Response:', response);

          // Check if the response contains the expected data structure
          if (response.data && response.data.image) {
            setPokemonData({
              name: response.data.name,
              image: response.data.image,
              weight: response.data.weight
              // Add other properties as needed
            });
          } else {
            console.error('Invalid data structure in API response:', response);
            setPokemonData(null);
          }
          
        } catch (error) {
          console.error('Error fetching Pokemon data:', error);
          console.log('Error response:', error.response); // Log the error response
          setPokemonData(null);
        }
      } else {
        setPokemonData(null);
      }
    };

    pokemonInput.addEventListener("blur", handleInputBlur);

    return () => {
      pokemonInput.removeEventListener("blur", handleInputBlur);
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

  // State to hold the selected Pokeball
  const [selectedBall, setSelectedBall] = useState('Poke Ball');

  // Object to store ball rates
  const ballRates = {
    'Poke Ball': 0.75,
    'Great Ball': 1.5,
    'Ultra Ball': 2.25,
  };

  // State to hold the calculated ball rate
  const [ballRate, setBallRate] = useState(ballRates['Poke Ball']);

  // Function to update the selected Pokeball and calculate the ball rate
  const updateSelectedBall = (event) => {
    const selectedBall = event.target.value;
    setSelectedBall(selectedBall);
    setBallRate(ballRates[selectedBall]);
  };

  // State to hold the selected status
  const [selectedStatus, setSelectedStatus] = useState('None');

  // Object to store status rates
  const statusRates = {
    'None': 1, // Add a default value for 'None
    'Burn': 1.5,
    'Freeze': 2,
    'Paralysis': 1.5,
    'Poison': 1.5,
    'Sleep': 2,
  };

  // State to hold the calculated status rate
  const [statusRate, setStatusRate] = useState(statusRates['None']);

  // Function to update the selected status and calculate the status rate
  const updateSelectedStatus = (event) => {
    const selectedStatus = event.target.value;
    setSelectedStatus(selectedStatus);
    setStatusRate(statusRates[selectedStatus]);
  };

  // State to hold the value of the "Show More Info" checkbox
  const [showInfo, setShowInfo] = useState(false);

  // Function to toggle the "Show More Info" checkbox state
  const toggleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  // Function to calculate the result based on the formula
  const calculateResult = () => {
    // Ensure all required values are available
    if (ballRate && statusRate && healthValue && pokemonData && pokemonData.weight) {
      const result = (((3 * 100 - 2 * healthValue) / (3 * 100)) * pokemonData.weight * ballRate * statusRate) / 255;
      return result.toFixed(2); // Adjust decimal places as needed
    }

    return "N/A"; // Display "N/A" if any value is missing
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>
            <strong>Pokemon Catch Rate Calculator using its weight instead!</strong>
          </h1>
          <form>
            <label>Pokemon</label> <label>Level</label><br></br>
            <input
              type="text"
              name="pokemon"
              placeholder="Pikachu"
              id="pokemonInput"  // Add an id for the Pokemon name input
            />
            <input
              type="number"
              name="level"
              min="1"
              max="100"
              value={levelValue}
              onInput={(e) => updateLevelValue(parseInt(e.target.value, 10))}
            /> <br></br>

            <label htmlFor="health">Health %</label> <br></br>
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

            <label htmlFor="ball">Ball</label> <br></br>
            <select
              id="ballSelect"
              name="ball"
              value={selectedBall}
              onChange={updateSelectedBall}
            >
              <option value="Poke Ball">Poke Ball</option>
              <option value="Great Ball">Great Ball</option>
              <option value="Ultra Ball">Ultra Ball</option>
            </select> <br></br>

            <label htmlFor="statuses">Status</label> <br></br>
            <select
              id="statusSelect"
              name="status"
              value={selectedStatus}
              onChange={updateSelectedStatus}
            >
              <option value="None">None</option>
              <option value="Burn">Burn</option>
              <option value="Freeze">Freeze</option>
              <option value="Paralysis">Paralysis</option>
              <option value="Poison">Poison</option>
              <option value="Sleep">Sleep</option>
            </select> <br></br>

            <label htmlFor="calc">Show More Info</label>
            <input
              type="checkbox"
              id="showInfoCheckbox"
              checked={showInfo}
              onChange={toggleShowInfo}
            /> <br></br>

            {pokemonData && pokemonData.image && (
              <img src={pokemonData.image} alt="Pokemon" />
            )}

            {showInfo && (
              <>
                <img src={formulaImage} alt="Formula" />
                <p>Ball Rate: {ballRate}</p>
                <p>Status Rate: {statusRate}</p>
              </>
            )}

            <p>Calculation Result: {calculateResult()}%</p>

          </form>

          <p>
            © John Tran <a href="https://github.com/johnyu013/cs361-project">Update Logs</a>
          </p>
        </header>
      </div>
    </ErrorBoundary>
  );
}

export default App;
