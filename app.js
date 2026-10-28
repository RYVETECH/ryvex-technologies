/**
 * ==============================================================================
 * RYVEX TECHNOLOGIES — CORE AEROSPACE APPLICATION LOGIC & HUD ENGINE
 * Brand: RYVEX Technologies | Build Beyond Limits
 * Founder: Raman Luthra
 * Architecture: Native Vanilla JavaScript (ES6+), Web Audio API, Canvas 2D
 * ==============================================================================
 */

(function () {
  'use strict';

  /* ============================================================================
     1. PROCEDURAL AUDIO SYNTHESIZER ENGINE (WEB AUDIO API)
     Zero external audio assets required. Generates authentic sci-fi SFX in code.
     ============================================================================ */
  class AerospaceAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = true; // start muted per browser autoplay standards
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.init();
      this.isMuted = !this.isMuted;
      if (!this.isMuted) {
        this.playChirp(880, 1760, 0.12, 'sine');
      }
      return !this.isMuted;
    }

    // High-tech laser chirp / button click
    playClick() {
      if (this.isMuted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch (e) {
        console.warn('Audio click failed', e);
      }
    }

    // High frequency chirp for radar blip / confirm
    playChirp(freqStart = 600, freqEnd = 1400, duration = 0.08, type = 'sine') {
      if (this.isMuted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freqStart, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Chirp error', e);
      }
    }

    // Servo motor mechanical movement sound
    playServo() {
      if (this.isMuted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(260, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      } catch (e) {
        console.warn('Servo error', e);
      }
    }

    // Tactical hazard siren warble for UXO alarm
    playHazardAlarm() {
      if (this.isMuted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';

        // Warble frequencies
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.linearRampToValueAtTime(650, now + 0.15);
        osc.frequency.linearRampToValueAtTime(950, now + 0.3);
        osc.frequency.linearRampToValueAtTime(650, now + 0.45);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(now + 0.5);
      } catch (e) {
        console.warn('Hazard alarm error', e);
      }
    }

    // Electronic sorting confirmation chime
    playSortChime() {
      if (this.isMuted || !this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

          gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.15);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(this.ctx.currentTime + idx * 0.06);
          osc.stop(this.ctx.currentTime + idx * 0.06 + 0.15);
        });
      } catch (e) {
        console.warn('Sort chime error', e);
      }
    }
  }

  const soundEngine = new AerospaceAudioEngine();

  /* ============================================================================
     2. BACKGROUND STARFIELD CANVAS & MOUSE PARALLAX
     ============================================================================ */
  function initStarfield() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    const starCount = 140;

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createStars();
    }

    function createStars() {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.4,
          speed: Math.random() * 0.4 + 0.1,
          hue: Math.random() > 0.6 ? 185 : (Math.random() > 0.5 ? 210 : 0), // cyan, laser blue, or neutral silver
          opacity: Math.random() * 0.8 + 0.2,
          pulseSpeed: Math.random() * 0.03 + 0.01
        });
      }
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX - width / 2) * 0.04;
      targetMouseY = (e.clientY - height / 2) * 0.04;
    });

    resize();

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      stars.forEach(star => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        star.opacity += Math.sin(Date.now() * star.pulseSpeed * 0.05) * 0.01;
        const currentOpacity = Math.max(0.1, Math.min(0.9, star.opacity));

        const drawX = star.x + mouseX * (star.size * 0.5);
        const drawY = star.y + mouseY * (star.size * 0.5);

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        if (star.hue === 0) {
          ctx.fillStyle = `rgba(240, 246, 255, ${currentOpacity})`;
        } else if (star.hue === 185) {
          ctx.fillStyle = `rgba(0, 240, 255, ${currentOpacity})`;
        } else {
          ctx.fillStyle = `rgba(0, 102, 255, ${currentOpacity})`;
        }
        ctx.shadowBlur = star.size > 1.2 ? 6 : 0;
        ctx.shadowColor = '#00f0ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(render);
    }

    render();
  }

  /* ============================================================================
     3. TOP NAVIGATION & AUDIO TOGGLE
     ============================================================================ */
  function initNavigation() {
    const soundBtn = document.getElementById('sound-toggle-btn');
    const soundIndicator = document.getElementById('sound-wave-indicator');
    const soundText = document.getElementById('sound-btn-text');

    if (soundBtn && soundIndicator && soundText) {
      soundBtn.addEventListener('click', () => {
        const isAudioActive = soundEngine.toggle();
        if (isAudioActive) {
          soundIndicator.classList.add('active');
          soundText.textContent = 'AUDIO: LIVE';
          soundBtn.style.borderColor = 'var(--cyan)';
          showToast('Aerospace Audio Synthesizer: ONLINE');
        } else {
          soundIndicator.classList.remove('active');
          soundText.textContent = 'AUDIO: OFF';
          soundBtn.style.borderColor = 'var(--border-cyan)';
          showToast('Aerospace Audio Synthesizer: MUTED');
        }
      });
    }

    // Add audio click feedback to primary interactive elements
    document.querySelectorAll('.btn-hud-primary, .btn-hud-secondary, .console-tab-btn, .filter-btn, .quick-chip-btn, .btn-feed-item, .sim-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        soundEngine.playClick();
      });
    });

    // Mobile navigation toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('main-nav-links');
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        mobileToggle.textContent = navLinks.classList.contains('mobile-open') ? '✕' : '☰';
      });

      // Close mobile menu on link click
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('mobile-open');
          mobileToggle.textContent = '☰';
        });
      });
    }

    // Live Clock display
    const timeDisplay = document.getElementById('system-time-display');
    function updateClock() {
      if (timeDisplay) {
        const d = new Date();
        const h = String(d.getUTCHours()).padStart(2, '0');
        const m = String(d.getUTCMinutes()).padStart(2, '0');
        const s = String(d.getUTCSeconds()).padStart(2, '0');
        timeDisplay.textContent = `UTC ${h}:${m}:${s}`;
      }
    }
    setInterval(updateClock, 1000);
    updateClock();
  }

  /* ============================================================================
     4. MISSION CONTROL HUD: TAB SWITCHER & SHORTCUTS
     ============================================================================ */
  function initMissionControlTabs() {
    const tabBtns = document.querySelectorAll('.console-tab-btn');
    const panels = document.querySelectorAll('.console-panel');

    function activateTab(targetId) {
      tabBtns.forEach(btn => {
        const matches = btn.getAttribute('data-tab') === targetId;
        btn.classList.toggle('active', matches);
        btn.setAttribute('aria-selected', matches ? 'true' : 'false');
      });

      panels.forEach(panel => {
        const isTarget = panel.id === targetId;
        panel.classList.toggle('active', isTarget);
      });

      soundEngine.playChirp(700, 1100, 0.08, 'sine');
    }

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        activateTab(target);
      });
    });

    // Support for .switch-to-tab buttons anywhere on the page
    document.querySelectorAll('.switch-to-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-target');
        activateTab(target);
        const section = document.getElementById('mission-control');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================================================
     5. TAB 1: ARCR-UGV AUTONOMOUS RADAR SIMULATOR
     ============================================================================ */
  function initArcrRadarSimulator() {
    const canvas = document.getElementById('arcr-radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 25;

    let sweepAngle = 0;
    const sweepSpeed = 0.028;

    // Contact types: '9mm', '556', '762', 'uxo'
    let contacts = [];

    // Pre-populate with typical range scatter
    function generateInitialContacts() {
      contacts = [];
      const calibers = ['9mm', '556', '762'];
      for (let i = 0; i < 9; i++) {
        const dist = Math.random() * (maxRadius - 35) + 30;
        const angle = Math.random() * Math.PI * 2;
        const cal = calibers[Math.floor(Math.random() * calibers.length)];
        contacts.push({
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist,
          distance: dist,
          angle: angle,
          type: cal,
          discovered: true,
          alpha: 0.9,
          pulse: 0
        });
      }
      updateContactsHUD();
    }

    generateInitialContacts();

    function updateContactsHUD() {
      const countLabel = document.getElementById('radar-contacts-count');
      if (countLabel) {
        countLabel.textContent = `CONTACTS: ${contacts.length}`;
      }
    }

    // Trigger radar sweep with new targets
    const btnSweep = document.getElementById('btn-trigger-sweep');
    if (btnSweep) {
      btnSweep.addEventListener('click', () => {
        soundEngine.playChirp(400, 1600, 0.15, 'sawtooth');
        // Add 3-5 new targets
        const added = 3 + Math.floor(Math.random() * 3);
        const calibers = ['9mm', '556', '762'];
        for (let i = 0; i < added; i++) {
          const dist = Math.random() * (maxRadius - 30) + 25;
          const angle = Math.random() * Math.PI * 2;
          const cal = calibers[Math.floor(Math.random() * calibers.length)];
          contacts.push({
            x: centerX + Math.cos(angle) * dist,
            y: centerY + Math.sin(angle) * dist,
            distance: dist,
            angle: angle,
            type: cal,
            discovered: false,
            alpha: 1.0,
            pulse: 0
          });
        }
        updateContactsHUD();
        showToast(`Radar sweep active: ${added} new acoustic targets detected.`);
      });
    }

    // Trigger UXO Hazard
    const btnHazard = document.getElementById('btn-trigger-hazard');
    const hazardAlertBanner = document.getElementById('hazard-alert-banner');
    if (btnHazard && hazardAlertBanner) {
      btnHazard.addEventListener('click', () => {
        soundEngine.playHazardAlarm();

        // Inject high priority UXO near center
        const dist = Math.random() * (maxRadius * 0.5) + 20;
        const angle = Math.random() * Math.PI * 2;
        contacts.unshift({
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist,
          distance: dist,
          angle: angle,
          type: 'uxo',
          discovered: true,
          alpha: 1.0,
          pulse: 0
        });

        hazardAlertBanner.classList.add('active');
        updateContactsHUD();
        showToast('CRITICAL ALERT: Live Unexploded Ordnance (UXO) Detected!');
      });
    }

    // Collect detected brass
    const btnCollect = document.getElementById('btn-collect-brass');
    if (btnCollect) {
      btnCollect.addEventListener('click', () => {
        const brassOnly = contacts.filter(c => c.type !== 'uxo');
        if (brassOnly.length === 0) {
          showToast('No spend brass on grid. Run radar scan first.');
          return;
        }

        soundEngine.playServo();

        // Update counts
        const count9 = contacts.filter(c => c.type === '9mm').length;
        const count556 = contacts.filter(c => c.type === '556').length;
        const count762 = contacts.filter(c => c.type === '762').length;

        const bin9 = document.getElementById('bin-count-9mm');
        const bin556 = document.getElementById('bin-count-556');
        const bin762 = document.getElementById('bin-count-762');
        const brassTotal = document.getElementById('metric-brass-cleared');

        if (bin9) bin9.textContent = parseInt(bin9.textContent || 0) + count9;
        if (bin556) bin556.textContent = parseInt(bin556.textContent || 0) + count556;
        if (bin762) bin762.textContent = parseInt(bin762.textContent || 0) + count762;
        if (brassTotal) {
          const currentTotal = parseInt(brassTotal.textContent || 0);
          brassTotal.innerHTML = `${currentTotal + brassOnly.length} <span class="metric-unit">PCS</span>`;
        }

        // Keep UXO if present
        contacts = contacts.filter(c => c.type === 'uxo');
        updateContactsHUD();
        showToast(`Trommel Sieve: ${brassOnly.length} cartridges recovered & sorted into bins.`);
      });
    }

    // Reset simulator
    const btnReset = document.getElementById('btn-reset-radar');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        contacts = [];
        if (hazardAlertBanner) hazardAlertBanner.classList.remove('active');
        generateInitialContacts();
        soundEngine.playClick();
        showToast('ARCR-UGV Radar grid recalibrated.');
      });
    }

    // Main 2D Radar Loop
    function drawRadar() {
      ctx.fillStyle = '#02050b';
      ctx.fillRect(0, 0, width, height);

      // Draw Range Circles
      const rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach(fraction => {
        const r = maxRadius * fraction;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = fraction === 1.0 ? 'rgba(0, 240, 255, 0.45)' : 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = fraction === 1.0 ? 1.5 : 1;
        ctx.stroke();

        // Distance label
        ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`${Math.round(fraction * 200)}M`, centerX + r - 25, centerY - 4);
      });

      // Draw Crosshair Axes
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Heading Cardinal labels
      ctx.fillStyle = 'var(--cyan)';
      ctx.font = '11px "Orbitron", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('000° N', centerX, centerY - maxRadius - 8);
      ctx.fillText('180° S', centerX, centerY + maxRadius + 18);
      ctx.fillText('270° W', centerX - maxRadius - 20, centerY + 4);
      ctx.fillText('090° E', centerX + maxRadius + 20, centerY + 4);

      // Draw Sweep Cone / Line
      sweepAngle += sweepSpeed;
      if (sweepAngle >= Math.PI * 2) {
        sweepAngle = 0;
      }

      // Sweeping Sector Trail
      const trailAngle = 0.5; // radians of gradient trail
      const sweepGradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, maxRadius);
      sweepGradient.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
      sweepGradient.addColorStop(1, 'rgba(0, 240, 255, 0.02)');

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, sweepAngle - trailAngle, sweepAngle, false);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Leading Sweep Beam
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(sweepAngle) * maxRadius, centerY + Math.sin(sweepAngle) * maxRadius);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f0ff';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Rover Center Marker
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'var(--cyan)';
      ctx.fill();

      // Draw Contacts
      contacts.forEach(contact => {
        // Check if sweep line passes close to contact angle
        const angleDiff = Math.abs((sweepAngle - contact.angle + Math.PI * 2) % (Math.PI * 2));
        if (angleDiff < 0.08) {
          contact.discovered = true;
          contact.alpha = 1.0;
          if (contact.type === 'uxo') {
            soundEngine.playHazardAlarm();
          } else {
            soundEngine.playChirp(900, 1300, 0.04, 'sine');
          }
        } else {
          contact.alpha = Math.max(0.25, contact.alpha - 0.003);
        }

        if (contact.discovered) {
          ctx.beginPath();

          if (contact.type === 'uxo') {
            // Pulsing critical red hazard marker
            contact.pulse += 0.08;
            const pulseR = 9 + Math.sin(contact.pulse) * 3;
            ctx.arc(contact.x, contact.y, pulseR, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 51, 102, 0.9)';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff3366';
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Skull or exclamation label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px "JetBrains Mono", monospace';
            ctx.fillText('UXO!', contact.x, contact.y - 14);
          } else {
            // Cartridge dots: 9mm (amber), 556 (cyan), 762 (laser blue)
            let color = 'rgba(255, 170, 0, ';
            let label = '9mm';
            let dotR = 4;

            if (contact.type === '556') {
              color = 'rgba(0, 240, 255, ';
              label = '5.56';
              dotR = 4.5;
            } else if (contact.type === '762') {
              color = 'rgba(0, 102, 255, ';
              label = '7.62';
              dotR = 5.5;
            }

            ctx.arc(contact.x, contact.y, dotR, 0, Math.PI * 2);
            ctx.fillStyle = color + contact.alpha + ')';
            ctx.shadowBlur = 8;
            ctx.shadowColor = color + '1)';
            ctx.fill();
            ctx.shadowBlur = 0;

            // Small caliber label
            ctx.fillStyle = `rgba(203, 213, 225, ${contact.alpha})`;
            ctx.font = '8px "JetBrains Mono", monospace';
            ctx.fillText(label, contact.x, contact.y - 8);
          }
        }
      });

      requestAnimationFrame(drawRadar);
    }

    drawRadar();
  }

  /* ============================================================================
     6. TAB 2: VIGIL-X4 MULTI-DOMAIN COMMAND CONSOLE
     ============================================================================ */
  function initVigilCommandConsole() {
    const droneOverlay = document.getElementById('drone-overlay');
    const scoutOverlay = document.getElementById('scout-car-overlay');
    const btnDeployDrone = document.getElementById('btn-deploy-drone');
    const btnDeployScout = document.getElementById('btn-deploy-scout');
    const btnRecallAll = document.getElementById('btn-recall-all');
    const btnFlirToggle = document.getElementById('btn-flir-toggle');
    const stageImg = document.getElementById('vigil-stage-img');
    const droneHudTag = document.getElementById('drone-hud-tag');
    const scoutHudTag = document.getElementById('scout-hud-tag');
    const vigilCommStatus = document.getElementById('vigil-comm-status');

    let droneDeployed = false;
    let scoutDeployed = false;
    let isFlirActive = false;

    if (btnDeployDrone && droneOverlay) {
      btnDeployDrone.addEventListener('click', () => {
        droneDeployed = !droneDeployed;
        droneOverlay.classList.toggle('deployed', droneDeployed);
        if (droneDeployed) {
          soundEngine.playChirp(300, 1800, 0.25, 'triangle');
          if (droneHudTag) droneHudTag.textContent = 'AERIAL QUAD: AIRBORNE (ALT: 45M)';
          showToast('VIGIL-X4: Recon quadcopter launched from top flight deck.');
        } else {
          soundEngine.playServo();
          if (droneHudTag) droneHudTag.textContent = 'AERIAL QUAD: DOCKED';
          showToast('VIGIL-X4: Recon quadcopter docked on flight deck.');
        }
      });
    }

    if (btnDeployScout && scoutOverlay) {
      btnDeployScout.addEventListener('click', () => {
        scoutDeployed = !scoutDeployed;
        scoutOverlay.classList.toggle('deployed', scoutDeployed);
        if (scoutDeployed) {
          soundEngine.playServo();
          if (scoutHudTag) scoutHudTag.textContent = 'SCOUT CAR: DISPATCHED // SECTOR 02';
          showToast('VIGIL-X4: Motorized tailgate lowered. Autonomous mini-scout car deployed.');
        } else {
          soundEngine.playServo();
          if (scoutHudTag) scoutHudTag.textContent = 'SCOUT CAR: RETRACTED';
          showToast('VIGIL-X4: Scout rover docked in rear garage bay.');
        }
      });
    }

    if (btnRecallAll) {
      btnRecallAll.addEventListener('click', () => {
        soundEngine.playChirp(800, 400, 0.2, 'sawtooth');
        if (droneOverlay) droneOverlay.classList.remove('deployed');
        if (scoutOverlay) scoutOverlay.classList.remove('deployed');
        droneDeployed = false;
        scoutDeployed = false;
        if (droneHudTag) droneHudTag.textContent = 'AERIAL QUAD: DOCKED & LOCKED';
        if (scoutHudTag) scoutHudTag.textContent = 'SCOUT CAR: SECURED';
        showToast('Mothership recall command executed. All sub-units secured.');
      });
    }

    if (btnFlirToggle && stageImg) {
      btnFlirToggle.addEventListener('click', () => {
        isFlirActive = !isFlirActive;
        soundEngine.playChirp(1200, 900, 0.1, 'sine');
        if (isFlirActive) {
          stageImg.style.filter = 'hue-rotate(180deg) contrast(1.6) invert(0.9)';
          btnFlirToggle.style.background = 'var(--crimson)';
          btnFlirToggle.style.color = '#ffffff';
          if (vigilCommStatus) vigilCommStatus.textContent = 'OPTICAL: FLIR THERMAL ACTIVE';
          showToast('FLIR Thermal Imaging mode enabled.');
        } else {
          stageImg.style.filter = 'none';
          btnFlirToggle.style.background = 'rgba(255, 51, 102, 0.15)';
          btnFlirToggle.style.color = 'var(--crimson)';
          if (vigilCommStatus) vigilCommStatus.textContent = 'STATUS: COMBAT READY';
          showToast('Restored standard 1080p optical stream.');
        }
      });
    }

    // 5-DOF Arm Kinematics Sliders
    const armSliders = [
      { id: 'arm-slider-yaw', valId: 'val-arm-yaw', suffix: '°' },
      { id: 'arm-slider-shoulder', valId: 'val-arm-shoulder', suffix: '°' },
      { id: 'arm-slider-elbow', valId: 'val-arm-elbow', suffix: '°' },
      { id: 'arm-slider-gripper', valId: 'val-arm-gripper', suffix: '%' }
    ];

    armSliders.forEach(item => {
      const slider = document.getElementById(item.id);
      const valDisplay = document.getElementById(item.valId);
      if (slider && valDisplay) {
        slider.addEventListener('input', () => {
          valDisplay.textContent = slider.value + item.suffix;
          soundEngine.playServo();
        });
      }
    });

    // Ambient Sensor Jitter (Live realistic telemetry fluctuations)
    setInterval(() => {
      const gasEl = document.getElementById('sensor-gas-ppm');
      const tempEl = document.getElementById('sensor-temp-reading');
      const loraEl = document.getElementById('sensor-lora-rssi');
      const latencyEl = document.getElementById('sensor-espnow-latency');
      const batteryEl = document.getElementById('sensor-battery-voltage');

      if (gasEl) {
        const val = 308 + Math.floor(Math.random() * 9);
        gasEl.innerHTML = `${val} <span style="font-size: 0.75rem;">PPM</span>`;
      }
      if (tempEl) {
        const val = (28.2 + Math.random() * 0.5).toFixed(1);
        tempEl.innerHTML = `${val} <span style="font-size: 0.75rem;">°C</span>`;
      }
      if (loraEl) {
        const val = -65 - Math.floor(Math.random() * 5);
        loraEl.innerHTML = `${val} <span style="font-size: 0.75rem;">dBm</span>`;
      }
      if (latencyEl) {
        const val = (1.9 + Math.random() * 0.4).toFixed(1);
        latencyEl.innerHTML = `${val} <span style="font-size: 0.75rem;">ms</span>`;
      }
      if (batteryEl) {
        const val = (11.85 + Math.random() * 0.08).toFixed(2);
        batteryEl.innerHTML = `${val} <span style="font-size: 0.75rem;">V</span>`;
      }
    }, 2400);
  }

  /* ============================================================================
     7. TAB 3: ECOGUARDIAN WASTE SORTER SIMULATOR
     ============================================================================ */
  function initEcoGuardianSimulator() {
    const feedButtons = document.querySelectorAll('.btn-feed-item');
    const chute = document.getElementById('eco-chute');
    const chuteIcon = document.getElementById('eco-chute-icon');
    const chuteStatus = document.getElementById('eco-chute-status');
    const needle = document.getElementById('eco-diverter-needle');
    const scanDetected = document.getElementById('eco-scan-detected');
    const scanConfidence = document.getElementById('eco-scan-confidence');
    const rotorAngle = document.getElementById('eco-rotor-angle');

    // Bin Progress and Counts
    const bins = {
      metal: {
        angle: -45,
        icon: '🥫',
        name: 'METALLIC BEVERAGE CAN',
        conf: '99.4%',
        fillEl: document.getElementById('metal-fill-bar'),
        pctEl: document.getElementById('metal-fill-pct'),
        txtEl: document.getElementById('metal-count-txt'),
        count: 7,
        pct: 35
      },
      plastic: {
        angle: -15,
        icon: '🧴',
        name: 'PET POLYMER BOTTLE',
        conf: '98.8%',
        fillEl: document.getElementById('plastic-fill-bar'),
        pctEl: document.getElementById('plastic-fill-pct'),
        txtEl: document.getElementById('plastic-count-txt'),
        count: 13,
        pct: 52
      },
      wet: {
        angle: 15,
        icon: '🍎',
        name: 'ORGANIC BIO-MASS',
        conf: '99.1%',
        fillEl: document.getElementById('wet-fill-bar'),
        pctEl: document.getElementById('wet-fill-pct'),
        txtEl: document.getElementById('wet-count-txt'),
        count: 24,
        pct: 68
      },
      dry: {
        angle: 45,
        icon: '📄',
        name: 'CELLULOSE PAPERBOARD',
        conf: '97.9%',
        fillEl: document.getElementById('dry-fill-bar'),
        pctEl: document.getElementById('dry-fill-pct'),
        txtEl: document.getElementById('dry-count-txt'),
        count: 10,
        pct: 40
      }
    };

    let isProcessing = false;

    feedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (isProcessing) return;
        const type = btn.getAttribute('data-type');
        const item = bins[type];
        if (!item) return;

        isProcessing = true;
        soundEngine.playChirp(800, 1600, 0.1, 'sine');

        if (chute) chute.classList.add('scanning');
        if (chuteIcon) chuteIcon.textContent = item.icon;
        if (chuteStatus) chuteStatus.textContent = `SENSOR SCANNING: ${item.name}...`;

        setTimeout(() => {
          soundEngine.playServo();
          if (needle) needle.style.transform = `rotate(${item.angle}deg)`;
          if (rotorAngle) rotorAngle.textContent = `${item.angle}°`;
          if (scanDetected) scanDetected.textContent = item.name;
          if (scanConfidence) scanConfidence.textContent = item.conf;

          setTimeout(() => {
            soundEngine.playSortChime();
            if (chute) chute.classList.remove('scanning');
            if (chuteStatus) chuteStatus.textContent = `DIVERTED TO ${type.toUpperCase()} COMPARTMENT`;

            // Increment bin
            item.count += 1;
            item.pct = Math.min(100, item.pct + 4);

            if (item.fillEl) item.fillEl.style.width = `${item.pct}%`;
            if (item.pctEl) item.pctEl.textContent = `${item.pct}%`;
            if (item.txtEl) {
              item.txtEl.textContent = `Sensor Triggered: ${item.count} items`;
            }

            showToast(`EcoGuardian Sorter: Successfully sorted ${item.name} (${item.conf} accuracy).`);
            isProcessing = false;
          }, 600);
        }, 500);
      });
    });
  }

  /* ============================================================================
     8. TAB 4: "THURSDAY" AI VIRTUAL TERMINAL
     ============================================================================ */
  function initThursdayTerminal() {
    const chatForm = document.getElementById('terminal-chat-form');
    const input = document.getElementById('terminal-input');
    const messageStream = document.getElementById('terminal-messages-stream');
    const quickChips = document.querySelectorAll('.quick-chip-btn');

    const KB = {
      founder: `<strong>Raman Luthra</strong> is a 16-year-old student robotics innovator, Atal Tinkering Lab (ATL) lead, and aspiring defense entrepreneur from Meerut, Uttar Pradesh, India.<br><br>
      He is the founder of <strong>RYVEX Technologies</strong>, specializing in autonomous unmanned ground vehicles (UGVs), combat retrieval mechanics, multi-domain command motherships, and AI waste sorting. He has qualified among the <strong>Top 100 teams out of 1,100 national applicants at IIT Roorkee National Techathon 3.0</strong>, won 1st Position Gold at the State Science Fair, and received honors from NITI Aayog's ACIC MIET Meerut and the Bureau of Indian Standards (BIS).`,

      vigil: `The <strong>VIGIL-X4 Multi-Domain Command Carrier</strong> is an advanced autonomous mothership engineered on a dual-microcontroller architecture:<br><br>
      • <strong>Master Node:</strong> ESP32 governing high-torque tracked chassis drive via dual 43A BTS7960 H-bridges, LoRa 433MHz sub-GHz long-range telemetry, and FlySky 2.4GHz backup.<br>
      • <strong>Slave Node:</strong> ESP32 coordinating the motorized rear tailgate garage to deploy an autonomous micro-scout car, commanding a roof-deck quadcopter launch station, and driving a 5-DOF high-torque metal-gear robotic manipulator arm.<br>
      • <strong>Protocol:</strong> Zero-packet-drop ESP-NOW local mesh with real-time Tapo 360° pan-tilt vision and MQ-135 environmental gas analysis.`,

      arcr: `The <strong>ARCR-UGV (Autonomous Range Cartridge Retriever)</strong> is an INSPIRE-MANAK award nominated system designed to eliminate manual labor and extreme danger on military shooting grounds:<br><br>
      • Features a rugged tracked mobility chassis capable of traversing wet mud and gravel.<br>
      • Uses an onboard calibrated 3-stage rotary spiral trommel sieve that automatically sorts high-value spent brass casings (9mm NATO, 5.56x45mm INSAS/NATO, and 7.62x51mm).<br>
      • Integrates a sub-surface pulsed metal induction coil and edge AI vision to actively classify live ammunition and unexploded ordnance (UXO), triggering emergency automated halts.`,

      techathon: `At the prestigious <strong>National Techathon 3.0 hosted by the Indian Institute of Technology (IIT) Roorkee</strong>, Raman Luthra's VIGIL-X4 project was selected in the <strong>Defense Innovation category</strong>.<br><br>
      Out of more than <strong>1,100 national project submissions from across India</strong>, Raman's dual-ESP32 mothership ranked within the Top 100 teams nationwide, earning widespread acclaim from defense researchers, academic juries, and print media including Janvani and Heera Times.`,

      evolution: `The EcoGuardian & Robotics Evolution spans three distinct engineering generations:<br><br>
      • <strong>Generation 1 (Proof-of-Concept):</strong> Hand-soldered cardboard and acrylic frame with an Arduino Uno, moisture probes, and a single micro-servo dual-direction flap (Wet/Dry).<br>
      • <strong>Generation 2 (Rotary Sorter):</strong> State 1st Prize winner featuring a NEMA stepper-driven rotary index table, 4 distinct bins (Metal, Plastic, Wet, Dry), inductive metal sensors, capacitive probes, and ultrasonic depth measurement.<br>
      • <strong>Generation 3 (Mobile Rover & Thursday AI):</strong> Transitioned onto an all-terrain tracked rover base with dual-ESP32 ESP-NOW command, LoRa 433MHz telemetry, and the "Thursday" AI core assistant.`,

      default: `Query logged into RYVEX Telemetry Bus. As Thursday AI, I have full operational access to Raman Luthra's schematics, test bench logs, and award records.<br><br>
      Try asking about: <em>'Who is Raman Luthra?'</em>, <em>'VIGIL-X4 architecture'</em>, <em>'ARCR-UGV spent brass sorting'</em>, <em>'IIT Roorkee selection'</em>, or <em>'Generations 1-3 evolution'</em>.`
    };

    function appendUserMessage(text) {
      const row = document.createElement('div');
      row.className = 'user-message-row';
      row.innerHTML = `<div class="user-msg-bubble">${escapeHtml(text)}</div>`;
      messageStream.appendChild(row);
      messageStream.scrollTop = messageStream.scrollHeight;
    }

    function appendAiMessage(htmlContent) {
      const row = document.createElement('div');
      row.className = 'ai-message-row';
      row.innerHTML = `
        <div class="ai-avatar">TH</div>
        <div class="ai-msg-bubble">${htmlContent}</div>
      `;
      messageStream.appendChild(row);
      messageStream.scrollTop = messageStream.scrollHeight;
      soundEngine.playChirp(900, 1400, 0.08, 'sine');
    }

    function processQuery(rawQuery) {
      const q = rawQuery.toLowerCase().trim();
      let response = KB.default;

      if (q.includes('raman') || q.includes('who is') || q.includes('founder') || q.includes('age') || q.includes('bio')) {
        response = KB.founder;
      } else if (q.includes('vigil') || q.includes('x4') || q.includes('mothership') || q.includes('arm') || q.includes('drone') || q.includes('scout')) {
        response = KB.vigil;
      } else if (q.includes('arcr') || q.includes('cartridge') || q.includes('brass') || q.includes('ammo') || q.includes('trommel') || q.includes('radar') || q.includes('uxo')) {
        response = KB.arcr;
      } else if (q.includes('roorkee') || q.includes('iit') || q.includes('techathon') || q.includes('finalist') || q.includes('competition')) {
        response = KB.techathon;
      } else if (q.includes('gen') || q.includes('evolution') || q.includes('upgrade') || q.includes('triptych') || q.includes('history')) {
        response = KB.evolution;
      } else if (q === 'clear') {
        messageStream.innerHTML = '';
        appendAiMessage('Terminal buffer cleared. Thursday AI core standing by.');
        return;
      } else if (q === 'help' || q === 'commands' || q === 'status') {
        response = `<strong>Available Command Directives:</strong><br>
        • <code>founder</code> — Profile of Raman Luthra<br>
        • <code>vigil</code> — Dual-ESP32 mothership specs<br>
        • <code>arcr</code> — Trommel sieve ammo retrieval details<br>
        • <code>techathon</code> — IIT Roorkee competition credentials<br>
        • <code>evolution</code> — Gen 1 to Gen 3 progression<br>
        • <code>clear</code> — Clear console buffer`;
      }

      appendAiMessage(response);
    }

    if (chatForm && input) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        appendUserMessage(text);
        input.value = '';
        setTimeout(() => processQuery(text), 250);
      });
    }

    quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        if (query) {
          appendUserMessage(query);
          setTimeout(() => processQuery(query), 200);
        }
      });
    });
  }

  /* ============================================================================
     9. ACHIEVEMENT VAULT & PROOF-OF-WORK GALLERY FILTER
     ============================================================================ */
  function initAchievementVault() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.achievement-item-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s ease-out';
          } else {
            card.style.display = 'none';
          }
        });

        soundEngine.playClick();
      });
    });
  }

  /* ============================================================================
     10. LIGHTBOX MODAL FOR GENUINE EVIDENCE & DEV BENCH PHOTOS
     ============================================================================ */
  function initLightboxModal() {
    const modal = document.getElementById('lightbox-modal');
    const imgEl = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');
    const closeBtn = document.getElementById('lightbox-close-btn');

    if (!modal) return;

    function openLightbox(imgSrc, title, desc) {
      if (imgEl) imgEl.src = imgSrc;
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      soundEngine.playChirp(700, 1100, 0.08, 'sine');
    }

    function closeLightbox() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      soundEngine.playClick();
    }

    // Attach to achievement cards
    document.querySelectorAll('.achievement-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-img');
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        openLightbox(imgSrc, title, desc);
      });
    });

    // Attach to dev bench photo tiles
    document.querySelectorAll('.dev-photo-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const imgSrc = tile.getAttribute('data-img');
        const title = tile.getAttribute('data-title');
        const desc = tile.getAttribute('data-desc');
        openLightbox(imgSrc, title, desc);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ============================================================================
     11. SECURE TRANSMISSION FORM (CONTACT)
     ============================================================================ */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value || 'Guest';
      const email = document.getElementById('contact-email')?.value || '';
      const org = document.getElementById('contact-org')?.value || 'Independent';
      const channel = document.getElementById('contact-channel')?.value || 'General';
      const msg = document.getElementById('contact-message')?.value || '';

      soundEngine.playChirp(600, 1800, 0.25, 'triangle');

      showToast(`Transmission Encrypted & Dispatched. Thank you, ${name}!`);

      // Reset form
      form.reset();
    });
  }

  /* ============================================================================
     12. TOAST NOTIFICATION UTILITY
     ============================================================================ */
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('hud-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 3800);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ============================================================================
     13. DOM READY INITIALIZATION
     ============================================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initNavigation();
    initMissionControlTabs();
    initArcrRadarSimulator();
    initVigilCommandConsole();
    initEcoGuardianSimulator();
    initThursdayTerminal();
    initAchievementVault();
    initLightboxModal();
    initContactForm();

    console.log(
      '%cRYVEX TECHNOLOGIES %c// Systems Online. Raman Luthra — Build Beyond Limits.',
      'color: #00f0ff; font-weight: bold; font-size: 14px; background: #03060d; padding: 4px 8px; border: 1px solid #00f0ff;',
      'color: #ffffff; font-size: 12px;'
    );
  });

})();
