// script.js - final version (carousel thumbnails below, sortable table, accordion, lightbox, mobile menu)
document.addEventListener("DOMContentLoaded", () => {
  // year
  const yEl = document.getElementById("year");
  if (yEl) yEl.textContent = new Date().getFullYear();

  // mobile menu
  const toggle = document.querySelector(".mobile-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.hidden = !mobileMenu.hidden;
    });
  }

  /* CAROUSEL with thumbnails under the image */
  (function initCarousel() {
    const track = document.querySelector("[data-carousel]");
    const thumbs = Array.from(document.querySelectorAll(".thumb"));
    if (!track) return;
    const slides = Array.from(track.children);
    let idx = 0;
    const show = (i) => {
      track.style.transform = `translateX(-${i * 100}%)`;
      thumbs.forEach((t) => t.classList.remove("active"));
      thumbs[i]?.classList.add("active");
    };
    // set thumbnail click
    thumbs.forEach((t) => {
      t.addEventListener("click", () => {
        const i = Number(t.dataset.index);
        idx = i;
        show(idx);
      });
    });
    // autoplay
    setInterval(() => {
      idx = (idx + 1) % slides.length;
      show(idx);
    }, 6000);
    // initial state
    show(0);
  })();

  /* SORTABLE TABLE */
  (function sortable() {
    const table = document.getElementById("bands-table");
    if (!table) return;
    const tbody = table.tBodies[0];
    Array.from(table.querySelectorAll("th")).forEach((th, col) => {
      th.addEventListener("click", () => {
        const rows = Array.from(tbody.querySelectorAll("tr"));
        const key = th.dataset.key;
        const isNum = key === "year";
        const dir = th.dataset.dir === "asc" ? -1 : 1;
        rows.sort((a, b) => {
          const A = a.children[col].textContent.trim();
          const B = b.children[col].textContent.trim();
          return isNum
            ? (Number(A) - Number(B)) * dir
            : A.localeCompare(B) * dir;
        });
        th.dataset.dir = th.dataset.dir === "asc" ? "desc" : "asc";
        rows.forEach((r) => tbody.appendChild(r));
      });
    });
  })();

  /* ACCORDIONS */
  document.querySelectorAll(".accordion-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      const panel = btn.nextElementSibling;
      if (panel) panel.hidden = expanded;
    });
  });

  /* LIGHTBOX (works reliably) */
  (function lightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.querySelector(".lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");
    if (!lightbox || !lightboxImg || !closeBtn) return;

    document.querySelectorAll(".lightbox-trigger").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const src = a.getAttribute("href") || a.querySelector("img")?.src;
        lightbox.hidden = false;
        lightbox.setAttribute("aria-hidden", "false");
        lightboxImg.src = src;
        // trap focus on close button for keyboard accessibility
        closeBtn.focus();
      });
    });

    closeBtn.addEventListener("click", () => {
      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
    });

    // click on overlay to close
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImg.src = "";
      }
    });

    // ESC to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) {
        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImg.src = "";
      }
    });
  })();
});
function openPopup(img) {
  document.getElementById("popup-img").src = img.src;
  document.getElementById("popup-overlay").style.display = "flex";
}

function closePopup(event) {
  // prevent closing when clicking on the image itself
  if (event && event.target.classList.contains("popup-img")) return;

  document.getElementById("popup-overlay").style.display = "none";
}
