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
        const finalScore = this.userData.scores.final;

        if (certificateStatus) {
            if (finalScore >= 70) {
                certificateStatus.textContent = 'Available';
                certificateStatus.classList.remove('locked');
                certificateStatus.classList.add('available');
            } else {
                certificateStatus.textContent = 'Locked';
                certificateStatus.classList.add('locked');
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
            case 'test':
                this.loadTestPage(contentPages);
                break;
            case 'quiz':
                this.loadQuizPage(contentPages);
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
                <header class="page-header">
                    <div class="container">
                        <button class="btn-back">← Kembali</button>
                        <h1>Tujujuan Pembelajaran</h1>
                    </div>
                </header>
                <main class="page-content">
                    <div class="container">
                        <div class="objectives-intro">
                            <h2>Kompetensi Dasar Jaringan Komputer</h2>
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
                <header class="page-header">
                    <div class="container">
                        <button class="btn-back">← Kembali</button>
                        <h1>Materi Pembelajaran</h1>
                    </div>
                </header>
                <main class="page-content">
                    <div class="container">
                        <!-- Materials Hero Section -->
                        <div class="materials-hero">
                            <h2>Jelajahi Dunia Jaringan Komputer</h2>
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
                </header>
                <main class="page-content">
                    <div class="test-content">
                        <p>Halaman Test Pengetahuan sedang dalam pengembangan...</p>
                    </div>
                </main>
            </div>
        `;
        this.initializeTest();
    }

    /**
     * Load quiz page
     */
    loadQuizPage(container) {
        container.innerHTML = `
            <div class="page quiz-page">
                <header class="page-header">
                    <button class="btn-back">← Kembali</button>
                    <h1>Kuis</h1>
                </header>
                <main class="page-content">
                    <div class="quiz-content">
                        <p>Halaman Kuis sedang dalam pengembangan...</p>
                    </div>
                </main>
            </div>
        `;
        this.initializeQuiz();
    }

    /**
     * Load certificate page
     */
    loadCertificatePage(container) {
        container.innerHTML = `
            <div class="page certificate-page">
                <header class="page-header">
                    <button class="btn-back">← Kembali</button>
                    <h1>Sertifikat</h1>
                </header>
                <main class="page-content">
                    <div class="certificate-content">
                        <p>Halaman Sertifikat sedang dalam pengembangan...</p>
                    </div>
                </main>
            </div>
        `;
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
                        <div style="text-align: center; padding: 2rem;">
                            <h2 style="color: var(--color-primary); margin-bottom: 1rem;">Media Pembelajaran Interaktif</h2>
                            <p style="color: var(--color-light-dimmed); margin-bottom: 1rem;">Jaringan Dasar - SMK TKJT</p>
                            <p style="color: var(--color-gray); font-size: 0.9rem;">Version 1.0.0</p>
                            <p style="color: var(--color-gray); font-size: 0.9rem;">© 2024 MPI Development Team</p>
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
    }

    /**
     * Initialize quiz page
     */
    initializeQuiz() {
        console.log('Quiz page initialized');
    }

    /**
     * Initialize certificate page
     */
    initializeCertificate() {
        console.log('Certificate page initialized');
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
    showNotification(message, type = 'error') {
        // Create notification
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification ${type}`;
        notificationDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">
                    ${type === 'error' ? '⚠️' : type === 'success' ? '✅' : '⚡'}
                </span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notificationDiv);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notificationDiv.parentNode) {
                notificationDiv.parentNode.removeChild(notificationDiv);
            }
        }, 3000);
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
}

// Initialize app when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing MPI App...');
    window.mpiApp = new MPIApp();
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, initializing MPI App immediately...');
    window.mpiApp = new MPIApp();
}