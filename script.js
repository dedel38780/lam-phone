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

var tiltEls = document.querySelectorAll(".grid, .hero .container");
var tilting = false;

function onOrient(e) {
  if (tilting) return;
  tilting = true;
  var g = e.gamma || 0;
  var b = e.beta || 0;
  var gx = Math.max(-20, Math.min(20, g)) * 0.8;
  var bx = Math.max(-15, Math.min(15, b - 45)) * 0.6;
  for (var i = 0; i < tiltEls.length; i++) {
    tiltEls[i].style.transform = "translate3d(" + gx + "px," + bx + "px,0)";
  }
  requestAnimationFrame(function () { tilting = false; });
}

function enableTilt() {
  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission().then(function (state) {
        if (state === "granted") window.addEventListener("deviceorientation", onOrient, true);
      }).catch(function () {});
    } else {
      window.addEventListener("deviceorientation", onOrient, true);
    }
  }
}

if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) enableTilt();