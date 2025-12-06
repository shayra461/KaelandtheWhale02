document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    window.openLightbox = (index) => {
        if (lightbox && galleryItems[index]) {
            lightbox.style.display = 'flex';
            lightboxImg.src = galleryItems[index].src;
        }
    };

    window.closeLightbox = () => {
        if (lightbox) {
            lightbox.style.display = 'none';
        }
    };

    // Close lightbox on outside click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Video Autoplay on Scroll
    const video = document.getElementById('promo-video');
    const videoWrapper = document.querySelector('.video-wrapper');

    if (video) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(error => {
                        console.log("Autoplay prevented by browser policy", error);
                    });
                    videoWrapper.classList.add('playing');
                } else {
                    video.pause();
                    videoWrapper.classList.remove('playing');
                }
            });
        }, { threshold: 0.5 });

        observer.observe(video);
    }

    // Hero Auto Slider
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Realistic Underwater Bubbles Generation
    const bubblesContainer = document.querySelector('.bubbles-container');
    if (bubblesContainer) {
        // Create more bubbles for a fuller effect
        const bubbleCount = 25;

        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');

            // Randomize size - smaller to larger bubbles
            const sizeValue = Math.random() * 50 + 15; // 15px to 65px
            const size = sizeValue + 'px';
            bubble.style.width = size;
            bubble.style.height = size;

            // Random horizontal position
            bubble.style.left = Math.random() * 100 + '%';

            // Choose from realistic bubble animations
            const animations = ['bubbleRiseWobble', 'bubbleRiseSlow', 'bubbleRiseFast'];
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

            bubble.style.animationName = randomAnimation;

            // Vary animation duration based on size (smaller bubbles rise faster)
            const duration = (70 - sizeValue) / 5 + 8; // 8-18 seconds
            bubble.style.animationDuration = duration + 's';

            // Stagger the start times
            bubble.style.animationDelay = Math.random() * 8 + 's';
            bubble.style.animationTimingFunction = 'linear';
            bubble.style.animationIterationCount = 'infinite';

            bubblesContainer.appendChild(bubble);

            // Calculate burst time based on animation type
            let burstPercentage;
            if (randomAnimation === 'bubbleRiseWobble') burstPercentage = 0.91;
            else if (randomAnimation === 'bubbleRiseSlow') burstPercentage = 0.85;
            else if (randomAnimation === 'bubbleRiseFast') burstPercentage = 0.89;

            // Create droplets when bubble bursts
            const animationDelayMs = parseFloat(bubble.style.animationDelay) * 1000;
            const durationMs = duration * 1000;
            const burstTime = durationMs * burstPercentage;

            // Function to schedule droplets for each iteration
            const scheduleDroplets = (initialDelay) => {
                const timeToNextCycle = durationMs - burstTime;

                // Helper to perform burst and hide bubble
                const performBurst = () => {
                    createDroplets(bubble);
                    bubble.style.visibility = 'hidden';

                    // Restore visibility for next cycle
                    setTimeout(() => {
                        bubble.style.visibility = 'visible';
                    }, timeToNextCycle - 100); // Restore slightly before next cycle
                };

                setTimeout(() => {
                    performBurst();
                    // Schedule next burst
                    setInterval(() => {
                        performBurst();
                    }, durationMs);
                }, initialDelay + burstTime);
            };

            scheduleDroplets(animationDelayMs);
        }
    }

    function createDroplets(bubble) {
        // Get bubble position
        const rect = bubble.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Only create droplets if bubble is on screen
        if (centerY < 0 || centerY > window.innerHeight) return;

        const dropletCount = 8; // Number of droplets per burst

        for (let i = 0; i < dropletCount; i++) {
            const droplet = document.createElement('div');
            droplet.classList.add('water-droplet');

            // Position at bubble center
            droplet.style.left = centerX + 'px';
            droplet.style.top = centerY + 'px';

            // Random scatter direction
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 60 + 20; // Scatter distance
            const tx = Math.cos(angle) * distance + 'px';
            const ty = Math.sin(angle) * distance + 'px';

            droplet.style.setProperty('--droplet-x', tx);
            droplet.style.setProperty('--droplet-y', ty);

            document.body.appendChild(droplet);

            // Remove droplet after animation
            setTimeout(() => {
                droplet.remove();
            }, 800);
        }
    }


    // Fun Hero Typography
    const heroHeading = document.querySelector('.hero-text h1');
    if (heroHeading) {
        const text = heroHeading.textContent;
        heroHeading.innerHTML = '';

        // Split text into characters but preserve words to keep wrapping correct
        const words = text.split(' ');

        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap'; // Keep letters of a word together

            [...word].forEach(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.classList.add('fun-char');

                // Random animation properties
                const duration = Math.random() * 3 + 2 + 's'; // 2-5s
                const delay = Math.random() * 2 + 's'; // 0-2s
                const direction = Math.random() > 0.5 ? 'normal' : 'reverse';

                span.style.animation = `funky-dance ${duration} ${delay} ease-in-out infinite ${direction}`;

                wordSpan.appendChild(span);
            });

            heroHeading.appendChild(wordSpan);

            // Add space after word unless it's the last one
            if (wordIndex < words.length - 1) {
                const space = document.createTextNode(' ');
                heroHeading.appendChild(space);
            }
        });
    }
});
