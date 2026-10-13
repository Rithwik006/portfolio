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
                formStatus.textContent = 'TRANSMITTING MESSAGE...';
            }

            try {
                const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: senderEmail,
                        _replyto: senderEmail,
                        _subject: subject,
                        message: `From: ${senderEmail}\n\n${message}`
                    })
                });

                const result = await response.json().catch(() => ({}));

                if (response.ok && (result.success === 'true' || result.success === true)) {
                    if (formStatus) {
                        formStatus.textContent = 'MESSAGE SENT SUCCESSFULLY TO RITHWIKGOUDB006@GMAIL.COM!';
                    }
                    contactForm.reset();
                } else {
                    // Fallback to mailto with pre-filled subject and body
                    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${senderEmail}\n\n${message}`)}`;
                    window.location.href = mailtoUrl;
                    if (formStatus) {
                        formStatus.textContent = 'OPENING EMAIL CLIENT FOR RITHWIKGOUDB006@GMAIL.COM...';
                    }
                    contactForm.reset();
                }
            } catch (err) {
                // Fallback to mailto if offline or blocked
                const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${senderEmail}\n\n${message}`)}`;
                window.location.href = mailtoUrl;
                if (formStatus) {
                    formStatus.textContent = 'OPENING EMAIL CLIENT FOR RITHWIKGOUDB006@GMAIL.COM...';
                }
                contactForm.reset();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'SUBMIT';
                }
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

    const triggerCurrentSectionAction = () => {
        if (!scrollContainer) return;
        let currentScroll = scrollContainer.scrollTop;
        let viewportHeight = scrollContainer.clientHeight || window.innerHeight;
        let currentIndex = Math.round(currentScroll / viewportHeight);
        
        if (currentIndex >= 0 && currentIndex < sections.length) {
            const currentSection = sections[currentIndex];
            
            // Find the interactive box in the active carousel slide or directly in the section
            const activeContainer = currentSection.querySelector('.current-slide') || currentSection;
            const toggleBtn = activeContainer.querySelector('.click-to-open');
            const contentBox = activeContainer.querySelector('.box-content');

            if (toggleBtn && contentBox) {
                const isContentHidden = contentBox.classList.contains('hidden');
                if (isContentHidden) {
                    contentBox.classList.remove('hidden');
                    toggleBtn.classList.add('hidden');
                } else {
                    contentBox.classList.add('hidden');
                    toggleBtn.classList.remove('hidden');
                }
            } else {
                // For sections without an interactive box (e.g., Skills), advance to the next section
                scrollToNextSection();
            }
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
            triggerCurrentSectionAction();
        });
    }

    // Keyboard controls for press and scroll
    document.addEventListener('keydown', (e) => {
        // Don't trigger if user is typing in the contact form
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'Enter') {
            e.preventDefault();
            triggerCurrentSectionAction();
        }
    });

});
