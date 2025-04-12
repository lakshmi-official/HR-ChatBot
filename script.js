// Backend URL configuration
const BACKEND_URL = 'http://localhost:5000';

// Login function
function login() {
    console.log("Login function called"); // Debug log
    
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("error-message");

    console.log(`Attempting login with username: ${username}`); // Debug log
    
    // For demo purpose - simple login
    if (username === "HRbot" && password === "123") {
        console.log("Login successful"); // Debug log
        
        // Get references to containers
        const loginContainer = document.getElementById("login-container");
        const chatContainer = document.getElementById("chat-container");
        
        if (!loginContainer || !chatContainer) {
            console.error("Container elements not found!"); // Debug error
            alert("Error: UI elements not found. Please refresh the page.");
            return;
        }
        
        // Hide login container and show chat container
        loginContainer.style.display = "none";
        chatContainer.style.display = "block";
        
        // Focus on input field
        const userInput = document.getElementById("user-input");
        if (userInput) {
            userInput.focus();
            console.log("Input focused"); // Debug log
        } else {
            console.error("User input element not found!"); // Debug error
        }
    } else {
        console.log("Login failed"); // Debug log
        errorMessage.textContent = "Invalid username or password!";
        // Clear password field
        document.getElementById("password").value = "";
    }
}

// Logout function
function logout() {
    document.getElementById("chat-container").style.display = "none";
    document.getElementById("login-container").style.display = "block";
    
    // Clear inputs
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("error-message").textContent = "";
    
    // Reset chat history
    document.getElementById("chat-box").innerHTML = `
        <div class="bot-message-container">
            <div class="bot-icon">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p class="bot-message">Welcome to HCL's HR Policy Assistant! I'm here to help you find information about HCL's HR policies. What would you like to know?</p>
            </div>
        </div>
    `;
}

// Toggle password visibility
function togglePassword() {
    let passwordField = document.getElementById("password");
    let toggleIcon = document.getElementById("toggle-password");
    
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    }
}

// Add typing indicator to chat
function showTypingIndicator() {
    const chatBox = document.getElementById("chat-box");
    const typingElement = document.createElement("div");
    typingElement.className = "bot-message-container typing-indicator";
    typingElement.id = "typing-indicator";
    typingElement.innerHTML = `
        <div class="bot-icon">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatBox.appendChild(typingElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send message function
function sendMessage() {
    let userInput = document.getElementById("user-input");
    let userMessage = userInput.value.trim();
    let chatBox = document.getElementById("chat-box");

    if (userMessage === "") return;
    
    // Ensure user can see the input area after sending a message
    setTimeout(() => {
        document.getElementById("user-input").scrollIntoView({behavior: "smooth"});
    }, 100);

    // Display user message
    chatBox.innerHTML += `
        <div class="user-message-container">
            <div class="message-content">
                <p class="user-message">${userMessage}</p>
            </div>
            <div class="user-icon">
                <i class="fas fa-user"></i>
            </div>
        </div>
    `;
    
    // Scroll to bottom of chat
    chatBox.scrollTop = chatBox.scrollHeight;

    // Clear input field
    userInput.value = "";

    // Show typing indicator
    showTypingIndicator();

    // Send message to backend
    fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Remove typing indicator
        removeTypingIndicator();
        
        let botResponse = data.response || "I apologize, but I couldn't find specific information about that in the HR policies. Could you try rephrasing your question?";
        
        // Display bot response
        chatBox.innerHTML += `
            <div class="bot-message-container">
                <div class="bot-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p class="bot-message">${botResponse}</p>
                </div>
            </div>
        `;
        
        // Scroll to bottom of chat
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
        console.error('Error:', error);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        chatBox.innerHTML += `
            <div class="bot-message-container">
                <div class="bot-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p class="bot-message">• I'm experiencing technical difficulties right now.<br>• Please try again in a moment.</p>
                </div>
            </div>
        `;
        
        // Scroll to bottom of chat
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// Bypass login function for troubleshooting (only if needed)
function bypassLogin() {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
    
    // Focus on input field
    const userInput = document.getElementById("user-input");
    if (userInput) {
        userInput.focus();
    }
    
    console.log("Bypassed login for testing");
}

// Add event listeners when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for pressing Enter in the user input field
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Add event listener for pressing Enter in the password field
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
    
    // Add event listener for pressing Enter in the username field
    const usernameField = document.getElementById('username');
    if (usernameField) {
        usernameField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('password').focus();
            }
        });
    }
    
    console.log("Event listeners initialized");
});