export default class SlideShow {
  constructor(container, slides) {
    this.container = container;
    this.slides = slides || [];

    // values.
    this.containerWidth = 0;
    this.lg = 0;
    this.step = 0;
    this.currentId = 0;
  }

  init() {
    this.createSlideShow();
    this.setListeners();
  }

  setListeners() {
    const back = document.getElementById("backward-btn");
    const forward = document.getElementById("forward-btn");
    const slideShowSlides = document.querySelector(".slideshow-slides");

    slideShowSlides.addEventListener("transitionend", () => {
       this.currentId === 0 ? back.classList.add("hidden") :  back.classList.remove("hidden");
       this.currentId >= this.maxId ? forward.classList.add("hidden") : forward.classList.remove("hidden");
    });
    
    document.getElementById("forward-btn").addEventListener("click", (e) => {
      this.moveSlide(e.target);
    });
    back.addEventListener("click", (e) => {
      this.moveSlide(e.target);
    });
  }

  createSlideShow() {
    const slideShow = document.createElement("div");
    const slideShowSlides = document.createElement("div");
    const back = document.createElement("button");
    const forward = document.createElement("button");
    slideShow.className = "slideshow";
    slideShowSlides.className = "slideshow-slides";
    back.className = "slideshow-btn hidden";
    back.id = "backward-btn";
    forward.className = "slideshow-btn";
    forward.id = "forward-btn";
    slideShowSlides.appendChild(this.slides);
    slideShow.appendChild(slideShowSlides);
    slideShow.appendChild(back);
    slideShow.appendChild(forward);
    this.container.appendChild(slideShow);
    // values.
    this.slideShowW = slideShow.offsetWidth; // viewport
    this.slideShowSlidesW = slideShowSlides.scrollWidth; // track total
    this.lg = slideShowSlides.children.length;
    const slideW = slideShowSlides.children[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(slideShowSlides).gap);
    this.step = slideW + gap;
    // Visible slides number.
    this.page = Math.max(1, Math.floor(this.slideShowW / this.step));
  }

  // Manual.
  moveSlide(el) {
    let direction;
    // Last screen visibility.
    this.maxId = Math.max(0, this.lg - this.page);
    switch (el.id) {
      case "forward-btn":
        direction = "next";
        this.currentId = Math.min(this.currentId + this.page, this.maxId);
        break;
      case "backward-btn":
        direction = "prev";
        this.currentId = Math.max(this.currentId - this.page, 0);
        break;
    }
    this.translateSlideShow(direction);
  }
  // Slider animation.
  translateSlideShow(direction) {
    const slideShowSlides = document.querySelector(".slideshow-slides");
    // clamp to avoid to override on right.
    const maxTranslate = Math.max(
      0,
      slideShowSlides.scrollWidth - this.slideShowW
    );

    const wanted = this.step * this.currentId;
    const x = Math.min(wanted, maxTranslate);
    console.log(this.currentId);

    slideShowSlides.style.transform = `translateX(${-x}px)`;

  }
}
