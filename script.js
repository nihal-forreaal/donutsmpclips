document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toast Notification System
    const toast = document.getElementById('toast');
    function showToast(message) {
        if (!toast) return;
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // Copy Server IP Widget
    const copyIpBtn = document.getElementById('copy-ip-btn');
    if (copyIpBtn) {
        copyIpBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('donutsmp.net').then(() => {
                showToast('📋 Server IP copied: donutsmp.net!');
            }).catch(() => {
                showToast('📋 Server IP: donutsmp.net');
            });
        });
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Confetti Particle System for 1,000 Subs Easter Egg
    function triggerConfetti() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#0077ff', '#00ff88', '#ff0000', '#ffd700', '#ff00ff'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 6 + 3,
                speedX: Math.random() * 4 - 2,
                rotation: Math.random() * 360
            });
        }

        let frame = 0;
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            frame++;
            if (frame < 260) {
                requestAnimationFrame(render);
            } else {
                canvas.remove();
            }
        }
        render();
    }

    // 1,000 Subs Easter Egg Handler
    function unlockEasterEgg(isPreview = false) {
        const banner = document.getElementById('easter-egg-banner');
        const text = document.getElementById('easter-egg-text');
        
        triggerConfetti();
        
        if (banner) {
            banner.classList.add('unlocked');
        }
        if (text) {
            text.innerHTML = isPreview 
                ? '🎉 <strong>1,000 SUBS EASTER EGG UNLOCKED (PREVIEW MODE)!</strong> Thank you for supporting DonutSMP Clips! 🚀🍩' 
                : '🏆 <strong>1,000 SUBSCRIBERS MILESTONE REACHED!</strong> Celebration Easter Egg Unlocked! Thank you everyone! 🍩🎉';
        }
    }

    // Secret Cheat Code: Click Subscribers 5 Times to Trigger 1,000 Subs Easter Egg Preview
    const statSubsCard = document.getElementById('stat-subs-card');
    let subClickCount = 0;
    if (statSubsCard) {
        statSubsCard.addEventListener('click', () => {
            subClickCount++;
            if (subClickCount >= 5) {
                subClickCount = 0;
                unlockEasterEgg(true);
            } else {
                showToast(`🎉 Click ${5 - subClickCount} more times to unlock 1,000 Subs Easter Egg!`);
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Number counter animation function
    function animateCount(element, targetVal, duration = 1200) {
        if (!element) return;
        const numericTarget = parseInt(String(targetVal).replace(/[^0-9]/g, ''), 10);
        if (isNaN(numericTarget) || numericTarget === 0) {
            element.innerText = targetVal;
            return;
        }

        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Cubic ease-out
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOut * numericTarget);

            let formatted = currentVal.toLocaleString();
            if (numericTarget >= 1000000) formatted = (currentVal / 1000000).toFixed(1) + 'M';
            else if (numericTarget >= 1000) formatted = (currentVal / 1000).toFixed(0) + 'K';

            element.innerText = formatted + '+';

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.innerText = (numericTarget >= 1000000 ? (numericTarget / 1000000).toFixed(1) + 'M' : (numericTarget >= 1000 ? (numericTarget / 1000).toFixed(0) + 'K' : numericTarget.toLocaleString())) + '+';
                element.classList.add('stat-pop');
                setTimeout(() => element.classList.remove('stat-pop'), 400);
            }
        }

        requestAnimationFrame(updateCount);
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate stats counting up when stat items come into view
                if (entry.target.classList.contains('stat-item')) {
                    const h3 = entry.target.querySelector('h3');
                    if (h3 && !h3.dataset.animated) {
                        h3.dataset.animated = 'true';
                        animateCount(h3, h3.innerText);
                    }
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('section, .video-card, .latest-clip-card, .stat-item, .contact-card').forEach(el => {
        el.classList.add('animate-hidden');
        observer.observe(el);
    });

    // Fetch YouTube Data
    async function fetchYouTubeData() {
        try {
            const res = await fetch('/api/youtube');
            if (!res.ok) throw new Error('API not available locally');
            
            const data = await res.json();
            
            // Format numbers nicely
            const formatNum = (num) => {
                const n = parseInt(num, 10);
                if (isNaN(n)) return num || '0';
                if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M+';
                if (n >= 1000) return (n / 1000).toFixed(0) + 'K+';
                return n.toLocaleString() + '+';
            };

            // Update Stats with counting animation & Easter Egg check
            if (data.stats) {
                const subEl = document.getElementById('stat-subs');
                const viewEl = document.getElementById('stat-views');
                const clipEl = document.getElementById('stat-clips');

                if (subEl) animateCount(subEl, data.stats.subscriberCount);
                if (viewEl) animateCount(viewEl, data.stats.viewCount);
                if (clipEl) animateCount(clipEl, data.stats.videoCount);

                // Auto unlock Easter Egg if subscribers hit 1000!
                if (parseInt(data.stats.subscriberCount, 10) >= 1000) {
                    unlockEasterEgg(false);
                }
            }

            // Update Latest Clip
            if (data.latest) {
                const latest = data.latest;
                const latestThumb = document.getElementById('latest-thumbnail');
                const latestLink = document.getElementById('latest-link');
                const latestCard = document.getElementById('latest-clip-card');
                const videoUrl = `https://www.youtube.com/watch?v=${latest.id}`;

                if (latestCard) {
                    latestCard.href = videoUrl;
                    latestCard.target = '_blank';
                }

                if (latestThumb) {
                    latestThumb.innerHTML = `
                        <img src="${latest.thumbnail}" alt="${latest.title}" style="width: 100%; height: 100%; object-fit: cover;">
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 65px; height: 65px; color: var(--primary); filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    `;
                }
                if (latestLink) {
                    latestLink.innerText = `${latest.title || 'Watch Clip'} →`;
                }
            }

            // Update Long Form Videos (Best Clips)
            const gridVideos = document.getElementById('grid-videos');
            if (gridVideos && data.longForm && data.longForm.length > 0) {
                gridVideos.innerHTML = '';
                data.longForm.slice(0, 3).forEach(vid => {
                    gridVideos.innerHTML += `
                        <a href="https://www.youtube.com/watch?v=${vid.id}" target="_blank" class="video-card glass-panel" style="text-decoration: none; display: flex; flex-direction: column;">
                            <div class="video-placeholder placeholder-video" style="position: relative;">
                                <img src="${vid.thumbnail}" alt="${vid.title}" style="width: 100%; height: 100%; object-fit: cover;">
                                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center;">
                                    <svg viewBox="0 0 24 24" fill="currentColor" style="width: 44px; height: 44px; color: var(--primary); filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                            </div>
                            <div style="padding: 1rem; color: var(--text-main); font-weight: 700; font-size: 0.95rem; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${vid.title}
                            </div>
                        </a>
                    `;
                });
            }

            // Update Shorts Only Bar (strictly <= 60 seconds)
            const gridShorts = document.getElementById('grid-shorts');
            if (gridShorts && data.shorts && data.shorts.length > 0) {
                gridShorts.innerHTML = '';
                data.shorts.slice(0, 4).forEach(vid => {
                    gridShorts.innerHTML += `
                        <a href="https://www.youtube.com/shorts/${vid.id}" target="_blank" class="video-card glass-panel" style="text-decoration: none; display: flex; flex-direction: column;">
                            <div class="video-placeholder placeholder-short" style="position: relative;">
                                <img src="${vid.thumbnail}" alt="${vid.title}" style="width: 100%; height: 100%; object-fit: cover;">
                                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center;">
                                    <svg viewBox="0 0 24 24" fill="currentColor" style="width: 44px; height: 44px; color: var(--primary); filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                            </div>
                            <div style="padding: 0.8rem; color: var(--text-main); font-weight: 700; font-size: 0.85rem; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${vid.title}
                            </div>
                        </a>
                    `;
                });
            }

            // Re-observe new elements
            document.querySelectorAll('.video-card').forEach(el => {
                el.classList.add('animate-hidden');
                observer.observe(el);
            });
        } catch (error) {
            console.log("Using fallback static data for local development.", error);
        }
    }

    fetchYouTubeData();

});
