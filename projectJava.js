window.addEventListener("DOMContentLoaded", () => {

  /* HERO FADE-IN */
  document.querySelector(".hero-overlay")?.classList.add("visible");

  /* SECTION REVEAL + NAV DOTS */
  const sections = document.querySelectorAll("section");
  const nav = document.getElementById("sectionNav");
  const backToTop = document.getElementById("backToTop");
  if (sections.length && nav) {
    sections.forEach(sec => {
      const dot = document.createElement("div");
      dot.className = "section-dot";
      dot.dataset.title = sec.querySelector("h2")?.innerText || "";
      dot.onclick = () => sec.scrollIntoView({ behavior: "smooth" });
      nav.appendChild(dot);
    });
  }
  const sectionDots = document.querySelectorAll(".section-dot");
  sections.forEach((sec, i) => { setTimeout(() => sec.classList.add("visible"), 300 + i * 120); });
  window.addEventListener("scroll", () => {
    const mid = window.scrollY + window.innerHeight / 2;
    sections.forEach((sec, i) => {
      if (mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight) {
        sectionDots.forEach(d => d.classList.remove("active"));
        sectionDots[i]?.classList.add("active");
      }
    });
    nav.classList.toggle("visible", window.scrollY > 300);
    backToTop.style.display = window.scrollY > 500 ? "block" : "none";
  });
  backToTop.onclick = () => window.scrollTo({ top:0, behavior:"smooth" });

  /* PARTICLES */
  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d"); let w,h;
    const resizeCanvas = () => { w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; }
    resizeCanvas(); window.addEventListener("resize", resizeCanvas);
    const particles = Array.from({ length:80 }, () => ({ x:Math.random()*w, y:Math.random()*h, r:Math.random()*2+1, vx:Math.random()*0.3, vy:Math.random()*0.3 }));
    const animate = () => {
      ctx.clearRect(0,0,w,h); ctx.fillStyle="rgba(0,174,239,0.35)";
      particles.forEach(p => { p.x+=p.vx; p.y+=p.vy; if(p.x>w)p.x=0; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); });
      requestAnimationFrame(animate);
    }; animate();
  }

  /* MULTIPLE CAROUSELS */
  document.querySelectorAll("[data-carousel]").forEach(carousel => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const prevBtn = carousel.querySelector(".carousel-btn.prev");
    const nextBtn = carousel.querySelector(".carousel-btn.next");
    const dotsContainer = carousel.querySelector(".carousel-dots");
    const originalSlides = [...slides];

    let index = 1;
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length-1].cloneNode(true);
    firstClone.id="firstClone"; lastClone.id="lastClone";
    track.appendChild(firstClone); track.insertBefore(lastClone, originalSlides[0]);
    const allSlides = Array.from(track.children);
    let slideWidth = originalSlides[0].offsetWidth;
    track.style.transform = `translateX(-${slideWidth * index}px)`;

    // Dots
    originalSlides.forEach((_,i) => {
      const dot = document.createElement("span");
      if(i===0) dot.classList.add("active");
      dot.onclick = () => { index=i+1; move(); resetAuto(); };
      dotsContainer?.appendChild(dot);
    });
    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

    function move(animate=true){
      track.style.transition = animate?"transform 0.5s ease":"none";
      track.style.transform = `translateX(-${slideWidth*index}px)`;
      let dotIndex=index-1; if(dotIndex<0)dotIndex=originalSlides.length-1; if(dotIndex>=originalSlides.length)dotIndex=0;
      dots.forEach(d=>d.classList.remove("active"));
      dots[dotIndex]?.classList.add("active");
    }

    track.addEventListener("transitionend", ()=>{
      if(allSlides[index].id==="firstClone"){ index=1; move(false); }
      if(allSlides[index].id==="lastClone"){ index=originalSlides.length; move(false); }
    });

    nextBtn.addEventListener("click", ()=>{ index++; move(); resetAuto(); });
    prevBtn.addEventListener("click", ()=>{ index--; move(); resetAuto(); });

    let autoTimer;
    function startAuto(){ autoTimer=setInterval(()=>{ index++; move(); }, 4000); }
    function resetAuto(){ clearInterval(autoTimer); startAuto(); }
    window.addEventListener("resize", ()=>{ slideWidth=originalSlides[0].offsetWidth; move(false); });
    startAuto();
  });

  /* RETURN HOME */
  document.getElementById("returnHome")?.addEventListener("click", ()=>{ window.location.href="index.html"; });

});
const navLinks = document.querySelectorAll(".hero-nav-link");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetSection = link.dataset.target;

    // Clear old scroll/session info
    sessionStorage.removeItem("lastScrollY");
    sessionStorage.removeItem("lastSection");

    // Save the target section for index.html
    sessionStorage.setItem("lastSection", targetSection);

    // Redirect to homepage
    window.location.href = "index.html";
  });
});
window.addEventListener("scroll", () => {
  document.getElementById("heroHeader")
    .classList.toggle("scrolled", window.scrollY > 40);
});