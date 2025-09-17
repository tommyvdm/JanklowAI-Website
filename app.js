/* Janklow.ai – Advanced Interactive Experience (2025) */

/* ============  ENHANCED SCROLL REVEAL  ========================== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      entry.target.classList.add('animate-slide-up');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Initialize scroll reveal for various elements
const revealElements = document.querySelectorAll('.industry, .card, .stat, .service, .value-card');
revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  revealObserver.observe(el);
});

/* ============  ADVANCED COUNTER ANIMATION  ====================== */
const animateCounter = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
};

// Enhanced counter animation with stagger effect
document.querySelectorAll('.num').forEach((el, index) => {
  const target = parseFloat(el.dataset.value);
  const hasDecimal = el.dataset.value.includes('.');
  
  const counterObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    
    // Stagger animation start
    setTimeout(() => {
      let current = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      
      const animate = () => {
        current += increment;
        if (current >= target) {
          el.textContent = hasDecimal ? target.toFixed(1) : Math.floor(target);
        } else {
          el.textContent = hasDecimal ? current.toFixed(1) : Math.floor(current);
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }, index * 200); // Stagger by 200ms
    
    counterObserver.unobserve(el);
  }, { threshold: 0.7 });
  
  counterObserver.observe(el);
});

/* ============  ADVANCED PARTICLE SYSTEM  ======================== */
const canvas = document.getElementById('bg');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: 0, y: 0 };
  let animationId;
  
  // Responsive canvas sizing
  const resizeCanvas = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  
  // Enhanced particle class
  class Particle {
    constructor() {
      this.reset();
      this.opacity = Math.random() * 0.8 + 0.2;
      this.baseOpacity = this.opacity;
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 3 + 1;
      this.hue = 0; // Black and white particles
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Boundary collision with smooth bounce
      if (this.x < 0 || this.x > canvas.width) {
        this.vx *= -0.8;
        this.x = Math.max(0, Math.min(canvas.width, this.x));
      }
      if (this.y < 0 || this.y > canvas.height) {
        this.vy *= -0.8;
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }
      
      // Mouse interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        this.opacity = this.baseOpacity + force * 0.5;
        this.radius = Math.min(this.radius * (1 + force * 0.3), 6);
      } else {
        this.opacity = Math.max(this.opacity - 0.01, this.baseOpacity);
        this.radius = Math.max(this.radius * 0.99, 1);
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      
      // Create gradient for each particle
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  // Initialize particles
  const particleCount = Math.min(150, Math.floor(canvas.width * canvas.height / 8000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Animation loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    // Draw connections between nearby particles
    particles.forEach((particle, i) => {
      particles.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          ctx.save();
          ctx.globalAlpha = (120 - distance) / 120 * 0.2;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
          ctx.restore();
        }
      });
    });
    
    animationId = requestAnimationFrame(animate);
  };
  
  animate();
  
  // Enhanced mouse tracking
  let mouseTimeout;
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
      mouse.x = -1000;
      mouse.y = -1000;
    }, 2000);
  });
  
  // Touch support
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationId);
  });
}

/* ============  ENHANCED MAGNETIC BUTTONS  ======================= */
const magneticElements = document.querySelectorAll('.btn-primary, .btn-cta, .card');

magneticElements.forEach(element => {
  let isHovering = false;
  
  element.addEventListener('mouseenter', () => {
    isHovering = true;
    element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  element.addEventListener('mouseleave', () => {
    isHovering = false;
    element.style.transform = 'translate(0, 0) scale(1)';
    element.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  element.addEventListener('mousemove', (e) => {
    if (!isHovering) return;
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.1;
    const deltaY = (e.clientY - centerY) * 0.1;
    
    element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
  });
});

/* ============  ENHANCED VIDEO CONTROLS  ========================= */
const video = document.getElementById('janklowAd');
const playButton = document.getElementById('videoPlay');

if (video && playButton) {
  // Lazy loading with intersection observer
  const videoObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      video.preload = 'metadata';
      video.load();
      videoObserver.unobserve(video);
    }
  }, { threshold: 0.3 });
  
  videoObserver.observe(video);
  
  // Enhanced play/pause functionality
  const toggleVideo = () => {
    if (video.paused || video.ended) {
      video.play().then(() => {
        video.muted = false;
        playButton.classList.add('playing');
        playButton.classList.remove('show');
      }).catch(console.error);
    } else {
      video.pause();
      playButton.classList.remove('playing');
      playButton.classList.add('show');
    }
  };
  
  playButton.addEventListener('click', toggleVideo);
  
  // Keyboard support
  video.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      toggleVideo();
    }
  });
  
  // Video event handlers
  video.addEventListener('pause', () => {
    if (!video.ended) {
      playButton.classList.remove('playing');
      playButton.classList.add('show');
    }
  });
  
  video.addEventListener('ended', () => {
    playButton.classList.remove('playing');
    playButton.classList.add('show');
  });
  
  video.addEventListener('play', () => {
    playButton.classList.add('playing');
    playButton.classList.remove('show');
  });
}

/* ============  SMOOTH SCROLLING ENHANCEMENTS  =================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* ============  NAVBAR SCROLL EFFECTS  =========================== */
const navbar = document.querySelector('.top-nav');
let lastScrollY = window.scrollY;

const updateNavbar = () => {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > 100) {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.8)';
    navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
  }
  
  // Hide/show navbar on scroll
  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  
  lastScrollY = currentScrollY;
};

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateNavbar();
      ticking = false;
    });
    ticking = true;
  }
});

/* ============  FORM ENHANCEMENTS  =============================== */
const forms = document.querySelectorAll('form');

forms.forEach(form => {
  const inputs = form.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    // Floating label effect
    const label = input.previousElementSibling;
    
    const checkInput = () => {
      if (input.value.trim() !== '' || input === document.activeElement) {
        label?.classList.add('active');
      } else {
        label?.classList.remove('active');
      }
    };
    
    input.addEventListener('focus', checkInput);
    input.addEventListener('blur', checkInput);
    input.addEventListener('input', checkInput);
    
    // Initial check
    checkInput();
  });
  
  // Form submission with loading state
  form.addEventListener('submit', (e) => {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.style.opacity = '0.7';
      submitButton.style.pointerEvents = 'none';
      submitButton.textContent = 'Sending...';
      
      // Reset after 3 seconds (in case of error)
      setTimeout(() => {
        submitButton.style.opacity = '1';
        submitButton.style.pointerEvents = 'auto';
        submitButton.textContent = 'Send Message';
      }, 3000);
    }
  });
});

/* ============  PERFORMANCE OPTIMIZATIONS  ====================== */
// Debounce function for performance
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/* ============  ACCESSIBILITY ENHANCEMENTS  ====================== */
// Focus management for mobile menu
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('change', () => {
    if (menuToggle.checked) {
      // Focus first link when menu opens
      const firstLink = navLinks.querySelector('a');
      setTimeout(() => firstLink?.focus(), 300);
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.checked) {
      menuToggle.checked = false;
      menuToggle.focus();
    }
  });
}

/* ============  REDUCED MOTION SUPPORT  ========================== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Disable animations for users who prefer reduced motion
  document.documentElement.style.setProperty('--transition-fast', '0ms');
  document.documentElement.style.setProperty('--transition-normal', '0ms');
  document.documentElement.style.setProperty('--transition-slow', '0ms');
  
  // Stop particle animation
  if (canvas) {
    cancelAnimationFrame(animationId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* ============  DARK MODE DETECTION  ============================= */
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

const updateTheme = (e) => {
  if (e.matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

darkModeQuery.addEventListener('change', updateTheme);
updateTheme(darkModeQuery);

/* ============  ERROR HANDLING  ================================== */
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
  // Graceful degradation - ensure basic functionality still works
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  e.preventDefault();
});

/* ============  INITIALIZATION  ================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Add loaded class to body for CSS transitions
  document.body.classList.add('loaded');
  
  // Initialize any additional components
  console.log('Janklow.ai - Advanced interactive experience loaded');
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}