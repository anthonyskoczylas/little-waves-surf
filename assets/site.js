/* Little Waves Surf School */
(function(){
  var WA = "50671720672";
  var ES = document.documentElement.lang === "es";
  var T = ES ? {
    hi: "Hola María, ",
    private: "me gustaría reservar una clase privada de surf.",
    two: "me gustaría reservar una clase de surf para dos personas.",
    group: "me gustaría reservar una clase grupal de surf.",
    general: "me gustaría reservar una clase de surf con Little Waves.",
    review: "esta es mi reseña de la clase de surf:\n\n",
    privateNote: "Clase privada, 90 minutos",
    twoNote: "Dos personas, 90 minutos",
    groupNote: function(n){ return n + " personas × $65, 90 minutos"; },
    kidsPrice: "Consulta",
    kidsNote: "Campamento o clase para niños: María te confirma",
    who: {adults:"Adultos", mix:"Adultos y niños", kids:"Solo niños"},
    level: {first:"Primera vez", some:"Algunas veces", good:"Ya agarro olas"},
    msg: function(d){
      return "Hola María, me gustaría reservar una clase de surf con Little Waves.\n\n" +
        "Surfistas: " + d.n + " (" + d.who + ")\n" +
        "Día: " + (d.date || "por definir") + (d.flex ? " (fechas flexibles)" : "") + "\n" +
        "Nivel: " + d.level + "\n" +
        "Precio de la web: " + d.price + "\n" +
        (d.notes ? "Notas: " + d.notes + "\n" : "") +
        (d.name ? "\nSoy " + d.name + "." : "");
    },
    copied: "Mensaje copiado. Pégalo en WhatsApp al +506 7172-0672.",
    copyFail: "No se pudo copiar. Escríbele a María al +506 7172-0672."
  } : {
    hi: "Hi María, ",
    private: "I'd like to book a private surf lesson.",
    two: "I'd like to book a surf lesson for two people.",
    group: "I'd like to book a group surf lesson.",
    general: "I'd like to book a surf lesson with Little Waves.",
    review: "here's my review of the surf lesson:\n\n",
    privateNote: "Private lesson, 90 minutes",
    twoNote: "Two people, 90 minutes",
    groupNote: function(n){ return n + " people × $65, 90 minutes"; },
    kidsPrice: "Ask",
    kidsNote: "Kids camp or lesson: María will confirm",
    who: {adults:"Adults", mix:"Adults and kids", kids:"Kids only"},
    level: {first:"First time", some:"Surfed a few times", good:"Can catch waves"},
    msg: function(d){
      return "Hi María, I'd like to book a surf lesson with Little Waves.\n\n" +
        "Surfers: " + d.n + " (" + d.who + ")\n" +
        "Day: " + (d.date || "not sure yet") + (d.flex ? " (flexible dates)" : "") + "\n" +
        "Level: " + d.level + "\n" +
        "Website price: " + d.price + "\n" +
        (d.notes ? "Notes: " + d.notes + "\n" : "") +
        (d.name ? "\nI'm " + d.name + "." : "");
    },
    copied: "Message copied. Paste it into WhatsApp to +506 7172-0672.",
    copyFail: "Couldn't copy. Message María at +506 7172-0672."
  };

  // Laptops get WhatsApp Web, phones get the app. Do not simplify back to wa.me only.
  var isPhone = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  function waUrl(text){
    var q = text ? "&text=" + encodeURIComponent(text) : "";
    return isPhone ? "https://wa.me/" + WA + (text ? "?text=" + encodeURIComponent(text) : "")
                   : "https://web.whatsapp.com/send?phone=" + WA + q;
  }
  document.querySelectorAll("a[data-wa]").forEach(function(a){
    var k = a.getAttribute("data-wa-msg") || "general";
    a.href = waUrl(T.hi + (T[k] || T.general));
    a.target = "_blank"; a.rel = "noopener";
  });

  // year
  document.querySelectorAll("[data-year]").forEach(function(el){ el.textContent = new Date().getFullYear(); });

  // remember language choice
  document.querySelectorAll("[data-lang-switch]").forEach(function(a){
    a.addEventListener("click", function(){ try{ localStorage.setItem("lw_lang", a.getAttribute("data-lang-switch")); }catch(e){} });
  });

  // header state
  var top = document.getElementById("top");
  function onScrollHeader(){ if(top) top.classList.toggle("scrolled", window.scrollY > 24); }

  // mobile menu
  var sheet = document.getElementById("sheet");
  var opener = document.querySelector("[data-menu-open]");
  function setMenu(open){
    if(!sheet) return;
    sheet.classList.toggle("open", open);
    if(opener) opener.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    if(open){ var f = sheet.querySelector("a"); if(f) f.focus(); } else if(opener) opener.focus({preventScroll:true});
  }
  if(opener) opener.addEventListener("click", function(){ setMenu(true); });
  document.querySelectorAll("[data-menu-close]").forEach(function(b){ b.addEventListener("click", function(){ setMenu(false); }); });
  if(sheet) sheet.querySelectorAll("nav a").forEach(function(a){ a.addEventListener("click", function(){ setMenu(false); }); });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape" && sheet && sheet.classList.contains("open")) setMenu(false); });

  // signature: the sun sets behind the sea as you scroll past the poster
  var sun = document.querySelector("[data-sun]");
  var poster = sun && sun.closest(".poster");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function onScrollSun(){
    if(!sun || still) return;
    var h = poster.offsetHeight || 1;
    var p = Math.min(1, Math.max(0, window.scrollY / (h * .7)));
    sun.style.setProperty("--set", (p * p * (3 - 2 * p)).toFixed(4));
  }

  // mobile book bar: after the poster, hidden while the booking section is on screen
  var bar = document.getElementById("bookbar");
  var book = document.getElementById("book");
  function onScrollBar(){
    if(!bar) return;
    var past = window.scrollY > (poster ? poster.offsetHeight * .8 : 600);
    var inBook = false;
    if(book){ var r = book.getBoundingClientRect(); inBook = r.top < window.innerHeight * .85 && r.bottom > 0; }
    var show = past && !inBook;
    bar.classList.toggle("show", show);
    bar.setAttribute("aria-hidden", show ? "false" : "true");
    var l = bar.querySelector("a"); if(l) l.tabIndex = show ? 0 : -1;
  }

  var ticking = false;
  function onScroll(){
    if(ticking) return; ticking = true;
    requestAnimationFrame(function(){ onScrollHeader(); onScrollSun(); onScrollBar(); ticking = false; });
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  window.addEventListener("resize", onScroll);
  onScrollHeader(); onScrollSun(); onScrollBar();

  // photo reel arrows
  var reel = document.getElementById("reel");
  document.querySelectorAll("[data-reel]").forEach(function(b){
    b.addEventListener("click", function(){
      if(!reel) return;
      reel.scrollBy({left: parseInt(b.getAttribute("data-reel"), 10) * reel.clientWidth * .8, behavior: still ? "auto" : "smooth"});
    });
  });

  // toast
  var toast = document.getElementById("toast"), tt;
  function say(t){ if(!toast) return; toast.textContent = t; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(function(){ toast.classList.remove("show"); }, 3200); }

  // booking planner
  var form = document.getElementById("planner");
  if(form){
    var n = 1, out = document.getElementById("ppl");
    var priceEl = document.getElementById("est-price"), noteEl = document.getElementById("est-note");
    var minus = form.querySelector('[data-step="-1"]'), plus = form.querySelector('[data-step="1"]');
    var date = document.getElementById("date");
    try{ date.min = new Date(Date.now() - new Date().getTimezoneOffset()*60000).toISOString().slice(0,10); }catch(e){}
    var preset = document.body.getAttribute("data-who");
    if(preset){ var pr = form.querySelector('input[name="who"][value="' + preset + '"]'); if(pr) pr.checked = true; }

    function who(){ return (form.querySelector('input[name="who"]:checked') || {}).value || "adults"; }
    function level(){ return (form.querySelector('input[name="level"]:checked') || {}).value || "first"; }
    function price(){
      if(who() === "kids" && n > 1) return {p: T.kidsPrice, note: T.kidsNote};
      if(n === 1) return {p: "$80", note: T.privateNote};
      if(n === 2) return {p: "$140", note: T.twoNote};
      return {p: "$" + (65 * n), note: T.groupNote(n)};
    }
    function render(){
      out.textContent = n;
      minus.disabled = n <= 1; plus.disabled = n >= 12;
      var e = price(); priceEl.textContent = e.p; noteEl.textContent = e.note;
    }
    form.querySelectorAll("[data-step]").forEach(function(b){
      b.addEventListener("click", function(){ n = Math.min(12, Math.max(1, n + parseInt(b.getAttribute("data-step"), 10))); render(); });
    });
    form.addEventListener("change", render);
    render();

    function fmtDate(v){
      if(!v) return "";
      try{ var d = new Date(v + "T12:00:00"); return d.toLocaleDateString(ES ? "es-CR" : "en-US", {weekday:"long", month:"long", day:"numeric"}); }catch(e){ return v; }
    }
    function message(){
      var e = price();
      return T.msg({
        n: n, who: T.who[who()], date: fmtDate(date.value), flex: document.getElementById("flex").checked,
        level: T.level[level()], price: e.p + (e.p.charAt(0) === "$" ? " (" + e.note + ")" : ""),
        notes: document.getElementById("notes").value.trim(), name: document.getElementById("name").value.trim()
      });
    }
    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      window.open(waUrl(message()), "_blank", "noopener");
    });
    var copy = form.querySelector("[data-copy]");
    if(copy) copy.addEventListener("click", function(){
      var m = message();
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(m).then(function(){ say(T.copied); }, function(){ say(T.copyFail); });
      } else { say(T.copyFail); }
    });
  }

  // review page: platform buttons appear once their links exist
  var g = document.getElementById("googleOpt"), ta = document.getElementById("taOpt");
  var links = window.LW_REVIEW_LINKS || {};
  if(g && links.google){ g.href = links.google; g.hidden = false; }
  if(ta && links.tripadvisor){ ta.href = links.tripadvisor; ta.hidden = false; }
  var wo = document.getElementById("waOpt");
  if(wo && g && g.hidden) wo.classList.add("primary");
})();
