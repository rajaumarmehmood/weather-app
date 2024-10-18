// Constants
const API_KEY = '717e14a9159840405b3dfd105b33768c';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const locationButton = document.getElementById('location-button');
const cityNameElement = document.getElementById('city-name');
const weatherDescriptionElement = document.getElementById('weather-description');
const temperatureElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind-speed');
const unitToggle = document.getElementById('toggle-unit');
const unitLabel = document.getElementById('unit-label');
const tempUnitTextElement = document.getElementById('temp-unit');
const forecastCardsContainer = document.getElementById('forecast-cards');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const filterSelect = document.getElementById('filter-select');
const forecastTableBody = document.getElementById('forecast-table-body');
const paginationControls = document.getElementById('pagination-controls');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const navLinks = document.querySelectorAll('.sidebar nav ul li a');
const weatherinfo = document.getElementById('weather-info');

// Charts
let tempBarChart, weatherDonutChart, tempLineChart;

// State
let units = 'metric';
let currentCity = '';
let currentPage = 1;
const rowsPerPage = 10;
let filteredForecastData = [];
let originalForecastData = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', init);
cityForm.addEventListener('submit', handleCitySubmit);
locationButton.addEventListener('click', handleLocationRequest);
unitToggle.addEventListener('change', handleUnitToggle);
darkModeToggle.addEventListener('click', toggleDarkMode);
filterSelect.addEventListener('change', handleFilterChange);
sidebarToggle.addEventListener('click', toggleSidebar);
document.addEventListener('DOMContentLoaded', init);
sidebarToggle.addEventListener('click', toggleSidebar);
navLinks.forEach(link => link.addEventListener('click', closeSidebarOnNavClick));

// Functions
async function init() {
    setupResponsiveness();
    await fetchWeatherData('London');
}

function setupResponsiveness() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addListener(handleMediaQueryChange);
}

function handleMediaQueryChange(mediaQuery) {
    if (mediaQuery.matches) {
        sidebar.classList.remove('sidebar-open');
        sidebarToggle.style.display = 'block';
    } else {
        sidebar.classList.remove('sidebar-open');
        sidebarToggle.style.display = 'none';
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('sidebar-open');
}

function closeSidebarOnNavClick() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    if (mediaQuery.matches) {
        sidebar.classList.remove('sidebar-open');
    }
}

async function handleCitySubmit(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        await fetchWeatherData(city);
    }
}

async function handleLocationRequest() {
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoords(latitude, longitude);
        } catch (error) {
            console.error('Geolocation error:', error);
            alert('Unable to retrieve your location. Please enter a city manually.');
        }
    } else {
        alert('Geolocation is not supported by your browser. Please enter a city manually.');
    }
}

function handleUnitToggle() {
    units = unitToggle.checked ? 'imperial' : 'metric';
    unitLabel.textContent = unitToggle.checked ? '°F' : '°C';
    if (currentCity) {
        fetchWeatherData(currentCity);
    }
    
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.innerHTML = document.body.classList.contains('dark-mode')
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
}

async function fetchWeatherData(city) {
    try {
        const weatherData = await fetchData(`${API_BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`);
        const forecastData = await fetchData(`${API_BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`);

        updateWeatherUI(weatherData);
        updateForecastUI(forecastData.list);
        createCharts(forecastData.list);

        currentCity = city;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Unable to fetch weather data. Please try again.');
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const weatherData = await fetchData(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);
        const forecastData = await fetchData(`${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);

        updateWeatherUI(weatherData);
        updateForecastUI(forecastData.list);
        createCharts(forecastData.list);

        currentCity = weatherData.name;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Unable to fetch weather data. Please try again.');
    }
}

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

function updateWeatherUI(data) {
    cityNameElement.textContent = data.name;
    weatherDescriptionElement.textContent = data.weather[0].description;
    temperatureElement.textContent = Math.round(data.main.temp);
    tempUnitTextElement.textContent = units === 'metric' ? '°C' : '°F';
    humidityElement.textContent = data.main.humidity;
    const weatherIconElement = document.getElementById('weather-icon');
    weatherIconElement.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIconElement.alt = data.weather[0].description;
    const windSpeed = (data.wind.speed * 3.6).toFixed(1);
    windElement.textContent = windSpeed;
}

function updateForecastUI(forecastData) {
    forecastCardsContainer.innerHTML = '';
    for (let i = 0; i < forecastData.length; i += 8) {
        const forecast = forecastData[i];
        const card = createForecastCard(forecast);
        forecastCardsContainer.appendChild(card);
    }
    originalForecastData = [...forecastData];
    filteredForecastData = [...forecastData];
    handleFilterChange();
}

function createForecastCard(forecast) {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
        <h3>${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
        <p class="temperature">${Math.round(forecast.main.temp)}${units === 'metric' ? '°C' : '°F'}</p>
        <p>${forecast.weather[0].description}</p>
    `;
    return card;
}

function handleFilterChange() {
    const selectedFilter = filterSelect.value;
    filteredForecastData = [...originalForecastData];
    applyFilter(selectedFilter);
    displayTable(filteredForecastData);
    updateCharts(filteredForecastData);
}

function applyFilter(filter) {
    switch (filter) {
        case 'temp-asc':
            filteredForecastData.sort((a, b) => a.main.temp - b.main.temp);
            break;
        case 'temp-desc':
            filteredForecastData.sort((a, b) => b.main.temp - a.main.temp);
            break;
        case 'no-rain':
            filteredForecastData = filteredForecastData.filter(entry => !entry.weather[0].main.toLowerCase().includes('rain'));
            break;
        case 'highest-temp':
            const maxTemp = Math.max(...filteredForecastData.map(entry => entry.main.temp));
            filteredForecastData = filteredForecastData.filter(entry => entry.main.temp === maxTemp);
            break;
        default:
            // No filter, use original data
            break;
    }
}

function displayTable(data) {
    forecastTableBody.innerHTML = '';
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, data.length);

    for (let i = startIndex; i < endIndex; i++) {
        const forecast = data[i];
        const row = `
            <tr>
            <td>${new Date(forecast.dt * 1000).toLocaleDateString()}</td>
            <td>${Math.round(forecast.main.temp)} ${units === 'metric' ? '°C' : '°F'}</td>
            <td>
            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png" alt="${forecast.weather[0].description}" style="width: 30px; height: 30px; border-radius: 50%; box-shadow: 0 0 10px grey;">
            ${forecast.weather[0].description}
            </td>
            <td>${forecast.main.humidity}%</td>
            </tr>
        `;
        forecastTableBody.innerHTML += row;
    }

    setupPagination(data);
}

function setupPagination(data) {
    paginationControls.innerHTML = '';
    const totalPages = Math.ceil(data.length / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', () => {
            currentPage = i;
            displayTable(data);
        });
        paginationControls.appendChild(button);
    }
}

function createCharts(forecastData) {
    const chartData = processChartData(forecastData);

    createTemperatureBarChart(chartData);
    createWeatherDonutChart(chartData);
    createTemperatureLineChart(chartData);
}

function updateCharts(filteredData) {
    const chartData = processChartData(filteredData);

    updateTemperatureBarChart(chartData);
    updateWeatherDonutChart(chartData);
    updateTemperatureLineChart(chartData);
}

function processChartData(forecastData) {
    const labels = forecastData.map(forecast => new Date(forecast.dt * 1000).toLocaleDateString());
    const temperatures = forecastData.map(forecast => Math.round(forecast.main.temp));
    const weatherConditions = forecastData.map(forecast => forecast.weather[0].main);

    const weatherConditionCounts = weatherConditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});

    return { labels, temperatures, weatherConditionCounts };
}

function createTemperatureBarChart({ labels, temperatures }) {
    const ctx = document.getElementById('tempBarChart');
    if (!ctx) {
        console.error('Temperature bar chart canvas not found');
        return;
    }
    if (tempBarChart) {
        tempBarChart.destroy();
    }
    tempBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Temperature (${units === 'metric' ? '°C' : '°F'})`,
                data: temperatures,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateTemperatureBarChart({ labels, temperatures }) {
    if (tempBarChart) {
        tempBarChart.data.labels = labels;
        tempBarChart.data.datasets[0].data = temperatures;
        tempBarChart.data.datasets[0].label = `Temperature (${units === 'metric' ? '°C' : '°F'})`;
        tempBarChart.update();
    }
}

function createWeatherDonutChart({ weatherConditionCounts }) {
    const ctx = document.getElementById('weatherDonutChart');
    if (!ctx) {
        console.error('Weather donut chart canvas not found');
        return;
    }
    if (weatherDonutChart) {
        weatherDonutChart.destroy();
    }
    weatherDonutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(weatherConditionCounts),
            datasets: [{
                data: Object.values(weatherConditionCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateWeatherDonutChart({ weatherConditionCounts }) {
    if (weatherDonutChart) {
        weatherDonutChart.data.labels = Object.keys(weatherConditionCounts);
        weatherDonutChart.data.datasets[0].data = Object.values(weatherConditionCounts);
        weatherDonutChart.update();
    }
}

function createTemperatureLineChart({ labels, temperatures }) {
    const ctx = document.getElementById('tempLineChart');
    if (!ctx) {
        console.error('Temperature line chart canvas not found');
        return;
    }
    if (tempLineChart) {
        tempLineChart.destroy();
    }
    tempLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Temperature (${units === 'metric' ? '°C' : '°F'})`,
                data: temperatures,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateTemperatureLineChart({ labels, temperatures }) {
    if (tempLineChart) {
        tempLineChart.data.labels = labels;
        tempLineChart.data.datasets[0].data = temperatures;
        tempLineChart.data.datasets[0].label = `Temperature (${units === 'metric' ? '°C' : '°F'})`;
        tempLineChart.update();
    }
}