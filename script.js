document.getElementById("menuBtn").addEventListener("click", function () {
  document.getElementById("navLinks").classList.toggle("open");
});

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var msg = document.getElementById("formMsg");
  msg.textContent = "Merci " + document.getElementById("nom").value + " ! Votre demande a bien été reçue, nous vous rappelons au plus vite.";
  this.reset();
});

var isTouch = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
var tiltOn = false;
var targetX = 0;
var currentX = 0;
var running = false;

function frame() {
  currentX += (targetX - currentX) * 0.14;
  if (Math.abs(currentX) < 0.5) currentX = 0;
  document.body.style.transform = "translate3d(" + currentX.toFixed(2) + "px,0,0)";
  if (Math.abs(targetX - currentX) > 0.05 || Math.abs(currentX) > 0.5) {
    requestAnimationFrame(frame);
  } else {
    document.body.style.transform = "translate3d(0,0,0)";
    running = false;
  }
}

function setX(x) {
  targetX = x;
  if (!running) {
    running = true;
    requestAnimationFrame(frame);
  }
}

function onOrient(e) {
  if (!tiltOn) return;
  var g = e.gamma || 0;
  var x = Math.max(-24, Math.min(24, g)) * 1.3;
  if (Math.abs(g) < 3) x = 0;
  setX(x);
}

function onMouse(e) {
  if (isTouch || e.buttons === 0 && e.type !== "mousemove") { return; }
  var rel = (e.clientX / window.innerWidth) - 0.5;
  setX(rel * 72);
}

function attachOrientation() {
  window.addEventListener("deviceorientation", onOrient, true);
  tiltOn = true;
}

function askPermission() {
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission().then(function (state) {
      if (state === "granted") attachOrientation();
    }).catch(function () {});
  } else {
    attachOrientation();
  }
}

if (isTouch) {
  if (window.DeviceOrientationEvent) {
    var unlock = function () {
      window.removeEventListener("touchstart", unlock);
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("click", unlock);
      askPermission();
    };
    window.addEventListener("touchstart", unlock, { passive: true });
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("click", unlock);
  }
} else {
  window.addEventListener("mousemove", onMouse);
}