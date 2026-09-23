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

var tiltOn = false;
var targetX = 0;
var currentX = 0;
var running = false;

function frame() {
  currentX += (targetX - currentX) * 0.12;
  if (Math.abs(currentX) < 0.4) currentX = 0;
  document.body.style.transform = "translate3d(" + currentX.toFixed(2) + "px,0,0)";
  if (Math.abs(targetX - currentX) > 0.05 || Math.abs(currentX) > 0.4) {
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
  var x = Math.max(-18, Math.min(18, g)) * 0.8;
  if (Math.abs(g) < 4) x = 0;
  setX(x);
}

function attach() {
  window.addEventListener("deviceorientation", onOrient, true);
  tiltOn = true;
}

if (window.DeviceOrientationEvent) {
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    document.addEventListener("pointerdown", function one() {
      document.removeEventListener("pointerdown", one);
      DeviceOrientationEvent.requestPermission().then(function (state) {
        if (state === "granted") attach();
      }).catch(function () {});
    });
  } else {
    attach();
  }
}