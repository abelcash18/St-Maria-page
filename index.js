/* ========== ST MARIA GORETTI - SCRIPT.JS ========== */

// Welcome Modal
function closeWelcome(target){
  const modal = document.getElementById('welcomeModal');
  if(modal) modal.style.display='none';
  document.body.style.overflow='';
  if(target) scrollToId(target);
}

// Lock scroll on load for modal
setTimeout(()=>{
  const modal = document.getElementById('welcomeModal');
  if(modal && modal.style.display !== 'none'){
    document.body.style.overflow='hidden';
  }
},100);

// Header scroll effect + responsive nav
function handleHeader(){
  const header = document.getElementById('header');
  const desktopNav = document.getElementById('desktopNav');
  const applyBtn = document.getElementById('applyBtn');
  const menuBtn = document.getElementById('menuBtn');
  const isDesktop = window.innerWidth > 900;

  if(window.scrollY > 20){
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  if(isDesktop){
    if(desktopNav) desktopNav.style.display='flex';
    if(applyBtn) applyBtn.style.display='block';
    if(menuBtn) menuBtn.style.display='none';
  } else {
    if(desktopNav) desktopNav.style.display='none';
    if(applyBtn) applyBtn.style.display='none';
    if(menuBtn) menuBtn.style.display='grid';
  }
}

window.addEventListener('scroll', handleHeader);
window.addEventListener('resize', handleHeader);
window.dispatchEvent(new Event('scroll'));

// Mobile menu toggle
function toggleMenu(){
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

// Smooth scroll
function scrollToId(id){
  const el = document.getElementById(id);
  if(el){
    el.scrollIntoView({behavior:'smooth', block:'start'});
    history.replaceState(null,'','#'+id);
  }
}

// Lightbox for gallery
function openLight(text){
  const lb = document.getElementById('lightbox');
  const txt = document.getElementById('lightboxText');
  if(txt) txt.innerText = text;
  if(lb) lb.style.display='grid';
}

// Contact form
function handleContact(e){
  e.preventDefault();
  const fd = new FormData(e.target);
  const email = (fd.get('email')||'')+'';
  const msg = (fd.get('message')||'')+'';
  const status = document.getElementById('contactStatus');
  status.style.display='block';
  
  if(!email.includes('@') || msg.length < 10){
    status.innerText = '⚠️ Please enter a valid email and a message (10+ characters).';
    status.style.background = '#fdecea';
    return;
  }
  
  status.innerText = '✅ Thank you! Your message has been received. Our registrar will respond within 24 hours. (Demo mode - connect to backend to send email)';
  status.style.background = '#e6f4ea';
  e.target.reset();
}

// Reveal on scroll animation
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('reveal-in');
      revealObserver.unobserve(en.target);
    }
  });
},{threshold:.15});

document.querySelectorAll('[data-reveal]').forEach(el=>revealObserver.observe(el));

// Optional: Close lightbox with Escape key
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    document.getElementById('welcomeModal').style.display='none';
    document.getElementById('lightbox').style.display='none';
    document.getElementById('mobileMenu').classList.remove('open');
    document.body.style.overflow='';
  }
});

console.log('St Maria Goretti Girls Grammar School - Loaded ✨');
