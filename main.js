import './style.scss';

class Carousel {
    constructor(
        limit = 3,
    ) {
        this.$nextBtn = document.querySelector('.next-btn');
        this.$prevBtn = document.querySelector('.prev-btn');
        this.container = document.querySelector('.carousel-container');
        this.containerWidth = this.container.getClientRects()[0].width;
        this.limit = limit;
    }

    changeSlide(isNext = true) {
        const currentSlide = document.querySelector('.slide.active');
        const closest = currentSlide[isNext ? 'nextElementSibling' : 'previousElementSibling'];
        closest.style.transform = `translateX(0px)`;
        closest.classList.add('active');
        currentSlide.classList.remove('active');
        currentSlide.style.transform = `translateX(${isNext ? '-' : ''}${this.containerWidth}px)`;
    }

    removeSlides(isNext = true) {
        const allSlides = document.querySelectorAll('.slide');
        const currentSlide = document.querySelector('.slide.active');
        const currentSlideIndex = currentSlide.getAttribute('data-slide-index');

        if (isNext) {
            if(currentSlideIndex - 2 >= 0) {
                const forRemove = document.querySelector(`[data-slide-index='${currentSlideIndex - 2}']`);
                let clone = forRemove.cloneNode(true);
                forRemove.remove();


                for (let i = 0; i < allSlides.length; i++) {
                    allSlides[i].setAttribute('data-slide-index', i.toString())
                }

                clone.setAttribute('data-slide-index', allSlides.length);
                clone.style.transform = `translateX(${this.containerWidth}px)`;

                document.querySelector('ul').append(clone);
            }
        } else {
            if(currentSlideIndex + 2 < allSlides.length) {
                const forRemove = document.querySelector(`[data-slide-index='${currentSlideIndex + 2}']`);
                let clone = forRemove.cloneNode(true);
                forRemove.remove();


                for (let i = 0; i < allSlides.length; i++) {
                    allSlides[i].setAttribute('data-slide-index', i.toString())
                }

                clone.setAttribute('data-slide-index', allSlides.length);
                clone.style.transform = `translateX(${this.containerWidth}px)`;

                document.querySelector('ul').append(clone);
            }
        }
    }

    addEvents() {
        this.$nextBtn.addEventListener('click', e => {
            e.preventDefault()
            this.changeSlide()
            this.removeSlides()
        })

        this.$prevBtn.addEventListener('click', e => {
            e.preventDefault()
            this.changeSlide(false);
            this.removeSlides(false)
        })
    }

    render(slides = [], template) {
        this.addEvents()
        this.slides = slides;
        this.template = template;

        const list = document.querySelector('ul');

        for (let i = 0; i < this.limit; i++) {
            const listItem = document.createElement('li');
            listItem.innerText = this.slides[i];

            listItem.classList.add('slide');
            listItem.setAttribute('data-slide-index', i.toString());
            list.append(listItem);

            if (i === 0) {
                listItem.classList.add('active');
                listItem.style.background = 'red';
            }

            if (i === 1) {
                listItem.style.transform += `translateX(${this.containerWidth}px)`;
                listItem.style.background = 'green';
            }

            if (i === 2) {
                listItem.style.transform += `translateX(-${this.containerWidth}px)`;
                listItem.style.background = 'blue';
            }
        }
    }
}

const carousel = new Carousel();


const slides = [
    'slide 1',
    'slide 2',
    'slide 3',
    'slide 4',
    'slide 5',
];
carousel.render(slides)

