/**
 * Enhanced Quiz System for MPI
 * Improved navigation and state management
 * Author: Enhanced MPI Development Team
 * Version: 2.0.0
 */

class EnhancedQuizSystem {
    constructor(app) {
        this.app = app;
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
            endTime: null,
            userCanNavigate: true, // Allow navigation to any question
            showResults: true,
            category: 'final'
        };

        this.config = {
            questionsPerPage: 1,
            allowBackNavigation: true,
            showImmediateFeedback: false,
            timePerQuestion: null, // null for overall timer
            passingScore: 70,
            shuffleQuestions: true,
            shuffleAnswers: true
        };

        this.initializeEventListeners();
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
        const backClickHandler = backAction || 'window.enhancedQuizSystem.backToMenu()';

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
     * Initialize event listeners for quiz navigation
     */
    initializeEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.quizState.isQuizStarted || this.quizState.isQuizCompleted) return;

            switch(e.key) {
                case 'ArrowLeft':
                    if (this.config.allowBackNavigation) {
                        this.previousQuestion();
                    }
                    break;
                case 'ArrowRight':
                    this.nextQuestion();
                    break;
                case 'Enter':
                    if (e.ctrlKey || e.metaKey) {
                        this.submitQuiz();
                    }
                    break;
            }
        });
    }

    /**
     * Initialize quiz with questions
     */
    initializeQuiz(questions, config = {}) {
        console.log('🚀 Initializing Enhanced Quiz System...');
        console.log(`📝 Questions received: ${questions.length}`);

        // Validate questions
        if (!questions || questions.length === 0) {
            throw new Error('No questions provided for quiz initialization');
        }

        // Validate question format
        questions.forEach((q, index) => {
            const hasQuestion = q.pertanyaan || q.question;
            const hasOptions = q.options || q.jawaban;

            if (!hasQuestion || !hasOptions) {
                console.warn(`⚠️ Question ${index + 1} has invalid format:`, q);
                console.warn(`Missing:`, {
                    question: hasQuestion ? '✓' : '✗',
                    options: hasOptions ? '✓' : '✗',
                    data: q
                });
            }
        });

        // Merge config with defaults
        this.config = { ...this.config, ...config };
        console.log('⚙️ Quiz config:', this.config);

        // Shuffle questions if enabled
        const shuffledQuestions = this.config.shuffleQuestions ? this.shuffleArray([...questions]) : [...questions];

        // Reset state
        this.quizState = {
            questions: shuffledQuestions,
            currentQuestionIndex: 0,
            answers: new Array(shuffledQuestions.length).fill(null),
            score: 0,
            isQuizStarted: false,
            isQuizCompleted: false,
            timeRemaining: this.config.timeLimit || 600,
            timerInterval: null,
            startTime: null,
            endTime: null,
            userCanNavigate: this.config.allowBackNavigation,
            showResults: this.config.showResults,
            category: this.config.category || 'final'
        };

        // Shuffle answers for each question if enabled
        if (this.config.shuffleAnswers) {
            this.quizState.questions = this.quizState.questions.map(question => {
                if (question.options && (question.type === 'multiple-choice' || !question.type)) {
                    return this.shuffleQuestionAnswers(question);
                }
                return question;
            });
        }

        console.log(`✅ Quiz initialized with ${this.quizState.questions.length} questions`);
    }

    /**
     * Start the quiz
     */
    startQuiz() {
        console.log('🚀 Starting Enhanced Quiz with', this.quizState.questions.length, 'questions');

        if (this.quizState.questions.length === 0) {
            console.error('No questions available for quiz');
            this.showQuizError('Tidak ada soal yang tersedia untuk kuis.');
            return;
        }

        this.quizState.isQuizStarted = true;
        this.quizState.startTime = new Date();

        // Start timer if configured
        if (this.config.timePerQuestion || this.quizState.timeRemaining > 0) {
            this.startTimer();
        }

        // Show first question
        this.showQuizInterface();

        console.log('Quiz started successfully');
    }

    /**
     * Show quiz interface
     */
    showQuizInterface() {
        console.log('Showing quiz interface...');
        console.log('Questions available:', this.quizState.questions.length);

        const contentPages = document.getElementById('contentPages');
        if (!contentPages) {
            console.error('Content pages container not found');
            return;
        }

        try {
            const timerInfo = `<div class="quiz-timer" id="quizTimer">${this.formatTime(this.quizState.timeRemaining)}</div>`;
            contentPages.innerHTML = `
                <div class="page" data-page="quiz">
                    ${this.generatePageHeader('Kuis Jaringan Komputer', `Final Quiz - ${this.quizState.category}`, true, 'window.enhancedQuizSystem.exitQuiz()', timerInfo)}

                    <div class="page-content">
                        <div class="container">
                            <div class="enhanced-quiz-container">
                                <!-- Quiz Header -->
                                <div class="quiz-header">
                                    <div class="quiz-info">
                                        <div class="quiz-title">Final Quiz - ${this.quizState.category}</div>
                                        <div class="quiz-meta">
                                            <span class="question-count">
                                                Soal <span id="currentQuestionNumber">1</span> dari <span id="totalQuestions">${this.quizState.questions.length}</span>
                                            </span>
                                            <div class="quiz-timer" id="quizTimer">
                                                ${this.formatTime(this.quizState.timeRemaining)}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="quiz-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" id="quizProgressFill" style="width: ${this.getProgressPercentage()}%"></div>
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
                                    <button class="btn btn-secondary" id="btnPrevQuestion" onclick="window.enhancedQuizSystem.previousQuestion()" disabled>
                                        ← Sebelumnya
                                    </button>

                                    <div class="navigation-info">
                                        <span id="navigationStatus">Pilih jawaban untuk melanjutkan</span>
                                    </div>

                                    <button class="btn btn-primary" id="btnNextQuestion" onclick="window.enhancedQuizSystem.nextQuestion()" disabled>
                                        Selanjutnya →
                                    </button>
                                </div>

                                <!-- Action Buttons -->
                                <div class="quiz-actions">
                                    <button class="btn btn-outline" onclick="window.enhancedQuizSystem.clearCurrentAnswer()">
                                        Hapus Jawaban
                                    </button>
                                    <button class="btn btn-success" id="btnSubmitQuiz" onclick="window.enhancedQuizSystem.submitQuiz()" style="display: none;">
                                        Selesai & Lihat Hasil
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

            console.log('Quiz interface HTML set successfully');

            // Render first question
            this.renderCurrentQuestion();
            console.log('First question rendered');

            this.bindQuizEvents();
            console.log('Quiz events bound');

        } catch (error) {
            console.error('Error showing quiz interface:', error);
            this.showQuizError('Error showing quiz interface: ' + error.message);
        }
    }

    /**
     * Generate question indicators HTML
     */
    generateQuestionIndicators() {
        return this.quizState.questions.map((_, index) => {
            const hasAnswer = this.quizState.answers[index] !== null;
            const isCurrent = index === this.quizState.currentQuestionIndex;
            const isVisited = index < this.quizState.currentQuestionIndex;

            let className = 'question-indicator';
            if (isCurrent) className += ' current';
            if (hasAnswer) className += ' answered';
            if (isVisited && !hasAnswer) className += ' skipped';

            return `
                <div class="${className}"
                     onclick="window.enhancedQuizSystem.goToQuestion(${index})"
                     title="Soal ${index + 1}${hasAnswer ? ' (Sudah dijawab)' : isVisited ? ' (Dilewati)' : ''}">
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
        console.log('Rendering question:', this.quizState.currentQuestionIndex);
        console.log('Total questions:', this.quizState.questions.length);
        console.log('Current question:', this.quizState.questions[this.quizState.currentQuestionIndex]);

        const question = this.quizState.questions[this.quizState.currentQuestionIndex];
        if (!question) {
            console.error('No question found at index:', this.quizState.currentQuestionIndex);
            this.showQuizError('Soal tidak ditemukan. Silakan coba lagi.');
            return;
        }

        const container = document.getElementById('questionContainer');
        if (!container) {
            console.error('Question container not found');
            this.showQuizError('Container soal tidak ditemukan. Silakan refresh halaman.');
            return;
        }

        const currentAnswer = this.quizState.answers[this.quizState.currentQuestionIndex];

        try {
            container.innerHTML = this.generateQuestionHTML(question, currentAnswer);
            console.log('Question HTML generated successfully');

            // Update navigation and progress
            this.updateNavigation();
            this.updateProgress();
            this.updateIndicators();

            console.log('Question rendered successfully:', this.quizState.currentQuestionIndex + 1);
        } catch (error) {
            console.error('Error rendering question:', error);
            this.showQuizError('Error rendering question: ' + error.message);
        }
    }

    /**
     * Generate question HTML based on type
     */
    generateQuestionHTML(question, currentAnswer) {
        const questionNumber = this.quizState.currentQuestionIndex + 1;

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
        const options = question.options || question.jawaban || [];

        return `
            <div class="options-grid">
                ${options.map((option, index) => {
                    const isSelected = currentAnswer === index;
                    const letter = String.fromCharCode(65 + index); // A, B, C, D...

                    return `
                        <div class="option-card ${isSelected ? 'selected' : ''}"
                             data-index="${index}"
                             onclick="window.enhancedQuizSystem.selectAnswer(${index})">
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
        const isSelected = currentAnswer !== null;
        const selectedValue = currentAnswer === true ? 'Benar' : 'Salah';

        return `
            <div class="true-false-options">
                <div class="option-card large ${currentAnswer === true ? 'selected' : ''}"
                     data-value="true"
                     onclick="window.enhancedQuizSystem.selectAnswer(true)">
                    <div class="option-icon">✓</div>
                    <div class="option-text">Benar</div>
                    ${currentAnswer === true ? '<div class="option-selected-mark">✓</div>' : ''}
                </div>

                <div class="option-card large ${currentAnswer === false ? 'selected' : ''}"
                     data-value="false"
                     onclick="window.enhancedQuizSystem.selectAnswer(false)">
                    <div class="option-icon">✗</div>
                    <div class="option-text">Salah</div>
                    ${currentAnswer === false ? '<div class="option-selected-mark">✓</div>' : ''}
                </div>
            </div>
        `;
    }

    /**
     * Generate fill in the blank HTML
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
                           onkeyup="window.enhancedQuizSystem.handleFillBlankInput(event)">
                    <button class="btn btn-primary" onclick="window.enhancedQuizSystem.submitFillBlank()">
                        Simpan
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Handle fill blank input
     */
    handleFillBlankInput(event) {
        const input = event.target;
        const value = input.value.trim();

        // Enable/disable next button based on input
        const nextBtn = document.getElementById('btnNextQuestion');
        if (nextBtn) {
            nextBtn.disabled = !value;
        }

        // Update navigation status
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
            // For fill blank questions, we'll store the text value
            this.quizState.answers[this.quizState.currentQuestionIndex] = value;
            this.updateNavigation();
            this.updateIndicators();
        }
    }

    /**
     * Select answer for current question
     */
    selectAnswer(answerIndex) {
        const question = this.quizState.questions[this.quizState.currentQuestionIndex];
        const isBoolean = typeof answerIndex === 'boolean';

        // Store answer
        this.quizState.answers[this.quizState.currentQuestionIndex] = answerIndex;

        // Update UI
        document.querySelectorAll('.option-card').forEach((option, index) => {
            option.classList.remove('selected');
            const checkMark = option.querySelector('.option-selected-mark');
            if (checkMark) checkMark.remove();
        });

        // Add selected state
        let selectedOption;
        if (isBoolean) {
            selectedOption = document.querySelector(`.option-card[data-value="${answerIndex}"]`);
        } else {
            selectedOption = document.querySelector(`.option-card[data-index="${answerIndex}"]`);
        }

        if (selectedOption) {
            selectedOption.classList.add('selected');
            selectedOption.innerHTML += '<div class="option-selected-mark">✓</div>';
        }

        // Update navigation
        this.updateNavigation();
        this.updateIndicators();

        console.log('Answer selected:', answerIndex, 'for question:', this.quizState.currentQuestionIndex);
    }

    /**
     * Navigate to previous question
     */
    previousQuestion() {
        if (!this.config.allowBackNavigation) return;

        if (this.quizState.currentQuestionIndex > 0) {
            this.quizState.currentQuestionIndex--;
            this.renderCurrentQuestion();

            console.log('Navigated to previous question:', this.quizState.currentQuestionIndex + 1);
        }
    }

    /**
     * Navigate to next question
     */
    nextQuestion() {
        const isLastQuestion = this.quizState.currentQuestionIndex === this.quizState.questions.length - 1;
        const hasAnswer = this.quizState.answers[this.quizState.currentQuestionIndex] !== null;

        if (isLastQuestion) {
            // Show submit button on last question
            const submitBtn = document.getElementById('btnSubmitQuiz');
            const nextBtn = document.getElementById('btnNextQuestion');

            if (submitBtn && nextBtn) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'block';
            }
        } else if (this.quizState.currentQuestionIndex < this.quizState.questions.length - 1) {
            this.quizState.currentQuestionIndex++;
            this.renderCurrentQuestion();

            console.log('Navigated to next question:', this.quizState.currentQuestionIndex + 1);
        }
    }

    /**
     * Go to specific question
     */
    goToQuestion(index) {
        if (!this.config.allowBackNavigation && index < this.quizState.currentQuestionIndex) {
            return;
        }

        if (index >= 0 && index < this.quizState.questions.length) {
            this.quizState.currentQuestionIndex = index;
            this.renderCurrentQuestion();

            console.log('Navigated to question:', index + 1);
        }
    }

    /**
     * Clear current answer
     */
    clearCurrentAnswer() {
        this.quizState.answers[this.quizState.currentQuestionIndex] = null;
        this.renderCurrentQuestion();
    }

    /**
     * Update navigation buttons
     */
    updateNavigation() {
        const prevBtn = document.getElementById('btnPrevQuestion');
        const nextBtn = document.getElementById('btnNextQuestion');
        const submitBtn = document.getElementById('btnSubmitQuiz');
        const clearBtn = document.querySelector('.quiz-actions .btn-outline');

        const isLastQuestion = this.quizState.currentQuestionIndex === this.quizState.questions.length - 1;
        const hasAnswer = this.quizState.answers[this.quizState.currentQuestionIndex] !== null;
        const isFirstQuestion = this.quizState.currentQuestionIndex === 0;

        // Previous button
        if (prevBtn) {
            prevBtn.disabled = isFirstQuestion || !this.config.allowBackNavigation;
        }

        // Next/Submit button
        if (nextBtn && submitBtn) {
            if (isLastQuestion) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'block';
                submitBtn.disabled = !hasAnswer;
            } else {
                nextBtn.style.display = 'block';
                submitBtn.style.display = 'none';
                nextBtn.disabled = !hasAnswer;
            }
        }

        // Clear button
        if (clearBtn) {
            clearBtn.disabled = !hasAnswer;
        }

        this.updateNavigationStatus(hasAnswer ? 'Jawaban tersimpan' : 'Pilih jawaban untuk melanjutkan');
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
        const progressFill = document.getElementById('quizProgressFill');
        const progressText = document.getElementById('quizProgressText');
        const currentQuestionNumber = document.getElementById('currentQuestionNumber');

        const percentage = this.getProgressPercentage();

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }

        if (progressText) {
            progressText.textContent = `${Math.round(percentage)}%`;
        }

        if (currentQuestionNumber) {
            currentQuestionNumber.textContent = this.quizState.currentQuestionIndex + 1;
        }
    }

    /**
     * Update question indicators
     */
    updateIndicators() {
        const indicatorsContainer = document.getElementById('questionIndicators');
        if (!indicatorsContainer) return;

        indicatorsContainer.innerHTML = this.generateQuestionIndicators();
    }

    /**
     * Get progress percentage
     */
    getProgressPercentage() {
        return ((this.quizState.currentQuestionIndex + 1) / this.quizState.questions.length) * 100;
    }

    /**
     * Start quiz timer
     */
    startTimer() {
        if (this.quizState.timerInterval) {
            clearInterval(this.quizState.timerInterval);
        }

        this.quizState.timerInterval = setInterval(() => {
            if (this.quizState.timeRemaining > 0) {
                this.quizState.timeRemaining--;
                this.updateTimer();
            } else {
                // Time's up
                this.submitQuiz();
            }
        }, 1000);
    }

    /**
     * Update timer display
     */
    updateTimer() {
        const timerElement = document.getElementById('quizTimer');
        if (timerElement) {
            timerElement.textContent = this.formatTime(this.quizState.timeRemaining);

            // Add warning class if time is running low
            if (this.quizState.timeRemaining <= 60) {
                timerElement.classList.add('warning');
            }
        }
    }

    /**
     * Format time display
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Submit quiz
     */
    submitQuiz() {
        if (this.quizState.isQuizCompleted) return;

        // Stop timer
        if (this.quizState.timerInterval) {
            clearInterval(this.quizState.timerInterval);
        }

        this.quizState.isQuizCompleted = true;
        this.quizState.endTime = new Date();

        // Calculate score
        this.calculateScore();

        // Show results
        this.showQuizResults();

        // Save to user data
        this.saveQuizResults();

        console.log('Quiz submitted with score:', this.quizState.score);
    }

    /**
     * Calculate quiz score
     */
    calculateScore() {
        let correctCount = 0;
        let totalPoints = 0;
        let earnedPoints = 0;

        this.quizState.questions.forEach((question, index) => {
            const userAnswer = this.quizState.answers[index];
            const correctAnswer = question.jawaban_benar || question.correctAnswer;
            const points = question.points || 10;

            totalPoints += points;

            if (userAnswer !== null) {
                if (question.type === 'fill-blank') {
                    // For fill blank, check if answer matches (case insensitive)
                    if (userAnswer.toString().toLowerCase() === correctAnswer.toString().toLowerCase()) {
                        correctCount++;
                        earnedPoints += points;
                    }
                } else if (userAnswer === correctAnswer) {
                    correctCount++;
                    earnedPoints += points;
                }
            }
        });

        this.quizState.correctAnswers = correctCount;
        this.quizState.totalQuestions = this.quizState.questions.length;
        this.quizState.score = Math.round((earnedPoints / totalPoints) * 100);
        this.quizState.earnedPoints = earnedPoints;
        this.quizState.totalPoints = totalPoints;
    }

    /**
     * Show quiz results
     */
    showQuizResults() {
        const contentPages = document.getElementById('contentPages');
        if (!contentPages) return;

        const passed = this.quizState.score >= this.config.passingScore;

        const title = passed ? '🎉 Selamat! Anda Lulus' : '💪 Belum Lulus, Coba Lagi!';
        const subtitle = passed ? 'Prestasi yang sangat baik!' : 'Terus belajar dan coba lagi.';
        const resultIcon = passed ? '🏆' : '📚';
        const extraInfo = `<div class="result-icon ${passed ? 'passed' : 'failed'}">${resultIcon}</div>`;

        contentPages.innerHTML = `
            <div class="page" data-page="quiz-results">
                ${this.generatePageHeader(title, subtitle, true, 'window.enhancedQuizSystem.backToMenu()', extraInfo)}

                <div class="page-content">
                    <div class="container">
                        <div class="quiz-results-container">
                            <div class="results-header">
                                <div class="score-display ${passed ? 'passed' : 'failed'}">
                                    <div class="score-circle">
                                        <span class="score-value">${this.quizState.score}%</span>
                                    </div>
                                    <h2>${passed ? '🎉 Selamat! Anda Lulus' : '💪 Belum Lulus, Coba Lagi!'}</h2>
                                    <p>${passed ? 'Prestasi yang sangat baik!' : 'Terus belajar dan coba lagi.'}</p>
                                </div>
                            </div>

                            <div class="results-stats">
                                <div class="stat-grid">
                                    <div class="stat-item">
                                        <div class="stat-value">${this.quizState.correctAnswers}</div>
                                        <div class="stat-label">Jawaban Benar</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${this.quizState.totalQuestions}</div>
                                        <div class="stat-label">Total Soal</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${this.quizState.earnedPoints}</div>
                                        <div class="stat-label">Poin Didapat</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${this.quizState.totalPoints}</div>
                                        <div class="stat-label">Total Poin</div>
                                    </div>
                                </div>
                            </div>

                            <div class="results-actions">
                                <button class="btn btn-primary" onclick="window.enhancedQuizSystem.reviewAnswers()">
                                    Lihat Jawaban
                                </button>
                                <button class="btn btn-secondary" onclick="window.enhancedQuizSystem.retryQuiz()">
                                    Coba Lagi
                                </button>
                                ${passed ? `
                                    <button class="btn btn-success" onclick="window.enhancedQuizSystem.downloadCertificate()">
                                        Unduh Sertifikat
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Review answers
     */
    reviewAnswers() {
        // Implementation for reviewing answers
        this.app.showNotification('Fitur review jawaban akan segera tersedia', 'info');
    }

    /**
     * Retry quiz
     */
    retryQuiz() {
        if (confirm('Apakah Anda ingin mencoba kuis lagi? Progress sebelumnya akan hilang.')) {
            this.app.showQuizPage();
        }
    }

    /**
     * Download certificate
     */
    downloadCertificate() {
        // Generate certificate if passed
        this.app.generateCertificate();
    }

    /**
     * Show quiz error
     */
    showQuizError(message) {
        const contentPages = document.getElementById('contentPages');
        if (!contentPages) return;

        contentPages.innerHTML = `
            <div class="page" data-page="quiz-error">
                ${this.generatePageHeader('Kuis - Error', 'Terjadi kesalahan saat memuat kuis', true, 'window.enhancedQuizSystem.backToMenu()')}

                <div class="page-content">
                    <div class="container">
                        <div class="error-container">
                            <div class="error-icon">⚠️</div>
                            <h2>Terjadi Kesalahan</h2>
                            <p>${message}</p>
                            <div class="error-details">
                                <h3>Informasi Debug:</h3>
                                <ul>
                                    <li>Quiz State: ${this.quizState.isQuizStarted ? 'Started' : 'Not Started'}</li>
                                    <li>Questions Available: ${this.quizState.questions.length}</li>
                                    <li>Current Question: ${this.quizState.currentQuestionIndex}</li>
                                    <li>Answers Array: ${JSON.stringify(this.quizState.answers)}</li>
                                </ul>
                            </div>
                            <div class="error-actions">
                                <button class="btn btn-primary" onclick="window.enhancedQuizSystem.retryQuiz()">
                                    Coba Lagi
                                </button>
                                <button class="btn btn-secondary" onclick="window.enhancedQuizSystem.backToMenu()">
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
     * Back to menu
     */
    backToMenu() {
        this.app.showMainMenu();
    }

    /**
     * Exit quiz
     */
    exitQuiz() {
        if (this.quizState.isQuizStarted && !this.quizState.isQuizCompleted) {
            if (confirm('Apakah Anda yakin ingin keluar dari kuis? Progress Anda akan hilang.')) {
                this.backToMenu();
            }
        } else {
            this.backToMenu();
        }
    }

    /**
     * Save quiz results to user data
     */
    saveQuizResults() {
        const quizResults = {
            category: this.quizState.category,
            score: this.quizState.score,
            correctAnswers: this.quizState.correctAnswers,
            totalQuestions: this.quizState.totalQuestions,
            timeSpent: this.quizState.endTime - this.quizState.startTime,
            date: new Date().toISOString(),
            passed: this.quizState.score >= this.config.passingScore
        };

        // Save to user data
        if (!this.app.userData.quizResults) {
            this.app.userData.quizResults = [];
        }
        this.app.userData.quizResults.push(quizResults);

        // Update overall scores
        this.app.userData.scores = this.app.userData.scores || {};
        this.app.userData.scores.quiz = quizResults;

        this.app.saveUserData();
    }

    /**
     * Bind quiz events
     */
    bindQuizEvents() {
        // Events are handled by onclick attributes in HTML
        // This method is for any additional event binding needed
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
        if (!question.options || !Array.isArray(question.options)) {
            return question;
        }

        const shuffledQuestion = { ...question };
        const correctAnswerIndex = question.jawaban_benar || question.correctAnswer;

        const optionsWithIndex = question.options.map((option, index) => ({
            text: option,
            isCorrect: index === correctAnswerIndex
        }));

        // Shuffle options
        const shuffledOptions = this.shuffleArray(optionsWithIndex);

        // Update question with shuffled options and new correct answer index
        shuffledQuestion.options = shuffledOptions.map(opt => opt.text);
        shuffledQuestion.jawaban_benar = shuffledOptions.findIndex(opt => opt.isCorrect);
        shuffledQuestion.correctAnswer = shuffledOptions.findIndex(opt => opt.isCorrect);

        return shuffledQuestion;
    }
}

// Initialize Enhanced Quiz System
window.enhancedQuizSystem = null;

// Auto-initialize when the main app is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.mpiApp) {
            window.enhancedQuizSystem = new EnhancedQuizSystem(window.mpiApp);
            console.log('Enhanced Quiz System initialized');
        }
    }, 1000);
});