// // Initialize charts globally so they can be updated later
// let tempBarChart, weatherDonutChart, tempLineChart;

// function createCharts(forecastData, units) {
//     const chartData = processChartData(forecastData);
    
//     createTemperatureBarChart(chartData, units);
//     createWeatherDonutChart(chartData);
//     createTemperatureLineChart(chartData, units);
// }

// function processChartData(forecastData) {
//     const labels = forecastData.map(forecast => new Date(forecast.dt * 1000).toLocaleDateString());
//     const temperatures = forecastData.map(forecast => Math.round(forecast.main.temp));
//     const weatherConditions = forecastData.map(forecast => forecast.weather[0].main);
    
//     const weatherConditionCounts = weatherConditions.reduce((acc, condition) => {
//         acc[condition] = (acc[condition] || 0) + 1;
//         return acc;
//     }, {});

//     return { labels, temperatures, weatherConditionCounts };
// }

// function createTemperatureBarChart({ labels, temperatures }, units) {
//     const ctx = document.getElementById('tempBarChart').getContext('2d');
//     if (tempBarChart) {
//         tempBarChart.destroy();
//     }
//     tempBarChart = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: `Temperature (${units === 'metric' ? '°C' : '°F'})`,
//                 data: temperatures,
//                 backgroundColor: 'rgba(54, 162, 235, 0.5)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }

// function createWeatherDonutChart({ weatherConditionCounts }) {
//     const ctx = document.getElementById('weatherDonutChart').getContext('2d');
//     if (weatherDonutChart) {
//         weatherDonutChart.destroy();
//     }
//     weatherDonutChart = new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//             labels: Object.keys(weatherConditionCounts),
//             datasets: [{
//                 data: Object.values(weatherConditionCounts),
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.5)',
//                     'rgba(54, 162, 235, 0.5)',
//                     'rgba(255, 206, 86, 0.5)',
//                     'rgba(75, 192, 192, 0.5)',
//                     'rgba(153, 102, 255, 0.5)',
//                     'rgba(255, 159, 64, 0.5)'
//                 ],
//                 borderColor: [
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(54, 162, 235, 1)',
//                     'rgba(255, 206, 86, 1)',
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(153, 102, 255, 1)',
//                     'rgba(255, 159, 64, 1)'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true
//         }
//     });
// }

// function createTemperatureLineChart({ labels, temperatures }, units) {
//     const ctx = document.getElementById('tempLineChart').getContext('2d');
//     if (tempLineChart) {
//         tempLineChart.destroy();
//     }
//     tempLineChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: `Temperature (${units === 'metric' ? '°C' : '°F'})`,
//                 data: temperatures,
//                 backgroundColor: 'rgba(153, 102, 255, 0.2)',
//                 borderColor: 'rgba(153, 102, 255, 1)',
//                 borderWidth: 2,
//                 fill: true
//             }]
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }