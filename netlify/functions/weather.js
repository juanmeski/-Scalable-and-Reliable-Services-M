// netlify/functions/weather.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const lat = event.queryStringParameters.lat;
  const lon = event.queryStringParameters.lon;
  const apiKey = '91eb185b92ada1500fb25d3a3f408c92';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    let temp = Math.round((data.main.temp - 273));
    let desc = data.weather[0].description;
    let location = data.name;
    let windSpeed = data.wind.speed;
    let weatherMain = data.weather[0].main;

    return {
      statusCode: 200,
      body: JSON.stringify({
        temp,
        desc,
        location,
        windSpeed,
        weatherMain,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data' }),
    };
  }
};