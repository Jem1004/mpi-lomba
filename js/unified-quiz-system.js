/**
 * Unified Quiz System for MPI - Media Pembelajaran Interaktif
 * Menggabungkan Enhanced Quiz System dan Enhanced Test System
 * Author: MPI Development Team
 * Version: 3.0.0 - Unified System
 */

class UnifiedQuizSystem {
    constructor(app) {
        this.app = app;

        // Quiz modes
        this.MODES = {
            PRACTICE: 'practice',     // Test Pengetahuan
            QUIZ: 'quiz',            // Quiz Akhir
            COMPREHENSIVE: 'comprehensive', // Soal Komprehensif
            MIXED: 'mixed'           // Campuran semua kategori
        };

        // Current session state
        this.currentSession = {
            mode: null,
            config: null,
            state: null,
            startTime: null,
            endTime: null
        };

        // Default configuration
        this.defaultConfig = {
            maxQuestionsPerSession: 20,
            passingScore: 70,
            timePerQuestion: null,  // null untuk timer keseluruhan
            totalTimeLimit: 600,   // 10 minutes default
            allowBackNavigation: true,
            showImmediateFeedback: false,
            shuffleQuestions: true,
            shuffleAnswers: true,
            enableHints: false,
            enableExplanations: true
        };

        // Initialize event listeners
        this.initializeEventListeners();

        console.log('🎯 Unified Quiz System initialized');
    }

    /**
     * Initialize event listeners untuk keyboard shortcuts
     */
    initializeEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.currentSession.state || !this.currentSession.state.isStarted) return;

            switch(e.key) {
                case 'ArrowLeft':
                    if (this.defaultConfig.allowBackNavigation) {
                        this.previousQuestion();
                    }
                    break;
                case 'ArrowRight':
                    this.nextQuestion();
                    break;
                case 'Enter':
                    if (e.ctrlKey || e.metaKey) {
                        this.submitSession();
                    }
                    break;
                case 'Escape':
                    this.exitSession();
                    break;
            }
        });
    }

    /**
     * Start quiz session dengan konfigurasi tertentu
     */
    async startSession(mode, options = {}) {
        try {
            console.log(`🚀 Starting ${mode} session...`, options);

            // Validate mode
            if (!this.MODES[mode.toUpperCase()]) {
                throw new Error(`Invalid quiz mode: ${mode}`);
            }

            // Setup session configuration
            const config = { ...this.defaultConfig, ...options };
            config.mode = mode;
            config.category = options.category || mode;

            // Generate questions untuk session ini
            const questions = await this.generateQuestions(config);

            if (!questions || questions.length === 0) {
                throw new Error('No questions available for this session');
            }

            // Initialize session state
            this.currentSession = {
                mode: mode,
                config: config,
                state: {
                    isStarted: true,
                    isCompleted: false,
                    isPaused: false,
                    questions: questions,
                    currentQuestionIndex: 0,
                    answers: new Array(questions.length).fill(null),
                    score: 0,
                    correctAnswers: 0,
                    timeRemaining: config.totalTimeLimit,
                    timerInterval: null,
                    startTime: new Date(),
                    endTime: null
                },
                startTime: new Date()
            };

            // Render quiz interface
            this.renderQuizInterface();

            // Start timer jika configured
            if (config.totalTimeLimit > 0) {
                this.startTimer();
            }

            // Render first question
            this.renderCurrentQuestion();

            console.log(`✅ ${mode} session started with ${questions.length} questions`);
            return this.currentSession.state;

        } catch (error) {
            console.error('❌ Error starting session:', error);
            this.showError(`Gagal memulai sesi: ${error.message}`);
            throw error;
        }
    }

    /**
     * Generate questions berdasarkan konfigurasi
     */
    async generateQuestions(config) {
        try {
            console.log('📝 Generating questions for config:', config);

            let questions = [];

            // Get questions berdasarkan category/mode
            switch (config.mode) {
                case this.MODES.PRACTICE:
                    questions = QuestionUtils.getQuestionsByCategory('test_pengetahuan');
                    break;
                case this.MODES.QUIZ:
                    questions = QuestionUtils.getQuestionsByCategory('quiz_akhir');
                    break;
                case this.MODES.COMPREHENSIVE:
                    questions = QuestionUtils.getQuestionsByCategory('soal_komprehensif');
                    break;
                case this.MODES.MIXED:
                    // Ambil dari semua kategori
                    const allCategories = ['test_pengetahuan', 'quiz_akhir', 'soal_komprehensif'];
                    for (const category of allCategories) {
                        const categoryQuestions = QuestionUtils.getQuestionsByCategory(category);
                        questions = questions.concat(categoryQuestions);
                    }
                    break;
                default:
                    // Fallback ke test_pengetahuan
                    questions = QuestionUtils.getQuestionsByCategory('test_pengetahuan');
            }

            // Filter by difficulty jika specified
            if (config.difficulty && config.difficulty !== 'mixed') {
                questions = questions.filter(q => q.difficulty === config.difficulty);
            }

            // Validate questions
            if (!questions || questions.length === 0) {
                console.warn('⚠️ No questions found, trying fallback...');
                // Fallback ke built-in questions
                questions = QuestionUtils.getQuestionsByCategory('network_basics');
            }

            // Shuffle questions jika enabled
            if (config.shuffleQuestions) {
                questions = QuestionUtils.shuffleArray(questions);
            }

            // Limit number of questions
            questions = questions.slice(0, config.maxQuestionsPerSession);

            // Shuffle answers jika enabled
            if (config.shuffleAnswers) {
                questions = questions.map(q => QuestionUtils.shuffleQuestionAnswers(q));
            }

            console.log(`✅ Generated ${questions.length} questions`);
            return questions;

        } catch (error) {
            console.error('❌ Error generating questions:', error);
            throw error;
        }
    }

    /**
     * Render quiz interface
     */
    renderQuizInterface() {
        const contentPages = document.getElementById('contentPages');
        if (!contentPages) {
            throw new Error('Content pages container not found');
        }

        const session = this.currentSession;
        const config = session.config;
        const state = session.state;

        const titles = {
            [this.MODES.PRACTICE]: 'Latihan Formatif',
            [this.MODES.QUIZ]: 'Quiz Akhir',
            [this.MODES.COMPREHENSIVE]: 'Tes Komprehensif',
            [this.MODES.MIXED]: 'Tes Campuran'
        };

        const subtitles = {
            [this.MODES.PRACTICE]: 'Latihan soal untuk meningkatkan pemahaman',
            [this.MODES.QUIZ]: 'Evaluasi akhir pembelajaran',
            [this.MODES.COMPREHENSIVE]: 'Tes menyeluruh jaringan komputer',
            [this.MODES.MIXED]: 'Kombinasi soal dari berbagai kategori'
        };

        const title = titles[config.mode] || 'Quiz';
        const subtitle = subtitles[config.mode] || '';

        const timerInfo = config.totalTimeLimit > 0 ? `
            <div class="quiz-timer" id="sessionTimer">${this.formatTime(state.timeRemaining)}</div>
        ` : `
            <div class="quiz-timer unlimited">Tanpa Batas Waktu</div>
        `;

        contentPages.innerHTML = `
            <div class="page" data-page="quiz">
                ${this.generatePageHeader(title, subtitle, true, 'window.unifiedQuizSystem.exitSession()', timerInfo)}

                <div class="page-content">
                    <div class="container">
                        <div class="enhanced-quiz-container">
                            <!-- Quiz Header -->
                            <div class="quiz-header">
                                <div class="quiz-info">
                                    <div class="quiz-title">${title}</div>
                                    <div class="quiz-meta">
                                        <span class="question-count">
                                            Soal <span id="currentQuestionNumber">1</span> dari <span id="totalQuestions">${state.questions.length}</span>
                                        </span>
                                        <div class="quiz-timer" id="sessionTimerDisplay">
                                            ${config.totalTimeLimit > 0 ? this.formatTime(state.timeRemaining) : 'Tanpa Batas Waktu'}
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
                                <button class="btn btn-secondary" id="btnPrevQuestion" onclick="window.unifiedQuizSystem.previousQuestion()" disabled>
                                    ← Sebelumnya
                                </button>

                                <div class="navigation-info">
                                    <span id="navigationStatus">Pilih jawaban untuk melanjutkan</span>
                                </div>

                                <button class="btn btn-primary" id="btnNextQuestion" onclick="window.unifiedQuizSystem.nextQuestion()" disabled>
                                    Selanjutnya →
                                </button>
                            </div>

                            <!-- Action Buttons -->
                            <div class="quiz-actions">
                                <button class="btn btn-outline" onclick="window.unifiedQuizSystem.clearCurrentAnswer()">
                                    Hapus Jawaban
                                </button>
                                <button class="btn btn-success" id="btnSubmitSession" onclick="window.unifiedQuizSystem.submitSession()" style="display: none;">
                                    Selesai & Lihat Hasil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        console.log('✅ Quiz interface rendered');
    }

    /**
     * Generate question indicators
     */
    generateQuestionIndicators() {
        const state = this.currentSession.state;

        return state.questions.map((_, index) => {
            const hasAnswer = state.answers[index] !== null;
            const isCurrent = index === state.currentQuestionIndex;

            let className = 'question-indicator';
            if (isCurrent) className += ' current';
            if (hasAnswer) className += ' answered';

            return `
                <div class="${className}"
                     onclick="window.unifiedQuizSystem.goToQuestion(${index})"
                     title="Soal ${index + 1}${hasAnswer ? ' (Sudah dijawab)' : ''}">
                    <span class="indicator-number">${index + 1}</span>
                    ${hasAnswer ? '<span class="indicator-check">✓</span>' : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * Render current question
     */
    renderCurrentQuestion() {
        try {
            const state = this.currentSession.state;
            const currentIndex = state.currentQuestionIndex;

            console.log(`📄 Rendering question ${currentIndex + 1} of ${state.questions.length}`);

            // Validate state
            if (currentIndex < 0 || currentIndex >= state.questions.length) {
                throw new Error(`Invalid question index: ${currentIndex}`);
            }

            const question = state.questions[currentIndex];
            const currentAnswer = state.answers[currentIndex];

            // Generate question HTML
            const questionHTML = this.generateQuestionHTML(question, currentAnswer);

            // Update DOM
            const container = document.getElementById('questionContainer');
            if (!container) {
                throw new Error('Question container not found');
            }
            container.innerHTML = questionHTML;

            // Update UI components
            this.updateNavigation();
            this.updateProgress();
            this.updateIndicators();

            console.log(`✅ Question ${currentIndex + 1} rendered successfully`);

        } catch (error) {
            console.error('❌ Error rendering question:', error);
            this.showError(`Gagal menampilkan soal: ${error.message}`);
        }
    }

    /**
     * Generate question HTML berdasarkan tipe
     */
    generateQuestionHTML(question, currentAnswer) {
        const questionNumber = this.currentSession.state.currentQuestionIndex + 1;

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
                questionHTML += this.generateMultipleChoiceHTML(question, currentAnswer);
                break;
            case 'true-false':
                questionHTML += this.generateTrueFalseHTML(question, currentAnswer);
                break;
            case 'fill-blank':
                questionHTML += this.generateFillBlankHTML(question, currentAnswer);
                break;
            default:
                questionHTML += this.generateMultipleChoiceHTML(question, currentAnswer);
        }

        questionHTML += `
                </div>
            </div>
        `;

        return questionHTML;
    }

    /**
     * Generate multiple choice HTML
     */
    generateMultipleChoiceHTML(question, currentAnswer) {
        const options = question.options || [];

        return `
            <div class="options-grid">
                ${options.map((option, index) => {
                    const isSelected = currentAnswer === index;
                    const letter = String.fromCharCode(65 + index);

                    return `
                        <div class="option-card ${isSelected ? 'selected' : ''}"
                             data-index="${index}"
                             onclick="window.unifiedQuizSystem.selectAnswer(${index})">
                            <div class="option-label">${letter}</div>
                            <div class="option-text">${option}</div>
                            ${isSelected ? '<div class="option-selected-mark">✓</div>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Generate true/false HTML
     */
    generateTrueFalseHTML(question, currentAnswer) {
        return `
            <div class="true-false-options">
                <div class="option-card large ${currentAnswer === true ? 'selected' : ''}"
                     data-value="true"
                     onclick="window.unifiedQuizSystem.selectAnswer(true)">
                    <div class="option-icon">✓</div>
                    <div class="option-text">Benar</div>
                    ${currentAnswer === true ? '<div class="option-selected-mark">✓</div>' : ''}
                </div>

                <div class="option-card large ${currentAnswer === false ? 'selected' : ''}"
                     data-value="false"
                     onclick="window.unifiedQuizSystem.selectAnswer(false)">
                    <div class="option-icon">✗</div>
                    <div class="option-text">Salah</div>
                    ${currentAnswer === false ? '<div class="option-selected-mark">✓</div>' : ''}
                </div>
            </div>
        `;
    }

    /**
     * Generate fill blank HTML
     */
    generateFillBlankHTML(question, currentAnswer) {
        return `
            <div class="fill-blank-container">
                <div class="input-group">
                    <input type="text"
                           id="fillBlankInput"
                           class="form-input"
                           placeholder="Ketik jawaban Anda di sini..."
                           value="${currentAnswer || ''}"
                           onkeyup="window.unifiedQuizSystem.handleFillBlankInput(event)">
                    <button class="btn btn-primary" onclick="window.unifiedQuizSystem.submitFillBlank()">
                        Simpan
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Select answer untuk current question
     */
    selectAnswer(answerIndex) {
        try {
            const state = this.currentSession.state;
            const currentIndex = state.currentQuestionIndex;

            // Validate
            if (answerIndex === null || answerIndex === undefined) {
                throw new Error('Invalid answer value');
            }

            console.log('💾 Selecting answer:', {
                answerIndex,
                currentIndex,
                question: state.questions[currentIndex].pertanyaan
            });

            // Store answer
            state.answers[currentIndex] = answerIndex;

            // Update UI immediately
            this.updateAnswerUI(answerIndex);

            // Update navigation and indicators
            this.updateNavigation();
            this.updateIndicators();

            // Auto-navigate to next question setelah delay singkat
            setTimeout(() => {
                this.checkAutoNavigate();
            }, 300);

            console.log('✅ Answer saved successfully');

        } catch (error) {
            console.error('❌ Error selecting answer:', error);
            this.showError('Gagal menyimpan jawaban. Silakan coba lagi.');
        }
    }

    /**
     * Update answer UI untuk selected option
     */
    updateAnswerUI(answerIndex) {
        try {
            // Clear all selections first
            document.querySelectorAll('.option-card').forEach((option) => {
                option.classList.remove('selected');
                const checkMark = option.querySelector('.option-selected-mark');
                if (checkMark) checkMark.remove();
            });

            // Add selected state to chosen option
            let selectedOption;
            if (typeof answerIndex === 'boolean') {
                selectedOption = document.querySelector(`.option-card[data-value="${answerIndex}"]`);
            } else {
                selectedOption = document.querySelector(`.option-card[data-index="${answerIndex}"]`);
            }

            if (selectedOption) {
                selectedOption.classList.add('selected');
                if (!selectedOption.querySelector('.option-selected-mark')) {
                    selectedOption.innerHTML += '<div class="option-selected-mark">✓</div>';
                }
                console.log('✅ UI updated for selected option');
            } else {
                console.warn('⚠️ Selected option not found:', answerIndex);
            }

        } catch (error) {
            console.error('❌ Error updating answer UI:', error);
        }
    }

    /**
     * Handle fill blank input
     */
    handleFillBlankInput(event) {
        const input = event.target;
        const value = input.value.trim();

        // Enable/disable navigation based on input
        const nextBtn = document.getElementById('btnNextQuestion');
        if (nextBtn) {
            nextBtn.disabled = !value;
        }

        this.updateNavigationStatus(value ? 'Jawaban tersimpan' : 'Pilih jawaban untuk melanjutkan');
    }

    /**
     * Submit fill blank answer
     */
    submitFillBlank() {
        const input = document.getElementById('fillBlankInput');
        if (!input) return;

        const value = input.value.trim();
        if (value) {
            this.selectAnswer(value);
        }
    }

    /**
     * Check if should auto-navigate to next question
     */
    checkAutoNavigate() {
        const state = this.currentSession.state;
        const currentIndex = state.currentQuestionIndex;
        const hasAnswer = state.answers[currentIndex] !== null;
        const isLastQuestion = currentIndex === state.questions.length - 1;

        if (hasAnswer && !isLastQuestion) {
            // Auto-navigate after short delay
            setTimeout(() => {
                if (state.currentQuestionIndex === currentIndex) {
                    this.nextQuestion();
                }
            }, 500);
        }
    }

    /**
     * Navigate to previous question
     */
    previousQuestion() {
        if (!this.defaultConfig.allowBackNavigation) return;

        const state = this.currentSession.state;
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            this.renderCurrentQuestion();
            console.log('⬅️ Navigated to previous question:', state.currentQuestionIndex + 1);
        }
    }

    /**
     * Navigate to next question dengan logic yang diperbaiki
     */
    nextQuestion() {
        try {
            const state = this.currentSession.state;
            const currentIndex = state.currentQuestionIndex;
            const isLastQuestion = currentIndex === state.questions.length - 1;
            const hasAnswer = state.answers[currentIndex] !== null;

            console.log('➡️ Next question called:', {
                currentIndex: currentIndex + 1,
                totalQuestions: state.questions.length,
                isLastQuestion,
                hasAnswer
            });

            if (isLastQuestion && hasAnswer) {
                // Show submit button on last question
                this.showSubmitButton();
            } else if (!isLastQuestion && hasAnswer) {
                // Navigate to next question
                state.currentQuestionIndex++;
                this.renderCurrentQuestion();
                console.log('➡️ Navigated to next question:', state.currentQuestionIndex + 1);
            } else {
                // Cannot navigate - update status
                this.updateNavigationStatus('Pilih jawaban untuk melanjutkan');
            }

        } catch (error) {
            console.error('❌ Error in nextQuestion:', error);
            this.showError('Gagal navigasi ke soal berikutnya');
        }
    }

    /**
     * Show submit button
     */
    showSubmitButton() {
        const nextBtn = document.getElementById('btnNextQuestion');
        const submitBtn = document.getElementById('btnSubmitSession');

        if (nextBtn && submitBtn) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
            submitBtn.disabled = false;
            console.log('✅ Submit button shown');
        }
    }

    /**
     * Go to specific question
     */
    goToQuestion(index) {
        if (!this.defaultConfig.allowBackNavigation && index < this.currentSession.state.currentQuestionIndex) {
            return;
        }

        const state = this.currentSession.state;
        if (index >= 0 && index < state.questions.length) {
            state.currentQuestionIndex = index;
            this.renderCurrentQuestion();
            console.log('📍 Navigated to question:', index + 1);
        }
    }

    /**
     * Clear current answer
     */
    clearCurrentAnswer() {
        const state = this.currentSession.state;
        const currentIndex = state.currentQuestionIndex;
        state.answers[currentIndex] = null;
        this.renderCurrentQuestion();
        console.log('🗑️ Answer cleared for question:', currentIndex + 1);
    }

    /**
     * Update navigation buttons dengan logic yang diperbaiki
     */
    updateNavigation() {
        try {
            const state = this.currentSession.state;
            const currentIndex = state.currentQuestionIndex;
            const isLastQuestion = currentIndex === state.questions.length - 1;
            const hasAnswer = state.answers[currentIndex] !== null;
            const isFirstQuestion = currentIndex === 0;

            // Previous button
            const prevBtn = document.getElementById('btnPrevQuestion');
            if (prevBtn) {
                prevBtn.disabled = isFirstQuestion || !this.defaultConfig.allowBackNavigation;
            }

            // Next/Submit button - FIXED LOGIC
            const nextBtn = document.getElementById('btnNextQuestion');
            const submitBtn = document.getElementById('btnSubmitSession');

            if (nextBtn && submitBtn) {
                if (isLastQuestion) {
                    // On last question, show submit button
                    nextBtn.style.display = 'none';
                    submitBtn.style.display = 'block';
                    submitBtn.disabled = !hasAnswer;
                } else {
                    // On other questions, show next button
                    nextBtn.style.display = 'block';
                    submitBtn.style.display = 'none';
                    nextBtn.disabled = !hasAnswer;
                }
            }

            // Clear button
            const clearBtn = document.querySelector('.quiz-actions .btn-outline');
            if (clearBtn) {
                clearBtn.disabled = !hasAnswer;
            }

            // Update status
            this.updateNavigationStatus(hasAnswer ? 'Jawaban tersimpan' : 'Pilih jawaban untuk melanjutkan');

        } catch (error) {
            console.error('❌ Error updating navigation:', error);
        }
    }

    /**
     * Update navigation status text
     */
    updateNavigationStatus(status) {
        const statusElement = document.getElementById('navigationStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    /**
     * Update progress indicators
     */
    updateProgress() {
        try {
            const state = this.currentSession.state;
            const currentIndex = state.currentQuestionIndex;
            const totalQuestions = state.questions.length;
            const progress = ((currentIndex + 1) / totalQuestions) * 100;

            // Update progress bar
            const progressFill = document.getElementById('quizProgressFill');
            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }

            // Update progress text
            const progressText = document.getElementById('quizProgressText');
            if (progressText) {
                progressText.textContent = `${Math.round(progress)}%`;
            }

            // Update current question number
            const currentQuestionElement = document.getElementById('currentQuestionNumber');
            if (currentQuestionElement) {
                currentQuestionElement.textContent = currentIndex + 1;
            }

        } catch (error) {
            console.error('❌ Error updating progress:', error);
        }
    }

    /**
     * Update question indicators
     */
    updateIndicators() {
        const indicatorsContainer = document.getElementById('questionIndicators');
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = this.generateQuestionIndicators();
        }
    }

    /**
     * Start timer
     */
    startTimer() {
        const state = this.currentSession.state;

        // Clear existing timer
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
        }

        state.timerInterval = setInterval(() => {
            if (state.timeRemaining > 0) {
                state.timeRemaining--;
                this.updateTimer();

                // Add warning class if time is running low
                if (state.timeRemaining <= 60) {
                    const timerElement = document.getElementById('sessionTimer');
                    const timerDisplay = document.getElementById('sessionTimerDisplay');
                    if (timerElement) timerElement.classList.add('warning');
                    if (timerDisplay) timerDisplay.classList.add('warning');
                }
            } else {
                // Time's up - auto submit
                this.submitSession();
            }
        }, 1000);

        console.log('⏱️ Timer started:', state.timeRemaining, 'seconds');
    }

    /**
     * Update timer display
     */
    updateTimer() {
        const state = this.currentSession.state;
        const timeString = this.formatTime(state.timeRemaining);

        const timerElement = document.getElementById('sessionTimer');
        const timerDisplay = document.getElementById('sessionTimerDisplay');

        if (timerElement) timerElement.textContent = timeString;
        if (timerDisplay) timerDisplay.textContent = timeString;
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
     * Submit session/complete quiz
     */
    submitSession() {
        try {
            const state = this.currentSession.state;
            if (state.isCompleted) {
                console.warn('⚠️ Session already completed');
                return;
            }

            console.log('🏁 Submitting session...');

            // Stop timer
            if (state.timerInterval) {
                clearInterval(state.timerInterval);
                state.timerInterval = null;
            }

            // Mark as completed
            state.isCompleted = true;
            state.endTime = new Date();

            // Calculate score
            this.calculateScore();

            // Show results
            this.showResults();

            // Save results
            this.saveResults();

            // ULTRA-SIMPLIFIED CERTIFICATE: Any quiz with 70%+ gets certificate!
            if (state.score >= 70) {
                console.log('🏆 QUIZ PASSED! Generating certificate immediately...');
                console.log('📊 Quiz Details:', {
                    score: state.score,
                    correctAnswers: state.correctAnswers,
                    totalQuestions: state.totalQuestions,
                    timeSpent: Math.floor((state.endTime - state.startTime) / 1000)
                });

                // Generate certificate immediately
                this.triggerCertificateGeneration(state);

                // Also update certificate status in main menu
                setTimeout(() => {
                    if (this.app && this.app.updateCertificateStatus) {
                        this.app.updateCertificateStatus();
                        console.log('🔄 Certificate status updated in main menu');
                    }
                }, 500);
            } else {
                console.log('📚 Quiz score below 70%, no certificate generated. Score:', state.score);
            }

            console.log('✅ Session submitted with score:', state.score);

        } catch (error) {
            console.error('❌ Error submitting session:', error);
            this.showError('Gagal menyelesaikan sesi. Silakan coba lagi.');
        }
    }

    /**
     * Calculate final score
     */
    calculateScore() {
        const state = this.currentSession.state;
        let correctCount = 0;
        let totalPoints = 0;
        let earnedPoints = 0;

        state.questions.forEach((question, index) => {
            const userAnswer = state.answers[index];
            const correctAnswer = question.jawaban_benar || question.correctAnswer;
            const points = question.points || 10;

            totalPoints += points;

            if (userAnswer !== null && userAnswer !== undefined) {
                if (question.type === 'fill-blank') {
                    // Case insensitive comparison for fill blank
                    if (userAnswer.toString().toLowerCase().trim() ===
                        correctAnswer.toString().toLowerCase().trim()) {
                        correctCount++;
                        earnedPoints += points;
                    }
                } else if (userAnswer === correctAnswer) {
                    correctCount++;
                    earnedPoints += points;
                }
            }
        });

        state.correctAnswers = correctCount;
        state.totalQuestions = state.questions.length;
        state.score = Math.round((earnedPoints / totalPoints) * 100);
        state.earnedPoints = earnedPoints;
        state.totalPoints = totalPoints;

        console.log('📊 Score calculated:', {
            correctCount,
            totalQuestions: state.totalQuestions,
            earnedPoints,
            totalPoints,
            score: state.score
        });
    }

    /**
     * Show results page
     */
    showResults() {
        const state = this.currentSession.state;
        const config = this.currentSession.config;
        const passed = state.score >= 70; // FIXED: Always use 70% for certificate eligibility

        const contentPages = document.getElementById('contentPages');
        if (!contentPages) return;

        const title = passed ? '🎉 Selamat! Anda Lulus' : '💪 Belum Lulus, Coba Lagi!';
        const subtitle = this.getResultSubtitle(config.mode);
        const resultIcon = passed ? '🏆' : '📚';

        contentPages.innerHTML = `
            <div class="page" data-page="quiz-results">
                ${this.generatePageHeader(title, subtitle, true, 'window.unifiedQuizSystem.backToMenu()')}

                <div class="page-content">
                    <div class="container">
                        <div class="quiz-results-container">
                            <div class="results-header">
                                <div class="score-display ${passed ? 'passed' : 'failed'}">
                                    <div class="score-circle">
                                        <span class="score-value">${state.score}%</span>
                                    </div>
                                    <h2>${title}</h2>
                                    <p>${passed ? 'Prestasi yang sangat baik!' : 'Terus belajar dan coba lagi.'}</p>
                                </div>
                            </div>

                            <div class="results-stats">
                                <div class="stat-grid">
                                    <div class="stat-item">
                                        <div class="stat-value">${state.correctAnswers}</div>
                                        <div class="stat-label">Jawaban Benar</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${state.totalQuestions}</div>
                                        <div class="stat-label">Total Soal</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${state.earnedPoints}</div>
                                        <div class="stat-label">Poin Didapat</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${state.totalPoints}</div>
                                        <div class="stat-label">Total Poin</div>
                                    </div>
                                </div>
                            </div>

                            <div class="results-actions">
                                <button class="btn btn-secondary" onclick="window.unifiedQuizSystem.reviewAnswers()">
                                    Lihat Jawaban
                                </button>
                                <button class="btn btn-primary" onclick="window.unifiedQuizSystem.retrySession()">
                                    Coba Lagi
                                </button>
                                ${passed ? `
                                    <button class="btn btn-success" onclick="window.mpiApp.downloadCertificate()">
                                        🏆 Unduh Sertifikat
                                    </button>
                                    <button class="btn btn-primary" onclick="window.mpiApp.showPage('certificate')">
                                        👀 Lihat Sertifikat
                                    </button>
                                ` : `
                                    <div class="certificate-hint">
                                        <p>📝 <strong>Dapatkan Sertifikat!</strong></p>
                                        <p>Capai nilai 70% atau lebih untuk membuka sertifikat kompetensi.</p>
                                        <p>Selisih Anda: <strong>${70 - state.score}%</strong> lagi!</p>
                                    </div>
                                `}
                                <button class="btn btn-outline" onclick="window.unifiedQuizSystem.backToMenu()">
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
     * Get result subtitle berdasarkan mode
     */
    getResultSubtitle(mode) {
        const subtitles = {
            [this.MODES.PRACTICE]: 'Hasil Latihan Formatif',
            [this.MODES.QUIZ]: 'Hasil Quiz Akhir',
            [this.MODES.COMPREHENSIVE]: 'Hasil Tes Komprehensif',
            [this.MODES.MIXED]: 'Hasil Tes Campuran'
        };
        return subtitles[mode] || 'Hasil Evaluasi';
    }

    /**
     * Save results to user data
     */
    saveResults() {
        try {
            const state = this.currentSession.state;
            const config = this.currentSession.config;

            const results = {
                mode: config.mode,
                category: config.category,
                score: state.score,
                correctAnswers: state.correctAnswers,
                totalQuestions: state.totalQuestions,
                earnedPoints: state.earnedPoints,
                totalPoints: state.totalPoints,
                timeSpent: Math.floor((state.endTime - state.startTime) / 1000),
                date: new Date().toISOString(),
                passed: state.score >= this.defaultConfig.passingScore
            };

            // Save to user data
            if (!this.app.userData.quizResults) {
                this.app.userData.quizResults = [];
            }
            this.app.userData.quizResults.push(results);

            // Update scores
            this.app.userData.scores = this.app.userData.scores || {};
            this.app.userData.scores[config.mode] = results;

            this.app.saveUserData();
            console.log('💾 Results saved to user data');

        } catch (error) {
            console.error('❌ Error saving results:', error);
        }
    }

    /**
     * Review answers (placeholder)
     */
    reviewAnswers() {
        this.app.showNotification('Fitur review jawaban akan segera tersedia', 'info');
    }

    /**
     * Retry current session
     */
    retrySession() {
        const config = this.currentSession.config;
        if (confirm('Apakah Anda ingin mencoba kuis lagi? Progress sebelumnya akan hilang.')) {
            this.startSession(config.mode, config);
        }
    }

    /**
     * Trigger certificate generation for quiz-only system
     */
    triggerCertificateGeneration(state) {
        try {
            console.log('🎓 DIRECT CERTIFICATE GENERATION - Score:', state.score);

            // DIRECT CERTIFICATE GENERATION - No complex logic!
            let progress = JSON.parse(localStorage.getItem('evaluationProgress') || '{}');

            // Check if certificate already exists for this score
            if (!progress.certificateUnlocked || (progress.bestScore || 0) < state.score) {
                // Generate certificate data immediately
                progress.certificateUnlocked = true;
                progress.certificateDate = new Date().toISOString();
                progress.bestScore = state.score;
                progress.certificateData = {
                    id: this.generateSimpleCertificateID(),
                    studentName: this.app ? this.app.studentName || 'Student' : 'Student',
                    score: state.score,
                    completionDate: progress.certificateDate,
                    verificationCode: this.generateSimpleVerificationCode(),
                    quizOnly: true,
                    passingScore: 70,
                    correctAnswers: state.correctAnswers,
                    totalQuestions: state.totalQuestions
                };

                // Save immediately
                localStorage.setItem('evaluationProgress', JSON.stringify(progress));

                // Update certificate status in main menu
                if (this.app && this.app.updateCertificateStatus) {
                    this.app.updateCertificateStatus();
                }

                console.log('✅ CERTIFICATE GENERATED IMMEDIATELY:', progress.certificateData);

                // Show celebration modal
                this.showCertificateCelebration(state);
            } else {
                console.log('ℹ️ Certificate already exists with score', progress.bestScore);
                // Still show celebration for consistency
                this.showCertificateCelebration(state);
            }

        } catch (error) {
            console.error('❌ Error in direct certificate generation:', error);
            this.showError('Gagal memproses sertifikat. Silakan coba lagi.');
        }
    }

    /**
     * Generate simple certificate ID
     */
    generateSimpleCertificateID() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `CERT-${timestamp}-${random}`.toUpperCase();
    }

    /**
     * Generate simple verification code
     */
    generateSimpleVerificationCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Show certificate celebration modal
     */
    showCertificateCelebration(state) {
        const celebrationHTML = `
        <div class="certificate-celebration-modal" style="
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
            <div class="celebration-content" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                padding: 40px;
                max-width: 500px;
                text-align: center;
                color: white;
                animation: celebrationBounce 0.6s ease-out;
            ">
                <div class="celebration-icon" style="font-size: 72px; margin-bottom: 20px;">🎉🏆🎊</div>
                <h1 style="font-size: 32px; margin: 0 0 20px 0;">Selamat! Anda Lulus!</h1>
                <p style="font-size: 18px; margin: 0 0 30px 0;">Sertifikat Kompetensi Jaringan Dasar telah dibuka</p>

                <div class="score-display" style="
                    background: rgba(255,255,255,0.2);
                    border-radius: 15px;
                    padding: 20px;
                    margin: 20px 0;
                ">
                    <div style="font-size: 48px; font-weight: 700; margin: 0;">${state.score}%</div>
                    <div style="font-size: 16px; margin: 5px 0 0 0;">Nilai Anda</div>
                </div>

                <p style="margin: 0 0 30px 0;">Anda menjawab ${state.correctAnswers} dari ${state.totalQuestions} soal dengan benar</p>

                <div class="celebration-actions" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-success btn-large" onclick="
                        window.mpiApp.downloadCertificate();
                        document.querySelector('.certificate-celebration-modal').remove();
                    " style="
                        background: #27ae60;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        📥 Unduh Sertifikat Sekarang
                    </button>
                    <button class="btn btn-secondary" onclick="
                        window.mpiApp.showPage('certificate');
                        document.querySelector('.certificate-celebration-modal').remove();
                    " style="
                        background: #34495e;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        👀 Lihat Sertifikat
                    </button>
                </div>
            </div>
        </div>

        <style>
        @keyframes celebrationBounce {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
        </style>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', celebrationHTML);

        // Auto-remove after 10 seconds if user doesn't interact
        setTimeout(() => {
            const modal = document.querySelector('.certificate-celebration-modal');
            if (modal) {
                modal.remove();
            }
        }, 10000);

        console.log('🎊 Certificate celebration modal shown');
    }

    /**
     * Generate certificate (for compatibility with existing systems)
     */
    generateCertificate() {
        // Delegate to app's downloadCertificate method
        if (this.app && this.app.downloadCertificate) {
            this.app.downloadCertificate();
        } else {
            this.showNotification('Sertifikat belum tersedia. Selesaikan kuis dengan nilai minimal 70% terlebih dahulu.', 'info');
        }
    }

    /**
     * Exit session
     */
    exitSession() {
        const state = this.currentSession.state;
        if (state.isStarted && !state.isCompleted) {
            if (confirm('Apakah Anda yakin ingin keluar dari kuis? Progress Anda akan hilang.')) {
                this.backToMenu();
            }
        } else {
            this.backToMenu();
        }
    }

    /**
     * Back to main menu
     */
    backToMenu() {
        // Clean up timer
        const state = this.currentSession.state;
        if (state && state.timerInterval) {
            clearInterval(state.timerInterval);
        }

        // Reset session
        this.currentSession = {
            mode: null,
            config: null,
            state: null,
            startTime: null,
            endTime: null
        };

        // Return to main menu
        this.app.showMainMenu();
    }

    /**
     * Show error message
     */
    showError(message) {
        this.app.showNotification(message, 'error');
    }

    /**
     * Generate consistent page header
     */
    generatePageHeader(title, subtitle = '', showBackButton = true, backAction = null, extraInfo = '') {
        const backButtonText = '← Kembali';
        const backClickHandler = backAction || 'window.unifiedQuizSystem.backToMenu()';

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
     * Get current session state
     */
    getCurrentSession() {
        return this.currentSession;
    }

    /**
     * Check if session is active
     */
    isSessionActive() {
        return this.currentSession.state && this.currentSession.state.isStarted && !this.currentSession.state.isCompleted;
    }

    /**
     * Pause current session
     */
    pauseSession() {
        const state = this.currentSession.state;
        if (state && state.isStarted && !state.isCompleted) {
            state.isPaused = true;
            if (state.timerInterval) {
                clearInterval(state.timerInterval);
            }
            console.log('⏸️ Session paused');
        }
    }

    /**
     * Resume paused session
     */
    resumeSession() {
        const state = this.currentSession.state;
        if (state && state.isPaused) {
            state.isPaused = false;
            if (state.timeRemaining > 0) {
                this.startTimer();
            }
            console.log('▶️ Session resumed');
        }
    }
}

// Initialize global instance
window.unifiedQuizSystem = null;

// Auto-initialize when DOM and dependencies are ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app and question data
    setTimeout(() => {
        if (window.mpiApp && window.QuestionData) {
            window.unifiedQuizSystem = new UnifiedQuizSystem(window.mpiApp);
            console.log('✅ Unified Quiz System initialized successfully');
        } else {
            console.warn('⚠️ Dependencies not ready, retrying...');
            setTimeout(() => {
                if (window.mpiApp && window.QuestionData) {
                    window.unifiedQuizSystem = new UnifiedQuizSystem(window.mpiApp);
                    console.log('✅ Unified Quiz System initialized (retry)');
                }
            }, 1000);
        }
    }, 500);
});