const sidePanel = document.getElementById("sidePanel");
const mainContent = document.getElementById("mainContent");
const iFrame = document.getElementById("contentFrame");
// const iFrameName = document.getElementsByName("contentFrame");
const buttonToggler = document.getElementById("addLink");
const wwwInput = document.getElementById("toggleInput");
const navList = document.getElementById("navList");
const addURL = document.getElementById("addURL");
const timer = document.getElementById("setTimer");
const session = document.getElementById("timerSession");
const startSession = document.getElementById("setSession");
const timeInput = document.getElementById("enterTime");

window.onload = function () {
  const zipCode = prompt("Enter your Zip Code");
  if (zipCode == null || zipCode == "") {
    zipCode = "00000"; // Default value if user cancels or leaves empty
  } else {
    localStorage.setItem("zipCode", zipCode);
  }
  console.log(zipCode);
};


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
  iFrame.setAttribute("src", `${link}`);
  anchor.textContent = `${newText}`;
  anchor.setAttribute("target", "contentFrame");
  navListItem.append(anchor);
  navList.append(navListItem);
  document.getElementById("inputFieldValue").value = "";
  if (inputText == undefined) {
    alert("Enter URL please");
    // document.getElementById("inputFieldValue").value = "";
    // iFrame.setAttribute("src", `${link}`);
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

  if (x) clearInterval(x);

  const countdownEl = document.getElementById("countdown");
  const timeframe = document.getElementById("enterTime").value;
  const [inputHours, inputMinutes] = timeframe.split(":").map(Number);

  const now = new Date();
  const target = new Date();
  target.setHours(inputHours, inputMinutes, 0, 0);

  if (target < now) {
    target.setDate(target.getDate() + 1); // Set to next day if time has passed
  }

  const endTime = target.getTime();
  const diff = endTime - now.getTime();


  document.getElementById("mainContent").classList.remove("blackScreen");
  document.getElementById("timerSession").classList.add("hidden");
  document.getElementById("setTimer").classList.add("hidden");

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
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownEl.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
    countdownEl.style.color = diff <= 60000 ? "red" : "black";
  }, 1000);
}
