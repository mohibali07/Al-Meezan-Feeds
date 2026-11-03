(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header blur/shadow on scroll
  const header = document.getElementById("header");
  const onScroll = () =>
    header.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("mobileNav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("hidden") === false;
    btn.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    }),
  );

  // Scroll reveal (once)
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((el) => (reduce ? el.classList.add("in") : io.observe(el)));

  // Animated counters
  const fmt = (n) => n.toLocaleString("en-US");
  const countIO = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target,
          target = +el.dataset.count;
        obs.unobserve(el);
        if (reduce) {
          el.textContent = fmt(target);
          return;
        }
        const start = performance.now(),
          dur = 1400;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 },
  );
  document
    .querySelectorAll("[data-count]")
    .forEach((el) => countIO.observe(el));

  // FAQ accordion
  document.querySelectorAll(".acc button").forEach((b) => {
    b.addEventListener("click", () => {
      const item = b.closest(".acc");
      const open = item.classList.toggle("acc-open");
      b.setAttribute("aria-expanded", open);
    });
  });

  // Quote form (front-end only: connect to your backend, Formspree, or WhatsApp)
  const form = document.getElementById("quoteForm");
  const msg = document.getElementById("formMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.name.value.trim() || !form.phone.value.trim()) {
      msg.textContent = "Please enter your name and phone number.";
      return;
    }
    msg.textContent = "Thank you. Our team will call you during working hours.";
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
