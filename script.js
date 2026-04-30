const USERNAME = 'ramadraf';

// ── journey data ──────────────────
const JOURNEY = [
    {
        date: '2024',
        title: 'Mulai kuliah Informatika',
        desc: 'Fondasi: algoritma, jaringan, sistem operasi. Pertama kali kenal dunia keamanan siber.',
        status: 'done'
    },
    {
        date: 'Awal 2025',
        title: 'Belajar AWS dari nol',
        desc: 'IAM, S3, EC2, VPC. Sadar betapa konfigurasi yang salah bisa jadi celah besar.',
        status: 'done'
    },
    {
        date: '2025',
        title: 'Aktif di GitHub',
        desc: 'Mulai build in public — setiap belajar ada output. Portofolio ini salah satunya.',
        status: 'done'
    },
    {
        date: 'Sekarang',
        title: 'CTF & hands-on security',
        desc: 'TryHackMe, HackTheBox, OWASP labs. Belajar cara berpikir attacker.',
        status: 'ongoing'
    },
    {
        date: 'Sekarang',
        title: 'Membangun cloud security portfolio',
        desc: 'Setiap project diarahkan ke security use case nyata: audit, hardening, monitoring.',
        status: 'ongoing'
    },
    {
        date: 'Next',
        title: 'AWS Security Specialty',
        desc: 'Sertifikasi sebagai validasi kompetensi yang diakui industri.',
        status: 'next'
    },
    {
        date: 'Next',
        title: 'Kontribusi open-source',
        desc: 'Beri balik ke komunitas. Karya ada, nama ada, bermanfaat.',
        status: 'next'
    }
];

// ── lang colors ──────────────────
const LC = {
    Python: '#4584b6', JavaScript: '#c8b400', TypeScript: '#2f74c0',
    Shell: '#6a9a3a', Go: '#00ADD8', Rust: '#b7410e',
    Java: '#5382a1', 'C++': '#f34b7d', HTML: '#c0390f',
    CSS: '#563d7c', PHP: '#6181b6', HCL: '#844fba',
    Dockerfile: '#0db7ed'
};

// ── github fetch ──────────────────
async function loadGitHub() {
    try {
        const r = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=30`);
        if (!r.ok) throw new Error();
        const repos = await r.json();

        const own = repos.filter(repo => !repo.fork);
        const stars = own.reduce((a, repo) => a + repo.stargazers_count, 0);
        
        document.getElementById('stat-repos').textContent = own.length;
        document.getElementById('stat-stars').textContent = stars;

        const loadingEl = document.getElementById('proj-loading');
        if (loadingEl) loadingEl.style.display = 'none';
        
        const list = document.getElementById('proj-list');
        list.innerHTML = ''; // Clear previous

        own.slice(0, 12).forEach(repo => {
            const color = LC[repo.language] || '#555';
            const langHtml = repo.language
                ? `<span class="proj-dot" style="background:${color}"></span><span class="proj-lang">${repo.language}</span>`
                : '';
            const starHtml = repo.stargazers_count > 0
                ? `<span class="proj-star">${repo.stargazers_count} ★</span>` : '';
            const updated = repo.updated_at.slice(0, 10);

            const a = document.createElement('a');
            a.className = 'proj-item';
            a.href = repo.html_url;
            a.target = '_blank';
            a.innerHTML = `
                <div>
                  <p class="proj-name">${repo.name}</p>
                  <p class="proj-desc">${repo.description || 'No description provided.'}</p>
                  <div class="proj-meta">${langHtml}</div>
                </div>
                <div class="proj-right">
                  ${starHtml}
                  <p class="proj-date">${updated}</p>
                </div>`;
            list.appendChild(a);
        });
    } catch (e) {
        const loadingEl = document.getElementById('proj-loading');
        if (loadingEl) loadingEl.textContent = `github.com/${USERNAME} — could not fetch`;
    }
}

// ── journey render ──────────────────
function loadJourney() {
    const labels = { done: '✓ completed', ongoing: '● in progress', next: '○ planned' };
    const el = document.getElementById('jrn-list');
    el.innerHTML = '';
    JOURNEY.forEach(j => {
        const item = document.createElement('div');
        item.className = `jrn-item ${j.status}`;
        item.innerHTML = `
            <div class="jrn-left">
              <div class="jrn-date">${j.date}</div>
              <div class="jrn-status ${j.status}">${labels[j.status]}</div>
            </div>
            <div>
              <p class="jrn-title">${j.title}</p>
              <p class="jrn-desc">${j.desc}</p>
            </div>`;
        el.appendChild(item);
    });
}

// ── scroll animations ──────────────────
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ── init ──────────────────
document.addEventListener('DOMContentLoaded', () => {
    const footYearEl = document.getElementById('foot-year');
    if (footYearEl) footYearEl.textContent = new Date().getFullYear();
    
    loadGitHub();
    loadJourney();
    initScrollAnimations();
});
