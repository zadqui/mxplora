(() => {
  const { languages: LANGUAGES, sections: SECTIONS, cards: CARDS } = window.APP_DATA;

  const STORAGE_KEYS = {
    section: "mxplora_section",
    favorites: "mxplora_favorites",
    user: "mxplora_user",
    businessAsked: "mxplora_business_asked"
  };

  const state = {
    section: "restaurantes",
    isLoggedIn: false,
    user: null,
    language: "ES",
    favorites: new Set(),
    pendingFavorite: null
  };

  const $ = (id) => document.getElementById(id);

  const els = {
    navbar: $("navbar"),
    navTabs: $("navTabs"),
    compactSearch: $("compactSearch"),
    compactWhere: $("compactWhere"),
    searchBarWrapper: $("searchBarWrapper"),
    searchBar: $("searchBar"),

    actionsGuest: $("actionsGuest"),
    actionsUser: $("actionsUser"),
    btnLogin: $("btnLogin"),
    btnGlobe: $("btnGlobe"),
    userAvatar: $("userAvatar"),
    btnHamburger: $("btnHamburger"),

    langDropdown: $("langDropdown"),
    userDropdown: $("userDropdown"),
    langSubmenu: $("langSubmenu"),

    menuPerfil: $("menuPerfil"),
    menuFavoritos: $("menuFavoritos"),
    menuNegocio: $("menuNegocio"),
    menuIdioma: $("menuIdioma"),
    menuLogout: $("menuLogout"),

    loginModal: $("loginModal"),
    btnModalClose: $("btnModalClose"),

    businessPromptModal: $("businessPromptModal"),
    bpUserName: $("bpUserName"),
    bpQuestion: $("bpQuestion"),
    bpIdSection: $("bpIdSection"),
    bpNegocioId: $("bpNegocioId"),
    bpError: $("bpError"),
    btnBpYes: $("btnBpYes"),
    btnBpNo: $("btnBpNo"),
    btnBpBack: $("btnBpBack"),
    btnBpSubmit: $("btnBpSubmit"),

    favoritosModal: $("favoritosModal"),
    favoritosBody: $("favoritosBody"),
    btnFavoritosClose: $("btnFavoritosClose"),

    negocioModal: $("negocioModal"),
    btnNegocioClose: $("btnNegocioClose"),
    negocioBody: $("negocioBody"),
    negocioSuccess: $("negocioSuccess"),
    negocioId: $("negocioId"),
    negocioError: $("negocioError"),
    btnNegocioSubmit: $("btnNegocioSubmit")
  };

  let isScrollTicking = false;
  let wasScrolled = null;
  let resultsMap = null;
  let resultsMapLayer = null;

  function getGridBySection(section) {
    return $(`grid-${section}`);
  }

  function saveSection() {
    localStorage.setItem(STORAGE_KEYS.section, state.section);
  }

  function saveFavorites() {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([...state.favorites]));
  }

  function saveUser() {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user));
  }

  function loadFavorites() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites));
      if (Array.isArray(stored)) {
        state.favorites = new Set(stored);
      }
    } catch {
      state.favorites = new Set();
    }
  }

  function loadStoredUser() {
    try {
      const storedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.user));
      if (storedUser) {
        state.user = storedUser;
        state.isLoggedIn = true;
      }
    } catch {
      state.user = null;
      state.isLoggedIn = false;
    }
  }

  function restoreSection() {
    const savedSection = localStorage.getItem(STORAGE_KEYS.section);
    const allowedSections = Object.keys(SECTIONS).filter((section) => section !== "fanzone");

    state.section = allowedSections.includes(savedSection)
      ? savedSection
      : "restaurantes";
  }

  function lockBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    document.body.style.overflow = "";
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.remove("hidden");
    lockBodyScroll();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.add("hidden");
    unlockBodyScroll();
  }

  function closeAllDropdowns() {
    els.langDropdown?.classList.add("hidden");
    els.userDropdown?.classList.add("hidden");
    els.langSubmenu?.classList.add("hidden");
  }

  function positionDropdown(dropdown, anchor) {
    if (!dropdown || !anchor) return;
    const rect = anchor.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + 8}px`;
    dropdown.style.right = `${window.innerWidth - rect.right}px`;
    dropdown.style.left = "auto";
  }

  function setLanguage(code) {
    state.language = code;
    closeAllDropdowns();
  }

  function renderLanguageList(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="lang-list">
        ${LANGUAGES.map((lang) => `
          <div class="lang-option ${state.language === lang.code ? "active" : ""}" data-code="${lang.code}">
            <span>${lang.flag} ${lang.name}</span>
            ${state.language === lang.code ? '<span class="lang-check">✓</span>' : ""}
          </div>
        `).join("")}
      </div>
    `;

    container.querySelectorAll(".lang-option").forEach((item) => {
      item.addEventListener("click", () => setLanguage(item.dataset.code));
    });
  }

  function renderSearchBar() {
    const config = SECTIONS[state.section];

    if (!config || !config.searchFields?.length) {
      els.compactWhere.textContent = "Buscar...";
      return;
    }

    els.compactWhere.textContent = config.searchFields[0].label;
  }

  function renderCard(card, index) {
    const isFavorite = state.favorites.has(card.id);

    return `
      <article class="card" style="animation-delay:${index * 0.04}s">
        <div class="card-img-wrapper">
          <img class="card-img" src="${card.img || "img/placeholder.jpg"}" alt="${card.name}" loading="lazy" />
          ${card.badge ? `<div class="card-badge">${card.badge}</div>` : ""}
          <button class="card-favorite" data-id="${card.id}" type="button" title="Guardar">
            ${isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        <div class="card-info">
          <div class="card-row">
            <span class="card-name">${card.homeCardTitle || card.name}</span>
          </div>
          <div class="card-subtitle">${card.homeCardMeta || card.zone || card.subtitle || ""}</div>
          <div class="card-price"><strong>${card.priceLabel || card.price || ""}</strong></div>
        </div>
      </article>
    `;
  }

  function wireRowButtons(grid) {
    grid.querySelectorAll(".row-nav-btn").forEach((button) => {
      const row = $(button.dataset.row);

      if (button.dataset.dir === "-1") {
        button.disabled = true;
      }

      button.addEventListener("click", () => {
        if (!row) return;
        row.scrollBy({
          left: Number(button.dataset.dir) * 580,
          behavior: "smooth"
        });
      });
    });

    grid.querySelectorAll(".cards-row").forEach((row) => {
      const updateArrows = () => {
        const section = row.closest(".cat-section");
        if (!section) return;

        const buttons = section.querySelectorAll(".row-nav-btn");
        const leftBtn = buttons[0];
        const rightBtn = buttons[1];

        if (leftBtn) leftBtn.disabled = row.scrollLeft <= 0;
        if (rightBtn) rightBtn.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
      };

      row.addEventListener("scroll", updateArrows, { passive: true });
      updateArrows();
    });
  }

  function wireImages(grid) {
    grid.querySelectorAll(".card-img").forEach((img) => {
      if (img.complete) {
        img.classList.add("loaded");
      } else {
        img.addEventListener("load", () => img.classList.add("loaded"));
        img.addEventListener("error", () => {
          img.src = "img/placeholder.jpg";
          img.classList.add("loaded");
        });
      }
    });
  }

  function wireFavorites(grid) {
    grid.querySelectorAll(".card-favorite").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleFavorite(button.dataset.id, button);
      });
    });
  }

  function renderCards() {
    const config = SECTIONS[state.section];
    const cards = CARDS[state.section];
    const grid = getGridBySection(state.section);

    if (!grid || !cards) return;

    if (!config.filterKey || config.categories.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Sin contenido</h3>
        </div>
      `;
      return;
    }

    const grouped = {};
    config.categories.forEach((category) => {
      grouped[category.label] = [];
    });

    cards.forEach((card) => {
      const key = card[config.filterKey];
      if (grouped[key]) {
        grouped[key].push(card);
      }
    });

    let html = "";

    config.categories.forEach((category, sectionIndex) => {
      const group = grouped[category.label] || [];
      if (!group.length) return;

      const rowId = `row-${state.section}-${sectionIndex}`;

      html += `
        <section class="cat-section" style="animation-delay:${sectionIndex * 0.07}s">
          <div class="cat-section-header">
            <div class="cat-section-title">
              <span class="cat-section-icon">${category.icon}</span>
              <h2 class="cat-section-name">${category.label}</h2>
              <span class="cat-section-arrow">→</span>
            </div>

            <div class="cat-nav-btns">
              <button class="row-nav-btn" data-row="${rowId}" data-dir="-1" type="button" title="Anterior">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>

              <button class="row-nav-btn" data-row="${rowId}" data-dir="1" type="button" title="Siguiente">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="cards-row" id="${rowId}">
            ${group.map((card, cardIndex) => renderCard(card, cardIndex)).join("")}
          </div>
        </section>
      `;
    });

    grid.innerHTML = html || `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Sin resultados</h3>
      </div>
    `;

    wireRowButtons(grid);
    wireImages(grid);
    wireFavorites(grid);
    wireCategoryClicks(grid);
  }

  function updateActiveTab(section) {
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.section === section);
    });
  }

  function clearActiveSections() {
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.remove("active");
    });
  }

  function switchSection(section) {
    if (section === "fanzone") {
      window.location.href = "fanzone.html";
      return;
    }

    if (!SECTIONS[section]) return;

    clearActiveSections();
    updateActiveTab(section);

    state.section = section;
    saveSection();

    const currentSection = $(`sec-${section}`);
    if (currentSection) {
      currentSection.classList.add("active");
    }
    
    hideSearchResults();
    renderSearchBar();
    buildSearchBar();
    renderCards();
  }

  function updateNavbarOnScroll() {
    if (isScrollTicking) return;

    isScrollTicking = true;

    requestAnimationFrame(() => {
      const triggerPoint = 64;
      const scrollY = window.scrollY;
      const scrolled = scrollY > triggerPoint;

      if (scrolled !== wasScrolled) {
        wasScrolled = scrolled;
        els.navbar.classList.toggle("scrolled", scrolled);
      }

      isScrollTicking = false;
    });
  }

  function toggleFavorite(id, button) {
    if (!state.isLoggedIn) {
      state.pendingFavorite = id;
      openModal(els.loginModal);
      return;
    }

    if (state.favorites.has(id)) {
      state.favorites.delete(id);
      if (button) button.textContent = "🤍";
    } else {
      state.favorites.add(id);
      if (button) button.textContent = "❤️";
    }

    saveFavorites();
  }

  function applyPendingFavorite() {
    if (!state.pendingFavorite) return;

    state.favorites.add(state.pendingFavorite);

    const button = document.querySelector(`.card-favorite[data-id="${state.pendingFavorite}"]`);
    if (button) {
      button.textContent = "❤️";
    }

    saveFavorites();
    state.pendingFavorite = null;
  }

  function updateAuthUI() {
    if (state.isLoggedIn && state.user) {
      els.actionsGuest.classList.add("hidden");
      els.actionsUser.classList.remove("hidden");

      els.userAvatar.src =
        state.user.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(state.user.email)}`;
      els.userAvatar.alt = state.user.name || "Perfil";
    } else {
      els.actionsGuest.classList.remove("hidden");
      els.actionsUser.classList.add("hidden");
      els.userAvatar.src = "";
    }
  }

  function doLogin(email, name, avatar, skipBusinessPrompt = false) {
    state.isLoggedIn = true;
    state.user = { email, name, avatar };

    saveUser();
    updateAuthUI();
    closeModal(els.loginModal);

    applyPendingFavorite();

    const asked = localStorage.getItem(STORAGE_KEYS.businessAsked);

    if (!skipBusinessPrompt && !asked) {
      localStorage.setItem(STORAGE_KEYS.businessAsked, "1");
      showBusinessPromptModal(name);
    }
  }

  function doLogout() {
    state.isLoggedIn = false;
    state.user = null;
    state.favorites.clear();

    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.favorites);
    localStorage.removeItem(STORAGE_KEYS.businessAsked);

    updateAuthUI();
    closeAllDropdowns();
    renderCards();
  }

  function showBusinessPromptModal(name) {
    els.bpUserName.textContent = name;
    els.bpQuestion.classList.remove("hidden");
    els.bpIdSection.classList.add("hidden");
    els.bpNegocioId.value = "";
    els.bpError.classList.add("hidden");
    openModal(els.businessPromptModal);
  }

  function hideBusinessPromptModal() {
    closeModal(els.businessPromptModal);
  }

  function showFavoritosModal() {
    closeAllDropdowns();

    const allCards = Object.values(CARDS).flat();
    const favoriteCards = allCards.filter((card) => state.favorites.has(card.id));

    if (!favoriteCards.length) {
      els.favoritosBody.innerHTML = `
        <div class="empty-state" style="padding:40px 0;">
          <div class="empty-icon">🤍</div>
          <h3>Sin favoritos aún</h3>
          <p>Guarda lugares que te interesen y aparecerán aquí.</p>
        </div>
      `;
    } else {
      els.favoritosBody.innerHTML = `
        <div class="favorites-grid">
          ${favoriteCards.map((card) => `
            <article class="card">
              <div class="card-img-wrapper">
                <img class="card-img loaded" src="${card.img || "img/placeholder.jpg"}" alt="${card.name}" loading="lazy" />
                <button class="card-favorite fav-modal" data-id="${card.id}" type="button" title="Quitar">❤️</button>
              </div>

              <div class="card-info">
                <div class="card-row">
                  <span class="card-name">${card.name}</span>
                  <span class="card-rating">⭐ ${card.rating}</span>
                </div>
                <div class="card-subtitle">${card.subtitle}</div>
                <div class="card-price"><strong>${card.price}</strong></div>
              </div>
            </article>
          `).join("")}
        </div>
      `;

      els.favoritosBody.querySelectorAll(".fav-modal").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();

          state.favorites.delete(button.dataset.id);
          saveFavorites();

          const mainButton = document.querySelector(`.card-favorite[data-id="${button.dataset.id}"]`);
          if (mainButton) mainButton.textContent = "🤍";

          showFavoritosModal();
        });
      });
    }

    openModal(els.favoritosModal);
  }

  function hideFavoritosModal() {
    closeModal(els.favoritosModal);
  }

  function showNegocioModal() {
    closeAllDropdowns();
    if (els.negocioBody) els.negocioBody.classList.remove("hidden");
    if (els.negocioSuccess) els.negocioSuccess.classList.add("hidden");
    if (els.negocioError) els.negocioError.classList.add("hidden");
    if (els.negocioId) els.negocioId.value = "";
    openModal(els.negocioModal);
  }

  function hideNegocioModal() {
    closeModal(els.negocioModal);
  }

  function submitNegocio() {
    const id = els.negocioId?.value?.trim() || "";

    if (!id || id.length < 6) {
      els.negocioError.textContent = "El ID debe tener al menos 6 caracteres";
      els.negocioError.classList.remove("hidden");
      return;
    }

    els.negocioError.classList.add("hidden");
    if (els.negocioBody) els.negocioBody.classList.add("hidden");
    if (els.negocioSuccess) els.negocioSuccess.classList.remove("hidden");
  }

  function toggleLangDropdown() {
    const willOpen = els.langDropdown.classList.contains("hidden");
    closeAllDropdowns();

    if (willOpen) {
      renderLanguageList(els.langDropdown);
      positionDropdown(els.langDropdown, els.btnGlobe);
      els.langDropdown.classList.remove("hidden");
    }
  }

  function toggleUserDropdown() {
    const willOpen = els.userDropdown.classList.contains("hidden");
    closeAllDropdowns();

    if (willOpen) {
      positionDropdown(els.userDropdown, els.userAvatar);
      els.userDropdown.classList.remove("hidden");
    }
  }

  function closeOverlaysOnEscape(event) {
    if (event.key !== "Escape") return;

    closeModal(els.loginModal);
    closeModal(els.negocioModal);
    closeModal(els.businessPromptModal);
    closeModal(els.favoritosModal);
    closeAllDropdowns();

    if (typeof closeProfilePanel === "function") {
      closeProfilePanel();
    }
  }

  function closeDropdownsOnOutsideClick(event) {
    const dropdowns = [els.langDropdown, els.userDropdown].filter(Boolean);
    const triggers = [els.btnGlobe, els.btnHamburger, els.userAvatar].filter(Boolean);

    const clickedInsideDropdown = dropdowns.some((dropdown) => dropdown.contains(event.target));
    const clickedTrigger = triggers.some((trigger) => trigger === event.target || trigger.contains(event.target));

    if (!clickedInsideDropdown && !clickedTrigger) {
      closeAllDropdowns();
    }
  }

  function initTabEvents() {
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchSection(tab.dataset.section));
    });
  }

  function initModalEvents() {
    els.btnLogin?.addEventListener("click", () => {
      openModal(els.loginModal);
      initGoogleAuth();
    });

    els.btnModalClose?.addEventListener("click", () => closeModal(els.loginModal));

    els.loginModal?.addEventListener("click", (event) => {
      if (event.target === els.loginModal) closeModal(els.loginModal);
    });

    els.btnFavoritosClose?.addEventListener("click", hideFavoritosModal);
    els.favoritosModal?.addEventListener("click", (event) => {
      if (event.target === els.favoritosModal) hideFavoritosModal();
    });

    els.btnNegocioClose?.addEventListener("click", hideNegocioModal);
    els.negocioModal?.addEventListener("click", (event) => {
      if (event.target === els.negocioModal) hideNegocioModal();
    });

    els.btnNegocioSubmit?.addEventListener("click", submitNegocio);

    els.btnBpYes?.addEventListener("click", () => {
      els.bpQuestion.classList.add("hidden");
      els.bpIdSection.classList.remove("hidden");
    });

    els.btnBpNo?.addEventListener("click", () => {
      hideBusinessPromptModal();
    });

    els.btnBpBack?.addEventListener("click", () => {
      els.bpIdSection.classList.add("hidden");
      els.bpQuestion.classList.remove("hidden");
      els.bpError.classList.add("hidden");
      els.bpNegocioId.value = "";
    });

    els.btnBpSubmit?.addEventListener("click", () => {
      const id = els.bpNegocioId.value.trim();

      if (id.length < 6) {
        els.bpError.classList.remove("hidden");
        return;
      }

      els.bpError.classList.add("hidden");
      hideBusinessPromptModal();
    });

    els.businessPromptModal?.addEventListener("click", (event) => {
      if (event.target === els.businessPromptModal) {
        hideBusinessPromptModal();
      }
    });
  }

  function initDropdownEvents() {
    els.btnGlobe?.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLangDropdown();
    });

    els.userAvatar?.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleUserDropdown();
    });

    els.menuPerfil?.addEventListener("click", () => {
      closeAllDropdowns();
    });

    els.menuFavoritos?.addEventListener("click", showFavoritosModal);

    els.menuIdioma?.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = !els.langSubmenu.classList.contains("hidden");
      els.langSubmenu.classList.toggle("hidden", isOpen);

      if (!isOpen) {
        renderLanguageList(els.langSubmenu);
      }
    });

    els.menuLogout?.addEventListener("click", doLogout);
  }

  function initGlobalEvents() {
    window.addEventListener("scroll", updateNavbarOnScroll, { passive: true });
    window.addEventListener("resize", closeAllDropdowns);
    document.addEventListener("click", closeDropdownsOnOutsideClick);
    document.addEventListener("keydown", closeOverlaysOnEscape);
  }

  function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
  }

  function handleGoogleLogin(response) {
    const data = parseJwt(response.credential);

    const email = data.email || "";
    const firstName = data.given_name || "";
    const lastName = data.family_name || "";
    const avatar = data.picture || "";
    const fullName = `${firstName} ${lastName}`.trim();

    doLogin(email, fullName || "Usuario", avatar);

    state.user.firstName = firstName;
    state.user.lastName = lastName;
    state.user.customAvatar = avatar;

    saveUser();

    const existingProfile = JSON.parse(localStorage.getItem("mxploraProfile") || "{}");

    localStorage.setItem("mxploraProfile", JSON.stringify({
      ...existingProfile,
      firstName: existingProfile.firstName || firstName,
      lastName: existingProfile.lastName || lastName,
      email,
      googlePhoto: avatar,
      birthDate: existingProfile.birthDate || "",
      customPhoto: existingProfile.customPhoto || ""
    }));
  }

  function initGoogleAuth(retryCount = 0) {
    const googleBtn = document.getElementById("googleBtn");
    if (!googleBtn) return;

    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      if (retryCount < 20) {
        setTimeout(() => initGoogleAuth(retryCount + 1), 250);
      }
      return;
    }

    if (googleBtn.dataset.rendered === "true") return;

    window.google.accounts.id.initialize({
      client_id: "279291234936-pc5j91l4mrahdsmrsdrsi34m434ds1l1.apps.googleusercontent.com",
      callback: handleGoogleLogin,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    googleBtn.innerHTML = "";

    window.google.accounts.id.renderButton(googleBtn, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
      width: 360
    });

    googleBtn.dataset.rendered = "true";
  }

  function normalizeText(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/_/g, " ")
      .trim();
  }

  const SEARCH_INTENT_MAP = {
    restaurantes: {
      mexicana: ["mexicana", "tacos", "antojitos", "pozole", "mole", "quesadillas"],
      italiana: ["italiana", "pizza", "pasta", "lasana"],
      "comida rápida": ["comida rapida", "hamburguesas", "burger", "papas", "fast food"],
      japonesa: ["japonesa", "sushi", "ramen", "nigiri"],
      saludable: ["saludable", "fit", "healthy", "ensaladas"],
      snacks: ["snacks", "botanas", "antojitos ligeros"],
      bebidas: ["bebidas", "cafe", "coffee", "te", "matcha"],
      postres: ["postres", "helado", "pastel", "pay", "cake"],
      internacional: ["internacional", "peruana", "espanola", "fusion"],
      otros: ["otros"]
    },

    hoteles: {
      "casa completa": ["casa completa", "casa", "entera"],
      departamento: ["departamento", "depa", "apartamento"],
      habitación: ["habitacion", "cuarto", "room"]
    },

    bazares: {
      arte: ["arte", "galeria", "cuadros"],
      libros: ["libros", "libreria"],
      peluches: ["peluches", "peluche"],
      ropa: ["ropa", "moda", "outfits"],
      accesorios: ["accesorios", "joyeria", "aretes"],
      artesanias: ["artesanias", "souvenirs", "hecho a mano"],
      productos_caseros: ["productos caseros", "hecho en casa", "casero"],
      otros: ["otros"]
    }
  };

  function resolveSearchIntent(section, query) {
    const normalizedQuery = normalizeText(query);
    const sectionMap = SEARCH_INTENT_MAP[section] || {};

    for (const [category, aliases] of Object.entries(sectionMap)) {
      if (aliases.some((alias) => normalizedQuery.includes(normalizeText(alias)))) {
        return category;
      }
    }

    return null;
  }

  function getSearchResults(section, query) {
    const cards = CARDS[section] || [];
    const normalizedQuery = normalizeText(query);
    const intentCategory = resolveSearchIntent(section, query);
    const filterKey = SECTIONS[section]?.filterKey || "type";

    return cards.filter((card) => {
      const searchable = [
        card.name,
        card.subtitle,
        card[filterKey],
        ...(card.keywords || []),
        ...(card.searchTags || []),
        card.zone,
        card.featuredLabel
      ]
        .map(normalizeText)
        .join(" ");

      const categoryMatch = intentCategory
        ? normalizeText(card[filterKey]) === normalizeText(intentCategory)
        : false;

      const directMatch = searchable.includes(normalizedQuery);

      return categoryMatch || directMatch;
    });
  }

  function renderResultsMap(results) {
    const mapEl = $("resultsMap");
    const zoneEl = $("resultsMapZone");

    if (!mapEl) return;

    if (!results.length) {
      mapEl.innerHTML = "";
      if (zoneEl) zoneEl.textContent = "Sin zonas disponibles";
      return;
    }

    const first = results.find((item) => item.lat && item.lng);
    if (!first) {
      mapEl.innerHTML = "<div class='empty-state'><h3>Faltan coordenadas para mostrar el mapa</h3></div>";
      return;
    }

    if (!resultsMap) {
      resultsMap = L.map("resultsMap", {
        zoomControl: true,
        scrollWheelZoom: false,
        dragging: true,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        tap: false
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap"
      }).addTo(resultsMap);
    }

    if (resultsMapLayer) {
      resultsMapLayer.clearLayers();
    }

    resultsMapLayer = L.layerGroup().addTo(resultsMap);

    const bounds = [];

    results.forEach((item) => {
      if (!item.lat || !item.lng) return;

      const marker = L.marker([item.lat, item.lng], { riseOnHover: false })
        .bindPopup(`
          <strong>${item.name}</strong><br>
          ${item.zone || item.subtitle || ""}<br>
          ${item.priceLabel || item.price || ""}
        `);

      marker.addTo(resultsMapLayer);
      bounds.push([item.lat, item.lng]);
    });

    if (bounds.length === 1) {
      resultsMap.setView(bounds[0], 13, { animate: false });
    } else {
      resultsMap.fitBounds(bounds, {
        padding: [24, 24],
        animate: false
      });
    }

    if (zoneEl) {
      const zones = [...new Set(results.map((r) => r.zone).filter(Boolean))];
      zoneEl.textContent = zones.join(" · ");
    }

    setTimeout(() => {
      resultsMap.invalidateSize();
    }, 60);
  }

function showSearchResults(section, query, customResults = null, customTitle = null) {
  const shell = $("searchResultsShell");
  const grid = $("searchResultsGrid");
  const title = $("resultsTitle");
  const meta = $("resultsMeta");
  const mainContent = $("mainContent");

  if (!shell || !grid || !title || !meta || !mainContent) return;

  const results = Array.isArray(customResults)
    ? customResults
    : getSearchResults(section, query);

  title.textContent = customTitle || `Resultados para "${query}"`;
  meta.textContent = `${results.length} resultado${results.length === 1 ? "" : "s"}`;

  if (!results.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Sin resultados</h3>
        <p>No encontramos coincidencias para tu búsqueda.</p>
      </div>
    `;
  } else {
    grid.innerHTML = results
      .map(
        (card, index) => `
          <article class="card result-card-item" data-id="${card.id}" style="animation-delay:${index * 0.04}s">
            <div class="card-img-wrapper">
              <img class="card-img loaded" src="${card.img || "img/placeholder.jpg"}" alt="${card.name}" loading="lazy" />
              ${card.badge ? `<div class="card-badge">${card.badge}</div>` : ""}
              <button class="card-favorite" data-id="${card.id}" type="button" title="Guardar">
                ${state.favorites.has(card.id) ? "❤️" : "🤍"}
              </button>
            </div>

            <div class="card-info">
              <div class="card-row">
                <span class="card-name">${card.homeCardTitle || card.name}</span>
              </div>
              <div class="card-subtitle">${card.homeCardMeta || card.zone || card.subtitle || ""}</div>
              <div class="card-price"><strong>${card.priceLabel || card.price || ""}</strong></div>
            </div>
          </article>
        `
      )
      .join("");

    wireFavorites(grid);
    wireImages(grid);
  }

  renderResultsMap(results);

  mainContent.classList.add("hidden");
  shell.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function hideSearchResults() {
  const shell = $("searchResultsShell");
  const mainContent = $("mainContent");

  if (!shell || !mainContent) return;

  shell.classList.add("hidden");
  mainContent.classList.remove("hidden");
}

function showCategoryResults(section, categoryLabel) {
  const cards = CARDS[section] || [];
  const filterKey = SECTIONS[section]?.filterKey || "type";

  const results = cards.filter((card) => card[filterKey] === categoryLabel);

  showSearchResults(
    section,
    categoryLabel,
    results,
    `${categoryLabel}`
  );
}

function wireCategoryClicks(grid) {
  grid.querySelectorAll(".cat-section-title").forEach((titleEl) => {
    titleEl.addEventListener("click", () => {
      const categoryName = titleEl.querySelector(".cat-section-name")?.textContent?.trim();
      if (!categoryName) return;

      showCategoryResults(state.section, categoryName);
    });
  });
}

function buildSearchBar() {
  if (!els.searchBar) return;

  const config = SECTIONS[state.section];
  if (!config?.searchFields?.length) {
    els.searchBar.innerHTML = "";
    return;
  }

  const label = config.searchFields[0].label;
  const placeholder = config.searchFields[0].placeholder || "Buscar...";

  els.searchBar.innerHTML = `
    <div class="search-field">
      <span class="search-label">${label}</span>
      <input
        class="search-input"
        id="compactSearchInput"
        type="text"
        placeholder="${placeholder}"
        autocomplete="off"
      />
    </div>

    <button class="search-btn" id="searchBtn" type="button" aria-label="Buscar">
      <svg viewBox="0 0 32 32">
        <path d="M13 0C5.832 0 0 5.832 0 13s5.832 13 13 13c3.09 0 5.924-1.082 8.14-2.87l7.367 7.368 1.414-1.414-7.367-7.367C24.918 18.924 26 16.09 26 13 26 5.832 20.168 0 13 0zm0 2c6.065 0 11 4.935 11 11s-4.935 11-11 11S2 19.065 2 13 6.935 2 13 2z"/>
      </svg>
    </button>
  `;

  const input = $("compactSearchInput");
  const btn = $("searchBtn");

  btn?.addEventListener("click", runMainSearch);
  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runMainSearch();
    }
  });
}

function runMainSearch() {
  const input = $("compactSearchInput");
  const query = input?.value?.trim() || "";

  if (!query) return;

  showSearchResults(state.section, query);
}

  function init() {
    loadStoredUser();
    loadFavorites();
    restoreSection();
    updateAuthUI();

    initTabEvents();
    initModalEvents();
    initDropdownEvents();
    initGlobalEvents();

    $("btnBackToResults")?.addEventListener("click", hideSearchResults);

    switchSection(state.section);
    updateNavbarOnScroll();
    initGoogleAuth();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

function getStoredProfile() {
  const authUser = JSON.parse(localStorage.getItem("mxplora_user") || "{}");
  const profile = JSON.parse(localStorage.getItem("mxploraProfile") || "{}");

  return {
    firstName: profile.firstName || authUser.firstName || "",
    lastName: profile.lastName || authUser.lastName || "",
    email: authUser.email || profile.email || "",
    birthDate: profile.birthDate || "",
    googlePhoto: authUser.avatar || profile.googlePhoto || "",
    customPhoto: profile.customPhoto || ""
  };
}

function openProfilePanel() {
  const overlay = document.getElementById("profilePanelOverlay");
  if (!overlay) return;

  loadProfileData();
  setProfileEditable(false);
  overlay.classList.remove("hidden");
}

function closeProfilePanel() {
  const overlay = document.getElementById("profilePanelOverlay");
  if (!overlay) return;
  overlay.classList.add("hidden");
}

function setProfileEditable(editable) {
  ["firstName", "lastName", "birthDate"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = !editable;
  });

  const imageInput = document.getElementById("profileImageInput");
  if (imageInput) imageInput.disabled = !editable;

  const editBtn = document.getElementById("editProfileBtn");
  const saveBtn = document.getElementById("saveProfileBtn");

  if (editBtn) editBtn.classList.toggle("hidden", editable);
  if (saveBtn) saveBtn.classList.toggle("hidden", !editable);
}

function loadProfileData() {
  const profile = getStoredProfile();

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const birthDate = document.getElementById("birthDate");
  const profileImagePreview = document.getElementById("profileImagePreview");

  if (firstName) firstName.value = profile.firstName;
  if (lastName) lastName.value = profile.lastName;
  if (email) email.value = profile.email;
  if (birthDate) birthDate.value = profile.birthDate;

  if (profileImagePreview) {
    profileImagePreview.src =
      profile.customPhoto ||
      profile.googlePhoto ||
      "img/default-avatar.png";
  }
}

function saveProfileData() {
  const authUser = JSON.parse(localStorage.getItem("mxplora_user") || "{}");
  const existingProfile = JSON.parse(localStorage.getItem("mxploraProfile") || "{}");

  const updatedProfile = {
    ...existingProfile,
    firstName: document.getElementById("firstName")?.value?.trim() || "",
    lastName: document.getElementById("lastName")?.value?.trim() || "",
    birthDate: document.getElementById("birthDate")?.value || "",
    email: authUser.email || existingProfile.email || "",
    googlePhoto: authUser.avatar || existingProfile.googlePhoto || ""
  };

  localStorage.setItem("mxploraProfile", JSON.stringify(updatedProfile));

  setProfileEditable(false);
  closeProfilePanel();
}

document.getElementById("editProfileBtn")?.addEventListener("click", () => {
  setProfileEditable(true);
});

document.getElementById("saveProfileBtn")?.addEventListener("click", () => {
  saveProfileData();
});

document.getElementById("profileImageInput")?.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    const existingProfile = JSON.parse(localStorage.getItem("mxploraProfile") || "{}");
    existingProfile.customPhoto = reader.result;
    localStorage.setItem("mxploraProfile", JSON.stringify(existingProfile));

    const preview = document.getElementById("profileImagePreview");
    if (preview) preview.src = reader.result;
  };

  reader.readAsDataURL(file);
});