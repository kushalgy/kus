# Real-Time Weather Dashboard

A responsive weather dashboard built with HTML, CSS, and modern asynchronous JavaScript.

## Features
- Search weather by city name
- Uses Fetch API and async/await
- Uses Open-Meteo's public REST APIs (no API key required)
- Displays temperature, humidity, wind speed, feels-like temperature, cloud cover, coordinates, and timezone
- Dynamic weather icons and condition labels
- Loading state and comprehensive error handling
- Responsive mobile-friendly design

## How to run
1. Extract the ZIP file.
2. Open `index.html` in a modern browser.
3. Enter a city and click Search.

For the best development experience, run it with VS Code Live Server or any local HTTP server.

## API flow
1. City name -> Open-Meteo Geocoding API -> latitude/longitude.
2. Latitude/longitude -> Open-Meteo Forecast API -> current weather JSON.
3. JavaScript parses the nested JSON and updates the DOM dynamically.

## Technologies
HTML5, CSS3, JavaScript ES6+, Fetch API, async/await, REST API, JSON.
