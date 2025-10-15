/**
 * AI Tutor Virtual - Network Learning Assistant
 * Author: MPI Development Team
 * Version: 1.0.0
 * API: DeepSeek
 */

class AITutor {
    constructor() {
        this.apiKey = 'sk-da32554ed40f41bcb3cc53fef4bdfe88';
        this.apiEndpoint = 'https://api.deepseek.com/v1/chat/completions';
        this.conversationHistory = [];
        this.maxHistoryLength = 10;
        this.isTyping = false;

        // Network topics scope
        this.allowedTopics = [
            'OSI model', 'TCP/IP model', 'network layers', 'application layer', 'presentation layer',
            'session layer', 'transport layer', 'network layer', 'data link layer', 'physical layer',
            'IP address', 'IPv4', 'IPv6', 'subnetting', 'VLSM', 'CIDR', 'network address',
            'broadcast address', 'subnet mask', 'default gateway', 'DNS', 'DHCP', 'ARP', 'RARP',
            'routing', 'static routing', 'dynamic routing', 'OSPF', 'RIP', 'EIGRP', 'BGP',
            'switching', 'VLAN', 'STP', 'Ethernet', 'MAC address', 'frame', 'packet',
            'port number', 'TCP', 'UDP', 'HTTP', 'HTTPS', 'FTP', 'SSH', 'Telnet', 'SMTP',
            'network topology', 'star topology', 'bus topology', 'ring topology', 'mesh topology',
            'network devices', 'router', 'switch', 'hub', 'bridge', 'repeater', 'firewall',
            'cable types', 'UTP', 'STP', 'coaxial', 'fiber optic', 'wireless', 'WiFi',
            'network security', 'access control', 'encryption', 'VPN', 'network protocols',
            'troubleshooting', 'network commands', 'ping', 'traceroute', 'ipconfig', 'ifconfig',
            'network design', 'IP planning', 'address allocation', 'network segmentation'
        ];

        this.systemPrompt = `Kamu adalah AI Tutor Virtual untuk pembelajaran Jaringan Komputer di SMK TKJT.

KARAKTERistikmu:
- TEGAS dan KRITIS: Jangan mudah membenarkan jawaban salah. Koreksi kesalahan dengan jelas.
- LUGAS dan LANGSUNG: Berikan jawaban yang to the point tanpa basa-basi.
- DETAIL dan JELAS: Jelaskan konsep dengan contoh nyata dan aplikasi praktis.
- PENGAJAR YANG BERWIBAWA: Gunakan bahasa yang sopan namun tegas seperti guru profesional.

SCOPE materi yang boleh dibahas:
- Model OSI (7 layer) dan TCP/IP
- Alamat IP (IPv4/IPv6), Subnetting, VLSM, CIDR
- Protocol jaringan (TCP, UDP, HTTP, DNS, DHCP, etc.)
- Network devices (Router, Switch, Hub, Firewall)
- Network topology dan design
- Network security dasar
- Troubleshooting jaringan
- Commands jaringan (ping, traceroute, ipconfig)

ATURAN PENTING:
1. JAWAB HANYA jika pertanyaan berhubungan dengan jaringan komputer
2. TOLAK dengan tegas jika pertanyaan di luar scope
3. Koreksi kesalahan siswa dengan penjelasan yang detail
4. Berikan contoh praktis dan real-world scenarios
5. Gunakan analogi yang mudah dipahami
6. Sertakan referensi ke industri atau sertifikasi jika relevan

Contoh respons:
- Jika jawaban salah: "Salah! Itu adalah kesalahan umum. Mari saya perbaiki..."
- Jika pertanyaan baik: "Pertanyaan yang bagus! Mari kita bahas detailnya..."
- Jika di luar scope: "Pertanyaan ini di luar scope pembelajaran jaringan. Fokus pada materi yang ada."

Format response dalam Bahasa Indonesia yang formal dan edukatif.`;
    }

    /**
     * Initialize AI Tutor interface
     */
    initialize() {
        this.createInterface();
        this.bindEvents();
        this.showWelcomeMessage();
    }

    /**
     * Create AI Tutor interface
     */
    createInterface() {
        const container = document.querySelector('.ai-tutor-content');
        if (!container) return;

        container.innerHTML = `
            <div class="ai-tutor-container">
                <div class="ai-tutor-header">
                    <div class="tutor-avatar">
                        <svg viewBox="0 0 24 24" class="ai-icon">
                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                        </svg>
                    </div>
                    <div class="tutor-info">
                        <h3>AI Tutor Virtual</h3>
                        <p>Asisten Pembelajaran Jaringan Komputer</p>
                        <span class="tutor-status online">● Online</span>
                    </div>
                    <button class="btn-clear-chat" title="Clear Chat">
                        <svg viewBox="0 0 24 24">
                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                        </svg>
                    </button>
                </div>

                <div class="chat-container">
                    <div class="chat-messages" id="chatMessages">
                        <!-- Messages will be inserted here -->
                    </div>

                    <div class="typing-indicator" id="typingIndicator">
                        <span class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                        <span class="typing-text">AI Tutor sedang mengetik...</span>
                    </div>
                </div>

                <div class="chat-input-container">
                    <div class="input-wrapper">
                        <input
                            type="text"
                            id="tutorInput"
                            class="tutor-input"
                            placeholder="Tanyakan tentang jaringan komputer..."
                            maxlength="500"
                            autocomplete="off"
                        >
                        <button class="btn-send" id="btnSend" title="Kirim">
                            <svg viewBox="0 0 24 24">
                                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="input-info">
                        <span class="char-count">0/500</span>
                        <span class="help-text">Tekan Enter untuk kirim, Shift+Enter untuk baris baru</span>
                    </div>
                </div>

                <div class="quick-questions">
                    <h4>Pertanyaan Cepat:</h4>
                    <div class="quick-buttons">
                        <button class="btn-quick" data-question="Apa perbedaan TCP dan UDP?">TCP vs UDP</button>
                        <button class="btn-quick" data-question="Jelaskan proses subnetting!">Subnetting</button>
                        <button class="btn-quick" data-question="Bagaimana cara kerja OSI layer?">OSI Layer</button>
                        <button class="btn-quick" data-question="Apa fungsi router dan switch?">Devices</button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        const input = document.getElementById('tutorInput');
        const sendBtn = document.getElementById('btnSend');
        const clearBtn = document.querySelector('.btn-clear-chat');
        const quickBtns = document.querySelectorAll('.btn-quick');

        // Send message
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Character count
        input.addEventListener('input', (e) => {
            const charCount = e.target.value.length;
            document.querySelector('.char-count').textContent = `${charCount}/500`;
        });

        // Clear chat
        clearBtn.addEventListener('click', () => this.clearChat());

        // Quick questions
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                input.value = question;
                this.sendMessage();
            });
        });
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        const welcomeMessage = `
            <div class="message tutor-message">
                <div class="message-avatar">
                    <svg viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">AI Tutor</span>
                        <span class="message-time">${this.getCurrentTime()}</span>
                    </div>
                    <div class="message-text">
                        <p>Selamat datang di AI Tutor Virtual!</p>
                        <p>Saya adalah asisten pembelajaran untuk mata pelajaran <strong>Jaringan Komputer</strong> di SMK TKJT.</p>
                        <p><strong>Topik yang bisa saya bantu:</strong></p>
                        <ul>
                            <li>Model OSI dan TCP/IP</li>
                            <li>Alamat IP dan Subnetting</li>
                            <li>Protocol jaringan</li>
                            <li>Network devices</li>
                            <li>Troubleshooting jaringan</li>
                        </ul>
                        <p>Silakan ajukan pertanyaan Anda. Saya akan memberikan jawaban yang <strong>tegas, detail, dan jelas</strong>!</p>
                    </div>
                </div>
            </div>
        `;

        this.addMessage(welcomeMessage);
    }

    /**
     * Send message to AI
     */
    async sendMessage() {
        const input = document.getElementById('tutorInput');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        // Add user message
        this.addUserMessage(message);
        input.value = '';
        document.querySelector('.char-count').textContent = '0/500';

        // Check if message is relevant to networking
        if (!this.isRelevantToNetworking(message)) {
            this.showIrrelevantMessage();
            return;
        }

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await this.callDeepSeekAPI(message);
            this.hideTypingIndicator();
            this.addTutorMessage(response);
        } catch (error) {
            this.hideTypingIndicator();
            this.showErrorMessage(error);
        }
    }

    /**
     * Check if message is relevant to networking
     */
    isRelevantToNetworking(message) {
        const lowerMessage = message.toLowerCase();
        return this.allowedTopics.some(topic =>
            lowerMessage.includes(topic.toLowerCase())
        );
    }

    /**
     * Show message for irrelevant questions
     */
    showIrrelevantMessage() {
        const irrelevantResponse = `
            <div class="message tutor-message">
                <div class="message-avatar">
                    <svg viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">AI Tutor</span>
                        <span class="message-time">${this.getCurrentTime()}</span>
                    </div>
                    <div class="message-text warning">
                        <p><strong>PERTANYAAN DI LUAR SCOPE!</strong></p>
                        <p>Saya hanya akan menjawab pertanyaan tentang <strong>Jaringan Komputer</strong> untuk SMK TKJT.</p>
                        <p><strong>Topik yang saya bantu:</strong></p>
                        <ul>
                            <li>Model OSI dan TCP/IP</li>
                            <li>Alamat IP, Subnetting, VLSM</li>
                            <li>Protocol (TCP, UDP, HTTP, DNS, dll)</li>
                            <li>Network devices (Router, Switch, dll)</li>
                            <li>Network security dan troubleshooting</li>
                        </ul>
                        <p>Silakan ajukan pertanyaan yang relevan dengan materi jaringan!</p>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => {
            this.addMessage(irrelevantResponse);
        }, 500);
    }

    /**
     * Call DeepSeek API
     */
    async callDeepSeekAPI(message) {
        // Update conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        // Keep only last messages for context
        const contextHistory = this.conversationHistory.slice(-this.maxHistoryLength);

        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: this.systemPrompt },
                    ...contextHistory
                ],
                temperature: 0.7,
                max_tokens: 1000,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;

        // Update conversation history
        this.conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

        return assistantMessage;
    }

    /**
     * Add user message to chat
     */
    addUserMessage(message) {
        const userMessageHTML = `
            <div class="message user-message">
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">${this.getUserName()}</span>
                        <span class="message-time">${this.getCurrentTime()}</span>
                    </div>
                    <div class="message-text">
                        <p>${this.escapeHtml(message)}</p>
                    </div>
                </div>
                <div class="message-avatar user">
                    <svg viewBox="0 0 24 24">
                        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                    </svg>
                </div>
            </div>
        `;

        this.addMessage(userMessageHTML);
        this.scrollToBottom();
    }

    /**
     * Add tutor message to chat
     */
    addTutorMessage(message) {
        const formattedMessage = this.formatMessage(message);
        const tutorMessageHTML = `
            <div class="message tutor-message">
                <div class="message-avatar">
                    <svg viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">AI Tutor</span>
                        <span class="message-time">${this.getCurrentTime()}</span>
                    </div>
                    <div class="message-text">
                        ${formattedMessage}
                    </div>
                </div>
            </div>
        `;

        this.addMessage(tutorMessageHTML);
        this.scrollToBottom();
    }

    /**
     * Format AI message with proper styling
     */
    formatMessage(message) {
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^(.*)$/gm, '<p>$1</p>')
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<strong>.*?<\/strong>):<\/p>/g, '<p><strong>$1:</strong></p>')
            .replace(/<p>- (.*?)<\/p>/g, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/<p><ul>/g, '<ul>')
            .replace(/<\/ul><\/p>/g, '</ul>');
    }

    /**
     * Add message to chat container
     */
    addMessage(messageHTML) {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        }
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        this.isTyping = true;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.add('visible');
        }
        this.scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.remove('visible');
        }
    }

    /**
     * Show error message
     */
    showErrorMessage(error) {
        const errorMessageHTML = `
            <div class="message tutor-message">
                <div class="message-avatar">
                    <svg viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">AI Tutor</span>
                        <span class="message-time">${this.getCurrentTime()}</span>
                    </div>
                    <div class="message-text error">
                        <p><strong>KESALAHAN SISTEM!</strong></p>
                        <p>Terjadi kesalahan saat memproses pertanyaan Anda.</p>
                        <p><strong>Error:</strong> ${error.message}</p>
                        <p>Silakan coba lagi beberapa saat.</p>
                    </div>
                </div>
            </div>
        `;

        this.addMessage(errorMessageHTML);
    }

    /**
     * Clear chat history
     */
    clearChat() {
        if (confirm('Apakah Anda yakin ingin menghapus semua percakapan?')) {
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
                this.conversationHistory = [];
                this.showWelcomeMessage();
            }
        }
    }

    /**
     * Scroll to bottom of chat
     */
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }

    /**
     * Get current time in HH:MM format
     */
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Get user name from main app
     */
    getUserName() {
        // Try to get user name from main app
        if (window.mpiApp && window.mpiApp.studentName) {
            return window.mpiApp.studentName;
        }
        return 'Siswa';
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}