const header = document.querySelector(".site-header");
const navToggle = document.querySelector("[data-nav-toggle]");

if (header && navToggle) {
  const menuId = navToggle.getAttribute("aria-controls");
  const navMenu = menuId ? document.getElementById(menuId) : null;
  const mobileQuery = window.matchMedia("(max-width: 760px)");

  if (navMenu) {
    const setMenuState = (isOpen) => {
      navMenu.hidden = !isOpen;
      header.classList.toggle("is-nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    };

    const syncMenuState = () => {
      if (mobileQuery.matches) {
        setMenuState(false);
      } else {
        navMenu.hidden = false;
        header.classList.remove("is-nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      }
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileQuery.matches) {
          setMenuState(false);
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setMenuState(false);
        navToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!mobileQuery.matches || navToggle.getAttribute("aria-expanded") !== "true") {
        return;
      }

      if (!header.contains(event.target)) {
        setMenuState(false);
      }
    });

    mobileQuery.addEventListener("change", syncMenuState);
    syncMenuState();
  }
}

(() => {
  const initMobileShopCta = () => {
    const body = document.body;

    if (!body || body.classList.contains("page-shop") || document.querySelector(".mobile-shop-cta")) {
      return;
    }

    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const bar = document.createElement("nav");
    bar.className = "mobile-shop-cta";
    bar.setAttribute("aria-label", "Shop and visit");
    bar.innerHTML = `
      <a class="mobile-shop-cta__primary" href="shop.html">Shop Online</a>
      <a class="mobile-shop-cta__secondary" href="contact.html">Visit Store</a>
    `;

    body.appendChild(bar);
    body.classList.add("has-mobile-shop-cta");

    let ticking = false;

    const syncViewportOffset = () => {
      const visualViewport = window.visualViewport;
      let bottomOffset = 0;

      if (visualViewport) {
        bottomOffset = Math.max(0, window.innerHeight - visualViewport.height - visualViewport.offsetTop);
      }

      document.documentElement.style.setProperty("--mobile-shop-cta-bottom", `${Math.round(bottomOffset)}px`);
    };

    const syncBar = () => {
      const navIsOpen = header && header.classList.contains("is-nav-open");

      syncViewportOffset();
      bar.classList.toggle(
        "is-visible",
        mobileQuery.matches && window.scrollY > 260 && !navIsOpen
      );
      ticking = false;
    };

    const requestSync = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(syncBar);
    };

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    window.addEventListener("orientationchange", requestSync);

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", requestSync);
    } else {
      mobileQuery.addListener(requestSync);
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", requestSync);
      window.visualViewport.addEventListener("scroll", requestSync);
    }

    if (header) {
      const observer = new MutationObserver(requestSync);
      observer.observe(header, { attributes: true, attributeFilter: ["class"] });
    }

    requestSync();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileShopCta, { once: true });
  } else {
    initMobileShopCta();
  }
})();
