// netlify/functions/weather.js
// Import the 'node-fetch' module for making HTTP requests
const fetch = require('node-fetch');

// Define the handler function for the serverless function
exports.handler = async (event, context) => {
  // Extract latitude and longitude from the query parameters sent with the request
  const lat = event.queryStringParameters.lat;
  const lon = event.queryStringParameters.lon;
  
  // API key for accessing OpenWeatherMap API
  const apiKey = '91eb185b92ada1500fb25d3a3f408c92';
  
  // Construct the URL for the OpenWeatherMap API with the provided latitude, longitude, and API key
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    // Fetch weather data from the OpenWeatherMap API
    const response = await fetch(url);
    // Parse the JSON response
    const data = await response.json();
    
    // Extract necessary weather information from the API response
    let temp = Math.round((data.main.temp - 273)); // Convert temperature from Kelvin to Celsius
    let desc = data.weather[0].description; // Weather description
    let location = data.name; // Location name
    let windSpeed = data.wind.speed; // Wind speed
    let weatherMain = data.weather[0].main; // Main weather condition (e.g., Clear, Rain, etc.)

    // Return a successful response with status code 200 and weather data in the response body
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
    // If an error occurs during the API request, return a 500 status code with an error message
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data' }),
    };
  }
};
