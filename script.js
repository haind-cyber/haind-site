// THÊM ĐOẠN NÀY VÀO ĐẦU FILE
const AudioConfig = {
    volumes: {
        magic: 0.4,
        cosmic: 0.3,
        ambient: 0.1
    },
    files: {
        magic: 'audio/one-love.mp3',
        cosmic: 'audio/cosmic-ambient.mp3'
    },
    settings: {
        loopMagic: true,
        loopCosmic: true,
        autoplayDelay: 1000,
        fadeDuration: 1000
    }
};
// script.js - COMPLETE FIXED VERSION
// Mobile menu toggle - OPTIMIZED
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    // Only add event listener if elements exist
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // Toggle active class
            navMenu.classList.toggle('active');
            
            // Toggle icon với animation
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                // Thêm class active cho nút menu
                mobileMenuBtn.classList.add('active');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenuBtn.classList.remove('active');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navMenu.classList.contains('active')) {
                // Nếu click không phải vào menu hoặc nút menu
                if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                    closeMobileMenu();
                }
            }
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Hàm đóng menu mobile
        function closeMobileMenu() {
            navMenu.classList.remove('active');
            if (mobileMenuBtn.querySelector('i')) {
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.classList.remove('active');
            }
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu && mobileMenuBtn) {
                    navMenu.classList.remove('active');
                    if (mobileMenuBtn.querySelector('i')) {
                        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                        mobileMenuBtn.classList.remove('active');
                    }
                }
                
                // Smooth scroll
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission - with null check
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
                submitBtn.disabled = true;
                
                // Tự động enable lại sau 5s phòng trường hợp lỗi
                setTimeout(() => {
                    submitBtn.innerHTML = 'Gửi tin nhắn';
                    submitBtn.disabled = false;
                }, 5000);
            }
        });
    }

    // Add fade-in animation to sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Add active class styling
    const style = document.createElement('style');
    style.textContent = `
        .nav-menu a.active {
            color: var(--primary) !important;
            font-weight: 600;
        }
        .nav-menu a.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);

    // YouTube video interaction - open in new tab
    const youtubeLinks = document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]');
    youtubeLinks.forEach(link => {
        if (!link.getAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // Smooth scroll for back to top button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        // Remove existing event listener from HTML
        const newBackToTopBtn = backToTopBtn.cloneNode(true);
        backToTopBtn.parentNode.replaceChild(newBackToTopBtn, backToTopBtn);
        
        // Add new event listener
        newBackToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                newBackToTopBtn.style.display = 'block';
            } else {
                newBackToTopBtn.style.display = 'none';
            }
        });
    }

    // Initialize with first section visible
    const firstSection = document.querySelector('section');
    if (firstSection) {
        firstSection.classList.add('fade-in');
    }

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add fade-in effect for images
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transition = 'opacity 0.5s ease';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
    });

    // Form validation enhancement
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#ff6b6b';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary)';
        });
    });

    // Add smooth hover effect for buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-cta, .magic-button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('magic-button')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    // Thêm sự kiện click cho logo để điều hướng về trang chủ
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Điều hướng về trang chủ với smooth scroll
            const homeSection = document.getElementById('home');
            if (homeSection) {
                window.scrollTo({
                    top: homeSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Cập nhật URL hash
                window.history.pushState(null, null, '#home');
                
                // Đóng menu mobile nếu đang mở
                const navMenu = document.querySelector('.nav-menu');
                const mobileMenuBtn = document.querySelector('.mobile-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (mobileMenuBtn.querySelector('i')) {
                        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                        mobileMenuBtn.classList.remove('active');
                    }
                }
            }
        });
        
        // Thêm class để biểu thị có thể click
        logo.classList.add('clickable-logo');
    }    
});

// === HỆ THỐNG ÂM THANH TƯƠNG THÍCH ANDROID ===

// Biến toàn cục
let isMuted = false;
let userInteracted = false;
let currentMode = 'magic';
let isDarkTheme = false;
let magicSound = null;
let cosmicSound = null;
let soundToggle = null;
let audioContext = null;
let audioInitialized = false;

// Hàm khởi tạo audio system cho Android
function initAudioSystem() {
    magicSound = document.getElementById('magicSound');
    cosmicSound = document.getElementById('cosmicSound');
    soundToggle = document.getElementById('soundToggle');
    
    // Kiểm tra hỗ trợ Web Audio API
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    
    // Configure audio elements cho Android
    if (magicSound) {
        magicSound.volume = 0;
        magicSound.muted = true;
        magicSound.loop = true;
        magicSound.preload = 'auto';
        
        // Event listeners cho magicSound
        magicSound.addEventListener('canplaythrough', function() {
            console.log("🎵 Magic sound ready");
        });
        
        magicSound.addEventListener('error', function(e) {
            console.error("❌ Magic sound error:", e.target.error);
        });
    }
    
    if (cosmicSound) {
        cosmicSound.volume = 0;
        cosmicSound.muted = true;
        cosmicSound.loop = true;
        cosmicSound.preload = 'auto';
        
        // Event listeners cho cosmicSound
        cosmicSound.addEventListener('canplaythrough', function() {
            console.log("🌌 Cosmic sound ready");
        });
        
        cosmicSound.addEventListener('error', function(e) {
            console.error("❌ Cosmic sound error:", e.target.error);
        });
    }
    
    // Thêm touch event cho toàn bộ màn hình
    document.body.addEventListener('touchstart', handleFirstUserInteraction, { once: true });
    document.body.addEventListener('click', handleFirstUserInteraction, { once: true });
    
    // Load saved preferences
    loadAudioPreferences();
}

// script.js - Sửa hàm playMagicMusic và playCosmicAmbient
function playMagicMusic() {
    if (!magicSound || isMuted || !userInteracted) return;
    
    // Dừng cosmic sound nếu đang phát
    if (cosmicSound && !cosmicSound.paused) {
        cosmicSound.pause();
        cosmicSound.currentTime = 0;
    }
    
    // Reset audio element
    magicSound.muted = false;
    magicSound.volume = 0;
    
    // Phát nhạc với retry logic
    const playAudio = () => {
        const playPromise = magicSound.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log("🎵 Magic music started");
                    currentMode = 'magic';
                    
                    // Tăng volume dần
                    let volume = 0;
                    const fadeIn = setInterval(() => {
                        if (volume < AudioConfig.volumes.magic) {
                            volume += 0.05;
                            magicSound.volume = Math.min(volume, AudioConfig.volumes.magic);
                        } else {
                            clearInterval(fadeIn);
                        }
                    }, 100);
                })
                .catch(e => {
                    console.log("⚠️ Magic music play failed:", e.message);
                    
                    // Retry sau 1 giây
                    if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
                        setTimeout(() => {
                            console.log("🔄 Retrying magic music...");
                            playAudio();
                        }, 1000);
                    }
                });
        }
    };
    
    playAudio();
}
// Hàm phát Cosmic Ambient cho Android
function playCosmicAmbient() {
    if (!cosmicSound || isMuted || !userInteracted) return;
    
    // Dừng magic sound nếu đang phát
    if (magicSound && !magicSound.paused) {
        magicSound.pause();
        magicSound.currentTime = 0;
    }
    
    // Đảm bảo sound được unmute
    cosmicSound.muted = false;
    
    // Tăng volume từ từ
    let volume = 0;
    cosmicSound.volume = volume;
    
    // Phát nhạc
    const playPromise = cosmicSound.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log("🌌 Cosmic ambient started on Android");
                currentMode = 'cosmic';
                
                // Tăng volume dần
                const fadeIn = setInterval(() => {
                    if (volume < AudioConfig.volumes.cosmic) {
                        volume += 0.05;
                        cosmicSound.volume = Math.min(volume, AudioConfig.volumes.cosmic);
                    } else {
                        clearInterval(fadeIn);
                    }
                }, 100);
            })
            .catch(e => {
                console.log("⚠️ Cosmic ambient play failed:", e.message);
                
                // Fallback cho Android
                if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
                    console.log("🔄 Trying fallback method for Android...");
                    setTimeout(() => {
                        tryAndroidFallback('cosmic');
                    }, 1000);
                }
            });
    }
}

// === HANDLE THEME SOUND SWITCHING ===
function handleThemeSound(isDark) {
    if (!userInteracted || isMuted) return;
    
    stopAllSounds();
    
    if (isDark) {
        playCosmicAmbient();
        currentMode = 'cosmic';
        console.log("❤️ Switched to Touch the heart Mode with ambient sound");
    } else {
        playMagicMusic();
        currentMode = 'magic';
        console.log("✨ Switched to Inspire Mode");
    }
}

// === UPDATE SOUND TOGGLE UI ===
function updateSoundToggleUI() {
    if (!soundToggle) return;
    
    const icon = soundToggle.querySelector('i');
    if (icon) {
        if (isMuted) {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
            soundToggle.classList.add('muted');
        } else {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            soundToggle.classList.remove('muted');
        }
    }
}

// === LOAD AUDIO PREFERENCES ===
function loadAudioPreferences() {
    // Load muted state
    const savedMuted = localStorage.getItem('soundMuted');
    if (savedMuted !== null) {
        isMuted = JSON.parse(savedMuted);
    }
    
    // Load theme state
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme !== null) {
        isDarkTheme = JSON.parse(savedTheme);
        
        // Apply theme immediately
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
        }
    }
    
    // Update sound toggle UI
    updateSoundToggleUI();
    
    console.log("🔊 Audio preferences loaded:", { isMuted, isDarkTheme });
}

// Fallback method cho Android
function tryAndroidFallback(type) {
    const sound = type === 'magic' ? magicSound : cosmicSound;
    if (!sound) return;
    
    // Method 1: Thử load() trước
    sound.load();
    
    // Method 2: Sử dụng user gesture trực tiếp
    sound.play().catch(e => {
        console.log(`Fallback failed for ${type}:`, e.message);
        
        // Method 3: Hiển thị nút play manual
        showAndroidPlayButton(type);
    });
}

// Hiển thị nút play manual cho Android
function showAndroidPlayButton(type) {
    // Xóa nút cũ nếu có
    const oldButton = document.getElementById('androidPlayButton');
    if (oldButton) oldButton.remove();
    
    // Tạo nút play
    const playButton = document.createElement('button');
    playButton.id = 'androidPlayButton';
    playButton.innerHTML = `<i class="fas fa-play"></i> Bấm để bật nhạc`;
    playButton.style.cssText = `
        position: fixed;
        bottom: 160px;
        right: 30px;
        background: linear-gradient(135deg, #4CAF50, #2E7D32);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 50px;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        z-index: 1001;
        transition: all 0.3s ease;
    `;
    
    playButton.addEventListener('click', function() {
        userInteracted = true;
        if (type === 'magic') {
            playMagicMusic();
        } else {
            playCosmicAmbient();
        }
        this.remove();
    });
    
    document.body.appendChild(playButton);
    
    // Tự động xóa sau 10 giây
    setTimeout(() => {
        if (playButton.parentNode) {
            playButton.remove();
        }
    }, 10000);
}

// Cập nhật handleFirstUserInteraction
// script.js - TÌM VÀ SỬA DÒNG 556 trở đi
function handleFirstUserInteraction() {
    if (!userInteracted) {
        userInteracted = true;
        console.log("👤 User interaction detected");
        
        // Initialize audio system nếu chưa có
        if (!magicSound || !cosmicSound) {
            initAudioSystem();
        }
        
        // KHÔNG load lại audio elements (gây lỗi)
        // Chỉ unmute và phát nhạc sau một khoảng delay
        
        // Set initialized flag
        localStorage.setItem('soundInitialized', 'true');
        
        // Auto-play music based on current theme if not muted
        // Sử dụng setTimeout để tránh lỗi
        setTimeout(() => {
            if (!isMuted && userInteracted) {
                console.log("🔊 Attempting to play audio after user interaction");
                if (isDarkTheme) {
                    playCosmicAmbient();
                } else {
                    playMagicMusic();
                }
            }
        }, 500); // Tăng delay lên 500ms
    }
}

// Cập nhật hàm stopAllSounds
function stopAllSounds() {
    if (magicSound) {
        magicSound.pause();
        magicSound.currentTime = 0;
        magicSound.volume = 0;
    }
    if (cosmicSound) {
        cosmicSound.pause();
        cosmicSound.currentTime = 0;
        cosmicSound.volume = 0;
    }
}

// === GRAVITY WAVE EFFECT ===
function createGravityWave() {
    // Xóa wave cũ nếu có
    const oldWave = document.querySelector('.gravity-wave');
    if (oldWave) oldWave.remove();
    
    // Tạo container mới
    const waveContainer = document.createElement('div');
    waveContainer.className = 'gravity-wave';
    
    // Tạo 5 lớp wave
    for (let i = 0; i < 5; i++) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        wave.style.setProperty('--i', i);
        wave.style.left = '50%';
        wave.style.top = '50%';
        
        // Thêm style riêng cho wave
        if (isDarkTheme) {
            wave.style.borderColor = '#00d4ff';
        } else {
            wave.style.borderColor = 'var(--primary)';
        }
        waveContainer.appendChild(wave);
    }
    
    document.body.appendChild(waveContainer);
    
    // Kích hoạt animation
    setTimeout(() => {
        waveContainer.classList.add('active');
    }, 10);
    
    // Xóa sau 2 giây
    setTimeout(() => {
        waveContainer.classList.remove('active');
        setTimeout(() => {
            if (waveContainer.parentNode) {
                waveContainer.remove();
            }
        }, 500);
    }, 2000);
}

// === SHOOTING STARS EFFECT ===
function createShootingStars() {
    // Xóa stars cũ nếu có
    const oldStars = document.querySelector('.shooting-stars');
    if (oldStars) oldStars.remove();
    
    // Tạo container
    const starsContainer = document.createElement('div');
    starsContainer.className = 'shooting-stars';
    
    // Tạo 20 ngôi sao
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random vị trí và kích thước
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const width = 50 + Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 1 + Math.random() * 2;
        
        star.style.width = `${width}px`;
        star.style.left = `${startX}vw`;
        star.style.top = `${startY}vh`;
        star.style.animation = `shootingStar ${duration}s linear ${delay}s infinite`;
        
        starsContainer.appendChild(star);
    }
    
    document.body.appendChild(starsContainer);
    
    // Kích hoạt animation
    setTimeout(() => {
        starsContainer.classList.add('active');
    }, 10);
    
    // Xóa sau 10 giây
    setTimeout(() => {
        starsContainer.classList.remove('active');
        setTimeout(() => {
            if (starsContainer.parentNode) {
                starsContainer.remove();
            }
        }, 500);
    }, 10000);
}

// === INITIALIZE AUDIO AND THEME SYSTEM ===
document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio system
    initAudioSystem();
    
    // Magic Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Add click event for desktop and mobile
        themeToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // Handle first user interaction
            handleFirstUserInteraction();
            
            // Toggle theme
            isDarkTheme = !isDarkTheme;
            
            // Thêm/xóa class dark-theme
            document.body.classList.toggle('dark-theme', isDarkTheme);
            
            // XỬ LÝ ÂM THANH KHI CHUYỂN THEME - SỬA LẠI
            setTimeout(() => {
                handleThemeSound(isDarkTheme);
            }, 100);
            
            // Tạo Gravity Wave
            createGravityWave();
            
            // Tạo hiệu ứng mưa sao băng (chỉ Touch the heart)
            if (isDarkTheme) {
                createShootingStars();
            }
            
            // CẬP NHẬT TEXT NÚT - QUAN TRỌNG CHO MOBILE
            const buttonText = this.querySelector('span');
            const icon = this.querySelector('i');
            
            if (buttonText) {
                buttonText.textContent = isDarkTheme ? 'Touch the heart ❤️' : 'Inspire Mode ✨';
                
                // Đảm bảo màu text luôn hiển thị đúng
                if (isDarkTheme) {
                    buttonText.style.color = '#00d4ff';
                } else {
                    buttonText.style.color = 'white';
                }
            }
            
            // Thêm/xóa class cosmic-mode cho button
            if (isDarkTheme) {
                this.classList.add('touch-heart-mode');
                if (icon) icon.style.color = '#00d4ff';
            } else {
                this.classList.remove('touch-heart-mode');
                if (icon) icon.style.color = 'white';
            }
            
            // Thêm hiệu ứng nút
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Lưu trạng thái theme
            localStorage.setItem('darkTheme', isDarkTheme);
        });
    }
    // Sound Toggle Button
    if (soundToggle) {
        soundToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Handle first user interaction
            handleFirstUserInteraction();
            
            isMuted = !isMuted;
            
            // Cập nhật UI
            updateSoundToggleUI();
            
            if (isMuted) {
                // Mute tất cả âm thanh
                stopAllSounds();
            } else {
                // Unmute và tiếp tục phát nhạc
                if (isDarkTheme) {
                    playCosmicAmbient();
                } else {
                    playMagicMusic();
                }
            }
            
            // Lưu preference
            localStorage.setItem('soundMuted', isMuted);
        });
        
        // Add touch event for mobile
        soundToggle.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: true });
    }
    
    // === USER INTERACTION DETECTION ===
    // Multiple interaction types for better compatibility
    
    // Click events
    document.addEventListener('click', handleFirstUserInteraction);
    
    // Touch events for mobile
    document.addEventListener('touchstart', function(e) {
        handleFirstUserInteraction();
    }, { passive: true });
    
    // Key events
    document.addEventListener('keydown', function(e) {
        if ([' ', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            handleFirstUserInteraction();
        }
    });
    
    // Scroll events (some browsers consider this as interaction)
    let scrollCount = 0;
    window.addEventListener('scroll', function() {
        scrollCount++;
        if (scrollCount > 3 && !userInteracted) {
            handleFirstUserInteraction();
        }
    }, { passive: true });
    
    // === PAGE VISIBILITY HANDLING ===
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Tab trở nên ẩn - pause tất cả audio
            if (magicSound) magicSound.pause();
            if (cosmicSound) cosmicSound.pause();
        } else {
            // Tab trở lại active - resume audio nếu không mute và user đã tương tác
            if (!isMuted && userInteracted) {
                if (isDarkTheme) {
                    playCosmicAmbient();
                } else {
                    playMagicMusic();
                }
            }
        }
    });
    
    // === WINDOW RESIZE HANDLING ===
    window.addEventListener('resize', function() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuBtn = document.querySelector('.mobile-menu');
        
        if (window.innerWidth > 768 && navMenu && mobileMenuBtn) {
            navMenu.classList.remove('active');
            if (mobileMenuBtn.querySelector('i')) {
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.classList.remove('active');
            }
        }
    });
    
    // === CACHE BUSTING ===
    if (window.performance && window.performance.navigation.type === 1) {
        // Page was reloaded
        console.log('Page was reloaded - checking cache');
        
        // Check if we need to force reload
        const lastVersion = localStorage.getItem('site_version');
        const currentVersion = '1.2';
        
        if (lastVersion !== currentVersion) {
            localStorage.setItem('site_version', currentVersion);
            
            // Clear important caches
            if ('caches' in window) {
                caches.keys().then(cacheNames => {
                    cacheNames.forEach(cacheName => {
                        if (cacheName.includes('ndh-')) {
                            caches.delete(cacheName);
                        }
                    });
                });
            }
            
            // Reload once
            window.location.reload();
        }
    }
    
    // Add cache busting for images
    const images = document.querySelectorAll('img[src*="images/"]');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.includes('?')) {
            img.setAttribute('src', src + '?v=1.2');
        }
    });
    
    // === FIX FOR MOBILE MENU CONFLICTS ===
    const magicButton = document.getElementById('themeToggle');
    if (magicButton) {
        // Ensure magic button doesn't interfere with other clicks
        const oldClickHandler = magicButton.onclick;
        if (!oldClickHandler) {
            magicButton.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
});

// Zalo Button Logic
document.addEventListener('DOMContentLoaded', function() {
    const zaloButton = document.getElementById('zaloButton');
    const contactSection = document.getElementById('contact');
    
    if (zaloButton && contactSection) {
        // Function to check if user is in contact section
        function checkZaloButtonVisibility() {
            const contactSectionRect = contactSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Show Zalo button when contact section is in viewport
            if (contactSectionRect.top < windowHeight * 0.8 && 
                contactSectionRect.bottom > windowHeight * 0.2) {
                zaloButton.classList.add('visible');
            } else {
                zaloButton.classList.remove('visible');
            }
        }
        
        // Initial check
        checkZaloButtonVisibility();
        
        // Check on scroll
        window.addEventListener('scroll', checkZaloButtonVisibility);
        
        // Check on resize
        window.addEventListener('resize', checkZaloButtonVisibility);
        
        // Optional: Always show after clicking contact link
        const contactLinks = document.querySelectorAll('a[href="#contact"]');
        contactLinks.forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(() => {
                    zaloButton.classList.add('visible');
                }, 1000);
            });
        });
        
        // Add click animation
        zaloButton.addEventListener('click', function() {
            // Track Zalo click if you have analytics
            console.log('Zalo button clicked');
            
            // Optional: Send to Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'zalo_click', {
                    'event_category': 'Contact',
                    'event_label': 'Zalo Floating Button'
                });
            }
        });
    }
});

// === MAGIC M BUTTON - SIMPLE TOGGLE (CHỈ HIỆN KHI SCROLL ĐẾN FOOTER) ===
document.addEventListener('DOMContentLoaded', function() {
    const mButton = document.getElementById('magicMButton');
    const themeToggle = document.getElementById('themeToggle');
    
    if (mButton && themeToggle) {
        
        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // Element is considered in viewport when it's near the bottom of the screen
            return rect.top <= windowHeight && rect.bottom >= 0;
        }
        
        // Function to check if user has scrolled to footer area
        function checkScrollForMButton() {
            const footer = document.querySelector('footer');
            
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Show button when footer is in viewport or near the bottom
                // Button appears when footer top is within 200px of viewport bottom
                const shouldShow = footerRect.top <= windowHeight + 200 && footerRect.bottom >= 0;
                
                if (shouldShow) {
                    mButton.classList.add('visible');
                } else {
                    mButton.classList.remove('visible');
                }
            }
        }
        
        // Initial check with delay to ensure DOM is fully loaded
        setTimeout(checkScrollForMButton, 300);
        
        // Check on scroll with throttling for performance
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = window.requestAnimationFrame(function() {
                checkScrollForMButton();
            });
        }, { passive: true });
        
        // Check on resize
        window.addEventListener('resize', function() {
            checkScrollForMButton();
        }, { passive: true });
        
        // Click handler - SIMPLE TOGGLE
        mButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Simply trigger the theme toggle button click
            // This will toggle between Inspire Mode and Touch the heart
            themeToggle.click();
            
            // Optional: Add haptic feedback for mobile (if supported)
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
            
            // Track event (optional)
            console.log('Magic M button clicked - toggling theme');
        });
        
        // Add touch event for mobile
        mButton.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: true });
        
        // Update tooltip text based on theme (optional)
        function updateTooltip() {
            const tooltip = document.querySelector('.m-tooltip');
            if (tooltip) {
                if (document.body.classList.contains('dark-theme')) {
                    tooltip.textContent = 'Chuyển sang Inspire Mode';
                } else {
                    tooltip.textContent = 'Chuyển sang Touch the heart';
                }
            }
        }
        
        // Update tooltip when theme changes
        themeToggle.addEventListener('click', function() {
            setTimeout(updateTooltip, 100);
        });
        
        // Initial tooltip update
        setTimeout(updateTooltip, 500);
        
        // Show button when user clicks on contact link
        const contactLinks = document.querySelectorAll('a[href="#contact"]');
        contactLinks.forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(() => {
                    checkScrollForMButton();
                }, 1000);
            });
        });
    }
});

// Add visibility check on page load complete
window.addEventListener('load', function() {
    const mButton = document.getElementById('magicMButton');
    if (mButton) {
        setTimeout(() => {
            const footer = document.querySelector('footer');
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (footerRect.top <= windowHeight + 200) {
                    mButton.classList.add('visible');
                }
            }
        }, 500);
    }
});
// Add visibility class for M button
const mButtonStyle = document.createElement('style');
mButtonStyle.textContent = `
    .m-float-button {
        opacity: 0.7;
        transition: opacity 0.3s ease, transform 0.3s ease !important;
    }
    
    .m-float-button.visible {
        opacity: 1;
    }
    
    @media (max-width: 768px) {
        .m-float-button {
            opacity: 0.9;
        }
    }
`;
document.head.appendChild(mButtonStyle);

// === ERROR HANDLING FOR AUDIO ===
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'AUDIO') {
        console.error('Audio error:', e.target.src, e.target.error);
        
        // Fallback handling
        if (e.target.id === 'magicSound') {
            console.log('Magic sound failed to load, trying fallback...');
        } else if (e.target.id === 'cosmicSound') {
            console.log('Cosmic sound failed to load, trying fallback...');
        }
    }
}, true);

// === SERVICE WORKER REGISTRATION ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// === EXPORT FUNCTIONS FOR DEBUGGING ===
if (typeof window !== 'undefined') {
    window.audioDebug = {
        playMagic: playMagicMusic,
        playCosmic: playCosmicAmbient,
        stopAll: stopAllSounds,
        toggleMute: function() {
            isMuted = !isMuted;
            updateSoundToggleUI();
            if (isMuted) {
                stopAllSounds();
            } else {
                if (isDarkTheme) {
                    playCosmicAmbient();
                } else {
                    playMagicMusic();
                }
            }
        },
        getStatus: function() {
            return {
                userInteracted: userInteracted,
                isMuted: isMuted,
                isDarkTheme: isDarkTheme,
                currentMode: currentMode,
                magicSound: magicSound ? {
                    paused: magicSound.paused,
                    currentTime: magicSound.currentTime,
                    volume: magicSound.volume
                } : null,
                cosmicSound: cosmicSound ? {
                    paused: cosmicSound.paused,
                    currentTime: cosmicSound.currentTime,
                    volume: cosmicSound.volume
                } : null
            };
        }
    };
}