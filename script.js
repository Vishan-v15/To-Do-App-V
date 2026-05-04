// first page js
// index.html

// runwhen page loads
document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("UserName") || "Friend";
    const welcomeEl = document.getElementById("welcomeText");

    if (welcomeEl) {
        welcomeEl.textContent = `Hey 👋 ${userName}`;
    }
});

// save name from 1st page

function startApp() {
    const nameInput= document.getElementById("name");
    const name = nameInput.value.trim();

    if (name){
        localStorage.setItem("userName", name);
    }
    else{
        localStorage.setItem("UserName", "Friend");
    }
    
window.location.href = "to-do.html";
    
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}