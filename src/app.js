import { supabase } from './supabase';
// Structo Web Application Engine
// Premier Real Estate Investment, Construction & Structural Engineering Platform

import { translations, defaultProjects, divisionsData, standardsData, defaultContactConfig, defaultPartners, defaultPartnersConfig, defaultDivisionsConfig } from './data.js';
import { ConstructionSimulator } from './components/simulator.js';

// Application State
const state = {
  lang: localStorage.getItem('structo_lang') || 'az',
  projects: JSON.parse(localStorage.getItem('structo_projects')) || defaultProjects,
  selectedCategory: 'all',
  
  // Track image mode for each project card: 'render' or 'raw'
  projectImageModes: {},

  // Calculator inputs
  calc: {
    landPrice: 3000000,
    buildableArea: 27000,
    costPerM2: 450,
    salePerM2: 950
  },

  // Financial configuration (default Structo 30% fee and 35% katlavan entry)
  financeConfig: JSON.parse(localStorage.getItem('structo_finance_config')) || {
    structoFeePercent: 30,
    katlavanInitialPercent: 35
  },

  // Stats configuration
  statsConfig: JSON.parse(localStorage.getItem('structo_stats_config')) || {
    stat1Val: "35% - 48%", stat1Label: "Ortalama Layihə ROI Gəlirliliyi",
    stat2Val: "180,000+ m²", stat2Label: "Monolit Tikinti Təcrübəsi",
    stat3Val: "B25 - B40", stat3Label: "Sertifikatlı Hidro-Beton Standartı",
    stat4Val: "9 Bal", stat4Label: "AZDTN Seysmik Dözümlülük Zəmanəti"
  },

  // Vertically Integrated Divisions (editable via admin)
  divisions: JSON.parse(localStorage.getItem('structo_divisions')) || divisionsData,
  divisionsConfig: JSON.parse(localStorage.getItem('structo_divisions_config')) || defaultDivisionsConfig,

  // Strategic & Institutional Partners (editable via admin)
  partners: JSON.parse(localStorage.getItem('structo_partners')) || defaultPartners,
  partnersConfig: JSON.parse(localStorage.getItem('structo_partners_config')) || defaultPartnersConfig,

  // Contact and Footer configuration (editable via admin)
  contactConfig: JSON.parse(localStorage.getItem('structo_contact_config')) || defaultContactConfig,

  // Admin session
  isAdmin: localStorage.getItem('structo_admin_logged') === 'true',
  adminEmail: localStorage.getItem('structo_admin_email') || 'structo.az0030@gmail.com',
  adminActiveTab: 'projects', // 'projects' | 'headlines' | 'stats' | 'finance' | 'partners' | 'divisions' | 'contact'

  // Custom editable headlines across the site
  siteContent: JSON.parse(localStorage.getItem('structo_site_content')) || null,

  // Selected project for details modal
  selectedProject: null,
  isDetailsModalOpen: false,
  isAdminModalOpen: false,
  isMobileMenuOpen: false,
  
  // Direct mail inquiry sent modal
  inquirySentModal: null
};

// Global helper to get translation
function t(key) {
  const dict = translations[state.lang] || translations.az;
  return dict[key] || key;
}

// Brand Logo Component
function getBrandLogoSVG() {
  return `
    <div class="flex items-center gap-3">
      <!-- Structural Pillar Accent -->
      <div class="flex flex-col w-1.5 h-10 rounded-sm overflow-hidden flex-shrink-0">
        <div class="h-1/2 bg-structo-500"></div>
        <div class="h-1/2 bg-slate-500"></div>
      </div>
      <!-- Typography -->
      <div class="flex flex-col">
        <span class="font-display font-black text-2xl tracking-tight text-white uppercase leading-none">
          STRUCTO
        </span>
        <span class="text-[10px] font-semibold tracking-wider text-structo-500 uppercase mt-0.5 leading-none">
          Built on Quality
        </span>
      </div>
    </div>
  `;
}

// Navigation Bar
function renderNav() {
  const container = document.getElementById('nav-container');
  if (!container) return;

  container.innerHTML = `
    <nav class="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-structo-500/20 bg-obsidian/95 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Brand Logo -->
          <a href="#hero-section" class="flex items-center group cursor-pointer">
            ${getBrandLogoSVG()}
          </a>

          <!-- Desktop Navigation Menus -->
          <div class="hidden xl:flex items-center space-x-1 lg:space-x-2">
            <a href="#hero-section" class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
              ${t('navHome')}
            </a>
            <a href="#interactive-construction-section" class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-structo-400 hover:text-white hover:bg-structo-500/10 rounded-lg transition-all flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-structo-500 animate-ping"></span>
              ${t('navSimulator')}
            </a>
            <a href="#calculator-section" class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
              ${t('navCalculator')}
            </a>
            <a href="#catalog-section" class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
              ${t('navProjects')}
            </a>
            <a href="#divisions-section" class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
              ${t('navDivisions')}
            </a>
            <a href="#standards-section" class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
              ${t('navStandards')}
            </a>
            <a href="#partners-section" class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
              ${t('navPartners')}
            </a>
            <a href="#contact-section" class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
              ${t('navContact')}
            </a>
          </div>

          <!-- Right Action Cluster -->
          <div class="flex items-center gap-3">
            <!-- Language Toggle Switch -->
            <button id="lang-toggle-btn" class="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-1 text-xs font-bold transition-all hover:border-slate-500 cursor-pointer">
              <span class="px-2 py-1 rounded ${state.lang === 'az' ? 'bg-structo-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}">AZ</span>
              <span class="px-2 py-1 rounded ${state.lang === 'en' ? 'bg-structo-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}">EN</span>
            </button>

            <!-- Admin Portal Button -->
            <button id="admin-modal-btn" class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${state.isAdmin ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-structo-500/50 hover:text-white'} cursor-pointer">
              <svg class="w-3.5 h-3.5 text-structo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <span class="hidden sm:inline">${state.isAdmin ? 'Admin Panel' : t('adminPortalBtn')}</span>
            </button>

            <!-- Mobile Hamburger Button -->
            <button id="mobile-menu-toggle" class="xl:hidden p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
              </svg>
            </button>
          </div>

        </div>

        <!-- Mobile Drawer Menu -->
        ${state.isMobileMenuOpen ? `
          <div class="xl:hidden py-4 border-t border-slate-800 bg-obsidian flex flex-col space-y-2">
            <a href="#hero-section" class="mobile-nav-link px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white">${t('navHome')}</a>
            <a href="#interactive-construction-section" class="mobile-nav-link px-3 py-2 text-sm font-semibold text-structo-400 hover:text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-structo-500"></span>
              ${t('navSimulator')}
            </a>
            <a href="#calculator-section" class="mobile-nav-link px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white">${t('navCalculator')}</a>
            <a href="#catalog-section" class="mobile-nav-link px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white">${t('navProjects')}</a>
            <a href="#divisions-section" class="mobile-nav-link px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white">${t('navDivisions')}</a>
            <a href="#standards-section" class="mobile-nav-link px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white">${t('navStandards')}</a>
            <a href="#partners-section" class="mobile-nav-link px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white">${t('navPartners')}</a>
            <a href="#contact-section" class="mobile-nav-link px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white">${t('navContact')}</a>
          </div>
        ` : ''}

      </div>
    </nav>
  `;

  // Bind Nav Events
  const langBtn = container.querySelector('#lang-toggle-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      state.lang = state.lang === 'az' ? 'en' : 'az';
      localStorage.setItem('structo_lang', state.lang);
      renderAll();
    });
  }

  const adminBtn = container.querySelector('#admin-modal-btn');
  if (adminBtn) {
    adminBtn.addEventListener('click', () => {
      state.isAdminModalOpen = true;
      renderModal();
    });
  }

  const mobileToggle = container.querySelector('#mobile-menu-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
      renderNav();
    });
  }

  const mobileLinks = container.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      state.isMobileMenuOpen = false;
      renderNav();
    });
  });
}

// Hero Section
function renderHero() {
  const container = document.getElementById('hero-section');
  if (!container) return;

  const title = (state.siteContent && state.siteContent[state.lang]?.heroTitle) || t('heroTitle');
  const subtitle = (state.siteContent && state.siteContent[state.lang]?.heroSubtitle) || t('heroSubtitle');
  const badge = (state.siteContent && state.siteContent[state.lang]?.heroBadge) || t('heroBadge');

  container.innerHTML = `
    <div class="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <!-- Architectural Background Glows -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-structo-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-slate-800/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left Column Content (7 cols) -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <!-- Strategic Badge with Brand Icon -->
            <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold bg-structo-500/10 text-structo-400 border border-structo-500/25 backdrop-blur-sm">
              <span class="w-2 h-2 rounded-full bg-structo-500"></span>
              <span class="tracking-wide">${badge}</span>
            </div>

            <!-- Main Heading with Perfect Azerbaijani Fonts -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              ${title}
            </h1>

            <!-- Subtitle -->
            <p class="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              ${subtitle}
            </p>

            <!-- Call to Actions -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a href="#interactive-construction-section" class="px-7 py-4 rounded-xl text-sm font-bold text-white structo-red-gradient shadow-lg shadow-structo-500/25 hover:brightness-110 transition-all flex items-center gap-2 group cursor-pointer">
                <span>${t('heroCtaSimulator')}</span>
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>

              <a href="#calculator-section" class="px-7 py-4 rounded-xl text-sm font-bold text-white bg-slate-900 border border-slate-700 hover:border-structo-500 hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer">
                <svg class="w-4 h-4 text-structo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <span>${t('heroCtaCalculator')}</span>
              </a>

              <a href="#catalog-section" class="px-5 py-4 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
                ${t('heroCtaExplore')} →
              </a>
            </div>

            <!-- Trust Bar with Key Metrics -->
            <div class="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <div class="text-xl sm:text-2xl font-black text-white">AZDTN</div>
                <div class="text-[11px] text-slate-400 mt-0.5">2.12-1 9 Bal Seysmik</div>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-black text-structo-500">100%</div>
                <div class="text-[11px] text-slate-400 mt-0.5">Kupçalı Mülkiyyət</div>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-black text-white">B25-B40</div>
                <div class="text-[11px] text-slate-400 mt-0.5">Öz Beton Zavodumuz</div>
              </div>
            </div>

          </div>

          <!-- Right Column Architectural Graphic Showcase (5 cols) -->
          <div class="lg:col-span-5 relative">
            <div class="relative rounded-2xl overflow-hidden border border-slate-800 bg-cardBg shadow-2xl p-2">
              <div class="relative h-[420px] rounded-xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80" 
                  alt="Structo Engineering Site" 
                  class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent"></div>
                
                <!-- Floating Info Badge -->
                <div class="absolute top-4 left-4 bg-obsidian/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-2.5">
                  <div class="w-3 h-3 rounded-full bg-structo-500 flex items-center justify-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-400 font-semibold uppercase">Hazırkı Layihə</div>
                    <div class="text-xs font-bold text-white">Qobu Yaşayış Kompleksi (10 Blok)</div>
                  </div>
                </div>

                <!-- Floating Bottom Metric -->
                <div class="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div class="text-[11px] text-slate-400">Proqnozlaşdırılan Xalis Gəlir</div>
                    <div class="text-lg font-black text-structo-500">+40.2% ROI</div>
                  </div>
                  <a href="#calculator-section" class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-structo-500 text-white hover:bg-structo-600 transition-colors">
                    Hesabla
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

// Key Stats Strip
function renderStats() {
  const container = document.getElementById('stats-section');
  if (!container) return;

  const cfg = state.statsConfig;
  const stats = [
    { value: cfg.stat1Val || t('stat1Value'), label: cfg.stat1Label || t('stat1Label') },
    { value: cfg.stat2Val || t('stat2Value'), label: cfg.stat2Label || t('stat2Label') },
    { value: cfg.stat3Val || t('stat3Value'), label: cfg.stat3Label || t('stat3Label') },
    { value: cfg.stat4Val || t('stat4Value'), label: cfg.stat4Label || t('stat4Label') }
  ];

  container.innerHTML = `
    <div class="border-y border-slate-800 bg-[#0C1220]/60 backdrop-blur-sm py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          ${stats.map(s => `
            <div class="text-center lg:text-left border-l-2 border-structo-500 pl-4">
              <div class="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">${s.value}</div>
              <div class="text-xs sm:text-sm text-slate-400 font-medium mt-1 leading-snug">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ROI & Construction Calculator Section with 30% Structo Fee & Cash Flow
function renderCalculator() {
  const container = document.getElementById('calculator-section');
  if (!container) return;

  // Calculation formulas
  const landPrice = Number(state.calc.landPrice) || 0;
  const buildableArea = Number(state.calc.buildableArea) || 0;
  const costPerM2 = Number(state.calc.costPerM2) || 0;
  const salePerM2 = Number(state.calc.salePerM2) || 0;

  const constructionTotalCost = buildableArea * costPerM2;
  const totalInvestment = landPrice + constructionTotalCost;
  const grossRevenue = buildableArea * salePerM2;
  const grossProfit = grossRevenue - totalInvestment;

  // Structo Fee deduction (30% by default, configurable)
  const feePercent = state.financeConfig?.structoFeePercent || 30;
  const structoFeeAmount = grossProfit > 0 ? (grossProfit * (feePercent / 100)) : 0;
  const netInvestorProfit = grossProfit - structoFeeAmount;
  
  // ROIs
  const netInvestorROI = totalInvestment > 0 ? ((netInvestorProfit / totalInvestment) * 100).toFixed(1) : 0;
  const grossProjectROI = totalInvestment > 0 ? ((grossProfit / totalInvestment) * 100).toFixed(1) : 0;

  // Cash flow breakdown (30-40% initial katlavan injection)
  const katlavanPercent = state.financeConfig?.katlavanInitialPercent || 35;
  const initialEquityRequired = Math.round(totalInvestment * (katlavanPercent / 100));
  const selfFundedFromSales = totalInvestment - initialEquityRequired;

  // Material engineering estimates (based on AZDTN building standard factors)
  const concreteM3 = Math.round(buildableArea * 0.42);
  const rebarTon = Math.round(buildableArea * 0.052);
  const masonryBlocks = Math.round(buildableArea * 18);

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-structo-500/10 text-structo-500 border border-structo-500/20 mb-3">
            ${state.lang === 'az' ? 'ŞƏFFAF MALİYYƏ & XİDMƏT HAQQI MODELİ' : 'TRANSPARENT FINANCIAL & FEE MODEL'}
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ${t('calcTitle')}
          </h2>
          <p class="mt-2 text-slate-300 max-w-2xl text-sm sm:text-base">
            ${t('calcSubtitle')}
          </p>
        </div>

        <!-- Quick Preset Button -->
        <button id="calc-preset-btn" class="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-structo-500 text-xs sm:text-sm font-bold text-white transition-all flex items-center gap-2 cursor-pointer shadow-lg self-start md:self-auto">
          <svg class="w-4 h-4 text-structo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span>${t('calcPresetBtn')}</span>
        </button>
      </div>

      <!-- Main Calculator Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Controls Column (6 cols) -->
        <div class="lg:col-span-6 bg-cardBg rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          
          <!-- Input 1: Land Purchase Price -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs sm:text-sm font-semibold text-slate-300">${t('calcLandCost')}</label>
              <div class="flex items-center gap-1 font-bold text-white text-sm bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                <input type="number" id="input-land-price" value="${landPrice}" step="100000" class="w-28 bg-transparent text-right outline-none text-structo-400 font-bold" />
                <span class="text-slate-400">₼</span>
              </div>
            </div>
            <input type="range" id="range-land-price" min="500000" max="10000000" step="100000" value="${landPrice}" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            <div class="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>500,000 ₼</span>
              <span>10,000,000 ₼</span>
            </div>
          </div>

          <!-- Input 2: Total Buildable Area -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs sm:text-sm font-semibold text-slate-300">${t('calcBuildArea')}</label>
              <div class="flex items-center gap-1 font-bold text-white text-sm bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                <input type="number" id="input-build-area" value="${buildableArea}" step="500" class="w-24 bg-transparent text-right outline-none text-structo-400 font-bold" />
                <span class="text-slate-400">m²</span>
              </div>
            </div>
            <input type="range" id="range-build-area" min="2000" max="60000" step="500" value="${buildableArea}" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            <div class="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>2,000 m² (Villa/Klub)</span>
              <span>60,000 m² (Böyük Şəhərcik)</span>
            </div>
          </div>

          <!-- Input 3: Estimated Cost per m² -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs sm:text-sm font-semibold text-slate-300">${t('calcCostPerM2')}</label>
              <div class="flex items-center gap-1 font-bold text-white text-sm bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                <input type="number" id="input-cost-m2" value="${costPerM2}" step="20" class="w-20 bg-transparent text-right outline-none text-structo-400 font-bold" />
                <span class="text-slate-400">₼/m²</span>
              </div>
            </div>
            <input type="range" id="range-cost-m2" min="350" max="1000" step="10" value="${costPerM2}" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            <div class="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>350 ₼/m² (Standart monolit)</span>
              <span>1,000 ₼/m² (Premium lüks)</span>
            </div>
          </div>

          <!-- Input 4: Expected Sale Price per m² -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs sm:text-sm font-semibold text-slate-300">${t('calcSalePerM2')}</label>
              <div class="flex items-center gap-1 font-bold text-white text-sm bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                <input type="number" id="input-sale-m2" value="${salePerM2}" step="50" class="w-20 bg-transparent text-right outline-none text-structo-400 font-bold" />
                <span class="text-slate-400">₼/m²</span>
              </div>
            </div>
            <input type="range" id="range-sale-m2" min="700" max="2500" step="25" value="${salePerM2}" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            <div class="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>700 ₼/m²</span>
              <span>2,500 ₼/m²</span>
            </div>
          </div>

        </div>

        <!-- Output Cards Column with 30% Structo Fee Breakdown (6 cols) -->
        <div class="lg:col-span-6 space-y-6">
          
          <!-- Financial Yield Statement Card -->
          <div class="bg-gradient-to-br from-[#121B30] to-[#0A0F1D] rounded-2xl border border-structo-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-48 h-48 bg-structo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <!-- Total Budget & Gross Revenue -->
            <div class="grid grid-cols-2 gap-4 pb-5 border-b border-slate-800">
              <div>
                <span class="text-xs font-semibold text-slate-400 block">${t('calcTotalInvest')}</span>
                <span class="text-lg sm:text-xl font-black text-white mt-1 block">
                  ${totalInvestment.toLocaleString()} ₼
                </span>
                <span class="text-[10px] text-slate-400">Torpaq: ${(landPrice / 1000000).toFixed(1)}M | Tikinti: ${(constructionTotalCost / 1000000).toFixed(1)}M</span>
              </div>

              <div>
                <span class="text-xs font-semibold text-slate-400 block">${t('calcGrossRevenue')}</span>
                <span class="text-lg sm:text-xl font-black text-white mt-1 block">
                  ${grossRevenue.toLocaleString()} ₼
                </span>
                <span class="text-[10px] text-slate-400">${buildableArea.toLocaleString()} m² × ${salePerM2} ₼</span>
              </div>
            </div>

            <!-- Structo MMC Fee Breakdown (Clearly Explained) -->
            <div class="py-4 border-b border-slate-800/80 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-300 font-semibold">${t('calcGrossProfit')}:</span>
                <span class="text-white font-bold">${grossProfit > 0 ? '+' : ''}${grossProfit.toLocaleString()} ₼</span>
              </div>

              <!-- Structo MMC 30% fee row -->
              <div class="flex items-center justify-between text-xs bg-slate-900/60 p-2.5 rounded-lg border border-structo-500/20">
                <div>
                  <span class="text-structo-400 font-bold">${t('calcStructoFeeTitle')}:</span>
                  <div class="text-[10px] text-slate-400 leading-tight mt-0.5">${t('calcStructoFeeDesc')}</div>
                </div>
                <span class="text-structo-400 font-extrabold text-sm whitespace-nowrap ml-2">
                  -${structoFeeAmount.toLocaleString()} ₼
                </span>
              </div>
            </div>

            <!-- Net Investor Profit & Net ROI -->
            <div class="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <span class="text-xs font-semibold text-slate-400 block">${t('calcNetInvestorProfit')}</span>
                <span class="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">
                  +${netInvestorProfit.toLocaleString()} ₼
                </span>
                <span class="text-[10px] text-slate-400">Ümumi Layihə ROI: ${grossProjectROI}%</span>
              </div>

              <div class="bg-slate-900/90 p-4 rounded-xl border border-structo-500/50 text-center sm:text-right">
                <span class="text-xs font-bold text-structo-400 uppercase tracking-wider block">${t('calcInvestorROI')}</span>
                <span class="text-3xl sm:text-4xl font-black text-structo-500 mt-0.5 block">
                  ${netInvestorROI}%
                </span>
                <span class="text-[10px] text-emerald-400 font-semibold block mt-0.5">Xalis gəlir dərəcəsi</span>
              </div>
            </div>
          </div>

          <!-- AZDTN Material Breakdown Engine -->
          <div class="bg-cardBg rounded-2xl border border-slate-800 p-6 shadow-xl">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              ${t('calcMaterialsTitle')}
            </h4>

            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span class="text-[10px] text-slate-400 block">${t('calcConcrete')}</span>
                <span class="text-base sm:text-lg font-extrabold text-white mt-1 block">${concreteM3.toLocaleString()} m³</span>
                <span class="text-[10px] text-structo-400">B25 / B30 Hidro</span>
              </div>

              <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span class="text-[10px] text-slate-400 block">${t('calcRebar')}</span>
                <span class="text-base sm:text-lg font-extrabold text-white mt-1 block">${rebarTon.toLocaleString()} Ton</span>
                <span class="text-[10px] text-structo-400">A500C Karkas</span>
              </div>

              <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span class="text-[10px] text-slate-400 block">${t('calcMasonry')}</span>
                <span class="text-base sm:text-lg font-extrabold text-white mt-1 block">${masonryBlocks.toLocaleString()} ədəd</span>
                <span class="text-[10px] text-structo-400">Perlit & Blok</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Dynamic Cash Flow & Katlavandan Satış Modeli (FULL WIDTH 12-COL DISPLAY) -->
        <div class="lg:col-span-12 bg-cardBg rounded-3xl border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 w-80 h-80 bg-structo-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Header & Live Badge -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 relative z-10">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>${state.lang === 'az' ? 'MƏRHƏLƏLİ KAPİTAL STRATEGİYASI' : 'PROGRESSIVE CAPITAL STRATEGY'}</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ${t('cashFlowTitle')}
              </h3>
              <p class="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                ${t('cashFlowSubtitle')}
              </p>
            </div>

            <div class="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs font-semibold text-slate-200 self-start lg:self-auto flex-shrink-0 shadow-lg">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span><strong>Tələb olunan ilkin vəsait:</strong> Cəmi ~${katlavanPercent}%</span>
            </div>
          </div>

          <!-- Dual Dynamic Cash Flow Visual Track -->
          <div class="bg-slate-900/90 border border-slate-800 p-5 sm:p-7 rounded-2xl mb-8 relative z-10 space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Left: Initial Equity -->
              <div class="flex items-center justify-between p-4 rounded-xl bg-structo-500/10 border border-structo-500/25">
                <div>
                  <span class="text-[11px] font-bold uppercase tracking-wider text-structo-400 block">
                    1. İlkin İnvestor Girişi (${katlavanPercent}%)
                  </span>
                  <span class="text-xl sm:text-2xl font-black text-white mt-1 block">
                    ${initialEquityRequired.toLocaleString()} ₼
                  </span>
                  <span class="text-xs text-slate-400 mt-0.5 block">
                    Torpaq alışı + Bünövrə və katlavan qazıntısı
                  </span>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-structo-500/20 text-structo-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  🏗️
                </div>
              </div>

              <!-- Right: Presale Self-Funding -->
              <div class="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <div>
                  <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                    2. Katlavandan Satış Dövriyyəsi (${100 - katlavanPercent}%)
                  </span>
                  <span class="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
                    ${selfFundedFromSales.toLocaleString()} ₼
                  </span>
                  <span class="text-xs text-slate-400 mt-0.5 block">
                    Presale ilə tikintini öz-özünə maliyyələşdirən məbləğ
                  </span>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  📈
                </div>
              </div>

            </div>

            <!-- Wide Progress Bar -->
            <div class="space-y-2 pt-1">
              <div class="w-full bg-slate-800/90 h-4 rounded-full overflow-hidden flex shadow-inner border border-slate-700/50">
                <div class="bg-gradient-to-r from-structo-600 to-structo-500 h-full relative transition-all duration-500 flex items-center justify-center text-[10px] font-black text-white" style="width: ${katlavanPercent}%" title="İlkin Kapital: ${katlavanPercent}%">
                  ${katlavanPercent}%
                </div>
                <div class="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full relative transition-all duration-500 flex items-center justify-center text-[10px] font-black text-slate-950" style="width: ${100 - katlavanPercent}%" title="Satış Dövriyyəsi: ${100 - katlavanPercent}%">
                  ${100 - katlavanPercent}%
                </div>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 font-medium gap-1">
                <span class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-structo-500 flex-shrink-0"></span> 
                  İnvestorun ilkin qoyduğu kapital (${katlavanPercent}%: ${initialEquityRequired.toLocaleString()} ₼)
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></span> 
                  Katlavandan erkən satışlarla təmin olunan pul axını (${100 - katlavanPercent}%: ${selfFundedFromSales.toLocaleString()} ₼)
                </span>
              </div>
            </div>
          </div>

          <!-- 3-Step Horizontal Roadmap Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 relative z-10">
            
            <div class="bg-slate-900/70 border border-slate-800 hover:border-structo-500/40 p-5 rounded-2xl transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-structo-500/10 text-structo-400 border border-structo-500/20">
                    MƏRHƏLƏ 01
                  </span>
                  <span class="text-xl">🏗️</span>
                </div>
                <h5 class="text-sm font-bold text-white mb-2">İlkin Katlavan Girişi</h5>
                <p class="text-xs text-slate-300 leading-relaxed">
                  ${t('cashFlowStep1')}
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-structo-400 font-semibold flex items-center gap-1">
                <span>Pay: ${katlavanPercent}% ilkin vəsait</span>
              </div>
            </div>

            <div class="bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-2xl transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    MƏRHƏLƏ 02
                  </span>
                  <span class="text-xl">📈</span>
                </div>
                <h5 class="text-sm font-bold text-white mb-2">Katlavandan Erkən Satış</h5>
                <p class="text-xs text-slate-300 leading-relaxed">
                  ${t('cashFlowStep2')}
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <span>Dövriyyə: Nağd pul axını formalaşır</span>
              </div>
            </div>

            <div class="bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-2xl transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    MƏRHƏLƏ 03
                  </span>
                  <span class="text-xl">💰</span>
                </div>
                <h5 class="text-sm font-bold text-white mb-2">Özünü Maliyyələşdirən Dövriyyə</h5>
                <p class="text-xs text-slate-300 leading-relaxed">
                  ${t('cashFlowStep3')}
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <span>Nəticə: Maya dəyəri tam örtülür</span>
              </div>
            </div>

          </div>

          <!-- Full Width Win-Win Partnership Banner -->
          <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-structo-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 shadow-xl">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl flex-shrink-0 border border-emerald-500/30">
                🤝
              </div>
              <div>
                <div class="text-xs font-bold text-emerald-400 uppercase tracking-wide">İnvestor Üstünlüyü: Hər Kəs Qazansın Modeli</div>
                <div class="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed mt-0.5">
                  ${t('cashFlowRule')}
                </div>
              </div>
            </div>
            <a href="#contact-section" class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 cursor-pointer whitespace-nowrap text-center self-start sm:self-auto flex items-center gap-2">
              <span>${state.lang === 'az' ? 'Model Üzrə Məsləhətləşin' : 'Consult on Model'}</span>
              <span>→</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  `;

  // Bind Calculator Events
  const syncRangeAndInput = (rangeId, inputId, key) => {
    const range = container.querySelector(rangeId);
    const input = container.querySelector(inputId);
    if (!range || !input) return;

    range.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      input.value = val;
      state.calc[key] = val;
      renderCalculator();
    });

    input.addEventListener('change', (e) => {
      const val = Number(e.target.value);
      range.value = val;
      state.calc[key] = val;
      renderCalculator();
    });
  };

  syncRangeAndInput('#range-land-price', '#input-land-price', 'landPrice');
  syncRangeAndInput('#range-build-area', '#input-build-area', 'buildableArea');
  syncRangeAndInput('#range-cost-m2', '#input-cost-m2', 'costPerM2');
  syncRangeAndInput('#range-sale-m2', '#input-sale-m2', 'salePerM2');

  const presetBtn = container.querySelector('#calc-preset-btn');
  if (presetBtn) {
    presetBtn.addEventListener('click', () => {
      state.calc = {
        landPrice: 3000000,
        buildableArea: 27000,
        costPerM2: 450,
        salePerM2: 950
      };
      renderCalculator();
    });
  }
}

// Opportunities Catalog Section with Dual-Image Interactive Mode (Raw Land vs 3D Render)
function renderCatalog() {
  const container = document.getElementById('catalog-section');
  if (!container) return;

  const filtered = state.selectedCategory === 'all' 
    ? state.projects 
    : state.projects.filter(p => p.type === state.selectedCategory);

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-structo-500/10 text-structo-500 border border-structo-500/20 mb-3">
            ${state.lang === 'az' ? 'İKİLİ VİZUAL MÜQAYİSƏ: TORPAQ ⟷ 3D RENDER' : 'DUAL VISUAL COMPARISON: LAND ⟷ 3D RENDER'}
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ${t('projectsTitle')}
          </h2>
          <p class="mt-2 text-slate-300 max-w-2xl text-sm sm:text-base">
            ${t('projectsSubtitle')}
          </p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button data-cat="all" class="filter-tab-btn px-4 py-2 rounded-lg text-xs font-bold transition-all ${state.selectedCategory === 'all' ? 'bg-structo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
            ${t('filterAll')}
          </button>
          <button data-cat="land" class="filter-tab-btn px-4 py-2 rounded-lg text-xs font-bold transition-all ${state.selectedCategory === 'land' ? 'bg-structo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
            ${t('filterLand')}
          </button>
          <button data-cat="development" class="filter-tab-btn px-4 py-2 rounded-lg text-xs font-bold transition-all ${state.selectedCategory === 'development' ? 'bg-structo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
            ${t('filterDevelopment')}
          </button>
        </div>
      </div>

      <!-- Project Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        ${filtered.map(p => {
          // Check active view for this project: 'render' (default) or 'raw'
          const mode = state.projectImageModes[p.id] || 'render';
          const currentImg = mode === 'raw' 
            ? (p.imageRaw || p.image) 
            : (p.imageRender || p.image);

          return `
            <div class="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between group shadow-xl">
              
              <div>
                <!-- Card Image & Interactive Switcher -->
                <div class="relative h-72 overflow-hidden bg-slate-950">
                  <img 
                    src="${currentImg}" 
                    alt="${state.lang === 'az' ? p.titleAz : p.titleEn}" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent"></div>
                  
                  <!-- Top Switcher: Real Torpaq vs 3D Render -->
                  <div class="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                    <!-- Toggle Pill -->
                    <div class="flex items-center bg-obsidian/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
                      <button 
                        data-id="${p.id}" 
                        data-mode="render"
                        class="img-mode-toggle px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${mode === 'render' ? 'bg-structo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}"
                      >
                        🏛️ ${t('view3DRender')}
                      </button>
                      <button 
                        data-id="${p.id}" 
                        data-mode="raw"
                        class="img-mode-toggle px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${mode === 'raw' ? 'bg-structo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}"
                      >
                        📷 ${t('viewRawLand')}
                      </button>
                    </div>

                    <!-- ROI Badge -->
                    <div class="bg-structo-500 text-white px-3 py-1 rounded-lg text-xs font-black shadow-lg">
                      ROI: ${p.roiEstimated}
                    </div>
                  </div>

                  <!-- Bottom Label Marker -->
                  <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                    <div class="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800">
                      <svg class="w-3.5 h-3.5 text-structo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>${state.lang === 'az' ? p.locationAz : p.locationEn}</span>
                    </div>

                    <span class="text-[10px] font-bold px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-slate-700/50 text-structo-400">
                      ${mode === 'raw' ? (state.lang === 'az' ? 'Mövcud Sahə' : 'Raw Parcel') : (state.lang === 'az' ? '3D Memarlıq Planı' : 'Future Vision')}
                    </span>
                  </div>
                </div>

                <!-- Card Body -->
                <div class="p-6">
                  <h3 class="text-xl font-bold text-white group-hover:text-structo-400 transition-colors">
                    ${state.lang === 'az' ? p.titleAz : p.titleEn}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    ${state.lang === 'az' ? p.descriptionAz : p.descriptionEn}
                  </p>

                  <!-- Spec Grid -->
                  <div class="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800">
                    <div class="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                      <span class="text-[10px] text-slate-400 uppercase tracking-wider block">${state.lang === 'az' ? 'Torpaq Qiyməti' : 'Land Price'}</span>
                      <span class="text-sm font-extrabold text-white mt-0.5 block">${Number(p.landPrice).toLocaleString()} ₼</span>
                    </div>

                    <div class="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                      <span class="text-[10px] text-slate-400 uppercase tracking-wider block">${state.lang === 'az' ? 'Tikinti Sahəsi' : 'Buildable Space'}</span>
                      <span class="text-sm font-extrabold text-white mt-0.5 block">${Number(p.buildableArea).toLocaleString()} m²</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Actions -->
              <div class="p-6 pt-0 flex items-center gap-3">
                <button data-id="${p.id}" class="card-details-btn flex-1 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-200 transition-all cursor-pointer">
                  ${t('cardDetailsBtn')}
                </button>

                <button data-id="${p.id}" class="card-load-calc-btn flex-1 py-3 rounded-xl structo-red-gradient text-white text-xs font-bold hover:brightness-110 transition-all shadow-md shadow-structo-500/20 flex items-center justify-center gap-1.5 cursor-pointer">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  <span>${t('cardCalcBtn')}</span>
                </button>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;

  // Bind Image Mode Switchers
  const modeBtns = container.querySelectorAll('.img-mode-toggle');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-id');
      const mode = btn.getAttribute('data-mode');
      state.projectImageModes[pid] = mode;
      renderCatalog();
    });
  });

  // Bind Filter tabs
  const filterBtns = container.querySelectorAll('.filter-tab-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedCategory = btn.getAttribute('data-cat');
      renderCatalog();
    });
  });

  // Bind Detail Modal buttons
  const detailBtns = container.querySelectorAll('.card-details-btn');
  detailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      state.selectedProject = state.projects.find(p => p.id === id);
      state.isDetailsModalOpen = true;
      renderModal();
    });
  });

  // Bind Load Calculator buttons
  const calcBtns = container.querySelectorAll('.card-load-calc-btn');
  calcBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const proj = state.projects.find(p => p.id === id);
      if (proj) {
        state.calc = {
          landPrice: proj.landPrice,
          buildableArea: proj.buildableArea,
          costPerM2: proj.costPerM2,
          salePerM2: proj.salePerM2
        };
        renderCalculator();
        const calcElem = document.getElementById('calculator-section');
        if (calcElem) calcElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Helper to get division icon
function getDivisionIconSVG(iconName) {
  switch (iconName) {
    case 'rebar':
    case 'box':
      return `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
      `;
    case 'steel':
    case 'shield':
      return `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      `;
    case 'factory':
      return `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      `;
    case 'truck':
      return `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
        </svg>
      `;
    case 'wrench':
      return `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      `;
    case 'concrete':
    case 'layers':
    default:
      return `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      `;
  }
}

// Vertically Integrated Divisions
function renderDivisions() {
  const container = document.getElementById('divisions-section');
  if (!container) return;

  const cfg = state.divisionsConfig || defaultDivisionsConfig;
  const isAz = state.lang === 'az';
  const badge = isAz ? cfg.badgeAz : cfg.badgeEn;
  const title = isAz ? cfg.titleAz : cfg.titleEn;
  const subtitle = isAz ? cfg.subtitleAz : cfg.subtitleEn;
  const divisionsList = state.divisions && state.divisions.length > 0 ? state.divisions : divisionsData;

  container.innerHTML = `
    <div class="border-t border-slate-800 bg-[#0A0F1D]/80 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-3xl mx-auto mb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-structo-500/10 text-structo-500 border border-structo-500/20 mb-3">
            ${badge}
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ${title}
          </h2>
          <p class="mt-3 text-slate-300 text-sm sm:text-base">
            ${subtitle}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${divisionsList.map(d => `
            <div class="bg-cardBg rounded-2xl border border-slate-800 p-8 flex flex-col justify-between hover:border-structo-500/40 transition-all shadow-xl group">
              <div>
                <div class="w-12 h-12 rounded-xl bg-structo-500/10 text-structo-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-structo-500/20">
                  ${getDivisionIconSVG(d.icon || 'layers')}
                </div>

                <span class="inline-block px-2.5 py-1 rounded text-[10px] font-bold bg-slate-900 text-structo-400 border border-slate-800 mb-3">
                  ${isAz ? d.tagAz : (d.tagEn || d.tagAz)}
                </span>

                <h3 class="text-xl font-bold text-white mb-3">
                  ${isAz ? d.nameAz : (d.nameEn || d.nameAz)}
                </h3>

                <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  ${isAz ? d.descAz : (d.descEn || d.descAz)}
                </p>
              </div>

              <div class="mt-8 pt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-structo-400">
                <span>Structo Standartı</span>
                <span class="ml-auto">${d.standardNote || 'AZS / GOST'}</span>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}

// Standards & Legal Escrow Section
function renderStandards() {
  const container = document.getElementById('standards-section');
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-structo-500/10 text-structo-500 border border-structo-500/20 mb-3">
          ${state.lang === 'az' ? 'DÖVLƏT NƏZARƏTİ VƏ HÜQUQİ MÜDAFİƏ' : 'STATE AUDIT & LEGAL PROTECTION'}
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ${t('standardsTitle')}
        </h2>
        <p class="mt-3 text-slate-300 text-sm sm:text-base">
          ${t('standardsSubtitle')}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${standardsData.map(s => `
          <div class="bg-cardBg rounded-2xl border border-slate-800 p-8 shadow-xl">
            <div class="inline-block px-3 py-1 rounded-lg text-xs font-black bg-structo-500/15 text-structo-400 border border-structo-500/30 mb-4">
              ${s.code}
            </div>
            <h3 class="text-lg font-bold text-white mb-2">
              ${state.lang === 'az' ? s.titleAz : s.titleEn}
            </h3>
            <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
              ${state.lang === 'az' ? s.descAz : s.descEn}
            </p>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}

// Helper to generate Partner Logo HTML (Vector SVGs for Kapital Bank, KOBIA, AZDTN or custom image)
function getPartnerLogoHTML(p) {
  if (p.customLogoUrl) {
    return `
      <div class="h-12 flex items-center">
        <img src="${p.customLogoUrl}" alt="${p.name}" class="max-h-12 max-w-[180px] object-contain filter drop-shadow rounded" />
      </div>
    `;
  }

  const idKey = (p.logoKey || p.id || p.name || '').toLowerCase();

  // Kapital Bank Logo: Distinctive Red Rhombus & Geometric Bird Emblem
  if (idKey.includes('kapital') || idKey.includes('kapitalbank')) {
    return `
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-[#E31E24] flex items-center justify-center shadow-lg shadow-red-500/25 flex-shrink-0 border border-red-400/30">
          <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5L6.5 12 12 6.5z" />
            <circle cx="12" cy="12" r="2.5" fill="#E31E24" />
          </svg>
        </div>
        <div class="flex flex-col">
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-black tracking-tight text-white uppercase font-display leading-tight">KAPİTAL</span>
            <span class="text-xl font-black tracking-tight text-[#E31E24] uppercase font-display leading-tight">BANK</span>
          </div>
          <span class="text-[9px] font-bold text-slate-400 tracking-wider uppercase leading-none">Birinci Bank • Eskrou Tərəfdaşı</span>
        </div>
      </div>
    `;
  }

  // KOBİA Logo: Emerald geometric starburst & enterprise growth icon
  if (idKey.includes('kobia') || idKey.includes('kobi')) {
    return `
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-[#009688] to-[#004D40] flex items-center justify-center shadow-lg shadow-teal-500/25 border border-teal-400/30 flex-shrink-0">
          <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8L12 2z"/>
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-black tracking-wider text-teal-400 font-display leading-tight">KOBİA</span>
          <span class="text-[9px] font-semibold text-slate-400 tracking-tight leading-none">Kiçik və Orta Biznesin İnkişafı</span>
        </div>
      </div>
    `;
  }

  // AZDTN / FHN Logo: State building standard shield and structural column
  if (idKey.includes('azdtn') || idKey.includes('fhn')) {
    return `
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#1E3A8A] flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/30 flex-shrink-0">
          <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <div class="flex flex-col">
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-black tracking-wider text-blue-400 font-display leading-tight">AZDTN</span>
            <span class="text-xs font-bold text-slate-300 uppercase">/ FHN</span>
          </div>
          <span class="text-[9px] font-semibold text-slate-400 tracking-tight leading-none">Dövlət Tikinti Normaları və Nəzarət</span>
        </div>
      </div>
    `;
  }

  // Fallback institutional partner logo
  return `
    <div class="flex items-center gap-3">
      <div class="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center shadow-md border border-slate-700 flex-shrink-0 text-structo-400">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
        </svg>
      </div>
      <span class="text-lg font-bold text-white font-display">${p.name}</span>
    </div>
  `;
}

// Strategic & Institutional Partners Section
function renderPartners() {
  const container = document.getElementById('partners-section');
  if (!container) return;

  const cfg = state.partnersConfig || defaultPartnersConfig;
  const isAz = state.lang === 'az';
  const badge = isAz ? cfg.badgeAz : cfg.badgeEn;
  const title = isAz ? cfg.titleAz : cfg.titleEn;
  const subtitle = isAz ? cfg.subtitleAz : cfg.subtitleEn;
  const partnersList = state.partners && state.partners.length > 0 ? state.partners : defaultPartners;

  container.innerHTML = `
    <div class="border-t border-slate-800 bg-[#080D1A] py-20 relative overflow-hidden">
      <!-- Ambient decorative glow -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-structo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-structo-500/10 text-structo-400 border border-structo-500/20 mb-3">
            <span class="w-1.5 h-1.5 rounded-full bg-structo-500 animate-pulse"></span>
            ${badge}
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            ${title}
          </h2>
          <p class="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            ${subtitle}
          </p>
        </div>

        <!-- Partners Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${partnersList.map(p => `
            <div class="bg-cardBg/95 backdrop-blur rounded-2xl border border-slate-800/90 p-8 flex flex-col justify-between hover:border-structo-500/40 hover:shadow-2xl hover:shadow-structo-500/5 transition-all duration-300 group">
              <div>
                <!-- Top Brand Logo & Role Tag -->
                <div class="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
                  ${getPartnerLogoHTML(p)}
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/90 text-structo-400 border border-structo-500/20 whitespace-nowrap">
                    ${isAz ? p.tagAz : (p.tagEn || p.tagAz)}
                  </span>
                </div>

                <!-- Category Subheading -->
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  ${isAz ? p.categoryAz : (p.categoryEn || p.categoryAz)}
                </h4>

                <!-- Description -->
                <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  ${isAz ? p.descAz : (p.descEn || p.descAz)}
                </p>
              </div>

              <!-- Action Link -->
              <div class="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  ${isAz ? 'Aktiv Əməkdaşlıq' : 'Active Partnership'}
                </span>

                ${p.websiteUrl ? `
                  <a href="${p.websiteUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs font-bold text-structo-400 hover:text-white transition-colors group-hover:translate-x-0.5 transform">
                    <span>${isAz ? 'Rəsmi Keçid' : 'Official Portal'}</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Trust Guarantee Footer Banner -->
        <div class="mt-12 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3 text-left">
            <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <h5 class="text-sm font-bold text-white">${isAz ? 'İnvestor Hüquqlarının İkitərəfli Dövlət & Bank Təminatı' : 'Dual State & Bank Safeguard for Investor Capital'}</h5>
              <p class="text-xs text-slate-400">${isAz ? 'Bütün maliyyə əməliyyatları Kapital Bank eskrou mexanizmi, tikinti standartları isə AZDTN dövlət nəzarəti altında icra edilir.' : 'All disbursements pass through Kapital Bank escrow facilities under strict AZDTN structural compliance.'}</p>
            </div>
          </div>
          <a href="#contact-section" class="px-4 py-2 rounded-lg bg-structo-500 hover:bg-structo-600 text-white text-xs font-bold whitespace-nowrap transition-colors">
            ${isAz ? 'Məsləhət Al' : 'Request Briefing'}
          </a>
        </div>

      </div>
    </div>
  `;
}

// Contact Section with Direct Dispatch to configured email
function renderContact() {
  const container = document.getElementById('contact-section');
  if (!container) return;

  const conf = state.contactConfig;
  const isAz = state.lang === 'az';
  const badge = isAz ? conf.badge : (conf.badgeEn || conf.badge);
  const title = isAz ? conf.title : (conf.titleEn || conf.title);
  const subtitle = isAz ? conf.subtitle : (conf.subtitleEn || conf.subtitle);
  const address = isAz ? conf.address : (conf.addressEn || conf.address);
  const hours = isAz ? conf.workingHours : (conf.workingHoursEn || conf.workingHours);
  const cleanWa = (conf.whatsapp || '').replace(/\+/g, '').replace(/\s+/g, '').replace(/-/g, '');

  container.innerHTML = `
    <div class="border-t border-slate-800 bg-[#080C16] py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="max-w-3xl mx-auto text-center mb-12">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-structo-500/10 text-structo-500 border border-structo-500/20 mb-3">
            ${badge}
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ${title}
          </h2>
          <p class="mt-2 text-slate-400 text-sm sm:text-base">
            ${subtitle}
          </p>
        </div>

        <!-- Content Grid: Direct Contact Info (Left) & Form (Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left Column: Direct Contacts & Channels (5 cols) -->
          <div class="lg:col-span-5 space-y-4">
            
            <!-- Address Card -->
            <div class="bg-cardBg rounded-2xl border border-slate-800 p-5 flex items-start gap-4 shadow-lg hover:border-structo-500/30 transition-colors">
              <div class="w-10 h-10 rounded-xl bg-structo-500/10 text-structo-400 flex items-center justify-center flex-shrink-0 border border-structo-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Rəsmi Baş Ofis</span>
                <span class="text-sm font-semibold text-white leading-relaxed block">${address}</span>
              </div>
            </div>

            <!-- Email Card -->
            <div class="bg-cardBg rounded-2xl border border-slate-800 p-5 flex items-start gap-4 shadow-lg hover:border-structo-500/30 transition-colors">
              <div class="w-10 h-10 rounded-xl bg-structo-500/10 text-structo-400 flex items-center justify-center flex-shrink-0 border border-structo-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Rəsmi Qəbul E-poçtu</span>
                <a href="mailto:${conf.email}" class="text-sm font-bold text-structo-400 hover:text-white transition-colors block">
                  ${conf.email}
                </a>
              </div>
            </div>

            <!-- Phone & Mobile Card -->
            <div class="bg-cardBg rounded-2xl border border-slate-800 p-5 flex items-start gap-4 shadow-lg hover:border-structo-500/30 transition-colors">
              <div class="w-10 h-10 rounded-xl bg-structo-500/10 text-structo-400 flex items-center justify-center flex-shrink-0 border border-structo-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div class="space-y-1">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Telefon & Qaynar Xətt</span>
                <div class="text-sm font-semibold text-white">
                  <a href="tel:${conf.phone}" class="hover:text-structo-400 transition-colors">${conf.phone}</a>
                </div>
                ${conf.mobile ? `
                  <div class="text-xs text-slate-300">
                    Mobil: <a href="tel:${conf.mobile}" class="text-white hover:text-structo-400 font-medium transition-colors">${conf.mobile}</a>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- WhatsApp Direct Button -->
            ${conf.whatsapp ? `
              <a 
                href="https://wa.me/${cleanWa}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 p-4 rounded-2xl flex items-center justify-between group transition-all shadow-lg cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    💬
                  </div>
                  <div>
                    <div class="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">WhatsApp İnvestisiya Xətti</div>
                    <div class="text-[11px] text-emerald-400">${conf.whatsappDisplay || conf.whatsapp}</div>
                  </div>
                </div>
                <span class="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">Çat Aç →</span>
              </a>
            ` : ''}

            <!-- Working Hours Card -->
            <div class="bg-cardBg rounded-2xl border border-slate-800 p-4 flex items-center gap-3 shadow-lg text-xs text-slate-400">
              <span class="text-base">🕒</span>
              <span><strong>İş Rejimi:</strong> ${hours}</span>
            </div>

          </div>

          <!-- Right Column: Investor Lead Form (7 cols) -->
          <div class="lg:col-span-7">
            <div class="bg-cardBg rounded-3xl border border-slate-800 p-7 sm:p-9 shadow-2xl relative overflow-hidden">
              <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
                <div>
                  <h3 class="text-lg font-bold text-white">Məsləhətləşmə Forması</h3>
                  <p class="text-xs text-slate-400">Məlumatlarınız birbaşa ${conf.email} ünvanına göndəriləcək</p>
                </div>
                <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-structo-500/10 text-structo-400 border border-structo-500/20">
                  Məxfi
                </span>
              </div>

              <!-- Lead Form -->
              <form id="investor-lead-form" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1.5">${t('formFullName')}</label>
                    <input 
                      type="text" 
                      id="lead-name" 
                      required 
                      placeholder="${isAz ? 'Məs: Elvin Məmmədov' : 'e.g. John Doe'}"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm outline-none focus:border-structo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1.5">${t('formEmail')}</label>
                    <input 
                      type="email" 
                      id="lead-email" 
                      required 
                      placeholder="investor@structo.az"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm outline-none focus:border-structo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1.5">${t('formPhone')}</label>
                    <input 
                      type="tel" 
                      id="lead-phone" 
                      required 
                      placeholder="+994 (50) 000-00-00"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm outline-none focus:border-structo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1.5">${t('formBudget')}</label>
                    <select id="lead-budget" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm outline-none focus:border-structo-500 transition-colors">
                      <option>500,000 ₼ - 1,000,000 ₼</option>
                      <option selected>1,000,000 ₼ - 3,000,000 ₼</option>
                      <option>3,000,000 ₼ - 10,000,000 ₼</option>
                      <option>10,000,000 ₼ +</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1.5">${t('formMessage')}</label>
                  <textarea 
                    id="lead-notes" 
                    rows="3" 
                    placeholder="${isAz ? 'Maraqlandığınız torpaq sahəsi, yaşayış kompleksi və ya payçı şərtləri...' : 'Inquiries on land parcels, development equity, or shareholder terms...'}"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm outline-none focus:border-structo-500 transition-colors"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  class="w-full py-3.5 rounded-xl text-sm font-bold text-white structo-red-gradient hover:brightness-110 transition-all shadow-xl shadow-structo-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span>${t('formSubmitBtn')}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  // Bind Form Submit to directly dispatch to state.contactConfig.email
  const form = container.querySelector('#investor-lead-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = container.querySelector('#lead-name').value;
      const email = container.querySelector('#lead-email').value;
      const phone = container.querySelector('#lead-phone').value;
      const budget = container.querySelector('#lead-budget').value;
      const notes = container.querySelector('#lead-notes').value;

      const subject = encodeURIComponent(`Structo İnvestisiya Müraciəti: ${name}`);
      const body = encodeURIComponent(
        `Ad və Soyad: ${name}\n` +
        `E-poçt: ${email}\n` +
        `Əlaqə Nömrəsi: ${phone}\n` +
        `Planlaşdırılan Büdcə: ${budget}\n\n` +
        `Əlavə Qeydlər və Tələblər:\n${notes}\n\n` +
        `--\nStructo MMC Rəsmi İnvestor Platforması vasitəsilə göndərildi.`
      );

      const targetEmail = state.contactConfig.email || "structo.az0030@gmail.com";
      const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

      // Open email client immediately
      window.location.href = mailtoUrl;

      // Show confirmation dialog with direct link & summary
      state.inquirySentModal = { name, email, phone, budget, notes, mailtoUrl, targetEmail };
      renderModal();
      form.reset();
    });
  }
}

// Footer
function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  const conf = state.contactConfig;
  const isAz = state.lang === 'az';
  const aboutText = isAz ? conf.footerAbout : (conf.footerAboutEn || conf.footerAbout);
  const address = isAz ? conf.address : (conf.addressEn || conf.address);
  const copyright = isAz ? conf.copyright : (conf.copyrightEn || conf.copyright);
  const cleanWa = (conf.whatsapp || '').replace(/\+/g, '').replace(/\s+/g, '').replace(/-/g, '');

  container.innerHTML = `
    <footer class="bg-[#050810] border-t border-slate-900 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <!-- Brand Info -->
          <div class="space-y-4 md:col-span-2">
            ${getBrandLogoSVG()}
            <p class="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mt-4">
              ${aboutText}
            </p>
            <div class="text-xs text-structo-400 font-semibold pt-2">
              ${copyright}
            </div>
          </div>

          <!-- Quick Navigation -->
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">Naviqasiya</h4>
            <ul class="space-y-2 text-xs text-slate-400">
              <li><a href="#hero-section" class="hover:text-white">${t('navHome')}</a></li>
              <li><a href="#interactive-construction-section" class="hover:text-white">${t('navSimulator')}</a></li>
              <li><a href="#calculator-section" class="hover:text-white">${t('navCalculator')}</a></li>
              <li><a href="#catalog-section" class="hover:text-white">${t('navProjects')}</a></li>
              <li><a href="#divisions-section" class="hover:text-white">${t('navDivisions')}</a></li>
              <li><a href="#standards-section" class="hover:text-white">${t('navStandards')}</a></li>
              <li><a href="#partners-section" class="hover:text-white">${t('navPartners')}</a></li>
            </ul>
          </div>

          <!-- Legal & Contacts -->
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">Əlaqə & Hüquqi</h4>
            <ul class="space-y-2.5 text-xs text-slate-400">
              <li class="flex items-start gap-2">
                <span class="text-structo-500">📍</span>
                <span>${address}</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-structo-500">✉️</span>
                <a href="mailto:${conf.email}" class="hover:text-white transition-colors">${conf.email}</a>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-structo-500">📞</span>
                <a href="tel:${conf.phone}" class="hover:text-white transition-colors">${conf.phone}</a>
              </li>
              ${conf.mobile ? `
                <li class="flex items-center gap-2">
                  <span class="text-structo-500">📱</span>
                  <a href="tel:${conf.mobile}" class="hover:text-white transition-colors">${conf.mobile}</a>
                </li>
              ` : ''}
              ${conf.whatsapp ? `
                <li class="flex items-center gap-2">
                  <span class="text-emerald-400">💬</span>
                  <a href="https://wa.me/${cleanWa}" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                    WhatsApp: ${conf.whatsappDisplay || conf.whatsapp}
                  </a>
                </li>
              ` : ''}
              <li class="pt-2 border-t border-slate-900">
                <button id="footer-admin-btn" class="text-structo-500 hover:underline font-bold cursor-pointer inline-flex items-center gap-1">
                  <span>⚙️ ${t('adminPortalBtn')}</span>
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  `;

  const footerAdminBtn = container.querySelector('#footer-admin-btn');
  if (footerAdminBtn) {
    footerAdminBtn.addEventListener('click', () => {
      state.isAdminModalOpen = true;
      renderModal();
    });
  }
}

// Modals: Details Modal, Admin Modal (Masked Password & PIN, Full Site Editor, Dual Images), Direct Mail Sent Modal
function renderModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  // 1. Direct Email Sent Modal Confirmation
  if (state.inquirySentModal) {
    const data = state.inquirySentModal;
    container.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div class="bg-cardBg border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
          <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 mx-auto">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>

          <h3 class="text-2xl font-bold text-white text-center tracking-tight">Müraciətiniz Hazırlandı!</h3>
          <p class="text-xs sm:text-sm text-slate-300 text-center mt-2 leading-relaxed">
            Sorğunuz birbaşa şirkət rəhbərliyinin e-poçtuna (<strong>${data.targetEmail}</strong>) yönləndirildi.
          </p>

          <div class="bg-slate-900/80 rounded-xl p-4 my-6 border border-slate-800 space-y-2 text-xs">
            <div class="flex justify-between"><span class="text-slate-400">İnvestor:</span> <span class="text-white font-bold">${data.name}</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Əlaqə:</span> <span class="text-white font-bold">${data.phone}</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Büdcə:</span> <span class="text-structo-400 font-bold">${data.budget}</span></div>
          </div>

          <div class="space-y-3">
            <a href="${data.mailtoUrl}" class="w-full py-3.5 rounded-xl text-sm font-bold text-white structo-red-gradient hover:brightness-110 transition-all flex items-center justify-center gap-2">
              <span>✉️ E-poçtu Birbaşa Proqramda Aç</span>
            </a>
            <button id="inquiry-close-btn" class="w-full py-3 rounded-xl text-xs font-bold text-slate-400 bg-slate-900 hover:text-white transition-colors cursor-pointer">
              Bağla
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#inquiry-close-btn').addEventListener('click', () => {
      state.inquirySentModal = null;
      renderModal();
    });
    return;
  }

  // 2. Details Modal with Dual-Image Side-by-Side Comparison
  if (state.isDetailsModalOpen && state.selectedProject) {
    const p = state.selectedProject;
    container.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div class="bg-cardBg border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
          
          <!-- Dual Image Header -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-950">
            <!-- Raw Land -->
            <div class="relative h-56 rounded-xl overflow-hidden group">
              <img src="${p.imageRaw || p.image}" alt="Raw Land" class="w-full h-full object-cover" />
              <div class="absolute bottom-2 left-2 bg-black/80 px-2.5 py-1 rounded text-[11px] font-bold text-white">
                📷 ${t('viewRawLand')} (Mövcud)
              </div>
            </div>

            <!-- 3D Render -->
            <div class="relative h-56 rounded-xl overflow-hidden group">
              <img src="${p.imageRender || p.image}" alt="3D Render" class="w-full h-full object-cover" />
              <div class="absolute bottom-2 left-2 bg-structo-500 px-2.5 py-1 rounded text-[11px] font-bold text-white">
                🏛️ ${t('view3DRender')} (Gələcək)
              </div>
              <button id="modal-close-btn" class="absolute top-2 right-2 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer">
                ✕
              </button>
            </div>
          </div>

          <div class="p-6 sm:p-8 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold text-white">
                ${state.lang === 'az' ? p.titleAz : p.titleEn}
              </h3>
              <span class="px-3 py-1 rounded-full text-xs font-black bg-structo-500 text-white">
                ROI: ${p.roiEstimated}
              </span>
            </div>

            <p class="text-xs text-structo-400 font-semibold">
              📍 ${state.lang === 'az' ? p.locationAz : p.locationEn}
            </p>

            <p class="text-sm text-slate-300 leading-relaxed">
              ${state.lang === 'az' ? p.descriptionAz : p.descriptionEn}
            </p>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
              <div class="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <span class="text-[10px] text-slate-400 block">${state.lang === 'az' ? 'Torpaq' : 'Land'}</span>
                <span class="text-xs font-bold text-white">${Number(p.landPrice).toLocaleString()} ₼</span>
              </div>
              <div class="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <span class="text-[10px] text-slate-400 block">${state.lang === 'az' ? 'Sahə' : 'Area'}</span>
                <span class="text-xs font-bold text-white">${Number(p.buildableArea).toLocaleString()} m²</span>
              </div>
              <div class="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <span class="text-[10px] text-slate-400 block">${state.lang === 'az' ? 'Maya' : 'Cost'}</span>
                <span class="text-xs font-bold text-white">${p.costPerM2} ₼/m²</span>
              </div>
              <div class="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <span class="text-[10px] text-slate-400 block">${state.lang === 'az' ? 'Satış' : 'Sale'}</span>
                <span class="text-xs font-bold text-white">${p.salePerM2} ₼/m²</span>
              </div>
            </div>

            <div class="pt-4 flex gap-3">
              <button id="modal-calc-btn" class="w-full py-3.5 rounded-xl structo-red-gradient text-white text-sm font-bold hover:brightness-110 transition-all cursor-pointer">
                ${t('cardCalcBtn')}
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    container.querySelector('#modal-close-btn').addEventListener('click', () => {
      state.isDetailsModalOpen = false;
      renderModal();
    });

    container.querySelector('#modal-calc-btn').addEventListener('click', () => {
      state.calc = {
        landPrice: p.landPrice,
        buildableArea: p.buildableArea,
        costPerM2: p.costPerM2,
        salePerM2: p.salePerM2
      };
      state.isDetailsModalOpen = false;
      renderModal();
      renderCalculator();
      const calcElem = document.getElementById('calculator-section');
      if (calcElem) calcElem.scrollIntoView({ behavior: 'smooth' });
    });
    return;
  }

  // 3. Admin Modal (With Completely Masked Password & Code, and Tabs for Everything)
  if (state.isAdminModalOpen) {
    if (!state.isAdmin) {
      // Login Form: Password & Passcode strictly masked with type="password" and no plain text!
      container.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div class="bg-cardBg border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button id="admin-close-btn" class="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer">
              ✕
            </button>

            <!-- Brand Icon -->
            <div class="w-12 h-12 rounded-2xl bg-structo-500/10 border border-structo-500/30 text-structo-500 flex items-center justify-center mb-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>

            <h3 class="text-2xl font-bold text-white tracking-tight">${t('adminTitle')}</h3>
            <p class="text-xs text-slate-400 mt-1 mb-6 leading-relaxed">${t('adminSubtitle')}</p>

            <form id="admin-login-form" class="space-y-4">
              <!-- Field 1: Email -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">${t('adminEmailLabel')}</label>
                <input 
                  type="email" 
                  id="admin-email-input" 
                  required 
                  placeholder="admin@structo.az və ya şəxsi mail"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-structo-500"
                />
              </div>

              <!-- Field 2: Password (Masked) -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">${t('adminPasswordLabel')}</label>
                <input 
                  type="password" 
                  id="admin-password-input" 
                  required 
                  autocomplete="current-password"
                  placeholder="••••••••"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-structo-500 tracking-wider"
                />
              </div>

              <!-- Field 3: Passcode PIN (Masked) -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">${t('adminPasscodeLabel')}</label>
                <input 
                  type="password" 
                  id="admin-passcode-input" 
                  required 
                  autocomplete="off"
                  placeholder="••••"
                  maxlength="6"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-structo-500 tracking-widest text-center"
                />
              </div>

              <div id="admin-error-msg" class="text-xs text-rose-500 font-semibold hidden">
                ${t('adminInvalidMsg')}
              </div>

              <button 
                type="submit" 
                class="w-full py-3.5 rounded-xl text-sm font-bold text-white structo-red-gradient hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-structo-500/20"
              >
                ${t('adminLoginBtn')}
              </button>
            </form>

          </div>
        </div>
      `;

      container.querySelector('#admin-close-btn').addEventListener('click', () => {
        state.isAdminModalOpen = false;
        renderModal();
      });

      const form = container.querySelector('#admin-login-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = container.querySelector('#admin-email-input').value.trim();
        const pass = container.querySelector('#admin-password-input').value.trim();
        const code = container.querySelector('#admin-passcode-input').value.trim();

        // Validation rule: valid email, pass, and passcode
        if (email.includes('@') && pass.length >= 3 && (code === '1234' || code === 'admin' || code === '0030')) {
          state.isAdmin = true;
          state.adminEmail = email;
          localStorage.setItem('structo_admin_logged', 'true');
          localStorage.setItem('structo_admin_email', email);
          renderModal();
          renderNav();
        } else {
          const errorMsg = container.querySelector('#admin-error-msg');
          if (errorMsg) errorMsg.classList.remove('hidden');
        }
      });
      return;
    }

    // Full Site Admin Dashboard (When logged in)
    const activeTab = state.adminActiveTab;

    container.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div class="bg-cardBg border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          
          <!-- Admin Header Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-6">
            <div>
              <div class="text-xs text-structo-400 font-bold uppercase tracking-wider">${t('adminLoggedInAs')}</div>
              <h3 class="text-xl font-bold text-white">${state.adminEmail}</h3>
            </div>

            <div class="flex items-center gap-3">
              <button id="admin-logout-btn" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 cursor-pointer">
                ${t('adminLogoutBtn')}
              </button>
              <button id="admin-close-dash-btn" class="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>
          </div>

          <!-- Admin Tabs -->
          <div class="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-3">
            <button data-tab="projects" class="admin-tab-nav px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'projects' ? 'bg-structo-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'}">
              🏢 ${t('adminTabProjects')}
            </button>
            <button data-tab="headlines" class="admin-tab-nav px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'headlines' ? 'bg-structo-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'}">
              ✍️ ${t('adminTabHeadlines')}
            </button>
            <button data-tab="stats" class="admin-tab-nav px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'stats' ? 'bg-structo-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'}">
              📊 ${t('adminTabStats')}
            </button>
            <button data-tab="finance" class="admin-tab-nav px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'finance' ? 'bg-structo-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'}">
              💰 ${t('adminTabFinance')}
            </button>
            <button data-tab="contact" class="admin-tab-nav px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'contact' ? 'bg-structo-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'}">
              📞 ${t('adminTabContact')}
            </button>
            <button data-tab="partners" class="admin-tab-nav px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'partners' ? 'bg-structo-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'}">
              🤝 ${t('adminTabPartners')}
            </button>
            <button data-tab="divisions" class="admin-tab-nav px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'divisions' ? 'bg-structo-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'}">
              ⚙️ ${t('adminTabDivisions')}
            </button>
          </div>

          <!-- TAB 1: Projects & Dual Images (File Upload + URL) -->
          ${activeTab === 'projects' ? `
            <div class="space-y-6">
              <!-- Add New Project Form with Dual Image File Upload -->
              <form id="admin-add-project-form" class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-structo-400 uppercase tracking-wide">${t('adminAddProjectBtn')}</span>
                  <span class="text-[11px] text-slate-400">İkili şəkil sistemi (Boş torpaq + 3D Render)</span>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Layihə Adı</label>
                    <input type="text" id="new-p-title" required placeholder="Məs: Bilgəh Sahil Rezidensiyası" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Məkan / Rayon</label>
                    <input type="text" id="new-p-location" required placeholder="Məs: Bakı, Bilgəh qəsəbəsi" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                </div>

                <!-- Financial Inputs -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Torpaq Qiyməti (AZN)</label>
                    <input type="number" id="new-p-land" required placeholder="1500000" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Tikinti Sahəsi (m²)</label>
                    <input type="number" id="new-p-area" required placeholder="12000" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Maya Dəyəri (₼/m²)</label>
                    <input type="number" id="new-p-cost" required placeholder="450" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Satış Qiyməti (₼/m²)</label>
                    <input type="number" id="new-p-sale" required placeholder="950" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
                  </div>
                </div>

                <!-- Dual Image Uploaders -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <!-- 1. Raw Land Image -->
                  <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <span class="text-xs font-bold text-white block">1. 📷 Real Boş Torpaq Şəkli</span>
                    <input type="file" id="new-p-file-raw" accept="image/*" class="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-slate-800 file:text-white" />
                    <input type="url" id="new-p-url-raw" placeholder="və ya şəkil URL linki" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] outline-none" />
                  </div>

                  <!-- 2. Future 3D Render Image -->
                  <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <span class="text-xs font-bold text-structo-400 block">2. 🏛️ Nəzərdə Tutulan 3D Render Şəkli</span>
                    <input type="file" id="new-p-file-render" accept="image/*" class="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-structo-500 file:text-white" />
                    <input type="url" id="new-p-url-render" placeholder="və ya şəkil URL linki" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] outline-none" />
                  </div>
                </div>

                <textarea id="new-p-desc" rows="2" placeholder="Layihə haqqında ətraflı məlumat, təyinatı və sənədləşmə statusu..." class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none"></textarea>

                <button type="submit" class="w-full py-3 rounded-xl text-xs font-bold text-white structo-red-gradient hover:brightness-110 cursor-pointer shadow-md">
                  Layihəni İkili Şəkillərlə Əlavə Et
                </button>
              </form>

              <!-- Existing Projects List -->
              <div class="space-y-3">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wide block">Mövcud Layihələr (${state.projects.length})</span>
                ${state.projects.map((p, idx) => `
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 gap-3">
                    <div class="flex items-center gap-3">
                      <div class="flex -space-x-2">
                        <img src="${p.imageRaw || p.image}" title="Boş Torpaq" class="w-10 h-10 rounded-lg object-cover border border-slate-700" />
                        <img src="${p.imageRender || p.image}" title="3D Render" class="w-10 h-10 rounded-lg object-cover border-2 border-structo-500" />
                      </div>
                      <div>
                        <div class="text-xs font-bold text-white">${state.lang === 'az' ? p.titleAz : p.titleEn}</div>
                        <div class="text-[10px] text-slate-400">${Number(p.buildableArea).toLocaleString()} m² | ${Number(p.landPrice).toLocaleString()} ₼ | ROI: ${p.roiEstimated}</div>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 self-end sm:self-auto">
                      <button data-idx="${idx}" class="admin-del-project-btn px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold cursor-pointer">
                        Sil
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- TAB 2: Headlines & Copy Editor -->
          ${activeTab === 'headlines' ? `
            <div class="space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span class="text-xs font-bold text-structo-400 uppercase tracking-wide block">Ana Səhifə Başlıq və Mətnləri</span>
              
              <div>
                <label class="block text-xs text-slate-300 font-semibold mb-1">Əsas Şüar / Badge (AZ):</label>
                <input type="text" id="adm-badge-az" value="${(state.siteContent?.az?.heroBadge) || translations.az.heroBadge}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
              </div>

              <div>
                <label class="block text-xs text-slate-300 font-semibold mb-1">Başlıq H1 (AZ):</label>
                <input type="text" id="adm-title-az" value="${(state.siteContent?.az?.heroTitle) || translations.az.heroTitle}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
              </div>

              <div>
                <label class="block text-xs text-slate-300 font-semibold mb-1">Alt Mətn (AZ):</label>
                <textarea id="adm-sub-az" rows="3" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none">${(state.siteContent?.az?.heroSubtitle) || translations.az.heroSubtitle}</textarea>
              </div>

              <div class="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button id="adm-reset-headlines-btn" class="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer">
                  ${t('adminResetBtn')}
                </button>
                <button id="adm-save-headlines-btn" class="px-5 py-2.5 rounded-xl text-xs font-bold text-white structo-red-gradient cursor-pointer shadow-md">
                  ${t('adminSaveBtn')}
                </button>
              </div>
            </div>
          ` : ''}

          <!-- TAB 3: Stats Editor -->
          ${activeTab === 'stats' ? `
            <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span class="text-xs font-bold text-structo-400 uppercase tracking-wide block">Statistika Göstəriciləri</span>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label class="block text-[10px] text-slate-400 mb-1">Göstərici 1 Dəyər & Başlıq</label>
                  <input type="text" id="adm-stat1-val" value="${state.statsConfig.stat1Val}" class="w-full mb-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs" />
                  <input type="text" id="adm-stat1-label" value="${state.statsConfig.stat1Label}" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs" />
                </div>

                <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label class="block text-[10px] text-slate-400 mb-1">Göstərici 2 Dəyər & Başlıq</label>
                  <input type="text" id="adm-stat2-val" value="${state.statsConfig.stat2Val}" class="w-full mb-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs" />
                  <input type="text" id="adm-stat2-label" value="${state.statsConfig.stat2Label}" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs" />
                </div>

                <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label class="block text-[10px] text-slate-400 mb-1">Göstərici 3 Dəyər & Başlıq</label>
                  <input type="text" id="adm-stat3-val" value="${state.statsConfig.stat3Val}" class="w-full mb-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs" />
                  <input type="text" id="adm-stat3-label" value="${state.statsConfig.stat3Label}" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs" />
                </div>

                <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label class="block text-[10px] text-slate-400 mb-1">Göstərici 4 Dəyər & Başlıq</label>
                  <input type="text" id="adm-stat4-val" value="${state.statsConfig.stat4Val}" class="w-full mb-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs" />
                  <input type="text" id="adm-stat4-label" value="${state.statsConfig.stat4Label}" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs" />
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <button id="adm-save-stats-btn" class="px-5 py-2.5 rounded-xl text-xs font-bold text-white structo-red-gradient cursor-pointer">
                  ${t('adminSaveBtn')}
                </button>
              </div>
            </div>
          ` : ''}

          <!-- TAB 4: Financial & 30% Fee Configuration -->
          ${activeTab === 'finance' ? `
            <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span class="text-xs font-bold text-structo-400 uppercase tracking-wide block">Maliyyə & Xidmət Haqqı Parametrləri</span>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <label class="block text-xs text-slate-300 font-semibold mb-1">Structo MMC Xidmət Haqqı Faizi (%)</label>
                  <p class="text-[10px] text-slate-400 mb-2 leading-relaxed">İnvestorun xalis qazancından şirkətin idarəetmə və tikinti təşkilatına görə götürdüyü xidmət haqqı payı.</p>
                  <div class="flex items-center gap-2">
                    <input type="number" id="adm-fee-percent" min="1" max="50" value="${state.financeConfig.structoFeePercent}" class="w-24 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-sm" />
                    <span class="text-xs font-bold text-structo-400">%</span>
                  </div>
                </div>

                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <label class="block text-xs text-slate-300 font-semibold mb-1">İlkin Katlavan Girişi Payı (%)</label>
                  <p class="text-[10px] text-slate-400 mb-2 leading-relaxed">Cash flow modelində investorun əvvəlcədən qoyduğu təxmini kapital faizi (qalan hissə katlavandan satışla örtülür).</p>
                  <div class="flex items-center gap-2">
                    <input type="number" id="adm-katlavan-percent" min="10" max="60" value="${state.financeConfig.katlavanInitialPercent}" class="w-24 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-sm" />
                    <span class="text-xs font-bold text-emerald-400">%</span>
                  </div>
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <button id="adm-save-finance-btn" class="px-5 py-2.5 rounded-xl text-xs font-bold text-white structo-red-gradient cursor-pointer">
                  ${t('adminSaveBtn')}
                </button>
              </div>
            </div>
          ` : ''}

          <!-- TAB 5: Contact & Footer Editor -->
          ${activeTab === 'contact' ? `
            <div class="space-y-6">
              <!-- Official Channels & Inbound Email -->
              <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-structo-400 uppercase tracking-wide">
                    1. Rəsmi Əlaqə Vasitələri və Müraciət E-poçtu
                  </span>
                  <span class="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Bütün saytda və footer-də dərhal yenilənir
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Rəsmi Qəbul E-poçtu (Forma birbaşa bura göndərir):</label>
                    <input type="email" id="adm-contact-email" value="${state.contactConfig.email}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                    <span class="text-[10px] text-slate-500">Müştəri formanı doldurduqda bu e-poçt ünvanına göndəriş açılır</span>
                  </div>

                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Şəhər Telefon Nömrəsi:</label>
                    <input type="text" id="adm-contact-phone" value="${state.contactConfig.phone}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>

                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Mobil Nömrə / Qaynar Xətt:</label>
                    <input type="text" id="adm-contact-mobile" value="${state.contactConfig.mobile}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>

                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">WhatsApp İnvestisiya Nömrəsi (Çat üçün):</label>
                    <input type="text" id="adm-contact-whatsapp" value="${state.contactConfig.whatsappDisplay || state.contactConfig.whatsapp}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>

                  <div class="sm:col-span-2">
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Rəsmi Baş Ofis Ünvanı (Footer & Əlaqə):</label>
                    <input type="text" id="adm-contact-address" value="${state.contactConfig.address}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>

                  <div class="sm:col-span-2">
                    <label class="block text-xs text-slate-300 font-semibold mb-1">İş Rejimi və Saatları:</label>
                    <input type="text" id="adm-contact-hours" value="${state.contactConfig.workingHours}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                </div>
              </div>

              <!-- Contact Section Texts -->
              <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <span class="text-xs font-bold text-structo-400 uppercase tracking-wide block">
                  2. Əlaqə Bölməsinin Başlıq və Mətnləri
                </span>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Bölmə Şüarı (Badge):</label>
                    <input type="text" id="adm-contact-badge" value="${state.contactConfig.badge}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Əsas Başlıq:</label>
                    <input type="text" id="adm-contact-title" value="${state.contactConfig.title}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                </div>

                <div>
                  <label class="block text-xs text-slate-300 font-semibold mb-1">Alt İzah Mətni:</label>
                  <textarea id="adm-contact-subtitle" rows="2" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500">${state.contactConfig.subtitle}</textarea>
                </div>
              </div>

              <!-- Footer Section Texts -->
              <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <span class="text-xs font-bold text-structo-400 uppercase tracking-wide block">
                  3. Ən Aşağı Hissə (Footer) Xüsusi Mətnləri
                </span>

                <div>
                  <label class="block text-xs text-slate-300 font-semibold mb-1">Şirkət Haqqında Footer Qısa Təqdimatı:</label>
                  <textarea id="adm-footer-about" rows="2" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500">${state.contactConfig.footerAbout}</textarea>
                </div>

                <div>
                  <label class="block text-xs text-slate-300 font-semibold mb-1">Müəllif Hüququ / Copyright Mətni:</label>
                  <input type="text" id="adm-footer-copyright" value="${state.contactConfig.copyright}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-between items-center pt-2">
                <button id="adm-reset-contact-btn" class="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer">
                  ${t('adminResetBtn')}
                </button>
                <button id="adm-save-contact-btn" class="px-6 py-2.5 rounded-xl text-xs font-bold text-white structo-red-gradient cursor-pointer shadow-lg shadow-structo-500/20">
                  ${t('adminSaveBtn')}
                </button>
              </div>
            </div>
          ` : ''}

          <!-- TAB 6: Strategic Partners Management (Kapital Bank, KOBIA, AZDTN, etc.) -->
          ${activeTab === 'partners' ? `
            <div class="space-y-6">
              <!-- Partners Section Headlines -->
              <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-structo-400 uppercase tracking-wide">
                    1. Tərəfdaşlar Bölməsinin Başlıq və Mətnləri
                  </span>
                  <span class="text-[10px] text-slate-400">Bütün saytda dərhal əks olunur</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Bölmə Etiketi / Badge (AZ):</label>
                    <input type="text" id="adm-partner-badge-az" value="${state.partnersConfig.badgeAz || ''}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Bölmə Etiketi / Badge (EN):</label>
                    <input type="text" id="adm-partner-badge-en" value="${state.partnersConfig.badgeEn || ''}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Əsas Başlıq (AZ):</label>
                    <input type="text" id="adm-partner-title-az" value="${state.partnersConfig.titleAz || ''}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Əsas Başlıq (EN):</label>
                    <input type="text" id="adm-partner-title-en" value="${state.partnersConfig.titleEn || ''}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Alt Mətn / İzahat (AZ):</label>
                    <textarea id="adm-partner-sub-az" rows="2" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500">${state.partnersConfig.subtitleAz || ''}</textarea>
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Alt Mətn / İzahat (EN):</label>
                    <textarea id="adm-partner-sub-en" rows="2" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500">${state.partnersConfig.subtitleEn || ''}</textarea>
                  </div>
                </div>

                <div class="flex justify-between items-center pt-2">
                  <button id="adm-reset-partner-headers-btn" class="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer">
                    İlkin Başlıqlara Qaytar
                  </button>
                  <button id="adm-save-partner-headers-btn" class="px-5 py-2 rounded-xl text-xs font-bold text-white structo-red-gradient cursor-pointer">
                    ${t('adminSaveBtn')}
                  </button>
                </div>
              </div>

              <!-- Add New Partner Form -->
              <form id="adm-add-partner-form" class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-structo-400 uppercase tracking-wide">
                    2. Yeni Tərəfdaş və ya Bank Əlavə Et
                  </span>
                  <span class="text-[10px] text-emerald-400 font-medium">Kapital Bank, KOBİA, AZDTN və ya yeni qurum</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Tərəfdaş Adı *</label>
                    <input type="text" id="new-p-name" required placeholder="Məs: Kapital Bank və ya ABB" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Rəsmi Veb-Sayt Linki</label>
                    <input type="url" id="new-p-url" placeholder="https://www.kapitalbank.az" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Kateqoriya / Rol (AZ) *</label>
                    <input type="text" id="new-p-cat-az" required placeholder="Məs: Eskrou & Layihə Maliyyəsi" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Kateqoriya / Rol (EN)</label>
                    <input type="text" id="new-p-cat-en" placeholder="Escrow & Project Finance" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Etiket / Status (AZ) *</label>
                    <input type="text" id="new-p-tag-az" required placeholder="Məs: Rəsmi Bank Tərəfdaşı" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Etiket / Status (EN)</label>
                    <input type="text" id="new-p-tag-en" placeholder="Official Banking Partner" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Təsvir / Əməkdaşlıq Təminatı (AZ) *</label>
                    <textarea id="new-p-desc-az" rows="2" required placeholder="İnvestor kapitallarının qorunması, akkreditiv və eskrou hesabları..." class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500"></textarea>
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Təsvir (EN)</label>
                    <textarea id="new-p-desc-en" rows="2" placeholder="Investor equity protection through escrow accounts..." class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500"></textarea>
                  </div>
                </div>

                <!-- Logo Picker / File Upload -->
                <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div class="text-[11px] font-bold text-structo-400 uppercase">Loqo Seçimi və ya Şəkil Yükləmə</div>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label class="block text-[10px] text-slate-400 mb-1">Hazır Vektor Loqo Seç:</label>
                      <select id="new-p-logo-key" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none">
                        <option value="kapitalbank">Kapital Bank (Rəsmi Qırmızı Loqo)</option>
                        <option value="kobia">KOBİA (Rəsmi Zümrüd Yaşıl Loqo)</option>
                        <option value="azdtn">AZDTN / FHN (Rəsmi Göy Dövlət Loqosu)</option>
                        <option value="custom">Fərdi / Kompüterdən Şəkil</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-[10px] text-slate-400 mb-1">Kompüterdən Şəkil Loqo Yüklə:</label>
                      <input type="file" id="new-p-logo-file" accept="image/*" class="w-full text-[11px] text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer" />
                    </div>
                    <div>
                      <label class="block text-[10px] text-slate-400 mb-1">Və ya Loqo Şəkil Linki (URL):</label>
                      <input type="url" id="new-p-logo-url" placeholder="https://.../logo.png" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none" />
                    </div>
                  </div>
                </div>

                <div class="flex justify-end pt-2">
                  <button type="submit" class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-lg shadow-emerald-500/20">
                    + Tərəfdaşı Əlavə Et
                  </button>
                </div>
              </form>

              <!-- Current Partners List with Direct Inline Edits -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-structo-400 uppercase tracking-wide">
                    3. Mövcud Tərəfdaşlar Siyahısı (${(state.partners || []).length} tərəfdaş)
                  </span>
                  <button id="adm-reset-all-partners-btn" class="text-[11px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer">
                    İlkin Tərəfdaşlara Sıfırla (Kapital, KOBİA, AZDTN)
                  </button>
                </div>

                <div class="space-y-4">
                  ${(state.partners || []).map((p, idx) => `
                    <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div class="flex items-center gap-3">
                          ${getPartnerLogoHTML(p)}
                          <span class="text-xs font-bold text-white">${p.name}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <button type="button" data-idx="${idx}" class="adm-save-partner-single-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-colors">
                            Yadda Saxla
                          </button>
                          <button type="button" data-idx="${idx}" class="adm-del-partner-btn p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold cursor-pointer">
                            Sil 🗑️
                          </button>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label class="block text-[10px] text-slate-400 font-semibold mb-1">Tərəfdaş Adı:</label>
                          <input type="text" data-idx="${idx}" class="adm-partner-name w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" value="${p.name || ''}" />
                        </div>
                        <div>
                          <label class="block text-[10px] text-slate-400 font-semibold mb-1">Kateqoriya / Rol (AZ):</label>
                          <input type="text" data-idx="${idx}" class="adm-partner-cat-az w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" value="${p.categoryAz || ''}" />
                        </div>
                        <div>
                          <label class="block text-[10px] text-slate-400 font-semibold mb-1">Status / Etiket (AZ):</label>
                          <input type="text" data-idx="${idx}" class="adm-partner-tag-az w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" value="${p.tagAz || ''}" />
                        </div>
                        <div class="sm:col-span-2">
                          <label class="block text-[10px] text-slate-400 font-semibold mb-1">Təsvir (AZ):</label>
                          <textarea data-idx="${idx}" rows="2" class="adm-partner-desc-az w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none">${p.descAz || ''}</textarea>
                        </div>
                        <div>
                          <label class="block text-[10px] text-slate-400 font-semibold mb-1">Veb-sayt Linki:</label>
                          <input type="url" data-idx="${idx}" class="adm-partner-url w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" value="${p.websiteUrl || ''}" />
                          
                          <label class="block text-[10px] text-slate-400 font-semibold mt-2 mb-1">Fərdi Loqo Şəkil Linki:</label>
                          <input type="text" data-idx="${idx}" class="adm-partner-logo-url w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" value="${p.customLogoUrl || ''}" placeholder="URL və ya boş buraxın" />
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}

          <!-- TAB 7: Divisions Management (Structo Manufacturing & Construction) -->
          ${activeTab === 'divisions' ? `
            <div class="space-y-6">
              <!-- Divisions Section Headlines -->
              <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-structo-400 uppercase tracking-wide">
                    1. İstehsalat Bölməsinin Başlıq və Mətnləri
                  </span>
                  <span class="text-[10px] text-slate-400">Şirkətdaxili təchizat zənciri bölməsi</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Bölmə Etiketi / Badge (AZ):</label>
                    <input type="text" id="adm-div-badge-az" value="${state.divisionsConfig.badgeAz || ''}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Bölmə Etiketi / Badge (EN):</label>
                    <input type="text" id="adm-div-badge-en" value="${state.divisionsConfig.badgeEn || ''}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Əsas Başlıq (AZ):</label>
                    <input type="text" id="adm-div-title-az" value="${state.divisionsConfig.titleAz || ''}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div>
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Əsas Başlıq (EN):</label>
                    <input type="text" id="adm-div-title-en" value="${state.divisionsConfig.titleEn || ''}" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Alt Mətn / İzahat (AZ):</label>
                    <textarea id="adm-div-sub-az" rows="2" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500">${state.divisionsConfig.subtitleAz || ''}</textarea>
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs text-slate-300 font-semibold mb-1">Alt Mətn / İzahat (EN):</label>
                    <textarea id="adm-div-sub-en" rows="2" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500">${state.divisionsConfig.subtitleEn || ''}</textarea>
                  </div>
                </div>

                <div class="flex justify-between items-center pt-2">
                  <button id="adm-reset-div-headers-btn" class="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer">
                    İlkin Başlıqlara Qaytar
                  </button>
                  <button id="adm-save-div-headers-btn" class="px-5 py-2 rounded-xl text-xs font-bold text-white structo-red-gradient cursor-pointer">
                    ${t('adminSaveBtn')}
                  </button>
                </div>
              </div>

              <!-- Add New Division Form -->
              <form id="adm-add-division-form" class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-structo-400 uppercase tracking-wide">
                    2. Yeni İstehsalat və ya Tikinti Bölməsi Əlavə Et
                  </span>
                  <span class="text-[10px] text-slate-400">Beton, armatur, metal, logistika və s.</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Bölmə Adı (AZ) *</label>
                    <input type="text" id="new-div-name-az" required placeholder="Məs: Structo Prefabrik Dəmir-Beton Panelləri" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Bölmə Adı (EN)</label>
                    <input type="text" id="new-div-name-en" placeholder="Structo Precast Concrete Panels" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Spesifikasiya / Marka (AZ) *</label>
                    <input type="text" id="new-div-tag-az" required placeholder="Məs: B30-B45 Hidro / ГОСТ 13015" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Spesifikasiya / Marka (EN)</label>
                    <input type="text" id="new-div-tag-en" placeholder="Precast Grade B30-B45" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Təsvir və İstehsal Gücü (AZ) *</label>
                    <textarea id="new-div-desc-az" rows="2" required placeholder="Gündəlik 500 m² prefabrik döşəmə və fasad panelləri..." class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500"></textarea>
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Təsvir (EN)</label>
                    <textarea id="new-div-desc-en" rows="2" placeholder="Daily 500 m² precast slab fabrication capacity..." class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500"></textarea>
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Standart Qeydi:</label>
                    <input type="text" id="new-div-standard" value="AZS / GOST" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" />
                  </div>
                  <div>
                    <label class="block text-[11px] text-slate-300 font-semibold mb-1">Qrafik İkon:</label>
                    <select id="new-div-icon" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none">
                      <option value="layers">Qatlar / Bloklar (layers)</option>
                      <option value="box">Karkas / Qutu (box)</option>
                      <option value="shield">Qalxan / Konstruksiya (shield)</option>
                      <option value="factory">Zavod / Fabrik (factory)</option>
                      <option value="truck">Logistika / Mikser (truck)</option>
                      <option value="wrench">Texniki Xidmət (wrench)</option>
                    </select>
                  </div>
                </div>

                <div class="flex justify-end pt-2">
                  <button type="submit" class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-lg shadow-emerald-500/20">
                    + Bölməni Əlavə Et
                  </button>
                </div>
              </form>

              <!-- Current Divisions List with Direct Inline Edits -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-structo-400 uppercase tracking-wide">
                    3. Mövcud Bölmələr Siyahısı (${(state.divisions || []).length} bölmə)
                  </span>
                  <button id="adm-reset-all-divisions-btn" class="text-[11px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer">
                    İlkin Bölmələrə Sıfırla (Beton, Armatur, Metal)
                  </button>
                </div>

                <div class="space-y-4">
                  ${(state.divisions || []).map((d, idx) => `
                    <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-xl bg-structo-500/10 text-structo-500 flex items-center justify-center border border-structo-500/20">
                            ${getDivisionIconSVG(d.icon || 'layers')}
                          </div>
                          <div>
                            <span class="text-xs font-bold text-white block">${d.nameAz}</span>
                            <span class="text-[10px] text-structo-400">${d.tagAz}</span>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <button type="button" data-idx="${idx}" class="adm-save-division-single-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-colors">
                            Yadda Saxla
                          </button>
                          <button type="button" data-idx="${idx}" class="adm-del-division-btn p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold cursor-pointer">
                            Sil 🗑️
                          </button>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label class="block text-[10px] text-slate-400 font-semibold mb-1">Bölmə Adı (AZ):</label>
                          <input type="text" data-idx="${idx}" class="adm-div-name-az w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-structo-500" value="${d.nameAz || ''}" />
                        </div>
                        <div>
                          <label class="block text-[10px] text-slate-400 font-semibold mb-1">Spesifikasiya / Marka (AZ):</label>
                          <input type="text" data-idx="${idx}" class="adm-div-tag-az w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" value="${d.tagAz || ''}" />
                        </div>
                        <div class="sm:col-span-2">
                          <label class="block text-[10px] text-slate-400 font-semibold mb-1">Təsvir (AZ):</label>
                          <textarea data-idx="${idx}" rows="2" class="adm-div-desc-az w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none">${d.descAz || ''}</textarea>
                        </div>
                        <div>
                          <label class="block text-[10px] text-slate-400 font-semibold mb-1">Standart Qeydi:</label>
                          <input type="text" data-idx="${idx}" class="adm-div-standard w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none" value="${d.standardNote || 'AZS / GOST'}" />
                        </div>
                        <div>
                          <label class="block text-[10px] text-slate-400 font-semibold mb-1">İkon:</label>
                          <select data-idx="${idx}" class="adm-div-icon w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none">
                            <option value="concrete" ${d.icon === 'concrete' || d.icon === 'layers' ? 'selected' : ''}>Qatlar / Bloklar (layers)</option>
                            <option value="box" ${d.icon === 'box' || d.icon === 'rebar' ? 'selected' : ''}>Karkas / Qutu (box)</option>
                            <option value="shield" ${d.icon === 'shield' || d.icon === 'steel' ? 'selected' : ''}>Qalxan / Konstruksiya (shield)</option>
                            <option value="factory" ${d.icon === 'factory' ? 'selected' : ''}>Zavod / Fabrik (factory)</option>
                            <option value="truck" ${d.icon === 'truck' ? 'selected' : ''}>Logistika / Mikser (truck)</option>
                            <option value="wrench" ${d.icon === 'wrench' ? 'selected' : ''}>Texniki Xidmət (wrench)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}

        </div>
      </div>
    `;

    // Bind Close & Logout
    container.querySelector('#admin-close-dash-btn').addEventListener('click', () => {
      state.isAdminModalOpen = false;
      renderModal();
    });

    container.querySelector('#admin-logout-btn').addEventListener('click', () => {
      state.isAdmin = false;
      localStorage.removeItem('structo_admin_logged');
      renderModal();
      renderNav();
    });

    // Bind Tab Switching
    const tabBtns = container.querySelectorAll('.admin-tab-nav');
    tabBtns.forEach(b => {
      b.addEventListener('click', () => {
        state.adminActiveTab = b.getAttribute('data-tab');
        renderModal();
      });
    });

    // Save Headlines
    const saveHeadlinesBtn = container.querySelector('#adm-save-headlines-btn');
    if (saveHeadlinesBtn) {
      saveHeadlinesBtn.addEventListener('click', async () => {
        const badge = container.querySelector('#adm-badge-az').value;
        const title = container.querySelector('#adm-title-az').value;
        const sub = container.querySelector('#adm-sub-az').value;

        state.siteContent = {
          az: { heroBadge: badge, heroTitle: title, heroSubtitle: sub },
          en: { heroBadge: translations.en.heroBadge, heroTitle: translations.en.heroTitle, heroSubtitle: translations.en.heroSubtitle }
        };

        localStorage.setItem('structo_site_content', JSON.stringify(state.siteContent));

        try {
          const { error } = await supabase
            .from('site_content')
            .upsert([
              { key: 'hero_content', value: JSON.stringify(state.siteContent) }
            ], { onConflict: 'key' });

          if (error) console.error('Supabase xətası:', error.message);
        } catch (err) {
          console.error('Əlaqə xətası:', err);
        }

        renderHero();
        alert('Ana səhifə mətnləri uğurla yeniləndi!');
      });
    }

    // Reset Headlines
    const resetHeadlinesBtn = container.querySelector('#adm-reset-headlines-btn');
    if (resetHeadlinesBtn) {
      resetHeadlinesBtn.addEventListener('click', () => {
        state.siteContent = null;
        localStorage.removeItem('structo_site_content');
        renderHero();
        renderModal();
      });
    }

    // Save Stats
    const saveStatsBtn = container.querySelector('#adm-save-stats-btn');
    if (saveStatsBtn) {
      saveStatsBtn.addEventListener('click', () => {
        state.statsConfig = {
          stat1Val: container.querySelector('#adm-stat1-val').value,
          stat1Label: container.querySelector('#adm-stat1-label').value,
          stat2Val: container.querySelector('#adm-stat2-val').value,
          stat2Label: container.querySelector('#adm-stat2-label').value,
          stat3Val: container.querySelector('#adm-stat3-val').value,
          stat3Label: container.querySelector('#adm-stat3-label').value,
          stat4Val: container.querySelector('#adm-stat4-val').value,
          stat4Label: container.querySelector('#adm-stat4-label').value,
        };
        localStorage.setItem('structo_stats_config', JSON.stringify(state.statsConfig));
        renderStats();
        alert('Statistikalar yeniləndi!');
      });
    }

    // Save Finance & Fee
    const saveFinanceBtn = container.querySelector('#adm-save-finance-btn');
    if (saveFinanceBtn) {
      saveFinanceBtn.addEventListener('click', () => {
        const fee = Number(container.querySelector('#adm-fee-percent').value);
        const kat = Number(container.querySelector('#adm-katlavan-percent').value);
        state.financeConfig = { structoFeePercent: fee, katlavanInitialPercent: kat };
        localStorage.setItem('structo_finance_config', JSON.stringify(state.financeConfig));
        renderCalculator();
        alert('Maliyyə parametrləri və xidmət haqqı modeli yeniləndi!');
      });
    }

    // Save Contact & Footer
    const saveContactBtn = container.querySelector('#adm-save-contact-btn');
    if (saveContactBtn) {
      saveContactBtn.addEventListener('click', () => {
        const rawWa = container.querySelector('#adm-contact-whatsapp').value.trim();
        const cleanWa = rawWa.replace(/\+/g, '').replace(/\s+/g, '').replace(/-/g, '');

        state.contactConfig = {
          ...state.contactConfig,
          badge: container.querySelector('#adm-contact-badge').value.trim(),
          title: container.querySelector('#adm-contact-title').value.trim(),
          subtitle: container.querySelector('#adm-contact-subtitle').value.trim(),
          email: container.querySelector('#adm-contact-email').value.trim(),
          phone: container.querySelector('#adm-contact-phone').value.trim(),
          mobile: container.querySelector('#adm-contact-mobile').value.trim(),
          whatsapp: cleanWa,
          whatsappDisplay: rawWa,
          address: container.querySelector('#adm-contact-address').value.trim(),
          workingHours: container.querySelector('#adm-contact-hours').value.trim(),
          footerAbout: container.querySelector('#adm-footer-about').value.trim(),
          copyright: container.querySelector('#adm-footer-copyright').value.trim()
        };

        localStorage.setItem('structo_contact_config', JSON.stringify(state.contactConfig));
        renderContact();
        renderFooter();
        alert('Əlaqə və footer məlumatları uğurla yeniləndi!');
      });
    }

    // Reset Contact & Footer
    const resetContactBtn = container.querySelector('#adm-reset-contact-btn');
    if (resetContactBtn) {
      resetContactBtn.addEventListener('click', () => {
        state.contactConfig = { ...defaultContactConfig };
        localStorage.removeItem('structo_contact_config');
        renderContact();
        renderFooter();
        renderModal();
      });
    }

    // Add Project with Dual Image File Upload Helper
    const addProjForm = container.querySelector('#admin-add-project-form');
    if (addProjForm) {
      addProjForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = container.querySelector('#new-p-title').value;
        const location = container.querySelector('#new-p-location').value;
        const land = Number(container.querySelector('#new-p-land').value);
        const area = Number(container.querySelector('#new-p-area').value);
        const cost = Number(container.querySelector('#new-p-cost').value);
        const sale = Number(container.querySelector('#new-p-sale').value);
        const desc = container.querySelector('#new-p-desc').value;

        // Helper to read file to DataURL
        const readFileAsDataUrl = (fileInput) => {
          return new Promise((resolve) => {
            if (fileInput && fileInput.files && fileInput.files[0]) {
              const reader = new FileReader();
              reader.onload = (ev) => resolve(ev.target.result);
              reader.readAsDataURL(fileInput.files[0]);
            } else {
              resolve(null);
            }
          });
        };

        const fileRaw = await readFileAsDataUrl(container.querySelector('#new-p-file-raw'));
        const fileRender = await readFileAsDataUrl(container.querySelector('#new-p-file-render'));
        const urlRaw = container.querySelector('#new-p-url-raw').value.trim();
        const urlRender = container.querySelector('#new-p-url-render').value.trim();

        const finalImageRaw = fileRaw || urlRaw || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80";
        const finalImageRender = fileRender || urlRender || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80";

        const calcRoi = (((area * sale) - (land + area * cost)) / (land + area * cost) * 100).toFixed(1);

        const newP = {
          id: 'project-' + Date.now(),
          type: 'development',
          titleAz: title,
          titleEn: title,
          locationAz: location,
          locationEn: location,
          image: finalImageRender,
          imageRaw: finalImageRaw,
          imageRender: finalImageRender,
          landPrice: land,
          buildableArea: area,
          costPerM2: cost,
          salePerM2: sale,
          roiEstimated: `${calcRoi}%`,
          descriptionAz: desc,
          descriptionEn: desc
        };

        state.projects.unshift(newP);
        localStorage.setItem('structo_projects', JSON.stringify(state.projects));
        renderCatalog();
        renderModal();
        alert('Yeni layihə ikili şəkillərlə uğurla əlavə edildi!');
      });
    }

    // Delete Project
    const delBtns = container.querySelectorAll('.admin-del-project-btn');
    delBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        state.projects.splice(idx, 1);
        localStorage.setItem('structo_projects', JSON.stringify(state.projects));
        renderCatalog();
        renderModal();
      });
    });

    // --- PARTNERS EVENT LISTENERS ---
    // 1. Save Partner Headers
    const savePartnerHeadersBtn = container.querySelector('#adm-save-partner-headers-btn');
    if (savePartnerHeadersBtn) {
      savePartnerHeadersBtn.addEventListener('click', () => {
        state.partnersConfig = {
          badgeAz: container.querySelector('#adm-partner-badge-az').value,
          badgeEn: container.querySelector('#adm-partner-badge-en').value,
          titleAz: container.querySelector('#adm-partner-title-az').value,
          titleEn: container.querySelector('#adm-partner-title-en').value,
          subtitleAz: container.querySelector('#adm-partner-sub-az').value,
          subtitleEn: container.querySelector('#adm-partner-sub-en').value
        };
        localStorage.setItem('structo_partners_config', JSON.stringify(state.partnersConfig));
        renderPartners();
        alert('Tərəfdaşlar bölməsinin başlıqları uğurla yeniləndi!');
      });
    }

    // 2. Reset Partner Headers
    const resetPartnerHeadersBtn = container.querySelector('#adm-reset-partner-headers-btn');
    if (resetPartnerHeadersBtn) {
      resetPartnerHeadersBtn.addEventListener('click', () => {
        state.partnersConfig = { ...defaultPartnersConfig };
        localStorage.removeItem('structo_partners_config');
        renderPartners();
        renderModal();
      });
    }

    // 3. Add Partner Form
    const addPartnerForm = container.querySelector('#adm-add-partner-form');
    if (addPartnerForm) {
      addPartnerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = container.querySelector('#new-p-name').value;
        const websiteUrl = container.querySelector('#new-p-url').value;
        const catAz = container.querySelector('#new-p-cat-az').value;
        const catEn = container.querySelector('#new-p-cat-en').value || catAz;
        const tagAz = container.querySelector('#new-p-tag-az').value;
        const tagEn = container.querySelector('#new-p-tag-en').value || tagAz;
        const descAz = container.querySelector('#new-p-desc-az').value;
        const descEn = container.querySelector('#new-p-desc-en').value || descAz;
        const logoKey = container.querySelector('#new-p-logo-key').value;
        const customUrlInput = container.querySelector('#new-p-logo-url').value;
        const logoFileInput = container.querySelector('#new-p-logo-file');

        const doSavePartner = (customLogo) => {
          const newPartner = {
            id: 'partner-' + Date.now(),
            name,
            websiteUrl,
            categoryAz: catAz,
            categoryEn: catEn,
            tagAz,
            tagEn,
            descAz,
            descEn,
            logoKey,
            customLogoUrl: customLogo || customUrlInput || null
          };
          if (!state.partners) state.partners = [];
          state.partners.push(newPartner);
          localStorage.setItem('structo_partners', JSON.stringify(state.partners));
          renderPartners();
          renderModal();
          alert(`${name} tərəfdaşlar siyahısına uğurla əlavə edildi!`);
        };

        if (logoFileInput && logoFileInput.files && logoFileInput.files[0]) {
          const reader = new FileReader();
          reader.onload = (re) => {
            doSavePartner(re.target.result);
          };
          reader.readAsDataURL(logoFileInput.files[0]);
        } else {
          doSavePartner(null);
        }
      });
    }

    // 4. Save Single Partner Edits
    const saveSinglePartnerBtns = container.querySelectorAll('.adm-save-partner-single-btn');
    saveSinglePartnerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (state.partners && state.partners[idx]) {
          const nameInput = container.querySelector(`.adm-partner-name[data-idx="${idx}"]`);
          const catInput = container.querySelector(`.adm-partner-cat-az[data-idx="${idx}"]`);
          const tagInput = container.querySelector(`.adm-partner-tag-az[data-idx="${idx}"]`);
          const descInput = container.querySelector(`.adm-partner-desc-az[data-idx="${idx}"]`);
          const urlInput = container.querySelector(`.adm-partner-url[data-idx="${idx}"]`);
          const logoUrlInput = container.querySelector(`.adm-partner-logo-url[data-idx="${idx}"]`);

          state.partners[idx].name = nameInput ? nameInput.value : state.partners[idx].name;
          state.partners[idx].categoryAz = catInput ? catInput.value : state.partners[idx].categoryAz;
          state.partners[idx].tagAz = tagInput ? tagInput.value : state.partners[idx].tagAz;
          state.partners[idx].descAz = descInput ? descInput.value : state.partners[idx].descAz;
          state.partners[idx].websiteUrl = urlInput ? urlInput.value : state.partners[idx].websiteUrl;
          if (logoUrlInput) {
            state.partners[idx].customLogoUrl = logoUrlInput.value.trim() || null;
          }

          localStorage.setItem('structo_partners', JSON.stringify(state.partners));
          renderPartners();
          alert('Tərəfdaş məlumatları uğurla yadda saxlanıldı!');
        }
      });
    });

    // 5. Delete Single Partner
    const delPartnerBtns = container.querySelectorAll('.adm-del-partner-btn');
    delPartnerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (state.partners && state.partners[idx]) {
          const pName = state.partners[idx].name;
          if (confirm(`"${pName}" tərəfdaşını silmək istədiyinizdən əminsiniz?`)) {
            state.partners.splice(idx, 1);
            localStorage.setItem('structo_partners', JSON.stringify(state.partners));
            renderPartners();
            renderModal();
          }
        }
      });
    });

    // 6. Reset All Partners
    const resetAllPartnersBtn = container.querySelector('#adm-reset-all-partners-btn');
    if (resetAllPartnersBtn) {
      resetAllPartnersBtn.addEventListener('click', () => {
        if (confirm('Bütün tərəfdaşlar ilkin rəsmi siyahıya (Kapital Bank, KOBİA, AZDTN) qaytarılsın?')) {
          state.partners = JSON.parse(JSON.stringify(defaultPartners));
          localStorage.setItem('structo_partners', JSON.stringify(state.partners));
          renderPartners();
          renderModal();
        }
      });
    }

    // --- DIVISIONS EVENT LISTENERS ---
    // 1. Save Division Headers
    const saveDivHeadersBtn = container.querySelector('#adm-save-div-headers-btn');
    if (saveDivHeadersBtn) {
      saveDivHeadersBtn.addEventListener('click', () => {
        state.divisionsConfig = {
          badgeAz: container.querySelector('#adm-div-badge-az').value,
          badgeEn: container.querySelector('#adm-div-badge-en').value,
          titleAz: container.querySelector('#adm-div-title-az').value,
          titleEn: container.querySelector('#adm-div-title-en').value,
          subtitleAz: container.querySelector('#adm-div-sub-az').value,
          subtitleEn: container.querySelector('#adm-div-sub-en').value
        };
        localStorage.setItem('structo_divisions_config', JSON.stringify(state.divisionsConfig));
        renderDivisions();
        alert('İstehsalat bölməsinin başlıqları uğurla yeniləndi!');
      });
    }

    // 2. Reset Division Headers
    const resetDivHeadersBtn = container.querySelector('#adm-reset-div-headers-btn');
    if (resetDivHeadersBtn) {
      resetDivHeadersBtn.addEventListener('click', () => {
        state.divisionsConfig = { ...defaultDivisionsConfig };
        localStorage.removeItem('structo_divisions_config');
        renderDivisions();
        renderModal();
      });
    }

    // 3. Add Division Form
    const addDivisionForm = container.querySelector('#adm-add-division-form');
    if (addDivisionForm) {
      addDivisionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameAz = container.querySelector('#new-div-name-az').value;
        const nameEn = container.querySelector('#new-div-name-en').value || nameAz;
        const tagAz = container.querySelector('#new-div-tag-az').value;
        const tagEn = container.querySelector('#new-div-tag-en').value || tagAz;
        const descAz = container.querySelector('#new-div-desc-az').value;
        const descEn = container.querySelector('#new-div-desc-en').value || descAz;
        const standardNote = container.querySelector('#new-div-standard').value || 'AZS / GOST';
        const icon = container.querySelector('#new-div-icon').value || 'layers';

        const newDivision = {
          id: 'div-' + Date.now(),
          nameAz,
          nameEn,
          tagAz,
          tagEn,
          descAz,
          descEn,
          standardNote,
          icon
        };

        if (!state.divisions) state.divisions = [];
        state.divisions.push(newDivision);
        localStorage.setItem('structo_divisions', JSON.stringify(state.divisions));
        renderDivisions();
        renderModal();
        alert(`${nameAz} bölməsi uğurla əlavə edildi!`);
      });
    }

    // 4. Save Single Division Edits
    const saveSingleDivBtns = container.querySelectorAll('.adm-save-division-single-btn');
    saveSingleDivBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (state.divisions && state.divisions[idx]) {
          const nameInput = container.querySelector(`.adm-div-name-az[data-idx="${idx}"]`);
          const tagInput = container.querySelector(`.adm-div-tag-az[data-idx="${idx}"]`);
          const descInput = container.querySelector(`.adm-div-desc-az[data-idx="${idx}"]`);
          const standardInput = container.querySelector(`.adm-div-standard[data-idx="${idx}"]`);
          const iconSelect = container.querySelector(`.adm-div-icon[data-idx="${idx}"]`);

          state.divisions[idx].nameAz = nameInput ? nameInput.value : state.divisions[idx].nameAz;
          state.divisions[idx].tagAz = tagInput ? tagInput.value : state.divisions[idx].tagAz;
          state.divisions[idx].descAz = descInput ? descInput.value : state.divisions[idx].descAz;
          state.divisions[idx].standardNote = standardInput ? standardInput.value : state.divisions[idx].standardNote;
          state.divisions[idx].icon = iconSelect ? iconSelect.value : state.divisions[idx].icon;

          localStorage.setItem('structo_divisions', JSON.stringify(state.divisions));
          renderDivisions();
          alert('Bölmə məlumatları uğurla yadda saxlanıldı!');
        }
      });
    });

    // 5. Delete Single Division
    const delDivBtns = container.querySelectorAll('.adm-del-division-btn');
    delDivBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (state.divisions && state.divisions[idx]) {
          const dName = state.divisions[idx].nameAz;
          if (confirm(`"${dName}" bölməsini silmək istədiyinizdən əminsiniz?`)) {
            state.divisions.splice(idx, 1);
            localStorage.setItem('structo_divisions', JSON.stringify(state.divisions));
            renderDivisions();
            renderModal();
          }
        }
      });
    });

    // 6. Reset All Divisions
    const resetAllDivisionsBtn = container.querySelector('#adm-reset-all-divisions-btn');
    if (resetAllDivisionsBtn) {
      resetAllDivisionsBtn.addEventListener('click', () => {
        if (confirm('Bütün istehsalat bölmələri ilkin vəziyyətinə qaytarılsın?')) {
          state.divisions = JSON.parse(JSON.stringify(divisionsData));
          localStorage.setItem('structo_divisions', JSON.stringify(state.divisions));
          renderDivisions();
          renderModal();
        }
      });
    }

    return;
  }

  // Otherwise clear modal container
  container.innerHTML = '';
}

// Master Render Coordinator
let simulatorInstance = null;

function renderAll() {
  renderNav();
  renderHero();

  // Instantiate or update the Interactive Simulator
  if (!simulatorInstance) {
    simulatorInstance = new ConstructionSimulator('interactive-construction-section', () => state.lang, (stage, floors) => {
      // When user clicks "Invest in This Stage"
      state.calc.buildableArea = floors * 1800;
      renderCalculator();
      const calcElem = document.getElementById('calculator-section');
      if (calcElem) calcElem.scrollIntoView({ behavior: 'smooth' });
    });
  } else {
    simulatorInstance.setLang();
  }

  renderStats();
  renderCalculator();
  renderCatalog();
  renderDivisions();
  renderStandards();
  renderPartners();
  renderContact();
  renderFooter();
  renderModal();
}

// Launch on script load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderAll);
} else {
  renderAll();
}
