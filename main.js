import './style.scss';

class Carousel {
    constructor(
        options = {}
    ) {
        const {
            limit = 3,
            animationTime = 500,
            showCount = 1,
            autoplay = false,
        } = options;

        this.$nextBtn = document.querySelector('.next-btn');
        this.$prevBtn = document.querySelector('.prev-btn');
        this.container = document.querySelector('.carousel-container');
        this.containerWidth = this.container.getClientRects()[0].width + 20;
        this.list = document.querySelector('ul');
        this.autoplay = autoplay;

        this.animationTime = animationTime;
        this.limit = limit;
    }

    changeSlide(isNext = true) {
        const currentSlide = document.querySelector('.slide.active');
        let closest = currentSlide[isNext ? 'nextElementSibling' : 'previousElementSibling'];

        if (!closest) {
            const allSlides = document.querySelectorAll('.slide');
            closest = isNext ? allSlides[0] : allSlides[allSlides.length - 1];
        }

        closest.style.transform = `translateX(0px)`;
        closest.classList.add('active');
        currentSlide.classList.remove('active');
        currentSlide.style.transform = `translateX(${isNext ? '-' : ''}${this.containerWidth}px)`;

        this.$nextBtn.setAttribute('disabled', 'true');
        this.$prevBtn.setAttribute('disabled', 'true');

        setTimeout(() => {
            this.$nextBtn.removeAttribute('disabled');
            this.$prevBtn.removeAttribute('disabled');
        }, this.animationTime)
    }

    renewSlides(isNext = true) {
        console.log('check');
        this.changeSlide(isNext);
        this.removeSlide(isNext);
    }

    createSlide(index, direction = '') {
        const listItem = document.createElement('li');
        console.log('direction', direction);

        listItem.innerText = this.slides[index];
        listItem.classList.add('slide');
        listItem.style.transform = `translateX(${direction}${this.containerWidth}px)`;
        listItem.style.transitionDuration = `${this.animationTime}ms`;
        listItem.style.background = getRandomColor();
        listItem.setAttribute('data-slide-index', index.toString());

        return listItem;
    }

    removeSlide(isNext = true) {
        if (isNext) {
            const currentSlide = this.nextSlide;
            const prevSlide = this.currentSlide;
            let nextSlideIndex = parseInt(currentSlide.getAttribute('data-slide-index')) + 1;

            if (nextSlideIndex === this.slides.length) {
                nextSlideIndex = 0
            }

            const listItem = this.createSlide(nextSlideIndex)
            this.list.append(listItem);

            this.prevSlide.remove()

            this.currentSlide = currentSlide;
            this.currentSlide.classList.add('active');
            this.prevSlide = prevSlide;
            this.nextSlide = listItem;
        } else {
            const currentSlide = this.prevSlide;
            const nextSlide = this.currentSlide;
            let prevSlideIndex = parseInt(currentSlide.getAttribute('data-slide-index')) - 1;

            if (prevSlideIndex < 0) {
                prevSlideIndex = this.slides.length - 1;
            }

            const listItem = this.createSlide(prevSlideIndex, '-');
            this.list.prepend(listItem);

            this.nextSlide.remove();

            this.currentSlide = currentSlide;
            this.currentSlide.classList.add('active');
            this.nextSlide = nextSlide;
            this.prevSlide = listItem; 
        }
    }

    addEvents() {
        this.$nextBtn.addEventListener('click', e => {
            e.preventDefault();
            this.renewSlides()
        })

        this.$prevBtn.addEventListener('click', e => {
            e.preventDefault();
            this.renewSlides(false);
        })
    }

    setAutoplay() {
        this.interval = setInterval(() => this.renewSlides(), 2000);
    }

    render(slides = [], template) {
        this.addEvents()
        this.slides = slides;
        this.template = template;

        const list = document.querySelector('ul');

        for (let i = 0; i < this.slides.length; i++) {
           
            const listItem = document.createElement('li');
            listItem.innerText = this.slides[i];

            listItem.classList.add('slide');
            listItem.style.transitionDuration = `${this.animationTime}ms`;

            if (i === 0) {
                listItem.classList.add('active');
                listItem.style.background = getRandomColor();
                listItem.setAttribute('data-slide-index', i.toString());
                this.currentSlide = listItem;
    
                list.append(listItem);
            }

            if (i === 1) {
                listItem.style.transform += `translateX(${this.containerWidth}px)`;
                listItem.style.background = getRandomColor();
                listItem.setAttribute('data-slide-index', i.toString());
                this.nextSlide = listItem;
    
                list.append(listItem);
            }

            if (i === (this.slides.length - 1)) {
                listItem.style.transform += `translateX(-${this.containerWidth}px)`;
                listItem.style.background = getRandomColor();
                listItem.setAttribute('data-slide-index', i.toString());
                this.prevSlide = listItem;
    
                list.prepend(listItem);
            }
        }

        if (this.autoplay) {

            this.setAutoplay()
        }
    }

}

const carousel = new Carousel({
    // autoplay: true
    // limit: 5
});


const slides = new Array(10).fill('').map((_, i) => `slide ${i}`);
carousel.render(slides)

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }