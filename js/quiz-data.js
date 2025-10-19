/**
 * Data Soal Terintegrasi untuk MPI Quiz System
 * Menggabungkan semua soal dalam satu file untuk menghindari fetch issues
 */

// Data soal komprehensif dari file soal.json
const QUESTION_DATA = {
    // Test Pengetahuan (Latihan Formatif)
    test_pengetahuan: [
        {
            id: 'tp-001',
            bab: "Model OSI Layer - Introduction",
            pertanyaan: "Apa tujuan utama dari OSI model?",
            options: [
                "Menstandarisasi protokol jaringan",
                "Mendefinisikan standar komunikasi antar sistem",
                "Menggantikan semua protokol yang ada",
                "Mempercepat transmisi data"
            ],
            jawaban_benar: 1,
            penjelasan: "OSI model dikembangkan untuk menyediakan standar komunikasi universal yang memfasilitasi interoperabilitas antar vendor berbeda dan membantu dalam troubleshooting.",
            difficulty: "easy",
            points: 10
        },
        {
            id: 'tp-002',
            bab: "Model OSI Layer - Application Layer",
            pertanyaan: "Manakah yang BUKAN termasuk fungsi Application Layer?",
            options: [
                "File transfer",
                "Resource sharing",
                "Physical addressing",
                "Email services"
            ],
            jawaban_benar: 2,
            penjelasan: "Physical addressing dilakukan pada Data Link Layer (MAC address) dan Network Layer (IP address), bukan pada Application Layer.",
            difficulty: "easy",
            points: 10
        },
        {
            id: 'tp-003',
            bab: "Model OSI Layer - Presentation Layer",
            pertanyaan: "Apa fungsi utama dari SSL/TLS dalam OSI model?",
            options: [
                "Routing packets",
                "Data compression",
                "Encryption dan decryption",
                "Frame formatting"
            ],
            jawaban_benar: 2,
            penjelasan: "SSL/TLS (Secure Sockets Layer/Transport Layer Security) berfungsi untuk encryption dan decryption data, yang merupakan tanggung jawab Presentation Layer.",
            difficulty: "medium",
            points: 15
        },
        {
            id: 'tp-004',
            bab: "Model OSI Layer - Session Layer",
            pertanyaan: "Protokol manakah yang berfungsi untuk session management?",
            options: [
                "HTTP",
                "TCP",
                "NetBIOS",
                "IP"
            ],
            jawaban_benar: 2,
            penjelasan: "NetBIOS (Network Basic Input/Output System) adalah protokol yang berfungsi untuk session management pada Session Layer OSI.",
            difficulty: "medium",
            points: 15
        },
        {
            id: 'tp-005',
            bab: "Model OSI Layer - Transport Layer",
            pertanyaan: "Perbedaan utama antara TCP dan UDP adalah:",
            options: [
                "TCP lebih cepat dari UDP",
                "TCP connection-oriented, UDP connectionless",
                "UDP lebih reliable dari TCP",
                "TCP menggunakan IP address, UDP tidak"
            ],
            jawaban_benar: 1,
            penjelasan: "TCP (Transmission Control Protocol) adalah connection-oriented dengan three-way handshake, sequencing, dan error recovery. UDP (User Datagram Protocol) adalah connectionless dan lebih cepat tapi tidak reliable.",
            difficulty: "medium",
            points: 15
        },
        {
            id: 'tp-006',
            bab: "Model OSI Layer - Network Layer",
            pertanyaan: "Protokol apa yang digunakan untuk IP address resolution?",
            options: [
                "ICMP",
                "ARP",
                "RARP",
                "DNS"
            ],
            jawaban_benar: 1,
            penjelasan: "ARP (Address Resolution Protocol) digunakan untuk mengkonversi IP address ke MAC address pada Network Layer.",
            difficulty: "easy",
            points: 10
        },
        {
            id: 'tp-007',
            bab: "Model OSI Layer - Data Link Layer",
            pertanyaan: "Berapa format MAC address yang benar?",
            options: [
                "192.168.1.1",
                "00:1A:2B:3C:4D:5E",
                "2001:0db8:85a3::",
                "www.example.com"
            ],
            jawaban_benar: 1,
            penjelasan: "MAC address memiliki format 6 bytes hexadecimal yang dipisahkan dengan titik dua (contoh: 00:1A:2B:3C:4D:5E).",
            difficulty: "easy",
            points: 10
        },
        {
            id: 'tp-008',
            bab: "Model OSI Layer - Physical Layer",
            pertanyaan: "Manakah yang BUKAN termasuk media transmisi Physical Layer?",
            options: [
                "UTP Cable",
                "Fiber Optic",
                "WiFi",
                "IP Address"
            ],
            jawaban_benar: 3,
            penjelasan: "IP Address adalah logical address pada Network Layer, bukan physical media. UTP, Fiber Optic, dan WiFi adalah media transmisi Physical Layer.",
            difficulty: "easy",
            points: 10
        }
    ],

    // Quiz Akhir (Evaluasi Final)
    quiz_akhir: [
        {
            id: 'qa-001',
            pertanyaan: "Data unit pada Data Link Layer disebut:",
            options: [
                "Segment",
                "Packet",
                "Frame",
                "Bit"
            ],
            jawaban_benar: 2,
            penjelasan: "Data unit pada Data Link Layer disebut Frame. Setiap layer memiliki data unit yang berbeda: Physical (Bit), Data Link (Frame), Network (Packet), Transport (Segment/Datagram).",
            difficulty: "medium",
            points: 15
        },
        {
            id: 'qa-002',
            pertanyaan: "Protokol yang menggunakan three-way handshake adalah:",
            options: [
                "UDP",
                "TCP",
                "ICMP",
                "ARP"
            ],
            jawaban_benar: 1,
            penjelasan: "TCP menggunakan three-way handshake (SYN, SYN-ACK, ACK) untuk membuka koneksi sebelum pengiriman data, menjamin reliable communication.",
            difficulty: "medium",
            points: 15
        },
        {
            id: 'qa-003',
            pertanyaan: "Berapa jumlah maksimum subnet yang dapat dibuat dari network 10.0.0.0/8 dengan /16?",
            options: [
                "256 subnet",
                "512 subnet",
                "1024 subnet",
                "65536 subnet"
            ],
            jawaban_benar: 0,
            penjelasan: "Network 10.0.0.0/8 memiliki 8 bits network. Dengan /16, kita meminjam 8 bits untuk subnet. Jumlah subnet = 2^8 = 256 subnet.",
            difficulty: "hard",
            points: 20
        },
        {
            id: 'qa-004',
            pertanyaan: "OSI Layer yang bertanggung jawab untuk routing adalah:",
            options: [
                "Layer 2 (Data Link)",
                "Layer 3 (Network)",
                "Layer 4 (Transport)",
                "Layer 5 (Session)"
            ],
            jawaban_benar: 1,
            penjelasan: "Layer 3 (Network Layer) bertanggung jawab untuk routing packet antar jaringan menggunakan logical addressing (IP addresses).",
            difficulty: "easy",
            points: 10
        },
        {
            id: 'qa-005',
            pertanyaan: "VLSM (Variable Length Subnet Mask) memberikan keuntungan:",
            options: [
                "Meningkatkan kecepatan jaringan",
                "Menghemat penggunaan IP address",
                "Memperbanyak jumlah broadcast",
                "Menyederhanakan konfigurasi"
            ],
            jawaban_benar: 1,
            penjelasan: "VLSM memungkinkan penggunaan subnet mask dengan panjang berbeda untuk subnet yang berbeda, sehingga IP address utilization lebih efisien dan mengurangi pemborosan.",
            difficulty: "medium",
            points: 15
        }
    ],

    // Soal Komprehensif (Tingkat Lanjut)
    soal_komprehensif: [
        {
            id: 'sk-001',
            kategori: "OSI Model - Advanced",
            pertanyaan: "Sebuah packet traveling dari source ke destination melalui 7 routers. Berapa kali encapsulation dan decapsulation terjadi?",
            options: [
                "7 kali encapsulation, 7 kali decapsulation",
                "1 kali encapsulation, 1 kali decapsulation",
                "7 kali encapsulation, 1 kali decapsulation",
                "1 kali encapsulation, 7 kali decapsulation"
            ],
            jawaban_benar: 0,
            penjelasan: "Setiap router melakukan decapsulation untuk membaca Network Layer, kemudian encapsulation kembali untuk forwarding. Dengan 7 routers, terjadi 7 kali decapsulation dan 7 kali encapsulation.",
            difficulty: "hard",
            points: 25
        },
        {
            id: 'sk-002',
            kategori: "OSI Model - Protocol Analysis",
            pertanyaan: "HTTPS encryption terjadi pada layer berapa?",
            options: [
                "Layer 4 (Transport)",
                "Layer 5 (Session)",
                "Layer 6 (Presentation)",
                "Layer 7 (Application)"
            ],
            jawaban_benar: 2,
            penjelasan: "SSL/TLS encryption untuk HTTPS terjadi pada Presentation Layer (Layer 6), yang bertanggung jawab untuk encryption, compression, dan data format translation.",
            difficulty: "medium",
            points: 20
        },
        {
            id: 'sk-003',
            kategori: "OSI Model - Device Function",
            pertanyaan: "Perangkat yang dapat membaca header dari Layer 2 sampai Layer 7 adalah:",
            options: [
                "Hub",
                "Switch",
                "Router",
                "Firewall"
            ],
            jawaban_benar: 3,
            penjelasan: "Modern firewall (Next-Generation Firewall) dapat inspect traffic dari Layer 2 (Data Link) sampai Layer 7 (Application) untuk security policy enforcement.",
            difficulty: "medium",
            points: 20
        }
    ]
};

// Built-in questions sebagai fallback
const BUILTIN_QUESTIONS = {
    network_basics: [
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
        }
    ]
};

// Utility functions untuk question management
const QuestionUtils = {
    /**
     * Normalize question data dari berbagai format
     */
    normalizeQuestion(question, category = 'mixed') {
        return {
            id: question.id || `question_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            type: question.type || 'multiple-choice',
            pertanyaan: question.pertanyaan || question.question || 'No question text',
            question: question.pertanyaan || question.question || 'No question text',
            options: question.options || question.jawaban || [],
            correctAnswer: question.jawaban_benar !== undefined ? question.jawaban_benar :
                         question.correctAnswer !== undefined ? question.correctAnswer : 0,
            jawaban_benar: question.jawaban_benar !== undefined ? question.jawaban_benar :
                         question.correctAnswer !== undefined ? question.correctAnswer : 0,
            explanation: question.penjelasan || question.explanation || 'No explanation available',
            difficulty: question.difficulty || 'medium',
            points: question.points || 10,
            category: category,
            tags: question.tags || [],
            bab: question.bab || ''
        };
    },

    /**
     * Get questions by category dengan fallback ke built-in
     */
    getQuestionsByCategory(category, difficulty = null) {
        let questions = [];

        // Try to get from QUESTION_DATA first
        if (QUESTION_DATA[category]) {
            questions = QUESTION_DATA[category].map(q => this.normalizeQuestion(q, category));
        }

        // Fallback to built-in questions if no questions found
        if (questions.length === 0 && BUILTIN_QUESTIONS[category]) {
            questions = BUILTIN_QUESTIONS[category].map(q => this.normalizeQuestion(q, category));
        }

        // Filter by difficulty if specified
        if (difficulty && difficulty !== 'mixed') {
            questions = questions.filter(q => q.difficulty === difficulty);
        }

        return questions;
    },

    /**
     * Get all available categories
     */
    getAllCategories() {
        const categories = Object.keys(QUESTION_DATA);
        const builtinCategories = Object.keys(BUILTIN_QUESTIONS);
        return [...new Set([...categories, ...builtinCategories])];
    },

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
    },

    /**
     * Shuffle question answers while tracking correct answer
     */
    shuffleQuestionAnswers(question) {
        if (!question.options || !Array.isArray(question.options) ||
            (question.type && question.type !== 'multiple-choice')) {
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
};

// Export untuk digunakan oleh sistem lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QUESTION_DATA, BUILTIN_QUESTIONS, QuestionUtils };
} else {
    window.QuestionData = { QUESTION_DATA, BUILTIN_QUESTIONS, QuestionUtils };
}