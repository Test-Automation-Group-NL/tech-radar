"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // src/data-loader.ts
  var VALID_QUADRANTS = ["techniques", "platforms", "tools", "languages-and-frameworks"];
  var VALID_RINGS = ["adopt", "trial", "assess", "hold"];
  function normaliseQuadrant(raw) {
    const s = raw.toLowerCase().trim().replace(/\s+/g, "-");
    return VALID_QUADRANTS.includes(s) ? s : null;
  }
  function normaliseRing(raw) {
    const s = raw.toLowerCase().trim();
    return VALID_RINGS.includes(s) ? s : null;
  }
  function normaliseIsNew(raw) {
    if (typeof raw === "boolean") return raw;
    return raw === "TRUE";
  }
  function parseRawRadarItems(rawItems) {
    if (!Array.isArray(rawItems)) {
      throw new Error("[TechRadar] radar.json must be an array");
    }
    let id = 1;
    const blips = [];
    for (const raw of rawItems) {
      if (!raw || typeof raw !== "object") continue;
      const item = raw;
      const quadrant = normaliseQuadrant(item.quadrant);
      const ring = normaliseRing(item.ring);
      if (!quadrant) {
        console.warn(`[TechRadar] Unknown quadrant "${item.quadrant}" for "${item.name}" \u2014 skipped`);
        continue;
      }
      if (!ring) {
        console.warn(`[TechRadar] Unknown ring "${item.ring}" for "${item.name}" \u2014 skipped`);
        continue;
      }
      blips.push({
        id: id++,
        name: item.name,
        ring,
        quadrant,
        isNew: normaliseIsNew(item.isNew),
        status: item.status,
        description: item.description,
        // Positioning filled in by positioner.ts
        angle: 0,
        radius: 0,
        x: 0,
        y: 0
      });
    }
    return blips;
  }
  async function loadRadarData(config) {
    try {
      const res = await fetch(config.jsonUrl, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return parseRawRadarItems(await res.json());
    } catch (err) {
      console.error("[TechRadar] Failed to load radar data:", err);
      throw err;
    }
  }

  // src/renderer.ts
  var SVG_NS = "http://www.w3.org/2000/svg";
  var QUADRANT_ANGLES = {
    "techniques": { start: 180, end: 270 },
    "tools": { start: 270, end: 360 },
    "languages-and-frameworks": { start: 0, end: 90 },
    "platforms": { start: 90, end: 180 }
  };
  var RING_RADII = {
    adopt: { inner: 0, outer: 0.3 },
    trial: { inner: 0.3, outer: 0.55 },
    assess: { inner: 0.55, outer: 0.75 },
    hold: { inner: 0.75, outer: 1 }
  };
  var RING_COLORS = {
    "techniques": {
      adopt: "#5b907e",
      trial: "#709e8e",
      assess: "#8db1a5",
      hold: "#ccdcd6"
    },
    "tools": {
      adopt: "#9e5b7b",
      trial: "#ab6f8c",
      assess: "#bd8ba3",
      hold: "#e3ccd7"
    },
    "languages-and-frameworks": {
      adopt: "#638ca3",
      trial: "#7699ae",
      assess: "#91abbd",
      hold: "#cdd8e2"
    },
    "platforms": {
      adopt: "#dc7f6a",
      trial: "#e1907a",
      assess: "#e8a794",
      hold: "#f6dace"
    }
  };
  function toRad(deg) {
    return deg * Math.PI / 180;
  }
  function arcPath(cx, cy, r, startDeg, endDeg) {
    const s = toRad(startDeg);
    const e = toRad(endDeg);
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy + r * Math.sin(e);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
  }
  function annulusSectorPath(cx, cy, r1, r2, startDeg, endDeg) {
    const s = toRad(startDeg);
    const e = toRad(endDeg);
    const x1 = cx + r1 * Math.cos(s);
    const y1 = cy + r1 * Math.sin(s);
    const x2 = cx + r2 * Math.cos(s);
    const y2 = cy + r2 * Math.sin(s);
    const x3 = cx + r2 * Math.cos(e);
    const y3 = cy + r2 * Math.sin(e);
    const x4 = cx + r1 * Math.cos(e);
    const y4 = cy + r1 * Math.sin(e);
    return `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 0 0 ${x1} ${y1} Z`;
  }
  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, String(v));
    }
    return el;
  }
  function buildDimensions(containerWidth) {
    const size = containerWidth;
    const cx = size / 2;
    const cy = size / 2;
    const outerRadius = Math.max(52, size / 2 - 5);
    return { size, cx, cy, outerRadius, ringRadii: RING_RADII };
  }
  function createRadarSVG(dim, config, blips) {
    const { size, cx, cy, outerRadius } = dim;
    const svg = svgEl("svg", {
      viewBox: `0 0 ${size} ${size}`,
      class: "techradar-svg",
      role: "img",
      "aria-label": "Technology Radar chart"
    });
    svg.appendChild(svgEl("rect", { width: size, height: size, class: "radar-bg" }));
    const rings = ["adopt", "trial", "assess", "hold"];
    for (const q of config.quadrants) {
      const { start, end } = QUADRANT_ANGLES[q.id];
      const colors = RING_COLORS[q.id];
      const group = svgEl("g", {
        class: `radar-quadrant-group radar-quadrant-group--${q.id}`,
        "data-quadrant": q.id
      });
      for (const ringId of rings) {
        const { inner, outer } = RING_RADII[ringId];
        const r1 = inner * outerRadius;
        const r2 = outer * outerRadius;
        const d = inner === 0 ? arcPath(cx, cy, r2, start, end) : annulusSectorPath(cx, cy, r1, r2, start, end);
        group.appendChild(svgEl("path", {
          d,
          fill: colors[ringId],
          class: `radar-quadrant radar-quadrant--${q.id} radar-sector--${ringId}`,
          "data-quadrant": q.id,
          "data-ring": ringId
        }));
      }
      svg.appendChild(group);
    }
    for (const ringId of rings) {
      const r = RING_RADII[ringId].outer * outerRadius;
      if (r >= outerRadius) continue;
      svg.appendChild(svgEl("circle", {
        cx,
        cy,
        r,
        class: `radar-ring-border radar-ring-border--${ringId}`,
        fill: "none"
      }));
    }
    svg.appendChild(svgEl("line", { x1: cx - outerRadius, y1: cy, x2: cx + outerRadius, y2: cy, class: "radar-axis" }));
    svg.appendChild(svgEl("line", { x1: cx, y1: cy - outerRadius, x2: cx, y2: cy + outerRadius, class: "radar-axis" }));
    const labelFontSize = Math.max(7, Math.min(14, outerRadius * 0.044));
    const infoR = labelFontSize * 0.44;
    for (const ringConf of config.rings) {
      const { inner, outer } = RING_RADII[ringConf.id];
      const midRadius = (inner + outer) / 2 * outerRadius;
      for (const xOffset of [midRadius, -midRadius]) {
        const side = xOffset > 0 ? "east" : "west";
        const lx = cx + xOffset;
        const group = svgEl("g", {
          class: `radar-ring-label radar-ring-label--${ringConf.id} radar-ring-label--${side}`,
          "data-ring": ringConf.id,
          role: "button",
          tabindex: "0",
          "aria-label": `${ringConf.label}. Show ring guidance`
        });
        const textHalfW = ringConf.label.length * labelFontSize * 0.36;
        const textCx = lx - infoR;
        const labelText = svgEl("text", {
          x: textCx,
          y: cy,
          "font-size": labelFontSize,
          "text-anchor": "middle",
          "dominant-baseline": "central"
        });
        labelText.textContent = ringConf.label;
        group.appendChild(labelText);
        const ix = textCx + textHalfW + infoR + 2;
        const infoGroup = svgEl("g", { "aria-hidden": "true" });
        infoGroup.appendChild(svgEl("circle", {
          cx: ix,
          cy,
          r: infoR,
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "1.2"
        }));
        const dotR = infoR * 0.14;
        const dotCy = cy - infoR * 0.56;
        const stemW = infoR * 0.2;
        const stemH = infoR * 0.8;
        const stemY = cy - infoR * 0.3;
        infoGroup.appendChild(svgEl("circle", {
          cx: ix,
          cy: dotCy,
          r: dotR,
          fill: "currentColor"
        }));
        infoGroup.appendChild(svgEl("rect", {
          x: ix - stemW / 2,
          y: stemY,
          width: stemW,
          height: stemH,
          fill: "currentColor"
        }));
        group.appendChild(infoGroup);
        svg.appendChild(group);
      }
    }
    for (const blip of blips) {
      svg.appendChild(createBlipElement(blip));
    }
    return svg;
  }
  var BLIP_TRI_UP = "0,-9 -9,8 9,8";
  var BLIP_TRI_DOWN = "0,9 -9,-8 9,-8";
  function createBlipElement(blip) {
    const marker = blip.isNew ? "new" : blip.status === "Moved In" || blip.status === "Moved Out" ? "moved" : "default";
    const g = svgEl("g", {
      class: `radar-blip radar-blip--${blip.ring} radar-blip--${blip.quadrant}`,
      "data-id": blip.id,
      "data-quadrant": blip.quadrant,
      "data-ring": blip.ring,
      "data-name": blip.name,
      "data-marker": marker,
      transform: `translate(${blip.x}, ${blip.y})`,
      role: "button",
      tabindex: "0",
      "aria-label": `${blip.id}. ${blip.name}`
    });
    const r = 5;
    if (marker === "new") {
      g.appendChild(svgEl("polygon", { points: BLIP_TRI_UP, class: "radar-blip__tri radar-blip__tri--new" }));
    } else if (marker === "moved") {
      g.appendChild(svgEl("polygon", { points: BLIP_TRI_DOWN, class: "radar-blip__tri radar-blip__tri--moved" }));
    } else {
      g.appendChild(svgEl("circle", { r, class: "radar-blip__circle radar-blip__circle--default" }));
    }
    return g;
  }

  // src/interaction.ts
  var currentState = { type: "FULL" };
  var listeners = [];
  function getState() {
    return currentState;
  }
  function onStateChange(handler) {
    listeners.push(handler);
  }
  function dispatch(next) {
    currentState = next;
    listeners.forEach((fn) => fn(next));
  }
  var crossSwitchTimeout;
  var quadrantHoverClearTimer = null;
  function setQuadrantHover(body, quadrant) {
    if (quadrantHoverClearTimer !== null) {
      clearTimeout(quadrantHoverClearTimer);
      quadrantHoverClearTimer = null;
    }
    if (body) body.dataset["blipHover"] = quadrant;
  }
  function clearQuadrantHoverDeferred(body) {
    quadrantHoverClearTimer = setTimeout(() => {
      if (body) delete body.dataset["blipHover"];
      quadrantHoverClearTimer = null;
    }, 50);
  }
  function currentPanelSide() {
    const state = getState();
    if (state.type === "FULL") return null;
    return panelSide(state.quadrant);
  }
  function focusQuadrant(quadrant) {
    if (!isNarrowViewport()) {
      const from = currentPanelSide();
      const to = panelSide(quadrant);
      if (from !== null && from !== to) {
        if (crossSwitchTimeout !== void 0) {
          clearTimeout(crossSwitchTimeout);
          crossSwitchTimeout = void 0;
        }
        dispatch({ type: "FULL" });
        crossSwitchTimeout = setTimeout(() => {
          crossSwitchTimeout = void 0;
          dispatch({ type: "FOCUSED", quadrant });
        }, 300);
        return;
      }
    }
    dispatch({ type: "FOCUSED", quadrant });
  }
  function selectBlip(quadrant, blip) {
    const state = getState();
    if (state.type === "BLIP_DETAIL" && state.blip.id === blip.id) return;
    if (!isNarrowViewport()) {
      const from = currentPanelSide();
      const to = panelSide(quadrant);
      if (from !== null && from !== to) {
        if (crossSwitchTimeout !== void 0) {
          clearTimeout(crossSwitchTimeout);
          crossSwitchTimeout = void 0;
        }
        dispatch({ type: "FULL" });
        crossSwitchTimeout = setTimeout(() => {
          crossSwitchTimeout = void 0;
          dispatch({ type: "BLIP_DETAIL", quadrant, blip });
        }, 300);
        return;
      }
    }
    dispatch({ type: "BLIP_DETAIL", quadrant, blip });
  }
  function closeQuadrant() {
    if (crossSwitchTimeout !== void 0) {
      clearTimeout(crossSwitchTimeout);
      crossSwitchTimeout = void 0;
    }
    dispatch({ type: "FULL" });
  }
  var panelCloseFallback;
  function requestCloseRadar(root) {
    if (!isNarrowViewport()) {
      const state = getState();
      if (state.type === "BLIP_DETAIL") {
        focusQuadrant(state.quadrant);
      } else {
        closeQuadrant();
      }
      return;
    }
    if (getState().type === "FULL") return;
    const panel = root.querySelector(".techradar-panel");
    if (!panel || panel.hasAttribute("hidden")) {
      closeQuadrant();
      return;
    }
    if (panel.classList.contains("techradar-panel--closing")) return;
    panel.classList.add("techradar-panel--closing");
    const onAnimEnd = (e) => {
      if (e.animationName !== "panel-mobile-out") return;
      finish();
    };
    const finish = () => {
      if (panelCloseFallback !== void 0) {
        clearTimeout(panelCloseFallback);
        panelCloseFallback = void 0;
      }
      panel.removeEventListener("animationend", onAnimEnd);
      if (!panel.classList.contains("techradar-panel--closing")) return;
      panel.classList.remove("techradar-panel--closing");
      closeQuadrant();
    };
    panel.addEventListener("animationend", onAnimEnd);
    panelCloseFallback = setTimeout(() => {
      panel.removeEventListener("animationend", onAnimEnd);
      finish();
    }, 450);
  }
  function panelSide(quadrant) {
    return quadrant === "techniques" || quadrant === "platforms" ? "left" : "right";
  }
  var NARROW_MAX_PX = 900;
  function isNarrowViewport() {
    return typeof window !== "undefined" && window.innerWidth <= NARROW_MAX_PX;
  }
  function bindEvents(root, blips) {
    var _a, _b;
    const body = root.querySelector(".techradar-body");
    const ringGuideModal = root.querySelector(".techradar-ring-guide__modal");
    const ringGuideTitle = root.querySelector(".techradar-ring-guide__title");
    const ringGuideCopy = root.querySelector(".techradar-ring-guide__item-copy");
    let ringGuideOpener = null;
    const ringGuidance = {
      adopt: {
        title: "Adopt",
        copy: "Proven technologies that we recommend for immediate use wherever they meet project requirements."
      },
      trial: {
        title: "Trial",
        copy: "Emerging technologies worth exploring in projects that allow for experimentation and manageable risks."
      },
      assess: {
        title: "Assess",
        copy: "Promising technologies to monitor and evaluate for future potential. Too early for widespread adoption."
      },
      hold: {
        title: "Hold",
        copy: "Technologies we suggest avoiding for new projects. Continue using them only if they are already in place."
      }
    };
    const openRingGuide = (ring, opener) => {
      var _a2;
      if (!ringGuideModal || !ringGuideTitle || !ringGuideCopy) return;
      const guidance = ringGuidance[ring];
      if (!guidance) return;
      ringGuideTitle.textContent = `${guidance.title} ring`;
      ringGuideCopy.textContent = guidance.copy;
      ringGuideModal.removeAttribute("hidden");
      ringGuideOpener = opener != null ? opener : null;
      (_a2 = ringGuideModal.querySelector(".techradar-ring-guide__close")) == null ? void 0 : _a2.focus();
    };
    const closeRingGuide = () => {
      if (!ringGuideModal || ringGuideModal.hasAttribute("hidden")) return;
      ringGuideModal.setAttribute("hidden", "");
      ringGuideOpener == null ? void 0 : ringGuideOpener.focus();
      ringGuideOpener = null;
    };
    root.querySelectorAll(".radar-ring-label").forEach((labelEl) => {
      const ring = labelEl.dataset["ring"];
      if (!ring) return;
      const activate = () => openRingGuide(ring, labelEl);
      labelEl.addEventListener("click", activate);
      labelEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });
    });
    (_a = root.querySelector(".techradar-ring-guide__close")) == null ? void 0 : _a.addEventListener("click", closeRingGuide);
    ringGuideModal == null ? void 0 : ringGuideModal.addEventListener("click", (e) => {
      if (e.target === ringGuideModal) closeRingGuide();
    });
    root.querySelectorAll("[data-nav-quadrant]").forEach((tab) => {
      tab.addEventListener("click", () => {
        const q = tab.dataset["navQuadrant"];
        if (q === "all") closeQuadrant();
        else focusQuadrant(q);
      });
    });
    root.querySelectorAll(".radar-quadrant-group").forEach((el) => {
      const quadrant = el.dataset["quadrant"];
      el.addEventListener("mouseenter", () => {
        if (isNarrowViewport()) return;
        setQuadrantHover(body, quadrant);
      });
      el.addEventListener("mouseleave", () => {
        clearQuadrantHoverDeferred(body);
      });
    });
    root.querySelectorAll(".radar-blip").forEach((el) => {
      const id = Number(el.dataset["id"]);
      const blip = blips.find((b) => b.id === id);
      if (!blip) return;
      el.addEventListener("mousedown", (e) => {
        e.preventDefault();
      });
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        selectBlip(blip.quadrant, blip);
      });
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }
      });
      el.addEventListener("mouseenter", () => {
        if (isNarrowViewport()) return;
        setQuadrantHover(body, blip.quadrant);
        const existing = document.getElementById("radar-blip-tooltip");
        existing == null ? void 0 : existing.remove();
        const tip = document.createElement("div");
        tip.id = "radar-blip-tooltip";
        tip.className = "radar-blip-tooltip";
        tip.textContent = blip.name;
        tip.style.position = "fixed";
        tip.style.pointerEvents = "none";
        document.body.appendChild(tip);
        const rect = el.getBoundingClientRect();
        tip.style.left = `${rect.left + rect.width / 2}px`;
        tip.style.top = `${rect.top}px`;
        tip.style.transform = "translateX(-50%) translateY(calc(-100% - 6px))";
      });
      el.addEventListener("mouseleave", () => {
        var _a2;
        clearQuadrantHoverDeferred(body);
        (_a2 = document.getElementById("radar-blip-tooltip")) == null ? void 0 : _a2.remove();
      });
    });
    (_b = root.querySelector(".techradar-panel__close")) == null ? void 0 : _b.addEventListener("click", () => requestCloseRadar(root));
    root.querySelectorAll(".radar-corner-label").forEach((el) => {
      const handleActivate = () => {
        const quadrant = el.dataset["quadrant"];
        if (isNarrowViewport()) {
          openCornerModal(root, quadrant);
          return;
        }
        const state = getState();
        const alreadyFocused = (state.type === "FOCUSED" || state.type === "BLIP_DETAIL") && state.quadrant === quadrant;
        if (alreadyFocused) {
          closeQuadrant();
        } else {
          focusQuadrant(quadrant);
        }
      };
      el.addEventListener("click", handleActivate);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      });
    });
    document.addEventListener("keydown", (e) => {
      var _a2;
      if (e.key !== "Escape") return;
      if (ringGuideModal && !ringGuideModal.hasAttribute("hidden")) {
        closeRingGuide();
        e.preventDefault();
        return;
      }
      if (root.querySelector(".radar-corner-modal")) {
        (_a2 = root.querySelector(".radar-corner-modal")) == null ? void 0 : _a2.remove();
        e.preventDefault();
        return;
      }
      requestCloseRadar(root);
    });
  }
  function openCornerModal(root, quadrant) {
    var _a, _b, _c, _d;
    const existing = root.querySelector(".radar-corner-modal");
    existing == null ? void 0 : existing.remove();
    const labelEl = root.querySelector(`.radar-corner-label--${quadrant}`);
    const title = (_b = (_a = labelEl == null ? void 0 : labelEl.querySelector(".radar-corner-label__title")) == null ? void 0 : _a.textContent) != null ? _b : "";
    const desc = (_d = (_c = labelEl == null ? void 0 : labelEl.querySelector(".radar-corner-label__desc")) == null ? void 0 : _c.textContent) != null ? _d : "";
    const modal = document.createElement("div");
    modal.className = "radar-corner-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", title);
    const content = document.createElement("div");
    content.className = "radar-corner-modal__content";
    const closeBtn = document.createElement("button");
    closeBtn.className = "radar-corner-modal__close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "\xD7";
    closeBtn.addEventListener("click", () => modal.remove());
    const h3 = document.createElement("h3");
    h3.className = "radar-corner-modal__title";
    h3.textContent = title;
    const p = document.createElement("p");
    p.className = "radar-corner-modal__desc";
    p.textContent = desc;
    content.appendChild(closeBtn);
    content.appendChild(h3);
    content.appendChild(p);
    modal.appendChild(content);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
    root.appendChild(modal);
    closeBtn.focus();
  }

  // src/search.ts
  function initSearch(root, blips) {
    const input = root.querySelector(".techradar-search__input");
    if (!input) return;
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      applySearch(root, blips, query);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        input.value = "";
        applySearch(root, blips, "");
      }
    });
  }
  function applySearch(root, blips, query) {
    const allBlipEls = root.querySelectorAll(".radar-blip");
    const allListItems = root.querySelectorAll(".techradar-list-item");
    if (!query) {
      allBlipEls.forEach((el) => el.classList.remove("radar-blip--dimmed", "radar-blip--highlighted"));
      allListItems.forEach((el) => el.classList.remove("techradar-list-item--hidden"));
      return;
    }
    const matchingIds = new Set(
      blips.filter(
        (b) => b.name.toLowerCase().includes(query) || b.description.toLowerCase().includes(query)
      ).map((b) => b.id)
    );
    allBlipEls.forEach((el) => {
      const id = Number(el.dataset["id"]);
      if (matchingIds.has(id)) {
        el.classList.add("radar-blip--highlighted");
        el.classList.remove("radar-blip--dimmed");
      } else {
        el.classList.add("radar-blip--dimmed");
        el.classList.remove("radar-blip--highlighted");
      }
    });
    allListItems.forEach((el) => {
      const id = Number(el.dataset["blipId"]);
      el.classList.toggle("techradar-list-item--hidden", !matchingIds.has(id));
    });
  }

  // src/listing.ts
  var RING_ORDER = ["adopt", "trial", "assess", "hold"];
  function renderListing(root, blips, config) {
    var _a, _b;
    const container = root.querySelector(".techradar-listing");
    if (!container) return;
    container.innerHTML = "";
    for (const quadrantConf of config.quadrants) {
      const quadrantBlips = blips.filter((b) => b.quadrant === quadrantConf.id);
      if (quadrantBlips.length === 0) continue;
      const section = document.createElement("section");
      section.className = `techradar-listing-quadrant techradar-listing-quadrant--${quadrantConf.id}`;
      const header = document.createElement("div");
      header.className = "techradar-listing-quadrant__header";
      const heading = document.createElement("h3");
      heading.className = "techradar-listing-quadrant__title";
      heading.textContent = quadrantConf.title;
      header.appendChild(heading);
      if (!isNarrowViewport()) {
        const zoomBtn = document.createElement("button");
        zoomBtn.className = "techradar-listing-quadrant__zoom";
        zoomBtn.setAttribute("aria-label", `Zoom into ${quadrantConf.title}`);
        zoomBtn.textContent = "ZOOM IN";
        zoomBtn.addEventListener("click", () => {
          const radarEl = root.querySelector(".techradar-chart-shell");
          radarEl == null ? void 0 : radarEl.scrollIntoView({ behavior: "smooth", block: "start" });
          focusQuadrant(quadrantConf.id);
        });
        header.appendChild(zoomBtn);
      }
      section.appendChild(header);
      const ringsContainer = document.createElement("div");
      ringsContainer.className = "techradar-listing-quadrant__rings";
      for (const ringId of RING_ORDER) {
        const ringBlips = quadrantBlips.filter((b) => b.ring === ringId);
        if (ringBlips.length === 0) continue;
        const ringLabel = (_b = (_a = config.rings.find((r) => r.id === ringId)) == null ? void 0 : _a.label) != null ? _b : ringId;
        const ringSection = document.createElement("div");
        ringSection.className = `techradar-listing-ring techradar-listing-ring--${ringId}`;
        const ringTitle = document.createElement("span");
        ringTitle.className = `techradar-listing-ring__title techradar-listing-ring__title--${ringId}`;
        ringTitle.textContent = ringLabel;
        ringSection.appendChild(ringTitle);
        const ul = document.createElement("ul");
        ul.className = "techradar-listing-ring__list";
        for (const blip of ringBlips.sort((a, b) => a.name.localeCompare(b.name))) {
          const li = document.createElement("li");
          li.className = "techradar-list-item";
          li.dataset["blipId"] = String(blip.id);
          const btn = document.createElement("button");
          btn.className = "techradar-list-item__btn";
          btn.textContent = `${blip.id}. ${blip.name}`;
          if (blip.isNew) {
            const badge = document.createElement("span");
            badge.className = "techradar-list-item__badge";
            badge.textContent = "New";
            btn.appendChild(badge);
          }
          btn.addEventListener("click", () => {
            if (isNarrowViewport()) {
              selectBlip(blip.quadrant, blip);
            } else {
              const radarEl = root.querySelector(".techradar-chart-shell");
              radarEl == null ? void 0 : radarEl.scrollIntoView({ behavior: "smooth", block: "start" });
              focusQuadrant(blip.quadrant);
              setTimeout(() => selectBlip(blip.quadrant, blip), 400);
            }
          });
          li.appendChild(btn);
          ul.appendChild(li);
        }
        ringSection.appendChild(ul);
        ringsContainer.appendChild(ringSection);
      }
      section.appendChild(ringsContainer);
      container.appendChild(section);
    }
  }

  // src/positioner.ts
  var BLIP_RADIUS = 5;
  var BLIP_VISUAL_MAX = 9;
  var MIN_DISTANCE = 26;
  var MAX_ITERATIONS = 50;
  var AXIS_CLEAR = BLIP_VISUAL_MAX + 18;
  var MIN_RADIUS = Math.ceil(AXIS_CLEAR * Math.SQRT2) + BLIP_RADIUS;
  function seededRandom(seed, index) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    h ^= index * 2654435761;
    return function() {
      h ^= h << 13;
      h ^= h >> 17;
      h ^= h << 5;
      return (h >>> 0) / 4294967296;
    };
  }
  function toCartesian(cx, cy, r, angleDeg) {
    const rad = angleDeg * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function enforceAxisClearance(cx, cy, x, y, q) {
    const signX = q === "techniques" || q === "platforms" ? -1 : 1;
    const signY = q === "techniques" || q === "tools" ? -1 : 1;
    let dx = (x - cx) * signX;
    let dy = (y - cy) * signY;
    if (dx < AXIS_CLEAR) dx = AXIS_CLEAR;
    if (dy < AXIS_CLEAR) dy = AXIS_CLEAR;
    return { x: cx + dx * signX, y: cy + dy * signY };
  }
  function clampToRing(blip, cx, cy, outerRadius) {
    const { inner, outer } = RING_RADII[blip.ring];
    const innerAbs = inner * outerRadius;
    const outerAbs = outer * outerRadius;
    const dx = blip.x - cx;
    const dy = blip.y - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    if (r < 1) return { x: blip.x, y: blip.y };
    const clampedR = Math.max(innerAbs, Math.min(outerAbs, r));
    if (Math.abs(clampedR - r) < 0.5) return { x: blip.x, y: blip.y };
    const scale = clampedR / r;
    return { x: cx + dx * scale, y: cy + dy * scale };
  }
  function positionBlips(blips, dim) {
    const { cx, cy, outerRadius } = dim;
    const positioned = [];
    for (const blip of blips) {
      const rng = seededRandom(blip.name, blip.id);
      const { inner, outer } = RING_RADII[blip.ring];
      const ringInnerAbs = inner === 0 ? MIN_RADIUS : inner * outerRadius + BLIP_VISUAL_MAX;
      const ringOuterAbs = outer * outerRadius - BLIP_VISUAL_MAX;
      const r = ringInnerAbs + rng() * Math.max(0, ringOuterAbs - ringInnerAbs);
      const dynamicMarginDeg = 180 / Math.PI * Math.asin(Math.min(1, AXIS_CLEAR / r));
      const { start, end } = QUADRANT_ANGLES[blip.quadrant];
      const safeRange = end - start - dynamicMarginDeg * 2;
      const angle = start + dynamicMarginDeg + (safeRange > 0 ? rng() * safeRange : 0);
      let { x, y } = toCartesian(cx, cy, r, angle);
      ({ x, y } = enforceAxisClearance(cx, cy, x, y, blip.quadrant));
      positioned.push(__spreadProps(__spreadValues({}, blip), { angle, radius: r, x, y }));
    }
    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      let moved = false;
      for (let i = 0; i < positioned.length; i++) {
        for (let j = i + 1; j < positioned.length; j++) {
          const a = positioned[i];
          const b = positioned[j];
          if (a.quadrant !== b.quadrant) continue;
          const ddx = b.x - a.x;
          const ddy = b.y - a.y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < MIN_DISTANCE && dist > 0) {
            const nx = ddx / dist;
            const ny = ddy / dist;
            const push = (MIN_DISTANCE - dist) / 2;
            positioned[i] = __spreadProps(__spreadValues({}, a), { x: a.x - nx * push, y: a.y - ny * push });
            positioned[j] = __spreadProps(__spreadValues({}, b), { x: b.x + nx * push, y: b.y + ny * push });
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    for (let i = 0; i < positioned.length; i++) {
      const blip = positioned[i];
      const { x, y } = clampToRing(blip, cx, cy, outerRadius);
      if (x !== blip.x || y !== blip.y) {
        positioned[i] = __spreadProps(__spreadValues({}, blip), { x, y });
      }
    }
    for (let i = 0; i < positioned.length; i++) {
      const blip = positioned[i];
      const { x, y } = enforceAxisClearance(cx, cy, blip.x, blip.y, blip.quadrant);
      if (x !== blip.x || y !== blip.y) {
        positioned[i] = __spreadProps(__spreadValues({}, blip), { x, y });
      }
    }
    return positioned;
  }

  // src/index.ts
  var DEFAULT_CONFIG = {
    jsonUrl: "./radar.json",
    contactUrl: "#contact",
    heroTitle: "Test Automation TechRadar",
    allBlipsSectionLabel: "All blips",
    quadrants: [
      { id: "techniques", title: "Techniques", description: "Testing methodologies and approaches used in modern test automation." },
      { id: "platforms", title: "Platforms", description: "Cloud services and infrastructure platforms supporting test automation." },
      { id: "tools", title: "Tools", description: "Software utilities and platforms that support test automation workflows." },
      { id: "languages-and-frameworks", title: "Languages & Frameworks", description: "Programming languages and test frameworks used to build automation solutions." }
    ],
    rings: [
      { id: "adopt", label: "Adopt" },
      { id: "trial", label: "Trial" },
      { id: "assess", label: "Assess" },
      { id: "hold", label: "Hold" }
    ]
  };
  function mergeConfig(override) {
    var _a, _b, _c, _d;
    if (!override) return DEFAULT_CONFIG;
    return __spreadProps(__spreadValues(__spreadValues({}, DEFAULT_CONFIG), override), {
      quadrants: (_a = override.quadrants) != null ? _a : DEFAULT_CONFIG.quadrants,
      rings: (_b = override.rings) != null ? _b : DEFAULT_CONFIG.rings,
      heroTitle: (_c = override.heroTitle) != null ? _c : DEFAULT_CONFIG.heroTitle,
      allBlipsSectionLabel: (_d = override.allBlipsSectionLabel) != null ? _d : DEFAULT_CONFIG.allBlipsSectionLabel
    });
  }
  function syncViewportVars(root) {
    const bar = document.getElementById("wpadminbar");
    const adminBarH = bar && window.getComputedStyle(bar).position === "fixed" ? bar.getBoundingClientRect().height : 0;
    document.documentElement.style.setProperty("--wpadminbar-height", `${adminBarH}px`);
    if (!root) return;
    const shell = root.querySelector(".techradar-chart-shell");
    const legend = root.querySelector(".techradar-blip-legend");
    if (!shell) return;
    const shellDocTop = shell.getBoundingClientRect().top + window.scrollY;
    const legendH = legend ? legend.getBoundingClientRect().height : 0;
    const availH = Math.max(200, window.innerHeight - shellDocTop - legendH);
    document.documentElement.style.setProperty("--radar-available-height", `${availH}px`);
  }
  async function init() {
    var _a, _b;
    syncViewportVars();
    const root = document.getElementById("techradar-root");
    if (!root) return;
    const loader = (_b = (_a = root.parentElement) == null ? void 0 : _a.querySelector(".techradar-loader")) != null ? _b : null;
    const config = mergeConfig(window.TechRadarConfig);
    try {
      const rawBlips = await loadRadarData(config);
      root.classList.add("techradar-root--no-anim");
      root.innerHTML = buildShell(config);
      loader == null ? void 0 : loader.setAttribute("hidden", "");
      syncViewportVars(root);
      const chartEl = root.querySelector(".techradar-chart");
      const dim = buildDimensions(chartEl.clientWidth || 800);
      const blips = positionBlips(rawBlips, dim);
      const svg = createRadarSVG(dim, config, blips);
      chartEl.appendChild(svg);
      renderListing(root, blips, config);
      initSearch(root, blips);
      bindEvents(root, blips);
      onStateChange((state) => {
        applyState(root, state, blips, config, dim);
        updateUrlHash(state);
      });
      const initialHash = window.location.hash.slice(1);
      if (initialHash) {
        const targetBlip = blips.find((b) => slugifyBlipName(b.name) === initialHash);
        if (targetBlip) selectBlip(targetBlip.quadrant, targetBlip);
      }
      window.addEventListener("resize", () => {
        syncViewportVars(root);
        if (getState().type !== "BLIP_DETAIL") return;
        setHtmlScrollLocked(window.innerWidth <= MOBILE_PANEL_MAX_PX);
      }, { passive: true });
      void root.offsetHeight;
      root.classList.remove("techradar-root--no-anim");
      root.classList.add("techradar-root--ready");
    } catch (err) {
      loader == null ? void 0 : loader.setAttribute("hidden", "");
      root.classList.remove("techradar-root--no-anim");
      root.innerHTML = `<div class="techradar-error">
            <p>Could not load radar data. Please try again later.</p>
        </div>`;
      void root.offsetHeight;
      root.classList.add("techradar-root--ready");
    }
  }
  function cornerLabelDotPosition(id) {
    return id === "techniques" || id === "platforms" ? "lead" : "trail";
  }
  function cornerLabelBlock(q) {
    const pos = cornerLabelDotPosition(q.id);
    const heading = pos === "lead" ? `<span class="radar-corner-label__heading radar-corner-label__heading--lead-dot">
            <span class="radar-corner-label__dot" aria-hidden="true"></span>
            <span class="radar-corner-label__title">${escHtml(q.title)}</span>
        </span>` : `<span class="radar-corner-label__heading radar-corner-label__heading--trail-dot">
            <span class="radar-corner-label__title">${escHtml(q.title)}</span>
            <span class="radar-corner-label__dot" aria-hidden="true"></span>
        </span>`;
    return `
        <div class="radar-corner-label radar-corner-label--${q.id}"
             data-quadrant="${q.id}"
             role="button" tabindex="0"
             aria-label="${escHtml(q.title)} quadrant">
            ${heading}
            <span class="radar-corner-label__desc">${escHtml(q.description)}</span>
        </div>`;
  }
  function buildShell(config) {
    const quadrant = (id) => config.quadrants.find((x) => x.id === id);
    const navTabs = [
      `<button type="button" class="techradar-nav__tab techradar-nav__tab--active" data-nav-quadrant="all">All quadrants</button>`,
      ...config.quadrants.map(
        (q) => `<button type="button" class="techradar-nav__tab" data-nav-quadrant="${q.id}">${escHtml(q.title)}</button>`
      )
    ].join("\n            ");
    const techniques = quadrant("techniques");
    const tools = quadrant("tools");
    const platforms = quadrant("platforms");
    const languagesAndFrameworks = quadrant("languages-and-frameworks");
    return `
        <nav class="techradar-nav" aria-label="Radar navigation">
            <div class="techradar-nav__inner">
                <div class="techradar-nav__drawer">
                    ${navTabs}
                </div>
            </div>
        </nav>

        <div class="techradar-main">
            <header class="techradar-page-header">
                <h1 class="techradar-page-header__title">${escHtml(config.heroTitle)}</h1>
            </header>

            <div class="techradar-body">
                <div class="techradar-focused-header" hidden>
                    <h2 class="techradar-focused-header__title"></h2>
                </div>
                <div class="techradar-chart-shell">
                    <div class="radar-labels-row radar-labels-row--top">
                        ${cornerLabelBlock(techniques)}
                        ${cornerLabelBlock(tools)}
                    </div>
                    <div class="techradar-chart-wrap">
                        <div class="techradar-chart" aria-hidden="false"></div>
                    </div>
                    <div class="radar-labels-row radar-labels-row--bottom">
                        ${cornerLabelBlock(platforms)}
                        ${cornerLabelBlock(languagesAndFrameworks)}
                    </div>
                </div>
                <div class="techradar-panel" aria-live="polite" hidden>
                    <div class="techradar-panel__layout">
                        <div class="techradar-panel__head">
                            <button type="button" class="techradar-panel__close" aria-label="Close detail">\xD7</button>
                            <div class="techradar-panel__header" hidden>
                                <p class="techradar-panel__quadrant"></p>
                                <h2 class="techradar-panel__blip-heading"></h2>
                            </div>
                        </div>
                        <div class="techradar-panel__meta" hidden></div>
                        <div class="techradar-panel__scroll">
                            <div class="techradar-panel__content"></div>
                        </div>
                        <button type="button" class="techradar-panel__back" hidden></button>
                    </div>
                </div>
            </div>

            <div class="techradar-blip-legend" aria-label="Meaning of blip markers">
                <span class="techradar-blip-legend__item">
                    <svg class="techradar-blip-legend__icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                        <polygon points="16,7 25,25 7,25" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    </svg>
                    <span class="techradar-blip-legend__text">New</span>
                </span>
                <span class="techradar-blip-legend__item">
                    <svg class="techradar-blip-legend__icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                        <polygon points="16,25 25,7 7,7" fill="currentColor" fill-opacity="0.55" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    </svg>
                    <span class="techradar-blip-legend__text">Moved in/out</span>
                </span>
                <span class="techradar-blip-legend__item">
                    <svg class="techradar-blip-legend__icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                        <circle cx="16" cy="16" r="7" fill="currentColor"/>
                    </svg>
                    <span class="techradar-blip-legend__text">No change</span>
                </span>
            </div>

            <div class="techradar-section-rule">
                <span class="techradar-section-rule__line" aria-hidden="true"></span>
                <h2 id="techradar-all-blips-heading" class="techradar-section-rule__label">${escHtml(config.allBlipsSectionLabel)}</h2>
                <span class="techradar-section-rule__line" aria-hidden="true"></span>
            </div>

            <div id="techradar-ring-guide-modal" class="techradar-ring-guide__modal" role="dialog" aria-modal="true" aria-labelledby="techradar-ring-guide-title" hidden>
                <div class="techradar-ring-guide__content">
                    <button type="button" class="techradar-ring-guide__close" aria-label="Close ring guidance">\xD7</button>
                    <h3 id="techradar-ring-guide-title" class="techradar-ring-guide__title">Ring guidance</h3>
                    <p class="techradar-ring-guide__item-copy"></p>
                </div>
            </div>

            <div class="techradar-search-bar">
                <input type="search" class="techradar-search__input" placeholder="Search blips\u2026" aria-label="Search radar items">
            </div>

            <div class="techradar-listing" aria-labelledby="techradar-all-blips-heading"></div>
        </div>
    `;
  }
  var MOBILE_PANEL_MAX_PX = 900;
  var RING_ORDER2 = ["adopt", "trial", "assess", "hold"];
  var activePanelSide = null;
  var activeFocusedQuadrant = null;
  var closeAnimTimeout;
  var _lockedScrollY = 0;
  var _touchMoveHandler = null;
  function setHtmlScrollLocked(lock) {
    if (lock) {
      window.scrollTo(window.scrollX, window.scrollY);
      _lockedScrollY = window.scrollY;
      document.body.style.top = `-${_lockedScrollY}px`;
      document.documentElement.classList.add("techradar-html-lock");
      if (!_touchMoveHandler) {
        _touchMoveHandler = (e) => {
          var _a;
          const target = e.target;
          if (!((_a = target == null ? void 0 : target.closest) == null ? void 0 : _a.call(target, ".techradar-panel__scroll"))) {
            e.preventDefault();
          }
        };
        document.addEventListener("touchmove", _touchMoveHandler, { passive: false });
      }
    } else {
      document.body.style.top = "";
      document.documentElement.classList.remove("techradar-html-lock");
      window.scrollTo(0, _lockedScrollY);
      _lockedScrollY = 0;
      if (_touchMoveHandler) {
        document.removeEventListener("touchmove", _touchMoveHandler);
        _touchMoveHandler = null;
      }
    }
  }
  function applyState(root, state, blips, config, dim) {
    var _a, _b;
    const body = root.querySelector(".techradar-body");
    const panel = root.querySelector(".techradar-panel");
    const panelMeta = root.querySelector(".techradar-panel__meta");
    const content = root.querySelector(".techradar-panel__content");
    const backBtn = root.querySelector(".techradar-panel__back");
    const panelHeader = root.querySelector(".techradar-panel__header");
    const panelQuadrant = root.querySelector(".techradar-panel__quadrant");
    const panelBlipTitle = root.querySelector(".techradar-panel__blip-heading");
    const focusedHdr = root.querySelector(".techradar-focused-header");
    const svg = root.querySelector(".techradar-svg");
    const allBlips = root.querySelectorAll(".radar-blip");
    const allTabs = root.querySelectorAll("[data-nav-quadrant]");
    svg.setAttribute("viewBox", `0 0 ${dim.size} ${dim.size}`);
    if (closeAnimTimeout !== void 0) {
      clearTimeout(closeAnimTimeout);
      closeAnimTimeout = void 0;
    }
    body.className = "techradar-body";
    if (state.type === "FULL") {
      setHtmlScrollLocked(false);
      panel.classList.remove("techradar-panel--closing");
      panel.setAttribute("hidden", "");
      panelHeader.setAttribute("hidden", "");
      panelMeta.setAttribute("hidden", "");
      focusedHdr.setAttribute("hidden", "");
      backBtn.setAttribute("hidden", "");
      allBlips.forEach((el) => {
        el.classList.remove("radar-blip--dimmed", "radar-blip--selected");
      });
      allTabs.forEach((t) => t.classList.toggle("techradar-nav__tab--active", t.dataset["navQuadrant"] === "all"));
      const closingSide = !isNarrowViewport() ? activePanelSide : null;
      const closingQuadrant = !isNarrowViewport() ? activeFocusedQuadrant : null;
      if (closingSide && closingQuadrant) {
        body.classList.add(
          "techradar-body--focused",
          `techradar-body--focused-${closingQuadrant}`,
          `techradar-body--panel-${closingSide}`,
          "techradar-body--closing"
        );
        closeAnimTimeout = setTimeout(() => {
          body.classList.remove(
            "techradar-body--focused",
            `techradar-body--focused-${closingQuadrant}`,
            `techradar-body--panel-${closingSide}`,
            "techradar-body--closing"
          );
          activePanelSide = null;
          activeFocusedQuadrant = null;
          closeAnimTimeout = void 0;
        }, 480);
      }
    } else if (state.type === "FOCUSED") {
      setHtmlScrollLocked(false);
      const side = panelSide(state.quadrant);
      activePanelSide = side;
      activeFocusedQuadrant = state.quadrant;
      body.classList.add(`techradar-body--focused`, `techradar-body--focused-${state.quadrant}`, `techradar-body--panel-${side}`);
      panel.classList.remove("techradar-panel--closing");
      panel.removeAttribute("hidden");
      focusedHdr.setAttribute("hidden", "");
      panelMeta.setAttribute("hidden", "");
      backBtn.setAttribute("hidden", "");
      const quadrantConfig = config.quadrants.find((q) => q.id === state.quadrant);
      panelQuadrant.textContent = "Quadrant";
      panelBlipTitle.textContent = (_a = quadrantConfig == null ? void 0 : quadrantConfig.title) != null ? _a : state.quadrant;
      panelHeader.removeAttribute("hidden");
      renderFocusedQuadrantBlipList(content, state.quadrant, blips, config);
      allBlips.forEach((el) => {
        const isThisQuadrant = el.dataset["quadrant"] === state.quadrant;
        el.classList.toggle("radar-blip--dimmed", !isThisQuadrant);
        el.classList.remove("radar-blip--selected");
      });
      allTabs.forEach((t) => t.classList.toggle("techradar-nav__tab--active", t.dataset["navQuadrant"] === state.quadrant));
    } else if (state.type === "BLIP_DETAIL") {
      setHtmlScrollLocked(isNarrowViewport());
      if (!isNarrowViewport()) {
        const side = panelSide(state.quadrant);
        activePanelSide = side;
        activeFocusedQuadrant = state.quadrant;
        body.classList.add(`techradar-body--focused`, `techradar-body--focused-${state.quadrant}`, `techradar-body--panel-${side}`);
      }
      panel.classList.remove("techradar-panel--closing");
      panel.removeAttribute("hidden");
      focusedHdr.setAttribute("hidden", "");
      const quadrantConfig = config.quadrants.find((q) => q.id === state.quadrant);
      const quadrantTitle = (_b = quadrantConfig == null ? void 0 : quadrantConfig.title) != null ? _b : state.quadrant;
      panelHeader.removeAttribute("hidden");
      panelQuadrant.textContent = quadrantTitle;
      panelBlipTitle.textContent = `${state.blip.id}. ${state.blip.name}`;
      panelMeta.innerHTML = `
            <span class="techradar-panel__ring techradar-panel__ring--${state.blip.ring}">${escHtml(state.blip.ring)}</span>
            ${state.blip.isNew ? '<span class="techradar-panel__badge">New</span>' : ""}
        `;
      panelMeta.removeAttribute("hidden");
      content.innerHTML = `<div class="techradar-panel__description">${state.blip.description}</div>`;
      const quadrant = state.quadrant;
      backBtn.textContent = `\u2190 Back to ${quadrantTitle}`;
      backBtn.onclick = () => {
        if (isNarrowViewport()) {
          requestCloseRadar(root);
        } else {
          focusQuadrant(quadrant);
        }
      };
      backBtn.removeAttribute("hidden");
      allBlips.forEach((el) => {
        const id = Number(el.dataset["id"]);
        el.classList.toggle("radar-blip--dimmed", el.dataset["quadrant"] !== state.quadrant);
        el.classList.toggle("radar-blip--selected", id === state.blip.id);
      });
      allTabs.forEach((t) => t.classList.toggle("techradar-nav__tab--active", t.dataset["navQuadrant"] === state.quadrant));
    }
  }
  function renderFocusedQuadrantBlipList(content, quadrant, blips, config) {
    var _a, _b;
    const quadrantBlips = blips.filter((b) => b.quadrant === quadrant);
    if (quadrantBlips.length === 0) {
      content.innerHTML = '<p class="techradar-panel__empty">No blips available in this quadrant.</p>';
      return;
    }
    let html = '<div class="techradar-panel__list">';
    for (const ringId of RING_ORDER2) {
      const ringBlips = quadrantBlips.filter((b) => b.ring === ringId).sort((a, b) => a.name.localeCompare(b.name));
      if (ringBlips.length === 0) continue;
      const ringLabel = (_b = (_a = config.rings.find((r) => r.id === ringId)) == null ? void 0 : _a.label) != null ? _b : ringId;
      html += `
            <section class="techradar-panel__list-ring">
                <h3 class="techradar-panel__list-ring-title techradar-panel__list-ring-title--${ringId}">${escHtml(ringLabel)}</h3>
                <ul class="techradar-panel__list-items">
                    ${ringBlips.map((blip) => `
                        <li class="techradar-panel__list-item">
                            <button
                                type="button"
                                class="techradar-panel__list-btn"
                                data-blip-id="${blip.id}"
                                aria-label="Open details for ${escAttr(blip.name)}">
                                ${blip.id}. ${escHtml(blip.name)}
                                ${blip.isNew ? '<span class="techradar-panel__list-badge">New</span>' : ""}
                            </button>
                        </li>
                    `).join("")}
                </ul>
            </section>
        `;
    }
    html += "</div>";
    content.innerHTML = html;
    content.querySelectorAll(".techradar-panel__list-btn").forEach((btn) => {
      const blipId = Number(btn.dataset["blipId"]);
      const blipEl = document.querySelector(`.radar-blip[data-id="${blipId}"]`);
      const emphasize = () => {
        blipEl == null ? void 0 : blipEl.classList.add("radar-blip--panel-hover");
        showBlipTooltip(blipEl);
      };
      const clearEmphasis = () => {
        blipEl == null ? void 0 : blipEl.classList.remove("radar-blip--panel-hover");
        removeBlipTooltip();
      };
      btn.addEventListener("mouseenter", emphasize);
      btn.addEventListener("mouseleave", clearEmphasis);
      btn.addEventListener("focus", emphasize);
      btn.addEventListener("blur", clearEmphasis);
      btn.addEventListener("click", () => {
        const blip = quadrantBlips.find((b) => b.id === blipId);
        if (!blip) return;
        removeBlipTooltip();
        selectBlip(quadrant, blip);
      });
    });
  }
  function showBlipTooltip(blipEl) {
    if (!blipEl) return;
    const name = blipEl.dataset["name"];
    if (!name) return;
    removeBlipTooltip();
    const tip = document.createElement("div");
    tip.id = "radar-blip-tooltip";
    tip.className = "radar-blip-tooltip";
    tip.textContent = name;
    tip.style.position = "fixed";
    tip.style.pointerEvents = "none";
    document.body.appendChild(tip);
    const rect = blipEl.getBoundingClientRect();
    tip.style.left = `${rect.left + rect.width / 2}px`;
    tip.style.top = `${rect.top}px`;
    tip.style.transform = "translateX(-50%) translateY(calc(-100% - 6px))";
  }
  function removeBlipTooltip() {
    var _a;
    (_a = document.getElementById("radar-blip-tooltip")) == null ? void 0 : _a.remove();
  }
  function slugifyBlipName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function updateUrlHash(state) {
    if (state.type === "BLIP_DETAIL") {
      history.replaceState(null, "", `#${slugifyBlipName(state.blip.name)}`);
    } else if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }
  function escHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function escAttr(str) {
    return escHtml(str).replace(/'/g, "&#39;");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
//# sourceMappingURL=radar.js.map
