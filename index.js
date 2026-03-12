// Authentication variables
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];

// DOM Elements
const inputElement = document.getElementById("input");
const typeElement = document.getElementById("type");
const convertButton = document.getElementById("convert");
const clearButton = document.getElementById("clear");
const resultContainer = document.getElementById("result");
const historyContainer = document.getElementById("history");

let conversionHistory = [];
function openLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
}

function openSignupModal() {
    document.getElementById('signupModal').classList.add('show');
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.remove('show');
}

function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === signupModal) {
        closeSignupModal();
    }
}

// Login handler
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateAuthUI();
        closeLoginModal();
        document.getElementById('loginForm').reset();
        showNotification('تم تسجيل الدخول بنجاح! ✓', 'success');
    } else {
        showNotification('البريد أو كلمة المرور غير صحيحة', 'error');
    }
}

// Signup handler
function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    
    if (password !== confirm) {
        showNotification('كلمات المرور غير متطابقة', 'error');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showNotification('هذا البريد مسجل بالفعل', 'error');
        return;
    }
    
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    updateAuthUI();
    closeSignupModal();
    document.getElementById('signupForm').reset();
    showNotification('تم إنشاء الحساب بنجاح! ✓', 'success');
}

// Logout handler
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    document.getElementById('userMenu').classList.add('hidden');
    showNotification('تم تسجيل الخروج بنجاح', 'success');
}

// Update auth UI
function updateAuthUI() {
    const authButtons = document.querySelector('.nav-auth');
    const userMenu = document.getElementById('userMenu');
    
    if (currentUser) {
        authButtons.innerHTML = `
            <button class="btn-user" onclick="toggleUserMenu()">
                👤 ${currentUser.name.split(' ')[0]}
            </button>
        `;
        document.querySelector('.user-name').textContent = currentUser.name;
        document.querySelector('.user-email').textContent = currentUser.email;
        userMenu.classList.remove('hidden');
    } else {
        authButtons.innerHTML = `
            <button class="btn-login" onclick="openLoginModal()">Login</button>
            <button class="btn-signup" onclick="openSignupModal()">Sign Up</button>
        `;
        userMenu.classList.add('hidden');
    }
}

// Toggle user menu
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    userMenu.classList.toggle('hidden');
}

// Click outside to close user menu
document.addEventListener('click', function(event) {
    const userMenu = document.getElementById('userMenu');
    const userBtn = document.querySelector('.btn-user');
    if (userBtn && !event.target.closest('.btn-user') && !event.target.closest('.user-menu')) {
        userMenu.classList.add('hidden');
    }
});

// Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 30px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4ade80' : type === 'error' ? '#ff6b6b' : '#64c8ff'};
        color: white;
        border-radius: 10px;
        font-weight: 700;
        z-index: 3000;
        animation: slideInRight 0.4s ease;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(50px);
        }
    }
`;
document.head.appendChild(style);

// Check if user is already logged in
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
    inputElement.focus();
});

// Navigation functions
function goToLogin() {
    window.location.href = 'login.html';
}

function goToAbout() {
    window.location.href = 'about.html';
}

const conversionFactors = {
    // Distance conversions
    length: {
        name: "Length",
        conversions: [
            { from: "km", to: "mi", factor: 0.621371 },
            { from: "mi", to: "km", factor: 1.60934 }
        ]
    },
    "distance-cm": {
        name: "Centimeters",
        conversions: [
            { from: "cm", to: "in", factor: 0.393701 },
            { from: "in", to: "cm", factor: 2.54 }
        ]
    },
    "distance-ft": {
        name: "Feet & Meters",
        conversions: [
            { from: "ft", to: "m", factor: 0.3048 },
            { from: "m", to: "ft", factor: 3.28084 }
        ]
    },
    // Volume conversions
    volume: {
        name: "Volume",
        conversions: [
            { from: "L", to: "gal", factor: 0.264172 },
            { from: "gal", to: "L", factor: 3.78541 }
        ]
    },
    "volume-ml": {
        name: "Milliliters",
        conversions: [
            { from: "ml", to: "fl oz", factor: 0.033814 },
            { from: "fl oz", to: "ml", factor: 29.5735 }
        ]
    },
    // Mass/Weight conversions
    mass: {
        name: "Mass",
        conversions: [
            { from: "kg", to: "lbs", factor: 2.20462 },
            { from: "lbs", to: "kg", factor: 0.453592 }
        ]
    },
    "weight-g": {
        name: "Grams",
        conversions: [
            { from: "g", to: "oz", factor: 0.035274 },
            { from: "oz", to: "g", factor: 28.3495 }
        ]
    },
    // Temperature conversions
    temperature: {
        name: "Temperature",
        isSpecial: true,
        conversions: [
            { from: "°C", to: "°F", convert: (val) => (val * 9/5) + 32 },
            { from: "°F", to: "°C", convert: (val) => (val - 32) * 5/9 }
        ]
    },
    "temp-kelvin": {
        name: "Kelvin",
        isSpecial: true,
        conversions: [
            { from: "K", to: "°C", convert: (val) => val - 273.15 },
            { from: "°C", to: "K", convert: (val) => val + 273.15 }
        ]
    },
    // Area conversions
    area: {
        name: "Area",
        conversions: [
            { from: "m²", to: "ft²", factor: 10.7639 },
            { from: "ft²", to: "m²", factor: 0.092903 }
        ]
    },
    "area-km": {
        name: "Large Area",
        conversions: [
            { from: "km²", to: "mi²", factor: 0.386102 },
            { from: "mi²", to: "km²", factor: 2.58999 }
        ]
    },
    // Speed conversions
    speed: {
        name: "Speed",
        conversions: [
            { from: "km/h", to: "mph", factor: 0.621371 },
            { from: "mph", to: "km/h", factor: 1.60934 }
        ]
    },
    "speed-ms": {
        name: "Speed (m/s)",
        conversions: [
            { from: "m/s", to: "ft/s", factor: 3.28084 },
            { from: "ft/s", to: "m/s", factor: 0.3048 }
        ]
    },
    // Energy conversions
    energy: {
        name: "Energy",
        conversions: [
            { from: "J", to: "cal", factor: 0.239006 },
            { from: "cal", to: "J", factor: 4.184 }
        ]
    },
    // Pressure conversions
    pressure: {
        name: "Pressure",
        conversions: [
            { from: "Pa", to: "psi", factor: 0.000145038 },
            { from: "psi", to: "Pa", factor: 6894.76 }
        ]
    }
};

function performConversion() {
    const value = Number(inputElement.value);

    // Validation
    if (inputElement.value.trim() === "") {
        displayError("Please enter a value");
        return;
    }

    if (isNaN(value)) {
        displayError("Please enter a valid number");
        return;
    }

    if (value > 100000000) {
        displayError("Number is too large. Maximum value is 100,000,000");
        return;
    }

    // Temperature doesn't need positive number validation
    const conversionType = typeElement.value;
    if (!conversionType.includes("temp") && !conversionType.includes("temperature") && value < 0) {
        displayError("Please enter a positive number");
        return;
    }

    const typeData = conversionFactors[conversionType];

    let resultHTML = "";
    let historyEntry = "";

    typeData.conversions.forEach((conv) => {
        let result;
        if (typeData.isSpecial && conv.convert) {
            result = conv.convert(value).toFixed(4);
        } else {
            result = (value * conv.factor).toFixed(4);
        }
        resultHTML += `<div class="result-item success">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span><strong style="color: #64c8ff;">${value}</strong> ${conv.from}</span>
                <span style="color: rgba(255,255,255,0.5); margin: 0 15px;">→</span>
                <span><strong style="color: #a78bfa;">${result}</strong> ${conv.to}</span>
            </div>
        </div>`;
        historyEntry = `${value} ${conv.from} → ${result} ${conv.to}`;
    });

    resultContainer.innerHTML = resultHTML;
    addToHistory(historyEntry, typeData.name);
}

function displayError(message) {
    resultContainer.innerHTML = `<div class="result-item error">
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.3em;">⚠️</span>
            <span><strong>${message}</strong></span>
        </div>
    </div>`;
}

function addToHistory(conversion, type) {
    const historyItem = { conversion, type, timestamp: new Date().toLocaleTimeString() };
    conversionHistory.unshift(historyItem);
    if (conversionHistory.length > 10) {
        conversionHistory.pop();
    }
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (conversionHistory.length === 0) {
        historyContainer.innerHTML = "";
        return;
    }

    let historyHTML = '<div class="history-title">📋 Recent Conversions</div>';
    conversionHistory.forEach((item, index) => {
        historyHTML += `
            <div class="history-item" onclick="useHistoryItem(${index})" title="Click to use this conversion">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 700; color: #64c8ff; font-size: 0.92rem;">${item.type}</div>
                        <div style="color: rgba(255,255,255,0.85); margin-top: 4px; font-size: 0.95rem;">${item.conversion}</div>
                    </div>
                    <div style="font-size: 0.75rem; opacity: 0.6; white-space: nowrap;">${item.timestamp}</div>
                </div>
            </div>
        `;
    });
    historyContainer.innerHTML = historyHTML;
}

function useHistoryItem(index) {
    const item = conversionHistory[index];
    const value = item.conversion.split(" ")[0];
    inputElement.value = value;
    performConversion();
}

function clearAll() {
    inputElement.value = "";
    resultContainer.innerHTML = "";
    inputElement.focus();
}

// Event listeners
convertButton.addEventListener("click", performConversion);
clearButton.addEventListener("click", clearAll);

// Allow Enter key to trigger conversion
inputElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        performConversion();
    }
});

typeElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        performConversion();
    }
});

// Auto-focus on load
window.addEventListener("load", () => {
    inputElement.focus();
});