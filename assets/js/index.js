// Switch Tabs
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".app-section");

for (let i = 0; i < navLinks.length; i++) {
  const link = navLinks[i];

  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("data-section");

    // 1. Loop through all links again to reset their colors
    for (let j = 0; j < navLinks.length; j++) {
      const item = navLinks[j];
      item.classList.remove("bg-blue-500/10", "text-blue-400");
      item.classList.add("text-slate-300");
    }

    // Highlight the specific link that was just clicked
    link.classList.remove("text-slate-300");
    link.classList.add("bg-blue-500/10", "text-blue-400");

    // 2. Loop through all sections to show the right one and hide the rest
    for (let k = 0; k < sections.length; k++) {
      const section = sections[k];
      if (section.id === targetId) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    }
  });
}

// Today in space (APOD)
// HTML Elements
const apodImage = document.getElementById("apod-image");
const apodDate = document.getElementById("apod-date");

const apodDateInput = document.getElementById("apod-date-input");

const apodTitle = document.getElementById("apod-title");
const apodDateDetail = document.getElementById("apod-date-detail");
const apodExplanation = document.getElementById("apod-explanation");
const apodCopyright = document.getElementById("apod-copyright");

const apodDateInfo = document.getElementById("apod-date-info");
const apodMediaType = document.getElementById("apod-media-type");

const dateShowSpan = document.querySelector(".date-input-wrapper span");

// Buttons
const loadDateBtn = document.getElementById("load-date-btn");
const todayApodBtn = document.getElementById("today-apod-btn");

// const imageContainer = document.getElementById("apod-image-container");
const loading = document.getElementById("apod-loading");

// "View Full Resolution" button
const viewImgBtn = document.querySelector("#apod-image-container button");

let currentUrl = "";

// Variables
const API_KEY = "iCW3D83pvDWKe9ybL0HvGjRVupRl9IbDTaPWO6mx";
const BASE_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

// Set the maximum allowed date in the calendar to today (using local time)
apodDateInput.max = new Date().toLocaleDateString("en-CA");

async function getSpaceData(selectedDate) {
  // If a date is selected, use it. If not, show today's default
  const finalUrl = selectedDate ? `${BASE_URL}&date=${selectedDate}` : BASE_URL;

  const res = await fetch(finalUrl);
  const spaceData = await res.json();

  return spaceData;
}

async function updateUI(selectedDate) {
  loading.innerHTML = `
    <i class="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"></i>
    <p class="text-slate-400">Loading today's image...</p>
  `;

  loading.classList.remove("hidden");
  apodImage.classList.add("hidden");

  const spaceData = await getSpaceData(selectedDate);

  if (spaceData.code && spaceData.code !== 200) {
    loading.innerHTML = `                    
        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
        <p class="text-slate-400">Failed to load image</p>
        `;
    return;
  }

  // check if there is image or video
  if (spaceData.media_type === "image") {
    apodImage.setAttribute("src", spaceData.url);

    currentUrl = spaceData.hdurl || spaceData.url;
    viewImgBtn.classList.remove("hidden");
  } else {
    apodImage.setAttribute("src", "./assets/images/placeholder.webp");
    viewImgBtn.classList.add("hidden");
  }

  const displayDate = new Date(spaceData.date);
  const formattedDate = displayDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  apodDate.textContent = `Astronomy Picture of the Day - ${formattedDate}`;
  apodDateInput.value = spaceData.date;

  apodDateInfo.textContent = formattedDate;

  apodTitle.textContent = spaceData.title;
  apodExplanation.textContent = spaceData.explanation;
  apodMediaType.textContent = spaceData.media_type;

  apodDateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i> ${formattedDate}`;

  if (spaceData.copyright) {
    apodCopyright.textContent = `© ${spaceData.copyright}`;
    apodCopyright.classList.remove("hidden");
  } else {
    apodCopyright.classList.add("hidden");
  }

  dateShowSpan.textContent = formattedDate;

  loading.classList.add("hidden");
  apodImage.classList.remove("hidden");
}

// Initialize
updateUI();

// When clicking on "load" button
loadDateBtn.addEventListener("click", () => {
  const selectDate = apodDateInput.value;
  if (selectDate) {
    updateUI(selectDate);
  }
});

// When clicking on "today" button
todayApodBtn.addEventListener("click", () => {
  updateUI();
});

// Action for changing the date in the input field (Calendar)
apodDateInput.addEventListener("change", (e) => {
  const selectedValue = e.target.value;

  if (selectedValue) {
    const date = new Date(selectedValue);
    dateShowSpan.textContent = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
});

// Action for the "View Full Resolution" button
viewImgBtn.addEventListener("click", () => {
  // If there is a URL, open it in a new browser tab
  if (currentUrl) {
    window.open(currentUrl, "_blank");
  }
});

// Launches
//  HTML Elements
const launchesCount = document.getElementById("launches-count");
const launchesCountMobile = document.getElementById("launches-count-mobile");
const featuredLaunchContainer = document.getElementById("featured-launch");
const launchesGrid = document.getElementById("launches-grid");

const LAUNCHES_API_URL =
  "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10";

async function launchesData() {
  try {
    const res = await fetch(LAUNCHES_API_URL);
    const data = await res.json();

    const launches = data.results;

    launchesCount.textContent = `${launches.length} Launches`;
    launchesCountMobile.textContent = launches.length;

    if (launches.length > 0) {
      renderFeaturedLaunch(launches[0]);
    }

    console.log(launches);
  } catch (error) {
    console.error("Error fetching launches:", error);
  }
}

launchesData();

// 4. Update the Featured Launch (The big card at the top)
function renderFeaturedLaunch(launch) {
  const formatDate = new Date(launch.net);
  const launchDate = formatDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const launchTime = formatDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

  const today = new Date();
  const timeDifference = formatDate.getTime() - today.getTime();
  // Convert milliseconds into days and round up to the nearest whole number
  const numDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  const providerName = launch.launch_service_provider
    ? launch.launch_service_provider.name
    : "Unknown Provider";

  const locationName =
    launch.pad && launch.pad.location
      ? launch.pad.location.name
      : "Unknown Location";

  const countryName =
    launch.pad && launch.pad.location.country
      ? launch.pad.location.country.name
      : "Unknown";

  const description = launch.mission
    ? launch.mission.description
    : "Mission details will be available closer to launch date.";

  const imageUrl = launch.image
    ? launch.image.image_url
    : "./assets/images/placeholder.webp";

  const color = {
    Go: "green",
    Success: "green",
    TBD: "yellow",
    Hold: "red",
    TBC: "yellow",
  };
  const statusColor = color[launch.status.abbrev] || "slate";

  const rocket = launch.rocket
    ? launch.rocket.configuration.name
    : "No rocket configuration available.";

  featuredLaunchContainer.innerHTML = `
    <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
      <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                <i class="fas fa-star"></i> Featured Launch
              </span>
              <span class="px-4 py-1.5 bg-${statusColor}-500/20 text-${statusColor}-400 rounded-full text-sm font-semibold">
                ${launch.status.abbrev}
              </span>
            </div>
            
            <h3 class="text-3xl font-bold mb-3 leading-tight">${launch.name}</h3>
            
            <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
              <div class="flex items-center gap-2">
                <i class="fas fa-building"></i>
                <span>${providerName}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-rocket"></i>
                <span>${rocket}</span>
              </div>
            </div>
            
            ${
              numDays > 0
                ? `
              <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
                  <i class="fas fa-clock text-2xl text-blue-400"></i>
                  <div>
                      <p class="text-2xl font-bold text-blue-400">${numDays}</p>
                      <p class="text-xs text-slate-400">Days Until Launch</p>
                  </div>
              </div>
              `
                : ""
            }

            <div class="grid xl:grid-cols-2 gap-4 mb-6">
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-calendar"></i> Launch Date</p>
                <p class="font-semibold">${launchDate}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-clock"></i> Launch Time</p>
                <p class="font-semibold">${launchTime}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-map-marker-alt"></i> Location</p>
                <p class="font-semibold text-sm">${locationName}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                    <i class="fas fa-globe"></i>
                    Country
                </p>
                <p class="font-semibold">${countryName}</p>
              </div>
            </div>

            <p class="text-slate-300 leading-relaxed mb-6">
              ${description}
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
        
        <div class="relative rounded-2xl overflow-hidden bg-slate-900/50 min-h-[400px]">
          <img src="${imageUrl}" alt="Launch Image" class="w-full h-full object-cover">
        </div>
      </div>
    </div>
  `;
}
