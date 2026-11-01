// ==========================================
// ANNIVERSARY INVITATION CONFIGURATION
// ==========================================

const config = {
  recipientName: "Hilda Fardania Putri",
  date: "2026-11-07",
  dateLabel: "Sabtu, 7 November 2026",
  time: "19.00 WIB",
  time24: "19:00",
  place: "The Nineteen Jakarta",
  address: "Jl. Jend. Sudirman, Senayan, Kec. Kby. Baru, Jakarta, Daerah Khusus Ibukota Jakarta 12190",
  mapsUrl: "https://maps.app.goo.gl/L8c1t8KyyJJbSRYU7?g_st=aw",
  dressCode: "Pakai yang bikin kamu nyaman ♡",
};

// ==========================================
// INITIALIZE CONTENT
// ==========================================

document.querySelectorAll("[data-name]").forEach((el) => {
  el.textContent = config.recipientName;
});

document.getElementById("dinnerDate").textContent = config.dateLabel;
document.getElementById("dinnerTime").textContent = config.time;
document.getElementById("dinnerPlace").textContent = config.place;
document.getElementById("dinnerAddress").textContent = config.address;
document.getElementById("dressCode").textContent = config.dressCode;

const mapsLink = document.getElementById("mapsLink");

if (config.mapsUrl) {
  mapsLink.href = config.mapsUrl;
} else {
  mapsLink.hidden = true;
}

// ==========================================
// ENVELOPE OPENING ANIMATION
// ==========================================

const envelopeScreen = document.getElementById("envelopeScreen");
const envelope = document.querySelector(".envelope");
const envelopeButton = document.getElementById("envelopeButton");
const openButton = document.getElementById("openButton");
const invitation = document.getElementById("invitation");
const scrollHint = document.getElementById("scrollHint");

let isOpening = false;

function openEnvelope() {
  if (isOpening) return;
  isOpening = true;

  envelope.classList.add("open");
  openButton.disabled = true;
  envelopeButton.disabled = true;

  setTimeout(() => {
    envelopeScreen.classList.add("exit");
  }, 1800);

  setTimeout(() => {
    envelopeScreen.hidden = true;
    invitation.hidden = false;

    document.body.classList.remove("locked");
    window.scrollTo(0, 0);

    scrollHint.hidden = false;

    initializeReveal();
    updateScrollHint();
  }, 2600);
}

envelopeButton.addEventListener("click", openEnvelope);
openButton.addEventListener("click", openEnvelope);

// ==========================================
// SCROLL REVEAL ANIMATION
// ==========================================

let revealObserver;

function initializeReveal() {
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px",
    },
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
}

// ==========================================
// FLOATING KEEP SCROLLING MESSAGE
// ==========================================

const rsvpSection = document.getElementById("rsvpSection");

function updateScrollHint() {
  if (invitation.hidden || !successScreen.hidden) {
    scrollHint.hidden = true;
    return;
  }

  const rsvpPosition = rsvpSection.getBoundingClientRect();

  // Hide when the RSVP section is visible
  const rsvpVisible =
    rsvpPosition.top < window.innerHeight * 0.75 && rsvpPosition.bottom > 0;

  scrollHint.hidden = rsvpVisible;
}

window.addEventListener("scroll", updateScrollHint, {
  passive: true,
});

window.addEventListener("resize", updateScrollHint);

// ==========================================
// COUNTDOWN TIMER
// ==========================================

const targetDate = new Date(
  `${config.date}T${config.time24}:00+07:00`,
).getTime();

function updateCountdown() {
  const difference = targetDate - Date.now();

  if (difference <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach((id) => {
      document.getElementById(id).textContent = "00";
    });

    document.getElementById("countdownMessage").textContent =
      "Hari spesial kita akhirnya tiba! ♡";
    return;
  }

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");

  document.getElementById("hours").textContent = String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent = String(minutes).padStart(
    2,
    "0",
  );

  document.getElementById("seconds").textContent = String(seconds).padStart(
    2,
    "0",
  );
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ==========================================
// PLAYFUL RSVP BUTTONS
// ==========================================

const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const noMessage = document.getElementById("noMessage");
const rsvpButtons = document.getElementById("rsvpButtons");

const successScreen = document.getElementById("successScreen");
const successDate = document.getElementById("successDate");
const backButton = document.getElementById("backButton");

let noAttempts = 0;

const funnyMessages = [
  "Eits, yakin mau nolak? 🥺",
  "Coba pikir lagi dong, sayang 🤭",
  "Yah, masa nggak mau sih? 😭",
  "Padahal aku udah siapin sesuatu spesial loh 🥹",
  "Hehehe, tombolnya kabur 😝",
  "Udah deh, pilih Mau aja! ❤️",
];

function moveNoButton() {
  noAttempts++;

  noMessage.textContent =
    funnyMessages[(noAttempts - 1) % funnyMessages.length];

  if (noAttempts >= 6) {
    noButton.textContent = "Mau juga deh ♡";
    noButton.classList.remove("escaping");
    noButton.style.left = "";
    noButton.style.top = "";
    noButton.style.transform = "";

    noButton.removeEventListener("pointerenter", moveNoButton);
    noButton.removeEventListener("touchstart", escapeOnTouch);

    noButton.addEventListener("click", acceptInvitation);
    return;
  }

  noButton.classList.add("escaping");

  const containerWidth = rsvpButtons.clientWidth;
  const containerHeight = rsvpButtons.clientHeight;

  const buttonWidth = noButton.offsetWidth;
  const buttonHeight = noButton.offsetHeight;

  const maxX = Math.max(0, containerWidth - buttonWidth);
  const maxY = Math.max(0, containerHeight - buttonHeight);

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  noButton.style.left = `${randomX}px`;
  noButton.style.top = `${randomY}px`;
  noButton.style.transform = "none";
}

function escapeOnTouch(event) {
  event.preventDefault();
  moveNoButton();
}

noButton.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") {
    moveNoButton();
  }
});

noButton.addEventListener("touchstart", escapeOnTouch, {
  passive: false,
});

noButton.addEventListener("click", (event) => {
  if (noAttempts < 6) {
    event.preventDefault();
    moveNoButton();
  }
});

function acceptInvitation() {
  successDate.textContent = `${config.dateLabel} • ${config.time}`;

  // Tampilkan halaman akhir
  successScreen.hidden = false;

  // Kunci scroll halaman belakang
  document.body.classList.add("locked");

  // Hilangkan petunjuk scroll
  scrollHint.hidden = true;

  // Jalankan animasi bunga dan hati
  createFloatingHearts();
}

yesButton.addEventListener("click", acceptInvitation);

// ==========================================
// ROMANTIC FLOWER & HEART ANIMATION
// ==========================================

function createFloatingHearts() {
  const container = document.getElementById("heartContainer");

  // Bersihkan animasi sebelumnya
  container.innerHTML = "";

  const flowers = ["🌸", "🌹", "🌷", "💮"];
  const hearts = ["❤️", "💕", "💗", "💖", "♡"];

  // Bunga berjatuhan dari atas
  for (let i = 0; i < 45; i++) {
    const flower = document.createElement("span");

    flower.className = "floating-flower";

    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];

    flower.style.left = `${Math.random() * 100}%`;

    flower.style.fontSize = `${15 + Math.random() * 20}px`;

    flower.style.animationDuration = `${4 + Math.random() * 5}s`;

    flower.style.animationDelay = `${Math.random() * 3}s`;

    container.appendChild(flower);
  }

  // Hati melayang dari bawah
  for (let i = 0; i < 30; i++) {
    const heart = document.createElement("span");

    heart.className = "floating-love";

    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = `${Math.random() * 100}%`;

    heart.style.fontSize = `${15 + Math.random() * 20}px`;

    heart.style.animationDuration = `${4 + Math.random() * 4}s`;

    heart.style.animationDelay = `${Math.random() * 2}s`;

    container.appendChild(heart);
  }
}

// ==========================================
// BACK TO INVITATION
// ==========================================

backButton.addEventListener("click", () => {
  successScreen.hidden = true;
  document.body.classList.remove("locked");
  updateScrollHint();
});
