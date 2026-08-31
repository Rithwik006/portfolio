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

});
