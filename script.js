const sidePanel = document.getElementById("sidePanel");
const mainContent = document.getElementById("mainContent");
const iFrame = document.getElementById("contentFrame");
const buttonToggler = document.getElementById("addLink");
const wwwInput = document.getElementById("toggleInput");
const navList = document.getElementById("navList");
const addURL = document.getElementById("addURL");
const timer = document.getElementById("setTimer");
const session = document.getElementById("timerSession");
const startSession = document.getElementById("setSession");
const timeInput = document.getElementById("enterTime");
const current = document.getElementById("currentBtn");
const displayArt = document.getElementById("artDisplay");
const weather = document.getElementById("weatherText");
const artWindow = document.getElementById("artWindow");
const navLink = document.getElementById("navLink");
let sessionStarted = false;

// Get Weather information from open-meteo
window.onload = () => {
  getLocation();
  let lat = localStorage.getItem("lat");
  let long = localStorage.getItem("long");
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
  )
    .then((response) => response.json())
    .then((data) => {
      const currentTemp = data.current.temperature_2m;
      const currentWind = data.current.wind_speed_10m;
      document.getElementById("currentTemp").innerHTML = `Temp:
 ${((currentTemp * 9/5) + 32).toFixed(0)}°F`;
      document.getElementById("currentWind").innerHTML = `Wind:
      ${currentWind} ${data.current_units.wind_speed_10m}`;

    })
    .catch((error) => console.error("Error", error));
};

function fetchArt() {
  // FETCH Art ARTIC API
fetch("https://api.artic.edu/api/v1/artworks/27992")
  .then((response) => response.json())
  .then((data) => {
    const id = data.data.image_id;
    const artName = data.data.artist_title;
    const artist = data.data.artist_display;
    const artCredit = data.data.short_description;

    document.getElementById(
      "artImage"
    ).src = `https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg`;
    document.getElementById("artImage").alt = `${artName}`;
    document.getElementById("artTitle").innerHTML = `${artName} `;
    document.getElementById("artist").innerHTML = `${artist}`;
    document.getElementById("artText").innerHTML = `${artCredit}`;
  });
}

// Display Art ARTIC API
displayArt.addEventListener("click", () => {
  let confirmed = false;
  if (sessionStarted === false) {
    window.confirm(
      "Art History is apart of your session time. \nBegin Session to browse art!"
    );
  } else if (
    sessionStarted === true &&
    window.confirm(
      "Are you sure you would like to use the rest of your time \n NO TAKE BACKS"
    )
  ) {
    confirmed = true;
    fetchArt();
    
      artWindow.style.visibility = "visible";
    
  }
});

// Disable art browse button and innerHTML = "Start Session"
navLink.addEventListener("click", () => {
  if (sessionStarted === true) {
    artWindow.style.visibility = "hidden";
  } else return;
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    weather.innerText = "Geolocation is not supported by this browser.";
  }
}

function success(position) {
  weather.innerHTML = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
  localStorage.setItem("lat", position.coords.latitude);
  localStorage.setItem("long", position.coords.longitude);
  return lat, long;
}

function error() {
  alert("Sorry, no position avaliable.");
}
// Set realTime Time and set Interval refresh 30 second (Reliable / Less Intervals)
// 2 Intervals every minute
let realTime = setInterval(() => {
  const time = new Date();
  let currentTime = time.toLocaleString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    },
    30000
  );
  // Set current time in lower side panel
  document.getElementById("sessionTimer").innerHTML = `
                 <h3
                    style="
                    text-align:center; 
                    padding-bottom: 10px;
                    font-size: 24px;
                    "
                >${currentTime}</h3>
                `;
}, 1000);

// Set zipCode for later use
const addLinkToggle = document
  .getElementById("addLink")
  .addEventListener("click", () => {
    // Toggle Add/Remove Button Classes
    if (buttonToggler.classList.contains("add")) {
      wwwInput.classList.remove("hidden");
      buttonToggler.classList.add("subtract");
      buttonToggler.classList.remove("add");
      buttonToggler.innerHTML = "-";
    } else if (!buttonToggler.classList.contains("add")) {
      wwwInput.classList.add("hidden");
      buttonToggler.classList.add("add");
      buttonToggler.classList.remove("subtract");
      buttonToggler.innerHTML = "+";
    }
  });

addURL.addEventListener("click", () => {
  const inputText = document.getElementById("inputFieldValue").value;
  let anchor = document.createElement("a");
  let navListItem = document.createElement("li");
  let link = (anchor.href = `https://${inputText}`);
  let newText = inputText.split(".")[1];
  if (inputText == undefined) {
    return;
  } else if (inputText == "") {
    alert("Please enter a valid URL");
    return;
  } else if (inputText !== null || inputText !== "") {
    iFrame.setAttribute("src", `${link}`);
    anchor.textContent = `${newText}`;
    anchor.setAttribute("target", "contentFrame");
    anchor.setAttribute("id", "navLink");
    navListItem.append(anchor);
    navList.append(navListItem);
    document.getElementById("inputFieldValue").value = "";
  }
});

timer.addEventListener("click", () => {
  session.classList.toggle("hidden");
  const now = new Date();
  let currentMinutes = now.getMinutes() + 1;

  if (currentMinutes >= 60) {
    currentMinutes = currentMinutes % 60;
    now.setHours(now.getHours() + 1);
  }

  let currentHours = now.getHours();
  if (currentHours < 10) currentHours = "0" + currentHours;
  if (currentMinutes < 10) currentMinutes = "0" + currentMinutes;

  timeInput.value = `${currentHours}:${currentMinutes}`;
});

startSession.addEventListener("click", () => {
  setSessionTime();
});

let x = null;
let timerActive = false;

function setSessionTime() {
  if (timerActive) return;
  timerActive = true;
  sessionStarted = true;
  if (x) clearInterval(x);

  const countdownEl = document.getElementById("countdown");
  const timeframe = document.getElementById("enterTime").value;
  const [inputHours, inputMinutes] = timeframe.split(":").map(Number);

  const now = new Date();
  const target = new Date();
  target.setHours(inputHours, inputMinutes, 0, 0);

  if (target < now) {
    target.setDate(target.getDate() + 1);
  }

  const endTime = target.getTime();
  // const diff = endTime - now.getTime();

  document.getElementById("mainContent").classList.remove("blackScreen");
  document.getElementById("timerSession").classList.add("hidden");
  document.getElementById("setTimer").classList.add("hidden");
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("welcome").classList.remove("visible");
  artWindow.style.visibility = "hidden";
  x = setInterval(() => {
    const current = new Date().getTime();
    const diff = endTime - current;

    if (diff <= 0) {
      clearInterval(x);
      x = null;
      timerActive = false;

      document.getElementById("mainContent").classList.add("blackScreen");
      countdownEl.style.visibility = "hidden";
      document.getElementById("setTimer").classList.remove("hidden");

      document.getElementById("sessionTimer").innerHTML = `
      <h3 style="text-align: center; padding-bottom: 10px; font-size: 24px;
      color: red;">
      Session Ended
      </h3>`;
      document.getElementById("welcome").classList.add("visible");
      document.getElementById("welcome").classList.remove("hidden");
      sessionStarted = false;
    }

    navLink.addEventListener("click", () => {
      artWindow.style.visibility = "hidden";
    });

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownEl.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
    countdownEl.style.color = diff <= 60000 ? "red" : "black";
  }, 1000);
}
// In case window doesn't load
 getLocation();