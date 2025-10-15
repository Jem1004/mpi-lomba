/**
 * Terminal Manager Module
 * Handles terminal session and user input
 */

class TerminalManager {
    constructor(app) {
        this.app = app;
        this.terminalOutput = null;
        this.nameInput = null;
        this.isProcessing = false;
    }

    /**
     * Initialize terminal functionality
     */
    init() {
        this.terminalOutput = document.getElementById('terminalOutput');
        this.nameInput = document.getElementById('nameInput');

        if (this.nameInput) {
            this.nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !this.isProcessing) {
                    this.handleNameSubmit();
                }
            });
        }
    }

    /**
     * Add typewriter effect to terminal lines
     */
    addTypewriterEffect(lines, delay = 500) {
        if (!this.terminalOutput) return;

        lines.forEach((line, index) => {
            setTimeout(() => {
                this.addTerminalLine(line);
            }, index * delay);
        });
    }

    /**
     * Add a line to terminal output
     */
    addTerminalLine(text, className = '') {
        if (!this.terminalOutput) return;

        const lineElement = document.createElement('div');
        lineElement.className = `terminal-line ${className}`;
        lineElement.innerHTML = this.formatTerminalText(text);
        this.terminalOutput.appendChild(lineElement);
        this.scrollToBottom();
    }

    /**
     * Format terminal text with highlighting
     */
    formatTerminalText(text) {
        return text
            .replace(/\✓/g, '<span class="success">✓</span>')
            .replace(/\[([^\]]+)\]/g, '<span class="command">[$1]</span>')
            .replace(/(error|gagal|salah)/gi, '<span class="terminal-error">$1</span>')
            .replace(/(success|berhasil|benar)/gi, '<span class="terminal-success">$1</span>')
            .replace(/(warning|peringatan)/gi, '<span class="terminal-warning">$1</span>');
    }

    /**
     * Handle name submission
     */
    async handleNameSubmit() {
        if (!this.nameInput || this.isProcessing) return;

        const name = this.nameInput.value.trim();
        if (!name) {
            this.addTerminalLine('[ERROR] Nama tidak boleh kosong. Masukkan nama Anda:', 'error');
            this.shakeTerminal();
            return;
        }

        this.isProcessing = true;

        // Show processing indicator
        this.addTerminalLine(`[PROCESSING] Memproses nama: ${name}...`);

        // Simulate processing time
        await this.delay(1000);

        // Save name to app and localStorage
        this.app.studentName = name;
        localStorage.setItem('studentName', name);

        // Show welcome message
        this.addTerminalLine(`[SUCCESS] Selamat datang, <span class="highlight">${name}</span>! Sistem siap.`, 'success');
        this.addTerminalLine('[INFO] Memuat database materi...');
        this.addTerminalLine('[INFO] Menginisialisasi modul pembelajaran...');
        this.addTerminalLine('[INFO] Memuat menu navigasi...');

        // Hide input
        const terminalInputLine = document.querySelector('.terminal-input-line');
        if (terminalInputLine) {
            terminalInputLine.style.display = 'none';
        }

        // Wait a moment before transitioning
        await this.delay(2000);

        // Transition to main menu
        this.app.transitionToMainMenu();
        this.isProcessing = false;
    }

    /**
     * Handle returning user
     */
    async handleReturningUser() {
        if (!this.app.studentName) return;

        this.addTerminalLine(`[INFO] Memuat ulang sesi untuk <span class="highlight">${this.app.studentName}</span>...`);
        this.addTerminalLine('[SUCCESS] Selamat datang kembali!', 'success');
        this.addTerminalLine('[INFO] Memuat menu navigasi...');

        // Hide input line
        const terminalInputLine = document.querySelector('.terminal-input-line');
        if (terminalInputLine) {
            terminalInputLine.style.display = 'none';
        }

        // Wait before transitioning
        await this.delay(1500);

        this.app.transitionToMainMenu();
    }

    /**
     * Show system status
     */
    showSystemStatus() {
        const lines = [
            '[root@smk-pembelajaran ~]# System check: ✓ OK',
            '[root@smk-pembelajaran ~]# Network modules: ✓ Loaded',
            '[root@smk-pembelajaran ~]# Interactive mode: ✓ Active',
            '[root@smk-pembelajaran ~]# Database connection: ✓ Connected',
            '[root@smk-pembelajaran ~]# AI Tutor: ✓ Online',
            '[root@smk-pembelajaran ~]# Certificate generator: ✓ Ready'
        ];

        this.addTypewriterEffect(lines, 300);
    }

    /**
     * Scroll terminal to bottom
     */
    scrollToBottom() {
        if (this.terminalOutput) {
            this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
        }
    }

    /**
     * Shake terminal for error indication
     */
    shakeTerminal() {
        const terminalSession = document.querySelector('.terminal-session');
        if (terminalSession) {
            terminalSession.classList.add('shake');
            setTimeout(() => {
                terminalSession.classList.remove('shake');
            }, 500);
        }
    }

    /**
     * Focus terminal input
     */
    focusInput() {
        if (this.nameInput) {
            setTimeout(() => {
                this.nameInput.focus();
            }, 100);
        }
    }

    /**
     * Clear terminal
     */
    clearTerminal() {
        if (this.terminalOutput) {
            this.terminalOutput.innerHTML = '';
        }
    }

    /**
     * Delay utility
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Add cursor blink effect
     */
    startCursorBlink() {
        const cursor = document.querySelector('.terminal-cursor');
        if (cursor) {
            cursor.style.animation = 'cursorBlink 1s infinite';
        }
    }

    /**
     * Stop cursor blink
     */
    stopCursorBlink() {
        const cursor = document.querySelector('.terminal-cursor');
        if (cursor) {
            cursor.style.animation = 'none';
        }
    }

    /**
     * Show loading animation
     */
    showLoading(message = 'Processing...') {
        this.addTerminalLine(`[LOADING] ${message}`);
        const loadingElement = document.createElement('div');
        loadingElement.className = 'terminal-loading';
        loadingElement.innerHTML = '<span class="loading-dots"></span>';

        if (this.terminalOutput) {
            this.terminalOutput.appendChild(loadingElement);
            this.scrollToBottom();
        }
    }

    /**
     * Hide loading animation
     */
    hideLoading() {
        const loadingElement = document.querySelector('.terminal-loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    /**
     * Add matrix rain effect (optional)
     */
    startMatrixRain() {
        const terminal = document.querySelector('.terminal-session');
        if (!terminal) return;

        const matrixRain = document.createElement('div');
        matrixRain.className = 'matrix-rain';
        terminal.appendChild(matrixRain);

        // Create matrix columns
        for (let i = 0; i < 10; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = `${Math.random() * 100}%`;
            column.style.animationDelay = `${Math.random() * 5}s`;
            column.style.animationDuration = `${5 + Math.random() * 10}s`;

            // Generate random characters
            const chars = '01';
            let text = '';
            for (let j = 0; j < 20; j++) {
                text += chars[Math.floor(Math.random() * chars.length)] + '<br>';
            }
            column.innerHTML = text;

            matrixRain.appendChild(column);
        }

        // Remove after animation
        setTimeout(() => {
            if (matrixRain.parentNode) {
                matrixRain.parentNode.removeChild(matrixRain);
            }
        }, 15000);
    }
}

export default TerminalManager;