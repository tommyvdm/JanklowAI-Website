/* Janklow.ai – UX sparkle */
/* 1️⃣  Scroll-reveal  */
const revealItems = document.querySelectorAll('.industry, .card, .stat');
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.opacity = 1;
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  })
},{threshold:.15});
revealItems.forEach(el=>{
  el.style.opacity = 0;
  el.style.transform = 'translateY(40px)';
  io.observe(el);
});

/* ── KPI COUNT-UP  ────────────────────────────────── */
document.querySelectorAll('.num').forEach(el=>{
  const target = +el.dataset.value;            // final number
  const decimals = (el.dataset.value.includes('.')) ? 1 : 0;
  const io = new IntersectionObserver(([e])=>{
    if (!e.isIntersecting) return;

    let current = 0;
    const step = target / 40;                  // 40 frames ≈ 0.6-0.7 s
    function tick(){
      current += step;
      if (current >= target){
        el.textContent = target.toFixed(decimals);
      } else {
        el.textContent = current.toFixed(decimals);
        requestAnimationFrame(tick);
      }
    }
    tick();
    io.unobserve(el);                          // run once
  }, {threshold: 0.6});
  io.observe(el);
});


/* 2️⃣  Particles in hero.
      No external libs – dead-simple canvas dots */
const cvs = document.getElementById('bg');
if(cvs){
  const ctx = cvs.getContext('2d');
  let w,h,particles=[];
  const resize=()=>{w=cvs.width=window.innerWidth;h=cvs.height=document.querySelector('.hero').offsetHeight};
  window.addEventListener('resize',resize);resize();

  for(let i=0;i<120;i++){
    particles.push({x:Math.random()*w,y:Math.random()*h,
                    vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,
                    r:Math.random()*2+1});
  }
  (function anim(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='rgba(255,255,255,.8)';
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx*=-1;
      if(p.y<0||p.y>h)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    });
    requestAnimationFrame(anim);
  })();

  /* ── PARALLAX DRIFT  ─────────────────────────────── */
document.addEventListener('mousemove', e=>{
  const dx = (e.clientX / window.innerWidth  - 0.5) * 10; // desktop
  const dy = (e.clientY / window.innerHeight - 0.5) * 10;
  cvs.style.transform = `translate(${dx}px,${dy}px)`;
});

  /* ── MAGNETIC BUTTONS  ───────────────────────────── */
document.querySelectorAll('.btn-primary, .btn-cta').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const {left, top, width, height} = btn.getBoundingClientRect();
    const x = (e.clientX - left - width  / 2) / 6;
    const y = (e.clientY - top  - height / 2) / 6;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', ()=> btn.style.transform = 'translate(0,0)');
});


window.addEventListener('deviceorientation', e=>{
  if (!e.gamma) return;                                    // iOS permission guard
  const dx =  e.gamma / 2;  // side tilt
  const dy = -e.beta  / 4;  // forward/back tilt
  cvs.style.transform = `translate(${dx}px,${dy}px)`;
});

}

/* ── Lazy-load + full play/pause toggle ─────────── */
const ad       = document.getElementById('janklowAd');
const playBtn  = document.getElementById('videoPlay');

if (ad && playBtn){
  /* lazy-load */
  new IntersectionObserver(([e],o)=>{
    if(!e.isIntersecting) return;
    ad.preload = 'auto'; ad.load(); o.disconnect();
  },{threshold:.4}).observe(ad);

  /* toggle play / pause on every click */
  playBtn.addEventListener('click', ()=>{
    if (ad.paused || ad.ended){
      ad.play();                     // start / resume
      ad.muted = false;              // play with sound
      playBtn.classList.add('playing');
      playBtn.classList.remove('show');
    } else {
      ad.pause();                    // pause
      playBtn.classList.remove('playing');
      playBtn.classList.add('show');
    }
  });

  /* sync icon when user pauses via keyboard/mobile controls */
  ad.addEventListener('pause', ()=>{
    if (!ad.ended){
      playBtn.classList.remove('playing');
      playBtn.classList.add('show');
    }
  });

  /* when video ends, reset to “play” icon & show button */
  ad.addEventListener('ended', ()=>{
    playBtn.classList.remove('playing');
    playBtn.classList.add('show');
  });
}





