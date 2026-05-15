const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));

  
  function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    document.body.style.overflow = '';
  }
  function closeModalOutside(e, id) {
    if (e.target === document.getElementById(id)) closeModal(id);
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });
  
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` && !a.classList.contains('nav-cta')
        ? 'var(--terra)' : '';
    });
  }, { passive: true });

function initAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { 
                e.target.classList.add('visible'); 
                observer.unobserve(e.target); 
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
}

const apiURL = "https://script.google.com/macros/s/AKfycbwNAekKd-Iw5uTsSp3N-npGTgNySwWw9RW4Xpv_0oxrwiHnZizNqd6LF68UMwG8Kzan/exec";

// 1. FUNGSI UTAMA (Hanya satu saja)
async function loadPortfolioData() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        // console.log("Data berhasil dimuat:", data);

        // Panggil semua fungsi render di sini
        if (data.profil) renderProfile(data.profil);
        if (data.expertise) renderExpertise(data.expertise);
        if (data.pengalaman) renderExperience(data.pengalaman);
        if (data.keahlian) renderSkills(data.keahlian);
        if (data.live_streaming) renderLiveHost(data.live_streaming);

        console.log(data);
        // 2. Jalankan animasi SETELAH elemen masuk ke HTML
        initAnimations();
        
    } catch (error) {
        console.error("Gagal memuat data:", error);
    }
}

// 2. FUNGSI RENDER PROFIL
function renderProfile(profileData) {
    if (!profileData || profileData.length === 0) return;
    const p = profileData[0]; 

    const taglineEl = document.getElementById('p-tagline');
    if(taglineEl && p.tagline) {
        taglineEl.innerHTML = p.tagline.replace(/\n/g, '<br>');
    }
    
    const bioEl = document.getElementById('p-bio');
    if(bioEl && p.bio) {
        bioEl.innerText = p.bio;
    }

    const fotoEl = document.getElementById('p-foto');
    if(fotoEl && p.nama) {
        fotoEl.alt = p.nama;
    }

    // Pastikan di HTML Anda ada id="p-lokasi" jika ingin menggunakan ini
    const lokasiEl = document.getElementById('p-lokasi');
    if(lokasiEl && p.lokasi) {
        lokasiEl.innerText = p.lokasi;
    }
}

// 3. FUNGSI RENDER EXPERTISE


function renderExpertise(expertiseData) {
    const container = document.getElementById('expertise-container');
    if (!container || !expertiseData) return;

    // Bersihkan container sebelum diisi data baru
    container.innerHTML = "";

    // Loop setiap baris data dari Google Sheets
    expertiseData.forEach((item, index) => {
        // Logika untuk tags: pisahkan berdasarkan koma dan hapus spasi berlebih
        const tagsHTML = item.tags 
            ? item.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('') 
            : '';

        // Buat struktur kartu HTML
        const card = `
            <div class="expertise-card">
                <h3 class="card-title">${item.judul}</h3>
                <p class="card-body">${item.deskripsi}</p>
                <div class="card-tags">
                    ${tagsHTML}
                </div>
            </div>
        `;
        
        container.innerHTML += card;
    });
}

// 1. Tambahkan pemanggilan di fungsi loadPortfolioData
// if (data.pengalaman) renderExperience(data.pengalaman);

// 2. Fungsi Render Experience
function renderExperience(experienceData) {
    // console.log("Memulai proses render Experience..."); 
    
    const container = document.getElementById('experience-container');
    if (!container) {
        console.error("EROR: ID 'experience-container' tidak ditemukan di HTML!");
        return;
    }

    if (!experienceData || experienceData.length === 0) {
        console.warn("PERINGATAN: Data pengalaman kosong atau tidak terbaca dari Sheets.");
        return;
    }

    let htmlContent = "";

    // Menggunakan FOR Loop Tradisional
    for (let i = 0; i < experienceData.length; i++) {
        const item = experienceData[i];
        console.log(`Memproses baris ke-${i}:`, item);

        // Gunakan nilai default jika kolom kosong agar tidak muncul "undefined"
        const tahun = item.tahun || "";
        const jabatan = item.jabatan || "";
        const perusahaan = item.perusahaan || "";
        const deskripsi = item.deskripsi ? item.deskripsi.replace(/\n/g, '<br>') : "";
        const tipe = item.tipe || "";

        htmlContent += `
            <div class="exp-item reveal">
                <div class="exp-period">${tahun}</div>
                <div>
                    <div class="exp-role">${jabatan}</div>
                    <div class="exp-company">${perusahaan}</div>
                    <p class="exp-desc">${deskripsi}</p>
                </div>
                <div class="exp-badge">${tipe}</div>
            </div>
        `;
    }

    container.innerHTML = htmlContent;
    console.log("Render Experience Selesai!");
}


// 2. Fungsi Render Skills
function renderSkills(skillsData) {
    const container = document.getElementById('skills-container');
    if (!container || !skillsData) return;

    container.innerHTML = skillsData.map(item => {
        // Tentukan warna bar berdasarkan level/kategori
        let barClass = "f-rose"; // Default
        if (item.level.toLowerCase() === 'expert') barClass = "f-rose";
        if (item.level.toLowerCase() === 'advanced') barClass = "f-sage";

        return `
            <div class="skill-cell">
                <div class="skill-icon-wrap">
                    ${getSkillIcon(item.nama_skill)}
                </div>
                <div class="skill-name">${item.nama_skill}</div>
                <div class="skill-level">${item.level}</div>
                <div class="skill-bar">
                    <div class="skill-fill ${barClass}" style="width: ${item.persentase}"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderLiveHost(livehostData) {
    const gridContainer = document.getElementById('livehost-container');
    const modalContainer = document.getElementById('modal-container');
    
    if (!gridContainer || !livehostData) return;

    gridContainer.innerHTML = ''; 
    modalContainer.innerHTML = '';

    livehostData.forEach((item, index) => {
        const id = `lh-modal-${index}`;

        // PROTEKSI: Jika tags kosong, berikan array kosong agar tidak error split
        const tagsRaw = item.tags || ""; 
        const tagsArray = tagsRaw ? tagsRaw.split(',') : [];
        const tagHtml = tagsArray.map(t => `<span class="lh-tag">${t.trim()}</span>`).join('');

        // PROTEKSI: Jika brand kosong
        const brandRaw = item.brands || "";
        const brandChips = brandRaw ? brandRaw.split('·').map(b => `<span class="modal-brand-chip">${b.trim()}</span>`).join('') : "";

        gridContainer.innerHTML += `
            <div class="lh-card reveal" onclick="openLhModal('${id}')">
                <div class="lh-thumb">
                    <img src="${item.image_path || 'assets/placeholder.png'}" alt="${item.title || 'Live Host'}">
                    <div class="lh-brand-pill"><span class="lh-brand-dot"></span>${brandRaw}</div>
                </div>
                <div class="lh-body">
                    <div class="lh-category">${item.category || ''}</div>
                    <div class="lh-title">${item.title || ''}</div>
                    <div class="lh-excerpt">${item.excerpt || ''}</div>
                    <div class="lh-tags">${tagHtml}</div>
                    <div class="lh-cta">Lihat Detail <svg viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
            </div>
        `;

        modalContainer.innerHTML += `
            <div class="modal-overlay" id="${id}" onclick="closeLhModalOutside(event, '${id}')" style="display:none;">
                <div class="modal-box">
                    <button class="modal-close" onclick="closeLhModal('${id}')">
                        <svg viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </button>
                    <div class="modal-img-placeholder">
                        <img class="modal-img" src="${item.image_path || 'assets/placeholder.png'}" alt="${item.title || ''}">
                    </div>
                    <div class="modal-content">
                        <div class="modal-category">${item.category || ''}</div>
                        <div class="modal-title">${item.title || ''}</div>
                        <div class="modal-brands">${brandChips}</div>
                        <div class="modal-divider"></div>
                        <div class="modal-stats">
                            <div class="modal-stat"><div class="modal-stat-val">${item.stat_val || '-'}</div><div class="modal-stat-label">Per Sesi</div></div>
                            <div class="modal-stat"><div class="modal-stat-val">${item.stat_schedule || '-'}</div><div class="modal-stat-label">Jadwal</div></div>
                            <div class="modal-stat"><div class="modal-stat-val">${item.stat_time || '-'}</div><div class="modal-stat-label">Waktu</div></div>
                            <div class="modal-stat"><div class="modal-stat-val">Video</div><a href="${item.video_link || '#'}" target="_blank" class="modal-stat-label">Link</a></div>
                        </div>
                        <div class="modal-divider"></div>
                        <div class="modal-desc">${item.full_desc || ''}</div>
                        <div class="modal-tags">${tagHtml}</div>
                    </div>
                </div>
            </div>
        `;
    });
}

// FUNGSI KONTROL MODAL
function openLhModal(id) {
    const m = document.getElementById(id);
    if(m) {
        m.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}
function closeLhModal(id) {
    const m = document.getElementById(id);
    if(m) {
        m.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
function closeLhModalOutside(e, id) {
    if (e.target.id === id) closeLhModal(id);
}


// 5. JALANKAN SAAT HALAMAN SIAP
document.addEventListener('DOMContentLoaded', loadPortfolioData);

