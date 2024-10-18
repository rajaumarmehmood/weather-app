# Weather App with Gemini Chatbot

This project is a weather application that includes a chatbot powered by Google's Gemini AI. The chatbot is integrated into the weather app interface, allowing users to interact with an AI assistant while using the weather features.

## Live Demo

You can access the live version of this application at:
[https://weatherchatbot-438609.web.app](https://weatherchatbot-438609.web.app)

You can also acces the live version of this application on github at:
[https://rajaumarmehmood.github.io/weather-app/](https://rajaumarmehmood.github.io/weather-app/)
## Features

- Weather information display
- 5-day weather forecast
- Temperature unit toggle (Celsius/Fahrenheit)
- Dark mode
- Responsive design
- Integrated Gemini AI chatbot

## Chatbot Functionality

The chatbot feature allows users to ask questions or request information. It uses Google's Generative AI (Gemini 1.5 Pro) to provide responses.

### How it works:

1. The chatbot can be toggled on/off by clicking the chat icon.
2. Users can type messages in the input field and send them.
3. The AI processes the input and generates a response.
4. Both user messages and AI responses are displayed in the chat window.

## Setup

1. Clone this repository to your local machine.
2. Ensure you have a modern web browser that supports ES6 modules.
3. Replace `'YOUR_API_KEY'` in the JavaScript code with your actual Google Generative AI API key.

```javascript
const genAI = new GoogleGenerativeAI('YOUR_API_KEY');
```

4. Open the `index.html` file in a web browser to run the application locally.

## Dependencies

- [Google Generative AI SDK](https://ai.google.dev/tutorials/web_quickstart)
- [Font Awesome](https://fontawesome.com/) for icons
- [Chart.js](https://www.chartjs.org/) for weather data visualization

## Usage

- Use the search bar to look up weather information for different cities.
- Toggle between Celsius and Fahrenheit using the temperature unit switch.
- View the 5-day forecast and weather charts.
- Click on the chat icon to open the chatbot interface.
- Type your questions or requests in the chatbot input field and press Enter or click Send.

## Deployment

This application has been deployed using two platforms:

1. **Firebase**: The live version is hosted on Firebase and can be accessed at [https://weatherchatbot-438609.web.app](https://weatherchatbot-438609.web.app)

2. **GitHub**: The source code is available on GitHub at https://rajaumarmehmood.github.io/weather-app/
### Deploying your own instance:

To deploy this application on Firebase:

1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize your project: `firebase init`
4. Deploy to Firebase: `firebase deploy`

For GitHub deployment, you can use GitHub Pages:

1. Push your code to a GitHub repository
2. Go to repository settings
3. Under "GitHub Pages", select the branch you want to deploy
4. Your site will be available at `https://<username>.github.io/<repository>`

## Note

This application uses the OpenWeatherMap API for weather data. Ensure you have a valid API key and replace it in the JavaScript code if necessary.

## Security

Be cautious with your API keys. In a production environment, it's recommended to handle API keys server-side to prevent exposure.

## License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).