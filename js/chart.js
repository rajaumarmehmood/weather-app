// Assuming you already have Chart.js included in your HTML via CDN

// Initialize charts globally so they can be updated later
let tempBarChart, weatherDonutChart, tempLineChart;

function createCharts(forecastData) {
    // Extract temperature and weather data for the charts
    const labels = forecastData.map(forecast => new Date(forecast.dt_txt).toLocaleDateString());
    const temperatures = forecastData.map(forecast => Math.round(forecast.main.temp));
    const weatherConditions = forecastData.map(forecast => forecast.weather[0].main);

    // Group weather conditions for the donut chart
    const weatherConditionCounts = weatherConditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});

    // Common chart options for responsiveness
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,  // Allow chart to stretch based on container
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Temperature Bar Chart
    const tempBarCtx = document.getElementById('tempBarChart').getContext('2d');
    if (tempBarChart) {
        tempBarChart.destroy();  // Destroy previous chart instance if it exists
    }
    tempBarChart = new Chart(tempBarCtx, {
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
        options: chartOptions
    });

    // Weather Donut Chart
    const weatherDonutCtx = document.getElementById('weatherDonutChart').getContext('2d');
    if (weatherDonutChart) {
        weatherDonutChart.destroy();  // Destroy previous chart instance if it exists
    }
    weatherDonutChart = new Chart(weatherDonutCtx, {
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
        options: chartOptions
    });

    // Temperature Line Chart
    const tempLineCtx = document.getElementById('tempLineChart').getContext('2d');
    if (tempLineChart) {
        tempLineChart.destroy();  // Destroy previous chart instance if it exists
    }
    tempLineChart = new Chart(tempLineCtx, {
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
        options: chartOptions
    });
}

// Update the charts whenever new forecast data is fetched
function updateForecastUI(forecastData) {
    const forecastCards = document.getElementById('forecast-cards');
    forecastCards.innerHTML = ''; // Clear previous forecast
    for (let i = 0; i < forecastData.length; i += 8) {
        const forecast = forecastData[i];
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
            <h3>${new Date(forecast.dt_txt).toLocaleDateString()}</h3>
            <p>${Math.round(forecast.main.temp)} ${units === 'metric' ? '°C' : '°F'}</p>
            <p>${forecast.weather[0].description}</p>
        `;
        forecastCards.appendChild(card);
    }

    // Update the charts with the new data
    createCharts(forecastData);
}
