function showToast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return !!ok;
  } catch (e) {
    return false;
  }
}

function showCopyPopover(target) {
  try {
    const pop = document.createElement('div');
    pop.className = 'copy-popover';
    pop.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"></path></svg><span>Скопійовано!</span>';
    document.body.appendChild(pop);
    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const width = pop.offsetWidth;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      let left = rect.left + rect.width / 2 - width / 2 + scrollX;
      left = Math.max(scrollX + 8, Math.min(left, scrollX + vw - width - 8));
      const top = rect.bottom + 15 + scrollY;
      pop.style.left = left + 'px';
      pop.style.top = top + 'px';
      pop.classList.add('show');
    });
    const remove = () => {
      pop.classList.remove('show');
      setTimeout(() => { try { pop.remove(); } catch {} }, 300);
      document.removeEventListener('click', onDocClick, true);
    };
    const timer = setTimeout(remove, 3000);
    const onDocClick = (e) => {
      if (!pop.contains(e.target)) { clearTimeout(timer); remove(); }
    };
    document.addEventListener('click', onDocClick, true);
  } catch {}
}

// Global error handlers to surface JS issues
window.addEventListener('error', (e) => {
  try { console.error('Global error:', e.error || e.message || e); } catch {}
  showToast('Сталася помилка скрипту');
});
window.addEventListener('unhandledrejection', (e) => {
  try { console.error('Unhandled rejection:', e.reason || e); } catch {}
  showToast('Сталася помилка мережі/скрипту');
});

async function fetchJar() {
  try {
    const savedEl = document.getElementById('jar-saved');
    const goalEl = document.getElementById('jar-goal');
    // Якщо елементи відсутні (видалені зі шапки), пропускаємо будь-які запити
    if (!savedEl || !goalEl) return;
    const res = await fetch('/api/jar');
    const data = await res.json();
    const fmt = (n) => new Intl.NumberFormat('uk-UA').format(n) + ' ₴';
    if (data && typeof data.saved === 'number' && typeof data.goal === 'number' && data.goal > 0) {
      savedEl.textContent = fmt(data.saved);
      goalEl.textContent = fmt(data.goal);
    } else {
      try {
        const res2 = await fetch('monobank.json');
        const alt = await res2.json();
        if (alt && typeof alt.saved === 'number' && typeof alt.goal === 'number' && alt.goal > 0) {
          savedEl.textContent = fmt(alt.saved);
          goalEl.textContent = fmt(alt.goal);
        } else {
          savedEl.textContent = '—';
          goalEl.textContent = '—';
        }
      } catch {
        savedEl.textContent = '—';
        goalEl.textContent = '—';
      }
    }
  } catch (e) {
    console.error('Failed to fetch jar data', e);
  }
}

async function initHeroCarousel() {
  const wrap = document.getElementById('hero-carousel');
  if (!wrap) return;
  try {
    let images = Array.isArray(window.__HERO_IMAGES) ? window.__HERO_IMAGES : [];
    if (!images.length) {
      try {
        const res = await fetch('hero-images.json');
        const data = await res.json();
        images = Array.isArray(data && data.images) ? data.images : [];
      } catch {}
    }
    if (!images.length) { return; }
    wrap.innerHTML = '';
    images.forEach((src, idx) => {
      const slide = document.createElement('div');
      slide.className = 'slide' + (idx === 0 ? ' active' : '');
      const img = document.createElement('img');
      img.src = src;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = 'Hero image ' + (idx + 1);
      slide.appendChild(img);
      wrap.appendChild(slide);
    });
    let current = 0;
    const slides = Array.from(wrap.children);

    let indicators = document.querySelector('.carousel-indicators');
    if (!indicators) {
      indicators = document.createElement('div');
      indicators.className = 'carousel-indicators';
      wrap.appendChild(indicators);
    } else {
      indicators.innerHTML = '';
    }
    const dots = images.map((_, i) => {
      const d = document.createElement('span');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      indicators.appendChild(d);
      return d;
    });
    const setIndicator = (i) => {
      dots.forEach((d, j) => { if (j === i) d.classList.add('active'); else d.classList.remove('active'); });
    };

    const setHeightForIndex = (idx = current) => {
      const vw = window.innerWidth || document.documentElement.clientWidth || 0;
      const vh = window.innerHeight || document.documentElement.clientHeight || 0;
      const header = document.querySelector('.site-header');
      const hh = header ? header.getBoundingClientRect().height : 0;
      const avail = Math.max(0, vh - hh);
      if (vw < 768) {
        wrap.style.height = '';
        return;
      }
      const slide = slides[idx];
      const img = slide ? slide.querySelector('img') : null;
      if (!img) return;
      const apply = () => {
        const w = wrap.clientWidth;
        const nw = img.naturalWidth;
        const nh = img.naturalHeight;
        if (w > 0 && nw > 0 && nh > 0) {
          const ratioH = Math.round((nh / nw) * w);
          const h = Math.min(ratioH, avail);
          wrap.style.height = h + 'px';
        }
      };
      if (img.complete && img.naturalWidth && img.naturalHeight) {
        requestAnimationFrame(apply);
      } else {
        img.addEventListener('load', () => requestAnimationFrame(apply), { once: true });
        img.addEventListener('error', () => { wrap.style.height = ''; }, { once: true });
      }
    };

    const debounce = (fn, delay = 150) => {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
      };
    };

    // Initial height
    setHeightForIndex(current);
    const onResponsive = debounce(() => setHeightForIndex(current), 150);
    window.addEventListener('resize', onResponsive);
    window.addEventListener('orientationchange', onResponsive);
    try { window.__updateHero = setHeightForIndex; } catch {}

    const autoCycle = () => {
      const vw = window.innerWidth || document.documentElement.clientWidth || 0;
      if (vw < 768) {
        const next = (current + 1) % slides.length;
        current = next;
        const left = (wrap.clientWidth || 0) * current;
        wrap.scrollTo({ left, behavior: 'smooth' });
        setIndicator(current);
        return;
      }
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
      setHeightForIndex(current);
      setIndicator(current);
    };
    let cycleId = setInterval(autoCycle, 2000);

    const scrollToIndex = (i) => {
      current = Math.max(0, Math.min(slides.length - 1, i));
      const left = (wrap.clientWidth || 0) * current;
      wrap.scrollTo({ left, behavior: 'smooth' });
      setIndicator(current);
    };
    let touchStartX = 0, touchEndX = 0;
    wrap.addEventListener('touchstart', (e) => { if (e.touches && e.touches[0]) touchStartX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchmove', (e) => { if (e.touches && e.touches[0]) touchEndX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', () => {
      const dx = touchEndX - touchStartX;
      const thresh = 40;
      if (Math.abs(dx) > thresh) {
        scrollToIndex(current + (dx < 0 ? 1 : -1));
      } else {
        const idx = Math.round((wrap.scrollLeft || 0) / Math.max(1, wrap.clientWidth));
        scrollToIndex(idx);
      }
    }, { passive: true });
    const pause = () => { if (cycleId) { clearInterval(cycleId); cycleId = null; } };
    const resume = () => { if (!cycleId) { cycleId = setInterval(autoCycle, 2000); } };
    wrap.addEventListener('mouseenter', pause);
    wrap.addEventListener('mouseleave', resume);
    wrap.addEventListener('touchstart', pause, { passive: true });
    wrap.addEventListener('touchend', resume, { passive: true });
    indicators.addEventListener('click', (e) => {
      const idx = Array.prototype.indexOf.call(indicators.children, e.target);
      if (idx >= 0) { scrollToIndex(idx); pause(); }
    });
    wrap.addEventListener('scroll', () => {
      const vw = window.innerWidth || document.documentElement.clientWidth || 0;
      if (vw >= 768) return;
      const idx = Math.round((wrap.scrollLeft || 0) / Math.max(1, wrap.clientWidth));
      if (idx !== current) { current = idx; setIndicator(current); }
    });
  } catch (e) {
    console.error('Failed to init hero carousel', e);
  }
}

function initCopyButtons() {
  // Copy buttons placed near images
  document.querySelectorAll('.qr-action-btn[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(text);
        showCopyPopover(btn);
      } catch (e) {
        console.error('Copy failed', e);
      }
    });
  });

  // Link buttons for Monobank
  document.querySelectorAll('.qr-link-btn[data-href]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const href = btn.getAttribute('data-href');
      try {
        window.open(href, '_blank', 'noopener');
      } catch (e) {
        console.error('Open link failed', e);
      }
    });
  });

  // Copy on image click for BTC/ETH/USDT cards
  document.querySelectorAll('.qr-card').forEach((card) => {
    const text = card.getAttribute('data-copy');
    const media = card.querySelector('.qr-media');
    if (text && media) {
      media.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(text);
          showCopyPopover(media);
        } catch (e) {
          console.error('Copy failed', e);
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Safe removal of hero-overlay if present
  try {
    const overlay = document.querySelector('.hero-overlay');
    if (overlay && overlay.parentNode) {
      overlay.remove();
    }
  } catch (e) {
    console.warn('Overlay removal skipped:', e);
  }
  try {
    const paypal = document.getElementById('paypal');
    if (paypal && paypal.parentNode) {
      try { window.__backup_paypal_section = paypal.cloneNode(true); } catch {}
      paypal.remove();
    }
  } catch (e) {}
  fetchJar();
  setInterval(fetchJar, 60000);
  initHeroCarousel();
  initCopyButtons();
  initMonoWidgetFallback();
  initNavMenu();
  
  initDonationButtons();
  initPayPalActions();
});

function initNavMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      nav.style.maxHeight = nav.scrollHeight + 'px';
    } else {
      nav.style.maxHeight = '0px';
    }
    try { if (window.__updateHero) window.__updateHero(); } catch {}
  };

  let isOpen = false;
  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    setOpen(isOpen);
  });

  // Reset on resize to desktop
  const mq = window.matchMedia('(max-width: 768px)');
  const handle = () => {
    if (!mq.matches) {
      nav.style.maxHeight = '';
      isOpen = false;
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      nav.style.maxHeight = '0px';
    }
  };
  mq.addEventListener ? mq.addEventListener('change', handle) : mq.addListener(handle);
  window.addEventListener('resize', handle);
  handle();
}

async function initMonoWidgetFallback() {
  try {
    const savedEl = document.getElementById('mw-saved');
    const goalEl = document.getElementById('mw-goal');
    const percentEl = document.getElementById('mw-percent');
    const fillEl = document.getElementById('mw-fill');
    if (!savedEl || !goalEl || !percentEl) return;
    const res = await fetch('/api/jar');
    const data = await res.json();
    const fmt = (n) => new Intl.NumberFormat('uk-UA').format(n) + ' ₴';
    let saved = null, goal = null;
    if (data && typeof data.saved === 'number' && typeof data.goal === 'number' && data.goal > 0) {
      saved = data.saved; goal = data.goal;
    } else {
      try {
        const res2 = await fetch('monobank.json');
        const alt = await res2.json();
        if (alt && typeof alt.saved === 'number' && typeof alt.goal === 'number' && alt.goal > 0) {
          saved = alt.saved; goal = alt.goal;
        }
      } catch {}
    }
    if (typeof saved === 'number') savedEl.textContent = fmt(saved); else savedEl.textContent = '—';
    if (typeof goal === 'number') goalEl.textContent = fmt(goal); else goalEl.textContent = '—';
    let pct = 0;
    if (typeof saved === 'number' && typeof goal === 'number' && goal > 0) {
      pct = Math.max(0, Math.min(100, Math.round((saved / goal) * 100)));
    }
    percentEl.textContent = pct + '%';
    if (fillEl) fillEl.style.width = pct + '%';
  } catch (e) {
    console.error('Fallback widget init failed', e);
  }
}

 
function initDonationButtons() {
  const buttons = document.querySelectorAll('.donation-btn');
  if (!buttons || buttons.length === 0) return;
  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const copyText = btn.getAttribute('data-copy');
      const href = btn.getAttribute('data-href');
      const delay = parseInt(btn.getAttribute('data-delay') || '0', 10);
      if (copyText) {
        try {
          await navigator.clipboard.writeText(copyText);
          showCopyPopover(btn);
        } catch (e) {
          console.error('Copy failed', e);
        }
      }
      if (href) {
        const go = () => { try { window.open(href, '_blank', 'noopener'); } catch (e) { console.error('Open link failed', e); } };
        if (Number.isFinite(delay) && delay > 0) { setTimeout(go, delay); } else { go(); }
      }
    });
  });
}

function initPayPalActions() {
  const LINK = 'https://www.paypal.com/';
  const EMAIL = 'aleksandr.korchevoj@gmail.com';
  const anchor = document.querySelector('a[href="#paypal"]');
  const btn = document.getElementById('paypal-btn');
  const handler = (el) => async (ev) => {
    if (ev && el === anchor) { ev.preventDefault(); }
    try {
      const ok = await copyText(EMAIL);
      if (ok) { showCopyPopover(el); } else { showToast('Не вдалося скопіювати'); }
    } catch (e) {
      console.error('Copy email failed', e);
      showToast('Не вдалося скопіювати');
    }
    setTimeout(() => {
      try {
        window.location.href = LINK;
      } catch (e) {
        console.error('Redirect failed', e);
        try { window.open(LINK, '_blank', 'noopener'); } catch {}
      }
    }, 3000);
  };
  if (anchor) { anchor.addEventListener('click', handler(anchor)); }
  if (btn) { btn.addEventListener('click', handler(btn)); }
}