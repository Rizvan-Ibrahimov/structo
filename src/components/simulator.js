// Structo Interactive Construction & Structural Anatomy Simulator
// Allows investors to dynamically inspect structural layers, floors, and milestones

import { simulatorStages } from '../data.js';

export class ConstructionSimulator {
  constructor(containerId, getLang, onInvestClick) {
    this.container = document.getElementById(containerId);
    this.getLang = getLang;
    this.onInvestClick = onInvestClick;
    this.activeStage = 2; // Default: Monolit Karkas
    this.floors = 10;
    this.isXray = false;
    this.isNight = true;
    this.isRotating = true;
    this.angle = 15;
    this.render();
  }

  setLang() {
    this.render();
  }

  render() {
    if (!this.container) return;
    const lang = this.getLang();
    const stage = simulatorStages.find(s => s.id === this.activeStage) || simulatorStages[1];
    
    // Live calculations based on floor count
    const totalConcrete = Math.round(this.floors * 580);
    const totalRebar = Math.round(this.floors * 76);
    const estValuation = (this.floors * 1800 * (1000 + this.activeStage * 120)).toLocaleString();

    this.container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-structo-500/10 text-structo-500 border border-structo-500/20 mb-4">
            <span class="w-2 h-2 rounded-full bg-structo-500 animate-pulse"></span>
            ${lang === 'az' ? 'CANLI MÜHƏNDİSLİK VƏ İNVESTİSİYA SİMULYATORU' : 'LIVE STRUCTURAL & INVESTMENT SIMULATOR'}
          </div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            ${lang === 'az' ? 'Binanın Karkasını və Dəyər Artımını <span class="text-structo-500">Canlı İdarə Edin</span>' : 'Inspect the Structural Frame & <span class="text-structo-500">Equity Growth</span>'}
          </h2>
          <p class="mt-4 text-base sm:text-lg text-slate-300">
            ${lang === 'az' ? 'Bünövrə svaylarından son fasada qədər hər bir mühəndislik qatını, dəmir-beton karkas xüsusiyyətlərini və investor gəlirlilik mərhələlərini test edin.' : 'From deep foundation piles to luxury facade handover, test structural properties and early-entry investor equity milestones.'}
          </p>
        </div>

        <!-- Main Interactive Stage Frame -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <!-- Visual Architectural Canvas (7 cols) -->
          <div class="lg:col-span-7 bg-[#0E1524] rounded-2xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl blueprint-grid">
            
            <!-- Top Controls Over Canvas -->
            <div class="flex flex-wrap items-center justify-between gap-3 z-10 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-800">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-slate-300 uppercase tracking-wider">${lang === 'az' ? 'Rejim:' : 'Mode:'}</span>
                <button id="sim-toggle-xray" class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${this.isXray ? 'bg-structo-500 text-white border-structo-500 shadow-md shadow-structo-500/20' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'}">
                  ${this.isXray ? '⚡ ' + (lang === 'az' ? 'Rentgen Aktivdir' : 'X-Ray Active') : '🔍 ' + (lang === 'az' ? 'Rentgen Karkas' : 'X-Ray Rebar')}
                </button>
                <button id="sim-toggle-night" class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${this.isNight ? 'bg-structo-600/30 text-structo-300 border-structo-500/50' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'}">
                  ${this.isNight ? '🌙 ' + (lang === 'az' ? 'Gecə İşıqları' : 'Night Mode') : '☀️ ' + (lang === 'az' ? 'Gündüz' : 'Daylight')}
                </button>
              </div>

              <!-- Live Badge -->
              <div class="flex items-center gap-2 text-xs font-semibold text-structo-400 bg-structo-500/10 px-3 py-1.5 rounded-lg border border-structo-500/30">
                <span class="w-2 h-2 rounded-full bg-structo-500 animate-ping"></span>
                AZDTN 2.12-1: 9 BAL
              </div>
            </div>

            <!-- Dynamic SVG Structural Illustration -->
            <div class="relative w-full py-8 my-auto flex items-center justify-center min-h-[380px]">
              ${this.generateBuildingSVG()}
            </div>

            <!-- Bottom Floor Range Slider -->
            <div class="z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800">
              <div class="flex items-center justify-between mb-2">
                <label for="sim-floor-input" class="text-xs sm:text-sm font-semibold text-slate-200">
                  ${lang === 'az' ? 'Mərtəbə Sayı:' : 'Floor Count:'} <span class="text-structo-500 font-bold text-base ml-1" id="sim-floor-display">${this.floors} ${lang === 'az' ? 'Mərtəbə' : 'Floors'}</span>
                </label>
                <span class="text-xs text-slate-400">
                  ${lang === 'az' ? 'Hündürlük:' : 'Height:'} ${(this.floors * 3.3).toFixed(1)} m
                </span>
              </div>
              <input 
                type="range" 
                id="sim-floor-input" 
                min="4" 
                max="16" 
                value="${this.floors}" 
                class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-structo-500"
              />
              <div class="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>4 ${lang === 'az' ? 'mərtəbə (Klub Evi)' : 'floors (Clubhouse)'}</span>
                <span>10 ${lang === 'az' ? 'mərtəbə (Standart)' : 'floors (Standard)'}</span>
                <span>16 ${lang === 'az' ? 'mərtəbə (Qüllə)' : 'floors (Tower)'}</span>
              </div>
            </div>
          </div>

          <!-- Stage Details & Engineering Dashboard (5 cols) -->
          <div class="lg:col-span-5 bg-cardBg rounded-2xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative">
            <div>
              <!-- Stage Navigation Buttons -->
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                ${lang === 'az' ? 'Tikinti və İnvestisiya Mərhələləri:' : 'Construction & Equity Milestones:'}
              </span>
              
              <div class="grid grid-cols-5 gap-2 mb-6">
                ${simulatorStages.map(s => `
                  <button 
                    data-stage="${s.id}" 
                    class="sim-stage-btn flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${this.activeStage === s.id ? 'bg-structo-500/20 border-structo-500 text-white shadow-lg shadow-structo-500/10' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}"
                  >
                    <span class="text-base font-extrabold ${this.activeStage === s.id ? 'text-structo-500' : 'text-slate-400'}">${s.id}</span>
                    <span class="text-[9px] font-semibold truncate w-full mt-0.5">${lang === 'az' ? s.titleAz.split('.')[1].trim().split(' ')[0] : s.titleEn.split('.')[1].trim().split(' ')[0]}</span>
                  </button>
                `).join('')}
              </div>

              <!-- Active Stage Header -->
              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 mb-6">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-semibold text-slate-400">${lang === 'az' ? 'Hazırkı Mərhələ' : 'Selected Stage'} #${stage.id}</span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-structo-500/20 text-structo-400 border border-structo-500/30">
                    ${lang === 'az' ? stage.capitalGainAz : stage.capitalGainEn}
                  </span>
                </div>
                <h3 class="text-xl font-bold text-white mt-1">
                  ${lang === 'az' ? stage.titleAz : stage.titleEn}
                </h3>
                <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  ${lang === 'az' ? stage.specsAz : stage.specsEn}
                </p>
              </div>

              <!-- Real-time Engineering Metrics Grid -->
              <div class="grid grid-cols-2 gap-3 mb-6">
                <div class="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
                  <div class="text-[11px] text-slate-400 font-medium">${lang === 'az' ? 'Beton Həcmi' : 'Concrete Volume'}</div>
                  <div class="text-lg font-extrabold text-white mt-0.5">${totalConcrete} m³</div>
                  <div class="text-[10px] text-structo-400 mt-0.5">B25-B40 Hidro</div>
                </div>

                <div class="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
                  <div class="text-[11px] text-slate-400 font-medium">${lang === 'az' ? 'Armatur Çəkisi' : 'Rebar Weight'}</div>
                  <div class="text-lg font-extrabold text-white mt-0.5">${totalRebar} Ton</div>
                  <div class="text-[10px] text-structo-400 mt-0.5">A500C Düyünlü</div>
                </div>

                <div class="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
                  <div class="text-[11px] text-slate-400 font-medium">${lang === 'az' ? 'Seysmik Davamlılıq' : 'Seismic Resilience'}</div>
                  <div class="text-lg font-extrabold text-emerald-400 mt-0.5">9 Bal Rixter</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">AZDTN 2.12-1</div>
                </div>

                <div class="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
                  <div class="text-[11px] text-slate-400 font-medium">${lang === 'az' ? 'Proqnoz Qiyməti' : 'Est. Asset Value'}</div>
                  <div class="text-lg font-extrabold text-white mt-0.5">${estValuation} ₼</div>
                  <div class="text-[10px] text-structo-400 mt-0.5">${lang === 'az' ? 'Bitmə Fazası' : 'At Handover'}</div>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <button 
              id="sim-invest-cta" 
              class="w-full py-3.5 px-6 rounded-xl font-bold text-white structo-red-gradient hover:brightness-110 transition-all shadow-lg shadow-structo-500/25 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>${lang === 'az' ? 'Bu Mərhələ üzrə İnvestisiya Təklifi Al' : 'Request Milestone Feasibility'}</span>
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>

        </div>
      </div>
    `;

    this.bindEvents();
  }

  generateBuildingSVG() {
    const fCount = this.floors;
    const stage = this.activeStage;
    const isXray = this.isXray;
    const isNight = this.isNight;
    
    const svgWidth = 460;
    const svgHeight = 360;
    const floorHeight = Math.min(18, 220 / fCount);
    const buildingWidth = 180;
    const startX = (svgWidth - buildingWidth) / 2;
    const groundY = 300;

    let svgElements = '';

    // Ground & Deep Piles (Stage 1+)
    svgElements += `
      <!-- Ground line -->
      <line x1="20" y1="${groundY}" x2="${svgWidth - 20}" y2="${groundY}" stroke="#334155" stroke-width="3" stroke-dasharray="4,4" />
      <text x="30" y="${groundY + 16}" fill="#64748B" font-size="10" font-family="'Outfit', sans-serif">Yeraltı Qat / Geoloji Süxur (-6m)</text>
      
      <!-- Deep Foundation Piles -->
      <g opacity="${stage >= 1 ? '1' : '0.2'}">
        <rect x="${startX + 20}" y="${groundY}" width="16" height="45" fill="${isXray ? '#EA3829' : '#334155'}" rx="2" />
        <rect x="${startX + 60}" y="${groundY}" width="16" height="45" fill="${isXray ? '#EA3829' : '#334155'}" rx="2" />
        <rect x="${startX + 104}" y="${groundY}" width="16" height="45" fill="${isXray ? '#EA3829' : '#334155'}" rx="2" />
        <rect x="${startX + 144}" y="${groundY}" width="16" height="45" fill="${isXray ? '#EA3829' : '#334155'}" rx="2" />
        <!-- Raft Slab -->
        <rect x="${startX - 10}" y="${groundY - 14}" width="${buildingWidth + 20}" height="14" fill="${isXray ? '#EA3829' : '#475569'}" stroke="#EA3829" stroke-width="1.5" rx="2" />
        <text x="${startX + 15}" y="${groundY - 4}" fill="#FFFFFF" font-size="8" font-weight="bold">120sm Monolit Bünövrə</text>
      </g>
    `;

    // Dynamic Floors Loop
    for (let i = 0; i < fCount; i++) {
      const floorY = groundY - 14 - (i + 1) * floorHeight;
      const isTopFloor = i === fCount - 1;

      // Color logic based on stage and mode
      let wallColor = '#1E293B';
      let strokeColor = '#334155';
      let windowColor = isNight ? '#FEF08A' : '#60A5FA';
      let windowOpacity = isNight ? '0.7' : '0.4';

      if (stage === 1) {
        // Only foundation is active, upper floors wireframe ghost
        wallColor = 'none';
        strokeColor = 'rgba(234, 56, 41, 0.2)';
        windowOpacity = '0';
      } else if (stage === 2) {
        // Monolithic frame stage: columns + slabs visible
        wallColor = isXray ? 'rgba(234, 56, 41, 0.15)' : '#1E293B';
        strokeColor = '#EA3829';
        windowOpacity = '0.05';
      } else if (stage === 3) {
        // Masonry stage: walls filled in brick color
        wallColor = isXray ? 'rgba(234, 56, 41, 0.25)' : '#334155';
        strokeColor = '#F87171';
        windowOpacity = '0.15';
      } else if (stage >= 4) {
        // Facade & Finished
        wallColor = isXray ? 'rgba(234, 56, 41, 0.2)' : '#0F172A';
        strokeColor = '#EA3829';
        windowOpacity = isNight ? '0.85' : '0.6';
      }

      svgElements += `
        <g class="floor-group transition-all duration-300">
          <!-- Floor Slab -->
          <rect x="${startX}" y="${floorY}" width="${buildingWidth}" height="${floorHeight}" fill="${wallColor}" stroke="${strokeColor}" stroke-width="1" />
          
          <!-- Rebar Columns (X-Ray Mode Glowing Red) -->
          ${isXray ? `
            <line x1="${startX + 10}" y1="${floorY}" x2="${startX + 10}" y2="${floorY + floorHeight}" stroke="#EA3829" stroke-width="2.5" />
            <line x1="${startX + 50}" y1="${floorY}" x2="${startX + 50}" y2="${floorY + floorHeight}" stroke="#EA3829" stroke-width="2.5" />
            <line x1="${startX + 130}" y1="${floorY}" x2="${startX + 130}" y2="${floorY + floorHeight}" stroke="#EA3829" stroke-width="2.5" />
            <line x1="${startX + 170}" y1="${floorY}" x2="${startX + 170}" y2="${floorY + floorHeight}" stroke="#EA3829" stroke-width="2.5" />
          ` : ''}

          <!-- Windows / Glass Panes (Stages 3, 4, 5) -->
          ${stage >= 3 ? `
            <rect x="${startX + 16}" y="${floorY + 2}" width="24" height="${floorHeight - 4}" fill="${windowColor}" fill-opacity="${windowOpacity}" rx="1" />
            <rect x="${startX + 56}" y="${floorY + 2}" width="28" height="${floorHeight - 4}" fill="${windowColor}" fill-opacity="${windowOpacity}" rx="1" />
            <rect x="${startX + 96}" y="${floorY + 2}" width="28" height="${floorHeight - 4}" fill="${windowColor}" fill-opacity="${windowOpacity}" rx="1" />
            <rect x="${startX + 136}" y="${floorY + 2}" width="28" height="${floorHeight - 4}" fill="${windowColor}" fill-opacity="${windowOpacity}" rx="1" />
          ` : ''}

          <!-- Floor Number Indicator for top and middle -->
          ${(i === 0 || i === Math.floor(fCount / 2) || isTopFloor) ? `
            <text x="${startX - 22}" y="${floorY + floorHeight - 3}" fill="#94A3B8" font-size="8" font-family="'Outfit', sans-serif">${i + 1}F</text>
          ` : ''}
        </g>
      `;
    }

    // Crane on top if stage is in construction (1, 2, 3)
    if (stage <= 3) {
      const topRoofY = groundY - 14 - fCount * floorHeight;
      svgElements += `
        <!-- Tower Crane -->
        <g transform="translate(${startX + 110}, ${topRoofY - 45})">
          <!-- Mast -->
          <line x1="0" y1="45" x2="0" y2="0" stroke="#EA3829" stroke-width="2" />
          <line x1="-3" y1="45" x2="3" y2="0" stroke="#EA3829" stroke-width="0.8" />
          <line x1="3" y1="45" x2="-3" y2="0" stroke="#EA3829" stroke-width="0.8" />
          <!-- Jib -->
          <line x1="-25" y1="8" x2="65" y2="8" stroke="#EA3829" stroke-width="2" />
          <!-- Tie Cords -->
          <line x1="0" y1="0" x2="45" y2="8" stroke="#EA3829" stroke-width="1" />
          <line x1="0" y1="0" x2="-20" y2="8" stroke="#EA3829" stroke-width="1" />
          <!-- Hook Line -->
          <line x1="35" y1="8" x2="35" y2="28" stroke="#FFFFFF" stroke-width="0.8" stroke-dasharray="2,2" />
          <circle cx="35" cy="30" r="2" fill="#EA3829" />
          <text x="-40" y="4" fill="#EA3829" font-size="7" font-weight="bold">STRUCTO TİKİNTİ</text>
        </g>
      `;
    }

    // Penthouse Roof / Architectural Parapet (Stage 4+)
    if (stage >= 4) {
      const topRoofY = groundY - 14 - fCount * floorHeight;
      svgElements += `
        <!-- Architectural Parapet & Roof Deck -->
        <polygon points="${startX - 4},${topRoofY} ${startX + buildingWidth + 4},${topRoofY} ${startX + buildingWidth},${topRoofY - 12} ${startX},${topRoofY - 12}" fill="#0F172A" stroke="#EA3829" stroke-width="1.5" />
        <rect x="${startX + 30}" y="${topRoofY - 18}" width="60" height="7" fill="${isNight ? '#FEF08A' : '#60A5FA'}" fill-opacity="${isNight ? '0.9' : '0.5'}" rx="1" />
        <text x="${startX + 36}" y="${topRoofY - 13}" fill="#0F172A" font-size="5" font-weight="bold">PENTHOUSE SUITE</text>
      `;
    }

    return `
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full max-w-[460px] h-auto transition-all duration-500 drop-shadow-2xl">
        <defs>
          <radialGradient id="nightGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#EA3829" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#0E1524" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <!-- Background Ambient Glow -->
        <circle cx="${svgWidth / 2}" cy="${svgHeight / 2}" r="170" fill="url(#nightGlow)" />
        ${svgElements}
      </svg>
    `;
  }

  bindEvents() {
    // Stage Selector
    const stageBtns = this.container.querySelectorAll('.sim-stage-btn');
    stageBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeStage = parseInt(btn.getAttribute('data-stage'), 10);
        this.render();
      });
    });

    // Floor slider
    const floorInput = this.container.querySelector('#sim-floor-input');
    if (floorInput) {
      floorInput.addEventListener('input', (e) => {
        this.floors = parseInt(e.target.value, 10);
        const display = this.container.querySelector('#sim-floor-display');
        const lang = this.getLang();
        if (display) display.textContent = `${this.floors} ${lang === 'az' ? 'Mərtəbə' : 'Floors'}`;
        
        // Re-render building graphic without refreshing whole DOM
        const svgContainer = this.container.querySelector('svg');
        if (svgContainer) {
          svgContainer.outerHTML = this.generateBuildingSVG();
        }
      });
    }

    // Toggle X-Ray
    const xrayBtn = this.container.querySelector('#sim-toggle-xray');
    if (xrayBtn) {
      xrayBtn.addEventListener('click', () => {
        this.isXray = !this.isXray;
        this.render();
      });
    }

    // Toggle Night
    const nightBtn = this.container.querySelector('#sim-toggle-night');
    if (nightBtn) {
      nightBtn.addEventListener('click', () => {
        this.isNight = !this.isNight;
        this.render();
      });
    }

    // Invest CTA
    const investCta = this.container.querySelector('#sim-invest-cta');
    if (investCta && this.onInvestClick) {
      investCta.addEventListener('click', () => {
        this.onInvestClick(this.activeStage, this.floors);
      });
    }
  }
}
