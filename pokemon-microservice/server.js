const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.get('/pokemon/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    const pokemon = response.data;

    // console.log('Pokemon Data:', pokemon);

    // Check if the response includes the expected properties
    if (pokemon.sprites && pokemon.sprites.front_default) {
      const nameData = pokemon.name;
      const imageData = pokemon.sprites.front_default;
      const weightData = pokemon.weight;

      console.log(nameData); // Log the Pokemon name
      console.log(imageData); // Log the image URL
      console.log(weightData); // Log the weight

      res.json({
        name: nameData,
        image: imageData,
        weight: weightData
        // Add more relevant data if needed
      });

    } else {
      console.error('Unexpected response structure from PokeAPI:', pokemon);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    
  } catch (error) {
    console.error('Error fetching data from PokeAPI:', error);

    // Check if the error is due to a 404 (Not Found) response from the PokeAPI
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'Pokemon not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.listen(port, () => {
  console.log(`Microservice server is running on port ${port}`);
});
