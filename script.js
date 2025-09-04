/* ====== Helpers ====== */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* ====== Year ====== */
if ($('#year')) $('#year').textContent = new Date().getFullYear();

/* ====== THEME / DARK MODE ====== */
const themeBtn = $('#themeToggle');
if(themeBtn){
  if(localStorage.getItem('vk_theme')==='light') document.body.classList.add('light');
  themeBtn.addEventListener('click', ()=>{
    document.body.classList.toggle('light');
    localStorage.setItem('vk_theme', document.body.classList.contains('light')?'light':'dark');
    themeBtn.textContent = document.body.classList.contains('light')?'☀️':'🌓';
  });
}

/* ====== Particles ====== */
(function particles(){
  const canvas = $('#particles'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w=canvas.width=innerWidth, h=canvas.height=innerHeight;
  window.addEventListener('resize', ()=>{ w=canvas.width=innerWidth; h=canvas.height=innerHeight });
  const pts = Array.from({length:60}, ()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.8+0.2,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3}));
  function frame(){
    ctx.clearRect(0,0,w,h);
    pts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0;
      ctx.beginPath(); ctx.fillStyle='rgba(6,182,212,0.035)'; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(frame);
  } frame();
})();

/* ====== Tilt effect ====== */
$$('[data-tilt]').forEach(el=>{
  el.addEventListener('mousemove', e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
    const rx=(y-0.5)*8, ry=(x-0.5)*-8;
    el.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
  });
  el.addEventListener('mouseleave', ()=>el.style.transform='none');
});

/* ====== Skill bars reveal ====== */
function revealBars(){
  $$('.bar span').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top<innerHeight-60) el.style.width=el.style.getPropertyValue('--v')||'60%';
  });
}
addEventListener('scroll', revealBars);
addEventListener('load', revealBars);

/* ====== Certificate Lightbox ====== */
const lightbox = $('#lightbox'), lbImage = $('#lbImage'), lbClose = $('#lbClose');
if(lightbox){
  $$('.cert-card img').forEach(img=>{
    img.addEventListener('click', ()=>{
      lbImage.src = img.dataset.full || img.src;
      lightbox.style.display='flex';
      lightbox.setAttribute('aria-hidden','false');
    });
  });
  lbClose && lbClose.addEventListener('click', ()=>{ lightbox.style.display='none'; lbImage.src=''; });
  lightbox.addEventListener('click', e=>{ if(e.target===lightbox){ lightbox.style.display='none'; lbImage.src=''; }});
}

/* ====== EmailJS Contact Form ====== */
 
  (function(){
    if (typeof emailjs !== 'undefined') {
      try {
        emailjs.init('Dh72RuRH79Rp222Ho'); // Replace with your actual PUBLIC KEY
      } catch (e) {
        console.warn('EmailJS init failed:', e);
      }
    }
  })();

  document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const msg = document.getElementById('formMsg');

    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        msg.textContent = '';

        const n = this.name.value.trim();
        const em = this.email.value.trim();
        const m = this.message.value.trim();

        if (!n || !em || !m) {
          msg.style.color = '#f87171';
          msg.textContent = 'Please fill all fields';
          return;
        }

        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(em)) {
          msg.style.color = '#f87171';
          msg.textContent = 'Enter a valid email';
          return;
        }

        emailjs.sendForm('service_gqhugbq', 'template_qgrt067', this)
          .then(() => {
            msg.style.color = '#34d399';
            msg.textContent = 'Message sent — thank you!';
            contactForm.reset();
            setTimeout(() => msg.textContent = '', 4000);
          })
          .catch(err => {
            console.error('EmailJS sendForm error:', err);
            msg.style.color = '#f87171';
            msg.textContent = 'Sending failed. Try again later.';
          });
      });
    }
  });
 

/* ====== Chatbot ====== */
const assistantToggle = $('#assistantToggle'), assistantWindow = $('#assistantWindow'), assistantClose = $('#assistantClose'), assistantMessages = $('#assistantMessages'), assistantInput = $('#assistantInput'), assistantSend = $('#assistantSend'), voiceBtn = $('#voiceBtn');

const kb = {
  name:'Vikash Kumar Pandey',
  role:'Junior Cybersecurity • Frontend • Data Analyst',
  email:'pandvikash46@gmail.com',
  phone:'+91 9110989610',
  education:'BCA 3rd year, Swami Vivekanand Subharti University, Meerut',
  skills:'Cybersecurity, Cloud Computing, Web Security (OWASP basics), Auth & Hashing, Frontend (HTML, CSS, JavaScript, React basics), Data (Python, Pandas, Excel).',
  projects:[
    {title:'User Authentication System', desc:'College project — Java, salted hashing, role checks.'},
    {title:'Password Generator', desc:'Frontend project — secure password generator.'},
    {title:'Cyber Security Mini Project', desc:'Junior cybersecurity simulation project.'}
  ],
  certificates:['Forage — Developer Simulation','Programming Hub — HTML Advanced','TATA — Cybersecurity Analyst','Accenture — Simulation','Certificate 5','Certificate 6'],
  milestones:['Accenture Developer Simulation — Aug 2025','TATA Cybersecurity Analyst — Jul 2025','HTML Advanced — Sep 2023','BCA 3rd year — ongoing at SVSU'],
  about:'I build secure, user-friendly web experiences. Based in Varanasi.'
};

/* Message helpers */
function appendMessage(text,cls='bot'){ const el=document.createElement('div'); el.className=cls==='bot'?'msg bot':'msg user'; el.textContent=text; assistantMessages.appendChild(el); assistantMessages.scrollTop=assistantMessages.scrollHeight; }
function speak(text){ if(!('speechSynthesis' in window)) return; const u=new SpeechSynthesisUtterance(text); u.lang=/[ह-ॐ]/.test(text)?'hi-IN':'en-IN'; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }
function reply(text){ appendMessage(text,'bot'); speak(text); }

function handleQuery(q){
  q=q.trim(); if(!q) return '';
  const isHindi = /[^\x00-\x7F]+/.test(q);
  const lower=q.toLowerCase();
  if(/hello|hi|hey|namaste/.test(lower)) return isHindi?'नमस्ते! मैं Vikash ji का portfolio assistant हूँ। आप क्या जानना चाहते हैं?':'Hello! I am Vikash\'s portfolio assistant. What would you like to know?';
  if(/skill/.test(lower)) return kb.skills;
  if(/project/.test(lower)) return kb.projects.map(p=>`${p.title} — ${p.desc}`).join('\n\n');
  if(/certificate/.test(lower)) return 'Certificates: '+kb.certificates.join(', ');
  if(/contact|email|phone/.test(lower)) return `Email: ${kb.email}\nPhone: ${kb.phone}`;
  if(/about/.test(lower)) return `${kb.name} — ${kb.role}. ${kb.about} Education: ${kb.education}.`;
  if(/milestone/.test(lower)) return 'Milestones:\n'+kb.milestones.join('\n');
  if(/resume|cv/.test(lower)) return 'You can download the resume from the Resume button (assets/resume.pdf).';
  return isHindi?'माफ़ कीजिये 😅 यह जानकारी मेरे पास अभी नहीं है।':'Sorry 😅 I do not have this info yet.';
}

/* Chatbot Event Listeners */
assistantToggle && assistantToggle.addEventListener('click', ()=>{ assistantWindow.style.display=assistantWindow.style.display==='flex'?'none':'flex'; });
assistantClose && assistantClose.addEventListener('click', ()=>assistantWindow.style.display='none');
assistantSend && assistantSend.addEventListener('click', ()=>{
  const v=assistantInput.value.trim(); if(!v) return; appendMessage(v,'user'); assistantInput.value=''; setTimeout(()=>reply(handleQuery(v)),350);
});
assistantInput && assistantInput.addEventListener('keypress',e=>{ if(e.key==='Enter'){ e.preventDefault(); assistantSend.click(); }});
voiceBtn && voiceBtn.addEventListener('click',()=>{
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRecognition){ reply('Speech recognition not supported.'); return; }
  const rec=new SpeechRecognition(); rec.lang='hi-IN'; rec.interimResults=false; rec.maxAlternatives=1; rec.start(); reply('Listening...');
  rec.onresult=e=>{ const text=e.results[0][0].transcript; appendMessage(text,'user'); setTimeout(()=>reply(handleQuery(text)),300); };
  rec.onerror=e=>{ console.error(e); reply('Voice recognition error.'); };
});

/* Initial Greeting */
setTimeout(()=>reply('Hello! Main Vikash ka portfolio assistant hoon. Aap mujhse skills, projects, certificates, contact ya education puch sakte hain.'),700);