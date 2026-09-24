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

var WA_CHAT = "Bonjour Lam Phone, ";

var THEME_TEXT = "Je peux répondre sur : tarifs, délais, écran, batterie, port de charge, caméra, dégâts d'eau, ordinateur, son, boutons, Wi-Fi, données, paiement, localisation, horaires, devis... et bien plus.";

var CHAT_INTENTS = [
  { keys: ["bonjour", "salut", "hello", "coucou", "bonsoir", "specialiste"],
    text: ["Bonjour et bienvenue chez Lam Phone ! Posez-moi n'importe quelle question : un tarif, un délai, une panne, une adresse... je réponds tout de suite."] },
  { keys: ["qui es tu", "c est quoi", "assistant", "tu es", " intelligente", "vrai personne"],
    text: ["Je suis l'assistant virtuel de Lam Phone : je connais les tarifs, les pannes réparées et les disponibilités.", "Si ma réponse devient trop technique ou incomplète, je vous passe tout de suite à un humain."] },
  { keys: ["tarif", "prix", "combien", "cout", "budget", "coute", "tarifs"],
    text: ["Voici les tarifs, toujours annoncés AVANT l'intervention :",
      "Écran : à partir de 49 € (Android) / 69 € (iPhone)",
      "Batterie : à partir de 29 € (Android) / 39 € (iPhone)",
      "Port de charge : à partir de 35 € (Android) / 45 € (iPhone)",
      "Caméra : à partir de 39 € (Android) / 49 € (iPhone)",
      "Diagnostic : gratuit",
      "Votre devis exact est gratuit et sans engagement."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["payer", "paiement", "carte", "cb", "espece", "facture", "tva", "cheque", "acompte", "paye"],
    text: ["Le prix est annoncé avant toute intervention, et une facture vous est remise avec chaque réparation (pièces + main d'œuvre).",
      "Paiement par carte ou espèces, au moment où vous récupérez l'appareil."] },
  { keys: ["ecran", "fissu", "vitre", "cassee", "fendu", "violet", "rayure"],
    text: ["Écran fissuré, cassé ou avec des lignes ? Le remplacement prend environ 30 minutes.",
      "Écran : à partir de 49 € (Android) / 69 € (iPhone). Prix exact annoncé avant de commencer."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["batterie", "autonomie", "decharge", "tient pas", "batteri", "se vide"],
    text: ["Batterie fatiguée, autonomie en chute ? Changement en 20 minutes environ.",
      "Batterie : à partir de 29 € (Android) / 39 € (iPhone)."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["port de charge", "ne charge", "charge plus", "connecteur", "ne recharge", "chargement"],
    text: ["Problème de charge ? Nettoyage ou remplacement du connecteur en 30 minutes environ.",
      "Port de charge : à partir de 35 € (Android) / 45 € (iPhone)."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["camera", "photo floue", "photo", "appareil photo"],
    text: ["Photo floue, caméra qui tremble ou endommagée ? Les modules avant et arrière se réparent.",
      "Caméra : à partir de 39 € (Android) / 49 € (iPhone)."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["eau", "liquide", "mouille", "trempe", "tombee dans", "pluie", "cuve", "eteint apres"],
    text: ["Important : si l'appareil a pris l'eau, éteignez-le, ne le rebranchez PAS, et agissez vite.",
      "Plus l'intervention est rapide, plus on sauve de données. Contactez-moi immédiatement."],
    acts: [{ t: "call", c: "act-call", l: "Je dois agir vite" }, { t: "wa", c: "act-wa", l: "WhatsApp" }] },
  { keys: ["noir", "s eteint", "ne s allume", "mort", "bloqu", "ne repond plus", "plante", "redemarre", "reset", "reboot", "gel", "freeze"],
    text: ["Écran noir, téléphone qui s'éteint seul ou se bloque ?",
      "Cela peut venir de la batterie, de l'écran ou d'une autre pièce : je diagnostique gratuitement et je vous dis exactement ce qu'il faut faire."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["bouton", "power", "volume", "marche plus", "home", "boutons"],
    text: ["Boutons power/volume ou mise en marche capricieux ? C'est souvent réparable rapidement, sans changer la carte mère.",
      "Décrivez la panne, je vous donne le tarif exact et le délai."],
    acts: [{ t: "devis", c: "act-devis", l: "Décrire ma panne" }] },
  { keys: ["son", "haut parleur", "micro", "n entend", "ecouteur", "vibreur", "appel ne marche"],
    text: ["Son, haut-parleur ou micro en panne ? Parfois un simple calibrage, parfois un composant à changer : diagnostic gratuit pour trancher.",
      "Décrivez le problème et je vous réponds le plus vite possible."],
    acts: [{ t: "devis", c: "act-devis", l: "Décrire mon problème" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["wifi", "bluetooth", "reseau", "ne capte", "antenne", "pas de wifi"],
    text: ["Wi-Fi, Bluetooth ou réseau capricieux ? Le connecteur ou l'antenne se répare souvent sans grosse dépense.",
      "Laissez-moi diagnostiquer : c'est gratuit, et le prix vous est annoncé avant."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["logiciel", "mise a jour", "lent", "virus", "applicati", "systeme", "bogue"],
    text: ["Téléphone lent, bloqué, virus ou mise à jour qui coince ?",
      "Un nettoyage ou une réinstallation du système peut le rendre comme neuf : diagnostic et conseil gratuits."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["donnees", "sauvegarde", "photo", "transfert", "recuperer", "compte", "icloud", "google", "perdu mes"],
    text: ["Vos photos et données sont précieuses : je peux les sauvegarder et les transférer avant ou après la réparation.",
      "Indiquez-le dans votre demande, je m'en occupe en même temps que la panne."],
    acts: [{ t: "devis", c: "act-devis", l: "Demander le transfert" }, { t: "wa", c: "act-wa", l: "WhatsApp" }] },
  { keys: ["ordinateur", " pc ", "portable", "mac", "clavier", "ecran pc"],
    text: ["Bien sûr, je répare aussi les ordinateurs : PC lent, écran ou clavier cassé, mise à niveau.",
      "Le tarif est personnalisé selon la panne, toujours annoncé avant de commencer."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis personnalisé" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["marque", "iphone", "samsung", "apple", "xiaomi", "huawei", "pixel", "oppo", "sony", "oneplus", "honor"],
    text: ["Je répare toutes les marques : Apple/iPhone, Samsung, Xiaomi, Huawei, Google Pixel, Oppo, Sony...",
      "Pièces d'origine ou compatibles selon votre budget, je vous conseille le meilleur rapport qualité/prix."],
    acts: [{ t: "call", c: "act-call", l: "Parler de mon modèle" }] },
  { keys: ["sim", "forfait", "carte sim", "operateur", "telephonie", "deblocage"],
    text: ["Pour une carte SIM ou un forfait, c'est votre opérateur qui s'en occupe.",
      "Mais si votre appareil ne reconnaît plus la SIM, c'est souvent le tiroir ou le connecteur : ça, je peux le réparer."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }] },
  { keys: ["reprise", "rachat", "vendre", "echange", "reprendre", "cote", "valeur"],
    text: ["Vous voulez revendre ou échanger un appareil ?",
      "Envoyez-moi le modèle et une photo sur WhatsApp : je vous dis honnêtement ce qu'il vaut."],
    acts: [{ t: "wa", c: "act-wa", l: "Photo sur WhatsApp" }] },
  { keys: ["devis", "estimation", "engagement", "depannage", "reparation comment", "comment ca marche", "reparer"],
    text: ["Le devis est gratuit, sans engagement, et vous l'avez en moins de 5 minutes.",
      "Deux options simples : remplissez le formulaire en ligne (2 minutes), ou envoyez directement une photo de la panne sur WhatsApp."],
    acts: [{ t: "devis", c: "act-devis", l: "Formulaire en ligne" }, { t: "wa", c: "act-wa", l: "WhatsApp" }] },
  { keys: ["horaire", "ouverture", "ouvert", "dimanche", "24h", "samedi", "ferme", "soir"],
    text: ["Je suis disponible 24h/24 et 7j/7, week-end et tard le soir compris.",
      "Si je ne peux pas répondre tout de suite, je rappelle dans la minute."],
    acts: [{ t: "call", c: "act-call", l: "Appeler maintenant" }] },
  { keys: ["ou etes", "localisation", "adresse", "pont eveque", "vienne", "deplacement", "chez moi", "domicile", "rayon", "ou vous", "secteur"],
    text: ["Je suis à Pont-Évêque (38780).",
      "Et je me déplace chez vous : Pont-Évêque, Vienne, Estrablin, Jardin, Saint-Romain-en-Gal, Chasse-sur-Rhône et les communes autour."],
    acts: [{ t: "maps", c: "act-devis", l: "Voir sur la carte" }, { t: "call", c: "act-call", l: "Appeler" }] },
  { keys: ["rendez vous", "rdv", "disponible quand", "quand etes", "reserver", "book", "créneau"],
    text: ["Pas besoin de compte ni de site compliqué : appelez ou envoyez un message, et on cale le rendez-vous en quelques minutes."],
    acts: [{ t: "call", c: "act-call", l: "Prendre rendez-vous" }, { t: "wa", c: "act-wa", l: "WhatsApp" }] },
  { keys: ["parking", "garer", "acces", "entrer", "porte", "venir"],
    text: ["Aucun souci de déplacement : je peux venir chez vous, ou on se retrouve où vous voulez sur le secteur."],
    acts: [{ t: "call", c: "act-call", l: "S'organiser" }] },
  { keys: ["urgence", "depeche", "tout de suite", "urgent", "immediat", "vite"],
    text: ["Pour une urgence, n'attendez pas : appelez-moi directement ou écrivez sur WhatsApp, on s'organise au plus vite."],
    acts: [{ t: "call", c: "act-call", l: "Appeler maintenant" }, { t: "wa", c: "act-wa", l: "WhatsApp" }] },
  { keys: ["telephone", "numero", "appeler", "contact", "email", "joindre", "appel", "message"],
    text: ["Par téléphone : 07 63 51 70 25 (réponse rapide, même tard).",
      "Par WhatsApp : message direct, idéal pour envoyer une photo de la panne.",
      "Par e-mail : lamphone38@gmail.com"],
    acts: [{ t: "call", c: "act-call", l: "Appeler" }, { t: "wa", c: "act-wa", l: "WhatsApp" }] },
  { keys: ["avis", "note", "reference", "conseille", "clients", "reputation"],
    text: ["Nos clients nous notent 4,9/5 : c'est notre meilleure carte de visite.",
      "Ils reviennent et nous recommandent à leurs proches."],
    acts: [{ t: "avis", c: "act-devis", l: "Voir les avis" }] },
  { keys: ["combien de temps", "dure", "duree", "rapide", "long", "delai", "express", "temps", "heures"],
    text: ["Comptez 30 minutes en moyenne pour un écran ou un port de charge, 20 minutes pour une batterie.",
      "Les urgences passent en priorité, et la plupart des appareils repartent le jour même."] },
  { keys: ["diagnostic", "diagnostiqu", "expertise"],
    text: ["Le diagnostic est gratuit et immédiat : je repère la panne et je vous annonce le prix exact avant tout travail."],
    acts: [{ t: "call", c: "act-call", l: "Prendre rendez-vous" }] },
  { keys: ["garantie", "garanti"],
    text: ["Les conditions exactes dépendent de la réparation réalisée : parle-en directement avec moi, je t'explique tout en transparence."],
    acts: [{ t: "call", c: "act-call", l: "Poser ma question" }, { t: "wa", c: "act-wa", l: "WhatsApp" }] },
  { keys: ["oui", "dsaccord"], priority: 1, flexible: true,
    text: ["Parfait ! Dites-moi simplement sur quoi je peux vous aider : un tarif, une panne, un rendez-vous..."],
    acts: [{ t: "devis", c: "act-devis", l: "Devis gratuit" }] },
  { keys: ["non", "pas vraiment", "autre chose"], priority: 1, flexible: true,
    text: ["Pas de souci ! Partagez-moi votre besoin avec vos mots, je m'adapte. Sinon, un humain vous répond en direct."],
    acts: [{ t: "call", c: "act-call", l: "Appeler" }, { t: "wa", c: "act-wa", l: "WhatsApp" }] },
  { keys: ["merci", "cool", "super", "genial", "parfait", "top", "nickel"],
    text: ["Avec plaisir ! Si vous avez d'autres questions, je suis là. Et pour un devis, c'est gratuit et sans engagement."],
    acts: [{ t: "devis", c: "act-devis", l: "Demander un devis" }] },
  { keys: ["a plus", "au revoir", "bye", "ciao", "bonne journee"],
    text: ["À bientôt ! Pensez à noter le 07 63 51 70 25 pour dépanner au plus vite.", "Bonne journée !"] }
];

var CHAT_FALLBACK = {
  text: ["Désolé, je n'ai pas encore la réponse exacte à cette question... mais je préfère vous répondre en direct que vous laisser sans solution.",
    THEME_TEXT],
  acts: [{ t: "call", c: "act-call", l: "Appeler le 07 63 51 70 25" }, { t: "wa", c: "act-wa", l: "WhatsApp" }]
};

var chatOpenedOnce = false;

function normalizeChat(s) {
  return s.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’`]/g, " ")
    .replace(/[?!;,.:()"]/g, " ")
    .toLowerCase();
}

function matchChat(q) {
  var s = normalizeChat(q);
  var toks = s.split(/\s+/).filter(function (t) { return t.length > 1; });
  var best = null, bestScore = 0;
  CHAT_INTENTS.forEach(function (it) {
    var n = 0, len = 0, exacts = 0;
    it.keys.forEach(function (k) {
      if (s.indexOf(k) !== -1) {
        n++;
        len += k.length;
        if (toks.indexOf(k) !== -1) exacts++;
      }
    });
    if (n) {
      var prio = it.priority || 0;
      var score = n * 4 + len + exacts * 5 + prio;
      if (score > bestScore) { bestScore = score; best = it; }
    }
  });
  return best;
}

function chatMsgsEl() {
  return document.getElementById("chatMsgs");
}

function replaceEl(old, now) {
  if (old.parentNode) old.parentNode.replaceChild(now, old);
}

function chatMsg(intent, userText) {
  var msgs = chatMsgsEl();
  if (!msgs) return;

  var userEl = document.createElement("div");
  userEl.className = "msg user";
  userEl.textContent = userText;
  msgs.appendChild(userEl);
  msgs.scrollTop = msgs.scrollHeight;

  var typing = document.createElement("div");
  typing.className = "msg bot typing";
  typing.textContent = "…";
  msgs.appendChild(typing);
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
    replaceEl(typing, botEl);
    msgs.scrollTop = msgs.scrollHeight;
  }, 140);
}

function chatOpen(el) {
  var panel = document.getElementById("chatPanel");
  if (!panel) return;
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  if (!chatOpenedOnce) {
    chatOpenedOnce = true;
    window.setTimeout(function () {
      var msgs = chatMsgsEl();
      if (!msgs) return;
      var botEl = document.createElement("div");
      botEl.className = "msg bot";
      botEl.innerHTML = "<p style='margin:0'>À votre service ! Posez-moi votre question ou choisissez un sujet ci-dessous : je réponds en quelques secondes.</p>";
      msgs.appendChild(botEl);
      msgs.scrollTop = msgs.scrollHeight;
    }, 200);
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

var CHIP_SUGGESTIONS = [
  "Mon écran est noir",
  "Le Wi-Fi ne marche plus",
  "Sans son / micro",
  "Sauver mes données",
  "Comment payer ?",
  "Vous reprenez les anciens ?",
  "C'est urgent"
];

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
      var intent = matchChat(q) || CHAT_FALLBACK;
      chatMsg(intent, q);
    });
  }

  if (quick) {
    CHIP_SUGGESTIONS.forEach(function (label) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      quick.appendChild(b);
    });
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

/* ====================== Google Analytics + bandeau RGPD ====================== */

(function gaInit() {
  var ID = "G-PYYDF2GKPQ";
  var c = "";
  try { c = localStorage.getItem("lamGA") || ""; } catch (e) {}
  if (c === "yes") { loadGA(); return; }
  if (c === "no") return;
  var b = document.createElement("div");
  b.className = "ga-banner";
  b.setAttribute("role", "dialog");
  b.setAttribute("aria-label", "Consentement aux cookies");
  b.innerHTML = '<p class="ga-text">Nous utilisons des cookies pour mesurer la fr\u00e9quentation du site.</p><div class="ga-btns"><button type="button" class="ga-ok">Accepter</button><button type="button" class="ga-no">Refuser</button></div>';
  document.body.appendChild(b);
  b.querySelector(".ga-ok").addEventListener("click", function () {
    try { localStorage.setItem("lamGA", "yes"); } catch (e) {}
    if (b.parentNode) b.parentNode.removeChild(b);
    loadGA();
  });
  b.querySelector(".ga-no").addEventListener("click", function () {
    try { localStorage.setItem("lamGA", "no"); } catch (e) {}
    if (b.parentNode) b.parentNode.removeChild(b);
  });
  function loadGA() {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.appendChild(s);
    gtag("config", ID, { send_page_view: true });
  }
})();

/* ====================== Intro illusion d'optique ====================== */

(function introInit() {
  var ov = document.getElementById("introOverlay");
  if (!ov) return;

  var already = false;
  try { already = sessionStorage.getItem("lamIntro") === "1"; } catch (e) {}
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (already || reduced) {
    if (ov.parentNode) ov.parentNode.removeChild(ov);
    return;
  }

  document.documentElement.classList.add("intro-lock");

  window.setTimeout(function () {
    ov.classList.add("go");
  }, 2750);

  window.setTimeout(function () {
    ov.classList.add("gone");
    document.documentElement.classList.remove("intro-lock");
  }, 3000);

  window.setTimeout(function () {
    if (ov.parentNode) ov.parentNode.removeChild(ov);
  }, 3650);

  try { sessionStorage.setItem("lamIntro", "1"); } catch (e) {}
})();