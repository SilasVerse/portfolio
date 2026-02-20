        (function() {
            // sticky + active nav
            let header = document.querySelector('.header');
            let sections = document.querySelectorAll('section');
            let navLinks = document.querySelectorAll('.navbar a');

            function updateActive() {
                let top = window.scrollY;
                sections.forEach(sec => {
                    let offset = sec.offsetTop - 150;
                    let height = sec.offsetHeight;
                    let id = sec.getAttribute('id');
                    if (top >= offset && top < offset + height) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === '#' + id) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }

            window.addEventListener('scroll', () => {
                header.classList.toggle('sticky', window.scrollY > 50);
                updateActive();
            });

            // dark mode toggle
            let darkIcon = document.getElementById('darkMode-icon');
            darkIcon.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                darkIcon.classList.toggle('bx-sun');
                darkIcon.classList.toggle('bx-moon');
            });

            const skillBars = document.querySelectorAll('.skill-bar');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.width = entry.target.style.width; 
                    }
                });
            }, { threshold: 0.2 });
            skillBars.forEach(bar => observer.observe(bar));
        })();
