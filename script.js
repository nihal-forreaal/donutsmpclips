document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ==========================================
    // TOAST NOTIFICATION SYSTEM
    // ==========================================
    const toast = document.getElementById('toast');
    function showToast(message) {
        if (!toast) return;
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ==========================================
    // COPY SERVER IP WIDGET
    // ==========================================
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

    // ==========================================
    // BACK TO TOP BUTTON  (FIX: null guard before scroll listener)
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (!backToTopBtn) return;
        backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // HAMBURGER MENU
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav   = document.getElementById('mobile-nav');

    function closeMobileNav() {
        if (!hamburgerBtn || !mobileNav) return;
        hamburgerBtn.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });

        // Close when a nav link is tapped
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }

    // ==========================================
    // VIDEO MODAL
    // ==========================================
    const videoModal    = document.getElementById('video-modal');
    const modalIframe   = document.getElementById('modal-iframe');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function openVideoModal(videoId) {
        if (!videoModal || !modalIframe) return;
        modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
        if (!videoModal || !modalIframe) return;
        videoModal.classList.remove('active');
        // Delay clearing src so the video stops after the fade-out finishes
        setTimeout(() => { if (modalIframe) modalIframe.src = ''; }, 300);
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeVideoModal);
    if (videoModal)    videoModal.addEventListener('click', e => { if (e.target === videoModal) closeVideoModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideoModal(); });

    // ==========================================
    // CONFETTI PARTICLE SYSTEM
    // ==========================================
    function triggerConfetti() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#0077ff', '#00ff88', '#ff0000', '#ffd700', '#ff00ff'];
        const particles = Array.from({ length: 150 }, () => ({
            x:       Math.random() * canvas.width,
            y:       Math.random() * canvas.height - canvas.height,
            size:    Math.random() * 8 + 4,
            color:   colors[Math.floor(Math.random() * colors.length)],
            speedY:  Math.random() * 6 + 3,
            speedX:  Math.random() * 4 - 2,
        }));

        let frame = 0;
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            if (++frame < 260) requestAnimationFrame(render);
            else canvas.remove();
        }
        render();
    }

    // ==========================================
    // EASTER EGG: 1,000 SUBS
    // ==========================================
    function unlockEasterEgg(isPreview = false) {
        const banner = document.getElementById('easter-egg-banner');
        const text   = document.getElementById('easter-egg-text');
        triggerConfetti();
        if (banner) banner.classList.add('unlocked');
        if (text) {
            text.innerHTML = isPreview
                ? '🎉 <strong>Help me to hit 1000 subcribers on youtube !!</strong> Thank you for supporting DonutSMP Clips! 🚀🍩'
                : '🏆 <strong>1,000 SUBSCRIBERS MILESTONE REACHED!</strong> Thank you everyone for helping hit 1,000 subscribers! 🍩🎉';
        }
    }

    const statSubsCard = document.getElementById('stat-subs-card');
    let subClickCount = 0;
    if (statSubsCard) {
        statSubsCard.addEventListener('click', () => {
            subClickCount++;
            if (subClickCount >= 5) {
                subClickCount = 0;
                unlockEasterEgg(true);
            } else {
                showToast(`🎉 Click ${5 - subClickCount} more times to preview celebration!`);
            }
        });
    }

    // ==========================================
    // SMOOTH SCROLLING
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    function animateCount(element, targetVal, duration = 1200) {
        if (!element) return;
        const numericTarget = parseInt(String(targetVal).replace(/[^0-9]/g, ''), 10);
        if (isNaN(numericTarget) || numericTarget === 0) { element.innerText = targetVal; return; }

        const startTime = performance.now();
        function updateCount(currentTime) {
            const progress  = Math.min((currentTime - startTime) / duration, 1);
            const easeOut   = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOut * numericTarget);

            let formatted = currentVal.toLocaleString();
            if (numericTarget >= 1000000) formatted = (currentVal / 1000000).toFixed(1) + 'M';
            else if (numericTarget >= 1000) formatted = (currentVal / 1000).toFixed(0) + 'K';

            element.innerText = formatted + '+';

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                const final = numericTarget >= 1000000
                    ? (numericTarget / 1000000).toFixed(1) + 'M+'
                    : numericTarget >= 1000
                        ? (numericTarget / 1000).toFixed(0) + 'K+'
                        : numericTarget.toLocaleString() + '+';
                element.innerText = final;
                element.classList.add('stat-pop');
                setTimeout(() => element.classList.remove('stat-pop'), 400);
            }
        }
        requestAnimationFrame(updateCount);
    }

    // ==========================================
    // INTERSECTION OBSERVER (SCROLL ANIMATIONS)
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
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
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('section, .video-card, .latest-clip-card, .stat-item, .contact-card').forEach(el => {
        el.classList.add('animate-hidden');
        observer.observe(el);
    });

    // ==========================================
    // VIDEO CARD BUILDERS  (High-Quality Thumbnails + Fallback)
    // ==========================================
    // Modern Redesigned Play Button Component
    const PLAY_ICON_PATH = 'M8.5 5.75C8.5 4.96 9.38 4.47 10.05 4.88L19.25 10.63C19.89 11.03 19.89 11.97 19.25 12.37L10.05 18.12C9.38 18.53 8.5 18.04 8.5 17.25V5.75Z';
    const PLAY_BTN = `
        <div class="play-btn-wrapper">
            <div class="play-btn-glow"></div>
            <div class="play-btn-disc">
                <svg viewBox="0 0 24 24" class="play-btn-icon" fill="currentColor"><path d="${PLAY_ICON_PATH}"/></svg>
            </div>
        </div>`;
    const PLAY_BTN_LG = `
        <div class="play-btn-wrapper play-btn-lg">
            <div class="play-btn-glow"></div>
            <div class="play-btn-disc">
                <svg viewBox="0 0 24 24" class="play-btn-icon" fill="currentColor"><path d="${PLAY_ICON_PATH}"/></svg>
            </div>
        </div>`;
    const OVERLAY = `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.22);display:flex;align-items:center;justify-content:center;">${PLAY_BTN}</div>`;

    function getBestThumb(vid) {
        if (vid.thumbnail && (vid.thumbnail.includes('maxres') || vid.thumbnail.includes('sddefault'))) {
            return vid.thumbnail;
        }
        return `https://i.ytimg.com/vi/${vid.id}/maxresdefault.jpg`;
    }

    function buildVideoCard(vid) {
        const thumbUrl = getBestThumb(vid);
        return `
            <div class="video-card glass-panel" data-video-id="${vid.id}" style="cursor:pointer;text-decoration:none;display:flex;flex-direction:column;">
                <div class="video-placeholder placeholder-video" style="position:relative;">
                    <img src="${thumbUrl}" alt="${vid.title}" class="clip-img" loading="lazy" onerror="if(!this.dataset.triedHq){this.dataset.triedHq='true';this.src='https://i.ytimg.com/vi/${vid.id}/hqdefault.jpg';}">
                    ${OVERLAY}
                </div>
                <div style="padding:1rem;color:var(--text-main);font-weight:700;font-size:0.95rem;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    ${vid.title}
                </div>
            </div>`;
    }

    function buildShortCard(vid) {
        // Shorts have a native vertical 1080x1920 thumbnail (oar2.jpg)
        const primaryThumb = vid.thumbnail && vid.thumbnail.includes('oar2') 
            ? vid.thumbnail 
            : `https://i.ytimg.com/vi/${vid.id}/oar2.jpg`;
        const fallbackThumb = `https://i.ytimg.com/vi/${vid.id}/maxresdefault.jpg`;
        const hq720Thumb    = `https://i.ytimg.com/vi/${vid.id}/hq720.jpg`;
        const hqThumb       = `https://i.ytimg.com/vi/${vid.id}/hqdefault.jpg`;

        return `
            <div class="video-card glass-panel" data-video-id="${vid.id}" data-is-short="true" style="cursor:pointer;text-decoration:none;display:flex;flex-direction:column;">
                <div class="video-placeholder placeholder-short" style="position:relative;">
                    <img src="${primaryThumb}" 
                         alt="${vid.title}" 
                         class="clip-img" 
                         loading="lazy" 
                         onerror="if(!this.dataset.step){this.dataset.step='1';this.src='${fallbackThumb}';}else if(this.dataset.step==='1'){this.dataset.step='2';this.src='${hq720Thumb}';}else if(this.dataset.step==='2'){this.dataset.step='3';this.src='${hqThumb}';}">
                    ${OVERLAY}
                </div>
                <div style="padding:0.8rem;color:var(--text-main);font-weight:700;font-size:0.85rem;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    ${vid.title}
                </div>
            </div>`;
    }

    // Attach click→modal to all [data-video-id] elements
    function attachModalListeners() {
        document.querySelectorAll('[data-video-id]').forEach(card => {
            // Remove old listener by cloning (safe since cards are freshly injected)
            card.addEventListener('click', () => {
                const id = card.dataset.videoId;
                if (id) openVideoModal(id);
            });
        });
    }

    // ==========================================
    // FETCH YOUTUBE DATA
    // ==========================================
    async function fetchYouTubeData() {
        try {
            const res = await fetch('/api/youtube');
            if (!res.ok) throw new Error('API not available locally');
            const data = await res.json();

            // --- Stats ---
            if (data.stats) {
                const subEl  = document.getElementById('stat-subs');
                const viewEl = document.getElementById('stat-views');
                const clipEl = document.getElementById('stat-clips');
                if (subEl)  animateCount(subEl,  data.stats.subscriberCount);
                if (viewEl) animateCount(viewEl, data.stats.viewCount);
                if (clipEl) animateCount(clipEl, data.stats.videoCount);
                if (parseInt(data.stats.subscriberCount, 10) >= 1000) unlockEasterEgg(false);
            }

            // --- Latest Clip ---
            if (data.latest) {
                const latest      = data.latest;
                const latestThumb = document.getElementById('latest-thumbnail');
                const latestLink  = document.getElementById('latest-link');
                const latestCard  = document.getElementById('latest-clip-card');
                const thumbUrl    = getBestThumb(latest);

                // Wire latest card to modal (remove href, add data-video-id)
                if (latestCard) {
                    latestCard.dataset.videoId = latest.id;
                    latestCard.removeAttribute('href');
                    latestCard.style.cursor = 'pointer';
                }

                if (latestThumb) {
                    latestThumb.innerHTML = `
                        <img src="${thumbUrl}" alt="${latest.title}" class="clip-img" loading="eager" onerror="if(!this.dataset.triedHq){this.dataset.triedHq='true';this.src='https://i.ytimg.com/vi/${latest.id}/hqdefault.jpg';}">
                        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.22);display:flex;align-items:center;justify-content:center;">
                            ${PLAY_BTN_LG}
                        </div>`;
                }
                if (latestLink) latestLink.innerText = `${latest.title || 'Watch Clip'} →`;
            }

            // --- Best Clips ---
            const gridVideos = document.getElementById('grid-videos');
            if (gridVideos && data.longForm && data.longForm.length > 0) {
                gridVideos.innerHTML = data.longForm.slice(0, 3).map(buildVideoCard).join('');
            }

            // --- Shorts ---
            const gridShorts = document.getElementById('grid-shorts');
            if (gridShorts && data.shorts && data.shorts.length > 0) {
                gridShorts.innerHTML = data.shorts.slice(0, 4).map(buildShortCard).join('');
            }

            // Wire all cards + latest to modal
            attachModalListeners();

            // Animate newly injected cards
            document.querySelectorAll('.video-card').forEach(el => {
                el.classList.add('animate-hidden');
                observer.observe(el);
            });

        } catch (error) {
            console.log('Using fallback static data for local development.', error);
        }
    }

    fetchYouTubeData();

});
