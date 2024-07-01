// netlify/functions/location.js
// Import necessary modules for making HTTP requests (fetch), working with files (fs), and handling file paths (path)
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Define the handler function for the serverless function
exports.handler = async (event, context) => {
  const id = event.queryStringParameters.id; // Extract the museum ID from the query parameters of the HTTP request

  // Construct the file path to the JSON file containing museums data
  const filePath = path.resolve(__dirname, '../../json/museos.json');
  
  // Read and parse the JSON file into JavaScript object (museosData)
  const museosData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Retrieve the museum data for the specified ID from the parsed JSON object
  const museo = museosData.Museum[id];

  // Check if the museum data for the given ID exists
  if (!museo) {
    // If museum data does not exist, return a 404 error response
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Museum not found' }), // Return a JSON object with an error message
    };
  }

  // Extract latitude and longitude coordinates from the museum data
  const lat = museo.geo.latitude;
  const lon = museo.geo.longitude;

  // Return a successful response with status code 200 and the coordinates of the museum as JSON
  return {
    statusCode: 200,
    body: JSON.stringify({
      coord: { lat, lon } // Format the coordinates into a JSON object
    }),
  };
};
