document.addEventListener('DOMContentLoaded', () => {

    // --- Interactive "Click to Open" Boxes ---
    const setupInteractiveBox = (toggleBtnId, contentId) => {
        const toggleBtn = document.getElementById(toggleBtnId);
        const contentBox = document.getElementById(contentId);
        
        if (toggleBtn && contentBox) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                contentBox.classList.toggle('hidden');
                toggleBtn.classList.toggle('hidden');
            });

            // Close when clicking outside or inside the content box
            document.addEventListener('click', (e) => {
                if (!contentBox.classList.contains('hidden') && !contentBox.contains(e.target)) {
                    contentBox.classList.add('hidden');
                    toggleBtn.classList.remove('hidden');
                }
            });

            contentBox.addEventListener('click', (e) => {
                e.stopPropagation();
                contentBox.classList.add('hidden');
                toggleBtn.classList.remove('hidden');
            });
        }
    };

    setupInteractiveBox('home-box-toggle', 'home-box-content');

    // --- Dynamic Interactive Boxes (for carousels) ---
    const allProjectToggles = document.querySelectorAll('.project-box-toggle');
    allProjectToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const content = toggle.nextElementSibling;
            content.classList.toggle('hidden');
            toggle.classList.toggle('hidden');
        });
    });

    const allProjectContents = document.querySelectorAll('.project-box-content');
    allProjectContents.forEach(content => {
        content.addEventListener('click', (e) => {
            // Prevent closing if they clicked on a link
            if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) {
                return;
            }
            e.stopPropagation();
            const toggle = content.previousElementSibling;
            content.classList.add('hidden');
            toggle.classList.remove('hidden');
        });
    });

    document.addEventListener('click', (e) => {
        allProjectContents.forEach(content => {
            if (!content.classList.contains('hidden') && !content.contains(e.target)) {
                const toggle = content.previousElementSibling;
                content.classList.add('hidden');
                toggle.classList.remove('hidden');
            }
        });
    });

    // --- Carousels ---
    const setupCarousel = (trackId, prevBtnClass, nextBtnClass) => {
        const track = document.getElementById(trackId);
        if (!track) return;
        
        const slides = Array.from(track.children);
        const nextButton = track.parentElement.nextElementSibling;
        const prevButton = track.parentElement.previousElementSibling;

        let currentIndex = 0;

        const updateSlide = () => {
            slides.forEach((slide, index) => {
                if (index === currentIndex) {
                    slide.classList.remove('hidden-slide');
                    slide.classList.add('current-slide');
                } else {
                    slide.classList.add('hidden-slide');
                    slide.classList.remove('current-slide');
                    
                    // Also close any open interactive boxes in hidden slides
                    const content = slide.querySelector('.project-box-content');
                    const toggle = slide.querySelector('.project-box-toggle');
                    if (content && toggle) {
                        content.classList.add('hidden');
                        toggle.classList.remove('hidden');
                    }
                }
            });
        };

        if (nextButton && prevButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
                updateSlide();
            });

            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
                updateSlide();
            });
        }
    };

    setupCarousel('projects-track', 'prev-btn', 'next-btn');
    setupCarousel('education-track', 'edu-prev-btn', 'edu-next-btn');


    // --- Contact Modal ---
    const contactBtn = document.getElementById('contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (contactBtn && contactModal && closeModalBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.remove('hidden');
        });

        closeModalBtn.addEventListener('click', () => {
            contactModal.classList.add('hidden');
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !contactModal.classList.contains('hidden')) {
                contactModal.classList.add('hidden');
            }
        });
    }

    // --- Press and Scroll Indicators ---
    const scrollContainer = document.querySelector('.scroll-container');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const pressIndicator = document.querySelector('.press-indicator');
    const sections = document.querySelectorAll('.section-panel');

    const scrollToNextSection = () => {
        if (!scrollContainer) return;
        let currentScroll = scrollContainer.scrollTop;
        let viewportHeight = window.innerHeight;
        // Find next section boundary
        let targetScroll = Math.ceil((currentScroll + 10) / viewportHeight) * viewportHeight;
        
        // If at the bottom, loop back to top or just don't scroll
        if (targetScroll >= scrollContainer.scrollHeight) {
            targetScroll = 0; // go back to top
        }

        scrollContainer.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    };

    const triggerCurrentSectionAction = () => {
        // Find the currently visible section
        if (!scrollContainer) return;
        let currentScroll = scrollContainer.scrollTop;
        let viewportHeight = window.innerHeight;
        let currentIndex = Math.round(currentScroll / viewportHeight);
        
        if (currentIndex >= 0 && currentIndex < sections.length) {
            const currentSection = sections[currentIndex];
            
            // Try to find a visible click-to-open button inside current slide or section
            const visibleToggle = currentSection.querySelector('.current-slide .click-to-open:not(.hidden)') || 
                                  currentSection.querySelector('.click-to-open:not(.hidden)');
            
            if (visibleToggle) {
                visibleToggle.click();
            } else {
                // If already open, close it
                const visibleContent = currentSection.querySelector('.current-slide .box-content:not(.hidden)') || 
                                       currentSection.querySelector('.box-content:not(.hidden)');
                if (visibleContent) {
                    visibleContent.click();
                }
            }
        }
    };

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', scrollToNextSection);
    }

    if (pressIndicator) {
        pressIndicator.addEventListener('click', triggerCurrentSectionAction);
    }

    // Keyboard controls for press and scroll
    document.addEventListener('keydown', (e) => {
        // Don't trigger if user is typing in the contact form
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'Enter') {
            e.preventDefault();
            triggerCurrentSectionAction();
        } else if (e.key === 'ArrowDown' || e.key === ' ') {
            // Let native scroll happen for ArrowDown and Space, or force it if it's not smooth
            // Using default scroll behavior is usually fine, but if we want to ensure snapping:
            // scrollToNextSection(); 
        }
    });

});
