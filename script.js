

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close nav when clicking a link
document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
}));

// Typing Animation
const words = ["Rithwik", "A Developer", "An Innovator"];
let i = 0;
let timer;

function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
        if (word.length > 0) {
            document.getElementById('typewriter').innerHTML += word.shift();
        } else {
            deletingEffect();
            return false;
        }
        timer = setTimeout(loopTyping, 150);
    };
    loopTyping();
}

function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            document.getElementById('typewriter').innerHTML = word.join("");
        } else {
            if (words.length > (i + 1)) {
                i++;
            } else {
                i = 0;
            }
            typingEffect();
            return false;
        }
        timer = setTimeout(loopDeleting, 100);
    };
    setTimeout(loopDeleting, 2000); // Wait before deleting
}

// Start typing effect
typingEffect();

// Split text for letter-by-letter reveal
document.querySelectorAll('.letter-reveal').forEach(el => {
    const text = el.innerText;
    el.innerHTML = '';
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.style.transitionDelay = `${i * 10}ms`;
        span.innerHTML = char === ' ' ? ' ' : char;
        el.appendChild(span);
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Trigger progress bar animation if it's a skill category
            if (entry.target.classList.contains('skill-category')) {
                const progressBars = entry.target.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
            }
        } else {
            // Optional: Remove active class when scrolling out to trigger animation again
            entry.target.classList.remove('active');
            
            if (entry.target.classList.contains('skill-category')) {
                const progressBars = entry.target.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    bar.style.width = '0';
                });
            }
        }
    });
}, observerOptions);

// Elements to observe
document.querySelectorAll('.scroll-fade-up, .reveal-text, .letter-reveal').forEach(el => {
    scrollObserver.observe(el);
});

// Sparkle Particle Background (Canvas)
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});



// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    
    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    // Update particle position
    update() {
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        

        
        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        
        // Add scroll drift effect
        this.y -= window.scrollY * 0.001 * this.directionY;

        this.draw();
    }
}

// Create particle array
function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 40000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.5;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        
        // Randomly pick cyan or blue
        let colors = ['rgba(0, 242, 255, 0.6)', 'rgba(0, 102, 255, 0.6)', 'rgba(255, 255, 255, 0.3)'];
        let color = colors[Math.floor(Math.random() * colors.length)];
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Animation loop
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

// Start particle system
initParticles();
animateParticles();

// Sparkle trail on scroll
let isScrolling;
window.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    
    // Add extra temporary particles while scrolling
    if(particlesArray.length < 80) {
        for(let i=0; i<3; i++) {
            let size = Math.random() * 3 + 1;
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            let dirX = (Math.random() * 2) - 1;
            // Particles float upwards while scrolling down
            let dirY = -Math.random() * 3 - 1; 
            particlesArray.push(new Particle(x, y, dirX, dirY, size, 'rgba(0, 242, 255, 0.8)'));
        }
    }

    isScrolling = setTimeout(() => {
        // Remove extra particles after scrolling stops
        initParticles(); 
    }, 200);
}, false);

// Database Fetch Integration
async function loadProjectsFromDatabase() {
    try {
        // Automatically switch between Local and Production API
        const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000'
            : 'https://portfolio-backend-5nz2.onrender.com';
            
        const response = await fetch(`${API_BASE_URL}/api/projects`);
        if (!response.ok) throw new Error('Database server not responding');
        
        const projects = await response.json();
        
        if (projects.length > 0) {
            const projectsGrid = document.querySelector('.projects-grid');
            projectsGrid.innerHTML = ''; // Clear static projects
            
            projects.forEach((project, index) => {
                const delayClass = index === 0 ? '' : `delay-${index}`;
                
                const techSpans = project.techStack.map(tech => `<span>${tech}</span>`).join('');
                
                const projectHTML = `
                <div class="project-card glass-card scroll-fade-up ${delayClass} active">
                    <div class="project-image">
                        <img src="${project.imageUrl}" alt="${project.title}">
                        <div class="project-overlay">
                            <div class="project-links">
                                <a href="${project.githubLink}" target="_blank" class="icon-btn"><i class="fa-brands fa-github"></i></a>
                                <a href="${project.liveLink}" target="_blank" class="icon-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="tech-stack">
                            ${techSpans}
                        </div>
                    </div>
                </div>
                `;
                projectsGrid.innerHTML += projectHTML;
            });
        }
    } catch (error) {
        console.log('Using static projects display. Database not connected:', error.message);
    }
}

// Attempt to load database projects
loadProjectsFromDatabase();
