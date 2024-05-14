// Initialize constants and variables
const chatInput = document.querySelector("#chat-input");
const initialInputHeight = chatInput.style.height;
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
const API_KEY = "sk-8d597984e45443f79e6d606636d55429"; // Replace with your API key
const API_URL = "https://api.deepseek.com/v1/chat/completions";

// Load data from localStorage
const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("themeColor");
    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>ChatGPT Clone</h1>
                            <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
                        </div>`;
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

// Create chat element
const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
};

// Get chat response from API
const getChatResponse = async () => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                {"role": "user", "content": userText}
            ]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error fetching chat response:", error);
        return "Sorry, something went wrong. Please try again.";
    }
};

// Handle outgoing chat
const handleOutgoingChat = async () => {
    userText = chatInput.value.trim();
    if (!userText) return;

    chatInput.value = "";
    chatInput.style.height = initialInputHeight;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="user.png" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

    const response = await getChatResponse();
    const responseHtml = `<div class="chat-content">
                            <div class="chat-details">
                                <img src="chatbot.png" alt="chatbot-img">
                                <p>${response}</p>
                            </div>
                        </div>`;

    const incomingChatDiv = createChatElement(responseHtml, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

    localStorage.setItem("all-chats", chatContainer.innerHTML);
};

// Event listeners
sendButton.addEventListener("click", handleOutgoingChat);
// Enter key to send message
chatInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        handleOutgoingChat();
    }
});
// Load initial data
loadDataFromLocalstorage(); 

// Theme button functionality
themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
    localStorage.setItem("themeColor", document.body.classList.contains("light-mode") ? "light_mode" : "dark_mode");
});

// Delete button functionality
deleteButton.addEventListener("click", () => {
    localStorage.removeItem("all-chats");
    chatContainer.innerHTML = `<div class="default-text">
                                <h1>ChatGPT Clone</h1>
                                <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
                            </div>`;                                   
});
