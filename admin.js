const adminApp = {
    config: {
        branding: { welcomeLogo: '🧾', welcomeTitle: 'Receipt Booth', welcomeSubtitle: 'Cetak kenangan dalam struk!', startButtonText: '✨ MULAI', storeName: 'MEMORY STORE', storeTagline: '★ Receipt Booth ★' },
        screens: { frameTitle: 'Pilih Paket', frameSubtitle: 'Pilih layout receipt kamu', paymentTitle: 'Pembayaran', paymentSubtitle: 'Scan QRIS untuk lanjut', cameraTitle: 'Ambil Foto', cameraSubtitle: 'Bersiaplah!' },
        packages: [
            { id: 1, name: 'Basic Receipt', description: '1 foto + quote aesthetic', price: 15000, photos: 1 },
            { id: 2, name: 'Double Fun', description: '2 foto + custom text', price: 25000, photos: 2 },
            { id: 3, name: 'Triple Vibes', description: '3 foto + dekorasi lengkap', price: 30000, photos: 3 },
            { id: 4, name: 'Ultimate Pack', description: '4 foto + premium design', price: 35000, photos: 4 }
        ],
        phrases: { thankYou: 'Terima kasih sudah berbagi momen!', footer: 'Keep the memories alive ✨', printingMsg: 'Receipt kamu sedang dicetak...', downloadMsg: 'Receipt berhasil diunduh!', emailMsg: 'Receipt dikirim ke email!' }
    },

    loadConfig() {
        const saved = localStorage.getItem('receiptBoothConfig');
        if (saved) this.config = JSON.parse(saved);
        this.populateForm();
        this.renderPackages();
        this.updatePreview();
    },

    populateForm() {
        document.getElementById('welcomeLogo').value = this.config.branding.welcomeLogo;
        document.getElementById('welcomeTitle').value = this.config.branding.welcomeTitle;
        document.getElementById('welcomeSubtitle').value = this.config.branding.welcomeSubtitle;
        document.getElementById('startButtonText').value = this.config.branding.startButtonText;
        document.getElementById('storeName').value = this.config.branding.storeName;
        document.getElementById('storeTagline').value = this.config.branding.storeTagline;
        document.getElementById('frameTitle').value = this.config.screens.frameTitle;
        document.getElementById('frameSubtitle').value = this.config.screens.frameSubtitle;
        document.getElementById('paymentTitle').value = this.config.screens.paymentTitle;
        document.getElementById('paymentSubtitle').value = this.config.screens.paymentSubtitle;
        document.getElementById('cameraTitle').value = this.config.screens.cameraTitle;
        document.getElementById('cameraSubtitle').value = this.config.screens.cameraSubtitle;
        document.getElementById('thankYou').value = this.config.phrases.thankYou;
        document.getElementById('footer').value = this.config.phrases.footer;
        document.getElementById('printingMsg').value = this.config.phrases.printingMsg;
        document.getElementById('downloadMsg').value = this.config.phrases.downloadMsg;
        document.getElementById('emailMsg').value = this.config.phrases.emailMsg;
    },

    renderPackages() {
        const container = document.getElementById('packagesList');
        container.innerHTML = '';
        this.config.packages.forEach((pkg, index) => {
            const card = document.createElement('div');
            card.className = 'package-card';
            card.innerHTML = `
                <button class="delete-btn" onclick="adminApp.deletePackage(${index})">🗑️ Hapus</button>
                <h3>Paket ${index + 1}</h3>
                <div class="form-group"><label>Nama Paket</label><input type="text" value="${pkg.name}" onchange="adminApp.updatePackage(${index}, 'name', this.value)"></div>
                <div class="form-group"><label>Deskripsi</label><input type="text" value="${pkg.description}" onchange="adminApp.updatePackage(${index}, 'description', this.value)"></div>
                <div class="grid-2">
                    <div class="form-group"><label>Harga (Rp)</label><input type="number" value="${pkg.price}" onchange="adminApp.updatePackage(${index}, 'price', parseInt(this.value))"></div>
                    <div class="form-group"><label>Jumlah Foto</label><input type="number" value="${pkg.photos}" min="1" max="10" onchange="adminApp.updatePackage(${index}, 'photos', parseInt(this.value))"></div>
                </div>
            `;
            container.appendChild(card);
        });
    },

    updatePackage(index, field, value) { this.config.packages[index][field] = value; this.updatePreview(); },
    deletePackage(index) { if (confirm('Yakin hapus paket ini?')) { this.config.packages.splice(index, 1); this.renderPackages(); this.updatePreview(); } },
    addNewPackage() {
        const newId = this.config.packages.length > 0 ? Math.max(...this.config.packages.map(p => p.id)) + 1 : 1;
        this.config.packages.push({ id: newId, name: 'Paket Baru', description: 'Deskripsi paket', price: 20000, photos: 2 });
        this.renderPackages();
        this.updatePreview();
    },

    switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    },

    setEmoji(fieldId, emoji) { document.getElementById(fieldId).value = emoji; },

    saveConfig() {
        this.config.branding.welcomeLogo = document.getElementById('welcomeLogo').value;
        this.config.branding.welcomeTitle = document.getElementById('welcomeTitle').value;
        this.config.branding.welcomeSubtitle = document.getElementById('welcomeSubtitle').value;
        this.config.branding.startButtonText = document.getElementById('startButtonText').value;
        this.config.branding.storeName = document.getElementById('storeName').value;
        this.config.branding.storeTagline = document.getElementById('storeTagline').value;
        this.config.screens.frameTitle = document.getElementById('frameTitle').value;
        this.config.screens.frameSubtitle = document.getElementById('frameSubtitle').value;
        this.config.screens.paymentTitle = document.getElementById('paymentTitle').value;
        this.config.screens.paymentSubtitle = document.getElementById('paymentSubtitle').value;
        this.config.screens.cameraTitle = document.getElementById('cameraTitle').value;
        this.config.screens.cameraSubtitle = document.getElementById('cameraSubtitle').value;
        this.config.phrases.thankYou = document.getElementById('thankYou').value;
        this.config.phrases.footer = document.getElementById('footer').value;
        this.config.phrases.printingMsg = document.getElementById('printingMsg').value;
        this.config.phrases.downloadMsg = document.getElementById('downloadMsg').value;
        this.config.phrases.emailMsg = document.getElementById('emailMsg').value;
        localStorage.setItem('receiptBoothConfig', JSON.stringify(this.config));
        this.updatePreview();
        this.showStatus('Perubahan berhasil disimpan! ✅');
    },

    updatePreview() { document.getElementById('configPreview').textContent = JSON.stringify(this.config, null, 2); },
    showStatus(message) {
        const statusBar = document.getElementById('statusBar');
        statusBar.textContent = message;
        statusBar.classList.add('show');
        setTimeout(() => statusBar.classList.remove('show'), 3000);
    },

    previewKiosk() { this.saveConfig(); window.open('index.html', '_blank'); },
    resetToDefault() { if (confirm('Yakin reset semua ke pengaturan default? Semua perubahan akan hilang!')) { localStorage.removeItem('receiptBoothConfig'); location.reload(); } },

    exportConfig() {
        const dataStr = JSON.stringify(this.config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'receipt-booth-config.json';
        link.click();
        this.showStatus('Konfigurasi berhasil di-export! 📥');
    },

    importConfig(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    this.config = imported;
                    localStorage.setItem('receiptBoothConfig', JSON.stringify(this.config));
                    this.populateForm();
                    this.renderPackages();
                    this.updatePreview();
                    this.showStatus('Konfigurasi berhasil di-import! ✅');
                } catch (error) { alert('File tidak valid!'); }
            };
            reader.readAsText(file);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => adminApp.loadConfig());
