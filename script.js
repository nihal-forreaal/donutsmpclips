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

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Optional: animate only once
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
                if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
                if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
                return num + '+';
            };

            // Update Stats
            if (data.stats) {
                document.getElementById('stat-subs').innerText = formatNum(data.stats.subscriberCount);
                document.getElementById('stat-views').innerText = formatNum(data.stats.viewCount);
                document.getElementById('stat-clips').innerText = formatNum(data.stats.videoCount);
            }

            // Update Videos
            if (data.videos && data.videos.length > 0) {
                // Latest Clip
                const latest = data.videos[0];
                document.getElementById('latest-thumbnail').innerHTML = `<img src="${latest.thumbnail}" alt="Latest Clip" style="width: 100%; height: 100%; object-fit: cover;">`;
                document.getElementById('latest-link').href = `https://www.youtube.com/watch?v=${latest.id}`;
                document.getElementById('latest-link').target = '_blank';

                // Video Grids
                const gridVideos = document.getElementById('grid-videos');
                const gridShorts = document.getElementById('grid-shorts');
                
                // Clear existing placeholders
                gridVideos.innerHTML = '';
                gridShorts.innerHTML = '';

                data.videos.slice(1, 4).forEach(vid => {
                    gridVideos.innerHTML += `
                        <a href="https://www.youtube.com/watch?v=${vid.id}" target="_blank" class="video-card glass-panel" style="text-decoration: none; display: block;">
                            <div class="video-placeholder placeholder-video">
                                <img src="${vid.thumbnail}" alt="Clip Thumbnail" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        </a>
                    `;
                });

                data.videos.slice(4, 8).forEach(vid => {
                    gridShorts.innerHTML += `
                        <a href="https://www.youtube.com/watch?v=${vid.id}" target="_blank" class="video-card glass-panel" style="text-decoration: none; display: block;">
                            <div class="video-placeholder placeholder-short">
                                <img src="${vid.thumbnail}" alt="Short Thumbnail" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        </a>
                    `;
                });

                // Re-observe new elements
                document.querySelectorAll('.video-card').forEach(el => {
                    el.classList.add('animate-hidden');
                    observer.observe(el);
                });
            }
        } catch (error) {
            console.log("Using fallback static data for local development.", error);
        }
    }

    fetchYouTubeData();

});
