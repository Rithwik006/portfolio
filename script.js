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


    // --- Contact Modal & Form ---
    const contactBtn = document.getElementById('contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (contactBtn && contactModal && closeModalBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.remove('hidden');
        });

        closeModalBtn.addEventListener('click', () => {
            contactModal.classList.add('hidden');
            if (formStatus) formStatus.style.display = 'none';
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !contactModal.classList.contains('hidden')) {
                contactModal.classList.add('hidden');
                if (formStatus) formStatus.style.display = 'none';
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('contact-email');
            const subjectInput = document.getElementById('contact-subject');
            const messageInput = document.getElementById('contact-message');

            const senderEmail = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            const targetEmail = 'rithwikgoudb006@gmail.com';

            if (!senderEmail || !subject || !message) return;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'SENDING...';
            }
            if (formStatus) {
                formStatus.style.display = 'block';
                formStatus.textContent = 'SENDING MESSAGE...';
            }

            try {
                const formData = new FormData();
                formData.append('email', senderEmail);
                formData.append('_replyto', senderEmail);
                formData.append('_subject', subject);
                formData.append('subject', subject);
                formData.append('message', message);
                formData.append('_captcha', 'false');
                formData.append('_template', 'table');

                const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                const result = await response.json().catch(() => ({}));

                if (response.ok && (result.success === 'true' || result.success === true)) {
                    if (formStatus) {
                        formStatus.textContent = 'MESSAGE SENT SUCCESSFULLY!';
                    }
                    contactForm.reset();
                } else if (result.message && result.message.toLowerCase().includes('activation')) {
                    if (formStatus) {
                        formStatus.textContent = 'PLEASE CHECK RITHWIKGOUDB006@GMAIL.COM AND CLICK "ACTIVATE FORM" TO RECEIVE MESSAGES.';
                    }
                    contactForm.reset();
                } else {
                    if (formStatus) {
                        formStatus.textContent = result.message || 'MESSAGE SUBMITTED! (NOTE: MUST BE OPENED VIA LIVE SERVER / VERCEL URL)';
                    }
                }
            } catch (err) {
                if (formStatus) {
                    formStatus.textContent = 'ERROR SENDING MESSAGE. MAKE SURE SITE IS OPENED VIA HTTP/HTTPS (NOT FILE://).';
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'SUBMIT';
                }
            }
        });
    }

    // --- Press (Go Back) and Scroll (Next Page) Indicators ---
    const scrollContainer = document.querySelector('.scroll-container');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const pressIndicator = document.querySelector('.press-indicator');
    const sections = document.querySelectorAll('.section-panel');

    const scrollToNextSection = () => {
        if (!scrollContainer) return;
        let currentScroll = scrollContainer.scrollTop;
        let viewportHeight = scrollContainer.clientHeight || window.innerHeight;
        // Find next section boundary
        let targetScroll = Math.ceil((currentScroll + 10) / viewportHeight) * viewportHeight;
        
        // If at the bottom, loop back to top
        if (targetScroll >= scrollContainer.scrollHeight) {
            targetScroll = 0;
        }

        scrollContainer.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    };

    const goBackSection = () => {
        // 1. If contact modal is open, close it first
        if (contactModal && !contactModal.classList.contains('hidden')) {
            contactModal.classList.add('hidden');
            if (formStatus) formStatus.style.display = 'none';
            return;
        }

        if (!scrollContainer) return;
        let currentScroll = scrollContainer.scrollTop;
        let viewportHeight = scrollContainer.clientHeight || window.innerHeight;
        let currentIndex = Math.round(currentScroll / viewportHeight);

        // 2. If we are past the first section, scroll back to the previous section/page
        if (currentIndex > 0) {
            let targetScroll = (currentIndex - 1) * viewportHeight;
            scrollContainer.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
            return;
        }

        // 3. If on the first section (#home), close any open interactive box or go back in browser history
        const currentSection = sections[0];
        if (currentSection) {
            const openContent = currentSection.querySelector('.box-content:not(.hidden)');
            const toggleBtn = currentSection.querySelector('.click-to-open');
            if (openContent && toggleBtn) {
                openContent.classList.add('hidden');
                toggleBtn.classList.remove('hidden');
                return;
            }
        }

        if (window.history.length > 1) {
            window.history.back();
        }
    };

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', (e) => {
            e.stopPropagation();
            scrollToNextSection();
        });
    }

    if (pressIndicator) {
        pressIndicator.addEventListener('click', (e) => {
            e.stopPropagation();
            goBackSection();
        });
    }

    // Keyboard controls for press (go back) and scroll
    document.addEventListener('keydown', (e) => {
        // Don't trigger if user is typing in the contact form
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'Enter' || e.key === 'Backspace') {
            e.preventDefault();
            goBackSection();
        }
    });

});
