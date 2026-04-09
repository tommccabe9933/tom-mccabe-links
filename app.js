const projects = [
  {
    name: "US Wind Farms",
    category: "Infrastructure data",
    href: "https://uswindfarms.streamlit.app/",
    description:
      "Utility-scale wind sourcing workbench built on Streamlit and federal energy datasets. It normalizes EIA, EPA, and USGS plant-level records into a screening layer for sourcing, diligence, and asset triage."
  },
  {
    name: "Activist Aggregator",
    category: "Event intelligence",
    href: "https://activist-aggregator.vercel.app/",
    description:
      "Research surface for activist campaigns, filings, announcements, and short reports. It indexes structured event data and source documents into a search workflow optimized for rapid review."
  },
  {
    name: "Pocket Multiples",
    category: "Market dashboard",
    href: "https://metrix-kappa.vercel.app/",
    description:
      "Mobile-first stock dashboard for fast multiple-based market analysis. It compresses valuation signals and market data into a compact interface tuned for single-user decision support."
  }
];

const contacts = [
  {
    label: "Email",
    value: "mccabetom6@gmail.com",
    href: "mailto:mccabetom6@gmail.com",
    copy: "Direct inbox for projects, research, and operating opportunities."
  },
  {
    label: "LinkedIn",
    value: "Thomas McCabe",
    href: "https://www.linkedin.com/in/thomaswmccabe/",
    copy: "Professional profile with background, roles, and network context."
  }
];

const projectList = document.querySelector("#project-list");
const contactGrid = document.querySelector("#contact-grid");
const signalProject = document.querySelector("#signal-project");
const signalMode = document.querySelector("#signal-mode");
const statusPill = document.querySelector("#status-pill");
const detailIndex = document.querySelector("#detail-index");
const detailKicker = document.querySelector("#detail-kicker");
const detailTitle = document.querySelector("#detail-title");
const detailDescription = document.querySelector("#detail-description");
const detailLink = document.querySelector("#detail-link");
const progressBar = document.querySelector("#detail-progress-bar");

let activeIndex = 0;
let autoplay = true;
let cycleInterval;
let progressInterval;
let progressValue = 0;

function renderProjects() {
  projectList.innerHTML = "";

  projects.forEach((project, index) => {
    const button = document.createElement("button");
    button.className = "project-card";
    button.type = "button";
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", index === 0 ? "true" : "false");
    button.dataset.index = String(index);
    button.innerHTML = `
      <div class="project-card-topline">
        <span class="project-card-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="project-card-kicker">${project.category}</span>
      </div>
      <h3 class="project-card-title">${project.name}</h3>
      <p class="project-card-copy">${project.description}</p>
    `;

    button.addEventListener("click", () => {
      setAutoplay(false);
      setActiveProject(index);
      openProject(index);
    });

    button.addEventListener("mouseenter", () => {
      setAutoplay(false);
      setActiveProject(index);
    });

    button.addEventListener("focus", () => {
      setAutoplay(false);
      setActiveProject(index);
    });

    projectList.appendChild(button);
  });
}

function renderContacts() {
  contactGrid.innerHTML = "";

  contacts.forEach((contact) => {
    const link = document.createElement("a");
    link.className = "contact-card";
    link.href = contact.href;
    if (contact.href.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    link.innerHTML = `
      <span class="contact-label">${contact.label}</span>
      <span class="contact-value">${contact.value}</span>
      <span class="contact-copy">${contact.copy}</span>
    `;
    contactGrid.appendChild(link);
  });
}

function setActiveProject(index) {
  activeIndex = index;

  const cards = [...document.querySelectorAll(".project-card")];
  cards.forEach((card, cardIndex) => {
    const active = cardIndex === index;
    card.classList.toggle("is-active", active);
    card.setAttribute("aria-selected", active ? "true" : "false");
  });

  const project = projects[index];
  detailIndex.textContent = String(index + 1).padStart(2, "0");
  detailKicker.textContent = project.category;
  detailTitle.textContent = project.name;
  detailDescription.textContent = project.description;
  detailLink.href = project.href;
  signalProject.textContent = project.name;
  restartProgress();
}

function openProject(index = activeIndex) {
  window.open(projects[index].href, "_blank", "noopener,noreferrer");
}

function stepSelection(direction) {
  const next = (activeIndex + direction + projects.length) % projects.length;
  setActiveProject(next);
  const card = document.querySelector(`.project-card[data-index="${next}"]`);
  if (card) {
    card.focus();
  }
}

function setAutoplay(enabled) {
  autoplay = enabled;
  signalMode.textContent = enabled ? "Autoplay" : "Manual";
  statusPill.textContent = enabled ? "System online" : "Manual focus";
  if (enabled) {
    startAutoplay();
  } else {
    stopAutoplay();
  }
}

function startAutoplay() {
  stopAutoplay();
  cycleInterval = window.setInterval(() => {
    const next = (activeIndex + 1) % projects.length;
    setActiveProject(next);
  }, 5200);
}

function stopAutoplay() {
  window.clearInterval(cycleInterval);
  window.clearInterval(progressInterval);
}

function restartProgress() {
  window.clearInterval(progressInterval);
  progressValue = 0;
  progressBar.style.width = "0%";
  if (!autoplay) {
    return;
  }
  progressInterval = window.setInterval(() => {
    progressValue += 2;
    progressBar.style.width = `${Math.min(progressValue, 100)}%`;
    if (progressValue >= 100) {
      window.clearInterval(progressInterval);
    }
  }, 104);
}

function bindKeyboardShortcuts() {
  window.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    if (event.key >= "1" && event.key <= String(projects.length)) {
      setAutoplay(false);
      setActiveProject(Number(event.key) - 1);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      setAutoplay(false);
      stepSelection(1);
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      setAutoplay(false);
      stepSelection(-1);
      return;
    }

    if (event.key === "Enter") {
      openProject();
      return;
    }

    if (event.key.toLowerCase() === "e") {
      window.location.href = "mailto:mccabetom6@gmail.com";
      return;
    }

    if (event.key.toLowerCase() === "l") {
      window.open("https://www.linkedin.com/in/thomaswmccabe/", "_blank", "noopener,noreferrer");
      return;
    }

    if (event.key.toLowerCase() === "a") {
      setAutoplay(true);
    }
  });
}

function bindRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function init() {
  renderProjects();
  renderContacts();
  bindKeyboardShortcuts();
  bindRevealObserver();
  setActiveProject(0);
  setAutoplay(true);
}

init();
