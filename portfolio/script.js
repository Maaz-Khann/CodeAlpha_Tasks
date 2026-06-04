document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // 3. Typewriter Effect
    const words = [
        "Database Architectures", 
        "Web Applications", 
        "IoT Ecosystems", 
        "High-Performance Tools"
    ];
    let wordIndex = 0;
    let timer;

    function typingEffect() {
        let word = words[wordIndex].split("");
        let loopTyping = function() {
            if (word.length > 0) {
                document.getElementById('typewriter').innerHTML += word.shift();
            } else {
                setTimeout(deletingEffect, 2000);
                return false;
            }
            timer = setTimeout(loopTyping, 100);
        };
        loopTyping();
    }

    function deletingEffect() {
        let word = words[wordIndex].split("");
        let loopDeleting = function() {
            if (word.length > 0) {
                word.pop();
                document.getElementById('typewriter').innerHTML = word.join("");
            } else {
                if (words.length > (wordIndex + 1)) {
                    wordIndex++;
                } else {
                    wordIndex = 0;
                }
                typingEffect();
                return false;
            }
            timer = setTimeout(loopDeleting, 50);
        };
        loopDeleting();
    }

    // Start typewriter
    typingEffect();

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 5. Contact Form Submission Simulation
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = 'Sending...';
        btn.style.opacity = '0.8';
        
        // Simulate API call
        setTimeout(() => {
            btn.innerText = 'Message Sent!';
            btn.style.background = '#10b981'; // Green success color
            form.reset();
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
                btn.style.opacity = '1';
            }, 3000);
        }, 1500);
    });
});
