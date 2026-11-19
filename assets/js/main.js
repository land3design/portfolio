(function () {
  "use strict";

  var CONFIG = {
    whatsappNumber: "26771473883",
    phoneDisplay: "+267 71 473 883",
    email: "kabotasha@gmail.com",
    addressLines: ["Plot 1336, Boatle", "P O Box 815, Francistown", "Botswana"],
    defaultMessage: "Hello LAND3 DESIGN, I would like to enquire about your services."
  };

  var DATA = window.LAND3_PROJECTS || { locations: {}, curtains: { items: [] } };
  var STAGE_ORDER = ["before", "during", "after"];
  var STAGE_LABEL = { before: "Before", during: "During", after: "After" };
  var LOCATION_CATEGORY_FILTERS = [
    { value: "all", label: "All work" },
    { value: "ba", label: "Before & After" },
    { value: "construction", label: "Construction & Renovations" },
    { value: "completed", label: "Completed Projects" },
    { value: "interiors", label: "Curtains & Interior Design" }
  ];

  function photo(location, stage, id) {
    return "assets/projects/" + location + "/" + stage + "/" + id + ".jpg";
  }

  function whatsappUrl(text) {
    return "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(text);
  }

  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function stageMap(loc) {
    var map = {};
    STAGE_ORDER.forEach(function (stage) {
      loc.stages[stage].forEach(function (id) { map[id] = stage; });
    });
    return map;
  }

  function orderedIds(loc) {
    var ids = [];
    STAGE_ORDER.forEach(function (stage) {
      loc.stages[stage].forEach(function (id) { ids.push({ id: id, stage: stage }); });
    });
    return ids;
  }

  function galleryButton(src, caption, alt, tag, extraClass) {
    var btn = el("button", {
      type: "button",
      "data-src": src,
      "data-caption": caption,
      "class": "reveal" + (extraClass ? " " + extraClass : "")
    });
    btn.appendChild(el("img", { src: src, alt: alt, loading: "lazy", decoding: "async" }));
    if (tag) btn.appendChild(el("span", { "class": "tag" }, tag));
    return btn;
  }

  function sliderMarkup(beforeSrc, afterSrc, alt) {
    return (
      '<div class="ba-slider" style="--pos:50%">' +
        '<img src="' + beforeSrc + '" alt="Before: ' + alt + '" loading="lazy" decoding="async">' +
        '<img class="ba-after" src="' + afterSrc + '" alt="After: ' + alt + '" loading="lazy" decoding="async">' +
        '<span class="ba-label before">Before</span>' +
        '<span class="ba-label after">After</span>' +
        '<div class="ba-divider" aria-hidden="true"></div>' +
        '<input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after">' +
      '</div>'
    );
  }

  function renderLocation(root, key) {
    var loc = DATA.locations[key];
    if (!loc) return;
    var interiors = loc.interiors;
    var all = orderedIds(loc);
    var stageOf = stageMap(loc);
    var construction = all.filter(function (x) { return interiors.indexOf(x.id) === -1 && x.stage !== "after"; });
    var completed = all.filter(function (x) { return interiors.indexOf(x.id) === -1 && x.stage === "after"; });
    var interiorItems = all.filter(function (x) { return interiors.indexOf(x.id) !== -1; });
    var categoryNames = {
      ba: "Before-and-After Transformations",
      construction: "Construction and Renovations",
      completed: "Completed Projects",
      interiors: "Curtains and Interior Design"
    };

    var filters = el("div", { "class": "filters reveal", role: "group", "aria-label": "Filter " + loc.name + " projects" });
    LOCATION_CATEGORY_FILTERS.forEach(function (f) {
      filters.appendChild(el("button", {
        type: "button", "class": "filter-btn", "data-filter": f.value,
        "aria-pressed": f.value === "all" ? "true" : "false"
      }, f.label));
    });
    root.appendChild(filters);

    // Before-and-after sliders
    var baSection = el("section", { "class": "category", "data-category": "ba" });
    baSection.appendChild(categoryHead("ba", loc.name, "Each transformation is shown with its unfinished BEFORE stage and finished AFTER stage. Drag the handle to compare."));
    if (loc.pairs.length) {
      var baGrid = el("div", { "class": "ba-grid" });
      loc.pairs.forEach(function (pair, i) {
        var card = el("article", { "class": "ba-card reveal" });
        card.innerHTML =
          sliderMarkup(photo(key, "before", pair.before), photo(key, "after", pair.after), loc.name + " transformation " + (i + 1)) +
          '<div class="ba-caption">' +
            '<p class="meta">' + loc.name + ' &middot; Transformation ' + String(i + 1).padStart(2, "0") + '</p>' +
            '<h4>Construction transformation</h4>' +
            '<p class="placeholder">[Project description to be added]</p>' +
          '</div>';
        baGrid.appendChild(card);
      });
      baSection.appendChild(baGrid);
    } else {
      baSection.appendChild(el("p", { "class": "ba-empty" }, "Before-and-after comparisons for " + loc.name + " are being added."));
    }
    root.appendChild(baSection);

    root.appendChild(gallerySection("construction", loc.name, construction.map(function (x) {
      return { src: photo(key, x.stage, x.id), tag: STAGE_LABEL[x.stage], caption: loc.name + " - " + STAGE_LABEL[x.stage] + " - Construction and Renovations", alt: loc.name + " " + STAGE_LABEL[x.stage].toLowerCase() + " construction photograph" };
    })));

    root.appendChild(gallerySection("completed", loc.name, completed.map(function (x) {
      return { src: photo(key, x.stage, x.id), tag: "Completed", caption: loc.name + " - Completed project", alt: loc.name + " completed project photograph" };
    })));

    root.appendChild(gallerySection("interiors", loc.name, interiorItems.map(function (x) {
      return { src: photo(key, x.stage, x.id), tag: "Interior", caption: loc.name + " - Curtains and Interior Design", alt: loc.name + " interior photograph" };
    })));
  }

  function categoryHead(cat, locName, text) {
    var labels = {
      ba: "Before-and-After Transformations",
      construction: "Construction and Renovations",
      completed: "Completed Projects",
      interiors: "Curtains and Interior Design"
    };
    var head = el("div", { "class": "category-head reveal" });
    head.appendChild(el("h3", {}, labels[cat]));
    head.appendChild(el("p", {}, text));
    return head;
  }

  function gallerySection(cat, locName, items) {
    var section = el("section", { "class": "category", "data-category": cat });
    var descriptions = {
      construction: "Unfinished works and site progress from " + locName + ", shown as they were captured.",
      completed: "Finished exteriors and spaces delivered at " + locName + ".",
      interiors: "Interior finishes, curtains and window treatments at " + locName + "."
    };
    section.appendChild(categoryHead(cat, locName, descriptions[cat]));
    if (!items.length) {
      section.appendChild(el("p", { "class": "ba-empty" }, "Photographs for this category are being added."));
      return section;
    }
    var gallery = el("div", { "class": "gallery", "data-gallery": "" });
    items.forEach(function (it) {
      gallery.appendChild(galleryButton(it.src, it.caption, it.alt, it.tag));
    });
    section.appendChild(gallery);
    return section;
  }

  function renderCurtains(root) {
    var items = DATA.curtains.items;
    var filters = el("div", { "class": "filters reveal", role: "group", "aria-label": "Filter curtain and interior projects" });
    var values = [{ value: "all", label: "All" }, { value: "Curtain installations", label: "Curtain installations" }, { value: "Window treatments", label: "Window treatments" }, { value: "Interior spaces", label: "Interior spaces" }];
    values.forEach(function (f) {
      filters.appendChild(el("button", { type: "button", "class": "filter-btn", "data-filter": f.value, "aria-pressed": f.value === "all" ? "true" : "false" }, f.label));
    });
    root.appendChild(filters);
    var editorial = el("div", { "class": "editorial", "data-gallery": "" });
    items.forEach(function (it) {
      var figure = el("figure", { "data-category": it.category, "class": "reveal" });
      var btn = el("button", { type: "button", "data-src": "assets/projects/curtains/" + it.id + ".jpg", "data-caption": it.category });
      btn.appendChild(el("img", { src: "assets/projects/curtains/" + it.id + ".jpg", alt: it.category + " by LAND3 DESIGN", loading: "lazy", decoding: "async" }));
      figure.appendChild(btn);
      figure.appendChild(el("figcaption", {}, it.category));
      editorial.appendChild(figure);
    });
    root.appendChild(editorial);
  }

  function setupFilters(root, targetSelector, attr) {
    root.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      var wanted = btn.getAttribute("data-filter");
      root.querySelectorAll(".filter-btn").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      root.querySelectorAll(targetSelector).forEach(function (node) {
        var value = node.getAttribute(attr);
        node.hidden = !(wanted === "all" || value === wanted);
      });
    });
  }

  // Lightbox
  var lightbox, lbImg, lbCaption, lbItems = [], lbIndex = 0, lbReturn = null;

  function buildLightbox() {
    lightbox = el("div", { "class": "lightbox", role: "dialog", "aria-modal": "true", "aria-label": "Photo viewer" });
    lightbox.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox-prev" aria-label="Previous photo">&#8592;</button>' +
      '<img alt="">' +
      '<button type="button" class="lightbox-next" aria-label="Next photo">&#8594;</button>' +
      '<p class="lightbox-caption"></p>';
    document.body.appendChild(lightbox);
    lbImg = lightbox.querySelector("img");
    lbCaption = lightbox.querySelector(".lightbox-caption");
    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", function () { stepLightbox(-1); });
    lightbox.querySelector(".lightbox-next").addEventListener("click", function () { stepLightbox(1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  }

  function showLightbox(index) {
    lbIndex = (index + lbItems.length) % lbItems.length;
    var item = lbItems[lbIndex];
    lbImg.src = item.getAttribute("data-src");
    lbImg.alt = item.getAttribute("data-caption") || "";
    lbCaption.textContent = (item.getAttribute("data-caption") || "") + "  (" + (lbIndex + 1) + " / " + lbItems.length + ")";
  }

  function openLightbox(trigger) {
    var group = trigger.closest("[data-gallery]");
    lbItems = Array.prototype.filter.call(group.querySelectorAll("button[data-src]"), function (b) {
      return !b.closest("[hidden]");
    });
    lbReturn = trigger;
    showLightbox(lbItems.indexOf(trigger));
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close").focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lbReturn) lbReturn.focus();
  }

  function stepLightbox(dir) { showLightbox(lbIndex + dir); }

  function setupLightbox() {
    buildLightbox();
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-gallery] button[data-src]");
      if (trigger) openLightbox(trigger);
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") stepLightbox(1);
      if (e.key === "ArrowLeft") stepLightbox(-1);
    });
  }

  function setupNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("primary-nav");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    var dropdowns = document.querySelectorAll(".has-dropdown");
    function setDropdown(item, open) {
      item.classList.toggle("is-open", open);
      item.querySelector(".nav-dropdown-toggle").setAttribute("aria-expanded", open ? "true" : "false");
    }
    dropdowns.forEach(function (item) {
      item.querySelector(".nav-dropdown-toggle").addEventListener("click", function () {
        var open = !item.classList.contains("is-open");
        dropdowns.forEach(function (other) { if (other !== item) setDropdown(other, false); });
        setDropdown(item, open);
      });
    });
    document.addEventListener("click", function (e) {
      dropdowns.forEach(function (item) {
        if (!item.contains(e.target)) setDropdown(item, false);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      dropdowns.forEach(function (item) { setDropdown(item, false); });
    });
    var header = document.querySelector(".site-header");
    function onScroll() {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function setupReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function setupSliders() {
    document.addEventListener("input", function (e) {
      if (e.target.matches(".ba-slider input[type='range']")) {
        e.target.parentElement.style.setProperty("--pos", e.target.value + "%");
      }
    });
  }

  function fillContactDetails() {
    document.querySelectorAll("[data-year]").forEach(function (n) {
      n.textContent = new Date().getFullYear();
    });
    document.querySelectorAll("[data-wa-link]").forEach(function (a) {
      a.setAttribute("href", whatsappUrl(a.getAttribute("data-wa-text") || CONFIG.defaultMessage));
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
    document.querySelectorAll("[data-phone]").forEach(function (n) {
      n.textContent = CONFIG.phoneDisplay;
    });
    document.querySelectorAll("[data-email]").forEach(function (a) {
      a.textContent = CONFIG.email;
      a.setAttribute("href", "mailto:" + CONFIG.email);
    });
    document.querySelectorAll("[data-address]").forEach(function (n) {
      n.textContent = "";
      CONFIG.addressLines.forEach(function (line, i) {
        if (i) n.appendChild(document.createElement("br"));
        n.appendChild(document.createTextNode(line));
      });
    });
  }

  function setupEnquiryForm() {
    var form = document.querySelector("[data-enquiry-form]");
    if (!form) return;
    var status = form.querySelector(".form-status");
    var preset = new URLSearchParams(window.location.search).get("service");
    var serviceSelect = form.querySelector("select[name='service']");
    if (preset && serviceSelect) serviceSelect.value = preset;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var d = new FormData(form);
      var text = [
        "New enquiry from the LAND3 DESIGN website",
        "Name: " + d.get("name"),
        "Phone: " + (d.get("phone") || "not provided"),
        "Email: " + (d.get("email") || "not provided"),
        "Service: " + (d.get("service") || "not specified"),
        "",
        d.get("message")
      ].join("\n");
      window.open(whatsappUrl(text), "_blank", "noopener");
      if (status) {
        status.className = "form-status";
        status.textContent = "WhatsApp is opening with your enquiry. If it does not open, please contact us directly.";
      }
    });
  }

  function init() {
    setupNav();
    setupSliders();
    setupLightbox();
    fillContactDetails();
    setupEnquiryForm();

    document.querySelectorAll("[data-location-portfolio]").forEach(function (root) {
      var key = root.getAttribute("data-location-portfolio");
      renderLocation(root, key);
      setupFilters(root, "[data-category]", "data-category");
    });

    document.querySelectorAll("[data-curtains-portfolio]").forEach(function (root) {
      renderCurtains(root);
      setupFilters(root, "figure[data-category]", "data-category");
    });

    setupReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
