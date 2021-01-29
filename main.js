import './style.scss';

class Carousel {
    constructor(
        options = {}
    ) {
        const {
            limit = 3,
            animationTime = 500,
        } = options;

        this.$nextBtn = document.querySelector('.next-btn');
        this.$prevBtn = document.querySelector('.prev-btn');
        this.container = document.querySelector('.carousel-container');
        this.containerWidth = this.container.getClientRects()[0].width;

        this.animationTime = animationTime;
        this.limit = limit;
    }

    changeSlide(isNext = true) {
        const currentSlide = document.querySelector('.slide.active');
        const closest = currentSlide[isNext ? 'nextElementSibling' : 'previousElementSibling'];
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

    removeSlide(isNext = true) {
        let allSlides = document.querySelectorAll('.slide');
        const currentSlide = document.querySelector('.slide.active');
        const currentSlideIndex = +currentSlide.getAttribute('data-slide-index');

        const indexForDelete = currentSlideIndex + (isNext ? -2 : 2);
        const condition = isNext
            ?  currentSlideIndex - 2 >= 0
            : currentSlideIndex + 2 <= allSlides.length - 1;
        const sign = isNext ? '' : '-';
        const insertMethod = isNext ? 'append' : 'prepend';

        const setDataSlideIndex = () => {
            allSlides = document.querySelectorAll('.slide');

            for (let i = 0; i < allSlides.length; i++) {
                allSlides[i].setAttribute('data-slide-index', i.toString());
            }
        }

        const forRemove = document.querySelector(`[data-slide-index='${indexForDelete}']`);
        let clone = forRemove.cloneNode(true);
        forRemove.remove();

        if (condition) {
            clone.setAttribute('data-slide-index', allSlides.length);
            clone.style.transform = `translateX(${sign}${this.containerWidth}px)`;

            document.querySelector('ul')[insertMethod](clone);

            setDataSlideIndex();
        }
    }

    addEvents() {
        this.$nextBtn.addEventListener('click', e => {
            e.preventDefault()
            this.changeSlide()
            this.removeSlide()
        })

        this.$prevBtn.addEventListener('click', e => {
            e.preventDefault()
            this.changeSlide(false);
            this.removeSlide(false)
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
            listItem.style.transitionDuration = `${this.animationTime}ms`;

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
                listItem.setAttribute('data-slide-index', (0).toString());
                list.prepend(listItem)
                break;
            }

            listItem.setAttribute('data-slide-index', (i + 1).toString());

            list.append(listItem);
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

