const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));

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
    console.log("Memulai proses render Experience..."); 
    
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

// 5. JALANKAN SAAT HALAMAN SIAP
document.addEventListener('DOMContentLoaded', loadPortfolioData);

