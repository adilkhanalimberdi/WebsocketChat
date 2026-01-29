// Pages
const usernamePage = document.querySelector('.username-page');
const chatPage = document.querySelector('.chat-page');

// Forms
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');

// Inputs
const usernameInput = document.querySelector('#username-input');
const messageInput = document.querySelector('#message-input');

// Elements
const connectingElement = document.querySelector('.connecting');
const chatHistoryElement = document.querySelector('#chat-history');


let stompClient = null;
let username = null;

const colors = [
    "#005fff", "#ff4300", "#ff0078", "#ff0000",
    "#9d17ff", "#44ff04", "#ffdd00", "#00ffd0"
];

function connect(event) {
    event.preventDefault();

    username = usernameInput.value.trim();

    if (username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');
        chatPage.style.display = 'flex';

        let socket = new SockJS('http://localhost:8888/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
}

function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);

    stompClient.send(
        '/app/chat.addUser',
        {},
        JSON.stringify(
            {
                sender: username,
                type: 'JOIN'
            }
        )
    );

    connectingElement.classList.add('hidden');
}

function onError(error) {
    console.log(error);
    connectingElement.textContent = 'Could not connect to the Websocket server, please try again.';
    connectingElement.style.color = 'red';
    if (connectingElement.classList.contains('hidden')) {
        connectingElement.classList.remove('hidden');
    }
}

function onMessageReceived(payload) {
    let message = JSON.parse(payload.body);
    let messageElement = document.createElement("li");
    let div = document.createElement("div");

    if (message.type === "JOIN") {
        message.content = message.sender + " joined!";
        div.classList.add("event-message");
    } else if (message.type === "LEAVE") {
        message.content = message.sender + " left!";
        div.classList.add("event-message");
    } else {
        div.classList.add("chat-message");

        let color = getRandomColor(message.sender);

        let usernameElement = document.createElement("span");
        let usernameText = document.createTextNode(message.sender);
        usernameElement.style.color = color;

        usernameElement.appendChild(usernameText);

        div.appendChild(usernameElement);
    }

    if (message.type !== "JOIN") {
        if (message.sender === username) {
            messageElement.classList.add("from-user");
        } else {
            messageElement.classList.add("from-another");
        }
    }

    let textElement = document.createElement("p");
    let text = message.content || "";
    let messageText = document.createTextNode(text);

    textElement.appendChild(messageText);
    div.appendChild(textElement);

    messageElement.appendChild(div);

    chatHistoryElement.appendChild(messageElement);
    chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
}

function sendMessage(event) {
    event.preventDefault();

    let messageContent = messageInput.value.trim();

    if (messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };

        stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
}

function getRandomColor(username) {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = 31 * username.charCodeAt(i) + hash;
    }
    return colors[Math.abs(hash % colors.length)];
}

usernameForm.addEventListener('submit', connect);
messageForm.addEventListener('submit', sendMessage);