export default class SlideShow {
  constructor(id, container, slides) {
    this.id = id;
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
    const slideShow = document.getElementById(this.id);
    if(!slideShow){ return; }
    const slideShowSlides = slideShow.querySelector(".slideshow-slides");
    const back = slideShow.querySelector(".backward-btn");
    const forward = slideShow.querySelector(".forward-btn");

    slideShowSlides.addEventListener("transitionend", () => {
      this.currentId === 0
        ? back.classList.add("hidden")
        : back.classList.remove("hidden");
      this.currentId >= this.maxId
        ? forward.classList.add("hidden")
        : forward.classList.remove("hidden");
    });

    forward.addEventListener("click", (e) => {
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
    slideShow.id = `${this.id}`;
    slideShowSlides.className = "slideshow-slides";
    back.className = "slideshow-btn hidden backward-btn";
    back.setAttribute("aria-label", "previous episodes");
    forward.className = "slideshow-btn forward-btn";
    forward.setAttribute("aria-label", "next episodes");
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
    // Last screen visibility.
    this.maxId = Math.max(0, this.lg - this.page);
    if (el.classList.contains("forward-btn")) {
      this.currentId = Math.min(this.currentId + this.page, this.maxId);
      this.translateSlideShow();
    }
    else if (el.classList.contains("backward-btn")) {
      this.currentId = Math.max(this.currentId - this.page, 0);
      this.translateSlideShow();
    }
  }
  // Slider animation.
  translateSlideShow() {
    const slideShow = document.getElementById(`${this.id}`);
    const slideShowSlides = slideShow.querySelector(".slideshow-slides");
    // clamp to avoid to override on right.
    const maxTranslate = Math.max(
      0,
      slideShowSlides.scrollWidth - this.slideShowW,
    );

    const wanted = this.step * this.currentId;
    const x = Math.min(wanted, maxTranslate);

    slideShowSlides.style.transform = `translateX(${-x}px)`;
  }
}
