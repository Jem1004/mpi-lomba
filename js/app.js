/**
 * Media Pembelajaran Interaktif - Jaringan Dasar
 * Main Application JavaScript
 * Author: MPI Development Team
 * Version: 1.0.0
 */

class MPIApp {
    constructor() {
        this.currentPage = 'terminal';
        this.studentName = '';
        this.completionRate = 0;
        this.certificateData = null;
        this.userData = {
            progress: {},
            scores: {},
            certificates: {},
            settings: {}
        };

        // Wait for DOM to be ready before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('Initializing MPI App...');

        // Load user data first
        this.loadUserData();

        // Initialize event listeners
        this.initEventListeners();

        // Initialize Enhanced Systems
        this.initializeEnhancedSystems();

        // Show loading screen
        this.showLoadingScreen();

        // Simulate loading time
        setTimeout(() => {
            this.hideLoadingScreen();
            this.startTerminalSession();
        }, 2000);
    }

    /**
     * Load user data from localStorage
     */
    loadUserData() {
        try {
            const savedName = localStorage.getItem('studentName');
            const savedData = localStorage.getItem('userData');

            if (savedName) {
                this.studentName = savedName;
                console.log('Loaded existing user:', savedName);
            }

            if (savedData) {
                try {
                    this.userData = JSON.parse(savedData);
                    console.log('Loaded user data:', this.userData);
                } catch (e) {
                    console.error('Error loading user data:', e);
                    this.userData = {
                        progress: {},
                        scores: {},
                        certificates: {},
                        settings: {}
                    };
                }
            }
        } catch (error) {
            console.error('Error in loadUserData:', error);
        }
    }

    /**
     * Save user data to localStorage
     */
    saveUserData() {
        try {
            localStorage.setItem('userData', JSON.stringify(this.userData));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    /**
     * Initialize Enhanced Systems (Using Unified System)
     */
    initializeEnhancedSystems() {
        console.log('Initializing Enhanced Systems...');

        // Initialize Unified Quiz System with improved error handling
        this.initializeUnifiedQuizSystemWithRetry();
    }

    /**
     * Initialize Unified Quiz System with retry logic
     */
    initializeUnifiedQuizSystemWithRetry() {
        const tryInitialize = (retryCount = 0) => {
            try {
                console.log(`📍 Attempt ${retryCount + 1}: Checking UnifiedQuizSystem and QuestionData...`);

                if (typeof UnifiedQuizSystem !== 'undefined' && window.QuestionData) {
                    console.log('✅ UnifiedQuizSystem and QuestionData found, creating instance...');

                    this.unifiedQuizSystem = new UnifiedQuizSystem(this);

                    // Make it globally available
                    window.unifiedQuizSystem = this.unifiedQuizSystem;

                    // Also create backward compatibility references
                    this.enhancedQuizSystem = this.unifiedQuizSystem;
                    this.enhancedTestSystem = this.unifiedQuizSystem;

                    console.log('✅ Unified Quiz System initialized successfully');
                } else {
                    const missingComponents = [];
                    if (typeof UnifiedQuizSystem === 'undefined') missingComponents.push('UnifiedQuizSystem');
                    if (!window.QuestionData) missingComponents.push('QuestionData');

                    throw new Error(`Missing dependencies: ${missingComponents.join(', ')}`);
                }
            } catch (error) {
                console.error(`❌ Unified Quiz System initialization failed (attempt ${retryCount + 1}):`, error);

                if (retryCount < 3) {
                    console.log(`🔄 Retrying Unified Quiz System initialization in ${1000 * (retryCount + 1)}ms...`);
                    setTimeout(() => tryInitialize(retryCount + 1), 1000 * (retryCount + 1));
                } else {
                    console.error('❌ Unified Quiz System failed to initialize after 3 attempts');
                    this.unifiedQuizSystem = null;
                    this.enhancedQuizSystem = null;
                    this.enhancedTestSystem = null;

                    // Show fallback error to user
                    this.showNotification('Sistem kuis tidak dapat dimuat. Silakan refresh halaman.', 'error');
                }
            }
        };

        // Start initialization with a short delay to ensure DOM and dependencies are ready
        setTimeout(() => tryInitialize(), 500);
    }

  
    /**
     * Generate consistent page header
     */
    generatePageHeader(title, subtitle = '', showBackButton = true, backAction = null, extraInfo = '') {
        const backButtonText = backAction ? '← Kembali' : '← Kembali';
        const backClickHandler = backAction || 'window.mpiApp.navigateToMainMenu()';

        return `
            <header class="page-header">
                <div class="container">
                    <div class="header-content">
                        <div class="header-left">
                            ${showBackButton ? `
                                <button class="btn-back" onclick="${backClickHandler}">
                                    <svg viewBox="0 0 24 24" class="back-icon">
                                        <path d="M20,11V13H8L13.5,18.5L12.08,17.08L7.5,12.5L12.08,7.92L13.5,9.34L8,13H20Z"/>
                                    </svg>
                                    ${backButtonText}
                                </button>
                            ` : ''}
                        </div>
                        <div class="header-center">
                            <h1 class="page-title">${title}</h1>
                            ${subtitle ? `<p class="page-subtitle">${subtitle}</p>` : ''}
                        </div>
                        <div class="header-right">
                            ${extraInfo}
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Terminal input
        const nameInput = document.getElementById('nameInput');
        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleNameSubmit();
                }
            });
        }

        // Menu cards
        const menuCards = document.querySelectorAll('.menu-card');
        menuCards.forEach(card => {
            card.addEventListener('click', () => {
                const page = card.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Back buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-back, .back-btn')) {
                e.preventDefault();
                this.navigateToMainMenu();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentPage !== 'main-menu') {
                this.navigateToMainMenu();
            }
        });
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }

    /**
     * Start terminal session
     */
    startTerminalSession() {
        console.log('Starting terminal session...');

        const terminalSession = document.getElementById('terminalSession');
        if (terminalSession) {
            terminalSession.classList.remove('hidden');
            this.focusTerminalInput();

            // Add typewriter effect to terminal output
            this.addTypewriterEffect();

            // Check if user already exists
            if (this.studentName) {
                this.showReturningUser();
            }
        } else {
            console.error('Terminal session element not found');
        }
    }

    /**
     * Focus on terminal input
     */
    focusTerminalInput() {
        const nameInput = document.getElementById('nameInput');
        if (nameInput) {
            setTimeout(() => {
                nameInput.focus();
            }, 100);
        }
    }

    /**
     * Add typewriter effect to terminal
     */
    addTypewriterEffect() {
        const terminalOutput = document.getElementById('terminalOutput');
        if (!terminalOutput) {
            console.error('Terminal output element not found');
            return;
        }

        const lines = [
            '[root@smk-pembelajaran ~]# System check: ✓ OK',
            '[root@smk-pembelajaran ~]# Network modules: ✓ Loaded',
            '[root@smk-pembelajaran ~]# Interactive mode: ✓ Active',
            '[root@smk-pembelajaran ~]# Memuat database materi...'
        ];

        lines.forEach((line, index) => {
            setTimeout(() => {
                const lineElement = document.createElement('div');
                lineElement.className = 'terminal-line';
                lineElement.innerHTML = line.replace('✓', '<span class="success">✓</span>');
                terminalOutput.appendChild(lineElement);
                this.scrollToBottom(terminalOutput);
            }, index * 500);
        });
    }

    /**
     * Show returning user message
     */
    showReturningUser() {
        const terminalOutput = document.getElementById('terminalOutput');
        const nameInput = document.getElementById('nameInput');
        const terminalInputLine = document.querySelector('.terminal-input-line');

        if (terminalOutput && nameInput && terminalInputLine) {
            setTimeout(() => {
                const welcomeLine = document.createElement('div');
                welcomeLine.className = 'terminal-line';
                welcomeLine.innerHTML = `Memuat ulang sesi untuk <span class="highlight">${this.studentName}</span>... Selamat datang kembali!`;
                terminalOutput.appendChild(welcomeLine);
                this.scrollToBottom(terminalOutput);

                terminalInputLine.style.display = 'none';

                setTimeout(() => {
                    this.transitionToMainMenu();
                }, 1500);
            }, 2000);
        }
    }

    /**
     * Handle name submission
     */
    handleNameSubmit() {
        const nameInput = document.getElementById('nameInput');
        if (!nameInput || !nameInput.value.trim()) {
            this.showError('Silakan masukkan nama Anda terlebih dahulu.');
            return;
        }

        this.studentName = nameInput.value.trim();
        localStorage.setItem('studentName', this.studentName);

        const terminalOutput = document.getElementById('terminalOutput');
        if (terminalOutput) {
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line';
            responseLine.innerHTML = `Selamat datang, <span class="highlight">${this.studentName}</span>! Sistem siap. Memuat menu navigasi...`;
            terminalOutput.appendChild(responseLine);
            this.scrollToBottom(terminalOutput);
        }

        // Hide input line
        const terminalInputLine = document.querySelector('.terminal-input-line');
        if (terminalInputLine) {
            terminalInputLine.style.display = 'none';
        }

        // Transition to main menu
        setTimeout(() => {
            this.transitionToMainMenu();
        }, 1500);
    }

    /**
     * Transition to main menu with glitch effect
     */
    transitionToMainMenu() {
        const transitionEffect = document.getElementById('transitionEffect');
        const terminalSession = document.getElementById('terminalSession');

        if (transitionEffect) {
            transitionEffect.classList.remove('hidden');

            setTimeout(() => {
                if (terminalSession) {
                    terminalSession.classList.add('hidden');
                }
                this.showMainMenu();
                transitionEffect.classList.add('hidden');
            }, 2000);
        } else {
            // Fallback if transition effect not available
            if (terminalSession) {
                terminalSession.classList.add('hidden');
            }
            this.showMainMenu();
        }
    }

    /**
     * Show main menu
     */
    showMainMenu() {
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
            this.updateUserInterface();
            this.currentPage = 'main-menu';
            console.log('Main menu shown for user:', this.studentName);
        } else {
            console.error('Main menu element not found');
        }
    }

    /**
     * Update user interface with user data
     */
    updateUserInterface() {
        // Update user name
        const userNameElement = document.getElementById('userName');
        if (userNameElement && this.studentName) {
            userNameElement.textContent = this.studentName;
        }

        // Update progress indicators
        this.updateProgressIndicators();

        // Update certificate status
        this.updateCertificateStatus();
    }

    /**
     * Update progress indicators
     */
    updateProgressIndicators() {
        // Calculate overall progress
        const objectivesProgress = this.calculateObjectivesProgress();
        const progressBar = document.getElementById('objectivesProgress');
        const progressText = document.querySelector('.progress-text');

        if (progressBar) {
            progressBar.style.width = `${objectivesProgress}%`;
        }

        if (progressText) {
            progressText.textContent = `${objectivesProgress}% Complete`;
        }
    }

    /**
     * Calculate objectives progress
     */
    calculateObjectivesProgress() {
        // Calculate actual progress from user data
        const objectives = ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6'];
        let totalProgress = 0;
        let completedObjectives = 0;

        objectives.forEach(objective => {
            const progress = this.getObjectiveProgress(objective);
            totalProgress += progress;
            if (progress >= 100) {
                completedObjectives++;
            }
        });

        const averageProgress = Math.round(totalProgress / objectives.length);

        // Update user data with calculated progress
        this.userData.progress.objectivesOverall = averageProgress;
        this.saveUserData();

        return averageProgress;
    }

    /**
     * Update certificate status
     */
    updateCertificateStatus() {
        const certificateStatus = document.getElementById('certificateStatus');
        const certificateQuickAction = document.getElementById('certificateQuickAction');

        // QUIZ-ONLY SYSTEM: Check evaluation progress
        const progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');
        const hasCertificate = progress.certificateUnlocked;
        const bestScore = progress.bestScore || 0;

        if (certificateStatus) {
            if (hasCertificate) {
                // Certificate is unlocked
                certificateStatus.innerHTML = `
                    <span class="status-text unlocked">🏆 Tersedia</span>
                    <div class="status-details">Skor: ${bestScore}%</div>
                `;
                certificateStatus.classList.remove('locked');
                certificateStatus.classList.add('unlocked');

                // Hide quick action button since certificate is available
                if (certificateQuickAction) {
                    certificateQuickAction.style.display = 'none';
                }
            } else {
                // Certificate is locked - show quick action
                certificateStatus.innerHTML = `
                    <span class="status-text locked">🔒 Terkunci</span>
                    <div class="status-details">Butuh 70% di kuis</div>
                `;
                certificateStatus.classList.remove('unlocked');
                certificateStatus.classList.add('locked');

                // Show quick action button for easy quiz access
                if (certificateQuickAction) {
                    certificateQuickAction.style.display = 'block';
                }
            }
        }
    }

    /**
     * Navigate to specific page
     */
    navigateToPage(page) {
        console.log('Navigating to page:', page);

        // Hide main menu
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.classList.add('hidden');
        }

        // Show content pages
        const contentPages = document.getElementById('contentPages');
        if (contentPages) {
            contentPages.classList.remove('hidden');
        }

        // Load page content
        this.loadPageContent(page);
        this.currentPage = page;
    }

    /**
     * Load page content dynamically
     */
    loadPageContent(page) {
        const contentPages = document.getElementById('contentPages');
        if (!contentPages) return;

        // Clear existing content
        contentPages.innerHTML = '';

        // Load page based on type
        switch (page) {
            case 'objectives':
                this.loadObjectivesPage(contentPages);
                break;
            case 'materials':
                this.loadMaterialsPage(contentPages);
                break;
            case 'evaluasi':
                this.loadEvaluasiPage(contentPages);
                break;
            case 'quiz':
                // Redirect ke evaluasi untuk compatibility
                this.loadEvaluasiPage(contentPages);
                break;
            case 'certificate':
                this.loadCertificatePage(contentPages);
                break;
            case 'ai-tutor':
                this.loadAITutorPage(contentPages);
                break;
            case 'about':
                this.loadAboutPage(contentPages);
                break;
            default:
                console.error('Unknown page:', page);
                this.navigateToMainMenu();
        }
    }

    /**
     * Navigate back to main menu
     */
    navigateToMainMenu() {
        // Hide content pages
        const contentPages = document.getElementById('contentPages');
        if (contentPages) {
            contentPages.innerHTML = '';
            contentPages.classList.add('hidden');
        }

        // Show main menu
        this.showMainMenu();
    }

    /**
     * Load objectives page
     */
    loadObjectivesPage(container) {
        container.innerHTML = `
            <div class="page objectives-page">
                ${this.generatePageHeader('Tujuan Pembelajaran', 'Kompetensi Dasar Jaringan Komputer')}
                <main class="page-content">
                    <div class="container">
                        <div class="objectives-intro">
                            <p class="intro-text">Berikut adalah tujuan pembelajaran yang akan dicapai dalam mata pelajaran Jaringan Dasar untuk SMK TKJT:</p>
                        </div>

                        <div class="objectives-categories">
                            <div class="category-section">
                                <h3 class="category-title">
                                    <svg class="category-icon" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    Kompetensi Inti
                                </h3>
                                <div class="objectives-grid">
                                    <div class="objective-item core">
                                        <div class="objective-icon">🎯</div>
                                        <div class="objective-content">
                                            <h4>Memahami Konsep Dasar</h4>
                                            <p>Memahami pengertian, fungsi, dan tujuan jaringan komputer dalam kehidupan sehari-hari dan industri</p>
                                        </div>
                                    </div>
                                    <div class="objective-item core">
                                        <div class="objective-icon">🔧</div>
                                        <div class="objective-content">
                                            <h4>Mengidentifikasi Komponen</h4>
                                            <p>Mengenali berbagai perangkat keras dan lunak yang digunakan dalam jaringan komputer</p>
                                        </div>
                                    </div>
                                    <div class="objective-item core">
                                        <div class="objective-icon">🏗️</div>
                                        <div class="objective-content">
                                            <h4>Membangun Jaringan</h4>
                                            <p>Mampu merancang dan membangun jaringan komputer sederhana sesuai kebutuhan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="category-section">
                                <h3 class="category-title">
                                    <svg class="category-icon" viewBox="0 0 24 24">
                                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                                    </svg>
                                    Kompetensi Dasar
                                </h3>
                                <div class="objectives-grid">
                                    <div class="objective-item basic">
                                        <div class="objective-number">3.1</div>
                                        <div class="objective-content">
                                            <h4>Model Jaringan</h4>
                                            <p>Menjelaskan berbagai model jaringan (LAN, WAN, MAN) dan karakteristiknya</p>
                                            <div class="progress-indicator">
                                                <div class="progress-bar">
                                                    <div class="progress-fill" style="width: 0%"></div>
                                                </div>
                                                <span class="progress-label">0%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="objective-item basic">
                                        <div class="objective-number">3.2</div>
                                        <div class="objective-content">
                                            <h4>Topologi Jaringan</h4>
                                            <p>Menganalisis berbagai topologi jaringan (bus, star, ring, mesh) dan kelebihan/kekurangannya</p>
                                            <div class="progress-indicator">
                                                <div class="progress-bar">
                                                    <div class="progress-fill" style="width: 0%"></div>
                                                </div>
                                                <span class="progress-label">0%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="objective-item basic">
                                        <div class="objective-number">3.3</div>
                                        <div class="objective-content">
                                            <h4>OSI Layer</h4>
                                            <p>Memahami 7 lapisan model OSI dan fungsi setiap lapisan dalam komunikasi data</p>
                                            <div class="progress-indicator">
                                                <div class="progress-bar">
                                                    <div class="progress-fill" style="width: 0%"></div>
                                                </div>
                                                <span class="progress-label">0%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="objective-item basic">
                                        <div class="objective-number">3.4</div>
                                        <div class="objective-content">
                                            <h4>Protokol Jaringan</h4>
                                            <p>Mengidentifikasi berbagai protokol jaringan (TCP/IP, HTTP, FTP, DNS) dan fungsinya</p>
                                            <div class="progress-indicator">
                                                <div class="progress-bar">
                                                    <div class="progress-fill" style="width: 0%"></div>
                                                </div>
                                                <span class="progress-label">0%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="objective-item basic">
                                        <div class="objective-number">3.5</div>
                                        <div class="objective-content">
                                            <h4>Alamat IP</h4>
                                            <p>Memahami konsep alamat IP, subnetting, dan perhitungan jaringan</p>
                                            <div class="progress-indicator">
                                                <div class="progress-bar">
                                                    <div class="progress-fill" style="width: 0%"></div>
                                                </div>
                                                <span class="progress-label">0%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="objective-item basic">
                                        <div class="objective-number">3.6</div>
                                        <div class="objective-content">
                                            <h4>Perangkat Jaringan</h4>
                                            <p>Mengenali dan memahami fungsi router, switch, hub, dan perangkat jaringan lainnya</p>
                                            <div class="progress-indicator">
                                                <div class="progress-bar">
                                                    <div class="progress-fill" style="width: 0%"></div>
                                                </div>
                                                <span class="progress-label">0%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="category-section">
                                <h3 class="category-title">
                                    <svg class="category-icon" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                    Keterampilan Praktik
                                </h3>
                                <div class="objectives-grid">
                                    <div class="objective-item practical">
                                        <div class="objective-icon">⚡</div>
                                        <div class="objective-content">
                                            <h4>Konfigurasi Jaringan</h4>
                                            <p>Mampu melakukan konfigurasi dasar jaringan komputer dan pengalamatan IP</p>
                                        </div>
                                    </div>
                                    <div class="objective-item practical">
                                        <div class="objective-icon">🔍</div>
                                        <div class="objective-content">
                                            <h4>Troubleshooting</h4>
                                            <p>Melakukan diagnosa dan perbaikan masalah jaringan yang umum terjadi</p>
                                        </div>
                                    </div>
                                    <div class="objective-item practical">
                                        <div class="objective-icon">🛠️</div>
                                        <div class="objective-content">
                                            <h4>Setup Jaringan</h4>
                                            <p>Menginstal dan mengkonfigurasi perangkat jaringan dasar (router, switch)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="learning-outcomes">
                                <h3 class="category-title">
                                    <svg class="category-icon" viewBox="0 0 24 24">
                                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                                    </svg>
                                    Capaian Pembelajaran
                                </h3>
                                <div class="outcomes-grid">
                                    <div class="outcome-item">
                                        <div class="outcome-level">Dasar</div>
                                        <p>Setelah menyelesaikan pembelajaran, siswa mampu menjelaskan konsep dasar jaringan komputer</p>
                                    </div>
                                    <div class="outcome-item">
                                        <div class="outcome-level">Menengah</div>
                                        <p>Siswa dapat mengidentifikasi komponen jaringan dan memahami fungsi setiap komponen</p>
                                    </div>
                                    <div class="outcome-item">
                                        <div class="outcome-level">Lanjutan</div>
                                        <p>Siswa mampu merancang, membangun, dan mengelola jaringan komputer sederhana</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="assessment-info">
                            <h3>Penilaian Pembelajaran</h3>
                            <div class="assessment-grid">
                                <div class="assessment-item">
                                    <h4>📝 Tugas Praktik</h4>
                                    <p>30% - Pengerjaan tugas konfigurasi jaringan dan troubleshooting</p>
                                </div>
                                <div class="assessment-item">
                                    <h4>🧪 Test Teori</h4>
                                    <p>30% - Tes pemahaman konsep dan teori jaringan komputer</p>
                                </div>
                                <div class="assessment-item">
                                    <h4>🎯 Ujian Praktik</h4>
                                    <p>40% - Ujian praktikum setup dan konfigurasi jaringan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
        this.initializeObjectives();
    }

    /**
     * Load materials page
     */
    loadMaterialsPage(container) {
        container.innerHTML = `
            <div class="page materials-page">
                ${this.generatePageHeader('Materi Pembelajaran', 'Jelajahi Dunia Jaringan Komputer')}
                <main class="page-content">
                    <div class="container">
                        <!-- Materials Hero Section -->
                        <div class="materials-hero">
                            <p class="hero-description">
                                Pelajari konsep dasar hingga lanjut tentang jaringan komputer dengan materi interaktif yang dirancang khusus untuk siswa SMK TKJT.
                            </p>
                            <div class="progress-overview">
                                <div class="progress-stat">
                                    <div class="progress-stat-value">4</div>
                                    <div class="progress-stat-label">Modul Pembelajaran</div>
                                </div>
                                <div class="progress-stat">
                                    <div class="progress-stat-value" id="totalLessons">28</div>
                                    <div class="progress-stat-label">Total Pelajaran</div>
                                </div>
                                <div class="progress-stat">
                                    <div class="progress-stat-value" id="completedLessons">0</div>
                                    <div class="progress-stat-label">Selesai</div>
                                </div>
                            </div>
                        </div>

                        <!-- Learning Modules Grid -->
                        <div class="modules-grid">
                            <!-- Module 1: Network Basics -->
                            <div class="module-card" data-module="network-basics">
                                <div class="module-header">
                                    <div class="module-icon">🌐</div>
                                    <h3 class="module-title">Konsep Dasar Jaringan</h3>
                                    <p class="module-description">
                                        Pengenalan konsep fundamental jaringan komputer, terminologi, dan prinsip dasar komunikasi data.
                                    </p>
                                    <div class="module-meta">
                                        <div class="module-duration">
                                            <svg class="difficulty-icon" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                            45 menit
                                        </div>
                                        <div class="module-difficulty">
                                            <svg class="difficulty-icon" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                            </svg>
                                            Pemula
                                        </div>
                                    </div>
                                    <div class="module-progress">
                                        <div class="progress-header">
                                            <span class="progress-title">Progress</span>
                                            <span class="progress-percentage">0%</span>
                                        </div>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 0%"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="module-topics">
                                    <ul class="topic-list">
                                        <li class="topic-item" onclick="window.mpiApp.startLesson('network-intro')">
                                            <div class="topic-icon">📚</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Pengenalan Jaringan Komputer</div>
                                                <div class="topic-meta">15 menit • Teori</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                        <li class="topic-item" onclick="window.mpiApp.startLesson('network-types')">
                                            <div class="topic-icon">🔗</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Jenis-jenis Jaringan</div>
                                                <div class="topic-meta">12 menit • Teori</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                        <li class="topic-item" onclick="window.mpiApp.startLesson('network-benefits')">
                                            <div class="topic-icon">💡</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Manfaat Jaringan</div>
                                                <div class="topic-meta">10 menit • Teori</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                        <li class="topic-item" onclick="window.mpiApp.startLesson('network-history')">
                                            <div class="topic-icon">📜</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Sejarah Perkembangan</div>
                                                <div class="topic-meta">8 menit • Teori</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="module-actions">
                                    <div class="btn-group">
                                        <button class="btn btn-primary" onclick="window.mpiApp.startModule('network-basics')">
                                            Mulai Belajar
                                        </button>
                                        <button class="btn btn-secondary" onclick="window.mpiApp.showModuleInfo('network-basics')">
                                            Info
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Module 2: Network Topology -->
                            <div class="module-card" data-module="network-topology">
                                <div class="module-header">
                                    <div class="module-icon">🔀</div>
                                    <h3 class="module-title">Topologi Jaringan</h3>
                                    <p class="module-description">
                                        Struktur dan layout jaringan komputer beserta kelebihan dan kekurangan setiap jenis topologi.
                                    </p>
                                    <div class="module-meta">
                                        <div class="module-duration">
                                            <svg class="difficulty-icon" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                            60 menit
                                        </div>
                                        <div class="module-difficulty">
                                            <svg class="difficulty-icon" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                            </svg>
                                            Pemula
                                        </div>
                                    </div>
                                    <div class="module-progress">
                                        <div class="progress-header">
                                            <span class="progress-title">Progress</span>
                                            <span class="progress-percentage">0%</span>
                                        </div>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 0%"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="module-topics">
                                    <ul class="topic-list">
                                        <li class="topic-item" onclick="window.mpiApp.startLesson('topology-bus')">
                                            <div class="topic-icon">🚌</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Topologi Bus</div>
                                                <div class="topic-meta">15 menit • Teori + Praktik</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                        <li class="topic-item" onclick="window.mpiApp.startLesson('topology-star')">
                                            <div class="topic-icon">⭐</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Topologi Star</div>
                                                <div class="topic-meta">15 menit • Teori + Praktik</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                        <li class="topic-item" onclick="window.mpiApp.startLesson('topology-ring')">
                                            <div class="topic-icon">⭕</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Topologi Ring</div>
                                                <div class="topic-meta">15 menit • Teori + Praktik</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                        <li class="topic-item" onclick="window.mpiApp.startLesson('topology-mesh')">
                                            <div class="topic-icon">🕸️</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Topologi Mesh</div>
                                                <div class="topic-meta">15 menit • Teori + Praktik</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="module-actions">
                                    <div class="btn-group">
                                        <button class="btn btn-primary" onclick="window.mpiApp.startModule('network-topology')">
                                            Mulai Belajar
                                        </button>
                                        <button class="btn btn-secondary" onclick="window.mpiApp.showModuleInfo('network-topology')">
                                            Info
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Module 3: OSI Model -->
                            <div class="module-card" data-module="osi-model">
                                <div class="module-header">
                                    <div class="module-icon">🏗️</div>
                                    <h3 class="module-title">Model OSI</h3>
                                    <p class="module-description">
                                        7 lapisan model OSI sebagai framework standar komunikasi jaringan komputer.
                                    </p>
                                    <div class="module-meta">
                                        <div class="module-duration">
                                            <svg class="difficulty-icon" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                            90 menit
                                        </div>
                                        <div class="module-difficulty">
                                            <svg class="difficulty-icon" viewBox="0 0 24 24">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                            </svg>
                                            Menengah
                                        </div>
                                    </div>
                                    <div class="module-progress">
                                        <div class="progress-header">
                                            <span class="progress-title">Progress</span>
                                            <span class="progress-percentage">0%</span>
                                        </div>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 0%"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="module-topics">
                                    <ul class="topic-list">
                                        <li class="topic-item" onclick="window.mpiApp.exploreLayer(7)">
                                            <div class="topic-icon">7️⃣</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Layer 7: Application</div>
                                                <div class="topic-meta">12 menit • Interaktif</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                        <li class="topic-item" onclick="window.mpiApp.exploreLayer(6)">
                                            <div class="topic-icon">6️⃣</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Layer 6: Presentation</div>
                                                <div class="topic-meta">12 menit • Interaktif</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                        <li class="topic-item" onclick="window.mpiApp.exploreLayer(5)">
                                            <div class="topic-icon">5️⃣</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Layer 5: Session</div>
                                                <div class="topic-meta">12 menit • Interaktif</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                        <li class="topic-item" onclick="window.mpiApp.exploreLayer(4)">
                                            <div class="topic-icon">4️⃣</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Layer 4: Transport</div>
                                                <div class="topic-meta">12 menit • Interaktif</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="module-actions">
                                    <div class="btn-group">
                                        <button class="btn btn-primary" onclick="window.mpiApp.startModule('osi-model')">
                                            Mulai Belajar
                                        </button>
                                        <button class="btn btn-secondary" onclick="window.mpiApp.showModuleInfo('osi-model')">
                                            Info
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Module 4: IP Addressing -->
                            <div class="module-card" data-module="ip-addressing">
                                <div class="module-header">
                                    <div class="module-icon">🔢</div>
                                    <h3 class="module-title">Alamat IP & Subnetting</h3>
                                    <p class="module-description">
                                        Konsep alamat IP, kelas IP, subnetting, dan perhitungan jaringan komputer.
                                    </p>
                                    <div class="module-meta">
                                        <div class="module-duration">
                                            <svg class="difficulty-icon" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                            75 menit
                                        </div>
                                        <div class="module-difficulty">
                                            <svg class="difficulty-icon" viewBox="0 0 24 24">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                            </svg>
                                            Menengah
                                        </div>
                                    </div>
                                    <div class="module-progress">
                                        <div class="progress-header">
                                            <span class="progress-title">Progress</span>
                                            <span class="progress-percentage">0%</span>
                                        </div>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 0%"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="module-topics">
                                    <ul class="topic-list">
                                        <li class="topic-item" onclick="window.mpiApp.startLesson('ip-basics')">
                                            <div class="topic-icon">🏠</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Dasar Alamat IP</div>
                                                <div class="topic-meta">15 menit • Teori</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                        <li class="topic-item" onclick="window.mpiApp.calculateSubnet()">
                                            <div class="topic-icon">🧮</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Subnet Calculator</div>
                                                <div class="topic-meta">20 menit • Tool Interaktif</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                        <li class="topic-item" onclick="window.mpiApp.startLesson('ip-classes')">
                                            <div class="topic-icon">📋</div>
                                            <div class="topic-info">
                                                <div class="topic-title">Kelas IP</div>
                                                <div class="topic-meta">15 menit • Teori</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                        <li class="topic-item" onclick="window.mpiApp.startLesson('ipv6')">
                                            <div class="topic-icon">🆕</div>
                                            <div class="topic-info">
                                                <div class="topic-title">IPv6</div>
                                                <div class="topic-meta">25 menit • Teori</div>
                                            </div>
                                            <div class="topic-status locked">🔒</div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="module-actions">
                                    <div class="btn-group">
                                        <button class="btn btn-primary" onclick="window.mpiApp.startModule('ip-addressing')">
                                            Mulai Belajar
                                        </button>
                                        <button class="btn btn-secondary" onclick="window.mpiApp.showModuleInfo('ip-addressing')">
                                            Info
                                        </button>
                                    </div>
                                </div>
                            </div>

                          </div>

                        <!-- Interactive Features Section -->
                        <div class="interactive-features">
                            <h2 class="features-title">Fitur Interaktif</h2>
                            <div class="features-grid">
                                <div class="feature-item">
                                    <div class="feature-icon">🧠</div>
                                    <h3 class="feature-title">AI Tutor Virtual</h3>
                                    <p class="feature-description">
                                        Tanya jawab dengan AI tentang materi jaringan komputer kapan saja.
                                    </p>
                                </div>
                                <div class="feature-item">
                                    <div class="feature-icon">🎯</div>
                                    <h3 class="feature-title">Quiz Interaktif</h3>
                                    <p class="feature-description">
                                        Test pemahaman Anda dengan quiz adaptif untuk setiap modul.
                                    </p>
                                </div>
                                <div class="feature-item">
                                    <div class="feature-icon">🛠️</div>
                                    <h3 class="feature-title">Simulasi Jaringan</h3>
                                    <p class="feature-description">
                                        Praktik konfigurasi jaringan virtual dengan simulator interaktif.
                                    </p>
                                </div>
                                <div class="feature-item">
                                    <div class="feature-icon">📊</div>
                                    <h3 class="feature-title">Progress Tracking</h3>
                                    <p class="feature-description">
                                        Monitor perkembangan belajar Anda dengan analitik mendetail.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
        this.initializeMaterials();
    }

    /**
     * Load test page
     */
    loadTestPage(container) {
        container.innerHTML = `
            <div class="page test-page">
                <header class="page-header">
                    <button class="btn-back">← Kembali</button>
                    <h1>Test Pengetahuan</h1>
                    <div class="test-info">
                        <span class="test-mode">Mode Formatif</span>
                        <span class="test-description">Latihan tanpa batasan waktu untuk menguji pemahaman</span>
                    </div>
                </header>
                <main class="page-content">
                    <div class="test-content">
                        <!-- Test content will be loaded dynamically -->
                    </div>
                </main>
            </div>
        `;
        this.initializeTest();
    }

    /**
     * Load evaluasi page (merged test + quiz)
     */
    loadEvaluasiPage(container) {
        container.innerHTML = `
            <div class="page evaluasi-page">
                ${this.generatePageHeader('Evaluasi Pembelajaran', 'Pilih jenis evaluasi yang ingin Anda ikuti')}
                <main class="page-content">
                    <div class="container">
                        <!-- Simple Card Layout -->
                        <div class="evaluasi-cards">
                            <!-- Test Formatif Card -->
                            <div class="evaluasi-card formatif-card">
                                <div class="card-header">
                                    <div class="card-icon">📝</div>
                                    <div class="card-title-section">
                                        <h2>Latihan</h2>
                                        <p>Test Pengetahuan Formatif</p>
                                    </div>
                                </div>

                                <div class="card-content">
                                    <div class="quick-info">
                                        <div class="info-item">
                                            <span class="info-icon">⏱️</span>
                                            <span>Tanpa batas waktu</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-icon">🔄</span>
                                            <span>Bisa diulang</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-icon">💡</span>
                                            <span>Feedback langsung</span>
                                        </div>
                                    </div>

                                    <p class="card-description">
                                        Latihan soal untuk menguji pemahaman konsep tanpa tekanan. Cocok untuk persiapan sebelum kuis akhir.
                                    </p>
                                </div>

                                <div class="card-footer">
                                    <button class="btn btn-primary btn-block" onclick="window.mpiApp.startLatihan()">
                                        Mulai Latihan
                                    </button>
                                    <small class="card-note">45+ soal • Tidak mempengaruhi nilai</small>
                                </div>
                            </div>

                            <!-- Quiz Sumatif Card -->
                            <div class="evaluasi-card quiz-card">
                                <div class="card-header">
                                    <div class="card-icon">🎯</div>
                                    <div class="card-title-section">
                                        <h2>Ujian</h2>
                                        <p>Kuis Akhir Sumatif</p>
                                    </div>
                                    <div class="difficulty-badge">
                                        <span>⚡</span>
                                    </div>
                                </div>

                                <div class="card-content">
                                    <div class="quick-info">
                                        <div class="info-item">
                                            <span class="info-icon">⏰</span>
                                            <span>30 menit</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-icon">📊</span>
                                            <span>15 soal</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-icon">🏆</span>
                                            <span>Sertifikat</span>
                                        </div>
                                    </div>

                                    <p class="card-description">
                                        Evaluasi resmi untuk mengukur kompetensi keseluruhan. Nilai akan disimpan untuk sertifikat.
                                    </p>

                                    <div class="requirements-alert">
                                        <span class="alert-icon">⚠️</span>
                                        <span>Minimal 70% untuk lulus • Satu kesempatan</span>
                                    </div>
                                </div>

                                <div class="card-footer">
                                    <button class="btn btn-secondary btn-block" onclick="window.mpiApp.startKuis()">
                                        Mulai Ujian
                                    </button>
                                    <small class="card-note">Penilaian resmi • Dapat sertifikat</small>
                                </div>
                            </div>
                        </div>

                        <!-- Progress Summary -->
                        <div class="progress-summary">
                            <h3>Progress Anda</h3>
                            <div class="progress-grid">
                                <div class="progress-item">
                                    <div class="progress-label">Latihan Selesai</div>
                                    <div class="progress-value">0</div>
                                </div>
                                <div class="progress-item">
                                    <div class="progress-label">Nilai Terbaik</div>
                                    <div class="progress-value">-</div>
                                </div>
                                <div class="progress-item">
                                    <div class="progress-label">Status Sertifikat</div>
                                    <div class="progress-value">🔒</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;

        // Load progress data
        this.loadEvaluationProgress();

        // Add hover sound effects for cards
        this.addCardInteractions();
    }

    /**
     * Add interactive effects to evaluation cards
     */
    addCardInteractions() {
        const cards = document.querySelectorAll('.evaluasi-card');

        cards.forEach(card => {
            // Add hover effect with subtle animation
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });

            // Add click feedback
            const button = card.querySelector('button');
            if (button) {
                button.addEventListener('click', (e) => {
                    // Add ripple effect
                    const ripple = document.createElement('span');
                    ripple.style.position = 'absolute';
                    ripple.style.borderRadius = '50%';
                    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                    ripple.style.width = '20px';
                    ripple.style.height = '20px';
                    ripple.style.animation = 'ripple 0.6s ease-out';
                    ripple.style.pointerEvents = 'none';

                    const rect = button.getBoundingClientRect();
                    ripple.style.left = `${e.clientX - rect.left - 10}px`;
                    ripple.style.top = `${e.clientY - rect.top - 10}px`;

                    button.style.position = 'relative';
                    button.style.overflow = 'hidden';
                    button.appendChild(ripple);

                    setTimeout(() => ripple.remove(), 600);
                });
            }
        });
    }

   
    /**
     * Load progress data for evaluation page
     */
    loadEvaluationProgress() {
        // Load progress from localStorage
        const progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');

        // Update progress display
        const progressValues = document.querySelectorAll('.progress-value');
        if (progressValues.length >= 3) {
            progressValues[0].textContent = progress.practiceCompleted || 0;
            progressValues[1].textContent = progress.bestScore ? `${progress.bestScore}%` : '-';
            progressValues[2].textContent = progress.certificateUnlocked ? '🏆' : '🔒';
        }
    }

    /**
     * Normalize question data format for enhanced systems
     */
    normalizeQuestionData(questions) {
        return questions.map(q => ({
            id: q.id,
            type: q.type || 'multiple-choice',
            question: q.pertanyaan || q.question || '',
            options: q.options || q.jawaban || [],
            correctAnswer: q.jawaban_benar !== undefined ? q.jawaban_benar : q.correctAnswer,
            explanation: q.penjelasan || q.explanation || '',
            points: q.points || 10,
            difficulty: q.difficulty || 'medium',
            category: q.category || q.bab || 'general',
            bab: q.bab // Preserve original bab for categorization
        }));
    }

    /**
     * Start latihan (test formatif)
     */
    startLatihan() {
        console.log('📚 Starting Test Pengetahuan Formatif...');

        // Show loading message
        this.showNotification('Memuat soal latihan...', 'info');

        // Load questions from data/soal.json
        fetch('data/soal.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const formatifQuestions = data.test_pengetahuan || [];

                if (formatifQuestions.length === 0) {
                    this.showNotification('Soal latihan tidak tersedia', 'error');
                    return;
                }

                console.log(`✅ Loaded ${formatifQuestions.length} practice questions`);

                // Normalize question data for enhanced system compatibility
                const normalizedQuestions = this.normalizeQuestionData(formatifQuestions);

                if (this.unifiedQuizSystem) {
                    console.log('🚀 Starting Unified Quiz System for practice...');
                    try {
                        // Start unified quiz system with practice configuration
                        this.unifiedQuizSystem.startSession('practice', {
                            category: 'test_pengetahuan',
                            difficulty: 'mixed',
                            maxQuestionsPerSession: Math.min(20, normalizedQuestions.length),
                            totalTimeLimit: 0, // No timer for practice
                            allowBackNavigation: true,
                            showImmediateFeedback: false,
                            enableHints: true,
                            enableExplanations: true,
                            shuffleQuestions: true,
                            shuffleAnswers: true
                        }).then(() => {
                            console.log('✅ Unified quiz system started successfully');
                        }).catch(error => {
                            console.error('❌ Unified Quiz System error:', error);
                            this.showNotification('Gagal memulai sistem kuis', 'error');
                            this.initializeTest(); // Fallback
                        });

                    } catch (error) {
                        console.error('❌ Unified Quiz System error:', error);
                        this.showNotification('Gagal memulai sistem kuis', 'error');
                        this.initializeTest(); // Fallback
                    }
                } else {
                    console.warn('⚠️ Unified Quiz System not available, using fallback');
                    this.initializeTest(); // Fallback
                }
            })
            .catch(error => {
                console.error('❌ Error loading formatif questions:', error);
                this.showNotification('Gagal memuat soal latihan: ' + error.message, 'error');
            });
    }

    /**
     * Start kuis (ujian sumatif)
     */
    startKuis() {
        console.log('🎯 Starting Kuis Akhir Sumatif...');

        // Show confirmation dialog
        const confirmStart = confirm('⚠️ UJIAN AKHIR SUMATIF ⚠️\n\nAnda siap untuk memulai kuis akhir?\n\n📋 Ketentuan:\n• 30 menit waktu pengerjaan\n• 15 soal pilihan ganda\n• Minimal 70% untuk lulus\n• Satu kesempatan saja\n\nKlik OK untuk melanjutkan atau Batal untuk kembali.');

        if (!confirmStart) {
            return;
        }

        // Show loading message
        this.showNotification('Memuat soal kuis...', 'info');

        // Get questions directly from QuestionData (no fetch needed)
        try {
            const sumatifQuestions = window.QuestionData ?
                window.QuestionData.QuestionUtils.getQuestionsByCategory('quiz_akhir') : [];

            if (sumatifQuestions.length === 0) {
                this.showNotification('Soal kuis tidak tersedia', 'error');
                return;
            }

            console.log(`✅ Loaded ${sumatifQuestions.length} quiz questions`);

            if (this.unifiedQuizSystem) {
                console.log('🚀 Starting Unified Quiz System for final quiz...');
                try {
                    // Start unified quiz system with exam configuration
                    this.unifiedQuizSystem.startSession('quiz', {
                        category: 'quiz_akhir',
                        difficulty: 'mixed',
                        maxQuestionsPerSession: Math.min(15, sumatifQuestions.length),
                        totalTimeLimit: 1800, // 30 minutes
                        allowBackNavigation: true,
                        showImmediateFeedback: false,
                        enableHints: false,
                        enableExplanations: false,
                        shuffleQuestions: true,
                        shuffleAnswers: true
                    });

                    console.log('✅ Unified Quiz System started successfully');

                } catch (error) {
                    console.error('❌ Unified Quiz System error:', error);
                    this.showNotification('Gagal memulai sistem kuis', 'error');
                    this.initializeQuiz(); // Fallback
                }
            } else {
                console.warn('⚠️ Unified Quiz System not available, using fallback');
                this.initializeQuiz(); // Fallback
            }
        } catch (error) {
            console.error('❌ Error loading quiz questions:', error);
            this.showNotification('Gagal memuat soal kuis: ' + error.message, 'error');
        }
    }

    /**
     * Load quiz page
     */
    loadQuizPage(container) {
        container.innerHTML = `
            <div class="page quiz-page">
                <header class="page-header">
                    <button class="btn-back" onclick="window.mpiApp.showMainMenu()">← Kembali</button>
                    <h1>Kuis Akhir</h1>
                    <div class="user-info">
                        <span class="welcome-text">Welcome, <span id="userName">${this.studentName}</span></span>
                    </div>
                </header>
                <main class="page-content">
                    <div class="quiz-content" id="quizContent">
                        <!-- Quiz content will be loaded dynamically -->
                    </div>
                </main>
            </div>
        `;

        // Initialize Enhanced Quiz System with proper DOM ready check
        this.initializeEnhancedQuizWithRetry();
    }

    /**
     * Load certificate page
     */
    loadCertificatePage(container) {
        container.innerHTML = `
            <div class="page certificate-page">
                <header class="page-header">
                    <div class="container">
                        <button class="btn-back" onclick="window.mpiApp.navigateToMainMenu()">← Kembali</button>
                        <h1>Sertifikat Kompetensi</h1>
                        <p class="certificate-description">Sertifikat digital pencapaian kompetensi jaringan dasar</p>
                    </div>
                </header>

                <main class="page-content">
                    <div class="container">
                        <!-- Certificate Status Section -->
                        <section class="certificate-status">
                            <div class="status-card" id="certificateStatusCard">
                                <!-- Content will be loaded based on user status -->
                            </div>
                        </section>

                        <!-- Certificate Preview Section -->
                        <section class="certificate-preview-section" id="certificatePreviewSection" style="display: none;">
                            <div class="preview-header">
                                <h2>Sertifikat Anda</h2>
                                <p>Preview sertifikat kompetensi Anda</p>
                            </div>

                            <div class="certificate-container">
                                <div class="certificate-frame" id="certificateFrame">
                                    <!-- Certificate will be rendered here -->
                                </div>
                            </div>

                            <div class="certificate-actions">
                                <button class="btn btn-primary" onclick="window.mpiApp.downloadCertificate()">
                                    <span class="btn-icon">📥</span>
                                    Download PDF
                                </button>
                                <button class="btn btn-secondary" onclick="window.mpiApp.shareCertificate()">
                                    <span class="btn-icon">🔗</span>
                                    Bagikan
                                </button>
                                <button class="btn btn-outline" onclick="window.mpiApp.printCertificate()">
                                    <span class="btn-icon">🖨️</span>
                                    Cetak
                                </button>
                            </div>
                        </section>

                        <!-- Certificate Requirements Section -->
                        <section class="certificate-requirements">
                            <h2>Persyaratan Mendapatkan Sertifikat</h2>
                            <div class="requirements-grid">
                                <div class="requirement-item completed" id="requirement-quiz">
                                    <div class="requirement-icon">✅</div>
                                    <div class="requirement-content">
                                        <h4>Lulus Kuis Akhir</h4>
                                        <p>Dapatkan nilai minimal 70% pada kuis akhir</p>
                                        <div class="requirement-status">Status: <span id="quiz-status">Belum</span></div>
                                    </div>
                                </div>
                                <div class="requirement-item" id="requirement-practice">
                                    <div class="requirement-icon">📝</div>
                                    <div class="requirement-content">
                                        <h4>Selesaikan Latihan</h4>
                                        <p>Selesaikan minimal 10 latihan untuk pemahaman</p>
                                        <div class="requirement-status">Progress: <span id="practice-status">0/10</span></div>
                                    </div>
                                </div>
                                <div class="requirement-item" id="requirement-completion">
                                    <div class="requirement-icon">📚</div>
                                    <div class="requirement-content">
                                        <h4>Selesaikan Semua Materi</h4>
                                        <p>Pelajari semua modul materi pembelajaran</p>
                                        <div class="requirement-status">Progress: <span id="completion-status">0%</span></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        `;

        // Initialize certificate page
        this.initializeCertificate();
    }

    /**
     * Load AI Tutor page
     */
    loadAITutorPage(container) {
        container.innerHTML = `
            <div class="page ai-tutor-page">
                <header class="page-header">
                    <button class="btn-back">← Kembali</button>
                    <h1>AI Tutor Virtual</h1>
                </header>
                <main class="page-content">
                    <div class="ai-tutor-content">
                        <!-- AI Tutor content will be loaded here -->
                    </div>
                </main>
            </div>
        `;
        this.initializeAITutor();
    }

    /**
     * Load about page
     */
    loadAboutPage(container) {
        container.innerHTML = `
            <div class="page about-page">
                <header class="page-header">
                    <button class="btn-back">← Kembali</button>
                    <h1>Tentang Pengembang</h1>
                </header>
                <main class="page-content">
                    <div class="about-content">
                        <!-- Developer Profile Section -->
                        <div class="developer-profile">
                            <div class="profile-header">
                                <div class="profile-avatar">
                                    <img src="assets/pembuat.JPG" alt="Irawan, S.I.Kom" class="developer-photo">
                                </div>
                                <div class="profile-info">
                                    <h2 class="developer-name">Irawan, S.I.Kom</h2>
                                    <p class="developer-title">Guru Produktif TKJT</p>
                                    <p class="developer-institution">SMK Muhammadiyah 1 PPU</p>
                                </div>
                            </div>

                            <!-- Simple About Information -->
                            <div class="simple-about">
                                <div class="about-section">
                                    <h3 class="section-title">📚 Tentang Aplikasi</h3>
                                    <p>Media Pembelajaran Interaktif Jaringan Dasar adalah aplikasi web untuk mendukung pembelajaran mata pelajaran Jaringan Komputer di SMK TKJT.</p>
                                </div>
                            </div>
                        </div>

                      </div>
                </main>
            </div>
        `;
        this.initializeAbout();
    }

    /**
     * Initialize objectives page
     */
    initializeObjectives() {
        console.log('Objectives page initialized');

        // Add click interactions to objective items
        const objectiveItems = document.querySelectorAll('.objective-item');
        objectiveItems.forEach(item => {
            item.addEventListener('click', () => {
                this.handleObjectiveClick(item);
            });
        });

        // Initialize progress indicators with animation
        setTimeout(() => {
            this.animateProgressIndicators();
        }, 500);

        // Add hover effects for category sections
        const categorySections = document.querySelectorAll('.category-section');
        categorySections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            setTimeout(() => {
                section.style.transition = 'all 0.6s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    /**
     * Handle objective item click
     */
    handleObjectiveClick(item) {
        // Add pulse animation
        item.style.animation = 'pulse 0.6s ease-out';
        setTimeout(() => {
            item.style.animation = '';
        }, 600);

        // Get objective data
        const objectiveNumber = item.querySelector('.objective-number')?.textContent;
        const objectiveTitle = item.querySelector('h4')?.textContent;

        if (objectiveNumber && objectiveTitle) {
            this.showObjectiveDetail(objectiveNumber, objectiveTitle);
        }
    }

    /**
     * Show objective detail modal/popup
     */
    showObjectiveDetail(number, title) {
        // Create detail modal
        const modal = document.createElement('div');
        modal.className = 'objective-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Objektif ${number}: ${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="objective-details">
                        <h4>Kriteria Ketuntasan:</h4>
                        <ul>
                            <li>Mampu menjelaskan konsep dengan jelas</li>
                            <li>Dapat memberikan contoh nyata dalam industri</li>
                            <li>Mampu menerapkan dalam praktikum</li>
                        </ul>
                        <h4>Indikator Pencapaian:</h4>
                        <ul>
                            <li>Presentasi lisan/written test minimal 75%</li>
                            <li>Tugas praktik selesai 100%</li>
                            <li>Partisipasi aktif dalam diskusi</li>
                        </ul>
                        <h4>Materi Terkait:</h4>
                        <div class="related-topics">
                            <span class="topic-tag">Teori Dasar</span>
                            <span class="topic-tag">Praktikum</span>
                            <span class="topic-tag">Studi Kasus</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: var(--z-index-modal);
            animation: fadeIn 0.3s ease-out;
        `;

        // Add modal content styles
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, var(--color-dark) 0%, var(--color-darker) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideInFromBottom 0.4s ease-out;
        `;

        // Add to DOM
        document.body.appendChild(modal);

        // Handle close button
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeObjectiveModal(modal);
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeObjectiveModal(modal);
            }
        });

        // Add custom styles for modal content
        this.addModalStyles(modal);
    }

    /**
     * Close objective modal
     */
    closeObjectiveModal(modal) {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    /**
     * Add modal styles dynamically
     */
    addModalStyles(modal) {
        const style = document.createElement('style');
        style.textContent = `
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .modal-header h3 {
                color: var(--color-primary);
                margin: 0;
                font-family: var(--font-family-secondary);
            }
            .modal-close {
                background: none;
                border: none;
                color: var(--color-gray);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                transition: color 0.3s ease;
            }
            .modal-close:hover {
                color: var(--color-danger);
            }
            .modal-body h4 {
                color: var(--color-secondary);
                margin: 1.5rem 0 0.75rem 0;
                font-family: var(--font-family-secondary);
            }
            .modal-body h4:first-child {
                margin-top: 0;
            }
            .modal-body ul {
                color: var(--color-light-dimmed);
                line-height: 1.6;
                padding-left: 1.5rem;
            }
            .related-topics {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                margin-top: 1rem;
            }
            .topic-tag {
                padding: 0.25rem 0.75rem;
                background: rgba(0, 191, 255, 0.2);
                color: var(--color-secondary);
                border-radius: 9999px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes slideInFromBottom {
                from {
                    transform: translateY(30px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Animate progress indicators
     */
    animateProgressIndicators() {
        const progressFills = document.querySelectorAll('.progress-indicator .progress-fill');
        progressFills.forEach((fill, index) => {
            // Get user progress from userData
            const objectiveNumber = fill.closest('.objective-item').querySelector('.objective-number')?.textContent;
            if (objectiveNumber) {
                const progress = this.getObjectiveProgress(objectiveNumber);

                setTimeout(() => {
                    fill.style.width = `${progress}%`;

                    // Update label
                    const label = fill.closest('.progress-indicator').querySelector('.progress-label');
                    if (label) {
                        label.textContent = `${progress}%`;
                    }
                }, index * 200);
            }
        });
    }

    /**
     * Get objective progress from user data
     */
    getObjectiveProgress(objectiveNumber) {
        // Get progress from userData
        const progress = this.userData.progress[`objective_${objectiveNumber}`] || 0;
        return Math.min(progress, 100);
    }

    /**
     * Simulate progress update (for testing)
     */
    simulateProgressUpdate(objectiveNumber, progress) {
        this.userData.progress[`objective_${objectiveNumber}`] = progress;
        this.saveUserData();

        // Update UI if on objectives page
        const objectiveItem = document.querySelector(`.objective-item:has(.objective-number:contains("${objectiveNumber}"))`);
        if (objectiveItem) {
            const progressFill = objectiveItem.querySelector('.progress-fill');
            const progressLabel = objectiveItem.querySelector('.progress-label');

            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            if (progressLabel) {
                progressLabel.textContent = `${progress}%`;
            }
        }

        // Update main menu progress
        this.updateProgressIndicators();

        // Show notification
        this.showNotification(`Progress diperbarui: ${objectiveNumber} - ${progress}%`, 'success');
    }

    /**
     * Simulate completing all objectives (for testing)
     */
    simulateCompleteAllObjectives() {
        const objectives = ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6'];

        objectives.forEach((objective, index) => {
            setTimeout(() => {
                this.simulateProgressUpdate(objective, 100);
            }, index * 500);
        });
    }

    /**
     * Reset progress (for testing)
     */
    resetObjectivesProgress() {
        const objectives = ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6'];

        objectives.forEach(objective => {
            this.userData.progress[`objective_${objective}`] = 0;
        });

        this.saveUserData();
        this.updateProgressIndicators();

        // Update UI if on objectives page
        const progressFills = document.querySelectorAll('.progress-indicator .progress-fill');
        const progressLabels = document.querySelectorAll('.progress-label');

        progressFills.forEach(fill => {
            fill.style.width = '0%';
        });

        progressLabels.forEach(label => {
            label.textContent = '0%';
        });

        this.showNotification('Progress telah direset', 'warning');
    }

    /**
     * Initialize materials page
     */
    initializeMaterials() {
        console.log('Materials page initialized');
        this.updateMaterialsProgress();
        this.addModuleInteractions();
    }

    /**
     * Update materials progress display
     */
    updateMaterialsProgress() {
        const completedLessonsEl = document.getElementById('completedLessons');
        if (completedLessonsEl) {
            const completedCount = this.calculateCompletedLessons();
            completedLessonsEl.textContent = completedCount;
        }

        // Update module progress bars
        const modules = ['network-basics', 'network-topology', 'osi-model', 'ip-addressing'];
        modules.forEach(moduleId => {
            this.updateModuleProgress(moduleId);
        });
    }

    /**
     * Calculate completed lessons
     */
    calculateCompletedLessons() {
        let count = 0;
        const modules = ['network-basics', 'network-topology', 'osi-model', 'ip-addressing'];

        modules.forEach(moduleId => {
            const progress = this.userData.progress[`${moduleId}_progress`] || 0;
            if (progress >= 100) count++;
        });

        return count;
    }

    /**
     * Update individual module progress
     */
    updateModuleProgress(moduleId) {
        const moduleCard = document.querySelector(`[data-module="${moduleId}"]`);
        if (!moduleCard) return;

        const progress = this.userData.progress[`${moduleId}_progress`] || 0;
        const progressFill = moduleCard.querySelector('.progress-fill');
        const progressPercentage = moduleCard.querySelector('.progress-percentage');

        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        if (progressPercentage) {
            progressPercentage.textContent = `${progress}%`;
        }

        // Update topic statuses
        this.updateTopicStatuses(moduleId, progress);
    }

    /**
     * Update topic statuses based on progress
     */
    updateTopicStatuses(moduleId, progress) {
        const moduleCard = document.querySelector(`[data-module="${moduleId}"]`);
        if (!moduleCard) return;

        const topicItems = moduleCard.querySelectorAll('.topic-item');
        const completedTopics = Math.floor((progress / 100) * topicItems.length);

        topicItems.forEach((topic, index) => {
            const statusEl = topic.querySelector('.topic-status');
            if (!statusEl) return;

            if (index < completedTopics) {
                statusEl.className = 'topic-status completed';
                statusEl.textContent = '✓';
            } else if (index === completedTopics && progress > 0) {
                statusEl.className = 'topic-status current';
                statusEl.textContent = '▶';
            } else {
                statusEl.className = 'topic-status locked';
                statusEl.textContent = '🔒';
            }
        });
    }

    /**
     * Add interactions to module cards
     */
    addModuleInteractions() {
        const moduleCards = document.querySelectorAll('.module-card');
        moduleCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-12px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    /**
     * Start a module
     */
    startModule(moduleId) {
        console.log(`Starting module: ${moduleId}`);

        // Show loading modal
        this.showLessonModal(moduleId, 'module');
    }

    /**
     * Show module information
     */
    showModuleInfo(moduleId) {
        const moduleInfo = {
            'network-basics': {
                title: 'Konsep Dasar Jaringan',
                description: 'Modul ini membahas konsep fundamental jaringan komputer.',
                objectives: [
                    'Memahami pengertian jaringan komputer',
                    'Mengidentifikasi jenis-jenis jaringan',
                    'Menjelaskan manfaat jaringan',
                    'Memahami sejarah perkembangan jaringan'
                ],
                duration: '45 menit',
                difficulty: 'Pemula'
            },
            'network-topology': {
                title: 'Topologi Jaringan',
                description: 'Pelajari berbagai struktur jaringan dan implementasinya.',
                objectives: [
                    'Memahami konsep topologi jaringan',
                    'Menganalisis topologi bus, star, ring, mesh',
                    'Membandingkan kelebihan dan kekurangan',
                    'Memilih topologi yang tepat untuk kebutuhan'
                ],
                duration: '60 menit',
                difficulty: 'Pemula'
            },
            'osi-model': {
                title: 'Model OSI',
                description: '7 lapisan model OSI sebagai framework komunikasi jaringan.',
                objectives: [
                    'Memahami 7 lapisan OSI',
                    'Menjelaskan fungsi setiap lapisan',
                    'Memahami aliran data antar lapisan',
                    'Mengidentifikasi protokol pada setiap lapisan'
                ],
                duration: '90 menit',
                difficulty: 'Menengah'
            },
            'ip-addressing': {
                title: 'Alamat IP & Subnetting',
                description: 'Konsep alamat IP, kelas IP, dan teknik subnetting.',
                objectives: [
                    'Memahami struktur alamat IP',
                    'Mengidentifikasi kelas-kelas IP',
                    'Melakukan perhitungan subnetting',
                    'Memahami konsep IPv6'
                ],
                duration: '75 menit',
                difficulty: 'Menengah'
            },
                    };

        const info = moduleInfo[moduleId];
        if (!info) return;

        this.showModuleInfoModal(info);
    }

    /**
     * Show module information modal
     */
    showModuleInfoModal(info) {
        const modal = document.createElement('div');
        modal.className = 'lesson-modal';
        modal.innerHTML = `
            <div class="lesson-content">
                <div class="lesson-header">
                    <h2>${info.title}</h2>
                    <button class="lesson-close" onclick="this.closest('.lesson-modal').remove()">×</button>
                </div>
                <div class="lesson-body">
                    <div class="module-info-container">
                        <div class="module-overview">
                            <p>${info.description}</p>
                            <div class="module-meta-info">
                                <span class="meta-item">⏱️ ${info.duration}</span>
                                <span class="meta-item">📈 ${info.difficulty}</span>
                            </div>
                        </div>

                        <div class="module-objectives">
                            <h3>🎯 Tujuan Pembelajaran</h3>
                            <ul>
                                ${info.objectives.map(obj => `<li>${obj}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="module-actions">
                            <button class="btn btn-primary" onclick="window.mpiApp.startModule('${info.title.toLowerCase().replace(/\s+/g, '-')}')">
                                Mulai Modul
                            </button>
                            <button class="btn btn-secondary" onclick="this.closest('.lesson-modal').remove()">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }

    /**
     * Start a specific lesson
     */
    startLesson(lessonId) {
        console.log(`Starting lesson: ${lessonId}`);
        this.showLessonModal(lessonId, 'lesson');
    }

    /**
     * Show lesson preview
     */
    showLessonPreview(lessonId) {
        console.log(`Showing preview for lesson: ${lessonId}`);
        this.showLessonModal(lessonId, 'preview');
    }

    /**
     * Show lesson modal
     */
    showLessonModal(contentId, type) {
        const modal = document.createElement('div');
        modal.className = 'lesson-modal';

        let content = '';
        if (type === 'lesson') {
            content = this.getLessonContent(contentId);
        } else if (type === 'preview') {
            content = this.getLessonPreview(contentId);
        } else if (type === 'module') {
            content = this.getModuleIntro(contentId);
        }

        modal.innerHTML = `
            <div class="lesson-content">
                <div class="lesson-header">
                    <h2>${content.title}</h2>
                    <button class="lesson-close" onclick="window.mpiApp.closeLessonModal()">×</button>
                </div>
                <div class="lesson-body">
                    ${content.body}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }

    /**
     * Close lesson modal
     */
    closeLessonModal() {
        const modal = document.querySelector('.lesson-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }

    /**
     * Get lesson content
     */
    getLessonContent(lessonId) {
        const lessons = {
            // MODUL 1: KONSEP DASAR JARINGAN
            'network-intro': {
                title: 'Pengenalan Jaringan Komputer',
                body: `
                    <div class="lesson-content-area">
                        <div class="lesson-text">
                            <h3>📘 Definisi Jaringan Komputer</h3>
                            <p><strong>Jaringan komputer</strong> adalah kumpulan dua atau lebih komputer yang saling terhubung untuk berbagi sumber daya (resource sharing), komunikasi, dan akses informasi.</p>

                            <div class="highlight-box">
                                <h4>💡 Tujuan Utama Jaringan:</h4>
                                <ul>
                                    <li><strong>Resource Sharing:</strong> Berbagi hardware (printer, scanner) dan software</li>
                                    <li><strong>Communication:</strong> Email, chat, video conference</li>
                                    <li><strong>Information Access:</strong> Akses database dan file sharing</li>
                                    <li><strong>Entertainment:</strong> Streaming, gaming online</li>
                                </ul>
                            </div>

                            <h3>🏗️ Komponen Utama Jaringan</h3>
                            <div class="components-grid">
                                <div class="component-card">
                                    <h4>🖥️ Node/Host</h4>
                                    <p>Perangkat yang terhubung dalam jaringan:</p>
                                    <ul>
                                        <li>Komputer, laptop</li>
                                        <li>Smartphone, tablet</li>
                                        <li>Server, workstation</li>
                                        <li>IoT devices</li>
                                    </ul>
                                </div>
                                <div class="component-card">
                                    <h4>🔗 Link</h4>
                                    <p>Media transmisi data:</p>
                                    <ul>
                                        <li>Kabel (UTP, coaxial, fiber optic)</li>
                                        <li>Wireless (WiFi, Bluetooth, cellular)</li>
                                        <li>Satellite</li>
                                    </ul>
                                </div>
                                <div class="component-card">
                                    <h4>📋 Protocol</h4>
                                    <p>Aturan komunikasi:</p>
                                    <ul>
                                        <li>TCP/IP</li>
                                        <li>HTTP/HTTPS</li>
                                        <li>FTP, SMTP</li>
                                        <li>DNS</li>
                                    </ul>
                                </div>
                            </div>

                            <h3>🌐 Jenis Koneksi Jaringan</h3>
                            <div class="connection-types">
                                <div class="connection-item">
                                    <h4>📍 Point-to-Point</h4>
                                    <p>Koneksi langsung antara dua node</p>
                                    <div class="example">Contoh: Koneksi komputer ke printer</div>
                                </div>
                                <div class="connection-item">
                                    <h4>📡 Multipoint</h4>
                                    <p>Satu node terhubung ke multiple node</p>
                                    <div class="example">Contoh: WiFi hotspot</div>
                                </div>
                            </div>

                            <div class="quiz-container">
                                <h4>🎯 Quick Quiz</h4>
                                <p>Apa tujuan utama dari jaringan komputer?</p>
                                <div class="quiz-options">
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        Hanya untuk internet browsing
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, true)">
                                        Resource sharing dan komunikasi
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        Mengganti komputer lama
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            'network-types': {
                title: 'Jenis-jenis Jaringan',
                body: `
                    <div class="lesson-content-area">
                        <div class="lesson-text">
                            <h3>🌍 Klasifikasi Jaringan Berdasarkan Area Geografis</h3>

                            <div class="network-types-grid">
                                <div class="network-type-card">
                                    <div class="network-icon">🏠</div>
                                    <h4>PAN (Personal Area Network)</h4>
                                    <p>Jangkauan: 1-10 meter</p>
                                    <div class="network-details">
                                        <ul>
                                            <li>Bluetooth devices</li>
                                            <li>USB connection</li>
                                            <li>Infrared</li>
                                        </ul>
                                        <div class="example-use">💼 Use case: Headphone wireless ke smartphone</div>
                                    </div>
                                </div>

                                <div class="network-type-card">
                                    <div class="network-icon">🏢</div>
                                    <h4>LAN (Local Area Network)</h4>
                                    <p>Jangkauan: 10m - 1km</p>
                                    <div class="network-details">
                                        <ul>
                                            <li>Kantor, sekolah, rumah</li>
                                            <li>Ethernet, WiFi</li>
                                            <li>High speed: 10-1000 Mbps</li>
                                        </ul>
                                        <div class="example-use">🏫 Use case: Lab komputer sekolah</div>
                                    </div>
                                </div>

                                <div class="network-type-card">
                                    <div class="network-icon">🏙️</div>
                                    <h4>MAN (Metropolitan Area Network)</h4>
                                    <p>Jangkauan: 1-50 km</p>
                                    <div class="network-details">
                                        <ul>
                                            <li>Kota metropolitan</li>
                                            <li>Fiber optic, microwave</li>
                                            <li>Cable TV networks</li>
                                        </ul>
                                        <div class="example-use">🏙️ Use case: Jaringan pemerintah kota</div>
                                    </div>
                                </div>

                                <div class="network-type-card">
                                    <div class="network-icon">🌐</div>
                                    <h4>WAN (Wide Area Network)</h4>
                                    <p>Jangkauan: >50 km</p>
                                    <div class="network-details">
                                        <ul>
                                            <li>Antar kota, negara</li>
                                            <li>Satellite, fiber optic</li>
                                            <li>Internet</li>
                                        </ul>
                                        <div class="example-use">🌍 Use case: Jaringan perusahaan multinasional</div>
                                    </div>
                                </div>
                            </div>

                            <h3>🔄 Klasifikasi Berdasarkan Arsitektur</h3>
                            <div class="architecture-comparison">
                                <div class="arch-col">
                                    <h4>📡 Client-Server</h4>
                                    <div class="pros-cons">
                                        <div class="pros">
                                            <strong>✅ Kelebihan:</strong>
                                            <ul>
                                                <li>Centralized management</li>
                                                <li>Security lebih baik</li>
                                                <li>Scalable</li>
                                            </ul>
                                        </div>
                                        <div class="cons">
                                            <strong>❌ Kekurangan:</strong>
                                            <ul>
                                                <li>Single point of failure</li>
                                                <li>Biaya server tinggi</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="example">🏢 Bank, enterprise applications</div>
                                </div>

                                <div class="arch-col">
                                    <h4>🔗 Peer-to-Peer</h4>
                                    <div class="pros-cons">
                                        <div class="pros">
                                            <strong>✅ Kelebihan:</strong>
                                            <ul>
                                                <li>Tidak perlu server</li>
                                                <li>Mudah setup</li>
                                                <li>Biaya rendah</li>
                                            </ul>
                                        </div>
                                        <div class="cons">
                                            <strong>❌ Kekurangan:</strong>
                                            <ul>
                                                <li>Security lemah</li>
                                                <li>Management sulit</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="example">🏠 File sharing di rumah</div>
                                </div>
                            </div>

                            <div class="quiz-container">
                                <h4>🎯 Quick Quiz</h4>
                                <p>Jaringan apa yang paling cocok untuk menghubungkan komputer dalam satu gedung kantor?</p>
                                <div class="quiz-options">
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        PAN
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, true)">
                                        LAN
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        WAN
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        MAN
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            'network-benefits': {
                title: 'Manfaat Jaringan Komputer',
                body: `
                    <div class="lesson-content-area">
                        <div class="lesson-text">
                            <h3>💼 Manfaat Jaringan dalam Berbagai Sektor</h3>

                            <div class="benefits-sections">
                                <div class="benefit-section">
                                    <h4>🏢 Sektor Bisnis & Enterprise</h4>
                                    <div class="benefit-grid">
                                        <div class="benefit-item">
                                            <div class="benefit-icon">💾</div>
                                            <h5>Data Sharing</h5>
                                            <p>Centralized database, cloud storage, collaborative documents</p>
                                            <div class="impact">Impact: 75% efficiency increase</div>
                                        </div>
                                        <div class="benefit-item">
                                            <div class="benefit-icon">👥</div>
                                            <h5>Collaboration</h5>
                                            <p>Video conferencing, team messaging, project management tools</p>
                                            <div class="impact">Impact: 60% better teamwork</div>
                                        </div>
                                        <div class="benefit-item">
                                            <div class="benefit-icon">🔐</div>
                                            <h5>Security</h5>
                                            <p>Centralized security management, backup systems</p>
                                            <div class="impact">Impact: 90% data protection</div>
                                        </div>
                                        <div class="benefit-item">
                                            <div class="benefit-icon">📈</div>
                                            <h5>Scalability</h5>
                                            <p>Easy expansion, remote work support</p>
                                            <div class="impact">Impact: 50% growth capability</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="benefit-section">
                                    <h4>🎓 Sektor Pendidikan</h4>
                                    <div class="benefit-grid">
                                        <div class="benefit-item">
                                            <div class="benefit-icon">📚</div>
                                            <h5>E-Learning</h5>
                                            <p>Online courses, digital libraries, research access</p>
                                            <div class="impact">Impact: 80% learning accessibility</div>
                                        </div>
                                        <div class="benefit-item">
                                            <div class="benefit-icon">🌐</div>
                                            <h5>Global Access</h5>
                                            <p>International collaboration, distance learning</p>
                                            <div class="impact">Impact: Unlimited reach</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="benefit-section">
                                    <h4>🏥 Sektor Kesehatan</h4>
                                    <div class="benefit-grid">
                                        <div class="benefit-item">
                                            <div class="benefit-icon">🏥</div>
                                            <h5>Telemedicine</h5>
                                            <p>Remote consultation, patient monitoring</p>
                                            <div class="impact">Impact: 40% faster diagnosis</div>
                                        </div>
                                        <div class="benefit-item">
                                            <div class="benefit-icon">📋</div>
                                            <h5>Medical Records</h5>
                                            <p>EMR systems, hospital information systems</p>
                                            <div class="impact">Impact: 95% accuracy improvement</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="benefit-section">
                                    <h4>🏠 Kehidupan Sehari-hari</h4>
                                    <div class="benefit-grid">
                                        <div class="benefit-item">
                                            <div class="benefit-icon">📱</div>
                                            <h5>Komunikasi</h5>
                                            <p>Social media, messaging, video calls</p>
                                            <div class="impact">Impact: Global connectivity</div>
                                        </div>
                                        <div class="benefit-item">
                                            <div class="benefit-icon">🎮</div>
                                            <h5>Entertainment</h5>
                                            <p>Streaming, gaming, content creation</p>
                                            <div class="impact">Impact: Rich media experience</div>
                                        </div>
                                        <div class="benefit-item">
                                            <div class="benefit-icon">🛒</div>
                                            <h5>E-Commerce</h5>
                                            <p>Online shopping, digital payments</p>
                                            <div class="impact">Impact: 24/7 marketplace</div>
                                        </div>
                                        <div class="benefit-item">
                                            <div class="benefit-icon">🏠</div>
                                            <h5>Smart Home</h5>
                                            <p>IoT devices, home automation</p>
                                            <div class="impact">Impact: Convenient living</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="case-study">
                                <h4>📊 Case Study: Transformasi Digital</h4>
                                <div class="case-comparison">
                                    <div class="before-after">
                                        <h5>❌ Before Network</h5>
                                        <ul>
                                            <li>Paper-based processes</li>
                                            <li>Manual communication</li>
                                            <li>Limited information access</li>
                                            <li>Geographic constraints</li>
                                        </ul>
                                    </div>
                                    <div class="after-network">
                                        <h5>✅ After Network Implementation</h5>
                                        <ul>
                                            <li>Digital workflows</li>
                                            <li>Instant communication</li>
                                            <li>Global information access</li>
                                            <li>Remote collaboration</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="quiz-container">
                                <h4>🎯 Quick Quiz</h4>
                                <p>Manfaat utama jaringan dalam bidang kesehatan adalah?</p>
                                <div class="quiz-options">
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, true)">
                                        Telemedicine dan patient monitoring
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        Hanya untuk email
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        Gaming online
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            'network-history': {
                title: 'Sejarah Perkembangan Jaringan Komputer',
                body: `
                    <div class="lesson-content-area">
                        <div class="lesson-text">
                            <h3>📜 Timeline Evolusi Jaringan Komputer</h3>

                            <div class="timeline-container">
                                <div class="timeline-item">
                                    <div class="year">1950s</div>
                                    <div class="event">
                                        <h4>🎯 Konsep Awal</h4>
                                        <p>J.C.R. Licklider mengusulkan "Galactic Network" - konsep jaringan komputer global untuk berbagi informasi dan resources.</p>
                                        <div class="significance">💡 Foundation of modern networking</div>
                                    </div>
                                </div>

                                <div class="timeline-item">
                                    <div class="year">1960s</div>
                                    <div class="event">
                                        <h4>🚀 ARPANET lahir</h4>
                                        <p><strong>1969:</strong> ARPANET (Advanced Research Projects Agency Network) dibuat oleh DARPA untuk keperluan militer AS.</p>
                                        <div class="milestone">
                                            <ul>
                                                <li>4 node pertama: UCLA, Stanford, UCSB, University of Utah</li>
                                                <li>First message: "LO" (seharusnya "LOGIN")</li>
                                                <li>Packet switching technology</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-item">
                                    <div class="year">1970s</div>
                                    <div class="event">
                                        <h4>🏗️ Fondasi TCP/IP</h4>
                                        <p><strong>1974:</strong> Vint Cerf dan Bob Kahn mengembangkan TCP/IP protocol.</p>
                                        <div class="innovation">
                                            <ul>
                                                <li>TCP (Transmission Control Protocol)</li>
                                                <li>IP (Internet Protocol)</li>
                                                <li>Email pertama dikirim (1971)</li>
                                                <li>First public packet switching network</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-item">
                                    <div class="year">1980s</div>
                                    <div class="event">
                                        <h4>🌐 DNS dan WWW</h4>
                                        <p><strong>1983:</strong> ARPANET beralih ke TCP/IP.</p>
                                        <div class="developments">
                                            <ul>
                                                <li><strong>1983:</strong> Domain Name System (DNS) dibuat</li>
                                                <li><strong>1985:</strong> First domain name registered: Symbolics.com</li>
                                                <li><strong>1989:</strong> Tim Berners-Lee menciptakan World Wide Web</li>
                                                <li><strong>1990:</strong> HTTP protocol dan HTML language</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-item">
                                    <div class="year">1990s</div>
                                    <div class="event">
                                        <h4>📈 Internet Boom</h4>
                                        <p><strong>1991:</strong> World Wide Web menjadi publicly available.</p>
                                        <div class="milestones">
                                            <ul>
                                                <li><strong>1993:</strong> Mosaic browser - first graphical web browser</li>
                                                <li><strong>1995:</strong> Commercialization begins</li>
                                                <li><strong>1997:</strong> WiFi standard (802.11) introduced</li>
                                                <li><strong>1998:</strong> Google founded</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-item">
                                    <div class="year">2000s</div>
                                    <div class="event">
                                        <h4>📱 Mobile & Social Revolution</h4>
                                        <div class="innovations">
                                            <ul>
                                                <li><strong>2004:</strong> Facebook founded</li>
                                                <li><strong>2007:</strong> iPhone - smartphone revolution</li>
                                                <li><strong>2009:</strong> 4G networks</li>
                                                <li><strong>2010:</strong> Cloud computing boom</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-item">
                                    <div class="year">2010s - Present</div>
                                    <div class="event">
                                        <h4>🚀 Era Modern</h4>
                                        <div class="modern-era">
                                            <ul>
                                                <li><strong>IoT (Internet of Things)</strong></li>
                                                <li><strong>5G Networks</strong></li>
                                                <li><strong>Cloud Native Applications</strong></li>
                                                <li><strong>AI & Machine Learning Integration</strong></li>
                                                <li><strong>Edge Computing</strong></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="key-innovations">
                                <h4>🔑 Inovasi Penting yang Mengubah Dunia</h4>
                                <div class="innovation-grid">
                                    <div class="innovation-item">
                                        <h5>📦 Packet Switching</h5>
                                        <p>Revolution in data transmission - breaks data into small packets</p>
                                    </div>
                                    <div class="innovation-item">
                                        <h5>🌍 TCP/IP</h5>
                                        <p>Universal language of the internet</p>
                                    </div>
                                    <div class="innovation-item">
                                        <h5>🔍 DNS</h5>
                                        <p>Phonebook of the internet - translates domains to IP</p>
                                    </div>
                                    <div class="innovation-item">
                                        <h5>🌐 WWW</h5>
                                        <p>Made internet accessible to everyone</p>
                                    </div>
                                </div>
                            </div>

                            <div class="future-outlook">
                                <h4>🔮 Masa Depan Jaringan</h4>
                                <div class="future-tech">
                                    <ul>
                                        <li><strong>6G Networks:</strong> Terabit speeds, AI integration</li>
                                        <li><strong>Quantum Internet:</strong> Unbreakable security</li>
                                        <li><strong>Neural Interfaces:</strong> Direct brain-computer connections</li>
                                        <li><strong>Holographic Communication:</strong> 3D telepresence</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="quiz-container">
                                <h4>🎯 Quick Quiz</h4>
                                <p>Tahun berapa ARPANET pertama kali dibuat?</p>
                                <div class="quiz-options">
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        1950
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, true)">
                                        1969
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        1975
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        1985
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },

            // MODUL 2: TOPOLOGI JARINGAN
            'topology-bus': {
                title: 'Topologi Bus',
                body: `
                    <div class="lesson-content-area">
                        <div class="lesson-text">
                            <h3>🚌 Topologi Bus</h3>

                            <div class="topology-overview">
                                <div class="topology-visual">
                                    <div class="bus-diagram">
                                        <div class="bus-line"></div>
                                        <div class="node node-1">PC 1</div>
                                        <div class="node node-2">PC 2</div>
                                        <div class="node node-3">PC 3</div>
                                        <div class="node node-4">PC 4</div>
                                        <div class="terminator terminator-left">T</div>
                                        <div class="terminator terminator-right">T</div>
                                    </div>
                                </div>

                                <div class="topology-definition">
                                    <h4>📖 Definisi</h4>
                                    <p>Topologi bus adalah topologi jaringan di mana semua komputer terhubung ke satu kabel utama (backbone) yang disebut bus.</p>

                                    <div class="key-components">
                                        <h5>🔧 Komponen Utama:</h5>
                                        <ul>
                                            <li><strong>Main Cable (Bus):</strong> Kabel utama yang menyalurkan data</li>
                                            <li><strong>T-Connectors:</strong> Konektor untuk menghubungkan node ke bus</li>
                                            <li><strong>Terminators:</strong> Resistor di ujung kabel untuk mencegah signal reflection</li>
                                            <li><strong>Nodes:</strong> Komputer/perangkat yang terhubung</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="topology-characteristics">
                                <h4>⚙️ Karakteristik Topologi Bus</h4>
                                <div class="characteristics-grid">
                                    <div class="char-item">
                                        <h5>📡 Cara Kerja</h5>
                                        <ul>
                                            <li>Semua node menggunakan media yang sama</li>
                                            <li>Data broadcast ke semua node</li>
                                            <li>Node menerima data yang alamatnya cocok</li>
                                            <li>CSMA/CD protocol untuk collision handling</li>
                                        </ul>
                                    </div>
                                    <div class="char-item">
                                        <h5>📊 Data Transmission</h5>
                                        <ul>
                                            <li>Baseband transmission</li>
                                            <li>Half-duplex communication</li>
                                            <li>10 Mbps (typical for Ethernet)</li>
                                            <li>Coaxial cable (RG-58)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="pros-cons-section">
                                <h4>⚖️ Kelebihan dan Kekurangan</h4>
                                <div class="pros-cons-grid">
                                    <div class="pros-card">
                                        <h5>✅ Kelebihan</h5>
                                        <ul>
                                            <li><strong>Biaya rendah</strong> - Kabel minimal</li>
                                            <li><strong>Setup mudah</strong> - Instalasi sederhana</li>
                                            <li><strong>Ekstensi mudah</strong> - Tambah node dengan T-connector</li>
                                            <li><strong>Less cabling</strong> - Linear cable layout</li>
                                            <li><strong>Suitable for small networks</strong> - 5-10 devices</li>
                                        </ul>
                                    </div>
                                    <div class="cons-card">
                                        <h5>❌ Kekurangan</h5>
                                        <ul>
                                            <li><strong>Single point of failure</strong> - Kabel utama putus = network down</li>
                                            <li><strong>Performance degradation</strong> - More nodes = slower</li>
                                            <li><strong>Collision domains</strong> - Data collision frequent</li>
                                            <li><strong>Troubleshooting difficult</strong> - Hard to locate faults</li>
                                            <li><strong>Limited length</strong> - 185m max without repeaters</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="use-cases">
                                <h4>🎯 Use Cases</h4>
                                <div class="use-case-grid">
                                    <div class="use-case">
                                        <h5>🏠 Small Office Networks</h5>
                                        <p>Office dengan 5-10 komputer untuk file sharing dan printer sharing</p>
                                    </div>
                                    <div class="use-case">
                                        <h5>🏫 Lab Komputer Dasar</h5>
                                        <p>Pengenalan networking, setup sederhana untuk pendidikan</p>
                                    </div>
                                    <div class="use-case">
                                        <h5>🔧 Temporary Networks</h5>
                                        <p>Event atau lokasi yang butuh jaringan cepat dan murah</p>
                                    </div>
                                </div>
                            </div>

                            <div class="troubleshooting">
                                <h4>🔧 Common Problems & Solutions</h4>
                                <div class="problem-solution">
                                    <div class="problem">
                                        <h5>❌ Network Down</h5>
                                        <p><strong>Cause:</strong> Kabel utama putus atau terminator rusak</p>
                                        <p><strong>Solution:</strong> Check kabel continuity, replace terminator</p>
                                    </div>
                                    <div class="problem">
                                        <h5>⚡ Intermittent Connection</h5>
                                        <p><strong>Cause:</strong> Loose connector atau bad T-connection</p>
                                        <p><strong>Solution:</strong> Tighten connectors, replace damaged parts</p>
                                    </div>
                                    <div class="problem">
                                        <h5>🐌 Slow Performance</h5>
                                        <p><strong>Cause:</strong> Too many nodes atau bad cable quality</p>
                                        <p><strong>Solution:</strong> Limit nodes, upgrade to better cable</p>
                                    </div>
                                </div>
                            </div>

                            <div class="comparison">
                                <h4>📊 Comparison with Modern Topologies</h4>
                                <div class="comparison-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Aspect</th>
                                                <th>Bus Topology</th>
                                                <th>Star Topology (Modern)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Reliability</td>
                                                <td class="poor">Poor</td>
                                                <td class="good">Good</td>
                                            </tr>
                                            <tr>
                                                <td>Performance</td>
                                                <td class="poor">Poor</td>
                                                <td class="good">Excellent</td>
                                            </tr>
                                            <tr>
                                                <td>Cost</td>
                                                <td class="good">Low</td>
                                                <td class="moderate">Moderate</td>
                                            </tr>
                                            <tr>
                                                <td>Scalability</td>
                                                <td class="poor">Poor</td>
                                                <td class="good">Excellent</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="quiz-container">
                                <h4>🎯 Quick Quiz</h4>
                                <p>Apa yang terjadi jika kabel utama (backbone) pada topologi bus putus?</p>
                                <div class="quiz-options">
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        Hanya satu node yang terpengaruh
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, true)">
                                        Seluruh jaringan akan down
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        Tidak ada pengaruh
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        Hanya 50% node yang terpengaruh
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },

            'topology-star': {
                title: 'Topologi Star',
                body: `
                    <div class="lesson-content-area">
                        <div class="lesson-text">
                            <h3>⭐ Topologi Star</h3>

                            <div class="topology-overview">
                                <div class="topology-visual">
                                    <div class="star-diagram">
                                        <div class="central-device">Switch/Hub</div>
                                        <div class="node node-1">PC 1</div>
                                        <div class="node node-2">PC 2</div>
                                        <div class="node node-3">PC 3</div>
                                        <div class="node node-4">PC 4</div>
                                        <div class="node node-5">PC 5</div>
                                        <div class="node node-6">PC 6</div>
                                        <div class="connection conn-1"></div>
                                        <div class="connection conn-2"></div>
                                        <div class="connection conn-3"></div>
                                        <div class="connection conn-4"></div>
                                        <div class="connection conn-5"></div>
                                        <div class="connection conn-6"></div>
                                    </div>
                                </div>

                                <div class="topology-definition">
                                    <h4>📖 Definisi</h4>
                                    <p>Topologi star adalah topologi jaringan di mana semua komputer terhubung ke satu perangkat pusat (hub/switch) yang mengatur komunikasi.</p>

                                    <div class="key-components">
                                        <h5>🔧 Komponen Utama:</h5>
                                        <ul>
                                            <li><strong>Central Device:</strong> Hub, Switch, atau Router</li>
                                            <li><strong>Point-to-Point Connections:</strong> Kabel dari setiap node ke central device</li>
                                            <li><strong>Nodes:</strong> Komputer, printer, server</li>
                                            <li><strong>Network Interface Cards (NIC):strong> Kartu jaringan di setiap node</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="topology-types">
                                <h4>🔄 Jenis Topologi Star</h4>
                                <div class="star-types-grid">
                                    <div class="type-card">
                                        <h5>🔌 Star with Hub</h5>
                                        <ul>
                                            <li>Cheapest option</li>
                                            <li>Shared bandwidth</li>
                                            <li>All data broadcast to all ports</li>
                                            <li>Half-duplex communication</li>
                                        </ul>
                                        <div class="use-case">🏠 Home networks, small offices</div>
                                    </div>
                                    <div class="type-card">
                                        <h5>🔀 Star with Switch</h5>
                                        <ul>
                                            <li>More expensive than hub</li>
                                            <li>Dedicated bandwidth per port</li>
                                            <li>Intelligent data forwarding</li>
                                            <li>Full-duplex communication</li>
                                        </ul>
                                        <div class="use-case">🏢 Enterprise networks, high-performance needs</div>
                                    </div>
                                    <div class="type-card">
                                        <h5>🌐 Star with Router</h5>
                                        <ul>
                                            <li>Including routing capabilities</li>
                                            <li>Network segmentation</li>
                                            <li>Internet connectivity</li>
                                            <li>Advanced security features</li>
                                        </ul>
                                        <div class="use-case">🌍 Multi-network connectivity</div>
                                    </div>
                                </div>
                            </div>

                            <div class="working-principle">
                                <h4>⚙️ Cara Kerja</h4>
                                <div class="working-steps">
                                    <div class="step">
                                        <div class="step-number">1</div>
                                        <div class="step-content">
                                            <h5>Node wants to send data</h5>
                                            <p>Computer A mengirim data ke central device</p>
                                        </div>
                                    </div>
                                    <div class="step">
                                        <div class="step-number">2</div>
                                        <div class="step-content">
                                            <h5>Central device processes</h5>
                                            <p>Hub: Broadcast ke semua ports | Switch: Forward ke destination port</p>
                                        </div>
                                    </div>
                                    <div class="step">
                                        <div class="step-number">3</div>
                                        <div class="step-content">
                                            <h5>Destination receives</h5>
                                            <p>Computer B menerima data dari central device</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="pros-cons-section">
                                <h4>⚖️ Kelebihan dan Kekurangan</h4>
                                <div class="pros-cons-grid">
                                    <div class="pros-card">
                                        <h5>✅ Kelebihan</h5>
                                        <ul>
                                            <li><strong>High reliability</strong> - Single node failure doesn't affect network</li>
                                            <li><strong>Easy troubleshooting</strong> - Isolate problematic nodes easily</li>
                                            <li><strong>Good performance</strong> - Dedicated connections with switch</li>
                                            <li><strong>Easy to add nodes</strong> - Simple cable connection</li>
                                            <li><strong>Scalable</strong> - Support many nodes</li>
                                            <li><strong>Flexible</strong> - Can use different media types</li>
                                        </ul>
                                    </div>
                                    <div class="cons-card">
                                        <h5>❌ Kekurangan</h5>
                                        <ul>
                                            <li><strong>Central point of failure</strong> - If central device fails, network down</li>
                                            <li><strong>Higher cost</strong> - Need central device and more cabling</li>
                                            <li><strong>Limited by central device</strong> - Max ports on hub/switch</li>
                                            <li><strong>Cable management</strong> - More cables to manage</li>
                                            <li><strong>Distance limitations</strong> - Each cable limited to 100m (Ethernet)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="performance-aspects">
                                <h4>📊 Aspek Performa</h4>
                                <div class="performance-grid">
                                    <div class="perf-item">
                                        <h5>🚀 Speed</h5>
                                        <ul>
                                            <li>Hub: 10/100 Mbps shared</li>
                                            <li>Switch: 10/100/1000/10000 Mbps dedicated</li>
                                            <li>Full-duplex with switch</li>
                                            <li>Half-duplex with hub</li>
                                        </ul>
                                    </div>
                                    <div class="perf-item">
                                        <h5>📈 Bandwidth</h5>
                                        <ul>
                                            <li>Hub: Shared among all nodes</li>
                                            <li>Switch: Dedicated per port</li>
                                            <li>No collision domains with switch</li>
                                            <li>Better utilization with switch</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="modern-applications">
                                <h4>🏢 Aplikasi Modern</h4>
                                <div class="application-grid">
                                    <div class="app-item">
                                        <h5>🌐 Enterprise Networks</h5>
                                        <p>Large corporate networks with multiple switches</p>
                                    </div>
                                    <div class="app-item">
                                        <h5>🏠 Home Networks</h5>
                                        <p>WiFi routers with Ethernet ports</p>
                                    </div>
                                    <div class="app-item">
                                        <h5>🏫 Educational Institutions</h5>
                                        <p>Computer labs, campus networks</p>
                                    </div>
                                    <div class="app-item">
                                        <h5>🏥 Healthcare</h5>
                                        <p>Hospital information systems, medical devices</p>
                                    </div>
                                </div>
                            </div>

                            <div class="comparison-bus-star">
                                <h4>📊 Star vs Bus Comparison</h4>
                                <div class="comparison-chart">
                                    <div class="comparison-item">
                                        <div class="criteria">Reliability</div>
                                        <div class="bar">
                                            <div class="star-bar" style="width: 90%">⭐ 90%</div>
                                            <div class="bus-bar" style="width: 30%">🚌 30%</div>
                                        </div>
                                    </div>
                                    <div class="comparison-item">
                                        <div class="criteria">Performance</div>
                                        <div class="bar">
                                            <div class="star-bar" style="width: 85%">⭐ 85%</div>
                                            <div class="bus-bar" style="width: 40%">🚌 40%</div>
                                        </div>
                                    </div>
                                    <div class="comparison-item">
                                        <div class="criteria">Cost</div>
                                        <div class="bar">
                                            <div class="star-bar" style="width: 60%">⭐ 60%</div>
                                            <div class="bus-bar" style="width: 90%">🚌 90%</div>
                                        </div>
                                    </div>
                                    <div class="comparison-item">
                                        <div class="criteria">Scalability</div>
                                        <div class="bar">
                                            <div class="star-bar" style="width: 95%">⭐ 95%</div>
                                            <div class="bus-bar" style="width: 25%">🚌 25%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="troubleshooting-guide">
                                <h4>🔧 Troubleshooting Guide</h4>
                                <div class="troubleshooting-steps">
                                    <div class="trouble-step">
                                        <h5>1️⃣ Node tidak konek?</h5>
                                        <ul>
                                            <li>Check kabel connection to central device</li>
                                            <li>Verify NIC status lights</li>
                                            <li>Test with different cable/port</li>
                                        </ul>
                                    </div>
                                    <div class="trouble-step">
                                        <h5>2️⃣ Seluruh jaringan down?</h5>
                                        <ul>
                                            <li>Check central device power</li>
                                            <li>Verify central device configuration</li>
                                            <li>Check internet/router connection</li>
                                        </ul>
                                    </div>
                                    <div class="trouble-step">
                                        <h5>3️⃣ Slow network?</h5>
                                        <ul>
                                            <li>Check central device capacity</li>
                                            <li>Upgrade from hub to switch</li>
                                            <li>Check for network loops</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="quiz-container">
                                <h4>🎯 Quick Quiz</h4>
                                <p>Apa keunggulan utama topologi star dibandingkan topologi bus?</p>
                                <div class="quiz-options">
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        Lebih murah
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        Lebih sedikit kabel
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, true)">
                                    Lebih reliable dan mudah troubleshooting
                                    </div>
                                    <div class="quiz-option" onclick="window.mpiApp.checkAnswer(this, false)">
                                        Setup lebih cepat
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            'topology-ring': {
                title: 'Topologi Ring',
                body: `
                    <div class="lesson-content-area">
                        <div class="lesson-text">
                            <h3>⭕ Topologi Ring</h3>
                            <div class="topology-overview">
                                <div class="topology-visual">
                                    <div class="ring-diagram">
                                        <div class="node node-1">PC 1</div>
                                        <div class="node node-2">PC 2</div>
                                        <div class="node node-3">PC 3</div>
                                        <div class="node node-4">PC 4</div>
                                        <div class="node node-5">PC 5</div>
                                        <div class="node node-6">PC 6</div>
                                        <div class="connection conn-1"></div>
                                        <div class="connection conn-2"></div>
                                        <div class="connection conn-3"></div>
                                        <div class="connection conn-4"></div>
                                        <div class="connection conn-5"></div>
                                        <div class="connection conn-6"></div>
                                        <div class="data-flow">
                                            <div class="flow-arrow">➡️</div>
                                            <div class="flow-label">Data Flow</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="topology-definition">
                                    <h4>📖 Definisi</h4>
                                    <p>Topologi ring adalah topologi jaringan di mana setiap komputer terhubung ke dua komputer lainnya, membentuk lingkaran tertutup.</p>
                                    <div class="key-components">
                                        <h5>🔧 Komponen Utama:</h5>
                                        <ul>
                                            <li><strong>Nodes:</strong> Komputer yang terhubung dalam lingkaran</li>
                                            <li><strong>Point-to-Point Connections:</strong> Kabel antar node bertetangga</li>
                                            <li><strong>Token:</strong> Sinyal kontrol yang beredar dalam jaringan</li>
                                            <li><strong>MAU:</strong> Unit akses multi-stasiun</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="topology-types">
                                <h4>🔄 Jenis Topologi Ring</h4>
                                <div class="ring-types-grid">
                                    <div class="type-card">
                                        <h5>🔄 Single Ring</h5>
                                        <ul>
                                            <li>Satu jalur data saja</li>
                                            <li>Data beredar satu arah</li>
                                            <li>Sederhana dan murah</li>
                                            <li>Risiko single point failure</li>
                                        </ul>
                                        <div class="use-case">🏠 Small networks</div>
                                    </div>
                                    <div class="type-card">
                                        <h5>🔄 Dual Ring</h5>
                                        <ul>
                                            <li>Dua jalur data (primer & sekunder)</li>
                                            <li>Fault tolerance otomatis</li>
                                            <li>Lebih kompleks</li>
                                            <li>Biaya lebih tinggi</li>
                                        </ul>
                                        <div class="use-case">🏢 Critical systems</div>
                                    </div>
                                </div>
                            </div>

                            <div class="working-principle">
                                <h4>⚙️ Cara Kerja Token Passing</h4>
                                <div class="working-steps">
                                    <div class="step">
                                        <div class="step-number">1</div>
                                        <div class="step-content">
                                            <h5>Token Beredar</h5>
                                            <p>Token beredar mengelilingi jaringan</p>
                                        </div>
                                    </div>
                                    <div class="step">
                                        <div class="step-number">2</div>
                                        <div class="step-content">
                                            <h5>Capture Token</h5>
                                            <p>Node dengan token berhak mengirim data</p>
                                        </div>
                                    </div>
                                    <div class="step">
                                        <div class="step-number">3</div>
                                        <div class="step-content">
                                            <h5>Transmisi Data</h5>
                                            <p>Data dikirim ke node tujuan</p>
                                        </div>
                                    </div>
                                    <div class="step">
                                        <div class="step-number">4</div>
                                        <div class="step-content">
                                            <h5>Acknowledgment</h5>
                                            <p>Node tujuan konfirmasi penerimaan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="advantages-disadvantages">
                                <div class="advantages">
                                    <h4>✅ Kelebihan</h4>
                                    <ul>
                                        <li><strong>No Collisions:</strong> Token passing mencegah collision</li>
                                        <li><strong>Equal Access:</strong> Semua node punya kesempatan sama</li>
                                        <li><strong>Orderly Transmission:</strong> Transmisi terstruktur</li>
                                        <li><strong>Good Performance:</strong> Baik untuk beban sedang</li>
                                    </ul>
                                </div>
                                <div class="disadvantages">
                                    <h4>❌ Kekurangan</h4>
                                    <ul>
                                        <li><strong>Failure Impact:</strong> Satu node gagal = seluruh jaringan terpengaruh</li>
                                        <li><strong>Slow Troubleshooting:</strong> Sulit mengidentifikasi masalah</li>
                                        <li><strong>Limited Expansion:</strong> Sulit menambah node</li>
                                        <li><strong>Complex Setup:</strong> Konfigurasi lebih rumit</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="comparison-section">
                                <h4>📊 Perbandingan Topologi</h4>
                                <table class="comparison-table">
                                    <thead>
                                        <tr>
                                            <th>Kriteria</th>
                                            <th>Ring</th>
                                            <th>Star</th>
                                            <th>Bus</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Performance</td>
                                            <td class="good">🟢 Baik</td>
                                            <td class="good">🟢 Baik</td>
                                            <td class="medium">🟡 Sedang</td>
                                        </tr>
                                        <tr>
                                            <td>Reliability</td>
                                            <td class="poor">🔴 Rendah</td>
                                            <td class="good">🟢 Tinggi</td>
                                            <td class="poor">🔴 Rendah</td>
                                        </tr>
                                        <tr>
                                            <td>Cost</td>
                                            <td class="medium">🟡 Sedang</td>
                                            <td class="good">🟢 Rendah</td>
                                            <td class="good">🟢 Rendah</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="interactive-quiz">
                                <h4>🎯 Quiz</h4>
                                <div class="quiz-question">
                                    <p><strong>Soal:</strong> Apa keunggulan utama topologi ring?</p>
                                    <div class="quiz-options">
                                        <label class="quiz-option">
                                            <input type="radio" name="q1" value="a">
                                            <span>a. Biaya paling murah</span>
                                        </label>
                                        <label class="quiz-option">
                                            <input type="radio" name="q1" value="b">
                                            <span>b. Tidak ada collision</span>
                                        </label>
                                        <label class="quiz-option">
                                            <input type="radio" name="q1" value="c">
                                            <span>c. Paling mudah dikonfigurasi</span>
                                        </label>
                                    </div>
                                    <button class="quiz-check" onclick="window.mpiApp.checkQuizAnswer(this, 'b')">Check</button>
                                </div>
                            </div>

                            <div class="lesson-summary">
                                <h4>📝 Ringkasan</h4>
                                <p>Topologi ring menggunakan token passing untuk mencegah collision. Setiap node terhubung ke dua node tetangga membentuk lingkaran. Bagus untuk performance tapi rentan terhadap kegagalan single node.</p>
                            </div>
                        </div>
                    </div>
                `
            },
            'topology-mesh': {
                title: 'Topologi Mesh',
                body: `
                    <div class="lesson-content-area">
                        <div class="lesson-text">
                            <h3>🕸️ Topologi Mesh</h3>
                            <div class="topology-overview">
                                <div class="topology-visual">
                                    <div class="mesh-diagram">
                                        <div class="node node-1">PC 1</div>
                                        <div class="node node-2">PC 2</div>
                                        <div class="node node-3">PC 3</div>
                                        <div class="node node-4">PC 4</div>
                                        <div class="node node-5">PC 5</div>
                                        <div class="node node-6">PC 6</div>
                                        <div class="connection conn-1"></div>
                                        <div class="connection conn-2"></div>
                                        <div class="connection conn-3"></div>
                                        <div class="connection conn-4"></div>
                                        <div class="connection conn-5"></div>
                                        <div class="connection conn-6"></div>
                                        <div class="connection conn-7"></div>
                                        <div class="connection conn-8"></div>
                                        <div class="connection conn-9"></div>
                                        <div class="connection conn-10"></div>
                                        <div class="connection conn-11"></div>
                                        <div class="connection conn-12"></div>
                                        <div class="connection conn-13"></div>
                                        <div class="connection conn-14"></div>
                                        <div class="connection conn-15"></div>
                                        <div class="redundancy-indicator">
                                            <div class="redundancy-icon">🔄</div>
                                            <div class="redundancy-label">Full Redundancy</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="topology-definition">
                                    <h4>📖 Definisi</h4>
                                    <p>Topologi mesh adalah topologi jaringan di mana setiap perangkat terhubung langsung ke beberapa atau semua perangkat lain dalam jaringan.</p>
                                    <div class="key-components">
                                        <h5>🔧 Komponen Utama:</h5>
                                        <ul>
                                            <li><strong>Nodes:</strong> Perangkat dengan routing capability</li>
                                            <li><strong>Multiple Connections:</strong> Beberapa jalur ke setiap node</li>
                                            <li><strong>Routing Protocols:</strong> OSPF, BGP, EIGRP</li>
                                            <li><strong>Self-Healing:</strong> Kemampuan recovery otomatis</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="topology-types">
                                <h4>🔄 Jenis Topologi Mesh</h4>
                                <div class="mesh-types-grid">
                                    <div class="type-card">
                                        <h5>🕸️ Full Mesh</h5>
                                        <ul>
                                            <li>Semua node terhubung ke semua node</li>
                                            <li>Redundancy maksimal</li>
                                            <li>Jumlah koneksi: n(n-1)/2</li>
                                            <li>Biaya sangat tinggi</li>
                                        </ul>
                                        <div class="calculation-example">
                                            <strong>Contoh:</strong> 6 node = 15 koneksi
                                        </div>
                                        <div class="use-case">🏢 Critical infrastructure</div>
                                    </div>
                                    <div class="type-card">
                                        <h5>🌐 Partial Mesh</h5>
                                        <ul>
                                            <li>Beberapa node terhubung ke semua node</li>
                                            <li>Node lain terhubung ke beberapa node</li>
                                            <li>Redundancy terbatas</li>
                                            <li>Biaya lebih wajar</li>
                                        </ul>
                                        <div class="calculation-example">
                                            <strong>Contoh:</strong> 6 node = 8-10 koneksi
                                        </div>
                                        <div class="use-case">🌍 WAN networks</div>
                                    </div>
                                </div>
                            </div>

                            <div class="working-principle">
                                <h4>⚙️ Cara Kerja Routing</h4>
                                <div class="working-steps">
                                    <div class="step">
                                        <div class="step-number">1</div>
                                        <div class="step-content">
                                            <h5>Route Discovery</h5>
                                            <p>Router menemukan jalur terbaik</p>
                                        </div>
                                    </div>
                                    <div class="step">
                                        <div class="step-number">2</div>
                                        <div class="step-content">
                                            <h5>Path Selection</h5>
                                            <p>Memilih jalur berdasarkan metric</p>
                                        </div>
                                    </div>
                                    <div class="step">
                                        <div class="step-number">3</div>
                                        <div class="step-content">
                                            <h5>Data Forwarding</h5>
                                            <p>Data dikirim melalui jalur terpilih</p>
                                        </div>
                                    </div>
                                    <div class="step">
                                        <div class="step-number">4</div>
                                        <div class="step-content">
                                            <h5>Failover</h5>
                                            <p>Otomatis ganti jalur jika gangguan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="advantages-disadvantages">
                                <div class="advantages">
                                    <h4>✅ Kelebihan</h4>
                                    <ul>
                                        <li><strong>High Reliability:</strong> Redundancy penuh</li>
                                        <li><strong>Self-Healing:</strong> Recovery otomatis</li>
                                        <li><strong>Load Balancing:</strong> Distribusi beban</li>
                                        <li><strong>Scalability:</strong> Mudah ditambah node</li>
                                    </ul>
                                </div>
                                <div class="disadvantages">
                                    <h4>❌ Kekurangan</h4>
                                    <ul>
                                        <li><strong>High Cost:</strong> Banyak kabel/port</li>
                                        <li><strong>Complex:</strong> Konfigurasi rumit</li>
                                        <li><strong>Management:</strong> Sulit dikelola</li>
                                        <li><strong>Power Consumption:</strong> Konsumsi daya tinggi</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="comparison-section">
                                <h4>📊 Perbandingan Topologi</h4>
                                <table class="comparison-table">
                                    <thead>
                                        <tr>
                                            <th>Kriteria</th>
                                            <th>Mesh</th>
                                            <th>Star</th>
                                            <th>Ring</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Reliability</td>
                                            <td class="excellent">🟢 Sangat Tinggi</td>
                                            <td class="good">🟢 Tinggi</td>
                                            <td class="poor">🔴 Rendah</td>
                                        </tr>
                                        <tr>
                                            <td>Redundancy</td>
                                            <td class="excellent">🟢 Penuh</td>
                                            <td class="medium">🟡 Terbatas</td>
                                            <td class="poor">🔴 Minimal</td>
                                        </tr>
                                        <tr>
                                            <td>Cost</td>
                                            <td class="poor">🔴 Sangat Tinggi</td>
                                            <td class="good">🟢 Rendah</td>
                                            <td class="medium">🟡 Sedang</td>
                                        </tr>
                                        <tr>
                                            <td>Management</td>
                                            <td class="poor">🔴 Kompleks</td>
                                            <td class="good">🟢 Mudah</td>
                                            <td class="medium">🟡 Sedang</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="use-cases">
                                <h4>🎯 Kasus Penggunaan</h4>
                                <div class="use-case-grid">
                                    <div class="use-case-item">
                                        <h5>🌐 Internet Backbone</h5>
                                        <p>Router utama ISP dengan BGP mesh</p>
                                    </div>
                                    <div class="use-case-item">
                                        <h5>📶 Wireless Mesh</h5>
                                        <p>WiFi mesh untuk coverage luas</p>
                                    </div>
                                    <div class="use-case-item">
                                        <h5>🏭 Industrial IoT</h5>
                                        <p>Sensor network dengan redundancy</p>
                                    </div>
                                    <div class="use-case-item">
                                        <h5>🚗 Vehicle Networks</h5>
                                        <p>V2V communication systems</p>
                                    </div>
                                </div>
                            </div>

                            <div class="interactive-quiz">
                                <h4>🎯 Quiz</h4>
                                <div class="quiz-question">
                                    <p><strong>Soal:</strong> Kapan sebaiknya menggunakan full mesh?</p>
                                    <div class="quiz-options">
                                        <label class="quiz-option">
                                            <input type="radio" name="q1" value="a">
                                            <span>a. Jaringan rumahan</span>
                                        </label>
                                        <label class="quiz-option">
                                            <input type="radio" name="q1" value="b">
                                            <span>b. Sistem kritis high availability</span>
                                        </label>
                                        <label class="quiz-option">
                                            <input type="radio" name="q1" value="c">
                                            <span>c. Jaringan biaya terbatas</span>
                                        </label>
                                    </div>
                                    <button class="quiz-check" onclick="window.mpiApp.checkQuizAnswer(this, 'b')">Check</button>
                                </div>
                            </div>

                            <div class="lesson-summary">
                                <h4>📝 Ringkasan</h4>
                                <p>Topologi mesh menawarkan reliability dan redundancy tertinggi dengan multiple paths. Ideal untuk critical systems yang butuh high availability, meskipun biaya tinggi dan kompleks.</p>
                            </div>
                        </div>
                    </div>
                `
            }
        };

        return lessons[lessonId] || {
            title: 'Pelajaran',
            body: '<p>Konten pelajaran sedang dalam pengembangan...</p>'
        };
    }

    /**
     * Get lesson preview
     */
    getLessonPreview(lessonId) {
        return {
            title: 'Preview Pelajaran',
            body: `
                <div class="preview-container">
                    <h3>Preview: ${lessonId}</h3>
                    <p>Dalam pelajaran ini, Anda akan mempelajari:</p>
                    <ul>
                        <li>Konsep dasar teori</li>
                        <li>Contoh praktik</li>
                        <li>Evaluasi pemahaman</li>
                    </ul>
                </div>
            `
        };
    }

    /**
     * Get module introduction
     */
    getModuleIntro(moduleId) {
        return {
            title: 'Module Introduction',
            body: `
                <div class="module-intro">
                    <h3>Selamat datang di modul ${moduleId}</h3>
                    <p>Modul ini akan membahas konsep-konsep penting dalam jaringan komputer.</p>
                </div>
            `
        };
    }

    /**
     * Check quiz answer
     */
    checkAnswer(element, isCorrect) {
        const options = element.parentElement.querySelectorAll('.quiz-option');
        options.forEach(opt => opt.classList.remove('selected'));

        element.classList.add('selected');

        if (isCorrect) {
            element.classList.add('correct');
            this.showNotification('Benar! Jawaban Anda tepat.', 'success');
        } else {
            element.classList.add('incorrect');
            this.showNotification('Coba lagi, jawaban belum tepat.', 'error');
        }
    }

    /**
     * Explore OSI layer
     */
    exploreLayer(layerNumber) {
        const layers = {
            7: {
                title: 'Application Layer',
                protocols: 'HTTP, FTP, SMTP, DNS, Telnet',
                description: 'Layer ini menyediakan layanan aplikasi untuk pengguna akhir.'
            },
            6: {
                title: 'Presentation Layer',
                protocols: 'SSL/TLS, JPEG, MPEG',
                description: 'Layer ini mengubah data menjadi format yang dapat ditampilkan oleh aplikasi.'
            },
            5: {
                title: 'Session Layer',
                protocols: 'NetBIOS, RPC',
                description: 'Layer ini mengelola sesi komunikasi antara aplikasi.'
            },
            4: {
                title: 'Transport Layer',
                protocols: 'TCP, UDP',
                description: 'Layer ini memastikan data sampai ke tujuan dengan reliable.'
            },
            3: {
                title: 'Network Layer',
                protocols: 'IP, ICMP',
                description: 'Layer ini melakukan routing untuk menentukan jalur terbaik.'
            },
            2: {
                title: 'Data Link Layer',
                protocols: 'Ethernet, PPP',
                description: 'Layer ini memastikan transmisi data bebas error.'
            },
            1: {
                title: 'Physical Layer',
                protocols: 'USB, Bluetooth',
                description: 'Layer ini mengirimkan bit-bit data melalui media fisik.'
            }
        };

        const layer = layers[layerNumber];
        if (!layer) return;

        const modal = document.createElement('div');
        modal.className = 'lesson-modal';
        modal.innerHTML = `
            <div class="lesson-content">
                <div class="lesson-header">
                    <h2>Layer ${layerNumber}: ${layer.title}</h2>
                    <button class="lesson-close" onclick="window.mpiApp.closeLessonModal()">×</button>
                </div>
                <div class="lesson-body">
                    <div class="osi-layer-detail">
                        <h3>Protokol Utama</h3>
                        <p>${layer.protocols}</p>

                        <h3>Deskripsi</h3>
                        <p>${layer.description}</p>

                        <div class="layer-visualization">
                            <div class="layer-box active-layer">Layer ${layerNumber}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }

    /**
     * Calculate subnet
     */
    calculateSubnet() {
        const modal = document.createElement('div');
        modal.className = 'lesson-modal';
        modal.innerHTML = `
            <div class="lesson-content">
                <div class="lesson-header">
                    <h2>IP Subnet Calculator</h2>
                    <button class="lesson-close" onclick="window.mpiApp.closeLessonModal()">×</button>
                </div>
                <div class="lesson-body">
                    <div class="calculator-container">
                        <div class="calculator-form">
                            <div class="form-group">
                                <label class="form-label">IP Address:</label>
                                <input type="text" class="form-input" id="ipInput" placeholder="192.168.1.1">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Subnet Mask (CIDR):</label>
                                <select class="form-select" id="cidrSelect">
                                    <option value="/24">/24 (255.255.255.0)</option>
                                    <option value="/25">/25 (255.255.255.128)</option>
                                    <option value="/26">/26 (255.255.255.192)</option>
                                    <option value="/27">/27 (255.255.255.224)</option>
                                    <option value="/28">/28 (255.255.255.240)</option>
                                </select>
                            </div>
                            <button class="btn btn-primary" onclick="window.mpiApp.performSubnetCalculation()">Hitung Subnet</button>
                        </div>
                        <div id="subnetResults" class="calculation-result"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }

    /**
     * Perform subnet calculation
     */
    performSubnetCalculation() {
        const ipInput = document.getElementById('ipInput');
        const cidrSelect = document.getElementById('cidrSelect');
        const resultsDiv = document.getElementById('subnetResults');

        if (!ipInput.value) {
            this.showNotification('Masukkan IP Address terlebih dahulu', 'error');
            return;
        }

        const cidr = parseInt(cidrSelect.value.replace('/', ''));
        const result = this.calculateSubnetDetails(ipInput.value, cidr);

        resultsDiv.innerHTML = `
            <h4>Hasil Perhitungan:</h4>
            <p><strong>Network Address:</strong> ${result.network}</p>
            <p><strong>Broadcast Address:</strong> ${result.broadcast}</p>
            <p><strong>Available Hosts:</strong> ${result.hostRange}</p>
            <p><strong>Total Hosts:</strong> ${result.totalHosts}</p>
            <p><strong>Subnet Mask:</strong> ${result.subnetMask}</p>
        `;
    }

    /**
     * Calculate subnet details
     */
    calculateSubnetDetails(ip, cidr) {
        // Simplified subnet calculation (in real implementation, would need proper IP parsing)
        const octets = ip.split('.').map(Number);
        const maskOctets = [255, 255, 255, 255];

        for (let i = cidr; i < 32; i++) {
            const octetIndex = Math.floor(i / 8);
            maskOctets[octetIndex] &= ~(1 << (7 - (i % 8)));
        }

        const networkOctets = octets.map((octet, index) => octet & maskOctets[index]);
        const broadcastOctets = networkOctets.map((octet, index) =>
            octet | (~maskOctets[index] & 255)
        );

        return {
            network: networkOctets.join('.'),
            broadcast: broadcastOctets.join('.'),
            hostRange: `${networkOctets.slice(0, 3).join('.')}.${networkOctets[3] + 1} - ${broadcastOctets.slice(0, 3).join('.')}.${broadcastOctets[3] - 1}`,
            totalHosts: Math.pow(2, 32 - cidr) - 2,
            subnetMask: maskOctets.join('.')
        };
    }

    /**
     * Initialize test page
     */
    initializeTest() {
        console.log('Test page initialized');

        // Check if Enhanced Test System is available
        if (this.enhancedTestSystem) {
            this.initializeEnhancedTest();
        } else {
            // Fallback to original test system
            this.initializeOriginalTest();
        }
    }

    /**
     * Load test data from JSON
     */
    async loadTestData() {
        try {
            const response = await fetch('data/soal.json');
            const data = await response.json();
            this.testState.questions = data.test_pengetahuan || [];
            console.log('Test data loaded:', this.testState.questions.length, 'questions');
        } catch (error) {
            console.error('Error loading test data:', error);
            this.showTestError('Gagal memuat data soal. Silakan coba lagi.');
        }
    }

    /**
     * Render test selection interface
     */
    renderTestSelection() {
        const testContent = document.querySelector('.test-content');
        if (!testContent) return;

        // Group questions by category
        const categories = this.groupQuestionsByCategory();

        testContent.innerHTML = `
            <div class="test-selection">
                <div class="selection-header">
                    <h2>Pilih Topik Test</h2>
                    <p>Pilih topik yang ingin Anda pelajari dan uji pemahaman Anda</p>
                </div>

                <div class="categories-grid">
                    ${Object.entries(categories).map(([category, questions]) => `
                        <div class="category-card" data-category="${category}">
                            <div class="category-icon">
                                ${this.getCategoryIcon(category)}
                            </div>
                            <div class="category-info">
                                <h3>${category}</h3>
                                <p>${questions.length} soal tersedia</p>
                                <div class="difficulty-info">
                                    ${this.getDifficultyInfo(questions)}
                                </div>
                            </div>
                            <div class="category-action">
                                <button class="btn-start-category" data-category="${category}">
                                    Mulai Test
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="quick-actions">
                    <button class="btn-random-test" id="btnRandomTest">
                        <svg viewBox="0 0 24 24">
                            <path d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z"/>
                        </svg>
                        Test Acak (Semua Topik)
                    </button>
                    <button class="btn-review-mistakes" id="btnReviewMistakes">
                        <svg viewBox="0 0 24 24">
                            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                        </svg>
                        Review Kesalahan
                    </button>
                </div>
            </div>
        `;

        this.bindTestSelectionEvents();
    }

    /**
     * Group questions by category
     */
    groupQuestionsByCategory() {
        const categories = {};

        this.testState.questions.forEach(question => {
            const category = this.extractCategory(question.bab);
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(question);
        });

        return categories;
    }

    /**
     * Extract category from question bab
     */
    extractCategory(bab) {
        if (bab.includes('OSI')) return 'Model OSI Layer';
        if (bab.includes('IP Addressing')) return 'Alamat IP';
        if (bab.includes('Subnetting')) return 'IP Subnetting';
        return bab.split(' - ')[0] || 'General';
    }

    /**
     * Get category icon
     */
    getCategoryIcon(category) {
        const icons = {
            'Model OSI Layer': '<svg viewBox="0 0 24 24"><path d="M12,2L13.09,8.26L22,9L16,14.14L18.18,21.02L12,17.77L5.82,21.02L8,14.14L2,9L10.91,8.26L12,2M12,6.39L11.5,8.81L8.75,9.15L10.5,10.89L10.06,13.64L12,12.32L13.94,13.64L13.5,10.89L15.25,9.15L12.5,8.81L12,6.39Z"/></svg>',
            'Alamat IP': '<svg viewBox="0 0 24 24"><path d="M17,9H7V7H17M17,13H7V11H17M17,17H7V15H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"/></svg>',
            'IP Subnetting': '<svg viewBox="0 0 24 24"><path d="M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6M17,13H7V11H17V13M17,17H7V15H17V17Z"/></svg>'
        };

        return icons[category] || '<svg viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>';
    }

    /**
     * Get difficulty info for category
     */
    getDifficultyInfo(questions) {
        const easy = questions.filter(q => !q.difficulty || q.difficulty === 'Easy').length;
        const medium = questions.filter(q => q.difficulty === 'Medium').length;
        const hard = questions.filter(q => q.difficulty === 'Hard').length;

        let difficultyHtml = '';
        if (easy > 0) difficultyHtml += `<span class="difficulty easy">Mudah: ${easy}</span>`;
        if (medium > 0) difficultyHtml += `<span class="difficulty medium">Sedang: ${medium}</span>`;
        if (hard > 0) difficultyHtml += `<span class="difficulty hard">Sulit: ${hard}</span>`;

        return difficultyHtml || '<span class="difficulty easy">Campuran</span>';
    }

    /**
     * Bind test selection events
     */
    bindTestSelectionEvents() {
        // Category card clicks
        document.querySelectorAll('.btn-start-category').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.startCategoryTest(category);
            });
        });

        // Random test button
        const randomBtn = document.getElementById('btnRandomTest');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                this.startRandomTest();
            });
        }

        // Review mistakes button
        const reviewBtn = document.getElementById('btnReviewMistakes');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                this.reviewMistakes();
            });
        }
    }

    /**
     * Start test for specific category
     */
    startCategoryTest(category) {
        const categoryQuestions = this.testState.questions.filter(q =>
            this.extractCategory(q.bab) === category
        );

        this.testState.currentCategory = category;
        this.testState.questions = this.shuffleArray(categoryQuestions);
        this.testState.currentQuestionIndex = 0;
        this.testState.answers = [];
        this.testState.score = 0;
        this.testState.isTestCompleted = false;

        this.renderTestInterface();
    }

    /**
     * Start random test
     */
    startRandomTest() {
        // Select 10 random questions from all available questions
        const allQuestions = [...this.testState.questions];
        const randomQuestions = this.shuffleArray(allQuestions).slice(0, 10);

        this.testState.currentCategory = 'Campuran';
        this.testState.questions = randomQuestions;
        this.testState.currentQuestionIndex = 0;
        this.testState.answers = [];
        this.testState.score = 0;
        this.testState.isTestCompleted = false;

        this.renderTestInterface();
    }

    /**
     * Render test interface
     */
    renderTestInterface() {
        const testContent = document.querySelector('.test-content');
        if (!testContent) return;

        testContent.innerHTML = `
            <div class="test-interface">
                <div class="test-header">
                    <div class="test-progress">
                        <div class="progress-info">
                            <span class="question-number">Soal ${this.testState.currentQuestionIndex + 1} dari ${this.testState.questions.length}</span>
                            <span class="category-tag">${this.testState.currentCategory}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.getProgressPercentage()}%"></div>
                        </div>
                    </div>
                    <button class="btn-exit-test" id="btnExitTest">
                        <svg viewBox="0 0 24 24">
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                    </button>
                </div>

                <div class="question-container" id="questionContainer">
                    <!-- Question will be rendered here -->
                </div>

                <div class="test-navigation">
                    <button class="btn-nav btn-prev" id="btnPrevQuestion" disabled>
                        <svg viewBox="0 0 24 24">
                            <path d="M20,11V13H8L13.5,18.5L12.08,17.08L7.5,12.5L12.08,7.92L13.5,9.34L8,13H20Z"/>
                        </svg>
                        Sebelumnya
                    </button>

                    <div class="question-indicators">
                        ${this.renderQuestionIndicators()}
                    </div>

                    <button class="btn-nav btn-next" id="btnNextQuestion">
                        Selanjutnya
                        <svg viewBox="0 0 24 24">
                            <path d="M4,11V13H16L10.5,18.5L11.92,17.08L16.5,12.5L11.92,7.92L10.5,9.34L16,13H4Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        this.renderCurrentQuestion();
        this.bindTestInterfaceEvents();
    }

    /**
     * Get progress percentage
     */
    getProgressPercentage() {
        return ((this.testState.currentQuestionIndex + 1) / this.testState.questions.length) * 100;
    }

    /**
     * Render question indicators
     */
    renderQuestionIndicators() {
        return this.testState.questions.map((_, index) => {
            const isAnswered = this.testState.answers[index] !== undefined;
            const isCurrent = index === this.testState.currentQuestionIndex;
            const isCorrect = isAnswered ? this.testState.answers[index].isCorrect : null;

            let className = 'indicator';
            if (isCurrent) className += ' current';
            else if (isAnswered) {
                className += isCorrect ? ' correct' : ' incorrect';
            }

            return `<div class="${className}" data-index="${index}"></div>`;
        }).join('');
    }

    /**
     * Render current question
     */
    renderCurrentQuestion() {
        const question = this.testState.questions[this.testState.currentQuestionIndex];
        const container = document.getElementById('questionContainer');

        if (!container || !question) return;

        const userAnswer = this.testState.answers[this.testState.currentQuestionIndex];
        const hasFeedback = userAnswer && userAnswer.showFeedback;

        container.innerHTML = `
            <div class="question-card ${hasFeedback ? 'show-feedback' : ''}">
                <div class="question-header">
                    <span class="question-category">${question.bab}</span>
                    <span class="question-id">#${question.id}</span>
                </div>

                <div class="question-text">
                    <h3>${question.pertanyaan}</h3>
                </div>

                <div class="options-container">
                    ${question.options.map((option, index) => {
                        const isSelected = userAnswer && userAnswer.selectedAnswer === index;
                        const isCorrect = index === question.jawaban_benar;
                        const showCorrect = hasFeedback && isCorrect;
                        const showWrong = hasFeedback && isSelected && !isCorrect;

                        let optionClass = 'option';
                        if (isSelected) optionClass += ' selected';
                        if (showCorrect) optionClass += ' correct';
                        if (showWrong) optionClass += ' wrong';

                        return `
                            <div class="${optionClass}" data-index="${index}">
                                <label class="option-label">
                                    <input type="radio"
                                           name="answer"
                                           value="${index}"
                                           ${isSelected ? 'checked' : ''}
                                           ${hasFeedback ? 'disabled' : ''}>
                                    <span class="option-indicator">${String.fromCharCode(65 + index)}</span>
                                    <span class="option-text">${option}</span>
                                    ${showCorrect ? '<span class="correct-indicator">✓ Benar</span>' : ''}
                                    ${showWrong ? '<span class="wrong-indicator">✗ Salah</span>' : ''}
                                </label>
                            </div>
                        `;
                    }).join('')}
                </div>

                ${hasFeedback ? `
                    <div class="feedback-container">
                        <div class="feedback-header ${userAnswer.isCorrect ? 'correct' : 'incorrect'}">
                            <div class="feedback-icon">
                                ${userAnswer.isCorrect ?
                                    '<svg viewBox="0 0 24 24"><path fill="#10b981" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/></svg>' :
                                    '<svg viewBox="0 0 24 24"><path fill="#ef4444" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/></svg>'
                                }
                            </div>
                            <h4>${userAnswer.isCorrect ? 'Benar!' : 'Salah!'}</h4>
                        </div>
                        <div class="feedback-content">
                            <p><strong>Penjelasan:</strong></p>
                            <p>${question.penjelasan}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        // Update navigation and re-bind events
        this.updateNavigationButtons();
        this.bindTestInterfaceEvents();
    }

    /**
     * Bind test interface events
     */
    bindTestInterfaceEvents() {
        // Remove existing event listeners to prevent duplicates
        const optionInputs = document.querySelectorAll('.option input');
        optionInputs.forEach(input => {
            input.replaceWith(input.cloneNode(true));
        });

        // Option selection - re-bind to new elements
        document.querySelectorAll('.option input').forEach(input => {
            input.addEventListener('change', (e) => {
                // Prevent multiple selections if already answered
                const currentAnswer = this.testState.answers[this.testState.currentQuestionIndex];
                if (!currentAnswer) {
                    this.selectAnswer(parseInt(e.target.value));
                }
            });
        });

        // Navigation buttons - remove and re-bind
        const prevBtn = document.getElementById('btnPrevQuestion');
        const nextBtn = document.getElementById('btnNextQuestion');
        const exitBtn = document.getElementById('btnExitTest');

        if (prevBtn) {
            prevBtn.replaceWith(prevBtn.cloneNode(true));
            document.getElementById('btnPrevQuestion').addEventListener('click', () => this.previousQuestion());
        }

        if (nextBtn) {
            nextBtn.replaceWith(nextBtn.cloneNode(true));
            document.getElementById('btnNextQuestion').addEventListener('click', () => this.nextQuestion());
        }

        if (exitBtn) {
            exitBtn.replaceWith(exitBtn.cloneNode(true));
            document.getElementById('btnExitTest').addEventListener('click', () => this.exitTest());
        }

        // Question indicators - remove and re-bind
        document.querySelectorAll('.indicator').forEach(indicator => {
            indicator.replaceWith(indicator.cloneNode(true));
        });

        document.querySelectorAll('.indicator').forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                if (index < this.testState.currentQuestionIndex ||
                    this.testState.answers[index] !== undefined) {
                    this.goToQuestion(index);
                }
            });
        });
    }

    /**
     * Select answer for current question
     */
    selectAnswer(answerIndex) {
        const question = this.testState.questions[this.testState.currentQuestionIndex];
        const isCorrect = answerIndex === question.jawaban_benar;

        // Store answer
        this.testState.answers[this.testState.currentQuestionIndex] = {
            selectedAnswer: answerIndex,
            isCorrect: isCorrect,
            showFeedback: true
        };

        // Update score
        if (isCorrect) {
            this.testState.score++;
        }

        // Show feedback immediately
        this.renderCurrentQuestion();
        this.updateQuestionIndicators();
        this.updateProgressBar();

        // Auto advance after delay (only if not last question)
        setTimeout(() => {
            // Check if test is still active and not completed
            if (!this.testState.isTestCompleted &&
                this.testState.currentQuestionIndex < this.testState.questions.length - 1) {
                this.nextQuestion();
            } else if (!this.testState.isTestCompleted) {
                this.completeTest();
            }
        }, 3000);
    }

    /**
     * Update question indicators
     */
    updateQuestionIndicators() {
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            const answer = this.testState.answers[index];

            // Reset all classes
            indicator.className = 'indicator';

            // Add appropriate classes based on state
            if (index === this.testState.currentQuestionIndex) {
                indicator.className += ' current';
            } else if (answer && answer.showFeedback) {
                indicator.className += answer.isCorrect ? ' correct' : ' incorrect';
            }
        });
    }

    /**
     * Navigate to previous question
     */
    previousQuestion() {
        if (this.testState.currentQuestionIndex > 0) {
            this.testState.currentQuestionIndex--;
            this.renderCurrentQuestion();
            // Update indicators and progress after render
            setTimeout(() => {
                this.updateQuestionIndicators();
                this.updateProgressBar();
            }, 50);
        }
    }

    /**
     * Navigate to next question
     */
    nextQuestion() {
        if (this.testState.currentQuestionIndex < this.testState.questions.length - 1) {
            this.testState.currentQuestionIndex++;
            this.renderCurrentQuestion();
            // Update indicators and progress after render
            setTimeout(() => {
                this.updateQuestionIndicators();
                this.updateProgressBar();
            }, 50);
        } else {
            this.completeTest();
        }
    }

    /**
     * Go to specific question
     */
    goToQuestion(index) {
        this.testState.currentQuestionIndex = index;
        this.renderCurrentQuestion();
        // Update indicators and progress after render
        setTimeout(() => {
            this.updateQuestionIndicators();
            this.updateProgressBar();
        }, 50);
    }

    /**
     * Update progress bar
     */
    updateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${this.getProgressPercentage()}%`;
        }

        const questionNumber = document.querySelector('.question-number');
        if (questionNumber) {
            questionNumber.textContent = `Soal ${this.testState.currentQuestionIndex + 1} dari ${this.testState.questions.length}`;
        }
    }

    /**
     * Update navigation buttons
     */
    updateNavigationButtons() {
        const prevBtn = document.getElementById('btnPrevQuestion');
        const nextBtn = document.getElementById('btnNextQuestion');
        const currentAnswer = this.testState.answers[this.testState.currentQuestionIndex];

        // Previous button - enable if not first question
        if (prevBtn) {
            prevBtn.disabled = this.testState.currentQuestionIndex === 0;
        }

        // Next button - enable if current question has been answered
        if (nextBtn) {
            const isLastQuestion = this.testState.currentQuestionIndex === this.testState.questions.length - 1;
            nextBtn.innerHTML = isLastQuestion ?
                'Selesai<svg viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17V19H11V16.17L15.09,12.09L16.5,13.5L11,19V7H21Z"/></svg>' :
                'Selanjutnya<svg viewBox="0 0 24 24"><path d="M4,11V13H16L10.5,18.5L11.92,17.08L16.5,12.5L11.92,7.92L10.5,9.34L16,13H4Z"/></svg>';

            // Enable next button only if current question has been answered
            nextBtn.disabled = !currentAnswer;
        }
    }

    /**
     * Complete test
     */
    completeTest() {
        this.testState.isTestCompleted = true;
        this.saveTestProgress();
        this.renderTestResults();
    }

    /**
     * Render test results
     */
    renderTestResults() {
        const testContent = document.querySelector('.test-content');
        if (!testContent) return;

        const percentage = Math.round((this.testState.score / this.testState.questions.length) * 100);
        const grade = this.getGrade(percentage);

        testContent.innerHTML = `
            <div class="test-results">
                <div class="results-header">
                    <div class="score-circle">
                        <div class="score-percentage">${percentage}%</div>
                        <div class="score-label">Skor Akhir</div>
                    </div>
                    <div class="results-info">
                        <h2>Test Selesai!</h2>
                        <p class="grade-message">${grade.message}</p>
                        <div class="score-details">
                            <span class="correct-answers">${this.testState.score} Benar</span>
                            <span class="total-questions">dari ${this.testState.questions.length} Soal</span>
                        </div>
                    </div>
                </div>

                <div class="results-analysis">
                    <h3>Analisis Hasil</h3>
                    <div class="analysis-grid">
                        <div class="analysis-item">
                            <div class="analysis-label">Topik</div>
                            <div class="analysis-value">${this.testState.currentCategory}</div>
                        </div>
                        <div class="analysis-item">
                            <div class="analysis-label">Waktu Pengerjaan</div>
                            <div class="analysis-value">Tidak dibatasi</div>
                        </div>
                        <div class="analysis-item">
                            <div class="analysis-label">Akurasi</div>
                            <div class="analysis-value">${percentage}%</div>
                        </div>
                        <div class="analysis-item">
                            <div class="analysis-label">Nilai Huruf</div>
                            <div class="analysis-value grade-${grade.class}">${grade.letter}</div>
                        </div>
                    </div>
                </div>

                <div class="results-actions">
                    <button class="btn-review" onclick="mpiApp.reviewAnswers()">
                        <svg viewBox="0 0 24 24">
                            <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                        </svg>
                        Review Jawaban
                    </button>
                    <button class="btn-retake" onclick="mpiApp.retaketest()">
                        <svg viewBox="0 0 24 24">
                            <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
                        </svg>
                        Ulangi Test
                    </button>
                    <button class="btn-back-menu" onclick="mpiApp.navigateToMainMenu()">
                        <svg viewBox="0 0 24 24">
                            <path d="M20,11V13H8L13.5,18.5L12.08,17.08L7.5,12.5L12.08,7.92L13.5,9.34L8,13H20Z"/>
                        </svg>
                        Kembali ke Menu
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get grade based on percentage
     */
    getGrade(percentage) {
        if (percentage >= 90) return { letter: 'A+', class: 'excellent', message: 'Luar biasa! Pemahaman Anda sangat baik!' };
        if (percentage >= 80) return { letter: 'A', class: 'great', message: 'Hebat! Pemahaman Anda sangat baik!' };
        if (percentage >= 70) return { letter: 'B', class: 'good', message: 'Bagus! Pemahaman Anda cukup baik!' };
        if (percentage >= 60) return { letter: 'C', class: 'average', message: 'Cukup. Perlu lebih banyak belajar!' };
        if (percentage >= 50) return { letter: 'D', class: 'below-average', message: 'Kurang. Perlu belajar lebih giat!' };
        return { letter: 'E', class: 'poor', message: 'Sangat kurang. Perlu belajar lebih serius!' };
    }

    /**
     * Review answers
     */
    reviewAnswers() {
        this.testState.currentQuestionIndex = 0;
        this.testState.isReviewMode = true;
        this.renderReviewInterface();
    }

    /**
     * Render review interface
     */
    renderReviewInterface() {
        const testContent = document.querySelector('.test-content');
        if (!testContent) return;

        testContent.innerHTML = `
            <div class="review-interface">
                <div class="review-header">
                    <h2>Review Jawaban</h2>
                    <p>Lihat kembali jawaban Anda dan pembahasannya</p>
                </div>

                <div class="review-questions">
                    ${this.testState.questions.map((question, index) => {
                        const answer = this.testState.answers[index];
                        return `
                            <div class="review-question ${answer.isCorrect ? 'correct' : 'incorrect'}">
                                <div class="review-question-header">
                                    <span class="question-number">Soal ${index + 1}</span>
                                    <span class="result-badge ${answer.isCorrect ? 'correct' : 'incorrect'}">
                                        ${answer.isCorrect ? 'Benar' : 'Salah'}
                                    </span>
                                </div>
                                <div class="review-question-text">
                                    <p>${question.pertanyaan}</p>
                                </div>
                                <div class="review-answer">
                                    <p><strong>Jawaban Anda:</strong> ${question.options[answer.selectedAnswer]}</p>
                                    <p><strong>Jawaban Benar:</strong> ${question.options[question.jawaban_benar]}</p>
                                </div>
                                <div class="review-explanation">
                                    <p><strong>Pembahasan:</strong> ${question.penjelasan}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="review-actions">
                    <button class="btn-back-menu" onclick="mpiApp.navigateToMainMenu()">
                        <svg viewBox="0 0 24 24">
                            <path d="M20,11V13H8L13.5,18.5L12.08,17.08L7.5,12.5L12.08,7.92L13.5,9.34L8,13H20Z"/>
                        </svg>
                        Kembali ke Menu
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Retake test
     */
    retaketest() {
        if (confirm('Apakah Anda ingin mengulang test ini? Progress saat ini akan hilang.')) {
            this.renderTestSelection();
        }
    }

    /**
     * Exit test
     */
    exitTest() {
        if (confirm('Apakah Anda yakin ingin keluar dari test? Progress yang telah dicapai akan hilang.')) {
            this.renderTestSelection();
        }
    }

    /**
     * Review mistakes (placeholder)
     */
    reviewMistakes() {
        alert('Fitur Review Kesalahan akan segera tersedia!');
    }

    /**
     * Save test progress to localStorage
     */
    saveTestProgress() {
        try {
            const progress = {
                category: this.testState.currentCategory,
                score: this.testState.score,
                totalQuestions: this.testState.questions.length,
                percentage: Math.round((this.testState.score / this.testState.questions.length) * 100),
                timestamp: new Date().toISOString(),
                answers: this.testState.answers
            };

            let testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
            testHistory.push(progress);

            // Keep only last 10 test records
            if (testHistory.length > 10) {
                testHistory = testHistory.slice(-10);
            }

            localStorage.setItem('testHistory', JSON.stringify(testHistory));
            console.log('Test progress saved:', progress);
        } catch (error) {
            console.error('Error saving test progress:', error);
        }
    }

    /**
     * Show test error
     */
    showTestError(message) {
        const testContent = document.querySelector('.test-content');
        if (testContent) {
            testContent.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">
                        <svg viewBox="0 0 24 24">
                            <path fill="#ef4444" d="M12,2L13.09,8.26L22,9L16,14.14L18.18,21.02L12,17.77L5.82,21.02L8,14.14L2,9L10.91,8.26L12,2M12,6.39L11.5,8.81L8.75,9.15L10.5,10.89L10.06,13.64L12,12.32L13.94,13.64L13.5,10.89L15.25,9.15L12.5,8.81L12,6.39Z"/>
                        </svg>
                    </div>
                    <h3>Kesalahan Memuat Test</h3>
                    <p>${message}</p>
                    <button class="btn-retry" onclick="mpiApp.initializeTest()">
                        Coba Lagi
                    </button>
                </div>
            `;
        }
    }

    /**
     * Shuffle array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Initialize quiz page
     */
    initializeQuiz() {
        console.log('Quiz page initialized');

        // Initialize quiz state
        this.quizState = {
            questions: [],
            currentQuestionIndex: 0,
            answers: [],
            score: 0,
            isQuizStarted: false,
            isQuizCompleted: false,
            timeRemaining: 600, // 10 minutes in seconds
            timerInterval: null,
            startTime: null,
            endTime: null
        };

        // Load quiz data and initialize interface
        this.loadQuizData();
        this.renderQuizStart();
    }

    /**
     * Load quiz data from JSON
     */
    async loadQuizData() {
        try {
            const response = await fetch('data/soal.json');
            const data = await response.json();
            this.quizState.questions = data.quiz_akhir || [];
            console.log('Quiz data loaded:', this.quizState.questions.length, 'questions');
        } catch (error) {
            console.error('Error loading quiz data:', error);
            this.showQuizError('Gagal memuat data soal. Silakan coba lagi.');
        }
    }

    /**
     * Render quiz start screen
     */
    renderQuizStart() {
        const quizContent = document.querySelector('.quiz-content');
        if (!quizContent) return;

        quizContent.innerHTML = `
            <div class="quiz-start">
                <div class="quiz-instructions">
                    <h2>Petunjuk Kuis Akhir</h2>
                    <div class="instructions-list">
                        <div class="instruction-item">
                            <div class="instruction-icon">⏱️</div>
                            <div class="instruction-text">
                                <strong>Waktu:</strong> 10 menit untuk ${this.quizState.questions.length} soal
                            </div>
                        </div>
                        <div class="instruction-item">
                            <div class="instruction-icon">📝</div>
                            <div class="instruction-text">
                                <strong>Soal:</strong> Satu soal per halaman dengan progress bar
                            </div>
                        </div>
                        <div class="instruction-item">
                            <div class="instruction-icon">🎯</div>
                            <div class="instruction-text">
                                <strong>Skor:</strong> Akan disimpan untuk sertifikat
                            </div>
                        </div>
                        <div class="instruction-item">
                            <div class="instruction-icon">⚠️</div>
                            <div class="instruction-text">
                                <strong>Penting:</strong> Tidak ada kesempatan mengulang jawaban
                            </div>
                        </div>
                    </div>
                </div>

                <div class="quiz-info-summary">
                    <h3>Ringkasan Kuis</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Jumlah Soal:</span>
                            <span class="info-value">${this.quizState.questions.length} soal</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Durasi:</span>
                            <span class="info-value">10 menit</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Materi:</span>
                            <span class="info-value">Semua topik</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Kelulusan:</span>
                            <span class="info-value">Minimal 70%</span>
                        </div>
                    </div>
                </div>

                <div class="quiz-start-actions">
                    <button class="btn btn-primary btn-large" id="btnStartQuiz">
                        <svg viewBox="0 0 24 24" class="icon">
                            <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                        </svg>
                        Mulai Kuis
                    </button>
                    <button class="btn btn-secondary" onclick="window.mpiApp.showMainMenu()">
                        Kembali ke Menu
                    </button>
                </div>
            </div>
        `;

        this.bindQuizStartEvents();
    }

    /**
     * Bind quiz start events
     */
    bindQuizStartEvents() {
        const startBtn = document.getElementById('btnStartQuiz');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startQuiz();
            });
        }
    }

    /**
     * Start the quiz
     */
    startQuiz() {
        if (this.quizState.questions.length === 0) {
            this.showQuizError('Tidak ada soal yang tersedia.');
            return;
        }

        this.quizState.isQuizStarted = true;
        this.quizState.startTime = new Date();
        this.quizState.currentQuestionIndex = 0;
        this.quizState.answers = [];
        this.quizState.score = 0;
        this.quizState.isQuizCompleted = false;

        // Shuffle questions
        this.quizState.questions = this.shuffleArray([...this.quizState.questions]);

        // Start timer
        this.startQuizTimer();

        // Render first question
        this.renderQuizInterface();
    }

    /**
     * Start quiz timer countdown
     */
    startQuizTimer() {
        this.quizState.timerInterval = setInterval(() => {
            this.quizState.timeRemaining--;
            this.updateTimerDisplay();

            if (this.quizState.timeRemaining <= 0) {
                this.completeQuiz();
            }
        }, 1000);

        this.updateTimerDisplay();
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        const timerElement = document.getElementById('quizTimer');
        if (timerElement) {
            const minutes = Math.floor(this.quizState.timeRemaining / 60);
            const seconds = this.quizState.timeRemaining % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // Add warning class when time is running out
            if (this.quizState.timeRemaining <= 60) {
                timerElement.classList.add('warning');
            }
        }
    }

    /**
     * Render quiz interface
     */
    renderQuizInterface() {
        const quizContent = document.querySelector('.quiz-content');
        if (!quizContent) return;

        const question = this.quizState.questions[this.quizState.currentQuestionIndex];

        quizContent.innerHTML = `
            <div class="quiz-interface">
                <div class="quiz-header">
                    <div class="quiz-progress">
                        <div class="progress-info">
                            <span class="question-number">Soal ${this.quizState.currentQuestionIndex + 1} dari ${this.quizState.questions.length}</span>
                            <span class="timer-display" id="quizTimer">10:00</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.getQuizProgressPercentage()}%"></div>
                        </div>
                    </div>
                    <button class="btn-exit-quiz" id="btnExitQuiz">
                        <svg viewBox="0 0 24 24">
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                    </button>
                </div>

                <div class="question-container" id="quizQuestionContainer">
                    <!-- Question will be rendered here -->
                </div>

                <div class="quiz-navigation">
                    <button class="btn-nav btn-prev" id="btnPrevQuestion" disabled>
                        <svg viewBox="0 0 24 24">
                            <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
                        </svg>
                        Sebelumnya
                    </button>

                    <div class="question-indicators">
                        ${this.renderQuestionIndicators()}
                    </div>

                    <button class="btn-nav btn-next" id="btnNextQuestion" disabled>
                        ${this.quizState.currentQuestionIndex === this.quizState.questions.length - 1 ?
                            'Selesai<svg viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19,6.08L21,7Z"/></svg>' :
                            'Selanjutnya<svg viewBox="0 0 24 24"><path d="M4,11V13H16L10.5,18.5L11.92,17.08L16.5,12.5L11.92,7.92L10.5,9.34L16,13H4Z"/></svg>'}
                    </button>
                </div>
            </div>
        `;

        this.renderCurrentQuizQuestion();
        this.bindQuizInterfaceEvents();
    }

    /**
     * Render current quiz question
     */
    renderCurrentQuizQuestion() {
        const container = document.getElementById('quizQuestionContainer');
        const question = this.quizState.questions[this.quizState.currentQuestionIndex];

        if (!container || !question) return;

        const userAnswer = this.quizState.answers[this.quizState.currentQuestionIndex];

        container.innerHTML = `
            <div class="question-card">
                <div class="question-header">
                    <span class="question-id">#${question.id}</span>
                </div>

                <div class="question-text">
                    <h3>${question.pertanyaan}</h3>
                </div>

                <div class="options-container">
                    ${question.options.map((option, index) => `
                        <div class="option ${userAnswer === index ? 'selected' : ''}" data-index="${index}">
                            <label class="option-label">
                                <input type="radio"
                                       name="quiz-answer"
                                       value="${index}"
                                       ${userAnswer === index ? 'checked' : ''}>
                                <span class="option-indicator">${String.fromCharCode(65 + index)}</span>
                                <span class="option-text">${option}</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.updateQuizNavigationButtons();
    }

    /**
     * Render question indicators
     */
    renderQuestionIndicators() {
        return this.quizState.questions.map((_, index) => {
            const hasAnswer = this.quizState.answers[index] !== undefined;
            const isCurrent = index === this.quizState.currentQuestionIndex;

            let className = 'indicator';
            if (isCurrent) className += ' current';
            if (hasAnswer) className += ' answered';

            return `
                <div class="${className}" data-index="${index}" title="Soal ${index + 1}"></div>
            `;
        }).join('');
    }

    /**
     * Get quiz progress percentage
     */
    getQuizProgressPercentage() {
        return ((this.quizState.currentQuestionIndex + 1) / this.quizState.questions.length) * 100;
    }

    /**
     * Bind quiz interface events
     */
    bindQuizInterfaceEvents() {
        // Remove existing event listeners to prevent duplicates
        const optionInputs = document.querySelectorAll('.option input');
        optionInputs.forEach(input => {
            input.replaceWith(input.cloneNode(true));
        });

        // Option selection - re-bind to new elements
        document.querySelectorAll('.option input').forEach(input => {
            input.addEventListener('change', (e) => {
                // Prevent multiple selections if already answered
                const currentAnswer = this.quizState.answers[this.quizState.currentQuestionIndex];
                if (currentAnswer === undefined) {
                    this.selectQuizAnswer(parseInt(e.target.value));
                }
            });
        });

        // Navigation buttons - remove and re-bind
        const prevBtn = document.getElementById('btnPrevQuestion');
        const nextBtn = document.getElementById('btnNextQuestion');
        const exitBtn = document.getElementById('btnExitQuiz');

        if (prevBtn) {
            prevBtn.replaceWith(prevBtn.cloneNode(true));
            document.getElementById('btnPrevQuestion').addEventListener('click', () => this.previousQuizQuestion());
        }

        if (nextBtn) {
            nextBtn.replaceWith(nextBtn.cloneNode(true));
            const newNextBtn = document.getElementById('btnNextQuestion');
            if (newNextBtn) {
                newNextBtn.addEventListener('click', () => this.nextQuizQuestion());
                console.log('Next button event listener attached');
            }
        }

        if (exitBtn) {
            exitBtn.replaceWith(exitBtn.cloneNode(true));
            document.getElementById('btnExitQuiz').addEventListener('click', () => this.exitQuiz());
        }

        // Question indicators - remove and re-bind
        document.querySelectorAll('.indicator').forEach(indicator => {
            indicator.replaceWith(indicator.cloneNode(true));
        });

        document.querySelectorAll('.indicator').forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                if (index <= this.quizState.currentQuestionIndex) {
                    this.goToQuizQuestion(index);
                }
            });
        });
    }

    /**
     * Select answer for current quiz question
     */
    selectQuizAnswer(answerIndex) {
        console.log('Quiz answer selected:', answerIndex, 'for question:', this.quizState.currentQuestionIndex);

        this.quizState.answers[this.quizState.currentQuestionIndex] = answerIndex;

        // Update UI
        document.querySelectorAll('.option').forEach((option, index) => {
            option.classList.toggle('selected', index === answerIndex);
        });

        this.updateQuizNavigationButtons();
        this.updateQuizIndicators();

        console.log('Quiz navigation buttons updated');
    }

    /**
     * Update quiz navigation buttons
     */
    updateQuizNavigationButtons() {
        const prevBtn = document.getElementById('btnPrevQuestion');
        const nextBtn = document.getElementById('btnNextQuestion');
        const currentAnswer = this.quizState.answers[this.quizState.currentQuestionIndex];

        console.log('Updating navigation buttons. Current answer:', currentAnswer, 'Current index:', this.quizState.currentQuestionIndex);

        // Previous button
        if (prevBtn) {
            prevBtn.disabled = this.quizState.currentQuestionIndex === 0;
        }

        // Next button
        if (nextBtn) {
            const isLastQuestion = this.quizState.currentQuestionIndex === this.quizState.questions.length - 1;
            nextBtn.innerHTML = isLastQuestion ?
                'Selesai<svg viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19,6.08L21,7Z"/></svg>' :
                'Selanjutnya<svg viewBox="0 0 24 24"><path d="M4,11V13H16L10.5,18.5L11.92,17.08L16.5,12.5L11.92,7.92L10.5,9.34L16,13H4Z"/></svg>';

            // Enable next button only if current question has been answered
            const shouldDisable = currentAnswer === undefined;
            nextBtn.disabled = shouldDisable;

            console.log('Next button disabled:', shouldDisable, 'Answer exists:', currentAnswer !== undefined);
        }
    }

    /**
     * Update quiz indicators
     */
    updateQuizIndicators() {
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            const hasAnswer = this.quizState.answers[index] !== undefined;
            const isCurrent = index === this.quizState.currentQuestionIndex;

            indicator.className = 'indicator';
            if (isCurrent) indicator.className += ' current';
            if (hasAnswer) indicator.className += ' answered';
        });
    }

    /**
     * Navigate to previous quiz question
     */
    previousQuizQuestion() {
        if (this.quizState.currentQuestionIndex > 0) {
            this.quizState.currentQuestionIndex--;
            this.renderCurrentQuizQuestion();
            // Update indicators and progress after render with small delay
            setTimeout(() => {
                this.updateQuizIndicators();
                this.updateQuizProgressBar();
            }, 50);
        }
    }

    /**
     * Navigate to next quiz question
     */
    nextQuizQuestion() {
        console.log('Next quiz question clicked, current index:', this.quizState.currentQuestionIndex);

        const isLastQuestion = this.quizState.currentQuestionIndex === this.quizState.questions.length - 1;

        if (isLastQuestion) {
            console.log('Last question reached, completing quiz');
            this.completeQuiz();
        } else if (this.quizState.currentQuestionIndex < this.quizState.questions.length - 1) {
            console.log('Moving to next question');
            this.quizState.currentQuestionIndex++;
            this.renderCurrentQuizQuestion();
            // Update indicators and progress after render with small delay
            setTimeout(() => {
                this.updateQuizIndicators();
                this.updateQuizProgressBar();
            }, 50);
        } else {
            console.log('Cannot navigate to next question');
        }
    }

    /**
     * Go to specific quiz question
     */
    goToQuizQuestion(index) {
        if (index <= this.quizState.currentQuestionIndex) {
            this.quizState.currentQuestionIndex = index;
            this.renderCurrentQuizQuestion();
            // Update indicators and progress after render with small delay
            setTimeout(() => {
                this.updateQuizIndicators();
                this.updateQuizProgressBar();
            }, 50);
        }
    }

    /**
     * Update quiz progress bar
     */
    updateQuizProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${this.getQuizProgressPercentage()}%`;
        }

        const questionNumber = document.querySelector('.question-number');
        if (questionNumber) {
            questionNumber.textContent = `Soal ${this.quizState.currentQuestionIndex + 1} dari ${this.quizState.questions.length}`;
        }
    }

    /**
     * Complete quiz
     */
    completeQuiz() {
        this.quizState.isQuizCompleted = true;
        this.quizState.endTime = new Date();

        // Stop timer
        if (this.quizState.timerInterval) {
            clearInterval(this.quizState.timerInterval);
            this.quizState.timerInterval = null;
        }

        // Calculate score
        this.calculateQuizScore();

        // Save quiz results to localStorage for certificate
        this.saveQuizResults();

        // Show results
        this.renderQuizResults();
    }

    /**
     * Calculate quiz score
     */
    calculateQuizScore() {
        this.quizState.score = 0;

        this.quizState.answers.forEach((answerIndex, questionIndex) => {
            if (answerIndex !== undefined && this.quizState.questions[questionIndex]) {
                const question = this.quizState.questions[questionIndex];
                if (answerIndex === question.jawaban_benar) {
                    this.quizState.score++;
                }
            }
        });
    }

    /**
     * Save quiz results to localStorage for certificate
     */
    saveQuizResults() {
        const results = {
            score: this.quizState.score,
            totalQuestions: this.quizState.questions.length,
            percentage: Math.round((this.quizState.score / this.quizState.questions.length) * 100),
            startTime: this.quizState.startTime,
            endTime: this.quizState.endTime,
            timeUsed: 600 - this.quizState.timeRemaining, // time used in seconds
            studentName: localStorage.getItem('studentName') || 'Unknown',
            answers: this.quizState.answers
        };

        // Save final score for certificate
        localStorage.setItem('finalScore', JSON.stringify(results));
        localStorage.setItem('quizCompleted', 'true');

        // Update evaluation progress for certificate
        this.updateEvaluationProgress(results);

        console.log('Quiz results saved:', results);
    }

    /**
     * Update evaluation progress for certificate tracking
     */
    updateEvaluationProgress(quizResults = null) {
        // Get existing progress
        let progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');

        // Update practice completed count
        if (!progress.practiceCompleted) {
            progress.practiceCompleted = 0;
        }

        // Update best score
        if (quizResults && quizResults.percentage > (progress.bestScore || 0)) {
            progress.bestScore = quizResults.percentage;
        }

        // Calculate completion rate (mock calculation - replace with actual logic)
        progress.completionRate = this.calculateCompletionRate();

        // SIMPLIFIED CERTIFICATE SYSTEM - Quiz Only (70% passing score)
        const quizPassed = (progress.bestScore || 0) >= 70;

        // Unlock certificate if quiz requirement is met (QUIZ-ONLY SYSTEM)
        if (quizPassed) {
            if (!progress.certificateUnlocked) {
                progress.certificateUnlocked = true;
                progress.certificateDate = new Date().toISOString();

                // Store certificate data for easy access
                progress.certificateData = {
                    id: this.generateCertificateID(),
                    studentName: this.studentName,
                    score: progress.bestScore,
                    completionDate: progress.certificateDate,
                    verificationCode: this.generateVerificationCode(),
                    quizOnly: true,
                    passingScore: 70
                };

                // Show notification
                this.showNotification('🎉 Selamat! Sertifikat kompetensi Anda telah tersedia!', 'success');
                console.log('🏆 Certificate unlocked with quiz-only system:', progress.certificateData);
            }
        }

        // Save updated progress
        localStorage.setItem('evaluationProgress', JSON.stringify(progress));

        // Update main menu certificate status
        this.updateCertificateStatus();

        console.log('Evaluation progress updated:', progress);
    }

    /**
     * Calculate completion rate for materials
     */
    calculateCompletionRate() {
        // Mock calculation - replace with actual progress tracking
        const materialsProgress = JSON.parse(localStorage.getItem('materialsProgress') || '{}');
        const completedModules = Object.values(materialsProgress).filter(module => module.completed).length;
        const totalModules = 4; // Total number of modules
        return Math.round((completedModules / totalModules) * 100);
    }

    /**
     * Update practice completed count
     */
    updatePracticeProgress() {
        console.log('📈 Updating practice progress...');

        let progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');

        if (!progress.practiceCompleted) {
            progress.practiceCompleted = 0;
        }

        progress.practiceCompleted += 1;
        progress.lastPracticeDate = new Date().toISOString();

        // Save to localStorage
        localStorage.setItem('evaluationProgress', JSON.stringify(progress));

        // Update evaluation progress
        this.updateEvaluationProgress();

        // Show notification
        this.showNotification('Progress latihan tersimpan! ✅', 'success');

        console.log('✅ Practice progress updated:', progress);
    }

    /**
     * Update materials progress
     */
    updateMaterialsProgress(moduleId) {
        let materialsProgress = JSON.parse(localStorage.getItem('materialsProgress') || '{}');

        if (!materialsProgress[moduleId]) {
            materialsProgress[moduleId] = { completed: false, progress: 0 };
        }

        materialsProgress[moduleId].completed = true;
        materialsProgress[moduleId].progress = 100;

        localStorage.setItem('materialsProgress', JSON.stringify(materialsProgress));

        // Update evaluation progress
        this.updateEvaluationProgress();
    }

    /**
     * Render quiz results
     */
    renderQuizResults() {
        const quizContent = document.querySelector('.quiz-content');
        if (!quizContent) return;

        const percentage = Math.round((this.quizState.score / this.quizState.questions.length) * 100);
        const passed = percentage >= 70;
        const timeUsed = 600 - this.quizState.timeRemaining;
        const minutes = Math.floor(timeUsed / 60);
        const seconds = timeUsed % 60;

        quizContent.innerHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <h2>Hasil Kuis Akhir</h2>
                    <div class="status-badge ${passed ? 'passed' : 'failed'}">
                        ${passed ? '✅ LULUS' : '❌ TIDAK LULUS'}
                    </div>
                </div>

                <div class="score-display">
                    <div class="score-circle">
                        <div class="score-percentage">${percentage}%</div>
                        <div class="score-label">Skor Akhir</div>
                    </div>
                    <div class="score-details">
                        <h3>${this.quizState.score} Benar dari ${this.quizState.questions.length} Soal</h3>
                        <p>Waktu Pengerjaan: ${minutes} menit ${seconds} detik</p>
                    </div>
                </div>

                <div class="results-analysis">
                    <h3>Analisis Hasil</h3>
                    <div class="analysis-grid">
                        <div class="analysis-item">
                            <span class="analysis-label">Total Soal:</span>
                            <span class="analysis-value">${this.quizState.questions.length}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">Jawaban Benar:</span>
                            <span class="analysis-value ${passed ? 'grade-excellent' : 'grade-poor'}">${this.quizState.score}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">Jawaban Salah:</span>
                            <span class="analysis-value">${this.quizState.questions.length - this.quizState.score}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">Persentase:</span>
                            <span class="analysis-value ${percentage >= 90 ? 'grade-excellent' : percentage >= 70 ? 'grade-good' : 'grade-poor'}">${percentage}%</span>
                        </div>
                    </div>
                </div>

                ${passed ? `
                    <div class="certificate-eligibility">
                        <h3>🎉 Selamat! Anda Berhak Mendapatkan Sertifikat</h3>
                        <p>Sertifikat Anda sudah tersedia di menu Sertifikat.</p>
                        <button class="btn btn-primary" onclick="window.mpiApp.navigateToPage('certificate')">
                            Lihat Sertifikat
                        </button>
                    </div>
                ` : `
                    <div class="retry-section">
                        <h3>💪 Tetap Semangat!</h3>
                        <p>Anda belum lulus. Coba pelajari materi lagi dan ulangi kuis.</p>
                        <button class="btn btn-primary" onclick="window.mpiApp.retryQuiz()">
                            Ulangi Kuis
                        </button>
                    </div>
                `}

                <div class="results-actions">
                    <button class="btn btn-secondary" onclick="window.mpiApp.showMainMenu()">
                        Kembali ke Menu
                    </button>
                    <button class="btn btn-secondary" onclick="window.mpiApp.reviewQuizAnswers()">
                        Review Jawaban
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Retry quiz
     */
    retryQuiz() {
        if (confirm('Apakah Anda ingin mengulang kuis? Hasil sebelumnya akan diganti.')) {
            this.quizState.timeRemaining = 600;
            this.startQuiz();
        }
    }

    /**
     * Review quiz answers
     */
    reviewQuizAnswers() {
        // This would show detailed review of answers
        alert('Fitur review jawaban akan segera tersedia.');
    }

    /**
     * Exit quiz
     */
    exitQuiz() {
        if (confirm('Apakah Anda yakin ingin keluar dari kuis? Progress yang telah dicapai akan hilang.')) {
            if (this.quizState.timerInterval) {
                clearInterval(this.quizState.timerInterval);
                this.quizState.timerInterval = null;
            }
            this.showMainMenu();
        }
    }

    /**
     * Show quiz error
     */
    showQuizError(message) {
        const quizContent = document.querySelector('.quiz-content');
        if (quizContent) {
            quizContent.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">⚠️</div>
                    <h3>Terjadi Kesalahan</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="window.mpiApp.initializeQuiz()">Coba Lagi</button>
                    <button class="btn btn-secondary" onclick="window.mpiApp.showMainMenu()">Kembali ke Menu</button>
                </div>
            `;
        }
    }

    /**
     * Generate simple certificate page (QUIZ-ONLY SYSTEM)
     */
    generateSimpleCertificatePage() {
        const progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');
        const contentPages = document.getElementById('contentPages');

        if (!contentPages) return;

        const hasCertificate = progress.certificateUnlocked;
        const bestScore = progress.bestScore || 0;
        const quizAttempts = progress.quizAttempts || 0;
        const certificateData = progress.certificateData;

        const certificatePageHTML = `
        <div class="page" data-page="certificate">
            ${this.generatePageHeader(
                'Sertifikat Kompetensi',
                'Dapatkan sertifikat dengan menyelesaikan kuis (70% passing score)',
                true
            )}

            <!-- DEBUG SECTION (remove in production) -->
            <div style="text-align: center; margin: 20px 0;">
                <button class="btn btn-outline" onclick="window.mpiApp.debugCertificateStatus()" style="font-size: 12px; padding: 5px 10px;">
                    🔍 Debug Certificate Status
                </button>
            </div>

            <div class="page-content">
                <div class="container">
                    <div class="simple-certificate-container">
                        ${hasCertificate ? this.renderUnlockedCertificate(certificateData, bestScore) : this.renderLockedCertificate(bestScore, quizAttempts)}

                        <!-- Quiz Access Section -->
                        <div class="quiz-access-section">
                            <h3>🎯 Cara Mendapatkan Sertifikat</h3>
                            <div class="quiz-info-card">
                                <h4>Kuis Kompetensi Jaringan Dasar</h4>
                                <ul class="quiz-details">
                                    <li>📝 15 soal pilihan ganda</li>
                                    <li>⏱️ Waktu: 15 menit</li>
                                    <li>🎯 Passing grade: 70%</li>
                                    <li>🔄 Unlimited attempts</li>
                                </ul>

                                ${!hasCertificate ? `
                                    <button class="btn btn-primary btn-large" onclick="window.mpiApp.startCertificateQuiz()">
                                        🚀 Mulai Kuis Sertifikat Sekarang
                                    </button>
                                ` : `
                                    <div class="congratulations-message">
                                        <p>🎉 <strong>Selamat!</strong> Anda telah lulus kuis dengan nilai ${bestScore}%</p>
                                        <p>Sertifikat kompetensi Anda sudah tersedia dan dapat diunduh kapan saja.</p>
                                    </div>
                                `}
                            </div>
                        </div>

                        ${hasCertificate ? `
                            <!-- Certificate Actions -->
                            <div class="certificate-actions-section">
                                <h3>📋 Aksi Sertifikat</h3>
                                <div class="actions-grid">
                                    <button class="btn btn-success btn-large" onclick="window.mpiApp.downloadCertificate()">
                                        📥 Unduh Sertifikat PDF
                                    </button>
                                    <button class="btn btn-secondary" onclick="window.mpiApp.viewCertificateDetails()">
                                        👀 Lihat Detail Sertifikat
                                    </button>
                                    <button class="btn btn-outline" onclick="window.mpiApp.shareCertificate()">
                                        📤 Bagikan Sertifikat
                                    </button>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
        `;

        contentPages.innerHTML = certificatePageHTML;
        console.log('✅ Simple certificate page generated');
    }

    /**
     * Render unlocked certificate view
     */
    renderUnlockedCertificate(certificateData, score) {
        return `
        <div class="certificate-card unlocked">
            <div class="certificate-header">
                <div class="certificate-icon">🏆</div>
                <h2>Sertifikat Anda Tersedia!</h2>
                <p>Selamat atas pencapaian Anda dalam kuis kompetensi jaringan dasar</p>
            </div>

            <div class="certificate-stats">
                <div class="stat-card">
                    <div class="stat-value">${score}%</div>
                    <div class="stat-label">Nilai Kuis</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${certificateData.id}</div>
                    <div class="stat-label">No. Sertifikat</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${new Date(certificateData.completionDate).toLocaleDateString('id-ID')}</div>
                    <div class="stat-label">Tanggal Perolehan</div>
                </div>
            </div>

            <div class="certificate-preview">
                <div class="preview-badge">
                    <span class="preview-icon">✅</span>
                    <span class="preview-text">Sertifikat Terverifikasi</span>
                </div>
            </div>
        </div>
        `;
    }

    /**
     * Render locked certificate view
     */
    renderLockedCertificate(bestScore, attempts) {
        return `
        <div class="certificate-card locked">
            <div class="certificate-header">
                <div class="certificate-icon">🔒</div>
                <h2>Sertifikat Kompetensi</h2>
                <p>Selesaikan kuis dengan nilai minimal 70% untuk membuka sertifikat</p>
            </div>

            <div class="progress-indicator">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(bestScore, 100)}%"></div>
                </div>
                <div class="progress-text">Progress: ${bestScore}% / 70%</div>
            </div>

            <div class="attempt-info">
                <p>📊 Percobaan kuis: <strong>${attempts}</strong> kali</p>
                ${bestScore > 0 ? `<p>💡 Skor terbaik Anda: <strong>${bestScore}%</strong></p>` : '<p>🎯 Mulai kuis untuk melihat progress Anda</p>'}
            </div>

            ${bestScore >= 60 ? `
                <div class="close-to-success">
                    <p>🔥 Hampir berhasil! Tinggal ${70 - bestScore}% lagi untuk mendapatkan sertifikat.</p>
                </div>
            ` : ''}
        </div>
        `;
    }

    /**
     * View certificate details
     */
    viewCertificateDetails() {
        const progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');
        const certificateData = progress.certificateData;

        if (!certificateData) {
            this.showNotification('Data sertifikat tidak ditemukan', 'error');
            return;
        }

        const detailsHTML = `
        <div class="certificate-details-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        ">
            <div class="details-content" style="
                background: var(--color-darker);
                border-radius: 20px;
                padding: 40px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                color: var(--color-light);
            ">
                <h2>Detail Sertifikat</h2>
                <div class="certificate-info-grid">
                    <div class="info-item">
                        <label>Nama Siswa:</label>
                        <span>${certificateData.studentName}</span>
                    </div>
                    <div class="info-item">
                        <label>No. Sertifikat:</label>
                        <span>${certificateData.id}</span>
                    </div>
                    <div class="info-item">
                        <label>Skor:</label>
                        <span>${certificateData.score}%</span>
                    </div>
                    <div class="info-item">
                        <label>Tanggal:</label>
                        <span>${new Date(certificateData.completionDate).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div class="info-item">
                        <label>Kode Verifikasi:</label>
                        <span>${certificateData.verificationCode}</span>
                    </div>
                    <div class="info-item">
                        <label>Program:</label>
                        <span>Jaringan Dasar - SMK TKJT</span>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="window.mpiApp.downloadCertificate(); document.querySelector('.certificate-details-modal').remove();">
                        📥 Unduh PDF
                    </button>
                    <button class="btn btn-secondary" onclick="document.querySelector('.certificate-details-modal').remove();">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', detailsHTML);
    }

    /**
     * Share certificate
     */
    shareCertificate() {
        const progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');
        const certificateData = progress.certificateData;

        if (!certificateData) {
            this.showNotification('Sertifikat belum tersedia', 'error');
            return;
        }

        const shareText = `🏆 Saya telah mendapatkan Sertifikat Kompetensi Jaringan Dasar dengan nilai ${certificateData.score}%!`;
        const shareURL = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: 'Sertifikat Kompetensi Jaringan Dasar',
                text: shareText,
                url: shareURL
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${shareText} ${shareURL}`).then(() => {
                this.showNotification('Tautan sertifikat disalin ke clipboard!', 'success');
            }).catch(() => {
                this.showNotification('Gagal membagikan sertifikat', 'error');
            });
        }
    }

    /**
     * Initialize certificate page
     */
    initializeCertificate() {
        console.log('Certificate page initialized (QUIZ-ONLY SYSTEM)');

        // Load user progress and certificate data
        this.loadCertificateStatus();
        this.generateSimpleCertificatePage();
    }

    /**
     * Load certificate status based on user progress
     */
    loadCertificateStatus() {
        const progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');
        const statusCard = document.getElementById('certificateStatusCard');

        if (!statusCard) return;

        const hasCertificate = progress.certificateUnlocked || false;
        const quizScore = progress.bestScore || 0;
        const practiceCompleted = progress.practiceCompleted || 0;

        if (hasCertificate) {
            // User has certificate - show certificate preview
            statusCard.innerHTML = `
                <div class="certificate-unlocked">
                    <div class="celebration-icon">🏆</div>
                    <h2>Selamat! Anda Telah Berhasil</h2>
                    <p>Sertifikat kompetensi jaringan dasar telah tersedia untuk Anda</p>
                    <div class="achievement-stats">
                        <div class="stat-item">
                            <span class="stat-value">${quizScore}%</span>
                            <span class="stat-label">Nilai Kuis</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${practiceCompleted}</span>
                            <span class="stat-label">Latihan Selesai</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.completionRate || 0}%</span>
                            <span class="stat-label">Materi Selesai</span>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-large" onclick="window.mpiApp.showCertificatePreview()">
                        Lihat Sertifikat
                    </button>
                </div>
            `;
        } else {
            // User doesn't have certificate yet
            const quizPassed = quizScore >= 70;
            const practiceEnough = practiceCompleted >= 10;
            const completionEnough = (this.completionRate || 0) >= 80;

            statusCard.innerHTML = `
                <div class="certificate-locked">
                    <div class="lock-icon">🔒</div>
                    <h2>Sertifikat Belum Tersedia</h2>
                    <p>Selesaikan semua persyaratan di bawah ini untuk mendapatkan sertifikat kompetensi</p>
                    <div class="progress-overview">
                        <div class="progress-item ${quizPassed ? 'completed' : 'pending'}">
                            <span class="progress-icon">${quizPassed ? '✅' : '⭕'}</span>
                            <span>Kuis Akhir (${quizScore}%)</span>
                        </div>
                        <div class="progress-item ${practiceEnough ? 'completed' : 'pending'}">
                            <span class="progress-icon">${practiceEnough ? '✅' : '⭕'}</span>
                            <span>Latihan (${practiceCompleted}/10)</span>
                        </div>
                        <div class="progress-item ${completionEnough ? 'completed' : 'pending'}">
                            <span class="progress-icon">${completionEnough ? '✅' : '⭕'}</span>
                            <span>Materi (${this.completionRate || 0}%)</span>
                        </div>
                    </div>
                    <div class="motivation-message">
                        <p>💪 <strong>Tetap semangat!</strong> Anda sudah menyelesaikan ${Math.round((quizPassed + practiceEnough + completionEnough) / 3 * 100)}% persyaratan.</p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Update certificate requirements display
     */
    updateCertificateRequirements() {
        const progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');

        // Update quiz status
        const quizStatus = document.getElementById('quiz-status');
        if (quizStatus) {
            const quizScore = progress.bestScore || 0;
            quizStatus.textContent = quizScore >= 70 ? `Lulus (${quizScore}%)` : `Belum (${quizScore}%)`;
        }

        // Update practice status
        const practiceStatus = document.getElementById('practice-status');
        if (practiceStatus) {
            const practiceCompleted = progress.practiceCompleted || 0;
            practiceStatus.textContent = `${practiceCompleted}/10`;
        }

        // Update completion status
        const completionStatus = document.getElementById('completion-status');
        if (completionStatus) {
            completionStatus.textContent = `${this.completionRate || 0}%`;
        }
    }

    /**
     * Show certificate preview
     */
    showCertificatePreview() {
        const previewSection = document.getElementById('certificatePreviewSection');
        if (previewSection) {
            previewSection.style.display = 'block';
            previewSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Generate certificate preview
     */
    generateCertificatePreview() {
        const certificateFrame = document.getElementById('certificateFrame');
        if (!certificateFrame) return;

        const progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');
        const currentDate = new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        certificateFrame.innerHTML = `
            <div class="certificate-content" id="certificateContent">
                <div class="certificate-border">
                    <div class="certificate-header">
                        <div class="certificate-logo">
                            <div class="logo-icon">🏫</div>
                            <div class="logo-text">
                                <h3>SMK TAMAN KARYA JASA TEKNIK</h3>
                                <p>Jurusan Teknik Komputer dan Jaringan</p>
                            </div>
                        </div>
                    </div>

                    <div class="certificate-body">
                        <div class="certificate-title">
                            <h1>SERTIFIKAT KOMPETENSI</h1>
                            <h2>JARINGAN DASAR</h2>
                        </div>

                        <div class="certificate-text">
                            <p>Dengan ini dinyatakan bahwa:</p>
                            <div class="student-name">
                                <h3>${this.studentName || 'Peserta Didik'}</h3>
                            </div>
                            <p>Telah berhasil menyelesaikan pembelajaran dan lulus evaluasi kompetensi</p>
                            <p>pada program <strong>Media Pembelajaran Interaktif Jaringan Dasar</strong></p>
                        </div>

                        <div class="certificate-details">
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Nilai Akhir:</span>
                                    <span class="detail-value">${progress.bestScore || 0}%</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Tanggal:</span>
                                    <span class="detail-value">${currentDate}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Kode Sertifikat:</span>
                                    <span class="detail-value">MPI-JD-${Date.now().toString().slice(-6)}</span>
                                </div>
                            </div>
                        </div>

                        <div class="certificate-signatures">
                            <div class="signature">
                                <div class="signature-line"></div>
                                <p class="signature-title">Kepala Jurusan TKJ</p>
                            </div>
                            <div class="signature">
                                <div class="signature-line"></div>
                                <p class="signature-title">Guru Pembimbing</p>
                            </div>
                        </div>

                        <div class="certificate-seal">
                            <div class="seal-icon">🏆</div>
                            <div class="seal-text">RESMI</div>
                        </div>
                    </div>

                    <div class="certificate-footer">
                        <p><em>"Menguasai Teknologi, Membangun Masa Depan"</em></p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Download certificate as PDF
     */
    downloadCertificate() {
        const certificateContent = document.getElementById('certificateContent');
        if (!certificateContent) {
            this.showNotification('Sertifikat belum tersedia', 'error');
            return;
        }

        // Add loading state
        const downloadBtn = event.target;
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<span class="btn-icon">⏳</span> Mengunduh...';
        downloadBtn.disabled = true;

        // Use html2canvas and jsPDF to create PDF
        html2canvas(certificateContent, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 297; // A4 width in mm (landscape)
            const pageHeight = 210; // A4 height in mm (landscape)
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Download the PDF
            const fileName = `Sertifikat_Jaringan_Dasar_${this.studentName || 'Peserta'}_${Date.now()}.pdf`;
            pdf.save(fileName);

            // Reset button
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;

            this.showNotification('Sertifikat berhasil diunduh!', 'success');
        }).catch(error => {
            console.error('Error generating PDF:', error);
            this.showNotification('Gagal mengunduh sertifikat', 'error');

            // Reset button
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        });
    }

    /**
     * Share certificate
     */
    shareCertificate() {
        const progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');

        if (!progress.certificateUnlocked) {
            this.showNotification('Selesaikan semua persyaratan terlebih dahulu', 'warning');
            return;
        }

        const shareData = {
            title: 'Sertifikat Kompetensi Jaringan Dasar',
            text: `Saya telah mendapatkan sertifikat kompetensi jaringan dasar dengan nilai ${progress.bestScore}%! 🏆`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => this.showNotification('Sertifikat berhasil dibagikan!', 'success'))
                .catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error('Error sharing:', error);
                    }
                });
        } else {
            // Fallback - copy to clipboard
            const textToCopy = `Saya telah mendapatkan sertifikat kompetensi jaringan dasar dengan nilai ${progress.bestScore}%! 🏆\n${shareData.url}`;

            navigator.clipboard.writeText(textToCopy).then(() => {
                this.showNotification('Tautan sertifikat disalin ke clipboard!', 'success');
            }).catch(error => {
                console.error('Error copying to clipboard:', error);
                this.showNotification('Gagal membagikan sertifikat', 'error');
            });
        }
    }

    /**
     * Print certificate
     */
    printCertificate() {
        const certificateContent = document.getElementById('certificateContent');
        if (!certificateContent) {
            this.showNotification('Sertifikat belum tersedia', 'error');
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Sertifikat Kompetensi</title>
                <style>
                    body { margin: 0; padding: 20px; font-family: 'Times New Roman', serif; }
                    @media print { body { margin: 0; } }
                    .certificate-content { width: 100%; max-width: 1200px; margin: 0 auto; }
                </style>
            </head>
            <body>
                ${certificateContent.outerHTML}
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load before printing
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);

        this.showNotification('Dialog cetak terbuka', 'info');
    }

    /**
     * Initialize AI Tutor page
     */
    initializeAITutor() {
        console.log('AI Tutor page initialized');

        // Make app instance available to AI Tutor
        window.mpiApp = this;

        // Initialize AI Tutor if class is available
        if (typeof AITutor !== 'undefined') {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                try {
                    this.aiTutor = new AITutor();
                    this.aiTutor.initialize();
                    console.log('AI Tutor initialized successfully');
                } catch (error) {
                    console.error('Error initializing AI Tutor:', error);
                    this.showAITutorError(error);
                }
            }, 100);
        } else {
            console.error('AITutor class not found');
            this.showAITutorError(new Error('AI Tutor library not loaded'));
        }
    }

    /**
     * Show AI Tutor initialization error
     */
    showAITutorError(error) {
        const contentContainer = document.querySelector('.ai-tutor-content');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">
                        <svg viewBox="0 0 24 24">
                            <path fill="#ef4444" d="M12,2L13.09,8.26L22,9L16,14.14L18.18,21.02L12,17.77L5.82,21.02L8,14.14L2,9L10.91,8.26L12,2M12,6.39L11.5,8.81L8.75,9.15L10.5,10.89L10.06,13.64L12,12.32L13.94,13.64L13.5,10.89L15.25,9.15L12.5,8.81L12,6.39Z"/>
                        </svg>
                    </div>
                    <h3>Kesalahan Memuat AI Tutor</h3>
                    <p>Terjadi kesalahan saat memuat AI Tutor Virtual.</p>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <button class="btn-retry" onclick="location.reload()">
                        Muat Ulang Halaman
                    </button>
                </div>
            `;
        }
    }

    /**
     * Initialize about page
     */
    initializeAbout() {
        console.log('About page initialized');
    }

    /**
     * Generate unique certificate ID
     */
    generateCertificateID() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `CERT-${timestamp}-${random}`.toUpperCase();
    }

    /**
     * Generate verification code for certificate
     */
    generateVerificationCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Debug certificate status
     */
    debugCertificateStatus() {
        const progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');
        console.log('🔍 CERTIFICATE DEBUG INFO:');
        console.log('Progress Data:', progress);
        console.log('Certificate Unlocked:', progress.certificateUnlocked);
        console.log('Best Score:', progress.bestScore);
        console.log('Certificate Data:', progress.certificateData);

        // Also check if certificate should be unlocked based on best score
        if (progress.bestScore >= 70 && !progress.certificateUnlocked) {
            console.log('🚨 ISSUE FOUND: Score >= 70% but certificate not unlocked!');
            console.log('🔧 Auto-fixing certificate...');
            this.updateEvaluationProgress();
        }

        this.showNotification(`Certificate Status: ${progress.certificateUnlocked ? 'Unlocked' : 'Locked'} (Score: ${progress.bestScore || 0}%)`, 'info');
    }

    /**
     * Start certificate quiz directly
     */
    startCertificateQuiz() {
        console.log('🚀 Starting certificate quiz...');

        // Check if user already has certificate
        const progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');
        if (progress.certificateUnlocked) {
            this.showNotification('Anda sudah memiliki sertifikat!', 'info');
            this.showPage('certificate');
            return;
        }

        // Start quiz with certificate mode
        if (window.unifiedQuizSystem) {
            window.unifiedQuizSystem.startSession('quiz', {
                category: 'certificate_quiz',
                maxQuestionsPerSession: 15,
                totalTimeLimit: 900, // 15 minutes
                passingScore: 70,
                certificateMode: true,
                allowBackNavigation: false,
                showImmediateFeedback: false
            });
        } else {
            this.showNotification('Sistem kuis belum siap. Silakan coba lagi.', 'error');
        }
    }

    /**
     * Generate and download certificate
     */
    async downloadCertificate() {
        try {
            const progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');

            if (!progress.certificateUnlocked || !progress.certificateData) {
                this.showNotification('Sertifikat belum tersedia!', 'error');
                return;
            }

            const certificate = progress.certificateData;

            // Generate certificate HTML
            const certificateHTML = this.generateCertificateHTML(certificate);

            // Create temporary div for certificate
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = certificateHTML;
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            document.body.appendChild(tempDiv);

            // Generate PDF using html2canvas and jsPDF
            const canvas = await html2canvas(tempDiv.querySelector('.certificate-template'), {
                scale: 2,
                useCORS: true,
                logging: false
            });

            // Clean up
            document.body.removeChild(tempDiv);

            // Create PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);

            // Download PDF
            const fileName = `Sertifikat_${certificate.studentName}_${certificate.id}.pdf`;
            pdf.save(fileName);

            this.showNotification('📥 Sertifikat berhasil diunduh!', 'success');

        } catch (error) {
            console.error('Error downloading certificate:', error);
            this.showNotification('Gagal mengunduh sertifikat. Silakan coba lagi.', 'error');
        }
    }

    /**
     * Generate certificate HTML template
     */
    generateCertificateHTML(data) {
        return `
        <div class="certificate-template simple" style="width: 1123px; height: 794px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative; font-family: 'Poppins', sans-serif; color: #333;">
            <!-- Background Pattern -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"none\"/><circle cx=\"50\" cy=\"50\" r=\"40\" stroke=\"rgba(255,255,255,0.1)\" stroke-width=\"2\" fill=\"none\"/></svg>'); opacity: 0.3;"></div>

            <!-- Main Content -->
            <div style="position: relative; z-index: 2; padding: 60px; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">

                <!-- Header -->
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <div style="font-size: 48px; margin-bottom: 10px;">🏫</div>
                    <h1 style="font-size: 36px; font-weight: 700; color: #2c3e50; margin: 0; text-transform: uppercase;">SERTIFIKAT KOMPETENSI</h1>
                    <h2 style="font-size: 24px; font-weight: 600; color: #34495e; margin: 10px 0;">Jaringan Dasar</h2>
                    <p style="font-size: 16px; color: #7f8c8d; margin: 0;">Media Pembelajaran Interaktif - SMK TKJT</p>
                </div>

                <!-- Body -->
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 40px; flex-grow: 1; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <p style="font-size: 18px; color: #555; margin-bottom: 20px;">Diberikan kepada:</p>
                    <h3 style="font-size: 32px; font-weight: 700; color: #2c3e50; margin: 0 0 30px 0; text-transform: uppercase; border-bottom: 3px solid #3498db; padding-bottom: 15px; display: inline-block;">${data.studentName}</h3>

                    <p style="font-size: 18px; color: #555; margin-bottom: 20px;">Atas keberhasilan menyelesaikan kuis kompetensi dengan nilai:</p>

                    <div style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; border-radius: 15px; padding: 20px; margin: 20px 0; display: inline-block;">
                        <div style="font-size: 48px; font-weight: 700; margin: 0;">${data.score}%</div>
                        <div style="font-size: 16px; margin: 5px 0 0 0;">NILAI KOMPETENSI</div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px;">
                        <div style="background: #ecf0f1; border-radius: 10px; padding: 15px;">
                            <div style="font-size: 14px; color: #7f8c8d;">Program</div>
                            <div style="font-size: 16px; font-weight: 600; color: #2c3e50;">Jaringan Dasar</div>
                        </div>
                        <div style="background: #ecf0f1; border-radius: 10px; padding: 15px;">
                            <div style="font-size: 14px; color: #7f8c8d;">Tanggal</div>
                            <div style="font-size: 16px; font-weight: 600; color: #2c3e50;">${new Date(data.completionDate).toLocaleDateString('id-ID')}</div>
                        </div>
                        <div style="background: #ecf0f1; border-radius: 10px; padding: 15px;">
                            <div style="font-size: 14px; color: #7f8c8d;">Standar Kelulusan</div>
                            <div style="font-size: 16px; font-weight: 600; color: #2c3e50;">70%</div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; margin-top: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; text-align: left;">
                        <div>
                            <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 20px;">No. Sertifikat: <strong>${data.id}</strong></div>
                            <div style="font-size: 14px; color: #7f8c8d;">Kode Verifikasi: <strong>${data.verificationCode}</strong></div>
                            <div style="font-size: 12px; color: #95a5a6; margin-top: 5px;">Verifikasi online: mpi-learning.sch.id/verify/${data.verificationCode}</div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; text-align: center;">
                            <div>
                                <p style="font-size: 14px; color: #555; margin: 0 0 30px 0;">Kepala Sekolah</p>
                                <div style="border-bottom: 2px solid #34495e; width: 150px; margin: 0 auto;"></div>
                                <p style="font-size: 14px; font-weight: 600; color: #2c3e50; margin: 10px 0 0 0;">Dr. Budi Santoso, M.Pd</p>
                            </div>
                            <div>
                                <p style="font-size: 14px; color: #555; margin: 0 0 30px 0;">Kepala Program TKJ</p>
                                <div style="border-bottom: 2px solid #34495e; width: 150px; margin: 0 auto;"></div>
                                <p style="font-size: 14px; font-weight: 600; color: #2c3e50; margin: 10px 0 0 0;">Ahmad Wijaya, S.T</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Border Frame -->
            <div style="position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; border: 5px solid rgba(255,255,255,0.3); border-radius: 15px; pointer-events: none;"></div>
        </div>
        `;
    }

    /**
     * Logout user
     */
    logout() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            // Clear session data but keep progress
            localStorage.removeItem('studentName');
            location.reload();
        }
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info', duration = 3000) {
        console.log(`🔔 Notification [${type}]: ${message}`);

        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        // Create notification
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification ${type}`;
        notificationDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">
                    ${this.getNotificationIcon(type)}
                </span>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()" style="margin-left: 1rem; background: none; border: none; color: inherit; cursor: pointer; font-size: 1.2rem;">×</button>
        `;

        document.body.appendChild(notificationDiv);

        // Animate in
        setTimeout(() => {
            notificationDiv.style.opacity = '1';
            notificationDiv.style.transform = 'translateY(0)';
        }, 100);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                notificationDiv.style.opacity = '0';
                notificationDiv.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    if (notificationDiv.parentNode) {
                        notificationDiv.parentNode.removeChild(notificationDiv);
                    }
                }, 300);
            }, duration);
        }
    }

    /**
     * Get notification icon based on type
     */
    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️',
            'loading': '⏳'
        };
        return icons[type] || icons.info;
    }

    /**
     * Show error message (alias for showNotification with error type)
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Scroll element to bottom
     */
    scrollToBottom(element) {
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }

    /**
     * Initialize Enhanced Test System
     */
    initializeEnhancedTest() {
        console.log('Initializing Enhanced Test System...');

        // Show enhanced test selection screen
        this.showEnhancedTestSelection();
    }

    /**
     * Initialize Enhanced Quiz System with retry logic
     */
    initializeEnhancedQuizWithRetry() {
        console.log('Initializing Enhanced Quiz System with retry logic...');
        this.initializeEnhancedQuizWithDelay(300);
    }

    /**
     * Initialize Enhanced Quiz System with delay and retry
     */
    initializeEnhancedQuizWithDelay(delay, retryCount = 0) {
        setTimeout(() => {
            // Check if DOM is ready
            const quizContent = document.getElementById('quizContent');
            const contentPages = document.getElementById('contentPages');

            console.log(`DOM check (attempt ${retryCount + 1}):`, {
                quizContentReady: !!quizContent,
                contentPagesReady: !!contentPages,
                enhancedQuizSystemReady: !!this.enhancedQuizSystem
            });

            if (quizContent && contentPages && this.enhancedQuizSystem) {
                // DOM and systems are ready, initialize quiz
                console.log('✅ DOM and systems ready, starting Enhanced Quiz');
                this.startEnhancedQuiz();
            } else {
                // Not ready yet, retry if we haven't exceeded max attempts
                if (retryCount < 5) {
                    console.log(`⚠️ Not ready yet, retrying in ${delay * 2}ms...`);
                    this.initializeEnhancedQuizWithDelay(delay * 2, retryCount + 1);
                } else {
                    console.error('❌ Failed to initialize Enhanced Quiz after 5 attempts');
                    // Fallback to original quiz system
                    this.initializeOriginalQuiz();
                }
            }
        }, delay);
    }

    /**
     * Initialize Enhanced Quiz System
     */
    initializeEnhancedQuiz() {
        console.log('Initializing Enhanced Quiz System...');
        console.log('Enhanced Quiz System available:', !!this.enhancedQuizSystem);

        if (this.enhancedQuizSystem) {
            this.startEnhancedQuiz();
        } else {
            console.warn('Enhanced Quiz System not available, falling back to original quiz');
            // Fallback to original quiz system
            this.initializeOriginalQuiz();
        }
    }

    /**
     * Start Enhanced Quiz
     */
    startEnhancedQuiz() {
        console.log('Starting Enhanced Quiz...');

        // Load quiz questions
        this.loadQuizQuestions();

        // Get questions from data or use fallback
        const questions = this.getQuizQuestions();

        if (questions.length === 0) {
            this.showError('Tidak ada soal kuis yang tersedia');
            return;
        }

        // Initialize enhanced quiz system with questions
        this.enhancedQuizSystem.initializeQuiz(questions, {
            allowBackNavigation: true,
            showImmediateFeedback: false,
            timePerQuestion: null,
            passingScore: 70,
            shuffleQuestions: true,
            shuffleAnswers: true,
            category: 'final'
        });

        // Start the quiz
        this.enhancedQuizSystem.startQuiz();
    }

    /**
     * Get quiz questions with fallback data
     */
    getQuizQuestions() {
        // Try to get from loaded data first
        if (window.appData && window.appData.quiz_akhir && window.appData.quiz_akhir.length > 0) {
            return window.appData.quiz_akhir.map((q, index) => ({
                id: q.id || `quiz-${index + 1}`,
                pertanyaan: q.pertanyaan || q.question,
                options: q.options || q.jawaban,
                jawaban_benar: q.jawaban_benar || q.correctAnswer,
                points: q.points || 10,
                type: q.type || 'multiple-choice'
            }));
        }

        // Fallback questions if no data available
        return [
            {
                id: 'fallback-1',
                pertanyaan: 'Apa fungsi utama dari router dalam jaringan komputer?',
                options: [
                    'Menghubungkan jaringan lokal dengan internet',
                    'Memberikan alamat IP ke perangkat',
                    'Melindungi jaringan dari virus',
                    'Menyimpan data pengguna'
                ],
                jawaban_benar: 0,
                points: 10,
                type: 'multiple-choice'
            },
            {
                id: 'fallback-2',
                pertanyaan: 'Protokol mana yang digunakan untuk pengiriman email?',
                options: ['HTTP', 'FTP', 'SMTP', 'SSH'],
                jawaban_benar: 2,
                points: 10,
                type: 'multiple-choice'
            },
            {
                id: 'fallback-3',
                pertanyaan: 'OSI Layer yang bertanggung jawab untuk routing adalah...',
                options: ['Physical', 'Data Link', 'Network', 'Transport'],
                jawaban_benar: 2,
                points: 10,
                type: 'multiple-choice'
            },
            {
                id: 'fallback-4',
                pertanyaan: 'Topologi jaringan yang paling reliable adalah...',
                options: ['Bus', 'Star', 'Ring', 'Mesh'],
                jawaban_benar: 1,
                points: 10,
                type: 'multiple-choice'
            },
            {
                id: 'fallback-5',
                pertanyaan: 'Firewall berfungsi untuk...',
                options: [
                    'Mempercepat koneksi internet',
                    'Memblokir akses yang tidak sah',
                    'Mengompres file',
                    'Backup data otomatis'
                ],
                jawaban_benar: 1,
                points: 10,
                type: 'multiple-choice'
            }
        ];
    }

    /**
     * Show Enhanced Test Selection Screen
     */
    showEnhancedTestSelection() {
        const contentPages = document.getElementById('contentPages');
        if (!contentPages) return;

        contentPages.innerHTML = `
            <div class="page" data-page="test">
                <div class="page-header">
                    <div class="container">
                        <h1>Test Pengetahuan Jaringan Komputer</h1>
                        <button class="btn-back" onclick="window.mpiApp.showMainMenu()">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
                            </svg>
                            Kembali ke Menu
                        </button>
                    </div>
                </div>

                <div class="page-content">
                    <div class="container">
                        <div class="enhanced-test-selection">
                            <div class="selection-intro">
                                <h2>Pilih Mode Test</h2>
                                <p>Tingkatkan pemahaman Anda tentang jaringan komputer dengan tes interaktif yang adaptif.</p>
                            </div>

                            <div class="test-modes-grid">
                                <!-- Quick Practice -->
                                <div class="test-mode-card" onclick="window.mpiApp.startEnhancedTest({ mode: 'quick', category: 'mixed' })">
                                    <div class="mode-icon">⚡</div>
                                    <h3>Quick Practice</h3>
                                    <p>10 soal acak dari semua materi</p>
                                    <div class="mode-details">
                                        <span>📊 Tanpa timer</span>
                                        <span>🎯 Semua tingkat kesulitan</span>
                                        <span>🔄 Dapat diulang</span>
                                    </div>
                                    <button class="btn btn-secondary">Mulai Test</button>
                                </div>

                                <!-- Category Test -->
                                <div class="test-mode-card" onclick="window.mpiApp.showCategorySelection()">
                                    <div class="mode-icon">📚</div>
                                    <h3>Test per Kategori</h3>
                                    <p>Fokus pada materi spesifik</p>
                                    <div class="mode-details">
                                        <span>📝 Dasar Jaringan</span>
                                        <span>🌐 Topologi Jaringan</span>
                                        <span>🔐 Model OSI & TCP/IP</span>
                                        <span>🛡️ Keamanan Jaringan</span>
                                    </div>
                                    <button class="btn btn-secondary">Pilih Kategori</button>
                                </div>

                                <!-- Adaptive Test -->
                                <div class="test-mode-card" onclick="window.mpiApp.startEnhancedTest({ mode: 'adaptive', category: 'mixed' })">
                                    <div class="mode-icon">🧠</div>
                                    <h3>Adaptive Test</h3>
                                    <p>Test dengan kesulitan yang menyesuaikan</p>
                                    <div class="mode-details">
                                        <span>⚙️ Kesulitan adaptif</span>
                                        <span>📈 Progress tracking</span>
                                        <span>🏆 Achievement system</span>
                                    </div>
                                    <button class="btn btn-primary">Mulai Test</button>
                                </div>

                                <!-- Timed Challenge -->
                                <div class="test-mode-card" onclick="window.mpiApp.startEnhancedTest({ mode: 'timed', category: 'mixed', timeLimit: 600 })">
                                    <div class="mode-icon">⏱️</div>
                                    <h3>Timed Challenge</h3>
                                    <p>Test dengan batas waktu 10 menit</p>
                                    <div class="mode-details">
                                        <span>⏰ 10 menit</span>
                                        <span>🔥 Semua soal</span>
                                        <span>📊 Live scoring</span>
                                    </div>
                                    <button class="btn btn-warning">Mulai Challenge</button>
                                </div>

                                <!-- Final Exam -->
                                <div class="test-mode-card" onclick="window.mpiApp.startEnhancedTest({ mode: 'final', category: 'mixed', questionCount: 30, timeLimit: 1800 })">
                                    <div class="mode-icon">🎓</div>
                                    <h3>Final Exam</h3>
                                    <p>Ujian komprehensif 30 soal</p>
                                    <div class="mode-details">
                                        <span>📋 30 soal</span>
                                        <span>⏰ 30 menit</span>
                                        <span>🏆 Sertifikat</span>
                                        <span>📊 Analisis lengkap</span>
                                    </div>
                                    <button class="btn btn-danger">Mulai Final Exam</button>
                                </div>

                                <!-- Custom Test -->
                                <div class="test-mode-card" onclick="window.mpiApp.showCustomTestOptions()">
                                    <div class="mode-icon">⚙️</div>
                                    <h3>Custom Test</h3>
                                    <p>Sesuaikan test sesuai kebutuhan</p>
                                    <div class="mode-details">
                                        <span>🎯 Pilih kategori</span>
                                        <span>📊 Tentukan jumlah soal</span>
                                        <span>⏰ Atur waktu</span>
                                        <span>🔧 Tingkat kesulitan</span>
                                    </div>
                                    <button class="btn btn-secondary">Buat Test</button>
                                </div>
                            </div>

                            <!-- Test Statistics -->
                            <div class="test-stats-overview">
                                <h3>Statistik Anda</h3>
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <div class="stat-value">${this.getUserTotalTests() || 0}</div>
                                        <div class="stat-label">Total Test</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${this.getUserAverageScore() || 0}%</div>
                                        <div class="stat-label">Skor Rata-rata</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${this.getUserBestScore() || 0}%</div>
                                        <div class="stat-label">Skor Tertinggi</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${this.getUserStreak() || 0}</div>
                                        <div class="stat-label">Current Streak</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show Category Selection for Enhanced Test
     */
    showCategorySelection() {
        const contentPages = document.getElementById('contentPages');
        if (!contentPages) return;

        contentPages.innerHTML = `
            <div class="page" data-page="test">
                <div class="page-header">
                    <div class="container">
                        <h1>Pilih Kategori Test</h1>
                        <button class="btn-back" onclick="window.mpiApp.initializeTest()">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
                            </svg>
                            Kembali
                        </button>
                    </div>
                </div>

                <div class="page-content">
                    <div class="container">
                        <div class="category-selection">
                            <div class="categories-grid">
                                <div class="category-card" onclick="window.mpiApp.startEnhancedTest({ mode: 'category', category: 'network-basics' })">
                                    <div class="category-icon">🌐</div>
                                    <h3>Dasar Jaringan</h3>
                                    <p>Konsep fundamental jaringan komputer</p>
                                    <div class="category-info">
                                        <span>15 soal</span>
                                        <span>Pemula</span>
                                    </div>
                                </div>

                                <div class="category-card" onclick="window.mpiApp.startEnhancedTest({ mode: 'category', category: 'network-topology' })">
                                    <div class="category-icon">🔗</div>
                                    <h3>Topologi Jaringan</h3>
                                    <p>Berbagai jenis topologi dan karakteristiknya</p>
                                    <div class="category-info">
                                        <span>12 soal</span>
                                        <span>Menengah</span>
                                    </div>
                                </div>

                                <div class="category-card" onclick="window.mpiApp.startEnhancedTest({ mode: 'category', category: 'osi-model' })">
                                    <div class="category-icon">📊</div>
                                    <h3>Model OSI & TCP/IP</h3>
                                    <p>Layer network dan protokol komunikasi</p>
                                    <div class="category-info">
                                        <span>18 soal</span>
                                        <span>Menengah</span>
                                    </div>
                                </div>

                                <div class="category-card" onclick="window.mpiApp.startEnhancedTest({ mode: 'category', category: 'network-protocols' })">
                                    <div class="category-icon">📡</div>
                                    <h3>Protokol Jaringan</h3>
                                    <p>Berbagai protokol komunikasi data</p>
                                    <div class="category-info">
                                        <span>20 soal</span>
                                        <span>Lanjutan</span>
                                    </div>
                                </div>

                                <div class="category-card" onclick="window.mpiApp.startEnhancedTest({ mode: 'category', category: 'network-security' })">
                                    <div class="category-icon">🛡️</div>
                                    <h3>Keamanan Jaringan</h3>
                                    <p>Konsep dan praktik keamanan jaringan</p>
                                    <div class="category-info">
                                        <span>25 soal</span>
                                        <span>Lanjutan</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show Custom Test Options
     */
    showCustomTestOptions() {
        const contentPages = document.getElementById('contentPages');
        if (!contentPages) return;

        contentPages.innerHTML = `
            <div class="page" data-page="test">
                <div class="page-header">
                    <div class="container">
                        <h1>Buat Test Kustom</h1>
                        <button class="btn-back" onclick="window.mpiApp.initializeTest()">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
                            </svg>
                            Kembali
                        </button>
                    </div>
                </div>

                <div class="page-content">
                    <div class="container">
                        <div class="custom-test-config">
                            <div class="config-form">
                                <h3>Konfigurasi Test Anda</h3>

                                <div class="form-group">
                                    <label for="customCategory">Pilih Kategori:</label>
                                    <select id="customCategory" class="form-select">
                                        <option value="mixed">Campuran</option>
                                        <option value="network-basics">Dasar Jaringan</option>
                                        <option value="network-topology">Topologi Jaringan</option>
                                        <option value="osi-model">Model OSI & TCP/IP</option>
                                        <option value="network-protocols">Protokol Jaringan</option>
                                        <option value="network-security">Keamanan Jaringan</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="customDifficulty">Tingkat Kesulitan:</label>
                                    <select id="customDifficulty" class="form-select">
                                        <option value="mixed">Campuran</option>
                                        <option value="easy">Mudah</option>
                                        <option value="medium">Sedang</option>
                                        <option value="hard">Sulit</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="customQuestions">Jumlah Soal:</label>
                                    <input type="number" id="customQuestions" class="form-input" min="5" max="50" value="15">
                                </div>

                                <div class="form-group">
                                    <label for="customTime">Waktu (menit):</label>
                                    <input type="number" id="customTime" class="form-input" min="0" max="120" value="0" placeholder="0 = tanpa batas waktu">
                                </div>

                                <div class="form-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="enableHints" checked>
                                        <span>Aktifkan petunjuk</span>
                                    </label>
                                </div>

                                <div class="form-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="enableExplanations" checked>
                                        <span>Tampilkan penjelasan</span>
                                    </label>
                                </div>

                                <button class="btn btn-primary btn-large" onclick="window.mpiApp.startCustomTest()">
                                    Mulai Test Kustom
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Start Custom Test
     */
    startCustomTest() {
        const category = document.getElementById('customCategory').value;
        const difficulty = document.getElementById('customDifficulty').value;
        const questionCount = parseInt(document.getElementById('customQuestions').value);
        const timeLimit = parseInt(document.getElementById('customTime').value) * 60; // Convert to seconds
        const enableHints = document.getElementById('enableHints').checked;
        const enableExplanations = document.getElementById('enableExplanations').checked;

        this.startEnhancedTest({
            mode: 'custom',
            category: category,
            difficulty: difficulty,
            questionCount: questionCount,
            timeLimit: timeLimit,
            enableHints: enableHints,
            enableExplanations: enableExplanations
        });
    }

    /**
     * Start Enhanced Test
     */
    startEnhancedTest(options = {}) {
        console.log('Starting Enhanced Test with options:', options);

        if (!this.enhancedTestSystem) {
            console.error('Enhanced Test System not initialized');
            this.showNotification('Enhanced Test System tidak tersedia', 'error');
            return;
        }

        // Configure test options
        const testOptions = {
            category: options.category || 'mixed',
            difficulty: options.difficulty || 'mixed',
            questionCount: options.questionCount || (options.mode === 'quick' ? 10 : options.mode === 'final' ? 30 : 20),
            timeLimit: options.timeLimit || (options.mode === 'timed' ? 600 : options.mode === 'final' ? 1800 : 0),
            adaptiveMode: options.mode === 'adaptive' || false,
            enableHints: options.enableHints !== false,
            enableExplanations: options.enableExplanations !== false
        };

        // Start the test session
        const testState = this.enhancedTestSystem.startTestSession(testOptions);

        // Show test interface
        this.showEnhancedTestInterface(testState);
    }

    /**
     * Show Enhanced Test Interface
     */
    showEnhancedTestInterface(testState) {
        const contentPages = document.getElementById('contentPages');
        if (!contentPages) return;

        contentPages.innerHTML = `
            <div class="page" data-page="test">
                <div class="page-header">
                    <div class="container">
                        <h1>Enhanced Test - ${testState.config.category === 'mixed' ? 'Campuran' : testState.config.category}</h1>
                        <button class="btn-back" onclick="window.mpiApp.exitTest()">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
                            </svg>
                            Keluar Test
                        </button>
                    </div>
                </div>

                <div class="page-content">
                    <div class="container">
                        <div class="enhanced-test-container">
                            <div class="test-header">
                                <div class="test-title">Test Pengetahuan Jaringan Komputer</div>
                                <div class="test-info">
                                    <div class="test-timer" id="testTimer">
                                        ${this.formatTime(testState.timeRemaining)}
                                    </div>
                                    <div class="test-score">
                                        Skor: <span id="currentScore">0</span>
                                    </div>
                                </div>
                            </div>

                            <div class="question-container" id="questionContainer">
                                <!-- Question will be rendered here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Exit Enhanced Test
     */
    exitTest() {
        if (this.enhancedTestSystem && this.enhancedTestSystem.testEngine) {
            const confirmExit = confirm('Apakah Anda yakin ingin keluar dari test? Progress Anda akan hilang.');
            if (confirmExit) {
                this.enhancedTestSystem.testEngine.pause();
                this.initializeTest();
            }
        } else {
            this.initializeTest();
        }
    }

    /**
     * Initialize Original Test System (Fallback)
     */
    initializeOriginalTest() {
        console.log('Using original test system (fallback)');

        // Initialize test state
        this.testState = {
            questions: [],
            currentQuestionIndex: 0,
            answers: [],
            score: 0,
            isTestCompleted: false,
            selectedTopics: [],
            currentCategory: null
        };

        // Load test data and initialize interface
        this.loadTestData();
        this.renderTestSelection();
    }

    /**
     * Initialize Original Quiz System (Fallback)
     */
    initializeOriginalQuiz() {
        console.log('Using original quiz system (fallback)');

        // Initialize quiz state
        this.quizState = {
            questions: [],
            currentQuestionIndex: 0,
            answers: [],
            score: 0,
            isQuizStarted: false,
            isQuizCompleted: false,
            timeRemaining: 600, // 10 minutes
            timerInterval: null,
            startTime: null,
            endTime: null
        };

        // Load quiz data and initialize interface
        this.loadQuizQuestions();
        this.initializeQuiz();
    }

    /**
     * Get user total tests
     */
    getUserTotalTests() {
        return Object.keys(this.userData.scores || {}).length;
    }

    /**
     * Get user average score
     */
    getUserAverageScore() {
        const scores = Object.values(this.userData.scores || {});
        if (scores.length === 0) return 0;
        const total = scores.reduce((sum, score) => sum + (score.score || 0), 0);
        return Math.round(total / scores.length);
    }

    /**
     * Get user best score
     */
    getUserBestScore() {
        const scores = Object.values(this.userData.scores || {});
        if (scores.length === 0) return 0;
        return Math.max(...scores.map(score => score.score || 0));
    }

    /**
     * Get user current streak
     */
    getUserStreak() {
        // This would need to be implemented based on user test history
        return this.userData.currentStreak || 0;
    }

    /**
     * Format time display
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize app when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing MPI App...');
    window.mpiApp = new MPIApp();

    // Initialize Unified Quiz System after app is ready
    setTimeout(() => {
        if (window.mpiApp && window.unifiedQuizSystem) {
            window.mpiApp.unifiedQuizSystem = window.unifiedQuizSystem;
            console.log('Unified Quiz System integrated with main app');
            console.log('Unified Quiz System available:', window.mpiApp.unifiedQuizSystem);
        } else {
            console.warn('Unified Quiz System not available, will use fallback');
        }
    }, 1500);
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, initializing MPI App immediately...');
    window.mpiApp = new MPIApp();
}