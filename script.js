var menuBtn = document.getElementById("menuBtn");
var navLinks = document.getElementById("navLinks");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });
}

var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

var devisForm = document.getElementById("devisForm");
if (devisForm) {
  devisForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var nom = document.getElementById("d-nom").value.trim();
    var tel = document.getElementById("d-tel").value.trim();
    var modele = document.getElementById("d-modele").value.trim();
    var panne = document.getElementById("d-panne").value;
    var msg = document.getElementById("d-msg").value.trim();

    var lignes = ["Bonjour Lam Phone, je souhaite un devis gratuit pour une réparation :"];
    if (nom) lignes.push("Prénom : " + nom);
    if (tel) lignes.push("Mon numéro : " + tel);
    if (modele) lignes.push("Appareil : " + modele);
    if (panne) lignes.push("Panne : " + panne);
    if (msg) lignes.push("Détails : " + msg);
    lignes.push("Merci de m'envoyer un devis.");

    window.open("https://wa.me/33763517025?text=" + encodeURIComponent(lignes.join("\n")), "_blank");
  });
}

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

document.documentElement.classList.add("js-ready");

var revEls = document.querySelectorAll(".rev");
function showRev(el) {
  el.classList.add("in");
}
if ("IntersectionObserver" in window && revEls.length) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        showRev(en.target);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  revEls.forEach(function (el) { io.observe(el); });
} else {
  revEls.forEach(showRev);
}

/* ====================== Assistance virtuelle ====================== */

var WA_CHAT = "Bonjour Lam Phone, mon téléphone : ";

var CHAT_INTENTS = [
  { keys: ["bonjour", "salut", "hello", "coucou", "bonsoir"],
    text: ["Bonjour et bienvenue chez Lam Phone ! Je réponds à vos questions : tarifs, délais, localisation, panne, devis... Comment puis-je vous aider ?"] },
  { keys: ["tarif", "prix", "combien", "cout", "budget"],
    text: ["Voici les tarifs, toujours annoncés AVANT l'intervention :",
      "Écran : à partir de 49 € (Android) / 69 € (iPhone)",
      "Batterie : à partir de 29 € (Android) / 39 € (iPhone)",
      "Port de charge : à partir de 35 € (Android) / 45 € (iPhone)",
      "Caméra : à partir de 39 € (Android) / 49 € (iPhone)",
      "Diagnostic : gratuit",
      "Le devis exact est gratuit et sans engagement."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["ecran", "fissu", "vitre", "cassee", "fendu"],
    text: ["Écran fissuré ou cassé ? Le remplacement prend environ 30 minutes.",
      "Écran : à partir de 49 € (Android) / 69 € (iPhone). Prix final annoncé avant de commencer."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["batterie", "autonomie", "decharge", "lidle", "batterie"],
    text: ["Batterie fatiguée ? Changement en 20 minutes environ.",
      "Batterie : à partir de 29 € (Android) / 39 € (iPhone)."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["port de charge", "ne charge", "charge plus", "connecteur", "ne recharge"],
    text: ["Problème de charge ? Nettoyage ou remplacement du connecteur en 30 minutes environ.",
      "Port de charge : à partir de 35 € (Android) / 45 € (iPhone)."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["camera", "photo floue", "photo"],
    text: ["Photo floue ou caméra endommagée ? Les modules avant et arrière sont réparables.",
      "Caméra : à partir de 39 € (Android) / 49 € (iPhone)."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["eau", "liquide", "mouille", "trempe", "tombee dans", "pluie"],
    text: ["Important : éteignez l'appareil, ne le rebranchez PAS, et agissez vite.",
      "Plus l'intervention est rapide, plus on sauve de données. Contactez-moi immédiatement."],
    acts: [{ t: "call", c: "act-call", l: "Je dois agir vite" }, { t: "wa", c: "act-wa", l: "WhatsApp" }] },
  { keys: ["ordinateur", " pc", "portable", "mac", "clavier"],
    text: ["Bien sûr, je répare aussi les ordinateurs : PC lent, écran ou clavier cassé, mise à niveau.",
      "Le tarif est personnalisé selon la panne, annoncé avant de commencer."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis personnalisé" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["marque", "iphone", "samsung", "apple", "xiaomi", "huawei", "pixel", "oppo", "sony"],
    text: ["Je répare toutes les marques : Apple/iPhone, Samsung, Xiaomi, Huawei, Google Pixel, Oppo, Sony...", "Et les pièces sont d'origine ou compatibles selon votre budget."],
    acts: [{ t: "call", c: "act-call", l: "Parler de mon modèle" }] },
  { keys: ["devis", "estimation", "engagement", "depannage"],
    text: ["Le devis est gratuit, sans engagement, et vous l'avez en moins de 5 minutes.",
      "Remplissez le formulaire en ligne (2 minutes), ou envoyez-moi directement votre panne sur WhatsApp."],
    acts: [{ t: "devis", c: "act-devis", l: "Formulaire en ligne" }, { t: "wa", c: "act-wa", l: "WhatsApp" }] },
  { keys: ["horaire", "ouverture", "ouvert", "dimanche", "24h", "samedi"],
    text: ["Je suis disponible 24h/24 et 7j/7, y compris le week-end et tard le soir.",
      "Si je ne peux pas répondre tout de suite, je rappelle dans la minute."],
    acts: [{ t: "call", c: "act-call", l: "Appeler maintenant" }] },
  { keys: ["ou etes", "localisation", "adresse", "pont eveque", "vienne", "deplacement", "chez moi", "domicile", "rayon", "ou vous"],
    text: ["Je suis à Pont-Évêque (38780).",
      "Et je me déplace chez vous : Pont-Évêque, Vienne, Estrablin, Jardin, Saint-Romain-en-Gal, Chasse-sur-Rhône et les communes autour."],
    acts: [{ t: "maps", c: "act-devis", l: "Voir sur la carte" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["telephone", "numero", "appeler", "contact", "email", "joindre", "appel"],
    text: ["Par téléphone : 07 63 51 70 25 (réponse rapide, même tard).",
      "Par WhatsApp : message direct, idéal pour envoyer une photo de votre panne.",
      "Par e-mail : lamphone38@gmail.com"],
    acts: [{ t: "call", c: "act-call", l: "Appeler" }, { t: "wa", c: "act-wa", l: "WhatsApp" }] },
  { keys: ["avis", "note", "reference", "conseille", "clients"],
    text: ["Les clients nous notent 4,9/5 ? C'est notre meilleure carte de visite.", "Ils reviennent et nous recommandent autour d'eux."],
    acts: [{ t: "avis", c: "act-devis", l: "Voir les avis" }] },
  { keys: ["combien de temps", "dure", "duree", "rapide", "long", "delai", "express", "temps"],
    text: ["Comptez 30 minutes en moyenne pour un écran ou un port de charge, 20 minutes pour une batterie.",
      "Les urgences passent en priorité, et la plupart des appareils repartent le jour même."] },
  { keys: ["diagnostic", "diagnostiqu"],
    text: ["Le diagnostic est gratuit et immédiat : je repère la panne et je vous annonce le prix exact avant tout travail."],
    acts: [{ t: "call", c: "act-call", l: "Prendre rendez-vous" }] },
  { keys: ["garantie", "garanti"],
    text: ["Les conditions exactes dépendent de la réparation réalisée : parlez-en directement avec moi, je vous réponds en toute transparence."],
    acts: [{ t: "call", c: "act-call", l: "Poser ma question" }, { t: "wa", c: "act-wa", l: "WhatsApp" }] },
  { keys: ["merci", "cool", "super", "genial", "parfait", "top"],
    text: ["Avec plaisir ! Si vous avez une autre question, je suis là. Et pour un devis, c'est gratuit."],
    acts: [{ t: "devis", c: "act-devis", l: "Demander un devis" }] }
];

var CHAT_FALLBACK = {
  text: ["Je n'ai pas trouvé de réponse claire sur ce point... mais je préfère vous répondre en direct, sans vous faire attendre."],
  acts: [{ t: "call", c: "act-call", l: "Appeler le 07 63 51 70 25" }, { t: "wa", c: "act-wa", l: "WhatsApp" }]
};

var chatOpenedOnce = false;

function normalizeChat(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/'/g, " ");
}

function matchChat(q) {
  var s = normalizeChat(q);
  var best = null, bestScore = 0;
  CHAT_INTENTS.forEach(function (it) {
    var n = 0, len = 0;
    it.keys.forEach(function (k) {
      if (s.indexOf(k) !== -1) { n++; len += k.length; }
    });
    if (n) {
      var score = n * 3 + len;
      if (score > bestScore) { bestScore = score; best = it; }
    }
  });
  return best;
}

function chatMsg(intent, userText) {
  var msgs = document.getElementById("chatMsgs");
  if (!msgs) return;

  var userEl = document.createElement("div");
  userEl.className = "msg user";
  userEl.textContent = userText;
  msgs.appendChild(userEl);
  msgs.scrollTop = msgs.scrollHeight;

  window.setTimeout(function () {
    var botEl = document.createElement("div");
    botEl.className = "msg bot";
    var html = "";
    (intent.text || []).forEach(function (line) {
      html += "<p style='margin:0 0 " + (intent.text.length > 1 ? "6px" : "0") + "'>" + line + "</p>";
    });
    if (intent.acts && intent.acts.length) {
      html += '<div class="msg-actions">';
      intent.acts.forEach(function (a) {
        var href = "", target = "";
        if (a.t === "call") href = "tel:+33763517025";
        else if (a.t === "wa") href = "https://wa.me/33763517025?text=" + encodeURIComponent(WA_CHAT + (userText || "j'ai une question"));
        else if (a.t === "devis") href = "devis.html";
        else if (a.t === "avis") href = "avis.html";
        else if (a.t === "maps") href = "https://www.google.com/maps/search/?api=1&query=Pont-%C3%89v%C3%A8que+38780";
        if (a.t === "wa" || a.t === "maps") target = ' target="_blank" rel="noopener"';
        html += '<a class="' + a.c + '" href="' + href + '"' + target + '>' + a.l + "</a>";
      });
      html += "</div>";
    }
    botEl.innerHTML = html;
    msgs.appendChild(botEl);
    msgs.scrollTop = msgs.scrollHeight;
  }, 280);
}

function chatOpen(el) {
  var panel = document.getElementById("chatPanel");
  if (!panel) return;
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  if (!chatOpenedOnce) {
    chatOpenedOnce = true;
    window.setTimeout(function () {
      var msgs = document.getElementById("chatMsgs");
      if (!msgs) return;
      var botEl = document.createElement("div");
      botEl.className = "msg bot";
      botEl.innerHTML = "<p style='margin:0'>&Agrave; votre service ! Posez-moi une question : tarifs, d&eacute;lais, panne, localisation... ou cliquez sur une suggestion ci-dessous.</p>";
      msgs.appendChild(botEl);
      msgs.scrollTop = msgs.scrollHeight;
    }, 250);
  }
  var inp = document.getElementById("chatText");
  if (inp) inp.focus();
}

function chatClose() {
  var panel = document.getElementById("chatPanel");
  if (!panel) return;
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
}

(function chatInit() {
  var btn = document.getElementById("chatBtn");
  var close = document.getElementById("chatClose");
  var form = document.getElementById("chatForm");
  var inp = document.getElementById("chatText");
  var quick = document.getElementById("chatQuick");

  if (btn) btn.addEventListener("click", function () { chatOpen(btn); });
  if (close) close.addEventListener("click", chatClose);

  if (form && inp) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = inp.value.trim();
      if (!q) return;
      inp.value = "";
      chatMsg(matchChat(q) || CHAT_FALLBACK, q);
    });
  }

  if (quick) {
    Array.prototype.forEach.call(quick.querySelectorAll("button"), function (b) {
      b.addEventListener("click", function () {
        var q = b.textContent.trim();
        chatMsg(matchChat(q) || CHAT_FALLBACK, q);
      });
    });
  }

  document.querySelectorAll(".open-chat").forEach(function (b) {
    b.addEventListener("click", function () { chatOpen(b); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") chatClose();
  });
})();