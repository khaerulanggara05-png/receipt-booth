const app = {
    config: {
        branding: {
            welcomeLogo: '🧾',
            welcomeTitle: 'Receipt Booth',
            welcomeSubtitle: 'Cetak kenangan dalam struk!',
            startButtonText: '✨ MULAI',
            storeName: 'MEMORY STORE',
            storeTagline: '★ Receipt Booth ★'
        },
        screens: {
            frameTitle: 'Pilih Paket',
            frameSubtitle: 'Pilih layout receipt kamu',
            paymentTitle: 'Pembayaran',
            paymentSubtitle: 'Scan QRIS untuk lanjut',
            cameraTitle: 'Ambil Foto',
            cameraSubtitle: 'Bersiaplah!'
        },
        packages: [
            { id: 1, name: 'Basic Receipt', description: '1 foto + quote aesthetic', price: 15000, photos: 1 },
            { id: 2, name: 'Double Fun', description: '2 foto + custom text', price: 25000, photos: 2 },
            { id: 3, name: 'Triple Vibes', description: '3 foto + dekorasi lengkap', price: 30000, photos: 3 },
            { id: 4, name: 'Ultimate Pack', description: '4 foto + premium design', price: 35000, photos: 4 }
        ],
        phrases: {
            thankYou: 'Terima kasih sudah berbagi momen!',
            footer: 'Keep the memories alive ✨',
            printingMsg: 'Receipt kamu sedang dicetak...',
            downloadMsg: 'Receipt berhasil diunduh!',
            emailMsg: 'Receipt dikirim ke email!'
        }
    },
    
    selectedPackage: null,
    currentPhoto: 0,
    capturedPhotos: [],
    paymentTimerInterval: null,

    init() {
        this.loadConfig();
        this.applyConfig();
        this.renderPackages();
    },

    loadConfig() {
        const saved = localStorage.getItem('receiptBoothConfig');
        if (saved) {
            this.config = JSON.parse(saved);
        }
    },

    applyConfig() {
        document.getElementById('welcomeLogo').textContent = this.config.branding.welcomeLogo;
        document.getElementById('welcomeTitle').textContent = this.config.branding.welcomeTitle;
        document.getElementById('welcomeSubtitle').textContent = this.config.branding.welcomeSubtitle;
        document.getElementById('startButtonText').textContent = this.config.branding.startButtonText;
        document.getElementById('receiptStoreName').textContent = this.config.branding.storeName;
        document.getElementById('receiptStoreTag').textContent = this.config.branding.storeTagline;
        document.getElementById('frameTitle').textContent = this.config.screens.frameTitle;
        document.getElementById('frameSubtitle').textContent = this.config.screens.frameSubtitle;
        document.getElementById('paymentTitle').textContent = this.config.screens.paymentTitle;
        document.getElementById('paymentSubtitle').textContent = this.config.screens.paymentSubtitle;
        document.getElementById('cameraTitle').textContent = this.config.screens.cameraTitle;
    },

    renderPackages() {
        const container = document.getElementById('frameOptions');
        container.innerHTML = '';
        this.config.packages.forEach(pkg => {
            const card = document.createElement('div');
            card.className = 'frame-card';
            card.setAttribute('data-package', pkg.id);
            card.onclick = () => this.selectPackage(pkg.id);
            card.innerHTML = `
                <div class="frame-info">
                    <div class="frame-name">${pkg.name}</div>
                    <div class="frame-desc">${pkg.description}</div>
                </div>
                <div class="frame-price">Rp ${pkg.price.toLocaleString('id-ID')}</div>
            `;
            container.appendChild(card);
        });
    },

    selectPackage(packageId) {
        this.selectedPackage = this.config.packages.find(p => p.id === packageId);
        document.querySelectorAll('.frame-card').forEach(card => card.classList.remove('selected'));
        document.querySelector(`[data-package="${packageId}"]`).classList.add('selected');
    },

    goToWelcome() {
        this.showScreen('welcomeScreen');
    },

    goToFrameSelection() {
        this.showScreen('frameScreen');
    },

    goToPayment() {
        if (!this.selectedPackage) {
            alert('Pilih paket dulu ya!');
            return;
        }
        document.getElementById('selectedPackage').textContent = this.selectedPackage.name;
        document.getElementById('packagePrice').textContent = `Rp ${this.selectedPackage.price.toLocaleString('id-ID')}`;
        document.getElementById('totalPrice').textContent = `Rp ${this.selectedPackage.price.toLocaleString('id-ID')}`;
        this.showScreen('paymentScreen');
        this.startPaymentTimer();
    },

    startPaymentTimer() {
        let timeLeft = 300;
        const timerEl = document.getElementById('paymentTimer');
        clearInterval(this.paymentTimerInterval);
        this.paymentTimerInterval = setInterval(() => {
            timeLeft--;
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            if (timeLeft <= 0) {
                clearInterval(this.paymentTimerInterval);
                alert('Waktu habis!');
                this.goToFrameSelection();
            }
        }, 1000);
    },

    simulatePayment() {
        clearInterval(this.paymentTimerInterval);
        this.showScreen('processingScreen');
        setTimeout(() => this.goToCamera(), 2000);
    },

    goToCamera() {
        this.currentPhoto = 0;
        this.capturedPhotos = [];
        this.updatePhotoProgress();
        this.showScreen('cameraScreen');
    },

    updatePhotoProgress() {
        document.getElementById('photoProgress').textContent = `${this.currentPhoto + 1}/${this.selectedPackage.photos}`;
    },

    startCapture() {
        const countdownEl = document.getElementById('countdown');
        const captureBtn = document.getElementById('captureBtn');
        captureBtn.disabled = true;
        let count = 3;
        countdownEl.style.display = 'block';
        countdownEl.textContent = count;
        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.textContent = count;
            } else {
                clearInterval(interval);
                countdownEl.textContent = '📸';
                setTimeout(() => {
                    this.capturePhoto();
                    countdownEl.style.display = 'none';
                    captureBtn.disabled = false;
                }, 500);
            }
        }, 1000);
    },

    capturePhoto() {
        this.currentPhoto++;
        this.capturedPhotos.push(`photo_${this.currentPhoto}.jpg`);
        this.updatePhotoProgress();
        if (this.currentPhoto >= this.selectedPackage.photos) {
            setTimeout(() => this.generateReceipt(), 1000);
        }
    },

    generateReceipt() {
        this.showScreen('processingScreen');
        setTimeout(() => {
            const receiptEl = document.getElementById('finalReceipt');
            const now = new Date();
            const receiptId = Math.floor(100000 + Math.random() * 900000);
            let html = `
                <div style="text-align: center; margin-bottom: 15px;">
                    <div style="font-size: 1.3em; font-weight: bold;">${this.config.branding.storeName}</div>
                    <div style="font-size: 0.9em; margin-top: 5px;">${this.config.branding.storeTagline}</div>
                </div>
                <div class="receipt-line"></div>
                <div style="margin: 15px 0;">
                    <div>Tanggal: ${now.toLocaleDateString('id-ID')}</div>
                    <div>Waktu: ${now.toLocaleTimeString('id-ID')}</div>
                    <div>Receipt #${receiptId}</div>
                </div>
                <div class="receipt-line"></div>
            `;
            this.capturedPhotos.forEach((photo, index) => {
                html += `<div class="photo-display"><div style="font-size: 3em;">📸</div><div>Foto ${index + 1}</div></div>`;
            });
            html += `
                <div class="receipt-line"></div>
                <div class="receipt-row"><span>Paket:</span><span>${this.selectedPackage.name}</span></div>
                <div class="receipt-row"><span>Jumlah foto:</span><span>${this.selectedPackage.photos} pcs</span></div>
                <div class="receipt-row"><span>Kebahagiaan:</span><span>Priceless</span></div>
                <div class="receipt-line"></div>
                <div class="receipt-row" style="font-weight: bold; font-size: 1.1em;"><span>TOTAL VIBES:</span><span>💯</span></div>
                <div class="receipt-line"></div>
                <div style="text-align: center; margin-top: 15px; font-size: 0.9em;">
                    <div>${this.config.phrases.thankYou}</div>
                    <div style="margin-top: 5px;">${this.config.phrases.footer}</div>
                </div>
            `;
            receiptEl.innerHTML = html;
            this.showScreen('resultScreen');
        }, 2500);
    },

    printReceipt() {
        this.showMessage(this.config.phrases.printingMsg);
        setTimeout(() => this.showMessage('Receipt sudah dicetak! Ambil di bawah ya 📄'), 2000);
    },

    downloadReceipt() {
        this.showMessage('Mengunduh receipt...');
        setTimeout(() => this.showMessage(this.config.phrases.downloadMsg), 1500);
    },

    toggleEmailForm() {
        document.getElementById('emailForm').classList.toggle('active');
    },

    sendEmail() {
        const email = document.getElementById('emailInput').value;
        if (!email || !email.includes('@')) {
            alert('Email tidak valid!');
            return;
        }
        this.showMessage(this.config.phrases.emailMsg);
        setTimeout(() => {
            document.getElementById('emailForm').classList.remove('active');
            document.getElementById('emailInput').value = '';
        }, 2000);
    },

    cancelSession() {
        if (confirm('Yakin batal? Foto akan hilang.')) {
            this.goToWelcome();
        }
    },

    restart() {
        this.selectedPackage = null;
        this.goToWelcome();
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    },

    showMessage(msg) {
        const statusEl = document.getElementById('statusMessage');
        statusEl.textContent = msg;
        statusEl.classList.add('active');
        setTimeout(() => statusEl.classList.remove('active'), 3000);
    },

    openAdminPanel() {
        const password = prompt('Masukkan password admin:');
        if (password === 'admin123') {
            window.open('admin.html', '_blank');
        } else if (password !== null) {
            alert('Password salah!');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
