const API_KEY = "c9e046dfa1555b36adcb885255dab08e";

const cityInput = document.getElementById("cityInput");
const weatherBox = document.getElementById("weather");
const historyBox = document.getElementById("history");
const loadingBox = document.getElementById("loading");
8
/* ---------- WEATHER FETCH ---------- */
async function getWeather(city) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) {
        alert("city not found");
        throw new Error("City not found");
    }
    const data = await res.json();
    return data;
}

/* ---------- BUTTON CLICK ---------- */
document.getElementById("searchBtn").onclick = () => {
    const city = cityInput.value.trim();
    if (city) {
        search(city);
    }
};

/* ---------- UI RENDER ---------- */
function getWeatherIcon(weatherMain) {
    const icons = {
        Clear: '☀️',
        Clouds: '☁️',
        Rain: '🌧️',
        Drizzle: '🌦️',
        Thunderstorm: '⛈️',
        Snow: '❄️',
        Mist: '🌫️'
    };
    return icons[weatherMain] || '🌤️';
}

function renderWeather(d) {
    const icon = getWeatherIcon(d.weather[0].main);
    weatherBox.innerHTML = `
        <div class="weather-main">
            <div class="weather-icon">${icon}</div>
            <div class="temp-main">${Math.round(d.main.temp)}°C</div>
            <div class="weather-desc">${d.weather[0].main}</div>
        </div>
        <div class="weather-item"><label><i class="fas fa-map-marker-alt"></i> City</label><span>${d.name}, ${d.sys.country}</span></div>
        <div class="weather-item"><label><i class="fas fa-tint"></i> Humidity</label><span>${d.main.humidity}%</span></div>
        <div class="weather-item"><label><i class="fas fa-wind"></i> Wind</label><span>${d.wind.speed} m/s</span></div>
    `;
}

/* ---------- SAVE SEARCH HISTORY ---------- */
function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    // Remove duplicate if city already exists
    history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
    // Add city to the beginning
    history.unshift(city);
    // Keep only last 10 searches
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
    showHistory();
}

/* ---------- SHOW HISTORY ---------- */
function showHistory() {
    const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    historyBox.innerHTML = "";
    history.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city;
        btn.onclick = () => {
            cityInput.value = city;
            search(city);
        };
        historyBox.appendChild(btn);
    });
}

/* ---------- SEARCH FUNCTION ---------- */
async function search(city) {
    loadingBox.style.display = "block";
    weatherBox.innerHTML = "";
    try {
        const data = await getWeather(city);
        renderWeather(data);
        saveHistory(data.name);
    } catch (error) {
        weatherBox.innerHTML = `<p class="error">${error.message}</p>`;
    } finally {
        loadingBox.style.display = "none";
    }
}

/* ---------- ENTER KEY SEARCH ---------- */
cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
            search(city);
        }
    }
});

/* ---------- INITIAL LOAD ---------- */
showHistory();