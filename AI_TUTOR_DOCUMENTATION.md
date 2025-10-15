# AI Tutor Virtual - Dokumentasi Teknis

## 📖 Overview

AI Tutor Virtual adalah asisten pembelajaran cerdas untuk mata pelajaran Jaringan Komputer di SMK TKJT. Dengan karakter yang tegas, kritis, dan lugas, AI Tutor memberikan penjelasan detail tentang konsep jaringan komputer.

## 🎯 Karakteristik AI Tutor

### Personality Traits:
- **TEGAS dan KRITIS**: Tidak mudah membenarkan jawaban salah
- **LUGAS dan LANGSUNG**: Jawaban to the point tanpa basa-basi
- **DETAIL dan JELAS**: Penjelasan mendalam dengan contoh nyata
- **PENGAJAR BERWIBAWA**: Bahasa sopan namun tegas

### Scope Pembelajaran:
- Model OSI (7 layer) dan TCP/IP
- Alamat IP (IPv4/IPv6), Subnetting, VLSM, CIDR
- Protocol jaringan (TCP, UDP, HTTP, DNS, DHCP, dll)
- Network devices (Router, Switch, Hub, Firewall)
- Network topology dan design
- Network security dasar
- Troubleshooting jaringan

## 🏗️ Arsitektur Teknis

### Stack Teknologi:
- **Frontend**: Vanilla JavaScript dengan CSS3
- **Backend**: DeepSeek API (GPT-like model)
- **Styling**: CSS dengan desain futuristic/terminal theme
- **Storage**: LocalStorage untuk history percakapan

### File Structure:
```
/js/
├── ai-tutor.js          # AI Tutor core functionality
├── app.js              # Main application integration

/css/
└── ai-tutor.css        # AI Tutor specific styles

/data/
├── materi.json         # Learning materials (knowledge base)
├── soal.json          # Assessment questions
└── tujuan_pembelajaran.json # Learning objectives
```

## 🔧 Konfigurasi API

### DeepSeek API Setup:
```javascript
// Konfigurasi di ai-tutor.js
this.apiKey = 'sk-da32554ed40f41bcb3cc53fef4bdfe88';
this.apiEndpoint = 'https://api.deepseek.com/v1/chat/completions';
```

### Model Configuration:
- **Model**: `deepseek-chat`
- **Temperature**: `0.7` (balanced creativity)
- **Max Tokens**: `1000` (detailed responses)
- **History Length**: `10` messages (context retention)

## 🛡️ Content Filtering & Safety

### Topic Filtering:
AI Tutor hanya merespons pertanyaan tentang jaringan komputer. Sistem menggunakan:

1. **Keyword Matching**: 50+ networking keywords
2. **Context Analysis**: Semantic relevance checking
3. **Explicit Rejection**: Pesan tegas untuk topik di luar scope

### Security Measures:
- **XSS Protection**: HTML escaping untuk user input
- **Input Validation**: Maksimum 500 karakter per pesan
- **Rate Limiting**: Prevention dari API abuse
- **Error Handling**: Graceful degradation untuk API failures

## 🎨 User Interface Design

### Chat Interface Components:

#### 1. Header Section:
- Avatar AI dengan animasi
- Status indicator (Online/Offline)
- Clear chat functionality
- User information display

#### 2. Message Area:
- Real-time message rendering
- Typing indicator animation
- Auto-scroll ke pesan terbaru
- Timestamp untuk setiap pesan

#### 3. Input Section:
- Character counter (0/500)
- Multi-line support (Shift+Enter)
- Quick question buttons
- Send button dengan hover effects

#### 4. Quick Actions:
- Pre-defined networking questions
- One-click topic selection
- Responsive button layout

### Responsive Design:
- **Desktop**: Full-width chat dengan sidebar
- **Tablet**: Adapted layout dengan thumb-friendly buttons
- **Mobile**: Optimized untuk one-handed usage

## 🧠 AI Prompt Engineering

### System Prompt Structure:
```
Kamu adalah AI Tutor Virtual untuk pembelajaran Jaringan Komputer di SMK TKJT.

KARAKTERistikmu:
- TEGAS dan KRITIS: Jangan mudah membenarkan jawaban salah
- LUGAS dan LANGSUNG: Berikan jawaban yang to the point
- DETAIL dan JELAS: Jelaskan konsep dengan contoh nyata
- PENGAJAR YANG BERWIBAWA: Gunakan bahasa sopan namun tegas

SCOPE materi: [detailed networking topics list]

ATURAN PENTING:
1. JAWAB HANYA jika relevan dengan jaringan
2. TOLAK dengan tegas jika di luar scope
3. Koreksi kesalahan dengan penjelasan detail
4. Berikan contoh praktis dan real-world scenarios
```

### Response Formatting:
- **Bold text**: Untuk konsep penting
- **Lists**: Untuk step-by-step explanations
- **Code blocks**: Untuk commands dan configurations
- **Emphasis**: Untuk warnings dan corrections

## 📊 Analytics & Monitoring

### User Interaction Tracking:
- Question frequency analysis
- Topic popularity metrics
- Response quality indicators
- Session duration tracking

### Performance Metrics:
- API response time monitoring
- Error rate tracking
- Success rate measurement
- User satisfaction scores

## 🔒 Privacy & Security

### Data Protection:
- **No PII Storage**: Tidak menyimpan data personal
- **Local History**: Chat history disimpan hanya di browser
- **API Security**: HTTPS encryption untuk API calls
- **Input Sanitization**: Prevention dari injection attacks

### Compliance:
- **GDPR Ready**: Data minimization principles
- **COPPA Compliant**: Safe untuk educational use
- **Accessibility**: WCAG 2.1 AA compliance

## 🚀 Deployment & Maintenance

### Environment Requirements:
- **Modern Browser**: ES6+ support required
- **HTTPS Required**: API calls need secure connection
- **CORS Enabled**: Cross-origin API access
- **Local Storage**: Browser storage capability

### Monitoring & Updates:
- **API Key Rotation**: Regular security updates
- **Prompt Optimization**: Continuous improvement
- **Performance Tuning**: Response time optimization
- **Bug Fixes**: Regular maintenance updates

## 📝 Testing Protocol

### Functional Testing:
1. **Basic Chat**: Message sending dan receiving
2. **Content Filtering**: Out-of-scope question handling
3. **Error Handling**: API failure scenarios
4. **UI Responsiveness**: Cross-device compatibility

### Performance Testing:
1. **Load Testing**: Multiple concurrent users
2. **Stress Testing**: API limit handling
3. **Latency Testing**: Response time measurement
4. **Memory Testing**: Browser performance impact

### User Acceptance Testing:
1. **Educator Review**: Content accuracy validation
2. **Student Testing**: Usability dan engagement
3. **Accessibility Testing**: Screen reader compatibility
4. **Security Testing**: Vulnerability assessment

## 🔮 Future Enhancements

### Planned Features:
1. **Voice Support**: Speech-to-text dan text-to-speech
2. **Multi-language**: Bahasa Inggris support
3. **Knowledge Base Expansion**: Advanced networking topics
4. **Personalization**: Adaptive learning paths

### Technical Improvements:
1. **Caching**: Response caching untuk common questions
2. **Offline Mode**: Limited offline functionality
3. **Analytics Dashboard**: Teacher insights panel
4. **Integration**: LMS system compatibility

---

## 📞 Support & Contact

Untuk pertanyaan teknis atau reporting issues:
- **Development Team**: MPI Development Team
- **Documentation Version**: 1.0.0
- **Last Updated**: 15 Oktober 2025

---

*AI Tutor Virtual dirancang khusus untuk meningkatkan kualitas pembelajaran Jaringan Komputer dengan pendekatan yang tegas, edukatif, dan teknologis.*