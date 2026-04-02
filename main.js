/**
 * PORTFOLIO CORE ENGINE
 * Organized by Modules for better maintainability
 */

// 1. NAVIGATION & UI MODULE
const SiteManager = {
    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.header = document.getElementById('header');
        this.heroText = document.getElementById('hero-text');
        this.socialLinks = document.getElementById('social-links');
        this.allSections = document.querySelectorAll('.page-section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileLinks = document.querySelectorAll('#nav-wrapper .nav-menu a');
    },

    bindEvents() {
        // Expose to window for inline onclick attributes
        window.navigateTo = (id) => this.navigateTo(id);

        // Mobile menu auto-close
        this.mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                const navWrapper = document.getElementById('nav-wrapper');
                const bsCollapse = bootstrap.Collapse.getInstance(navWrapper);
                if (bsCollapse) bsCollapse.hide();
            });
        });
    },

    navigateTo(sectionId) {
        window.scrollTo(0, 0);

        // Toggle Home UI Elements
        const isHome = sectionId === 'home';
        if (this.heroText) this.heroText.style.display = isHome ? 'block' : 'none';
        if (this.socialLinks) this.socialLinks.style.display = isHome ? 'flex' : 'none';
        
        this.header.classList.toggle('header-top', !isHome);

        // Section Switching
        this.allSections.forEach(s => {
            const isTarget = s.id === sectionId;
            s.style.display = isTarget ? 'block' : 'none';
            s.classList.toggle('section-show', isTarget);
            s.style.opacity = isTarget ? '1' : '0';
        });

        // Update Active Nav Link
        this.navLinks.forEach(link => {
            const clickAttr = link.getAttribute('onclick');
            link.classList.toggle('active', clickAttr?.includes(`'${sectionId}'`));
        });
    }
};

// 2. TYPEWRITER MODULE
class TypewriterEffect {
    constructor(el, words) {
        this.el = el;
        this.words = words;
        this.index = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.words[this.index];
        this.isDeleting ? this.charIndex-- : this.charIndex++;
        
        this.el.textContent = current.substring(0, this.charIndex);

        let speed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.charIndex === current.length) {
            speed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.index = (this.index + 1) % this.words.length;
            speed = 150; 
        }
        
        setTimeout(() => this.type(), speed);
    }
}

// 3. PROJECTS MODULE
const ProjectManager = {
    data: [
        { 
            id: 0, 
            shortTitle: "Professional Digital Portfolio", 
            title: "Professional Synthesis: A Responsive Portfolio for Data Science and Quantitive Analyst Workflows",
            desc: `A custom-built, responsive web application designed to showcase quantitative research and data science 
            projects. Features a modular JavaScript-driven project filtering system, glass-morphism UI design, and secure 
            serverless contact integration via Web3Forms.`,
            stack: ["HTML5", "CSS3", "JavaScript", "Bootstrap 5", "Web3Forms"], 
            status: "Live", 
            type: "Web Engineering / UI Design",
            img: "images/preview/home-preview.gif",
            imgThumb: "images/projects/profile-thumb.jpg",
            demoLink: "#",
            githubLink: "https://github.com/amogelang-ramatlo/amogelang-ramatlo.github.io"
        },
        {
            id: 1, 
            shortTitle: "Conoravirus Dashboard",
            title: "Visualising Coronavirus Dynamics: An Integrated Spatiotemporal Animation and Interactive Shiny Dashboard",
            desc: `A comprehensive data engineering and visualization project leveraging R to analyze global transmission 
            patterns. Features a high-fidelity spatiotemporal GIF animation capturing viral spread over time, coupled with a 
            fully responsive R Shiny application for data interrogation. Includes a journalistic technical brief detailing 
            macro-scale trends discovered within the 160,000+ observation dataset.`,
            stack: ["R", "Shiny", "Tidyverse"],
            status: "Completed",
            type: "Data Science & Visualisation",
            img: "images/projects/covid-analysis-large.png",
            imgThumb: "images/projects/covid-analysis-thumb.png",
            demoLink: "https://amogelang-ramatlo.shinyapps.io/covid-19-explorer/",
            githubLink: "https://github.com/amogelang-ramatlo/covid-19-explorer"
        }, 
        {
            id: 2,
            shortTitle: "Medical Cost Classification",
            title: "Predictive Modelling of Medical Cost Volatility: A Comparative Study of SVM and Neural Network Architectures",
            desc: `An advanced classification study focused on predicting medical cost categories from a 1,000-observation dataset. 
            The project involves a rigorous EDA phase followed by the implementation and hyperparameter tuning of Support Vector 
            Machines (SVM) and Deep Neural Networks. Model performance was benchmarked using a multi-metric framework including 
            F1 Score, AUROC, and AUPRC to ensure robust risk stratification.`,
            stack: ["SVM", "Neural Networks", "LaTeX", "R", "Tidyverse"],
            status: "Completed",
            type: "Machine Learning / Statistical Research",
            img: "images/projects/medical-costs-large.png",
            imgThumb: "images/projects/medical-costs-thumb.png",
            demoLink: "docs/predict-medical-costs.pdf",
            githubLink: "https://github.com/amogelang-ramatlo/med-cost-benchmarking"
        }
    ],

    init() {
        this.cacheDOM();
        if (!this.gridList) return;
        this.renderAll();
        this.bindEvents();
        this.loadDetailView(0);
    },

    cacheDOM() {
        this.selectorList = document.getElementById('project-selector-list');
        this.detailPanel = document.getElementById('project-detail-panel');
        this.gridList = document.getElementById('project-grid-list');
        this.btnDetail = document.getElementById('btn-detail');
        this.btnGrid = document.getElementById('btn-grid');
        this.viewDetail = document.getElementById('view-detail');
        this.viewGrid = document.getElementById('view-grid');
    },

    renderBadges: (stack) => stack.map(s => `<span class="tech-badge">${s}</span>`).join(''),

    renderStatus: (status) => `<span class="status-badge ${status === 'Completed' ? 'status-completed' : 'status-progress'}">${status}</span>`,

    isCurrentPage(link) {
        // Returns true if the link is '#' or matches the current URL
        return link === "#" || link === window.location.href || link === window.location.origin + window.location.pathname;
    },

    renderAll() {
        // Render Selector Tiles
        this.selectorList.innerHTML = this.data.map(p => `
            <div class="project-tile" data-id="${p.id}">
                <img src="${p.imgThumb}" alt="${p.title}" class="tile-img">
                <div class="tile-info">
                    <h5>${p.shortTitle}</h5>
                    <div class="tile-badges">${this.renderBadges(p.stack.slice(0,2))}</div>
                </div>
            </div>`).join('');

        // Render Grid Cards
        this.gridList.innerHTML = this.data.map(p => `
            <div class="col-lg-4 col-md-6 col-12 mb-4">
                <div class="project-card"> 
                    <div class="card-img-wrapper">
                        <img src="${p.img}" alt="${p.title}" loading="lazy">
                    </div>
                    <div class="card-body">
                        <div class="title-status-group">
                            <h4>${p.title}</h4>
                            <div class="badge-wrapper">${this.renderStatus(p.status)}</div>
                            <p class="card-description">${p.desc}</p>
                        </div>
                        
                        <div class="card-footer-content">
                            <div class="mb-3 tech-badge-container">
                                ${this.renderBadges(p.stack.slice(0, 3))} 
                            </div>
                            <div class="action-btns">
                                ${this.isCurrentPage(p.demoLink) ? `
                                    <span class="btn-project btn-disabled" data-tooltip="You are currently viewing this project">
                                        <i class="bx bx-check-circle"></i> Current Site
                                    </span>
                                ` : `
                                    <a href="${p.demoLink}" target="_blank" class="btn-project">
                                        <i class="bx ${p.id === 2 ? 'bx-file' : 'bx-link-external'}"></i> 
                                        ${p.id === 2 ? 'Report' : 'Live'}
                                    </a>
                                `}
                                <a href="${p.githubLink}" target="_blank" class="btn-project">
                                    <i class="bx bxl-github"></i> GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`).join('');
    },

    loadDetailView(index) {
        const p = this.data[index];
        document.querySelectorAll('.project-tile').forEach(t => t.classList.toggle('active', t.dataset.id == index));

        this.detailPanel.style.animation = 'none';
        this.detailPanel.offsetHeight; 
        this.detailPanel.style.animation = null; 

        this.detailPanel.innerHTML = `
            <img src="${p.img}" alt="${p.title}" class="detail-main-img">
            <div class="d-flex justify-content-between align-items-start mb-2 title-status-group">
                <h3 style="color: var(--primary-color);">${p.title}</h3>
                <div class="badge-wrapper">${this.renderStatus(p.status)}</div>
            </div>
            <p class="text-muted mb-3" style="color: white !important;">${p.type}</p>
            <div class="mb-3">${this.renderBadges(p.stack)}</div>
            <p style="font-style: italic; opacity: 0.9;">${p.desc}</p>
            <div class="action-btns">
                ${this.isCurrentPage(p.demoLink) ? `
                    <span class="btn-project btn-disabled" data-tooltip="You are currently viewing this project">
                        <i class="bx bx-check-circle"></i> Live Demo
                    </span>
                ` : `
                    <a href="${p.demoLink}" target="_blank" class="btn-project">
                        <i class="bx ${p.id === 2 ? 'bx-file' : 'bx-link-external'}"></i> 
                        ${p.id === 2 ? 'Report' : 'Live Demo'}
                    </a>
                `}
                <a href="${p.githubLink}" target="_blank" class="btn-project">
                    <i class="bx bxl-github"></i> GitHub
                </a>
            </div>`;
    },

    bindEvents() {
        this.selectorList.addEventListener('click', (e) => {
            const tile = e.target.closest('.project-tile');
            if (tile) this.loadDetailView(parseInt(tile.dataset.id));
        });

        this.btnDetail.addEventListener('click', () => this.switchView('detail'));
        this.btnGrid.addEventListener('click', () => this.switchView('grid'));
    },

    switchView(view) {
        const isGrid = view === 'grid';
        this.btnDetail.classList.toggle('active', !isGrid);
        this.btnGrid.classList.toggle('active', isGrid);
        this.viewDetail.classList.toggle('active-view', !isGrid);
        this.viewGrid.classList.toggle('active-view', isGrid);
    }
};

// 4. CONTACT FORM MODULE
const ContactForm = {
    init() {
        const form = document.getElementById('contact-form');
        
        // Safety check: If there's no form on this page, stop here so it doesn't throw errors
        if (!form) return; 

        const formStatus = document.getElementById('form-status');
        const submitBtn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        const btnIcon = document.getElementById('btn-icon');

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Set Loading State
            submitBtn.disabled = true;
            btnText.innerText = 'Sending...';
            btnIcon.className = 'bx bx-loader-alt bx-spin'; 
            formStatus.style.display = 'none';
            formStatus.className = 'mt-4 text-center';

            const formData = new FormData(form);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.status === 200) {
                    formStatus.innerText = 'Message sent successfully! I will get back to you soon.';
                    formStatus.classList.add('status-success');
                    formStatus.style.display = 'block';
                    form.reset(); 
                } else {
                    formStatus.innerText = data.message || 'Something went wrong. Please try again.';
                    formStatus.classList.add('status-error');
                    formStatus.style.display = 'block';
                }
            } catch (error) {
                formStatus.innerText = 'Network error. Please check your connection and try again.';
                formStatus.classList.add('status-error');
                formStatus.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                btnText.innerText = 'Send Message';
                btnIcon.className = 'bx bx-paper-plane';
            }
        });
    }
};

// --- INITIALIZATION MASTER BLOCK ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize UI & Form
    SiteManager.init();
    ContactForm.init();
    ProjectManager.init();

    // 2. Start Vanta
    try {
        VANTA.NET({
            el: "#vanta-bg",
            mouseControls: false,
            touchControls: false,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x202020,
            backgroundColor: 0x0a0a0a,
            points: 10.0,
            maxDistance: 22.0,
            spacing: 20.0
        });
    } catch (err) { console.error("Vanta error:", err); }

    // 3. Start Typewriter
    const twEl = document.querySelector(".typewriter");
    if (twEl) new TypewriterEffect(twEl, ["AI/ML Engineer", "Data Analyst", "Data Scientist", "Quantitative Analyst"]);

    // Initialize Certificate Modal Logic
    const certModal = document.getElementById('certModal');
    if (certModal) {
        certModal.addEventListener('show.bs.modal', function (event) {
            // Button that triggered the modal
            const button = event.relatedTarget;
            
            // Extract info from data-* attributes
            const certTitle = button.getAttribute('data-cert-title');
            const certImgSrc = button.getAttribute('data-cert-img');
            
            // Update the modal's content
            const modalTitle = certModal.querySelector('.modal-title');
            const modalImg = certModal.querySelector('#modalCertImage');
            
            modalTitle.textContent = certTitle;
            modalImg.src = certImgSrc;
        });
    }
});

async function forceDownload(url, filename) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
            link.remove();
        }, 100);
        
    } catch (error) {
        console.error("Download failed, using fallback:", error);
        // Fallback: This will still likely open the viewer if CORS fails, 
        // but it's the safest 'plan B'.
        const fallbackLink = document.createElement('a');
        fallbackLink.href = url;
        fallbackLink.download = filename;
        fallbackLink.target = '_blank';
        fallbackLink.click();
    }
}