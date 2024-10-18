const functions = require('firebase-functions');
const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const axios = require('axios');

const app = express();
app.use(express.json());

const API_KEY = '717e14a9159840405b3dfd105b33768c'; // Your OpenWeatherMap API key
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

app.post('/webhook', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  async function getWeather(agent) {
    const city = agent.parameters.city;
    try {
      const response = await axios.get(`${API_BASE_URL}/weather`, {
        params: {
          q: city,
          units: 'metric',
          appid: API_KEY
        }
      });
      const weatherData = response.data;
      const weatherDescription = weatherData.weather[0].description;
      const temperature = Math.round(weatherData.main.temp);
      
      agent.add(`The weather in ${city} is currently ${weatherDescription} with a temperature of ${temperature}°C.`);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      agent.add(`I'm sorry, I couldn't fetch the weather information at the moment. Please try again later.`);
    }
  }

  let intentMap = new Map();
  intentMap.set('Get Weather', getWeather);
  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
exports.dialogflowWebhook = functions.https.onRequest(app);