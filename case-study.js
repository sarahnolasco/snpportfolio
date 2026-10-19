
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("caseStudyContent");
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (!container || !Array.isArray(projects)) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");

  const projectIndex = projects.findIndex(
    (project) => project.id === projectId
  );

  const project = projects[projectIndex];

  function addTextElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    element.textContent = text;
    return element;
  }

  function createSectionHeading(text) {
    return addTextElement("h3", "", text);
  }

  function createImage(src, title, isCover = false) {
    const image = document.createElement("img");

    image.src = src;
    image.alt = title;
    image.loading = isCover ? "eager" : "lazy";

    image.addEventListener(
      "error",
      () => {
        image.style.display = "none";
      },
      { once: true }
    );

    return image;
  }

  // Create a two-column gallery of process images with optional captions.
  function createProcessImages(processImages) {
    if (!Array.isArray(processImages) || processImages.length === 0) {
      return null;
    }

    const gallery = document.createElement("div");
    gallery.className = "process-images";

    processImages.forEach((item, index) => {
      // Supports filenames or objects containing src, caption, and alt.
      const imageData =
        typeof item === "string"
          ? { src: item, caption: "" }
          : item;

      if (!imageData || !imageData.src) {
        return;
      }

      const figure = document.createElement("figure");
      figure.className = "process-image-item";

      const image = createImage(
        imageData.src,
        imageData.alt ||
          `${project.title} process image ${index + 1}`
      );

      figure.appendChild(image);

      if (imageData.caption) {
        figure.appendChild(
          addTextElement(
            "figcaption",
            "process-caption",
            imageData.caption
          )
        );
      }

      gallery.appendChild(figure);
    });

    return gallery.childElementCount > 0 ? gallery : null;
  }

  // Display an error if the requested project cannot be found.
  function renderError() {
    container.replaceChildren();

    const section = document.createElement("section");
    section.className = "case-error";

    const title = addTextElement(
      "h1",
      "",
      "Project not found."
    );

    const message = addTextElement(
      "p",
      "",
      "This project may have been moved or the link may be incorrect."
    );

    const backLink = document.createElement("a");
    backLink.className = "text-link";
    backLink.href = "index.html#work";
    backLink.textContent = "Back to all work ↗";

    section.append(title, message, backLink);
    container.appendChild(section);

    document.title = "Project Not Found | Portfolio";
  }

  function renderProject(project) {
    container.replaceChildren();

    document.title = `${project.title} | Portfolio`;

    // Back link
    const backLink = document.createElement("a");
    backLink.className = "case-back";
    backLink.href = "index.html#work";
    backLink.textContent = "← Back to all work";

    // Project introduction
    const hero = document.createElement("section");
    hero.className = "case-hero";

    const eyebrow = addTextElement(
      "p",
      "eyebrow",
      `${project.category} / ${project.year}`
    );

    const title = addTextElement(
      "h1",
      "case-title",
      project.title
    );

    const intro = addTextElement(
      "p",
      "case-intro",
      project.description || ""
    );

    hero.append(eyebrow, title, intro);

    // Main project cover
    const cover = document.createElement("div");
    cover.className = "case-cover";

    cover.appendChild(
      createImage(
        project.cover,
        `${project.title} project cover`,
        true
      )
    );

    // Project details
    const infoGrid = document.createElement("section");
    infoGrid.className = "case-info-grid";
    infoGrid.setAttribute("aria-label", "Project details");

    const infoItems = [
      ["Category", project.category],
      ["Year", project.year],
      [
        "Tools",
        Array.isArray(project.tools)
          ? project.tools.join(", ")
          : project.tools || "Not specified"
      ]
    ];

    infoItems.forEach(([label, value]) => {
      const item = document.createElement("div");
      item.className = "case-info-item";

      item.append(
        addTextElement("h2", "", label),
        addTextElement("p", "", value || "Not specified")
      );

      infoGrid.appendChild(item);
    });

    // Case study content
    const content = document.createElement("section");
    content.className = "case-content";

    const contentHeading = document.createElement("div");

    contentHeading.appendChild(
      addTextElement("h2", "", "Behind the design.")
    );

    const contentBody = document.createElement("div");

    // The brief
    if (project.brief) {
      contentBody.appendChild(
        createSectionHeading("The brief")
      );

      contentBody.appendChild(
        addTextElement("p", "", project.brief)
      );
    }

    // Project goals
    if (project.goals) {
      contentBody.appendChild(
        createSectionHeading("Project goals")
      );

      if (Array.isArray(project.goals)) {
        const list = document.createElement("ul");

        project.goals.forEach((goal) => {
          list.appendChild(
            addTextElement("li", "", goal)
          );
        });

        contentBody.appendChild(list);
      } else {
        contentBody.appendChild(
          addTextElement("p", "", project.goals)
        );
      }
    }

    // The process introduction
    if (project.process || project.processSections || project.processImages) {
      contentBody.appendChild(
        createSectionHeading("The process")
      );

      if (project.process) {
        contentBody.appendChild(
          addTextElement("p", "", project.process)
        );
      }
    }

    // NEW: Separate process sections, each with its own image grid.
    if (Array.isArray(project.processSections)) {
      project.processSections.forEach((section) => {
        const sectionWrapper = document.createElement("div");
        sectionWrapper.className = "process-section";

        if (section.title) {
          sectionWrapper.appendChild(
            createSectionHeading(section.title)
          );
        }

        if (section.description) {
          sectionWrapper.appendChild(
            addTextElement("p", "", section.description)
          );
        }

        const gallery = createProcessImages(section.images);

        if (gallery) {
          sectionWrapper.appendChild(gallery);
        }

        contentBody.appendChild(sectionWrapper);
      });
    } else {
      // Backward compatibility with the original processImages array.
      const gallery = createProcessImages(project.processImages);

      if (gallery) {
        contentBody.appendChild(gallery);
      }
    }

    // The outcome
    if (project.outcome) {
      contentBody.appendChild(
        createSectionHeading("The outcome")
      );

      contentBody.appendChild(
        addTextElement("p", "", project.outcome)
      );
    }

    content.append(contentHeading, contentBody);

    // Final project images gallery
    const gallery = document.createElement("section");
    gallery.className = "case-gallery";
    gallery.setAttribute("aria-label", "Project images");

    const images = Array.isArray(project.images)
      ? project.images
      : [];

    images
      .filter((src) => src && src !== project.cover)
      .forEach((src, index) => {
        gallery.appendChild(
          createImage(
            src,
            `${project.title} project image ${index + 1}`
          )
        );
      });

    // Previous and next project navigation
    const navigation = document.createElement("nav");
    navigation.className = "case-next";

    navigation.setAttribute(
      "aria-label",
      "Navigate between projects"
    );

    const previousProject =
      projects[
        (projectIndex - 1 + projects.length) % projects.length
      ];

    const nextProject =
      projects[(projectIndex + 1) % projects.length];

    function createProjectNavLink(item, label) {
      const link = document.createElement("a");

      link.href = `project.html?id=${encodeURIComponent(item.id)}`;
      link.textContent = `${label}: ${item.title}`;

      return link;
    }

    if (projects.length > 1) {
      navigation.append(
        createProjectNavLink(previousProject, "← Previous"),
        createProjectNavLink(nextProject, "Next →")
      );
    } else {
      const backToWork = document.createElement("a");
      backToWork.href = "index.html#work";
      backToWork.textContent = "← Back to all work";
      navigation.appendChild(backToWork);
    }

    // Preserve the existing page structure.
    container.append(
      backLink,
      hero,
      cover,
      infoGrid,
      content
    );

    if (gallery.childElementCount > 0) {
      container.appendChild(gallery);
    }

    container.appendChild(navigation);
  }

  if (!project) {
    renderError();
    return;
  }

  renderProject(project);
});