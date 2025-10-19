/**
 * Enhanced Test System for MPI - Media Pembelajaran Interaktif
 * Comprehensive Computer Network Practice Testing System
 * Author: Enhanced MPI Development Team
 * Version: 2.0.0
 */

class EnhancedTestSystem {
    constructor(app) {
        this.app = app;
        this.questionBank = new QuestionBank();
        this.testEngine = new TestEngine();
        this.analytics = new TestAnalytics();
        this.adaptiveSystem = new AdaptiveTesting();

        // Test configuration
        this.config = {
            maxQuestionsPerTest: 20,
            passingScore: 70,
            timePerQuestion: 60, // seconds
            adaptiveDifficulty: true,
            enableHints: true,
            enableExplanations: true,
            shuffleQuestions: true,
            shuffleAnswers: true
        };

        this.initializeQuestionBank();
    }

    /**
     * Initialize comprehensive question bank
     */
    async initializeQuestionBank() {
        console.log('📚 Initializing Enhanced Question Bank...');

        // Load external questions and add to practice category
        await this.loadExternalQuestions();

        // Add practice category with external questions
        this.questionBank.addCategory('practice', {
            title: 'Latihan Formatif',
            description: 'Test pengetahuan untuk latihan tanpa tekanan',
            difficulty: 'mixed',
            questions: []
        });

        // Network Fundamentals Questions
        this.questionBank.addCategory('network-basics', {
            title: 'Dasar Jaringan Komputer',
            description: 'Konsep fundamental jaringan',
            difficulty: 'beginner',
            questions: [
                {
                    id: 'nb-001',
                    type: 'multiple-choice',
                    question: 'Apa tujuan utama dari jaringan komputer?',
                    options: [
                        'Hanya untuk internet browsing',
                        'Resource sharing dan komunikasi',
                        'Mengganti komputer lama',
                        'Main game online'
                    ],
                    correctAnswer: 1,
                    explanation: 'Jaringan komputer memungkinkan sharing resource (printer, file) dan komunikasi antar komputer.',
                    difficulty: 'easy',
                    tags: ['konsep-dasar', 'tujuan-jaringan'],
                    points: 10
                },
                {
                    id: 'nb-002',
                    type: 'multiple-choice',
                    question: 'Jaringan yang mencakup area geografis yang kecil seperti satu kantor atau gedung disebut?',
                    options: ['PAN', 'LAN', 'WAN', 'MAN'],
                    correctAnswer: 1,
                    explanation: 'LAN (Local Area Network) adalah jaringan yang mencakup area terbatas seperti kantor atau gedung.',
                    difficulty: 'easy',
                    tags: ['jenis-jaringan', 'LAN'],
                    points: 10
                },
                {
                    id: 'nb-003',
                    type: 'true-false',
                    question: 'WAN (Wide Area Network) mencakup area geografis yang sangat luas seperti antar kota atau negara.',
                    correctAnswer: true,
                    explanation: 'WAN memang digunakan untuk menghubungkan jaringan di area geografis yang sangat luas.',
                    difficulty: 'easy',
                    tags: ['jenis-jaringan', 'WAN'],
                    points: 5
                },
                {
                    id: 'nb-004',
                    type: 'multiple-choice',
                    question: 'Kapan ARPANET, cikal bakal internet, dikembangkan?',
                    options: ['1950', '1969', '1975', '1985'],
                    correctAnswer: 1,
                    explanation: 'ARPANET dikembangkan oleh ARPA (Advanced Research Projects Agency) pada tahun 1969.',
                    difficulty: 'medium',
                    tags: ['sejarah-internet', 'ARPANET'],
                    points: 15
                }
            ]
        });

        // Network Topology Questions
        this.questionBank.addCategory('network-topology', {
            title: 'Topologi Jaringan',
            description: 'Berbagai jenis topologi jaringan',
            difficulty: 'intermediate',
            questions: [
                {
                    id: 'nt-001',
                    type: 'multiple-choice',
                    question: 'Dalam topologi Bus, jika satu kabel utama terputus, apa yang akan terjadi?',
                    options: [
                        'Hanya satu node yang terpengaruh',
                        'Seluruh jaringan akan down',
                        'Tidak ada pengaruh',
                        'Hanya 50% node yang terpengaruh'
                    ],
                    correctAnswer: 1,
                    explanation: 'Pada topologi Bus, semua node terhubung ke satu kabel utama. Jika kabel ini putus, seluruh jaringan akan terpengaruh.',
                    difficulty: 'medium',
                    tags: ['topologi-bus', 'troubleshooting'],
                    points: 15
                },
                {
                    id: 'nt-002',
                    type: 'multiple-choice',
                    question: 'Apa keunggulan utama dari topologi Star dibandingkan topologi Bus?',
                    options: [
                        'Lebih murah',
                        'Lebih sedikit kabel',
                        'Lebih reliable dan mudah troubleshooting',
                        'Setup lebih cepat'
                    ],
                    correctAnswer: 2,
                    explanation: 'Topologi Star lebih reliable karena jika satu kabel node putus, hanya node tersebut yang terpengaruh, dan troubleshooting lebih mudah.',
                    difficulty: 'medium',
                    tags: ['topologi-star', 'keunggulan'],
                    points: 15
                },
                {
                    id: 'nt-003',
                    type: 'drag-drop',
                    question: 'Susun komponen topologi Star sesuai hierarkinya:',
                    items: [
                        { id: 'hub', label: 'Hub/Switch' },
                        { id: 'nodes', label: 'Komputer Client' },
                        { id: 'server', label: 'Server' }
                    ],
                    correctOrder: ['server', 'hub', 'nodes'],
                    explanation: 'Dalam topologi Star, server terhubung ke hub/switch, lalu hub/switch terhubung ke komputer client.',
                    difficulty: 'hard',
                    tags: ['topologi-star', 'komponen'],
                    points: 20
                }
            ]
        });

        // OSI Model Questions
        this.questionBank.addCategory('osi-model', {
            title: 'Model OSI & TCP/IP',
            description: 'Layer network dan protokol',
            difficulty: 'intermediate',
            questions: [
                {
                    id: 'osi-001',
                    type: 'multiple-choice',
                    question: 'Layer manakah yang bertanggung jawab untuk routing paket?',
                    options: ['Physical', 'Data Link', 'Network', 'Transport'],
                    correctAnswer: 2,
                    explanation: 'Network Layer (Layer 3) bertanggung jawab untuk routing paket dari source ke destination.',
                    difficulty: 'medium',
                    tags: ['osi-layer', 'network-layer', 'routing'],
                    points: 15
                },
                {
                    id: 'osi-002',
                    type: 'matching',
                    question: 'Cocokkan layer OSI dengan fungsinya:',
                    pairs: [
                        { layer: 'Application', function: 'User interface' },
                        { layer: 'Transport', function: 'End-to-end communication' },
                        { layer: 'Network', function: 'Routing' },
                        { layer: 'Data Link', function: 'Frame error detection' }
                    ],
                    explanation: 'Setiap layer OSI memiliki fungsi spesifik dalam komunikasi data.',
                    difficulty: 'hard',
                    tags: ['osi-layer', 'layer-function'],
                    points: 25
                }
            ]
        });

        // Network Protocols Questions
        this.questionBank.addCategory('network-protocols', {
            title: 'Protokol Jaringan',
            description: 'Berbagai protokol komunikasi',
            difficulty: 'advanced',
            questions: [
                {
                    id: 'np-001',
                    type: 'multiple-choice',
                    question: 'Protokol manakah yang digunakan untuk pengiriman email?',
                    options: ['HTTP', 'FTP', 'SMTP', 'SSH'],
                    correctAnswer: 2,
                    explanation: 'SMTP (Simple Mail Transfer Protocol) digunakan untuk pengiriman email.',
                    difficulty: 'medium',
                    tags: ['protokol', 'email', 'SMTP'],
                    points: 15
                },
                {
                    id: 'np-002',
                    type: 'fill-blank',
                    question: 'Protokol _____ digunakan untuk transfer file secara aman.',
                    answer: 'SFTP',
                    explanation: 'SFTP (SSH File Transfer Protocol) adalah protokol transfer file yang aman.',
                    difficulty: 'medium',
                    tags: ['protokol', 'file-transfer', 'SFTP'],
                    points: 10
                }
            ]
        });

        // Network Security Questions
        this.questionBank.addCategory('network-security', {
            title: 'Keamanan Jaringan',
            description: 'Konsep dan praktik keamanan jaringan',
            difficulty: 'advanced',
            questions: [
                {
                    id: 'ns-001',
                    type: 'multiple-choice',
                    question: 'Apa fungsi utama dari firewall?',
                    options: [
                        'Mempercepat koneksi internet',
                        'Memblokir akses yang tidak sah',
                        'Mengompres file',
                        'Backup data'
                    ],
                    correctAnswer: 1,
                    explanation: 'Firewall berfungsi sebagai sistem keamanan yang memfilter dan memblokir akses yang tidak sah ke jaringan.',
                    difficulty: 'medium',
                    tags: ['keamanan', 'firewall', 'access-control'],
                    points: 15
                },
                {
                    id: 'ns-002',
                    type: 'scenario',
                    question: 'Seorang administrator menemukan ada percobaan login yang mencurigakan dari IP address asing. Langkah apa yang sebaiknya dilakukan?',
                    scenario: 'Pada jam 02:30 pagi, sistem log menunjukkan 100 percobaan login gagal dari IP 192.168.1.100 ke server database.',
                    options: [
                        'Mengabaikan karena mungkin hanya kesalahan sistem',
                        'Memblokir IP tersebut dan melakukan investigasi lebih lanjut',
                        'Mematikan seluruh jaringan',
                        'Mengubah password semua user'
                    ],
                    correctAnswer: 1,
                    explanation: 'Respons yang tepat adalah memblokir IP mencurigakan dan melakukan investigasi untuk mencegah potensi serangan.',
                    difficulty: 'hard',
                    tags: ['keamanan', 'incident-response', 'brute-force'],
                    points: 20
                }
            ]
        });

        console.log('Enhanced Question Bank initialized with', this.questionBank.getTotalQuestions(), 'questions');
    }

    /**
     * Load external questions from JSON file
     */
    async loadExternalQuestions() {
        try {
            console.log('📂 Loading external questions from soal.json...');
            const response = await fetch('data/soal.json');
            if (!response.ok) {
                throw new Error(`Failed to load soal.json: ${response.status}`);
            }

            const data = await response.json();
            console.log('📋 External data loaded:', data);

            // Process test_pengetahuan questions
            if (data.test_pengetahuan && Array.isArray(data.test_pengetahuan)) {
                const practiceQuestions = data.test_pengetahuan.map(q => this.normalizeQuestionData(q, 'test_pengetahuan'));

                // Add practice questions to the practice category
                this.questionBank.addCategory('practice', {
                    title: 'Latihan Formatif',
                    description: 'Test pengetahuan untuk latihan tanpa tekanan',
                    difficulty: 'mixed',
                    questions: practiceQuestions
                });

                console.log(`✅ Loaded ${practiceQuestions.length} practice questions from external file`);
            }

            // Process quiz_akhir questions if they exist
            if (data.quiz_akhir && Array.isArray(data.quiz_akhir)) {
                const quizQuestions = data.quiz_akhir.map(q => this.normalizeQuestionData(q, 'quiz_akhir'));

                this.questionBank.addCategory('quiz-akhir', {
                    title: 'Quiz Akhir',
                    description: 'Evaluasi akhir pembelajaran',
                    difficulty: 'mixed',
                    questions: quizQuestions
                });

                console.log(`✅ Loaded ${quizQuestions.length} quiz questions from external file`);
            }

            // Process soal_komprehensif questions if they exist
            if (data.soal_komprehensif && Array.isArray(data.soal_komprehensif)) {
                const comprehensiveQuestions = data.soal_komprehensif.map(q => this.normalizeQuestionData(q, 'soal_komprehensif'));

                this.questionBank.addCategory('komprehensif', {
                    title: 'Soal Komprehensif',
                    description: 'Tes komprehensif jaringan komputer',
                    difficulty: 'advanced',
                    questions: comprehensiveQuestions
                });

                console.log(`✅ Loaded ${comprehensiveQuestions.length} comprehensive questions from external file`);
            }

        } catch (error) {
            console.error('❌ Error loading external questions:', error);
            console.log('⚠️ Using built-in questions as fallback');
        }
    }

    /**
     * Normalize question data from external JSON to internal format
     */
    normalizeQuestionData(question, category) {
        // Handle different data structures and ensure compatibility
        const normalized = {
            id: question.id || `external_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            type: question.type || 'multiple-choice',
            pertanyaan: question.pertanyaan || question.question || 'No question text',
            question: question.pertanyaan || question.question || 'No question text', // Keep both for compatibility
            options: question.options || [],
            correctAnswer: question.jawaban_benar !== undefined ? question.jawaban_benar :
                         question.correctAnswer !== undefined ? question.correctAnswer : 0,
            jawaban_benar: question.jawaban_benar !== undefined ? question.jawaban_benar :
                         question.correctAnswer !== undefined ? question.correctAnswer : 0, // Keep both for compatibility
            explanation: question.penjelasan || question.explanation || 'No explanation available',
            difficulty: question.difficulty || 'medium',
            points: question.points || 10,
            category: category,
            tags: question.tags || [],
            bab: question.bab || ''
        };

        console.log('Normalized question:', normalized);
        return normalized;
    }

    /**
     * Start comprehensive test session
     */
    async startTestSession(options = {}) {
        const testConfig = {
            category: options.category || 'mixed',
            difficulty: options.difficulty || 'mixed',
            questionCount: options.questionCount || this.config.maxQuestionsPerTest,
            timeLimit: options.timeLimit || (this.config.timePerQuestion * options.questionCount),
            adaptiveMode: options.adaptiveMode || this.config.adaptiveDifficulty,
            enableHints: options.enableHints !== undefined ? options.enableHints : this.config.enableHints,
            enableExplanations: options.enableExplanations !== undefined ? options.enableExplanations : this.config.enableExplanations,
            mode: options.mode || 'test'
        };

        // Generate test questions
        const questions = await this.generateTestQuestions(testConfig);

        // Create the test interface in the DOM
        this.createTestInterface(testConfig, questions);

        // Initialize test engine
        this.testEngine.initialize({
            questions: questions,
            config: testConfig,
            onQuestionAnswered: this.handleQuestionAnswered.bind(this),
            onTestCompleted: this.handleTestCompleted.bind(this),
            onTimeUpdated: this.handleTimeUpdated.bind(this)
        });

        // Start the test
        this.testEngine.start();

        // Log analytics
        this.analytics.trackTestStart(testConfig);

        return this.testEngine.getState();
    }

    /**
     * Create the test interface in the DOM
     */
    createTestInterface(config, questions) {
        const contentPages = document.getElementById('contentPages');
        if (!contentPages) {
            throw new Error('Content pages container not found');
        }

        const isPractice = config.mode === 'practice';
        const title = isPractice ? 'Latihan Formatif' : 'Test Komprehensif';
        const subtitle = config.category === 'practice' ? 'Latihan soal untuk meningkatkan pemahaman' : 'Evaluasi pengetahuan jaringan komputer';

        const timerInfo = config.timeLimit > 0 ? `
            <div class="quiz-timer" id="testTimer">${this.formatTime(config.timeLimit)}</div>
        ` : `
            <div class="quiz-timer unlimited">Tanpa Batas Waktu</div>
        `;

        contentPages.innerHTML = `
            <div class="page" data-page="test">
                ${this.generatePageHeader(title, subtitle, true, 'window.enhancedTestSystem.exitTest()', timerInfo)}

                <div class="page-content">
                    <div class="container">
                        <div class="enhanced-quiz-container">
                            <!-- Quiz Header -->
                            <div class="quiz-header">
                                <div class="quiz-info">
                                    <div class="quiz-title">${title} - ${config.category}</div>
                                    <div class="quiz-meta">
                                        <span class="question-count">
                                            Soal <span id="currentQuestionNumber">1</span> dari <span id="totalQuestions">${questions.length}</span>
                                        </span>
                                        <div class="quiz-timer" id="testTimer">
                                            ${config.timeLimit > 0 ? this.formatTime(config.timeLimit) : 'Tanpa Batas Waktu'}
                                        </div>
                                    </div>
                                </div>
                                <div class="quiz-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="quizProgressFill" style="width: 0%"></div>
                                    </div>
                                    <span class="progress-text" id="quizProgressText">0%</span>
                                </div>
                            </div>

                            <!-- Question Indicators -->
                            <div class="question-indicators" id="questionIndicators">
                                ${this.generateQuestionIndicators()}
                            </div>

                            <!-- Question Container -->
                            <div class="question-container" id="questionContainer">
                                <!-- Question will be rendered here -->
                            </div>

                            <!-- Navigation -->
                            <div class="quiz-navigation">
                                <button class="btn btn-secondary" id="btnPrevQuestion" onclick="window.enhancedTestSystem.testEngine.previousQuestion()" disabled>
                                    ← Sebelumnya
                                </button>

                                <div class="navigation-info">
                                    <span id="navigationStatus">Pilih jawaban untuk melanjutkan</span>
                                </div>

                                <button class="btn btn-primary" id="btnNextQuestion" onclick="window.enhancedTestSystem.testEngine.nextQuestion()" disabled>
                                    Selanjutnya →
                                </button>
                            </div>

                            <!-- Action Buttons -->
                            <div class="quiz-actions">
                                <button class="btn btn-outline" onclick="window.enhancedTestSystem.clearCurrentAnswer()">
                                    Hapus Jawaban
                                </button>
                                <button class="btn btn-success" id="btnSubmitTest" onclick="window.enhancedTestSystem.submitTest()" style="display: none;">
                                    Selesai & Lihat Hasil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize question indicators
        this.updateIndicators();
    }

    /**
     * Update question indicators
     */
    updateIndicators() {
        const questionIndicators = document.getElementById('questionIndicators');
        if (questionIndicators && this.testEngine && this.testEngine.state.questions) {
            questionIndicators.innerHTML = this.generateQuestionIndicators();
        }
    }

    /**
     * Generate question indicators for the test interface
     */
    generateQuestionIndicators() {
        if (!this.testEngine || !this.testEngine.state.questions) {
            return '<div class="no-questions">No questions available</div>';
        }

        return this.testEngine.state.questions.map((_, index) => {
            const isAnswered = this.testEngine.state.answers[index] !== null;
            const isCurrent = index === this.testEngine.state.currentQuestionIndex;

            // Check if answer is correct (for answered questions)
            let isCorrect = null;
            if (isAnswered && this.testEngine.state.questions[index]) {
                const question = this.testEngine.state.questions[index];
                isCorrect = this.testEngine.state.answers[index] === question.correctAnswer;
            }

            let className = 'indicator';
            if (isCurrent) className += ' current';
            else if (isAnswered) {
                className += isCorrect ? ' correct' : ' incorrect';
            }

            return `<div class="${className}" data-index="${index}" onclick="window.enhancedTestSystem.testEngine.goToQuestion(${index})">${index + 1}</div>`;
        }).join('');
    }

    /**
     * Clear current answer
     */
    clearCurrentAnswer() {
        if (this.testEngine && this.testEngine.state.questions.length > 0) {
            const currentIndex = this.testEngine.state.currentQuestionIndex;
            this.testEngine.state.answers[currentIndex] = null;
            this.testEngine.renderCurrentQuestion();
        }
    }

    /**
     * Submit test
     */
    submitTest() {
        if (this.testEngine) {
            this.testEngine.completeTest();
        }
    }

    /**
     * Generate consistent page header (using main app method if available)
     */
    generatePageHeader(title, subtitle = '', showBackButton = true, backAction = null, extraInfo = '') {
        // Use main app's header generator if available
        if (this.app && this.app.generatePageHeader) {
            return this.app.generatePageHeader(title, subtitle, showBackButton, backAction, extraInfo);
        }

        // Fallback header generation
        const backButtonText = backAction ? '← Kembali' : '← Kembali';
        const backClickHandler = backAction || 'window.enhancedTestSystem.exitTest()';

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
     * Generate consistent header for test pages
     */
    generateConsistentHeader(config, isPractice) {
        const title = isPractice ? 'Latihan Formatif' : 'Test Komprehensif';
        const subtitle = config.category === 'practice' ? 'Latihan soal untuk meningkatkan pemahaman' : 'Evaluasi pengetahuan jaringan komputer';

        const timerInfo = config.timeLimit > 0 ? `
            <div class="timer-display">
                <svg viewBox="0 0 24 24">
                    <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"/>
                </svg>
                <span id="testTimer">${this.formatTime(config.timeLimit)}</span>
            </div>
        ` : `
            <div class="timer-display unlimited">
                <svg viewBox="0 0 24 24">
                    <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8Z"/>
                </svg>
                <span>Tanpa Batas Waktu</span>
            </div>
        `;

        return `
            <header class="page-header test-page-header">
                <div class="container">
                    <div class="header-content">
                        <div class="header-left">
                            <button class="btn-back" onclick="window.enhancedTestSystem.exitTest()">
                                <svg viewBox="0 0 24 24" class="back-icon">
                                    <path d="M20,11V13H8L13.5,18.5L12.08,17.08L7.5,12.5L12.08,7.92L13.5,9.34L8,13H20Z"/>
                                </svg>
                                Keluar
                            </button>
                        </div>
                        <div class="header-center">
                            <h1 class="page-title">${title}</h1>
                            <p class="page-subtitle">${subtitle}</p>
                        </div>
                        <div class="header-right">
                            <div class="test-timer" id="testTimerContainer">
                                ${timerInfo}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    /**
     * Format time display
     */
    formatTime(seconds) {
        if (seconds <= 0) return '00:00';
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Exit test and return to evaluasi page
     */
    exitTest() {
        // Use main app's confirm dialog if available
        if (this.app && this.app.showConfirmDialog) {
            this.app.showConfirmDialog(
                'Keluar dari Test',
                'Apakah Anda yakin ingin keluar dari test? Progress yang telah dicapai akan hilang.',
                'Batal',
                'Keluar',
                () => {
                    if (this.app && this.app.loadEvaluasiPage) {
                        this.app.loadEvaluasiPage(document.getElementById('contentPages'));
                    } else {
                        // Fallback: try to navigate back
                        window.history.back();
                    }
                }
            );
        } else {
            // Fallback to standard confirm
            if (confirm('Apakah Anda yakin ingin keluar dari test? Progress yang telah dicapai akan hilang.')) {
                if (this.app && this.app.loadEvaluasiPage) {
                    this.app.loadEvaluasiPage(document.getElementById('contentPages'));
                } else {
                    // Fallback: try to navigate back
                    window.history.back();
                }
            }
        }
    }

    /**
     * Generate test questions based on configuration
     */
    async generateTestQuestions(config) {
        console.log('🔍 Generating test questions with config:', config);
        let questions = [];

        // Ensure external questions are loaded
        await this.loadExternalQuestions();

        // Special handling for practice category - check if external questions are loaded
        if (config.category === 'practice') {
            console.log('📚 Processing practice category...');
            const practiceQuestions = this.questionBank.getQuestionsByCategory('practice');
            console.log(`Found ${practiceQuestions.length} practice questions in bank`);

            if (practiceQuestions.length === 0) {
                console.warn('⚠️ No practice questions found in bank, trying to load from built-in categories...');
                // If no practice questions loaded, use built-in questions
                const builtInCategories = ['network-basics', 'network-topology', 'osi-model'];
                builtInCategories.forEach(category => {
                    if (questions.length < config.questionCount) {
                        const categoryQuestions = this.questionBank.getQuestionsByCategory(category);
                        console.log(`Adding ${categoryQuestions.length} questions from ${category}`);
                        questions = questions.concat(categoryQuestions);
                    }
                });
            } else {
                // Use loaded practice questions
                questions = practiceQuestions;
                console.log(`Using ${questions.length} loaded practice questions`);
            }
        } else if (config.category === 'mixed') {
            // Get questions from all categories
            const allCategories = this.questionBank.getAllCategories();
            console.log('Available categories:', allCategories);

            // Filter out the empty practice category for mixed tests
            const categoriesToUse = allCategories.filter(cat => {
                if (cat === 'practice') {
                    const catQuestions = this.questionBank.getQuestionsByCategory(cat);
                    return catQuestions.length > 0; // Only include if has questions
                }
                return true;
            });

            categoriesToUse.forEach(category => {
                console.log(`Processing category: ${category}`);
                const categoryQuestions = this.questionBank.getQuestionsByCategory(
                    category,
                    config.difficulty !== 'mixed' ? config.difficulty : null
                );
                console.log(`Found ${categoryQuestions.length} questions in category ${category}`);
                questions = questions.concat(categoryQuestions);
            });
        } else {
            // Get questions from specific category
            console.log(`Getting questions from category: ${config.category}`);
            questions = this.questionBank.getQuestionsByCategory(
                config.category,
                config.difficulty !== 'mixed' ? config.difficulty : null
            );
            console.log(`Found ${questions.length} questions in category ${config.category}`);
        }

        console.log(`Total questions before filtering: ${questions.length}`);

        // Ensure we have some questions
        if (!questions || questions.length === 0) {
            console.error('❌ No questions found in specified categories, using fallback...');
            const fallbackQuestions = this.getFallbackQuestions();
            if (fallbackQuestions.length > 0) {
                questions = fallbackQuestions;
                console.log(`Using ${fallbackQuestions.length} fallback questions`);
            } else {
                console.error('❌ No fallback questions available!');
                // Create emergency fallback questions
                questions = this.createEmergencyFallbackQuestions();
                console.log(`Created ${questions.length} emergency fallback questions`);
            }
        }

        // Apply adaptive selection if enabled
        if (config.adaptiveMode) {
            questions = this.adaptiveSystem.selectQuestions(questions, config.questionCount);
        } else {
            // Random selection
            questions = this.shuffleArray(questions).slice(0, config.questionCount);
        }

        // Shuffle answers if enabled
        if (this.config.shuffleAnswers) {
            questions = questions.map(q => this.shuffleQuestionAnswers(q));
        }

        console.log(`Final questions count: ${questions.length}`);

        // Final validation
        if (!questions || questions.length === 0) {
            console.error('❌ CRITICAL: No questions available even after fallback!');
            throw new Error('No questions available for test');
        }

        console.log('Questions sample:', questions.slice(0, 2));
        return questions;
    }

    /**
     * Get fallback questions when main questions fail to load
     */
    getFallbackQuestions() {
        console.log('🚨 Getting fallback questions...');

        // Try to return built-in questions from question bank
        const builtInQuestions = [];

        const allCategories = this.questionBank.getAllCategories();
        allCategories.forEach(category => {
            const categoryQuestions = this.questionBank.getQuestionsByCategory(category);
            if (categoryQuestions && categoryQuestions.length > 0) {
                builtInQuestions.push(...categoryQuestions);
            }
        });

        console.log(`Fallback: ${builtInQuestions.length} questions available`);
        return builtInQuestions;
    }

    /**
     * Create emergency fallback questions when no questions are available at all
     */
    createEmergencyFallbackQuestions() {
        console.log('🚨 Creating emergency fallback questions...');

        return [
            {
                id: 'emergency-001',
                type: 'multiple-choice',
                question: 'Apa tujuan utama dari jaringan komputer?',
                options: [
                    'Hanya untuk internet browsing',
                    'Resource sharing dan komunikasi',
                    'Mengganti komputer lama',
                    'Main game online'
                ],
                correctAnswer: 1,
                explanation: 'Jaringan komputer memungkinkan sharing resource (printer, file) dan komunikasi antar komputer.',
                difficulty: 'easy',
                points: 10
            },
            {
                id: 'emergency-002',
                type: 'multiple-choice',
                question: 'Jaringan yang mencakup area geografis yang kecil seperti satu kantor atau gedung disebut?',
                options: ['PAN', 'LAN', 'WAN', 'MAN'],
                correctAnswer: 1,
                explanation: 'LAN (Local Area Network) adalah jaringan yang mencakup area terbatas seperti kantor atau gedung.',
                difficulty: 'easy',
                points: 10
            },
            {
                id: 'emergency-003',
                type: 'multiple-choice',
                question: 'Layer manakah yang bertanggung jawab untuk routing paket dalam model OSI?',
                options: ['Physical', 'Data Link', 'Network', 'Transport'],
                correctAnswer: 2,
                explanation: 'Network Layer (Layer 3) bertanggung jawab untuk routing paket dari source ke destination.',
                difficulty: 'medium',
                points: 15
            },
            {
                id: 'emergency-004',
                type: 'multiple-choice',
                question: 'Apa fungsi utama dari firewall dalam jaringan?',
                options: [
                    'Mempercepat koneksi internet',
                    'Memblokir akses yang tidak sah',
                    'Mengompres file',
                    'Backup data'
                ],
                correctAnswer: 1,
                explanation: 'Firewall berfungsi sebagai sistem keamanan yang memfilter dan memblokir akses yang tidak sah ke jaringan.',
                difficulty: 'medium',
                points: 15
            },
            {
                id: 'emergency-005',
                type: 'true-false',
                question: 'WAN (Wide Area Network) mencakup area geografis yang sangat luas seperti antar kota atau negara.',
                correctAnswer: true,
                explanation: 'WAN memang digunakan untuk menghubungkan jaringan di area geografis yang sangat luas.',
                difficulty: 'easy',
                points: 5
            }
        ];
    }

    /**
     * Handle question answered event
     */
    handleQuestionAnswered(questionId, answer, isCorrect, timeSpent) {
        // Update analytics
        this.analytics.trackQuestionAnswer(questionId, answer, isCorrect, timeSpent);

        // Adaptive difficulty adjustment
        if (this.testEngine.config.adaptiveMode) {
            this.adaptiveSystem.adjustDifficulty(isCorrect, timeSpent);
        }

        // Save to user progress
        this.app.userData.testProgress = this.app.userData.testProgress || {};
        this.app.userData.testProgress[questionId] = {
            answer: answer,
            isCorrect: isCorrect,
            timeSpent: timeSpent,
            timestamp: new Date().toISOString()
        };
        this.app.saveUserData();
    }

    /**
     * Handle test completed event
     */
    handleTestCompleted(results) {
        // Calculate final analytics
        const analytics = this.analytics.generateTestReport(results);

        // Update user scores
        if (this.app) {
            this.app.userData.scores = this.app.userData.scores || {};
            this.app.userData.scores[this.testEngine.config.category || 'mixed'] = analytics;
            this.app.saveUserData();
        }

        // Check for achievements
        this.checkAchievements(analytics);

        // Generate certificate if passed
        if (analytics.score >= this.config.passingScore) {
            this.generateCertificate(analytics);
        }

        // Show results
        this.renderTestResults(results, analytics);

        return analytics;
    }

    /**
     * Render test results
     */
    renderTestResults(results, analytics) {
        const contentPages = document.getElementById('contentPages');
        if (!contentPages) return;

        const isPractice = this.testEngine.config.mode === 'practice';
        const passed = analytics.score >= this.config.passingScore;

        const title = passed ? '🎉 Selamat! Anda Lulus' : '💪 Belum Lulus, Coba Lagi!';
        const subtitle = isPractice ? 'Hasil Latihan Formatif' : 'Hasil Test Komprehensif';
        const resultIcon = passed ? '🏆' : '📚';
        const extraInfo = `<div class="result-icon ${passed ? 'passed' : 'failed'}">${resultIcon}</div>`;

        contentPages.innerHTML = `
            <div class="page" data-page="test-results">
                ${this.generatePageHeader(title, subtitle, true, 'window.enhancedTestSystem.exitTest()', extraInfo)}

                <div class="page-content">
                    <div class="container">
                        <div class="quiz-results-container">
                            <div class="results-header">
                                <div class="score-display ${passed ? 'passed' : 'failed'}">
                                    <div class="score-circle">
                                        <span class="score-value">${analytics.score}%</span>
                                    </div>
                                    <h2>${passed ? '🎉 Selamat! Anda Lulus' : '💪 Belum Lulus, Coba Lagi!'}</h2>
                                    <p>${passed ? 'Prestasi yang sangat baik!' : 'Terus belajar dan coba lagi.'}</p>
                                </div>
                            </div>

                            <div class="results-stats">
                                <div class="stat-grid">
                                    <div class="stat-item">
                                        <div class="stat-value">${results.correctAnswers}</div>
                                        <div class="stat-label">Jawaban Benar</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${results.totalQuestions}</div>
                                        <div class="stat-label">Total Soal</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${Math.round(results.timeSpent / 60)}:${(results.timeSpent % 60).toString().padStart(2, '0')}</div>
                                        <div class="stat-label">Waktu Pengerjaan</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${analytics.score}%</div>
                                        <div class="stat-label">Skor Akhir</div>
                                    </div>
                                </div>
                            </div>

                            ${analytics.recommendations && analytics.recommendations.length > 0 ? `
                                <div class="recommendations">
                                    <h3>Rekomendasi Pembelajaran</h3>
                                    ${analytics.recommendations.map(rec => `
                                        <div class="recommendation-item ${rec.priority}">
                                            <div class="recommendation-icon">${rec.priority === 'high' ? '⚠️' : rec.priority === 'medium' ? '💡' : '✅'}</div>
                                            <div class="recommendation-content">
                                                <h4>${rec.type === 'study-more' ? 'Perlu Belajar Lebih Giat' : rec.type === 'practice-more' ? 'Latihan Lebih Banyak' : 'Siap untuk Tingkat Lanjut'}</h4>
                                                <p>${rec.message}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}

                            <div class="results-actions">
                                ${!isPractice && !passed ? `
                                    <button class="btn btn-primary" onclick="window.enhancedTestSystem.retaketest()">
                                        Coba Lagi
                                    </button>
                                ` : ''}

                                <button class="btn btn-secondary" onclick="window.enhancedTestSystem.reviewAnswers()">
                                    Lihat Jawaban
                                </button>

                                ${passed && !isPractice ? `
                                    <button class="btn btn-success" onclick="window.enhancedTestSystem.downloadCertificate()">
                                        Unduh Sertifikat
                                    </button>
                                ` : ''}

                                <button class="btn btn-outline" onclick="window.enhancedTestSystem.exitTest()">
                                    Kembali ke Menu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get score label based on percentage
     */
    getScoreLabel(score) {
        if (score >= 90) return 'Luar Biasa!';
        if (score >= 80) return 'Sangat Baik!';
        if (score >= 70) return 'Baik!';
        if (score >= 60) return 'Cukup';
        return 'Perlu Perbaikan';
    }

    /**
     * Get achievements for score
     */
    getAchievementsForScore(analytics) {
        const achievements = [
            {
                id: 'perfect-score',
                title: 'Skor Sempurna',
                description: 'Jawaban benar 100%',
                icon: '🏆',
                earned: analytics.score === 100
            },
            {
                id: 'speed-demon',
                title: 'Kecepatan Tinggi',
                description: 'Rata-rata waktu < 30 detik',
                icon: '⚡',
                earned: analytics.averageTimePerQuestion < 30
            },
            {
                id: 'hot-streak',
                title: 'Hot Streak',
                description: `${analytics.correctStreak} jawaban benar berturut-turut`,
                icon: '🔥',
                earned: analytics.correctStreak >= 5
            },
            {
                id: 'persistent',
                title: 'Pantang Menyerah',
                description: 'Menyelesaikan semua soal',
                icon: '💪',
                earned: analytics.correctAnswers === analytics.totalQuestions
            }
        ];

        return achievements;
    }

    /**
     * Review all answers
     */
    reviewAnswers() {
        // This would show a detailed review of all answers
        alert('Fitur review detail akan segera tersedia!');
    }

    /**
     * Review specific question
     */
    reviewQuestion(index) {
        // This would show a specific question review
        console.log('Review question:', index);
    }

    /**
     * Download certificate
     */
    downloadCertificate() {
        alert('Fitur unduh sertifikat akan segera tersedia!');
    }

    /**
     * Retake test
     */
    retaketest() {
        if (confirm('Apakah Anda ingin mengulang test ini?')) {
            // Restart the test with same configuration
            this.startTestSession(this.testEngine.config);
        }
    }

    /**
     * Handle time updated event
     */
    handleTimeUpdated(timeRemaining) {
        // Update UI with remaining time
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Update timer in UI
        const timerElement = document.getElementById('testTimer');
        if (timerElement) {
            timerElement.textContent = timeDisplay;

            // Add warning class if time is running low
            if (timeRemaining <= 60) {
                timerElement.classList.add('warning');
            }
        }

        // Auto-submit if time runs out
        if (timeRemaining <= 0) {
            this.testEngine.submit();
        }
    }

    /**
     * Check for user achievements
     */
    checkAchievements(analytics) {
        const achievements = [];

        // Perfect score achievement
        if (analytics.score === 100) {
            achievements.push({
                id: 'perfect-score',
                title: 'Skor Sempurna!',
                description: 'Jawaban benar 100%',
                icon: '🏆'
            });
        }

        // Speed achievement
        if (analytics.averageTimePerQuestion < 30) {
            achievements.push({
                id: 'speed-demon',
                title: 'Kecepatan Tinggi',
                description: 'Rata-rata waktu menjawab < 30 detik',
                icon: '⚡'
            });
        }

        // Streak achievement
        if (analytics.correctStreak >= 5) {
            achievements.push({
                id: 'hot-streak',
                title: 'Hot Streak!',
                description: `${analytics.correctStreak} jawaban benar berturut-turut`,
                icon: '🔥'
            });
        }

        // Store achievements
        if (achievements.length > 0) {
            this.app.userData.achievements = this.app.userData.achievements || [];
            achievements.forEach(achievement => {
                if (!this.app.userData.achievements.find(a => a.id === achievement.id)) {
                    this.app.userData.achievements.push({
                        ...achievement,
                        earnedAt: new Date().toISOString()
                    });
                }
            });
            this.app.saveUserData();
        }

        return achievements;
    }

    /**
     * Generate certificate for passed test
     */
    generateCertificate(analytics) {
        const certificate = {
            id: `cert_${Date.now()}`,
            studentName: this.app.studentName,
            testCategory: this.testEngine.config.category || 'Mixed',
            score: analytics.score,
            date: new Date().toLocaleDateString('id-ID'),
            certificateId: this.generateCertificateId(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID') // 1 year validity
        };

        // Store certificate
        this.app.userData.certificates = this.app.userData.certificates || {};
        this.app.userData.certificates[certificate.id] = certificate;
        this.app.saveUserData();

        return certificate;
    }

    /**
     * Generate unique certificate ID
     */
    generateCertificateId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `MPI-${result}`;
    }

    /**
     * Utility function to shuffle array
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
     * Shuffle question answers while tracking correct answer
     */
    shuffleQuestionAnswers(question) {
        if (!question.options || question.type !== 'multiple-choice') {
            return question;
        }

        const shuffledQuestion = { ...question };
        const optionsWithIndex = question.options.map((option, index) => ({
            text: option,
            isCorrect: index === question.correctAnswer
        }));

        // Shuffle options
        const shuffledOptions = this.shuffleArray(optionsWithIndex);

        // Update question with shuffled options and new correct answer index
        shuffledQuestion.options = shuffledOptions.map(opt => opt.text);
        shuffledQuestion.correctAnswer = shuffledOptions.findIndex(opt => opt.isCorrect);

        return shuffledQuestion;
    }
}

/**
 * Question Bank Management
 */
class QuestionBank {
    constructor() {
        this.categories = new Map();
        this.questions = new Map();
    }

    addCategory(categoryId, categoryData) {
        this.categories.set(categoryId, categoryData);
        this.updateQuestionsForCategory(categoryId);
    }

    /**
     * Update questions map for a specific category
     */
    updateQuestionsForCategory(categoryId) {
        const categoryData = this.categories.get(categoryId);
        if (categoryData && categoryData.questions) {
            categoryData.questions.forEach(question => {
                this.questions.set(question.id, {
                    ...question,
                    category: categoryId
                });
            });
        }
    }

    /**
     * Update questions for existing category
     */
    updateCategoryQuestions(categoryId, questions) {
        const categoryData = this.categories.get(categoryId);
        if (categoryData) {
            categoryData.questions = questions;
            this.updateQuestionsForCategory(categoryId);
            console.log(`✅ Updated ${questions.length} questions for category: ${categoryId}`);
        }
    }

    getQuestionsByCategory(category, difficulty = null) {
        const categoryData = this.categories.get(category);
        if (!categoryData) return [];

        let questions = categoryData.questions;

        if (difficulty) {
            questions = questions.filter(q => q.difficulty === difficulty);
        }

        return questions;
    }

    getAllCategories() {
        return Array.from(this.categories.keys());
    }

    getTotalQuestions() {
        return this.questions.size;
    }

    getQuestionById(questionId) {
        return this.questions.get(questionId);
    }
}

/**
 * Test Engine Core
 */
class TestEngine {
    constructor() {
        this.state = {
            isRunning: false,
            isPaused: false,
            isCompleted: false,
            currentQuestionIndex: 0,
            questions: [],
            answers: [],
            score: 0,
            timeRemaining: 0,
            startTime: null,
            endTime: null,
            config: {}
        };

        this.callbacks = {
            onQuestionAnswered: null,
            onTestCompleted: null,
            onTimeUpdated: null
        };

        this.timerInterval = null;
    }

    initialize(config) {
        this.state.questions = config.questions;
        this.state.config = config.config;
        this.state.timeRemaining = config.config.timeLimit;
        this.state.answers = new Array(config.questions.length).fill(null);
        this.state.score = 0;
        this.state.currentQuestionIndex = 0;
        this.state.isCompleted = false;
        this.state.isRunning = false;

        this.callbacks = {
            onQuestionAnswered: config.onQuestionAnswered,
            onTestCompleted: config.onTestCompleted,
            onTimeUpdated: config.onTimeUpdated
        };
    }

    start() {
        this.state.isRunning = true;
        this.state.startTime = new Date();
        this.startTimer();
        this.renderCurrentQuestion();
    }

    pause() {
        this.state.isPaused = true;
        this.stopTimer();
    }

    resume() {
        this.state.isPaused = false;
        this.startTimer();
    }

    submit() {
        this.completeTest();
    }

    answerQuestion(answerIndex) {
        if (this.state.isCompleted) return;

        // Validate answer index
        if (typeof answerIndex !== 'number' || answerIndex < 0) {
            console.error('❌ Invalid answer index:', answerIndex);
            return;
        }

        // Comprehensive validation before accessing question
        if (!this.state.questions || !Array.isArray(this.state.questions)) {
            console.error('❌ No questions available in test state');
            return;
        }

        if (this.state.currentQuestionIndex < 0 || this.state.currentQuestionIndex >= this.state.questions.length) {
            console.error('❌ Invalid question index:', this.state.currentQuestionIndex);
            console.error('Available questions:', this.state.questions.length);
            return;
        }

        const currentQuestion = this.state.questions[this.state.currentQuestionIndex];

        // Additional validation for question object
        if (!currentQuestion || typeof currentQuestion !== 'object') {
            console.error('❌ Invalid question object at index:', this.state.currentQuestionIndex);
            return;
        }

        // Normalize correct answer from various data structures
        const normalizedCorrectAnswer = this.normalizeCorrectAnswer(currentQuestion);
        if (normalizedCorrectAnswer !== null) {
            currentQuestion.correctAnswer = normalizedCorrectAnswer;
        }

        const isCorrect = answerIndex === currentQuestion.correctAnswer;
        const timeSpent = this.calculateTimeSpent();

        // Store answer
        this.state.answers[this.state.currentQuestionIndex] = answerIndex;
        if (isCorrect) {
            this.state.score += currentQuestion.points || 10;
        }

        // Update UI immediately
        this.updateAnswerUI(answerIndex);

        // Trigger callback
        if (this.callbacks.onQuestionAnswered) {
            this.callbacks.onQuestionAnswered(
                currentQuestion.id,
                answerIndex,
                isCorrect,
                timeSpent
            );
        }

        // Update progress and navigation
        this.updateProgress();
        this.updateIndicators();

        // Auto-navigate to next question
        setTimeout(() => {
            if (this.state.currentQuestionIndex < this.state.questions.length - 1) {
                this.nextQuestion();
            } else {
                // Show submit button on last question
                this.updateProgress();
            }
        }, 300);
    }

    /**
     * Update answer UI without race condition
     */
    updateAnswerUI(answerIndex) {
        try {
            // Clear all selections first
            document.querySelectorAll('.option-card').forEach((option) => {
                option.classList.remove('selected');
                const checkMark = option.querySelector('.option-selected-mark');
                if (checkMark) checkMark.remove();
            });

            // Add selected state to the chosen option
            let selectedOption;
            if (typeof answerIndex === 'boolean') {
                selectedOption = document.querySelector(`.option-card[data-value="${answerIndex}"]`);
            } else {
                selectedOption = document.querySelector(`.option-card[data-index="${answerIndex}"]`);
            }

            if (selectedOption) {
                selectedOption.classList.add('selected');
                // Ensure we don't add duplicate check marks
                if (!selectedOption.querySelector('.option-selected-mark')) {
                    selectedOption.innerHTML += '<div class="option-selected-mark">✓</div>';
                }
                console.log('UI updated for selected option:', selectedOption);
            }
        } catch (error) {
            console.error('Error updating answer UI:', error);
        }
    }

    /**
     * Update indicators in the EnhancedTestSystem
     */
    updateIndicators() {
        if (window.enhancedTestSystem) {
            window.enhancedTestSystem.updateIndicators();
        }
    }

    nextQuestion() {
        if (!this.state.questions || !Array.isArray(this.state.questions)) {
            console.error('❌ No questions available for navigation');
            return;
        }

        if (this.state.currentQuestionIndex < this.state.questions.length - 1) {
            this.state.currentQuestionIndex++;
            console.log('Moving to next question:', this.state.currentQuestionIndex);
            this.renderCurrentQuestion();
        } else {
            console.log('Already at last question, cannot go next');
        }
    }

    previousQuestion() {
        if (!this.state.questions || !Array.isArray(this.state.questions)) {
            console.error('❌ No questions available for navigation');
            return;
        }

        if (this.state.currentQuestionIndex > 0) {
            this.state.currentQuestionIndex--;
            console.log('Moving to previous question:', this.state.currentQuestionIndex);
            this.renderCurrentQuestion();
        } else {
            console.log('Already at first question, cannot go previous');
        }
    }

    goToQuestion(index) {
        if (!this.state.questions || !Array.isArray(this.state.questions)) {
            console.error('❌ No questions available for navigation');
            return;
        }

        if (index >= 0 && index < this.state.questions.length) {
            this.state.currentQuestionIndex = index;
            console.log('Navigating to question:', index);
            this.renderCurrentQuestion();
        } else {
            console.error('❌ Invalid question index for goToQuestion:', index);
            console.error('Available range: 0 to', this.state.questions.length - 1);
        }
    }

    renderCurrentQuestion() {
        // Validate state before rendering
        if (!this.state.questions || !Array.isArray(this.state.questions)) {
            console.error('❌ No questions available for rendering');
            return;
        }

        if (this.state.currentQuestionIndex < 0 || this.state.currentQuestionIndex >= this.state.questions.length) {
            console.error('❌ Invalid question index for rendering:', this.state.currentQuestionIndex);
            console.error('Available questions:', this.state.questions.length);
            return;
        }

        const question = this.state.questions[this.state.currentQuestionIndex];

        if (!question || typeof question !== 'object') {
            console.error('❌ Invalid question object for rendering at index:', this.state.currentQuestionIndex);
            return;
        }

        const questionContainer = document.getElementById('questionContainer');

        if (!questionContainer) {
            console.error('❌ Question container element not found');
            return;
        }

        // Get user answer for this question
        const userAnswer = this.state.answers[this.state.currentQuestionIndex];
        const questionNumber = this.state.currentQuestionIndex + 1;

        // Generate question HTML with same structure as quiz system
        let questionHTML = `
            <div class="question-card">
                <div class="question-header">
                    <span class="question-number">Soal ${questionNumber}</span>
                    <span class="question-points">${question.points || 10} poin</span>
                </div>

                <div class="question-text">
                    <h3>${question.pertanyaan || question.question}</h3>
                </div>

                <div class="answer-section">
        `;

        switch (question.type || 'multiple-choice') {
            case 'multiple-choice':
                questionHTML += this.generateMultipleChoiceHTML(question, userAnswer);
                break;
            case 'true-false':
                questionHTML += this.generateTrueFalseHTML(question, userAnswer);
                break;
            case 'fill-blank':
                questionHTML += this.generateFillBlankHTML(question, userAnswer);
                break;
            default:
                questionHTML += this.generateMultipleChoiceHTML(question, userAnswer);
        }

        questionHTML += `
                </div>
            </div>
        `;

        // Update DOM
        questionContainer.innerHTML = questionHTML;

        // Update progress indicators and navigation
        this.updateProgress();
    }

    /**
     * Update progress indicators and navigation
     */
    updateProgress() {
        // Update current question number
        const currentQuestionElement = document.getElementById('currentQuestionNumber');
        if (currentQuestionElement) {
            currentQuestionElement.textContent = this.state.currentQuestionIndex + 1;
        }

        // Update progress text
        const progressTextElement = document.getElementById('quizProgressText');
        if (progressTextElement) {
            const progress = Math.round(((this.state.currentQuestionIndex + 1) / this.state.questions.length) * 100);
            progressTextElement.textContent = `${progress}%`;
        }

        // Update progress bar
        const progressBar = document.getElementById('quizProgressFill');
        if (progressBar) {
            const progress = ((this.state.currentQuestionIndex + 1) / this.state.questions.length) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Update question indicators
        const questionIndicators = document.getElementById('questionIndicators');
        if (questionIndicators) {
            questionIndicators.innerHTML = this.generateQuestionIndicators();
        }

        // Update navigation status
        const navigationStatus = document.getElementById('navigationStatus');
        if (navigationStatus) {
            const currentAnswer = this.state.answers[this.state.currentQuestionIndex];
            if (currentAnswer !== null) {
                navigationStatus.textContent = 'Jawaban tersimpan';
            } else {
                navigationStatus.textContent = 'Pilih jawaban untuk melanjutkan';
            }
        }

        // Update navigation buttons
        const prevButton = document.getElementById('btnPrevQuestion');
        const nextButton = document.getElementById('btnNextQuestion');
        const submitButton = document.getElementById('btnSubmitTest');

        const isLastQuestion = this.state.currentQuestionIndex === this.state.questions.length - 1;
        const hasAnswer = this.state.answers[this.state.currentQuestionIndex] !== null;
        const isFirstQuestion = this.state.currentQuestionIndex === 0;

        // Previous button
        if (prevButton) {
            prevButton.disabled = isFirstQuestion;
        }

        // Next/Submit button
        if (nextButton && submitButton) {
            if (isLastQuestion) {
                // On last question, show submit button
                nextButton.style.display = 'none';
                submitButton.style.display = 'block';
                submitButton.disabled = !hasAnswer;
            } else {
                // On other questions, show next button
                nextButton.style.display = 'block';
                submitButton.style.display = 'none';
                nextButton.disabled = !hasAnswer;
            }
        }
    }

    generateQuestionHTML(question) {
        let html = '';

        switch (question.type) {
            case 'multiple-choice':
                html = this.generateMultipleChoiceHTML(question);
                break;
            case 'true-false':
                html = this.generateTrueFalseHTML(question);
                break;
            case 'fill-blank':
                html = this.generateFillBlankHTML(question);
                break;
            case 'matching':
                html = this.generateMatchingHTML(question);
                break;
            case 'drag-drop':
                html = this.generateDragDropHTML(question);
                break;
            case 'scenario':
                html = this.generateScenarioHTML(question);
                break;
            default:
                html = this.generateMultipleChoiceHTML(question);
        }

        return html;
    }

    generateMultipleChoiceHTML(question, currentAnswer) {
        const options = question.options || question.jawaban || [];

        return `
            <div class="options-grid">
                ${options.map((option, index) => {
                    const isSelected = currentAnswer === index;
                    const letter = String.fromCharCode(65 + index); // A, B, C, D...

                    return `
                        <div class="option-card ${isSelected ? 'selected' : ''}"
                             data-index="${index}"
                             onclick="window.enhancedTestSystem.testEngine.answerQuestion(${index})">
                            <div class="option-label">${letter}</div>
                            <div class="option-text">${option}</div>
                            ${isSelected ? '<div class="option-selected-mark">✓</div>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    generateTrueFalseHTML(question, currentAnswer) {
        const isSelected = currentAnswer !== null;
        const selectedValue = currentAnswer === true ? 'Benar' : 'Salah';

        return `
            <div class="true-false-options">
                <div class="option-card large ${currentAnswer === true ? 'selected' : ''}"
                     data-value="true"
                     onclick="window.enhancedTestSystem.testEngine.answerQuestion(true)">
                    <div class="option-icon">✓</div>
                    <div class="option-text">Benar</div>
                    ${currentAnswer === true ? '<div class="option-selected-mark">✓</div>' : ''}
                </div>

                <div class="option-card large ${currentAnswer === false ? 'selected' : ''}"
                     data-value="false"
                     onclick="window.enhancedTestSystem.testEngine.answerQuestion(false)">
                    <div class="option-icon">✗</div>
                    <div class="option-text">Salah</div>
                    ${currentAnswer === false ? '<div class="option-selected-mark">✓</div>' : ''}
                </div>
            </div>
        `;
    }

    generateFillBlankHTML(question, currentAnswer) {
        return `
            <div class="fill-blank-container">
                <div class="input-group">
                    <input type="text"
                           id="fillBlankInput"
                           class="form-input"
                           placeholder="Ketik jawaban Anda di sini..."
                           value="${currentAnswer || ''}"
                           onkeyup="window.enhancedTestSystem.testEngine.handleFillBlankInput(event)">
                    <button class="btn btn-primary" onclick="window.enhancedTestSystem.testEngine.submitFillBlank()">
                        Simpan
                    </button>
                </div>
            </div>
        `;
    }

    handleFillBlankInput(event) {
        const input = event.target;
        const value = input.value.trim();

        // Enable/disable next button based on input
        const nextBtn = document.getElementById('btnNextQuestion');
        if (nextBtn) {
            nextBtn.disabled = !value;
        }

        // Update navigation status
        const navigationStatus = document.getElementById('navigationStatus');
        if (navigationStatus) {
            navigationStatus.textContent = value ? 'Jawaban tersimpan' : 'Pilih jawaban untuk melanjutkan';
        }
    }

    submitFillBlank() {
        const input = document.getElementById('fillBlankInput');
        if (!input) return;

        const value = input.value.trim();
        if (value) {
            // For fill blank questions, we'll store the text value
            this.state.answers[this.state.currentQuestionIndex] = value;
            this.updateProgress();
            this.updateIndicators();
        }
    }

    generateMultipleChoiceHTML(question) {
        return `
            <div class="question-type">Pilihan Ganda</div>
            <div class="points">${question.points || 10} poin</div>
        `;
    }

    generateTrueFalseHTML(question) {
        return `
            <div class="question-type">Benar/Salah</div>
            <div class="answer-options">
                <div class="answer-option" onclick="window.enhancedTestSystem.testEngine.answerQuestion(0)">
                    <span class="option-label">A.</span>
                    <span class="option-text">Benar</span>
                </div>
                <div class="answer-option" onclick="window.enhancedTestSystem.testEngine.answerQuestion(1)">
                    <span class="option-label">B.</span>
                    <span class="option-text">Salah</span>
                </div>
            </div>
            <div class="points">${question.points || 5} poin</div>
        `;
    }

    generateFillBlankHTML(question) {
        return `
            <div class="question-type">Isian Singkat</div>
            <div class="answer-input">
                <input type="text" id="fillBlankAnswer" placeholder="Ketik jawaban Anda di sini">
                <button class="btn btn-primary" onclick="window.enhancedTestSystem.testEngine.submitFillBlank()">Submit</button>
            </div>
            <div class="points">${question.points || 10} poin</div>
        `;
    }

    generateMatchingHTML(question) {
        return `
            <div class="question-type">Jodohkan</div>
            <div class="matching-container">
                <div class="matching-left">
                    ${question.pairs.map((pair, index) => `
                        <div class="matching-item" data-left="${index}">${pair.layer}</div>
                    `).join('')}
                </div>
                <div class="matching-right">
                    ${question.pairs.map((pair, index) => `
                        <div class="matching-item" data-right="${index}">${pair.function}</div>
                    `).join('')}
                </div>
            </div>
            <div class="points">${question.points || 15} poin</div>
        `;
    }

    generateDragDropHTML(question) {
        return `
            <div class="question-type">Seret & Lepas</div>
            <div class="drag-drop-container">
                <div class="drag-items">
                    ${question.items.map((item, index) => `
                        <div class="drag-item" draggable="true" data-id="${item.id}">${item.label}</div>
                    `).join('')}
                </div>
                <div class="drop-zones">
                    ${question.correctOrder.map((_, index) => `
                        <div class="drop-zone" data-position="${index}"></div>
                    `).join('')}
                </div>
            </div>
            <div class="points">${question.points || 20} poin</div>
        `;
    }

    generateScenarioHTML(question) {
        return `
            <div class="question-type">Studi Kasus</div>
            <div class="scenario-box">
                <h4>Scenario:</h4>
                <p>${question.scenario}</p>
            </div>
            <div class="points">${question.points || 20} poin</div>
        `;
    }

    generateQuestionIndicators() {
        return this.state.questions.map((_, index) => {
            const isAnswered = this.state.answers[index] !== null;
            const isCurrent = index === this.state.currentQuestionIndex;

            // Check if answer is correct (for answered questions)
            let isCorrect = null;
            if (isAnswered && this.state.questions[index]) {
                const question = this.state.questions[index];
                isCorrect = this.state.answers[index] === question.correctAnswer;
            }

            let className = 'indicator';
            if (isCurrent) className += ' current';
            else if (isAnswered) {
                className += isCorrect ? ' correct' : ' incorrect';
            }

            return `<div class="${className}" data-index="${index}" onclick="window.enhancedTestSystem.testEngine.goToQuestion(${index})">${index + 1}</div>`;
        }).join('');
    }

    submitFillBlank() {
        const input = document.getElementById('fillBlankAnswer');
        if (input) {
            const answer = input.value.trim();
            const question = this.state.questions[this.state.currentQuestionIndex];
            const isCorrect = answer.toLowerCase() === question.answer.toLowerCase();

            this.state.answers[this.state.currentQuestionIndex] = answer;
            if (isCorrect) {
                this.state.score += question.points || 10;
            }

            if (this.callbacks.onQuestionAnswered) {
                this.callbacks.onQuestionAnswered(
                    question.id,
                    answer,
                    isCorrect,
                    this.calculateTimeSpent()
                );
            }

            if (this.state.currentQuestionIndex < this.state.questions.length - 1) {
                this.nextQuestion();
            } else {
                this.completeTest();
            }
        }
    }

    completeTest() {
        try {
            console.log('Completing test...');

            this.state.isCompleted = true;
            this.state.endTime = new Date();
            this.stopTimer();

            // Validate state before completion
            if (!this.state.questions || !Array.isArray(this.state.questions)) {
                throw new Error('Invalid questions array for test completion');
            }

            if (!this.state.answers || !Array.isArray(this.state.answers)) {
                throw new Error('Invalid answers array for test completion');
            }

            const results = {
                score: Math.round((this.state.score / this.getMaxPossibleScore()) * 100),
                correctAnswers: this.state.answers.filter((answer, _index) => {
                    const question = this.state.questions[_index];
                    if (!question) {
                        console.warn(`Question at index ${_index} is missing`);
                        return false;
                    }
                    return answer === question.correctAnswer;
                }).length,
                totalQuestions: this.state.questions.length,
                timeSpent: this.calculateTotalTimeSpent(),
                answers: this.state.answers,
                questions: this.state.questions,
                state: this.state
            };

            console.log('Test completed with results:', results);

            if (this.callbacks.onTestCompleted) {
                try {
                    this.callbacks.onTestCompleted(results);
                } catch (error) {
                    console.error('Error in test completed callback:', error);
                    // Don't fail the completion if callback fails
                }
            }
        } catch (error) {
            console.error('Error in completeTest:', error);
            // Try to complete with minimal results
            const fallbackResults = {
                score: 0,
                correctAnswers: 0,
                totalQuestions: this.state.questions ? this.state.questions.length : 0,
                timeSpent: this.calculateTotalTimeSpent(),
                answers: this.state.answers || [],
                questions: this.state.questions || [],
                state: this.state,
                error: error.message
            };

            if (this.callbacks.onTestCompleted) {
                this.callbacks.onTestCompleted(fallbackResults);
            }
        }
    }

    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            if (this.state.timeRemaining > 0) {
                this.state.timeRemaining--;
                if (this.callbacks.onTimeUpdated) {
                    this.callbacks.onTimeUpdated(this.state.timeRemaining);
                }
            } else {
                this.completeTest();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    calculateTimeSpent() {
        if (!this.state.startTime) return 0;
        const now = new Date();
        return Math.floor((now - this.state.startTime) / 1000);
    }

    calculateTotalTimeSpent() {
        if (!this.state.startTime || !this.state.endTime) return 0;
        return Math.floor((this.state.endTime - this.state.startTime) / 1000);
    }

    getMaxPossibleScore() {
        return this.state.questions.reduce((total, question) => total + (question.points || 10), 0);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    getState() {
        return { ...this.state };
    }

    /**
     * Normalize correct answer from various data structures
     */
    normalizeCorrectAnswer(question) {
        // Try different property names in order of preference
        const correctAnswer = question.jawaban_benar ||
                            question.correctAnswer ||
                            question.correct ||
                            question.answer ||
                            question.jawaban;

        if (correctAnswer === undefined || correctAnswer === null) {
            console.warn('Question missing correct answer:', question);
            return null;
        }

        return correctAnswer;
    }
}

/**
 * Test Analytics
 */
class TestAnalytics {
    constructor() {
        this.sessionData = {
            startTime: null,
            endTime: null,
            questionAnswers: [],
            timePerQuestion: [],
            difficultyProgression: []
        };
    }

    trackTestStart(config) {
        this.sessionData.startTime = new Date();
        this.sessionData.config = config;
    }

    trackQuestionAnswer(questionId, answer, isCorrect, timeSpent) {
        this.sessionData.questionAnswers.push({
            questionId: questionId,
            answer: answer,
            isCorrect: isCorrect,
            timeSpent: timeSpent,
            timestamp: new Date()
        });

        this.sessionData.timePerQuestion.push(timeSpent);
    }

    generateTestReport(results) {
        const totalTime = this.sessionData.timePerQuestion.reduce((sum, time) => sum + time, 0);
        const averageTimePerQuestion = totalTime / this.sessionData.timePerQuestion.length;

        // Calculate correct streak
        let correctStreak = 0;
        let maxStreak = 0;
        this.sessionData.questionAnswers.forEach(answer => {
            if (answer.isCorrect) {
                correctStreak++;
                maxStreak = Math.max(maxStreak, correctStreak);
            } else {
                correctStreak = 0;
            }
        });

        // Analyze difficulty progression
        const difficultyAnalysis = this.analyzeDifficultyProgression();

        return {
            score: results.score,
            correctAnswers: results.correctAnswers,
            totalQuestions: results.totalQuestions,
            timeSpent: results.timeSpent,
            averageTimePerQuestion: Math.round(averageTimePerQuestion),
            correctStreak: maxStreak,
            difficultyAnalysis: difficultyAnalysis,
            questionBreakdown: this.generateQuestionBreakdown(),
            recommendations: this.generateRecommendations(results),
            sessionData: this.sessionData
        };
    }

    analyzeDifficultyProgression() {
        // Analyze performance across different difficulty levels
        const difficultyStats = {
            easy: { correct: 0, total: 0 },
            medium: { correct: 0, total: 0 },
            hard: { correct: 0, total: 0 }
        };

        this.sessionData.questionAnswers.forEach(answer => {
            // This would require access to question data
            // Implementation depends on data structure
        });

        return difficultyStats;
    }

    generateQuestionBreakdown() {
        return this.sessionData.questionAnswers.map((answer, _index) => ({
            questionNumber: _index + 1,
            isCorrect: answer.isCorrect,
            timeSpent: answer.timeSpent,
            questionId: answer.questionId
        }));
    }

    generateRecommendations(results) {
        const recommendations = [];

        if (results.score < 60) {
            recommendations.push({
                type: 'study-more',
                message: 'Disarankan untuk mempelajari kembali materi dasar jaringan komputer.',
                priority: 'high'
            });
        }

        if (results.score >= 60 && results.score < 80) {
            recommendations.push({
                type: 'practice-more',
                message: 'Pemahaman sudah baik, namun perlu lebih banyak latihan.',
                priority: 'medium'
            });
        }

        if (results.score >= 80) {
            recommendations.push({
                type: 'advanced-topics',
                message: 'Pemahaman sangat baik! Siap untuk topik yang lebih advanced.',
                priority: 'low'
            });
        }

        return recommendations;
    }
}

/**
 * Adaptive Testing System
 */
class AdaptiveTesting {
    constructor() {
        this.currentDifficulty = 'medium';
        this.difficultyHistory = [];
        this.performanceHistory = [];
    }

    selectQuestions(allQuestions, count) {
        // Select questions based on adaptive difficulty
        const questions = [];
        const difficultyDistribution = this.calculateDifficultyDistribution(count);

        // Handle the distribution object (not an array)
        Object.entries(difficultyDistribution).forEach(([difficulty, numQuestions]) => {
            const difficultyQuestions = allQuestions.filter(q => q.difficulty === difficulty);
            const selectedQuestions = this.shuffleArray(difficultyQuestions).slice(0, numQuestions);
            questions.push(...selectedQuestions);
        });

        return this.shuffleArray(questions).slice(0, count);
    }

    calculateDifficultyDistribution(totalQuestions) {
        // Dynamic difficulty distribution based on performance
        const distribution = {
            easy: Math.floor(totalQuestions * 0.3),
            medium: Math.floor(totalQuestions * 0.5),
            hard: Math.floor(totalQuestions * 0.2)
        };

        // Adjust based on current difficulty
        switch (this.currentDifficulty) {
            case 'easy':
                distribution.easy = Math.floor(totalQuestions * 0.6);
                distribution.medium = Math.floor(totalQuestions * 0.3);
                distribution.hard = Math.floor(totalQuestions * 0.1);
                break;
            case 'hard':
                distribution.easy = Math.floor(totalQuestions * 0.1);
                distribution.medium = Math.floor(totalQuestions * 0.3);
                distribution.hard = Math.floor(totalQuestions * 0.6);
                break;
        }

        return distribution;
    }

    adjustDifficulty(isCorrect, timeSpent) {
        this.performanceHistory.push({
            isCorrect: isCorrect,
            timeSpent: timeSpent,
            timestamp: new Date()
        });

        // Adjust difficulty based on recent performance
        if (this.performanceHistory.length >= 3) {
            const recentPerformance = this.performanceHistory.slice(-3);
            const correctCount = recentPerformance.filter(p => p.isCorrect).length;
            const avgTime = recentPerformance.reduce((sum, p) => sum + p.timeSpent, 0) / 3;

            if (correctCount >= 3 && avgTime < 30) {
                // Increase difficulty
                this.currentDifficulty = this.getHigherDifficulty(this.currentDifficulty);
            } else if (correctCount <= 1 || avgTime > 60) {
                // Decrease difficulty
                this.currentDifficulty = this.getLowerDifficulty(this.currentDifficulty);
            }

            this.difficultyHistory.push(this.currentDifficulty);
        }
    }

    getHigherDifficulty(current) {
        const difficulties = ['easy', 'medium', 'hard'];
        const currentIndex = difficulties.indexOf(current);
        return currentIndex < difficulties.length - 1 ? difficulties[currentIndex + 1] : current;
    }

    getLowerDifficulty(current) {
        const difficulties = ['easy', 'medium', 'hard'];
        const currentIndex = difficulties.indexOf(current);
        return currentIndex > 0 ? difficulties[currentIndex - 1] : current;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize the enhanced test system
window.enhancedTestSystem = null;

// Auto-initialize when the main app is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to initialize
    setTimeout(() => {
        if (window.mpiApp) {
            window.enhancedTestSystem = new EnhancedTestSystem(window.mpiApp);
            console.log('Enhanced Test System initialized');
        }
    }, 1000);
});