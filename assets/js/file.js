(function () {
  const n = document.createElement("link").relList;
  if (n && n.supports && n.supports("modulepreload")) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) s(o);
  new MutationObserver((o) => {
    for (const t of o)
      if (t.type === "childList")
        for (const i of t.addedNodes)
          i.tagName === "LINK" && i.rel === "modulepreload" && s(i);
  }).observe(document, { childList: !0, subtree: !0 });
  function a(o) {
    const t = {};
    return (
      o.integrity && (t.integrity = o.integrity),
      o.referrerPolicy && (t.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === "use-credentials"
        ? (t.credentials = "include")
        : o.crossOrigin === "anonymous"
          ? (t.credentials = "omit")
          : (t.credentials = "same-origin"),
      t
    );
  }
  function s(o) {
    if (o.ep) return;
    o.ep = !0;
    const t = a(o);
    fetch(o.href, t);
  }
})();
const _ = "bU7WaOFtMVnWeJGvbySkFHQt5WestD49c69xOgQa",
  R = "https://api.nasa.gov/planetary/apod",
  V = "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/";
let w = [],
  v = [];
async function B(e = null) {
  try {
    let n = `${R}?api_key=${_}`;
    e && (n += `&date=${e}`);
    const s = await (await fetch(n)).json(),
      o = document.getElementById("apod-image-container"),
      t = document.getElementById("apod-loading"),
      i = document.getElementById("apod-image");
    (t.classList.remove("hidden"), i.classList.add("hidden"), (i.src = ""));
    const c = o.querySelector(".absolute.inset-0");
    c && c !== t && c.remove();
    const r = new Date(s.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    ((document.getElementById("apod-date").textContent =
      `Astronomy Picture of the Day - ${r}`),
      (document.getElementById("apod-date-detail").innerHTML =
        `<i class="far fa-calendar mr-2"></i>${r}`),
      (document.getElementById("apod-date-info").textContent = r),
      (document.getElementById("apod-title").textContent = s.title),
      (document.getElementById("apod-explanation").textContent =
        s.explanation));
    const d = document.getElementById("apod-copyright");
    if (
      (s.copyright
        ? ((d.innerHTML = `<i class="fas fa-copyright mr-1"></i>Copyright: ${s.copyright.trim()}`),
          d.classList.remove("hidden"))
        : d.classList.add("hidden"),
      (document.getElementById("apod-media-type").textContent =
        s.media_type === "image" ? "Image" : "Video"),
      s.media_type === "image")
    ) {
      ((i.src = s.url),
        (i.alt = s.title),
        (i.onload = () => {
          (t.classList.add("hidden"), i.classList.remove("hidden"));
        }),
        (i.onerror = () => {
          t.innerHTML = `
                    <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                    <p class="text-slate-400">Failed to load image</p>
                `;
        }));
      const u = document.createElement("div");
      ((u.className =
        "absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"),
        (u.innerHTML = `
                <div class="absolute bottom-6 left-6 right-6">
                    <a href="${s.hdurl || s.url}" target="_blank" class="block w-full py-3 bg-white/10 backdrop-blur-md rounded-lg font-semibold hover:bg-white/20 transition-colors text-center">
                        <i class="fas fa-expand mr-2"></i>View Full Resolution
                    </a>
                </div>
            `),
        o.appendChild(u));
    } else
      s.media_type === "video" &&
        (t.classList.add("hidden"),
        (o.innerHTML = `
                <iframe 
                    src="${s.url}" 
                    class="w-full h-full" 
                    frameborder="0" 
                    allowfullscreen
                ></iframe>
            `));
  } catch (n) {
    (console.error("Error fetching APOD:", n),
      (document.getElementById("apod-loading").innerHTML = `
            <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
            <p class="text-slate-400">Failed to load today's image</p>
            <p class="text-slate-500 text-sm mt-2">Please try again later</p>
        `));
  }
}
async function q() {
  try {
    ((w = (
      await (
        await fetch(
          "https://solar-system-opendata-proxy.vercel.app/api/planets",
        )
      ).json()
    ).bodies.filter((s) => s.isPlanet === !0)),
      J(),
      Q());
    const a = w.find((s) => s.englishName.toLowerCase() === "earth");
    a && H(a);
  } catch (e) {
    console.error("Error fetching planets data:", e);
    const n = document.getElementById("planets-grid");
    n &&
      (n.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <i class="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
                    <p class="text-slate-400">Failed to load planets data. Please try again later.</p>
                </div>
            `);
  }
}
async function G() {
  try {
    v = (await (await fetch(`${V}?limit=10`)).json()).results;
    const a = document.getElementById("launches-count"),
      s = document.getElementById("launches-count-mobile");
    (a && (a.textContent = `${v.length} Launches`),
      s && (s.textContent = `${v.length}`),
      W(),
      K());
  } catch (e) {
    console.error("Error fetching launches data:", e);
    const n = document.getElementById("featured-launch"),
      a = document.getElementById("launches-grid"),
      s = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-red-400 text-5xl mb-4"></i>
                <p class="text-slate-400 text-lg">Failed to load launches data</p>
                <p class="text-slate-500 text-sm mt-2">Please try again later</p>
            </div>
        `;
    (n && (n.innerHTML = s), a && (a.innerHTML = s));
  }
}
function W() {
  var u, x, p, y, f, g, h, b, E, $, L, C, I, S;
  const e = document.getElementById("featured-launch");
  if (!e || v.length === 0) return;
  const n = v[0],
    a = new Date(n.net),
    o = a - new Date(),
    t = Math.ceil(o / (1e3 * 60 * 60 * 24)),
    i = a.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    c =
      a.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }) + " UTC",
    r =
      {
        Go: "green",
        Success: "green",
        TBD: "yellow",
        Hold: "red",
        TBC: "yellow",
      }[(u = n.status) == null ? void 0 : u.abbrev] || "blue",
    d =
      ((x = n.image) == null ? void 0 : x.image_url) ||
      ((y = (p = n.rocket) == null ? void 0 : p.configuration) == null
        ? void 0
        : y.image_url) ||
      "";
  e.innerHTML = `
        <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
            <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-3 mb-4">
                            <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                                <i class="fas fa-star"></i>
                                Featured Launch
                            </span>
                            <span class="px-4 py-1.5 bg-${r}-500/20 text-${r}-400 rounded-full text-sm font-semibold">
                                ${((f = n.status) == null ? void 0 : f.abbrev) || "TBD"}
                            </span>
                        </div>
                        
                        <h3 class="text-3xl font-bold mb-3 leading-tight">${n.name}</h3>
                        
                        <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-building"></i>
                                <span>${((g = n.launch_service_provider) == null ? void 0 : g.name) || "Unknown"}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-rocket"></i>
                                <span>${((b = (h = n.rocket) == null ? void 0 : h.configuration) == null ? void 0 : b.name) || "N/A"}</span>
                            </div>
                        </div>
                        
                        ${
                          t > 0
                            ? `
                        <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
                            <i class="fas fa-clock text-2xl text-blue-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-blue-400">${t}</p>
                                <p class="text-xs text-slate-400">Days Until Launch</p>
                            </div>
                        </div>
                        `
                            : ""
                        }
                        
                        <div class="grid xl:grid-cols-2 gap-4 mb-6">
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-calendar"></i>
                                    Launch Date
                                </p>
                                <p class="font-semibold">${i}</p>
                            </div>
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-clock"></i>
                                    Launch Time
                                </p>
                                <p class="font-semibold">${c}</p>
                            </div>
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Location
                                </p>
                                <p class="font-semibold text-sm">${(($ = (E = n.pad) == null ? void 0 : E.location) == null ? void 0 : $.name) || "Unknown"}</p>
                            </div>
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-globe"></i>
                                    Country
                                </p>
                                <p class="font-semibold">${((I = (C = (L = n.pad) == null ? void 0 : L.location) == null ? void 0 : C.country) == null ? void 0 : I.name) || "Unknown"}</p>
                            </div>
                        </div>
                        
                        <p class="text-slate-300 leading-relaxed mb-6">
                            ${((S = n.mission) == null ? void 0 : S.description) || "Mission details will be available closer to launch date."}
                        </p>
                    </div>
                    
                    <div class="flex flex-col md:flex-row gap-3">
                        <button class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
                            <i class="fas fa-info-circle"></i>
                            View Full Details
                        </button>
                       <div class="icons self-end md:self-center">
                            <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                                <i class="fas fa-bell"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="relative">
                    ${
                      d
                        ? `
                    <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
                        <img src="${d}" alt="${n.name}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='/images/launch-placeholder.png';" />
                        <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
                    </div>
                    `
                        : `
                    <div class="flex items-center justify-center h-full min-h-[400px] bg-slate-900/50 rounded-2xl">
                        <div class="text-center">
                            <i class="fas fa-rocket text-6xl text-slate-700 mb-4"></i>
                            <p class="text-slate-500">No image available</p>
                        </div>
                    </div>
                    `
                    }
                </div>
            </div>
        </div>
    `;
}
function K() {
  const e = document.getElementById("launches-grid");
  if (!e || v.length === 0) return;
  const n = v.slice(1, 10);
  e.innerHTML = n
    .map((a, s) => {
      var d, u, x, p, y, f, g, h, b;
      const o = new Date(a.net),
        t = o.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        i =
          o.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          }) + " UTC",
        l =
          {
            Go: "green",
            Success: "green",
            TBD: "yellow",
            Hold: "red",
            TBC: "yellow",
          }[(d = a.status) == null ? void 0 : d.abbrev] || "blue",
        r = ((u = a.image) == null ? void 0 : u.thumbnail_url) || "";
      return `
            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
                ${
                  r
                    ? `
                <div class="relative h-48 overflow-hidden bg-slate-900/50">
                    <img src="${r}" alt="${a.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null; this.src='/images/launch-placeholder.png';" />
                    <div class="absolute top-3 right-3">
                        <span class="px-3 py-1 bg-${l}-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                            ${((x = a.status) == null ? void 0 : x.abbrev) || "TBD"}
                        </span>
                    </div>
                </div>
                `
                    : `
                <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
                    <i class="fas fa-rocket text-5xl text-slate-700"></i>
                    <div class="absolute top-3 right-3">
                        <span class="px-3 py-1 bg-${l}-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                            ${((p = a.status) == null ? void 0 : p.abbrev) || "TBD"}
                        </span>
                    </div>
                </div>
                `
                }
                
                <div class="p-5">
                    <div class="mb-3">
                        <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                            ${a.name}
                        </h4>
                        <p class="text-sm text-slate-400 flex items-center gap-2">
                            <i class="fas fa-building text-xs"></i>
                            ${((y = a.launch_service_provider) == null ? void 0 : y.name) || "Unknown"}
                        </p>
                    </div>
                    
                    <div class="space-y-2 mb-4">
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-calendar text-slate-500 w-4"></i>
                            <span class="text-slate-300">${t}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-clock text-slate-500 w-4"></i>
                            <span class="text-slate-300">${i}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-rocket text-slate-500 w-4"></i>
                            <span class="text-slate-300">${((g = (f = a.rocket) == null ? void 0 : f.configuration) == null ? void 0 : g.name) || "N/A"}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                            <span class="text-slate-300 line-clamp-1">${((b = (h = a.pad) == null ? void 0 : h.location) == null ? void 0 : b.name) || "Unknown"}</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
                        <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
                            Details
                        </button>
                        <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");
}
function J() {
  const e = document.getElementById("planets-grid");
  if (!e) return;
  const n = {
      mercury: "#eab308",
      venus: "#f97316",
      earth: "#3b82f6",
      mars: "#ef4444",
      jupiter: "#fb923c",
      saturn: "#facc15",
      uranus: "#06b6d4",
      neptune: "#2563eb",
    },
    a = {
      mercury: "/images/mercury.png",
      venus: "/images/venus.png",
      earth: "/images/earth.png",
      mars: "/images/mars.png",
      jupiter: "/images/jupiter.png",
      saturn: "/images/saturn.png",
      uranus: "/images/uranus.png",
      neptune: "/images/neptune.png",
    };
  ((e.innerHTML = w
    .map((s) => {
      const o = s.englishName.toLowerCase(),
        t = n[o] || "#64748b",
        i = a[o] || "",
        c = (s.semimajorAxis / 1495978707e-1).toFixed(2);
      return `
            <div class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group" data-planet-id="${s.id}" style="--planet-color: ${t}" onmouseover="this.style.borderColor='${t}80'" onmouseout="this.style.borderColor='#334155'">
                <div class="relative mb-3 h-24 flex items-center justify-center">
                    <img class="w-20 h-20 object-contain group-hover:scale-110 transition-transform" 
                         src="${i}" 
                         alt="${s.englishName}" />
                </div>
                <h4 class="font-semibold text-center text-sm">${s.englishName}</h4>
                <p class="text-xs text-slate-400 text-center">${c} AU</p>
            </div>
        `;
    })
    .join("")),
    document.querySelectorAll(".planet-card").forEach((s) => {
      s.addEventListener("click", function () {
        const o = this.dataset.planetId,
          t = w.find((i) => i.id === o);
        t && H(t);
      });
    }));
}
function Q() {
  var o;
  const e = document.getElementById("planet-comparison-tbody");
  if (!e) return;
  const n = {
      mercury: "#6b7280",
      venus: "#fb923c",
      earth: "#3b82f6",
      mars: "#ef4444",
      jupiter: "#fdba74",
      saturn: "#fde047",
      uranus: "#22d3ee",
      neptune: "#2563eb",
    },
    a =
      (o = w.find((t) => t.englishName.toLowerCase() === "earth")) == null
        ? void 0
        : o.mass,
    s = a ? a.massValue * Math.pow(10, a.massExponent) : 1;
  e.innerHTML = w
    .map((t, i) => {
      const c = t.englishName.toLowerCase(),
        l = n[c] || "slate-500",
        r = (t.semimajorAxis / 1495978707e-1).toFixed(2),
        d = (t.meanRadius * 2).toFixed(0),
        x = (
          (t.mass ? t.mass.massValue * Math.pow(10, t.mass.massExponent) : 0) /
          s
        ).toFixed(3);
      let p = t.sideralOrbit.toFixed(0);
      t.sideralOrbit > 365
        ? (p = `${(t.sideralOrbit / 365.25).toFixed(1)} years`)
        : (p = `${p} days`);
      const y = t.moons ? t.moons.length : 0;
      let f = "Terrestrial",
        g = "#f9731680",
        h = "#fb923c";
      return (
        ["jupiter", "saturn"].includes(c)
          ? ((f = "Gas Giant"), (g = "#a855f780"), (h = "#c084fc"))
          : ["uranus", "neptune"].includes(c) &&
            ((f = "Ice Giant"), (g = "#3b82f680"), (h = "#60a5fa")),
        `
            <tr class="${c === "earth" ? "hover:bg-slate-800/30 transition-colors bg-blue-500/5" : "hover:bg-slate-800/30 transition-colors"}">
                <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
                    <div class="flex items-center space-x-2 md:space-x-3">
                        <div class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0" style="background-color: ${l}"></div>
                        <span class="font-semibold text-sm md:text-base whitespace-nowrap">${t.englishName}</span>
                    </div>
                </td>
                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${r}</td>
                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${parseInt(d).toLocaleString()}</td>
                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${x}</td>
                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${p}</td>
                <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${y}</td>
                <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    <span class="px-2 py-1 rounded text-xs" style="background-color: ${g}; color: ${h}">
                        ${f}
                    </span>
                </td>
            </tr>
        `
      );
    })
    .join("");
}
function H(e) {
  const n = e.englishName.toLowerCase(),
    a = {
      mercury: "/images/mercury.png",
      venus: "/images/venus.png",
      earth: "/images/earth.png",
      mars: "/images/mars.png",
      jupiter: "/images/jupiter.png",
      saturn: "/images/saturn.png",
      uranus: "/images/uranus.png",
      neptune: "/images/neptune.png",
    },
    s = document.getElementById("planet-detail-image");
  s && ((s.src = a[n] || ""), (s.alt = e.englishName));
  const o = document.getElementById("planet-detail-name");
  o && (o.textContent = e.englishName);
  const t = Y(e),
    i = document.getElementById("planet-detail-description");
  i && (i.textContent = t);
  const c = (e.semimajorAxis / 1e6).toFixed(1),
    l = e.meanRadius ? e.meanRadius.toFixed(0) : "N/A",
    r = e.mass ? `${e.mass.massValue} × 10^${e.mass.massExponent}` : "N/A",
    d = e.density ? e.density.toFixed(2) : "N/A",
    u = e.sideralOrbit ? e.sideralOrbit.toFixed(2) : "N/A",
    x = e.sideralRotation ? e.sideralRotation.toFixed(2) : "N/A",
    p = e.moons ? e.moons.length : 0,
    y = e.gravity ? e.gravity.toFixed(2) : "N/A",
    f = document.getElementById("planet-distance"),
    g = document.getElementById("planet-radius"),
    h = document.getElementById("planet-mass"),
    b = document.getElementById("planet-density"),
    E = document.getElementById("planet-orbital-period"),
    $ = document.getElementById("planet-rotation"),
    L = document.getElementById("planet-moons"),
    C = document.getElementById("planet-gravity");
  (f && (f.textContent = `${c}M km`),
    g && (g.textContent = `${l} km`),
    h && (h.textContent = `${r} kg`),
    b && (b.textContent = `${d} g/cm³`),
    E && (E.textContent = u === "N/A" ? "N/A" : `${u} days`),
    $ && ($.textContent = x === "N/A" ? "N/A" : `${x} hours`),
    L && (L.textContent = p),
    C && (C.textContent = y === "N/A" ? "N/A" : `${y} m/s²`));
  const I = document.getElementById("planet-discoverer"),
    S = document.getElementById("planet-discovery-date"),
    T = document.getElementById("planet-body-type"),
    A = document.getElementById("planet-volume");
  if (
    (I && (I.textContent = e.discoveredBy || "Known since antiquity"),
    S && (S.textContent = e.discoveryDate || "Ancient times"),
    T && (T.textContent = e.bodyType || "Planet"),
    A)
  ) {
    const m = e.vol ? `${e.vol.volValue} × 10^${e.vol.volExponent} km³` : "N/A";
    A.textContent = m;
  }
  const D = document.getElementById("planet-perihelion"),
    N = document.getElementById("planet-aphelion"),
    k = document.getElementById("planet-eccentricity"),
    M = document.getElementById("planet-inclination"),
    F = document.getElementById("planet-axial-tilt"),
    j = document.getElementById("planet-temp"),
    U = document.getElementById("planet-escape");
  if (D) {
    const m = e.perihelion ? `${(e.perihelion / 1e6).toFixed(1)}M km` : "N/A";
    D.textContent = m;
  }
  if (N) {
    const m = e.aphelion ? `${(e.aphelion / 1e6).toFixed(1)}M km` : "N/A";
    N.textContent = m;
  }
  if (k) {
    const m = e.eccentricity ? e.eccentricity.toFixed(5) : "N/A";
    k.textContent = m;
  }
  if (M) {
    const m = e.inclination ? `${e.inclination.toFixed(2)}°` : "N/A";
    M.textContent = m;
  }
  if (F) {
    const m = e.axialTilt ? `${e.axialTilt.toFixed(2)}°` : "N/A";
    F.textContent = m;
  }
  if (j) {
    const m = e.avgTemp ? `${e.avgTemp}°C` : "N/A";
    j.textContent = m;
  }
  if (U) {
    const m = e.escape ? `${(e.escape / 1e3).toFixed(2)} km/s` : "N/A";
    U.textContent = m;
  }
  const O = Z(e),
    P = document.getElementById("planet-facts");
  P &&
    (P.innerHTML = O.map(
      (m) => `
            <li class="flex items-start">
                <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                <span class="text-slate-300">${m}</span>
            </li>
        `,
    ).join(""));
}
function Y(e) {
  return (
    {
      earth:
        "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 29% of Earth's surface is land consisting of continents and islands. The remaining 71% is covered with water.",
      mars: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Named after the Roman god of war, it is often referred to as the "Red Planet" due to its reddish appearance.',
      jupiter:
        "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets combined.",
      saturn:
        "Saturn is the sixth planet from the Sun and the second-largest in the Solar System. It is a gas giant with an average radius about nine times that of Earth, and is best known for its extensive ring system.",
      venus:
        "Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. As the second-brightest natural object in the night sky after the Moon, Venus can cast shadows.",
      mercury:
        "Mercury is the smallest planet in the Solar System and the closest to the Sun. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the planets in the Solar System.",
      uranus:
        "Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. Uranus is unique in that it rotates on its side.",
      neptune:
        "Neptune is the eighth and farthest known planet from the Sun in the Solar System. It is the fourth-largest planet by diameter and the third-most-massive planet.",
    }[e.englishName.toLowerCase()] ||
    `${e.englishName} is a fascinating celestial body in our Solar System with unique characteristics.`
  );
}
function Z(e) {
  const n = e.mass
      ? `Mass: ${e.mass.massValue} × 10^${e.mass.massExponent} kg`
      : "",
    a = e.gravity ? `Surface gravity: ${e.gravity} m/s²` : "",
    s = e.density ? `Density: ${e.density} g/cm³` : "",
    o = e.discoveredBy ? `Discovered by: ${e.discoveredBy}` : "",
    t = [];
  return (
    n && t.push(n),
    a && t.push(a),
    s && t.push(s),
    e.axialTilt && t.push(`Axial tilt: ${e.axialTilt}°`),
    o && t.push(o),
    t.length < 3 &&
      (t.push(`Mean radius: ${e.meanRadius.toFixed(0)} km`),
      e.moons && t.push(`Has ${e.moons.length} moon(s)`)),
    t.slice(0, 4)
  );
}
function z() {
  const e = document.getElementById("apod-date-input");
  if (!e) {
    console.error("Date input not found");
    return;
  }
  const n = e.closest(".date-input-wrapper"),
    a = document.getElementById("load-date-btn"),
    s = document.getElementById("today-apod-btn");
  if (!n || !a || !s) {
    console.error("Date input elements not found", {
      dateWrapper: n,
      loadBtn: a,
      todayBtn: s,
    });
    return;
  }
  const t = c(new Date());
  ((e.max = t), (e.value = t));
  function i(l) {
    if (l) {
      const d = new Date(l + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      n.setAttribute("data-date", d);
    } else n.setAttribute("data-date", "Select a date");
  }
  (i(t),
    e.addEventListener("change", () => {
      i(e.value);
    }),
    a.addEventListener("click", () => {
      const l = e.value;
      l && B(l);
    }),
    s.addEventListener("click", () => {
      ((e.value = t), i(t), B(null));
    }),
    e.addEventListener("keypress", (l) => {
      if (l.key === "Enter") {
        const r = e.value;
        r && B(r);
      }
    }));
  function c(l) {
    const r = l.getFullYear(),
      d = String(l.getMonth() + 1).padStart(2, "0"),
      u = String(l.getDate()).padStart(2, "0");
    return `${r}-${d}-${u}`;
  }
}
function X() {
  const e = document.querySelectorAll(".nav-link"),
    n = document.querySelectorAll(".app-section");
  function a(s) {
    (n.forEach((t) => {
      t.classList.add("hidden");
    }),
      document.querySelectorAll(`[data-section="${s}"]`).forEach((t) => {
        t.classList.remove("hidden");
      }),
      e.forEach((t) => {
        t.dataset.section === s
          ? (t.classList.remove("text-slate-300", "hover:bg-slate-800"),
            t.classList.add("bg-blue-500/10", "text-blue-400"))
          : (t.classList.remove("bg-blue-500/10", "text-blue-400"),
            t.classList.add("text-slate-300", "hover:bg-slate-800"));
      }),
      window.scrollTo(0, 0));
  }
  (e.forEach((s) => {
    s.addEventListener("click", function (o) {
      o.preventDefault();
      const t = this.dataset.section;
      (a(t), closeSidebar());
    });
  }),
    a("today-in-space"));
}
function ee() {
  const e = document.getElementById("sidebar"),
    n = document.getElementById("sidebar-toggle");
  let a = null;
  if (!e || !n) return;
  function s() {
    (e.classList.add("sidebar-open"),
      a ||
        ((a = document.createElement("div")),
        (a.className = "sidebar-overlay"),
        a.addEventListener("click", o),
        document.body.appendChild(a)));
  }
  function o() {
    (e.classList.remove("sidebar-open"), a && (a.remove(), (a = null)));
  }
  (n.addEventListener("click", (t) => {
    (t.preventDefault(),
      t.stopPropagation(),
      e.classList.contains("sidebar-open") ? o() : s());
  }),
    (window.closeSidebar = o));
}
window.addEventListener("load", function () {
  (X(), ee(), z(), B(), q(), G());
});
