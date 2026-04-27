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
