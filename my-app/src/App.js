import React, { useState, useEffect, Component } from 'react';
import axios from 'axios';
import formulaImage from './formula.svg';

// Checks if the API response contains the expected data structure
function isValidApiResponse(response) {
  return response.data && response.data.image;
}

// Retrieves the catch rate for a selected Pokeball
function getBallRate(selectedBall) {
  const ballRates = {
    'Poke Ball': 0.75,
    'Great Ball': 1.5,
    'Ultra Ball': 2.25,
  };
  return ballRates[selectedBall];
}

// Retrieves the catch rate for a selected status
function getStatusRate(selectedStatus) {
  const statusRates = {
    'None': 1,
    'Burn': 1.5,
    'Freeze': 2,
    'Paralysis': 1.5,
    'Poison': 1.5,
    'Sleep': 2,
  };
  return statusRates[selectedStatus];
}

// Validates if the health value is within the valid range (1-100)
function isHealthValueValid(value) {
  return value >= 1 && value <= 100;
}

// Validates if the level value is within the valid range (1-100)
function isLevelValueValid(value) {
  return value >= 1 && value <= 100;
}

// Validates if all necessary values are available for the catch rate calculation
function areCalculationValuesValid(ballRate, statusRate, healthValue, pokemonData) {
  return ballRate && statusRate && healthValue && pokemonData && pokemonData.weight;
}

// Calculates the catch rate based on the provided formula
function calculateCatchRate(healthValue, pokemonData, ballRate, statusRate) {
  return (((3 * 100 - 2 * healthValue) / (3 * 100)) * pokemonData.weight * ballRate * statusRate) / 255;
}

// Error boundary class to catch and handle errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong. Please try again.</p>;
    }

    return this.props.children;
  }
}

// Main App component
function App() {
  // State hooks for various values
  const [healthValue, setHealthValue] = useState(100);
  const [pokemonData, setPokemonData] = useState(null);
  const [levelValue, setLevelValue] = useState(1);
  const [selectedBall, setSelectedBall] = useState('Poke Ball');
  const [ballRate, setBallRate] = useState(getBallRate(selectedBall));
  const [selectedStatus, setSelectedStatus] = useState('None');
  const [statusRate, setStatusRate] = useState(getStatusRate(selectedStatus));
  const [showInfo, setShowInfo] = useState(false);

  // Effect hook to handle fetching Pokemon data on input blur
  useEffect(() => {
    const pokemonInput = document.getElementById('pokemonInput');

    const handleInputBlur = async () => {
      const pokemonName = pokemonInput.value.trim();
      if (pokemonName !== '') {
        try {
          const response = await axios.get(`http://localhost:3001/pokemon/${pokemonName.toLowerCase()}`);

          console.log('API Response:', response);

          if (isValidApiResponse(response)) {
            setPokemonData({
              name: response.data.name,
              image: response.data.image,
              weight: response.data.weight
            });
          } else {
            console.error('Invalid data structure in API response:', response);
            setPokemonData(null);
          }
        } catch (error) {
          console.error('Error fetching Pokemon data:', error);
          console.log('Error response:', error.response);
          setPokemonData(null);
        }
      } else {
        setPokemonData(null);
      }
    };

    pokemonInput.addEventListener('blur', handleInputBlur);

    return () => {
      pokemonInput.removeEventListener('blur', handleInputBlur);
    };
  }, []);

  // Functions for updating various values
  const updateRangeFromNumber = (value) => {
    setHealthValue(value);
  };

  const updateNumberFromRange = (event) => {
    const value = event.target.value;
    setHealthValue(value);
  };

  const validateHealthNumber = (value) => {
    if (isHealthValueValid(value)) {
      updateNumberFromRange({ target: { value } });
    } else {
      alert('Health % must be in the range 1-100');
    }
  };

  const updateLevelValue = (value) => {
    if (isLevelValueValid(value)) {
      setLevelValue(value);
    } else {
      alert('Level must be in the range 1-100');
    }
  };

  const updateSelectedBall = (event) => {
    const selectedBall = event.target.value;
    setSelectedBall(selectedBall);
    setBallRate(getBallRate(selectedBall));
  };

  const updateSelectedStatus = (event) => {
    const selectedStatus = event.target.value;
    setSelectedStatus(selectedStatus);
    setStatusRate(getStatusRate(selectedStatus));
  };

  const toggleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  // Function to calculate and display the catch rate result
  const calculateResult = () => {
    if (areCalculationValuesValid(ballRate, statusRate, healthValue, pokemonData)) {
      const result = calculateCatchRate(healthValue, pokemonData, ballRate, statusRate);
      return result.toFixed(2);
    }

    return 'N/A';
  };

  // JSX structure for rendering the component
  return (
    <ErrorBoundary>
      <div className='App'>
        <header className='App-header'>
          <h1>
            <strong>Pokemon Catch Rate Calculator using its weight instead!</strong>
          </h1>
          <form>
            {/* Input fields for Pokemon and Level */}
            <label>Pokemon</label> <label>Level</label><br />
            <input
              type='text'
              name='pokemon'
              placeholder='Pikachu'
              id='pokemonInput'
            />
            <input
              type='number'
              name='level'
              min='1'
              max='100'
              value={levelValue}
              onInput={(e) => updateLevelValue(parseInt(e.target.value, 10))}
            /> <br />

            {/* Input fields for Health */}
            <label htmlFor='health'>Health %</label> <br />
            <input
              type='range'
              id='healthRange'
              name='health'
              min='1'
              max='100'
              value={healthValue}
              onInput={(e) => updateRangeFromNumber(e.target.value)}
            />
            <input
              type='number'
              id='healthNumber'
              name='health'
              min='1'
              max='100'
              value={healthValue}
              placeholder='%'
              onInput={(e) => validateHealthNumber(parseInt(e.target.value, 10))}
            /> <br />

            {/* Dropdown for Pokeball selection */}
            <label htmlFor='ball'>Ball</label> <br />
            <select
              id='ballSelect'
              name='ball'
              value={selectedBall}
              onChange={updateSelectedBall}
            >
              <option value='Poke Ball'>Poke Ball</option>
              <option value='Great Ball'>Great Ball</option>
              <option value='Ultra Ball'>Ultra Ball</option>
            </select> <br />

            {/* Dropdown for Status selection */}
            <label htmlFor='statuses'>Status</label> <br />
            <select
              id='statusSelect'
              name='status'
              value={selectedStatus}
              onChange={updateSelectedStatus}
            >
              <option value='None'>None</option>
              <option value='Burn'>Burn</option>
              <option value='Freeze'>Freeze</option>
              <option value='Paralysis'>Paralysis</option>
              <option value='Poison'>Poison</option>
              <option value='Sleep'>Sleep</option>
            </select> <br />

            {/* Checkbox for displaying additional info */}
            <label htmlFor='calc'>Show More Info</label>
            <input
              type='checkbox'
              id='showInfoCheckbox'
              checked={showInfo}
              onChange={toggleShowInfo}
            /> <br />

            {/* Display Pokemon image if available */}
            {pokemonData && pokemonData.image && (
              <img src={pokemonData.image} alt='Pokemon' />
            )} <br />

            {/* Display additional info if Show More Info checkbox is checked */}
            {showInfo && (
              <>
                <img src={formulaImage} alt='Formula' />
                <p>Ball Rate: {ballRate}</p>
                <p>Status Rate: {statusRate}</p>
              </>
            )}

            {/* Display the calculated catch rate result */}
            <p>Calculation Result: {calculateResult()}%</p>

          </form>

          {/* Copyright information */}
          <p>
            © John Tran <a href='https://github.com/johnyu013/cs361-project'>Update Logs</a>
          </p>
        </header>
      </div>
    </ErrorBoundary>
  );
}

export default App;
