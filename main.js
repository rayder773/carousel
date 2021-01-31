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
            autoplayInterval = 2000,
            gapBetweenSlides = -1,
            showNearest = false,
            root = null
        } = options;

        this.gapBetweenSlides = gapBetweenSlides;
        this.autoplay = autoplay;
        this.animationTime = animationTime;
        this.limit = limit;
        this.autoplayInterval = autoplayInterval;
        this.showNearest = showNearest;
        this.root = root;
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
        this.changeSlide(isNext);
        this.removeSlide(isNext);
    }

    createSlide(index, direction = '') {
        const listItem = this.parseTemplate(this.slides[index])

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

        if (this.autoplay === true) {
            this.container.addEventListener('mouseover', e => {
                this.stopAutoPlay();
            })

            this.container.addEventListener('mouseout', e => {
                this.startAutoplay();
            })
        }
    }

    startAutoplay() {
        this.interval = setInterval(() => this.renewSlides(), this.autoplayInterval);
    }

    stopAutoPlay() {
        clearInterval(this.interval);
    }

    createElements() {
        this.$nextBtn = document.createElement('button');
        this.$nextBtn.classList.add('next-btn');
        this.$nextBtn.innerText = '>>';

        this.$prevBtn = document.createElement('button');
        this.$prevBtn.classList.add('prev-btn');
        this.$prevBtn.innerText = '<<';

        this.container = document.createElement('div');
        this.container.classList.add('carousel-container');

        this.list = document.createElement('ul')
        this.list.classList.add('slide-wrapper');
        this.container.append(this.$nextBtn);
        this.container.append(this.$prevBtn);

        this.container.append(this.list);
        document.querySelector(this.root).append(this.container);
    }

    parseTemplate(slideData) {
        const listItem = document.createElement('li');
        let html = this.template;

        if (this.template instanceof HTMLElement) {
            html = this.template.outerHTML;
        }

        const data = html.replace(/{{(.*)}}/gmi, (text) => {
            return slideData[text.match(/\w+/)[0]]
        })

        listItem.insertAdjacentHTML('afterbegin', data)

        return listItem;

    }

    appendSlideOnInit(index, isActive = false) {
        const listItem = this.parseTemplate(this.slides[index])
        listItem.classList.add('slide');
        listItem.style.transitionDuration = `${this.animationTime}ms`;

        if (isActive) {
            listItem.classList.add('active');
        }

        listItem.style.background = getRandomColor();
        listItem.setAttribute('data-slide-index', index.toString());

        this.list.append(listItem);

        return listItem;
    }

    render(slides = [], template) {
        this.createElements();
        this.addEvents();
        this.slides = slides;
        this.template = template;

        this.containerWidth = this.container.getClientRects()[0].width + this.gapBetweenSlides;

        for (let i = 0; i < this.slides.length; i++) {
            if (i === 0) {
                this.currentSlide = this.appendSlideOnInit(i, true);
            }

            if (i === 1) {
                this.nextSlide = this.appendSlideOnInit(i);
                this.nextSlide.style.transform += `translateX(${this.containerWidth}px)`;
            }

            if (i === (this.slides.length - 1)) {
                this.prevSlide = this.appendSlideOnInit(i);
                this.prevSlide.style.transform += `translateX(-${this.containerWidth}px)`;
            }
        }

        if (this.autoplay) {
            this.startAutoplay();
        }
    }

}

const carousel = new Carousel({
    // autoplay: true,
    // limit: 5
    // gapBetweenSlides: 30,
    showNearest: true,
    root: '#root'
});


const slides = new Array(10).fill('').map((_, i) => {
    return {
        title:  `slide ${i}`,
        test: '228'
    }
});
// const template = `
//     <div>
//         <div>Hello {{ title }}</div>
//         <div>{{test}}</div>
//     </div>
//
// `

const template = document.createElement('div');
const text = document.createElement('div');
template.append(text);

text.innerText = '{{title}}'
carousel.render(slides, template)

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
