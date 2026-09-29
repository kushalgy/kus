const form = document.getElementById("searchForm");
const input = document.getElementById("cityInput");
const message = document.getElementById("message");
const card = document.getElementById("weatherCard");

const weatherCodes = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"], 3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"], 48: ["Depositing rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Heavy drizzle", "🌧️"],
  61: ["Light rain", "🌦️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
  71: ["Light snow", "🌨️"], 73: ["Snow", "❄️"], 75: ["Heavy snow", "❄️"],
  80: ["Rain showers", "🌦️"], 81: ["Rain showers", "🌧️"], 82: ["Heavy showers", "⛈️"],
  95: ["Thunderstorm", "⛈️"], 96: ["Thunderstorm with hail", "⛈️"], 99: ["Thunderstorm with hail", "⛈️"]
};

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`;
}

function clearMessage() {
  message.className = "message hidden";
}

async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to connect to the location service.");
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`No location found for "${city}". Try another city name.`);
  }
  return data.results[0];
}

async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
      "cloud_cover"
    ].join(","),
    timezone: "auto"
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error("Weather service returned an error.");
  return response.json();
}

function renderWeather(place, data) {
  const current = data.current;
  const [condition, icon] = weatherCodes[current.weather_code] || ["Unknown", "🌡️"];

  document.getElementById("locationName").textContent =
    `${place.name}, ${place.country_code || place.country}`;
  document.getElementById("updatedAt").textContent =
    `Updated: ${current.time.replace("T", " ")}`;
  document.getElementById("weatherIcon").textContent = icon;
  document.getElementById("temperature").textContent = Math.round(current.temperature_2m);
  document.getElementById("condition").textContent = condition;
  document.getElementById("humidity").textContent = `${current.relative_humidity_2m}%`;
  document.getElementById("windSpeed").textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  document.getElementById("feelsLike").textContent = `${Math.round(current.apparent_temperature)}°C`;
  document.getElementById("cloudCover").textContent = `${current.cloud_cover}%`;
  document.getElementById("coordinates").textContent =
    `${Number(place.latitude).toFixed(2)}, ${Number(place.longitude).toFixed(2)}`;
  document.getElementById("timezone").textContent = data.timezone;

  card.classList.remove("hidden");
}

async function searchWeather(city) {
  card.classList.add("hidden");
  setMessage("Fetching live weather data...", "loading");

  try {
    const place = await getCoordinates(city);
    const weather = await getWeather(place.latitude, place.longitude);
    renderWeather(place, weather);
    clearMessage();
  } catch (error) {
    setMessage(error.message || "Something went wrong. Please try again.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = input.value.trim();
  if (!city) {
    setMessage("Please enter a city name.");
    return;
  }
  await searchWeather(city);
});

searchWeather("Bengaluru");
