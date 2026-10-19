
document.addEventListener("DOMContentLoaded", () => {
  const projectGrid = document.getElementById("projectGrid");
  const projectCount = document.getElementById("projectCount");
  const emptyMessage = document.getElementById("emptyMessage");
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (!projectGrid || !Array.isArray(projects)) {
    return;
  }

  function createProjectCard(project) {
    const link = document.createElement("a");

    link.className = "project-card";
    link.href = `project.html?id=${encodeURIComponent(project.id)}`;
    link.setAttribute(
      "aria-label",
      `View case study: ${project.title}`
    );

    const imageWrap = document.createElement("div");
    imageWrap.className = "project-image-wrap";

    const image = document.createElement("img");
    image.className = "project-image";
    image.src = project.cover;
    image.alt = `${project.title} project cover`;
    image.loading = "lazy";

    image.addEventListener("error", () => {
      imageWrap.classList.add("image-missing");
      image.alt = "Project image unavailable. Check the image path.";
    }, { once: true });

    const arrow = document.createElement("span");
    arrow.className = "project-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";

    imageWrap.append(image, arrow);

    const details = document.createElement("div");
    details.className = "project-details";

    const title = document.createElement("h3");
    title.textContent = project.title;

    const metadata = document.createElement("p");
    metadata.className = "project-meta";
    metadata.textContent = `${project.category} / ${project.year}`;

    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description;

    details.append(title, metadata, description);
    link.append(imageWrap, details);

    return link;
  }

  function renderProjects() {
    projectGrid.replaceChildren();

    projects.forEach((project) => {
      projectGrid.appendChild(createProjectCard(project));
    });

    if (projectCount) {
      projectCount.textContent =
        `${projects.length} ${
          projects.length === 1 ? "project" : "projects"
        }`;
    }

    if (emptyMessage) {
      emptyMessage.hidden = projects.length > 0;
    }
  }

  renderProjects();
});