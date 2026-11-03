/* ==========================================================================
   NAGASHREE BEAUTY PARLOR - INTERACTIVE 3D & CORE APPLICATION ENGINE
   Brand: Nagashree Beauty Parlor (Rukmini - The Art of Beauty)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  init3DCanvas();
  init3DCardTilt();
  initBeforeAfterSlider();
  initServicesFilter();
  initBookingSuite();
  initGalleryLightbox();
  initStickyHeader();
  initMobileNav();
  initLuxuryAudioChime();
});

/* ==========================================================================
   1. 3D GOLDEN PARTICLE & FLOATING PRISM CANVAS ENGINE
   ========================================================================== */
function init3DCanvas() {
  const canvas = document.getElementById('hero3dCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle constellation with 3D depth z-index across full screen
  const particleCount = 105;
  const particles = [];
  const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
    particles.forEach((p) => {
      p.y -= deltaY * 0.12;
    });
  }, { passive: true });

  class Particle3D {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = (Math.random() - 0.5) * width * 1.5;
      this.y = (Math.random() - 0.5) * height * 1.5;
      this.z = Math.random() * 800 + 100; // Depth
      this.size = Math.random() * 3.0 + 1.2;
      this.baseAlpha = Math.random() * 0.65 + 0.35;
      this.alpha = this.baseAlpha;
      this.speedZ = Math.random() * 0.75 + 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.isPrism = Math.random() > 0.7; // Golden diamonds and floating prisms
    }

    update() {
      this.z -= this.speedZ;
      if (this.z <= 10) {
        this.reset();
        this.z = 900;
      }
      this.rotation += this.rotationSpeed;

      // Gentle mouse parallax
      this.x += (mouse.x - width / 2) * 0.0003 * (1000 - this.z) * 0.05;
      this.y += (mouse.y - height / 2) * 0.0003 * (1000 - this.z) * 0.05;
    }

    draw(ctx) {
      // 3D Perspective Projection
      const fov = 400;
      const scale = fov / (fov + this.z);
      const projX = this.x * scale + width / 2;
      const projY = this.y * scale + height / 2;
      const radius = this.size * scale * 2.2;

      if (projX < -50 || projX > width + 50 || projY < -50 || projY > height + 50) return;

      ctx.save();
      ctx.translate(projX, projY);
      ctx.rotate(this.rotation);

      if (this.isPrism) {
        // Draw 3D Golden Diamond / Petal facet
        ctx.beginPath();
        ctx.moveTo(0, -radius * 2);
        ctx.lineTo(radius * 1.3, 0);
        ctx.lineTo(0, radius * 2);
        ctx.lineTo(-radius * 1.3, 0);
        ctx.closePath();

        const goldGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
        goldGrad.addColorStop(0, `rgba(247, 225, 165, ${this.alpha * scale})`);
        goldGrad.addColorStop(0.5, `rgba(197, 155, 39, ${this.alpha * scale})`);
        goldGrad.addColorStop(1, `rgba(142, 104, 19, ${this.alpha * 0.5 * scale})`);

        ctx.fillStyle = goldGrad;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
        ctx.shadowBlur = 8 * scale;
        ctx.fill();
      } else {
        // Draw shimmering golden orb
        const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.5);
        radGrad.addColorStop(0, `rgba(255, 245, 215, ${this.alpha * scale})`);
        radGrad.addColorStop(0.4, `rgba(212, 175, 55, ${this.alpha * 0.8 * scale})`);
        radGrad.addColorStop(1, 'rgba(197, 155, 39, 0)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle3D());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Draw delicate golden constellation filaments between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const fov = 400;
          const scale1 = fov / (fov + p1.z);
          const scale2 = fov / (fov + p2.z);
          const x1 = p1.x * scale1 + width / 2;
          const y1 = p1.y * scale1 + height / 2;
          const x2 = p2.x * scale2 + width / 2;
          const y2 = p2.y * scale2 + height / 2;

          const alpha = (1 - dist / 110) * 0.18 * Math.min(scale1, scale2);
          ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw(ctx);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. 3D CARD TILT & HOLOGRAPHIC LIGHT TRACKER
   ========================================================================== */
function init3DCardTilt() {
  const tiltCards = document.querySelectorAll('.hero-3d-card, .service-card, .package-card, .studio-preview-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

/* ==========================================================================
   3. INTERACTIVE 3D VIRTUAL MAKEOVER STUDIO
   ========================================================================== */
const makeoverPresets = {
  'royal-bridal': {
    title: 'The Royal Muhurtham & Reception Glow',
    quote: '‘Timeless South Indian royalty crowned with modern champagne luminosity.’',
    image: 'assets/bridal.jpg',
    inclusions: [
      'HD Airbrush Waterproof 24-Hour Bridal Makeup',
      'Traditional Antique Gold Maang Tikka & Floral Hair Architecture',
      '24K Gold Collagen Hydration Prep & Lip Plumping Mask',
      'Saree Draping & Silhouette Pleating Mastery'
    ],
    tier: 'Bespoke Consultation'
  },
  'sangeet': {
    title: 'Sangeet & Cocktail High-Glamour',
    quote: '‘Bold shimmer smokey eyes, illuminated cheekbones, and cascading Hollywood waves.’',
    image: 'assets/hair.jpg',
    inclusions: [
      'Gilded Bronze & Champagne Eye Sculpting',
      'Keratin Silk Gloss Thermal Waves Styling',
      'Luminous Glass Skin Dewy Foundation Finish',
      'Lash Extensions & 3D Crystal Body Shimmer'
    ],
    tier: 'Bespoke Consultation'
  },
  'engagement': {
    title: 'Engagement & Ring Ceremony Elegance',
    quote: '‘Soft, romantic pastels and youthful petal-fresh radiance.’',
    image: 'assets/bridal.jpg',
    inclusions: [
      'Mineral Glow Lightweight Breathable Coverage',
      'Soft Rose-Gold Eyelid Foiling & Nude Velvet Lips',
      'Textured Half-Up Romantic Crown Braiding',
      'Pre-Event Collagen Eye Awakening Treatment'
    ],
    tier: 'Bespoke Consultation'
  },
  'haldi': {
    title: 'Sun-Kissed Haldi & Mehendi Dew',
    quote: '‘Fresh botanical glow resistant to natural haldi and vibrant celebrations.’',
    image: 'assets/skincare.jpg',
    inclusions: [
      'Water-Resistant Botanical Tint & Illuminator',
      'Floral Jewelry Placement & Messy Fishtail Braid',
      'Skin Barrier Calming & Turmeric Hydration Ritual',
      'Botanical Glow Mist & Velvet Lip Hydration'
    ],
    tier: 'Bespoke Consultation'
  },
  'wellness': {
    title: 'Pre-Bridal 24K Gold & Hydrafacial Ritual',
    quote: '‘Cellular renewal ritual delivering porcelain-smooth radiance from within.’',
    image: 'assets/skincare.jpg',
    inclusions: [
      'Deep Vortex Hydrafacial Pore Purification',
      '24K Real Gold Leaf Lymphatic Drainage Massage',
      'LED Red Light Collagen Phototherapy',
      'Aromatherapy Neck, Shoulder & Décolleté Relaxer'
    ],
    tier: 'Bespoke Consultation'
  }
};

function initVirtualMakeoverStudio() {
  const occasionBtns = document.querySelectorAll('.btn-occasion');
  const vibeBtns = document.querySelectorAll('.btn-vibe');
  const previewImg = document.getElementById('studioPreviewImg');
  const previewTitle = document.getElementById('studioPreviewTitle');
  const previewQuote = document.getElementById('studioPreviewQuote');
  const previewList = document.getElementById('studioPreviewList');
  const previewPrice = document.getElementById('studioPreviewPrice');
  const studioBookBtn = document.getElementById('studioBookBtn');

  if (!previewTitle) return;

  let currentOccasion = 'royal-bridal';

  function updateStudio(occasionKey) {
    const data = makeoverPresets[occasionKey] || makeoverPresets['royal-bridal'];

    // Fade animation
    const cardBody = document.querySelector('.studio-preview-card');
    if (cardBody) {
      cardBody.style.opacity = '0.7';
      cardBody.style.transform = 'scale(0.98)';
      setTimeout(() => {
        previewImg.src = data.image;
        previewTitle.textContent = data.title;
        previewQuote.textContent = data.quote;
        if (previewPrice) previewPrice.textContent = data.tier || 'Bespoke Consultation';

        previewList.innerHTML = data.inclusions
          .map(
            (item) => `
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            ${item}
          </li>
        `
          )
          .join('');

        cardBody.style.opacity = '1';
        cardBody.style.transform = 'scale(1)';
      }, 150);
    }
  }

  occasionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      occasionBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentOccasion = btn.dataset.occasion;
      updateStudio(currentOccasion);
      playChimeNote(660);
    });
  });

  vibeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      vibeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      playChimeNote(880);
    });
  });

  if (studioBookBtn) {
    studioBookBtn.addEventListener('click', () => {
      const bookingSelect = document.getElementById('bookingService');
      const bookingNotes = document.getElementById('bookingNotes');
      const targetSection = document.getElementById('booking');

      if (bookingSelect) {
        bookingSelect.value = 'bridal';
        updateBookingSummary();
      }
      if (bookingNotes) {
        bookingNotes.value = `Selected Look via Virtual Studio: ${makeoverPresets[currentOccasion].title}`;
      }

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   4. BEFORE & AFTER TRANSFORMATION SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.querySelector('.ba-slider-container');
  const beforeLayer = document.querySelector('.ba-before-layer');
  const handle = document.querySelector('.ba-handle');
  if (!container || !beforeLayer || !handle) return;

  let isDragging = false;
  const beforeImg = beforeLayer.querySelector('img');

  function updateBeforeImageWidth() {
    if (beforeImg && container) {
      beforeImg.style.width = `${container.offsetWidth}px`;
    }
  }
  updateBeforeImageWidth();
  window.addEventListener('resize', updateBeforeImageWidth);

  function setSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 30) x = 30;
    if (x > rect.width - 30) x = rect.width - 30;

    const percentage = (x / rect.width) * 100;
    beforeLayer.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch Support for mobile
  container.addEventListener(
    'touchstart',
    (e) => {
      isDragging = true;
      if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
    },
    { passive: true }
  );

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener(
    'touchmove',
    (e) => {
      if (!isDragging) return;
      if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
    },
    { passive: true }
  );
}

/* ==========================================================================
   5. SERVICES FILTER TABS
   ========================================================================== */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.service-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });

      playChimeNote(528);
    });
  });
}

/* ==========================================================================
   6. BOOKING SUITE & WHATSAPP GENERATOR
   ========================================================================== */
const serviceCatalog = {
  bridal: { name: 'Royal Bridal & Muhurtham Glow', time: '3.5 Hours' },
  facial: { name: '24K Gold Leaf Hydrafacial Ritual', time: '90 Mins' },
  hair: { name: 'Keratin Silk Infusion & Balayage', time: '2 Hours' },
  package: { name: 'Celestial Maharani VIP Package', time: 'Full Day' }
};

function updateBookingSummary() {
  const serviceSelect = document.getElementById('bookingService');
  const artistSelect = document.getElementById('bookingArtist');
  const summaryService = document.getElementById('summaryServiceName');
  const summaryDuration = document.getElementById('summaryDuration');
  const summaryArtist = document.getElementById('summaryArtist');
  const summaryTotal = document.getElementById('summaryTotal');

  if (!serviceSelect || !summaryService) return;

  const currentServiceKey = serviceSelect.value;
  const currentService = serviceCatalog[currentServiceKey] || serviceCatalog.bridal;

  summaryService.textContent = currentService.name;
  summaryDuration.textContent = currentService.time;
  if (summaryTotal) {
    summaryTotal.textContent = 'Complimentary Preview';
  }

  if (artistSelect && summaryArtist) {
    summaryArtist.textContent = artistSelect.options[artistSelect.selectedIndex].text;
  }
}

function initBookingSuite() {
  const form = document.getElementById('bookingForm');
  const serviceSelect = document.getElementById('bookingService');
  const artistSelect = document.getElementById('bookingArtist');
  const dateInput = document.getElementById('bookingDate');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  if (serviceSelect) {
    serviceSelect.addEventListener('change', updateBookingSummary);
  }
  if (artistSelect) {
    artistSelect.addEventListener('change', updateBookingSummary);
  }

  // Connect About Artists quick-booking buttons
  const artistButtons = document.querySelectorAll('.btn-select-artist');
  artistButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const artistKey = btn.dataset.artist;
      if (artistSelect && artistKey) {
        artistSelect.value = artistKey;
        updateBookingSummary();
      }
    });
  });

  updateBookingSummary();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookingName').value;
      const phone = document.getElementById('bookingPhone').value;
      const serviceKey = document.getElementById('bookingService').value;
      const service = serviceCatalog[serviceKey] || serviceCatalog.bridal;
      const artist = artistSelect
        ? artistSelect.options[artistSelect.selectedIndex].text
        : document.getElementById('bookingArtist').value;
      const date = document.getElementById('bookingDate').value;
      const slot = document.getElementById('bookingSlot').value;
      const notes = document.getElementById('bookingNotes').value;

      // Construct WhatsApp message
      const text =
        `✨ *VIP APPOINTMENT REQUEST - NAGASHREE BEAUTY PARLOR* ✨\n\n` +
        `👤 *Client Name:* ${name}\n` +
        `📞 *Contact:* ${phone}\n` +
        `💄 *Selected Service:* ${service.name}\n` +
        `⏳ *Estimated Duration:* ${service.time}\n` +
        `👩‍🎨 *Preferred Stylist:* ${artist}\n` +
        `📅 *Date:* ${date}\n` +
        `⏰ *Time Slot:* ${slot}\n` +
        (notes ? `📝 *Special Notes:* ${notes}\n\n` : '\n') +
        `_Sent via Nagashree Luxury Web Concierge_`;

      const encodedText = encodeURIComponent(text);
      // WhatsApp link - official parlor concierge number
      const whatsappUrl = `https://wa.me/918722332337?text=${encodedText}`;

      // Open in new tab
      window.open(whatsappUrl, '_blank');

      alert(
        `Thank you ${name}! Your VIP booking request has been formatted. WhatsApp will now open to confirm your appointment with Rukmini and our master stylists.`
      );
    });
  }
}

/* ==========================================================================
   7. GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightbox || !lightboxImg) return;

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        playChimeNote(784);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });
}

/* ==========================================================================
   8. STICKY HEADER
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   9. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-menu');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('active');
    }
  });
}

/* ==========================================================================
   10. LUXURY CHIME SYNTHESIZER (WEB AUDIO API)
   ========================================================================== */
let audioCtx = null;

function playChimeNote(freq = 528) {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Golden soft chime envelope
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  } catch (e) {
    // Audio context silently handled
  }
}
