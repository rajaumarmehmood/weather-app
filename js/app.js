const dialogflowProjectId = 'weatherchatbot-438609';  // Replace with your Dialogflow project ID
const weatherApiKey = '717e14a9159840405b3dfd105b33768c'; // Your OpenWeather API key
let units = 'metric'; // Default to Celsius
const dialogflowSessionId = 'weather-dashboard-session';
const dialogflowLanguageCode = 'en';

// Function to make API call to Dialogflow
// async function sendMessageToDialogflow(message) {
//     const dialogflowEndpoint = `https://dialogflow.googleapis.com/v2/projects/${dialogflowProjectId}/agent/sessions/${dialogflowSessionId}:detectIntent`;
    
//     // Get access token from Google Cloud (you need to use your service account credentials)
//     const token = await getAccessToken();

//     const response = await fetch(dialogflowEndpoint, {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             queryInput: {
//                 text: {
//                     text: message,
//                     languageCode: dialogflowLanguageCode
//                 }
//             }
//         })
//     });

//     const data = await response.json();
//     return data.queryResult.fulfillmentText;  // This is the response from Dialogflow
// }

// // Helper function to get access token (using Google service account)
// async function getAccessToken() {
//     const key = {
//         // Replace these with your service account details
//         "type": "service_account",
//         "project_id": "your-project-id",
//         "private_key_id": "your-private-key-id",
//         "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR-PRIVATE-KEY\n-----END PRIVATE KEY-----\n",
//         "client_email": "your-service-account-email@your-project-id.iam.gserviceaccount.com",
//         "client_id": "your-client-id",
//         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//         "token_uri": "https://oauth2.googleapis.com/token",
//         "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//         "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email"
//     };

//     const response = await fetch('https://oauth2.googleapis.com/token', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${createJwtAssertion(key)}`
//     });

//     const data = await response.json();
//     return data.access_token;
// }

// // Function to create JWT assertion for the token (you can use a library like jsonwebtoken)
// function createJwtAssertion(key) {
//     const jwtHeader = {
//         alg: 'RS256',
//         typ: 'JWT'
//     };
//     const jwtClaimSet = {
//         iss: key.client_email,
//         scope: 'https://www.googleapis.com/auth/dialogflow',
//         aud: 'https://oauth2.googleapis.com/token',
//         exp: Math.floor(Date.now() / 1000) + 3600,
//         iat: Math.floor(Date.now() / 1000)
//     };

//     const encodedHeader = btoa(JSON.stringify(jwtHeader));
//     const encodedClaimSet = btoa(JSON.stringify(jwtClaimSet));

//     const signatureInput = `${encodedHeader}.${encodedClaimSet}`;
//     const signature = signWithPrivateKey(signatureInput, key.private_key);  // This will sign using your private key

//     return `${encodedHeader}.${encodedClaimSet}.${signature}`;
// }

// // Dummy function for signing JWT (you need to use a JWT library to sign with RSA)
// function signWithPrivateKey(input, privateKey) {
//     // You will need to use an external library like `jsonwebtoken` to sign the input
//     return 'signed-jwt';
// }

// // Chatbot Form Submission Handling
// document.getElementById('chatbot-form').addEventListener('submit', async function(event) {
//     event.preventDefault();
//     const userMessage = document.getElementById('user-question').value;

//     // Display user's message in chatbot
//     const chatbotResponseContainer = document.getElementById('chatbot-response');
//     chatbotResponseContainer.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;

//     // Send message to Dialogflow
//     const dialogflowResponse = await sendMessageToDialogflow(userMessage);

//     // Display Dialogflow's response in chatbot
//     chatbotResponseContainer.innerHTML += `<p><strong>WeatherBot:</strong> ${dialogflowResponse}</p>`;
//     document.getElementById('user-question').value = '';  // Clear the input field
// });

// Toggle Chatbot Visibility
document.getElementById('chatbot-toggle').addEventListener('click', function () {
    const chatbot = document.querySelector('df-messenger');
    if (chatbot.style.display === 'none' || chatbot.style.display === '') {
        chatbot.style.display = 'block';
    } else {
        chatbot.style.display = 'none';
    }
});

document.getElementById('city-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    fetchWeather(city);
});

document.getElementById('location-button').addEventListener('click', getLocation);

document.getElementById('toggle-unit').addEventListener('click', function() {
    units = units === 'metric' ? 'imperial' : 'metric';
    
    const city = document.getElementById('city-input').value || document.getElementById('city-name').textContent; // Fallback city
    fetchWeather(city);
});

document.getElementById('toggle-unit').addEventListener('change', function() {
    const isChecked = this.checked;
    units = isChecked ? 'imperial' : 'metric';
    
    // Update the label dynamically
    document.getElementById('unit-label').textContent = isChecked ? '°F' : '°C';
    
    const city = document.getElementById('city-input').value || document.getElementById('city-name'); // Fallback city
    // fetchWeather(city); // Fetch weather in the new unit
});

function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=${units}`)
    .then(response => response.json())
    .then(data => {
        updateWeatherUI(data);
        fetchForecast(city);
    })
    .catch(error => console.error('Error fetching weather:', error));
}

let forecastDataCache = []; // Cache forecast data so it doesn't fetch multiple times

function fetchForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=${units}`)
    .then(response => response.json())
    .then(data => {
        forecastDataCache = data.list; // Cache the forecast data
        updateForecastUI(data.list);   // Update forecast cards and charts
        displayTable(data.list);       // Populate the table for the tables page
    })
    .catch(error => console.error('Error fetching forecast:', error));
}


function updateWeatherUI(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('temperature').textContent = Math.round(data.main.temp);
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('temp-unit').textContent = units === 'metric' ? '°C' : '°F';
    
    // // Change the background based on the weather condition
    // const weatherWidget = document.getElementById('weather-widget');
    // const condition = data.weather[0].main.toLowerCase();

    // if (condition.includes('clear')) {
    //     weatherWidget.style.backgroundImage = 'url(assets/clear-sky.jpeg)';
    //     weatherWidget.style.backgroundSize = 'cover';
    //     weatherWidget.style.backgroundPosition = 'center';
    //     weatherWidget.style.backgroundRepeat = 'no-repeat';
    //     if(weatherWidget.style.color === 'white')
    //     {
    //         weatherWidget.style.color = 'black';
    //     }
    // } else if (condition.includes('clouds')) {
    //     weatherWidget.style.backgroundImage = 'url(assets/cloudy.jpeg)';
    //     weatherWidget.style.backgroundSize = 'cover';
    //     weatherWidget.style.backgroundPosition = 'center';
    //     weatherWidget.style.color = 'white';
    //     weatherWidget.style.backgroundRepeat = 'no-repeat';
    // } else if (condition.includes('rain')) {
    //     weatherWidget.style.backgroundImage = 'url(assets/rainy.jpeg)';
    //     weatherWidget.style.backgroundSize = 'cover';
    //     weatherWidget.style.backgroundPosition = 'center';
    //     weatherWidget.style.backgroundRepeat = 'no-repeat';
    //     weatherWidget.style.color = 'white';
    // } else if (condition.includes('snow')) {
    //     weatherWidget.style.backgroundImage = 'url(assets/snow.jpeg)';
    //     weatherWidget.style.backgroundSize = 'cover';
    //     weatherWidget.style.backgroundPosition = 'center';
    //     weatherWidget.style.backgroundRepeat = 'no-repeat';
    //     weatherWidget.style.backgroundPosition = 'center';
    //     if(weatherWidget.style.color === 'white')
    //     {
    //         weatherWidget.style.color = 'black';
    //     }
    // } else {
    //     weatherWidget.style.backgroundImage = 'url(assets/default-weather.jpeg)';
    //     weatherWidget.style.backgroundSize = 'cover';
    //     weatherWidget.style.backgroundPosition = 'center';
    //     weatherWidget.style.backgroundRepeat = 'no-repeat';
    //     weatherWidget.style.backgroundPosition = 'center';
    //     if(weatherWidget.style.color === 'black')
    //     {
    //         weatherWidget.style.color = 'white';
    //     }
    // }
}


function updateForecastUI(forecastData) {
    const forecastCards = document.getElementById('forecast-cards');
    forecastCards.innerHTML = ''; // Clear previous forecast

    forecastData.forEach((entry) => {
        const date = new Date(entry.dt * 1000); // Convert timestamp to milliseconds
        const icon = entry.weather[0].icon; // Get weather icon
        const description = entry.weather[0].description; // Get weather description
        const temp = Math.round(entry.main.temp); // Round temperature
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-date">${date.toLocaleDateString()}</div>
            <div class="forecast-icon"><img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}"></div>
            <div class="forecast-temp">${temp}°</div>
            <div class="forecast-description">${description}</div>
        `;
        forecastCards.appendChild(forecastItem);
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=${units}`)
            .then(response => response.json())
            .then(data => {
                updateWeatherUI(data);
                fetchForecast(`${data.name}`);
            });
        }, error => {
            console.error('Geolocation error:', error);
        });
    } else {
        console.error('Geolocation not supported');
    }
}

document.getElementById('nav-dashboard').addEventListener('click', function() {
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('tables-section').style.display = 'none';
});

document.getElementById('nav-tables').addEventListener('click', function() {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('tables-section').style.display = 'block';

    // Use cached data if available; otherwise, fetch forecast
    if (forecastDataCache.length > 0) {
        displayTable(forecastDataCache);
    } else {
        const city = document.getElementById('city-input').value || 'London'; // default city
        fetchForecast(city); // Fetch the forecast if not already done
    }
});

let currentPage = 1;
const rowsPerPage = 10;

function displayTable(forecastData) {
    const tableBody = document.getElementById('forecast-table-body');
    tableBody.innerHTML = ''; // Clear previous data

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, forecastData.length);

    for (let i = startIndex; i < endIndex; i++) {
        const forecast = forecastData[i];
        const row = `<tr>
            <td>${new Date(forecast.dt_txt).toLocaleDateString()}</td>
            <td>${Math.round(forecast.main.temp)} °C</td>
            <td>
            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
            ${forecast.weather[0].description}
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    }

    setupPagination(forecastData);
}


function setupPagination(forecastData) {
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = ''; // Clear existing buttons

    const totalPages = Math.ceil(forecastData.length / rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            displayTable(forecastData);
        });
        paginationControls.appendChild(button);
    }
}

document.getElementById('filter-select').addEventListener('change', function() {
    const selectedFilter = this.value;
    applyFilter(selectedFilter);
});

function applyFilter(filter) {
    let filteredData = [...forecastDataCache]; // Copy the forecast data

    switch (filter) {
        case 'default':
            // No filtering, use original forecast data from cache
            filteredData = forecastDataCache;
            break;
        case 'temp-asc':
            filteredData.sort((a, b) => a.main.temp - b.main.temp);
            break;
        case 'temp-desc':
            filteredData.sort((a, b) => b.main.temp - a.main.temp);
            break;
        case 'no-rain':
            filteredData = filteredData.filter(entry => !entry.weather[0].main.toLowerCase().includes('rain'));
            break;
        case 'highest-temp':
            const maxTemp = Math.max(...filteredData.map(entry => entry.main.temp));
            filteredData = filteredData.filter(entry => entry.main.temp === maxTemp);
            break;
        default:
            break;
    }

    // Update the table and forecast cards based on the filtered data
    displayTable(filteredData);
    updateForecastUI(filteredData);
}

function toggleMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const sideMenu = document.querySelector('.side-menu');
    
    // Toggle active state
    hamburger.classList.toggle('active');
    sideMenu.classList.toggle('active');

    // Close the menu when an option is selected
    const menuItems = document.querySelectorAll('.side-menu a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            sideMenu.classList.remove('active');
        });
    });
}


