/**
 * Real-Time API Integration (Weather Dashboard)
 * We use the Open-Meteo API (Free, no API key required)
 * 1. Geocoding API to get City Coordinates
 * 2. Weather API to get Current Weather
 */

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const statusMessage = document.getElementById('status-message');
const weatherOutput = document.getElementById('weather-output');

// Output Elements
const cityNameEl = document.getElementById('city-name');
const countryNameEl = document.getElementById('country-name');
const temperatureEl = document.getElementById('temperature');
const weatherIconEl = document.getElementById('weather-icon');
const weatherDescEl = document.getElementById('weather-description');
const windSpeedEl = document.getElementById('wind-speed');
const humidityEl = document.getElementById('humidity');

/**
 * Handle Form Submission
 */
searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page refresh
    const city = cityInput.value.trim();

    if (city) {
        fetchWeatherData(city);
    }
});

/**
 * Async core logic: Fetch weather data
 */
async function fetchWeatherData(city) {
    // 1. UI State -> Loading
    updateUIState('loading', 'Fetching weather data...');
    weatherOutput.classList.add('hidden');
    searchBtn.disabled = true;

    try {
        // Step 1: Geocoding API (Convert City Name -> Lat, Long)
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);

        // Check for HTTP Errors
        if (!geoResponse.ok) {
            // Status code is not in the 200-299 range
            throw new Error(`Geocoding server error: ${geoResponse.status}`);
        }

        const geoData = await geoResponse.json();

        // Check if city was found
        if (!geoData.results || geoData.results.length === 0) {
            // Custom Error: City not found
            throw new Error(`Oops! We couldn't find a city named "${city}". Please check your spelling.`);
        }

        const location = geoData.results[0];
        const lat = location.latitude;
        const lon = location.longitude;

        // Step 2: Weather API (Use Lat, Long to get Weather)
        // Note: Open-Meteo returns weathercodes (WMO WMO Weather interpretation codes)
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`);

        if (!weatherResponse.ok) {
            throw new Error(`Weather server error: ${weatherResponse.status}`);
        }

        const weatherData = await weatherResponse.json();

        // Extract Current humidity from Hourly data (closest hour)
        const currentTimeString = weatherData.current_weather.time; // e.g. "2023-10-01T14:00"
        const index = weatherData.hourly.time.indexOf(currentTimeString);
        let currentHumidity = '--';
        if (index !== -1) {
            currentHumidity = weatherData.hourly.relativehumidity_2m[index];
        }

        // 3. Update DOM with data
        renderWeatherUI({
            name: location.name,
            country: location.country,
            temp: weatherData.current_weather.temperature,
            windSpeed: weatherData.current_weather.windspeed,
            humidity: currentHumidity,
            weatherCode: weatherData.current_weather.weathercode
        });

        // Clear loading state
        updateUIState('clear');

    } catch (error) {
        // 4. Strategic Error Handling
        console.error("Fetch Error:", error);

        // Determine user-friendly message based on error type
        if (error.message.includes('fetch') || error.message.includes('Network') || error.message.includes('Failed to fetch')) {
            updateUIState('error', 'Network error. Please check your internet connection and try again.');
        } else {
            updateUIState('error', error.message);
        }
    } finally {
        searchBtn.disabled = false; // Always re-enable button
    }
}

/**
 * Handle UI error/loading feedback purely via DOM manipulation (strategic advice)
 */
function updateUIState(state, message = '') {
    // Reset classes
    statusMessage.className = 'status-message';
    statusMessage.textContent = message;

    if (state === 'error') {
        statusMessage.classList.add('error');
    } else if (state === 'loading') {
        statusMessage.classList.add('loading');
    }
}

/**
 * Update the Weather UI with successful data
 */
function renderWeatherUI(data) {
    cityNameEl.textContent = data.name;
    countryNameEl.textContent = data.country || '';
    temperatureEl.textContent = Math.round(data.temp);
    windSpeedEl.textContent = `${data.windSpeed} km/h`;
    humidityEl.textContent = `${data.humidity} %`;

    // Map WMO codes to simple Emoji & Description
    const interpretation = getWeatherInterpretation(data.weatherCode);
    weatherIconEl.textContent = interpretation.icon;
    weatherDescEl.textContent = interpretation.description;

    // Show Output
    weatherOutput.classList.remove('hidden');
}

/**
 * Helper to translate WMO weather interpretation codes to text & Emoji
 * See https://open-meteo.com/en/docs
 */
function getWeatherInterpretation(code) {
    const wmoMap = {
        0: { desc: "Clear sky", icon: "☀️" },
        1: { desc: "Mainly clear", icon: "🌤️" },
        2: { desc: "Partly cloudy", icon: "⛅" },
        3: { desc: "Overcast", icon: "☁️" },
        45: { desc: "Fog", icon: "🌫️" },
        48: { desc: "Depositing rime fog", icon: "🌫️" },
        51: { desc: "Light drizzle", icon: "🌦️" },
        53: { desc: "Moderate drizzle", icon: "🌧️" },
        55: { desc: "Dense drizzle", icon: "🌧️" },
        61: { desc: "Slight rain", icon: "🌧️" },
        63: { desc: "Moderate rain", icon: "🌧️" },
        65: { desc: "Heavy rain", icon: "🌧️" },
        71: { desc: "Slight snow fall", icon: "🌨️" },
        73: { desc: "Moderate snow fall", icon: "❄️" },
        75: { desc: "Heavy snow fall", icon: "❄️" },
        95: { desc: "Thunderstorm", icon: "⛈️" }
    };

    // Return matched code or default to generic cloudy
    return wmoMap[code] || { desc: "Unknown conditions", icon: "🌍" };
}
