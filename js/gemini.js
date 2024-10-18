import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');

chatbotIcon.addEventListener('click', () => {
    chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'flex' : 'none';
});

const genAI = new GoogleGenerativeAI('AIzaSyCh3JMy0jeBC5yADzQk_XItx5ZUFnpd2-8');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

async function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
        addMessage('user', message);
        chatbotInput.value = '';

        try {
            const result = await model.generateContent(message);
            const response = await result.response.text();
            addMessage('bot', response);
        } catch (error) {
            console.error('Error:', error);
            addMessage('bot', 'Sorry, I encountered an error. Please try again.');
        }
    }
}

function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', ${sender}-message);
    messageElement.textContent = text;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

chatbotSend.addEventListener('click', sendMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});