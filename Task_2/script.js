document.addEventListener('DOMContentLoaded', () => {
    // --- Carousel Functionality ---
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    const slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange slides next to one another
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-indicator');
        targetDot.classList.add('current-indicator');
    };

    // When I click left, move slides to the left
    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling;
        const currentDot = dotsNav.querySelector('.current-indicator');
        const prevDot = currentDot.previousElementSibling;

        if (prevSlide) {
            moveToSlide(track, currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
        } else {
            // Loop to end
            const lastSlide = slides[slides.length - 1];
            const lastDot = dots[dots.length - 1];
            moveToSlide(track, currentSlide, lastSlide);
            updateDots(currentDot, lastDot);
        }
    });

    // When I click right, move slides to the right
    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling;
        const currentDot = dotsNav.querySelector('.current-indicator');
        const nextDot = currentDot.nextElementSibling;

        if (nextSlide) {
            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
        } else {
            // Loop to start
            const firstSlide = slides[0];
            const firstDot = dots[0];
            moveToSlide(track, currentSlide, firstSlide);
            updateDots(currentDot, firstDot);
        }
    });
    
    // Dot navigation
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;
        
        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-indicator');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];
        
        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
    });

    // --- API Fetch Functionality ---
    const jokeContainer = document.getElementById('joke-container');
    const newJokeBtn = document.getElementById('new-joke-btn');
    const setupEl = jokeContainer.querySelector('.setup');
    const punchlineEl = jokeContainer.querySelector('.punchline');

    const fetchJoke = async () => {
        setupEl.textContent = 'Loading...';
        punchlineEl.textContent = '';
        
        try {
            const response = await fetch('https://official-joke-api.appspot.com/random_joke');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            setupEl.textContent = data.setup;
            // Add a slight delay for punchline for effect
            setTimeout(() => {
                punchlineEl.textContent = data.punchline;
            }, 500);
            
        } catch (error) {
            console.error('There was a problem fetching the joke:', error);
            setupEl.textContent = 'Failed to load joke. Try again!';
            punchlineEl.textContent = '';
        }
    };

    // Load joke on page load
    fetchJoke();

    // Load joke on button click
    newJokeBtn.addEventListener('click', fetchJoke);
});
