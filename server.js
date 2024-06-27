const express = require('express');
const axios = require('axios');
const qs = require('qs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
app.use(express.static(path.join(__dirname)));


const getToken = async () => {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const data = qs.stringify({ grant_type: 'client_credentials' });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
  };

  try {
    const response = await axios.post(tokenUrl, data, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
};

// Function to get Spotify data
const getSpotifyData = async (token) => {
  const url = 'https://api.spotify.com/v1/search?q=year:2023&type=track&market=IN&limit=50';
  const headers = { 'Authorization': 'Bearer ' + token };
  try {
    const response = await axios.get(url, { headers });
    return response.data.tracks.items;
  } catch (error) {
    console.error('Error fetching data from Spotify:', error);
    throw error;
  }
};


app.get('/api/songs', async (req, res) => {
  try {
    const token = await getToken();
    const data = await getSpotifyData(token);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Spotify API' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
