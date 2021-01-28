class Carousel {
    constructor(

    ) {
        this.$nextBtn = document.querySelector('.next-btn');
        this.$prevBtn = document.querySelector('.prev-btn');
        this.position = 0;
        this.container = document.querySelector('.carousel-container');
        this.containerWidth = this.container.getClientRects()[0].width + 20;
    }

    nextSlide() {
        const currentSlide = document.querySelector('.slide.active');
        const closest = currentSlide.nextElementSibling;
        closest.style.transform -= this.containerWidth;
        closest.classList.add('active');
        currentSlide.classList.remove('active');
        this.position -= this.containerWidth;
        currentSlide.style.transform = `translateX(${this.position}px)`;
    }

    prevSlide() {
        const currentSlide = document.querySelector('.slide.active');
        this.position += this.containerWidth;
        currentSlide.style.transform = `translateX(${this.position}px)`;
    }

    addEvents() {
        this.$nextBtn.addEventListener('click', e => {
            e.preventDefault()
            this.nextSlide()
        })

        this.$prevBtn.addEventListener('click', e => {
            e.preventDefault()
            this.prevSlide()
        })
    }

    render(slides = [], template) {
        this.addEvents()
        this.slides = slides;
        this.template = template;

        return `
            <div>hello</div>
        `
    }
}

const root = document.querySelector('#root');
const carousel = new Carousel();

console.log(root)

carousel.render()

// root.insertAdjacentHTML(carousel.render());