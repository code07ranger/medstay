// MedStay Integrated Emergency Healthcare Coordination System (Frontend Controller)
// Manages SOS Emergency Requests, Ambulance Tracking, ER Load Management,
// Patient Transfer Referrals, Medical Supply Re-allocation, and AI Recommendations.

let emergActiveTab = 'sos';
let emergCityFilter = 'All';
let emergOverviewData = null;
let emergSelectedPreset = null;
let emergPollInterval = null;

const emergPresets = [
  { id: 'cardiac', title: 'Cardiac / Chest Pain', icon: '🫀', desc: 'Suspected STEMI, cardiac arrest, arrhythmia', priority: 'Code Red' },
  { id: 'trauma', title: 'Severe Trauma / Accident', icon: '💥', desc: 'Road traffic accident, crush injury, polytrauma', priority: 'Code Red' },
  { id: 'respiratory', title: 'Acute Respiratory Distress', icon: '🫁', desc: 'Severe hypoxia, airway compromise, severe asthma', priority: 'Code Red' },
  { id: 'stroke', title: 'Stroke / Neurological', icon: '🧠', desc: 'Sudden weakness, FAST signs, altered sensorium', priority: 'Code Red' },
  { id: 'maternal', title: 'Maternal / Pediatric Crisis', icon: '🤰', desc: 'Complicated labor, postpartum hemorrhage, neonate crisis', priority: 'Code Red' },
  { id: 'burn', title: 'Major Burn / Chemical', icon: '🔥', desc: 'Deep second/third degree burns, smoke inhalation', priority: 'Code Yellow' },
  { id: 'general', title: 'General Resuscitation', icon: '⚠️', desc: 'Septic shock, severe allergic reaction, acute collapse', priority: 'Code Yellow' }
];

function showEmergencyHub(defaultTab) {
  if (defaultTab) emergActiveTab = defaultTab;
  currentView = 'emergency';
  $('homeView').style.display = 'none';
  if ($('hospitalHero')) $('hospitalHero').style.display = 'none';
  ['dashboardView', 'lifelineView', 'radarView', 'JanvaniView', 'webInfoView'].forEach(id => {
    const el = $(id);
    if (el) el.classList.remove('show');
  });
  const ev = $('emergencyView');
  if (ev) ev.classList.add('show');
  renderNav();
  renderEmergencyHub();

  // Polling every 12s for real-time emergency telemetry
  if (emergPollInterval) clearInterval(emergPollInterval);
  emergPollInterval = setInterval(() => {
    if (currentView === 'emergency') {
      refreshEmergencyTelemetry();
    }
  }, 12000);
}

async function renderEmergencyHub() {
  const root = $('emergencyView');
  if (!root) return;

  root.innerHTML = `
    <div class="emerg-wrap">
      <!-- Hero Banner -->
      <div class="emerg-hero">
        <div class="emerg-hero-top">
          <div>
            <h2>
              🚨 Emergency Healthcare Coordination Hub
              <span class="emerg-live-pill"><span class="emerg-live-dot"></span> LIVE NETWORK</span>
            </h2>
            <p>
              Integrated crisis coordination connecting patients, ambulance fleets, emergency departments, and regional healthcare administrators.
            </p>
          </div>
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
            <label style="font-weight:700;font-size:12px;color:#94a3b8">REGIONAL ZONE:</label>
            <select id="emergCitySelect" onchange="changeEmergCity(this.value)" style="width:auto;min-width:140px;background:#0f172a;color:#fff;border-color:#334155;padding:8px 12px;font-weight:700">
              <option value="All" ${emergCityFilter === 'All' ? 'selected' : ''}>All Regions (National)</option>
              <option value="Bengaluru" ${emergCityFilter === 'Bengaluru' ? 'selected' : ''}>Bengaluru Hub</option>
              <option value="Mumbai" ${emergCityFilter === 'Mumbai' ? 'selected' : ''}>Mumbai Metro</option>
              <option value="Delhi" ${emergCityFilter === 'Delhi' ? 'selected' : ''}>Delhi NCR</option>
              <option value="Chennai" ${emergCityFilter === 'Chennai' ? 'selected' : ''}>Chennai Region</option>
            </select>
            <button class="btn ghost" onclick="refreshEmergencyTelemetry()" title="Refresh telemetry">🔄 Refresh</button>
          </div>
        </div>

        <!-- Compliance & Regulatory Banner -->
        <div class="emerg-compliance-banner">
          <b>⚖️ Clinical Governance Notice:</b> This coordination system focuses on emergency dispatch, regional bed/inventory monitoring, inter-hospital referrals, and logistics optimization. In compliance with medical guidelines, the system does not autonomously diagnose conditions, prescribe medications, or replace certified clinical judgment.
        </div>
      </div>

      <!-- Real-time Metrics Cards Strip -->
      <div class="emerg-metrics" id="emergMetricsStrip">
        <div class="emerg-metric-card">
          <div class="emerg-metric-label">Active SOS Emergencies <span style="font-size:16px">🚨</span></div>
          <div class="emerg-metric-val red" id="metricActiveSos">—</div>
          <div class="emerg-metric-sub">Real-time distress signals</div>
        </div>
        <div class="emerg-metric-card">
          <div class="emerg-metric-label">Ambulances Ready <span style="font-size:16px">🚑</span></div>
          <div class="emerg-metric-val green" id="metricAmbulances">—</div>
          <div class="emerg-metric-sub" id="metricAmbSub">Available for dispatch</div>
        </div>
        <div class="emerg-metric-card">
          <div class="emerg-metric-label">ER Beds Available <span style="font-size:16px">🏥</span></div>
          <div class="emerg-metric-val blue" id="metricErBeds">—</div>
          <div class="emerg-metric-sub" id="metricErOccupancy">Across emergency bays</div>
        </div>
        <div class="emerg-metric-card">
          <div class="emerg-metric-label">Critical Shortages <span style="font-size:16px">⚠️</span></div>
          <div class="emerg-metric-val amber" id="metricShortages">—</div>
          <div class="emerg-metric-sub">Items below safety buffer</div>
        </div>
        <div class="emerg-metric-card">
          <div class="emerg-metric-label">Active Transfers <span style="font-size:16px">🔄</span></div>
          <div class="emerg-metric-val" id="metricTransfers">—</div>
          <div class="emerg-metric-sub">Patient & supply referrals</div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="emerg-tabs">
        <button class="emerg-tab-btn ${emergActiveTab === 'sos' ? 'active' : ''}" onclick="switchEmergTab('sos')">
          🚨 Instant SOS & Dispatch
        </button>
        <button class="emerg-tab-btn ${emergActiveTab === 'ambulances' ? 'active' : ''}" onclick="switchEmergTab('ambulances')">
          🚑 Ambulance Fleet & Radar
        </button>
        <button class="emerg-tab-btn ${emergActiveTab === 'services' ? 'active' : ''}" onclick="switchEmergTab('services')">
          🏥 ER Load & Trauma Bays
        </button>
        <button class="emerg-tab-btn ${emergActiveTab === 'transfers' ? 'active' : ''}" onclick="switchEmergTab('transfers')">
          🔄 Patient Transfer Referrals
        </button>
        <button class="emerg-tab-btn ${emergActiveTab === 'supplies' ? 'active' : ''}" onclick="switchEmergTab('supplies')">
          📦 Critical Supply Re-allocation
        </button>
        <button class="emerg-tab-btn ${emergActiveTab === 'ai-recs' ? 'active' : ''}" onclick="switchEmergTab('ai-recs')">
          🤖 AI Resource Optimizer
        </button>
      </div>

      <!-- Sub-Tab Content View -->
      <div id="emergTabContent"></div>
    </div>
  `;

  await refreshEmergencyTelemetry();
  await renderEmergTabContent();
}

function switchEmergTab(tab) {
  emergActiveTab = tab;
  document.querySelectorAll('.emerg-tab-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = Array.from(document.querySelectorAll('.emerg-tab-btn')).find(b => b.getAttribute('onclick')?.includes(tab));
  if (activeBtn) activeBtn.classList.add('active');
  renderEmergTabContent();
}

async function changeEmergCity(city) {
  emergCityFilter = city;
  await refreshEmergencyTelemetry();
  await renderEmergTabContent();
}

async function refreshEmergencyTelemetry() {
  try {
    const d = await api(`/emergency/overview?city=${encodeURIComponent(emergCityFilter)}`);
    emergOverviewData = d;
    const s = d.stats;
    if ($('metricActiveSos')) $('metricActiveSos').textContent = s.activeSos;
    if ($('metricAmbulances')) $('metricAmbulances').textContent = `${s.availableAmbulances}/${s.totalAmbulances}`;
    if ($('metricAmbSub')) $('metricAmbSub').textContent = `${Math.round((s.availableAmbulances / (s.totalAmbulances || 1)) * 100)}% fleet readiness`;
    if ($('metricErBeds')) $('metricErBeds').textContent = `${s.availableErBeds}`;
    if ($('metricErOccupancy')) $('metricErOccupancy').textContent = `${s.erOccupancyRate}% ER Occupancy Rate`;
    if ($('metricShortages')) $('metricShortages').textContent = s.criticalSupplyShortages;
    if ($('metricTransfers')) $('metricTransfers').textContent = (s.activePatientTransfers + s.activeSupplyTransfers);
  } catch (e) {
    console.error('Failed to refresh emergency metrics:', e);
  }
}

async function renderEmergTabContent() {
  const container = $('emergTabContent');
  if (!container) return;

  if (emergActiveTab === 'sos') {
    await renderSosTab(container);
  } else if (emergActiveTab === 'ambulances') {
    await renderAmbulancesTab(container);
  } else if (emergActiveTab === 'services') {
    await renderServicesTab(container);
  } else if (emergActiveTab === 'transfers') {
    await renderTransfersTab(container);
  } else if (emergActiveTab === 'supplies') {
    await renderSuppliesTab(container);
  } else if (emergActiveTab === 'ai-recs') {
    await renderAiRecommendationsTab(container);
  }
}

// -------------------------------------------------------------
// TAB 1: INSTANT SOS & DISPATCH
// -------------------------------------------------------------
async function renderSosTab(container) {
  let list = [];
  try {
    const d = await api(`/emergency/sos?city=${encodeURIComponent(emergCityFilter)}`);
    list = d.sosRequests || [];
  } catch (e) {
    console.error(e);
  }

  container.innerHTML = `
    <!-- Fast 1-Click SOS Initiation Box -->
    <div class="sos-box">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
        <div>
          <h3 style="margin:0 0 5px;color:#b91c1c;font-size:20px;font-family:Georgia,serif">
            🚨 Immediate Emergency Distress Trigger (SOS)
          </h3>
          <p class="muted" style="margin:0">
            Select emergency syndrome for instant automated ambulance dispatch, ER bed reservation, and nearest trauma center notification.
          </p>
        </div>
        <div style="background:#fee2e2;border:1px solid #fca5a5;padding:6px 12px;border-radius:8px;font-size:12px;color:#991b1b;font-weight:700">
          📞 Central Helpline: 108 / 112
        </div>
      </div>

      <!-- Presets Grid -->
      <div class="sos-presets-grid">
        ${emergPresets.map(p => `
          <button type="button" class="sos-preset-btn ${emergSelectedPreset === p.id ? 'selected' : ''}" onclick="selectSosPreset('${p.id}')">
            <b>${p.icon} ${p.title}</b>
            <span>${p.desc}</span>
          </button>
        `).join('')}
      </div>

      <!-- Distress Details Form -->
      <form id="sosForm" onsubmit="handleSosSubmit(event)">
        <div class="formgrid">
          <div class="field">
            <label>Emergency Category *</label>
            <input id="sosType" required placeholder="Select preset above or type condition" value="${emergSelectedPreset ? (emergPresets.find(x => x.id === emergSelectedPreset)?.title || '') : 'Severe Trauma / Accident'}">
          </div>
          <div class="field">
            <label>Triage Priority Level *</label>
            <select id="sosPriority">
              <option value="Code Red" selected>🔴 Code Red (Life-Threatening / Immediate)</option>
              <option value="Code Yellow">🟡 Code Yellow (Urgent / Stabilization needed)</option>
              <option value="Code Green">🟢 Code Green (Acute / Non-Immediate)</option>
            </select>
          </div>
        </div>

        <div class="formgrid">
          <div class="field">
            <label>Patient / Reporter Name</label>
            <input id="sosPatientName" value="${user?.name || 'Emergency Caller'}" placeholder="Full name of patient or bystander">
          </div>
          <div class="field">
            <label>Contact Phone (Callback) *</label>
            <input id="sosPhone" required value="${user?.phone || ''}" placeholder="10-digit mobile number">
          </div>
        </div>

        <div class="formgrid">
          <div class="field">
            <label>Emergency Location / City *</label>
            <select id="sosCity">
              <option value="Bengaluru" ${emergCityFilter === 'Bengaluru' || emergCityFilter === 'All' ? 'selected' : ''}>Bengaluru</option>
              <option value="Mumbai" ${emergCityFilter === 'Mumbai' ? 'selected' : ''}>Mumbai</option>
              <option value="Delhi" ${emergCityFilter === 'Delhi' ? 'selected' : ''}>Delhi</option>
              <option value="Chennai" ${emergCityFilter === 'Chennai' ? 'selected' : ''}>Chennai</option>
            </select>
          </div>
          <div class="field">
            <label>Exact Location / Landmark *</label>
            <div style="display:flex;gap:6px">
              <input id="sosAddress" required placeholder="Street address, junction, or GPS landmark" style="flex:1" value="MG Road Metro Station Junction">
              <button type="button" class="btn" onclick="useCurrentGpsLocation()" title="Use Current GPS">📍 GPS</button>
            </div>
          </div>
        </div>

        <div class="field">
          <label>Triage Clinical Summary / Symptoms Observed</label>
          <textarea id="sosTriageNotes" placeholder="Describe patient consciousness, bleeding, breathing difficulty, or injuries...">Patient requires urgent resuscitation. Suspected severe trauma with airway compromise. Monitored transport needed.</textarea>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-top:14px">
          <div style="font-size:12px;color:#64748b">
            ⚡ Automated AI Dispatch will match the nearest available ALS ambulance and trauma center.
          </div>
          <button type="submit" class="btn danger-action" style="padding:12px 24px;font-size:15px;display:flex;align-items:center;gap:8px">
            🚨 INITIATE EMERGENCY SOS DISPATCH
          </button>
        </div>
      </form>
    </div>

    <!-- Active SOS Requests Tracker -->
    <div class="heading">
      <h2>Active SOS Emergencies & Dispatch Tracking (${list.length})</h2>
      <button class="btn" onclick="renderSosTab($('emergTabContent'))">🔄 Refresh List</button>
    </div>

    ${list.length ? list.map(item => renderSosCard(item)).join('') : `
      <div class="empty">
        No active emergency SOS requests reported in this region.<br>
        Use the trigger above if immediate emergency dispatch is required.
      </div>
    `}
  `;
}

function selectSosPreset(id) {
  emergSelectedPreset = id;
  const p = emergPresets.find(x => x.id === id);
  if (p) {
    if ($('sosType')) $('sosType').value = p.title;
    if ($('sosPriority')) $('sosPriority').value = p.priority;
    if ($('sosTriageNotes')) $('sosTriageNotes').value = `Emergency distress report for ${p.title}. ${p.desc}. Priority: ${p.priority}. Rapid emergency triage and ALS transport advised.`;
  }
  document.querySelectorAll('.sos-preset-btn').forEach(btn => btn.classList.remove('selected'));
  const activeBtn = Array.from(document.querySelectorAll('.sos-preset-btn')).find(b => b.textContent.includes(p?.title));
  if (activeBtn) activeBtn.classList.add('selected');
}

function useCurrentGpsLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if ($('sosAddress')) {
          $('sosAddress').value = `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (Live Coordinate)`;
        }
        toast('📍 GPS coordinates captured');
      },
      (err) => {
        toast('GPS unavailable. Using default regional landmark.');
      }
    );
  } else {
    toast('Geolocation not supported by browser.');
  }
}

async function handleSosSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.disabled = true;
  btn.textContent = 'DISPATCHING...';

  try {
    const payload = {
      emergencyType: $('sosType').value.trim(),
      priority: $('sosPriority').value,
      patientName: $('sosPatientName').value.trim(),
      phone: $('sosPhone').value.trim(),
      city: $('sosCity').value,
      address: $('sosAddress').value.trim(),
      triageNotes: $('sosTriageNotes').value.trim()
    };

    const res = await api('/emergency/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    toast('🚨 SOS DISPATCHED: Ambulance assigned!');
    emergSelectedPreset = null;
    await refreshEmergencyTelemetry();
    await renderEmergTabContent();
  } catch (err) {
    toast('Error: ' + err.message);
    btn.disabled = false;
    btn.textContent = '🚨 INITIATE EMERGENCY SOS DISPATCH';
  }
}

function renderSosCard(item) {
  const steps = ['Received', 'Dispatched', 'En Route', 'At Scene', 'Transporting', 'Arrived at Hospital', 'Resolved'];
  const currentIndex = Math.max(0, steps.indexOf(item.status));
  const progressPercent = Math.round((currentIndex / (steps.length - 1)) * 100);

  return `
    <article class="sos-active-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
        <div>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
            <span class="status ${item.priority === 'Code Red' ? 'danger' : ''}" style="background:${item.priority === 'Code Red' ? '#fee2e2' : '#fef3c7'};color:${item.priority === 'Code Red' ? '#b91c1c' : '#b45309'};font-weight:800">
              ${item.priority}
            </span>
            <b style="font-size:16px">${item.emergencyType}</b>
            <span class="muted" style="font-size:12px">ID: ${item.id}</span>
          </div>
          <div class="muted" style="font-size:13px">
            📍 <b>${item.location?.address}</b> • ${item.city} • Reported by: <b>${item.patientName}</b> (${item.phone})
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:12px;color:#64748b">Estimated Arrival</div>
          <b style="font-size:22px;color:#dc2626">${item.etaMinutes > 0 ? item.etaMinutes + ' mins' : 'Arrived'}</b>
        </div>
      </div>

      <!-- Live Step Progress Bar -->
      <div class="sos-progress-bar-wrap">
        <div class="sos-progress-line">
          <div class="sos-progress-fill" style="width:${progressPercent}%"></div>
        </div>
        ${steps.map((st, i) => {
          let state = '';
          if (i < currentIndex) state = 'completed';
          else if (i === currentIndex) state = 'active';
          return `
            <div class="sos-progress-step ${state}">
              <div class="sos-step-circle">${i < currentIndex ? '✓' : (i + 1)}</div>
              <div>${st}</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Dispatch Details Strip -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin:12px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;font-size:13px">
        <div>
          <span style="color:#64748b;font-size:11px;display:block">ASSIGNED AMBULANCE</span>
          <b>🚑 ${item.assignedAmbulanceId || 'Standby Ambulance'}</b>
          <span class="muted" style="font-size:11px">(${item.assignedAmbulanceReg || 'Reg KA-01-EA-4412'})</span>
        </div>
        <div>
          <span style="color:#64748b;font-size:11px;display:block">DESTINATION HOSPITAL & ER</span>
          <b>🏥 ${item.assignedHospitalName}</b>
          <span class="muted" style="font-size:11px">(Trauma Bay Reserved)</span>
        </div>
        <div>
          <span style="color:#64748b;font-size:11px;display:block">REPORTED AT</span>
          <b>${new Date(item.createdAt).toLocaleTimeString()}</b>
          <span class="muted" style="font-size:11px">(${new Date(item.createdAt).toLocaleDateString()})</span>
        </div>
      </div>

      <!-- Triage Notes -->
      <div style="font-size:12px;line-height:1.5;background:#fef2f2;border-left:3px solid #ef4444;padding:8px 12px;border-radius:4px;margin-bottom:12px">
        <b>Triage Notes:</b> ${item.triageNotes}
      </div>

      <!-- Admin / Coordinator Status Controls -->
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding-top:10px;border-top:1px solid #f1f5f9">
        <div style="display:flex;gap:6px;align-items:center">
          <span style="font-size:12px;font-weight:700;color:#64748b">Advance Status:</span>
          <select id="sosStatus-${item.id}" style="width:auto;padding:6px 10px;font-size:12px">
            ${steps.map(s => `<option value="${s}" ${s === item.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <button class="btn primary" style="padding:6px 12px;font-size:12px" onclick="updateSosStatus('${item.id}')">Update</button>
        </div>
        <div style="display:flex;gap:8px">
          ${item.status !== 'Resolved' ? `
            <button class="btn" style="color:#16a34a;border-color:#86efac;font-size:12px" onclick="resolveSos('${item.id}')">
              ✓ Mark Resolved / Admitted
            </button>
          ` : `
            <span style="color:#16a34a;font-weight:800;font-size:12px">✓ Emergency Case Resolved</span>
          `}
          <a href="tel:108" class="btn" style="font-size:12px;color:#dc2626;border-color:#fca5a5" title="Call Emergency Line">
            📞 Call 108
          </a>
        </div>
      </div>
    </article>
  `;
}

async function updateSosStatus(id) {
  const sel = $(`sosStatus-${id}`);
  if (!sel) return;
  try {
    await api(`/emergency/sos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: sel.value })
    });
    toast('Status updated to ' + sel.value);
    await refreshEmergencyTelemetry();
    await renderEmergTabContent();
  } catch (e) {
    toast('Error: ' + e.message);
  }
}

async function resolveSos(id) {
  try {
    await api(`/emergency/sos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Resolved', note: 'Patient successfully admitted and stabilized.' })
    });
    toast('SOS Emergency marked as Resolved.');
    await refreshEmergencyTelemetry();
    await renderEmergTabContent();
  } catch (e) {
    toast('Error: ' + e.message);
  }
}

// -------------------------------------------------------------
// TAB 2: AMBULANCE FLEET & LIVE TELEMETRY
// -------------------------------------------------------------
async function renderAmbulancesTab(container) {
  let list = [];
  try {
    const d = await api(`/emergency/ambulances?city=${encodeURIComponent(emergCityFilter)}`);
    list = d.ambulances || [];
  } catch (e) {
    console.error(e);
  }

  container.innerHTML = `
    <div class="heading">
      <div>
        <h2>Ambulance Fleet & Real-Time Telemetry (${list.length})</h2>
        <p class="muted" style="margin:4px 0 0">
          Advanced Life Support (ALS) & Basic Life Support (BLS) units with live GPS location, crew info, and critical onboard resuscitation equipment.
        </p>
      </div>
      <div style="display:flex;gap:8px">
        <select id="ambStatusFilter" onchange="filterAmbulances(this.value)" style="width:auto;padding:6px 12px;font-size:13px">
          <option value="All">All Statuses</option>
          <option value="Available">Available Only</option>
          <option value="Dispatched">Dispatched</option>
          <option value="In Transit">In Transit</option>
        </select>
        <button class="btn" onclick="renderAmbulancesTab($('emergTabContent'))">🔄 Refresh</button>
      </div>
    </div>

    <div class="amb-grid">
      ${list.map(amb => renderAmbulanceCard(amb)).join('')}
    </div>
  `;
}

function renderAmbulanceCard(amb) {
  let statusClass = 'amb-avail';
  if (amb.status === 'Dispatched') statusClass = 'amb-dispatch';
  if (amb.status === 'In Transit' || amb.status === 'Transporting') statusClass = 'amb-busy';

  return `
    <article class="amb-card">
      <div class="amb-card-header">
        <div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:20px">🚑</span>
            <b style="font-size:16px">${amb.id}</b>
          </div>
          <div class="muted" style="font-size:12px;margin-top:2px">${amb.regNumber} • ${amb.type}</div>
        </div>
        <span class="amb-status-pill ${statusClass}">${amb.status}</span>
      </div>

      <div style="font-size:13px;margin-bottom:8px">
        <b>Affiliated Facility:</b> ${amb.hospitalAffiliation} (${amb.city})
      </div>

      <!-- Live Telemetry Strip -->
      <div class="telemetry-row">
        <div>
          <span class="muted" style="font-size:11px;display:block">CURRENT SECTOR</span>
          <b>📍 ${amb.location?.name || 'Sector Active'}</b>
        </div>
        <div style="margin-left:auto;text-align:right">
          <span class="muted" style="font-size:11px;display:block">SPEED & FUEL</span>
          <b>${amb.speedKmH || 0} km/h • ${amb.fuelPercent}% fuel</b>
        </div>
      </div>

      <!-- Crew Info -->
      <div style="font-size:12px;margin:8px 0;line-height:1.4">
        <div><b>Driver:</b> ${amb.driver} (<a href="tel:${amb.phone}" style="color:var(--teal)">${amb.phone}</a>)</div>
        <div><b>Paramedic:</b> ${amb.paramedic}</div>
      </div>

      <!-- Onboard Equipment -->
      <div style="margin:10px 0">
        <span class="muted" style="font-size:11px;font-weight:700;text-transform:uppercase">Onboard Critical Gear:</span>
        <div class="tags" style="margin:4px 0 0">
          ${(amb.equipment || []).map(eq => `<span class="tag" style="background:#f1f5f9;font-size:11px">✓ ${eq}</span>`).join('')}
        </div>
      </div>

      <!-- Actions -->
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:space-between">
        <button class="btn" style="flex:1;font-size:12px" onclick="toggleAmbulanceStatus('${amb.id}', '${amb.status === 'Available' ? 'Dispatched' : 'Available'}')">
          ${amb.status === 'Available' ? 'Dispatch to Standby' : 'Set Available'}
        </button>
        <button class="btn primary" style="font-size:12px" onclick="openDispatchModal('${amb.id}')">
          Fast Dispatch
        </button>
      </div>
    </article>
  `;
}

async function toggleAmbulanceStatus(id, newStatus) {
  try {
    await api(`/emergency/ambulances/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    toast(`Ambulance ${id} status set to ${newStatus}`);
    await refreshEmergencyTelemetry();
    await renderEmergTabContent();
  } catch (e) {
    toast('Error: ' + e.message);
  }
}

function openDispatchModal(id) {
  openModal(`
    <button class="close" onclick="closeModal()">×</button>
    <h2>Dispatch Ambulance ${id}</h2>
    <p class="muted">Deploy this emergency response unit to an incident sector.</p>
    <div class="field">
      <label>Deployment Destination / Landmark *</label>
      <input id="dispAddress" placeholder="e.g. Ring Road Junction / Sector 4" value="Koramangala 80ft Road">
    </div>
    <div class="field">
      <label>Emergency Mission Type</label>
      <select id="dispType">
        <option>Code Red Resuscitation</option>
        <option>Trauma Extrication</option>
        <option>Inter-Hospital Critical Transfer</option>
        <option>Mass Casualty Pre-positioning</option>
      </select>
    </div>
    <div class="field">
      <label>Paramedic Instructions</label>
      <textarea id="dispNotes" placeholder="Specific patient stabilization instructions...">Proceed with active sirens; prepare transport ventilator and 12-lead ECG.</textarea>
    </div>
    <button class="btn danger-action" style="width:100%;margin-top:10px" onclick="confirmDispatch('${id}')">
      CONFIRM DISPATCH EXECUTION
    </button>
  `);
}

async function confirmDispatch(id) {
  try {
    await api(`/emergency/ambulances/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Dispatched',
        location: { name: $('dispAddress').value.trim() },
        speedKmH: 52
      })
    });
    closeModal();
    toast(`🚑 Ambulance ${id} dispatched!`);
    await refreshEmergencyTelemetry();
    await renderEmergTabContent();
  } catch (e) {
    toast('Error: ' + e.message);
  }
}

// -------------------------------------------------------------
// TAB 3: ER LOAD & NEARBY EMERGENCY SERVICES
// -------------------------------------------------------------
async function renderServicesTab(container) {
  let list = [];
  try {
    const d = await api(`/emergency/services?city=${encodeURIComponent(emergCityFilter)}`);
    list = d.services || [];
  } catch (e) {
    console.error(e);
  }

  container.innerHTML = `
    <div class="heading">
      <div>
        <h2>Emergency Rooms, Trauma Bays & Load Management (${list.length})</h2>
        <p class="muted" style="margin:4px 0 0">
          Live capacity monitoring, triage queues, ventilator reserves, and ER diversion protocols across regional hospitals.
        </p>
      </div>
      <button class="btn" onclick="renderServicesTab($('emergTabContent'))">🔄 Refresh</button>
    </div>

    <div class="grid">
      ${list.map(svc => renderServiceCard(svc)).join('')}
    </div>
  `;
}

function renderServiceCard(svc) {
  const occPercent = svc.erCapacity > 0 ? Math.round((svc.erOccupied / svc.erCapacity) * 100) : 0;
  let occColor = '#16a34a';
  if (occPercent > 70) occColor = '#ea580c';
  if (occPercent > 85) occColor = '#dc2626';

  let statusTagClass = 'er-status-normal';
  if (svc.erStatus === 'Elevated') statusTagClass = 'er-status-elevated';
  if (svc.erStatus === 'Surge') statusTagClass = 'er-status-surge';
  if (svc.erStatus === 'Divert') statusTagClass = 'er-status-divert';

  return `
    <article class="card" style="border-top:4px solid ${occColor}">
      <div class="body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <div>
            <h3 style="font-size:18px;margin:0 0 4px">${svc.hospitalName}</h3>
            <div class="muted" style="font-size:12px">📍 ${svc.city} • ${svc.address}</div>
          </div>
          <span class="${statusTagClass}">${svc.erStatus}</span>
        </div>

        <div style="font-size:12px;color:var(--teal2);font-weight:700;margin:6px 0">
          ${svc.serviceType}
        </div>

        <!-- ER Capacity Progress Bar -->
        <div style="margin:14px 0 10px">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700">
            <span>ER Capacity: ${svc.erOccupied} / ${svc.erCapacity} Beds</span>
            <span style="color:${occColor}">${occPercent}% Occupied</span>
          </div>
          <div class="gauge-bar">
            <div class="gauge-fill" style="width:${occPercent}%;background:${occColor}"></div>
          </div>
        </div>

        <!-- Triage Metrics -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;background:#f8fafc;padding:10px;border-radius:8px;margin-bottom:12px;font-size:12px">
          <div>
            <span class="muted" style="display:block">Triage Queue:</span>
            <b>👥 ${svc.triageQueue} Patients waiting</b>
          </div>
          <div>
            <span class="muted" style="display:block">Avg Wait Time:</span>
            <b>⏱️ ${svc.avgWaitMinutes} mins</b>
          </div>
          <div>
            <span class="muted" style="display:block">Ventilators Free:</span>
            <b>🫁 ${svc.ventilatorsAvailable} units</b>
          </div>
          <div>
            <span class="muted" style="display:block">ICU Beds Free:</span>
            <b>🛌 ${svc.icuAvailable} beds</b>
          </div>
        </div>

        <!-- Capabilities tags -->
        <div class="tags" style="margin-bottom:12px">
          ${(svc.capabilities || []).map(c => `<span class="tag" style="font-size:11px">${c}</span>`).join('')}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid #f1f5f9;flex-wrap:wrap;gap:8px">
          <a href="tel:${svc.phone.split('/')[0].trim()}" class="btn" style="font-size:12px;color:var(--teal)">
            📞 ER Hotline: ${svc.phone.split('/')[0].trim()}
          </a>
          <button class="btn amber" style="font-size:12px" onclick="openErStatusModal(${svc.id}, '${svc.hospitalName}', '${svc.erStatus}')">
            Adjust ER Load / Divert
          </button>
        </div>
      </div>
    </article>
  `;
}

function openErStatusModal(id, hospitalName, currentStatus) {
  openModal(`
    <button class="close" onclick="closeModal()">×</button>
    <h2>ER Load Management — ${hospitalName}</h2>
    <p class="muted">Update emergency triage load status and set diversion protocols if beds are at surge capacity.</p>
    <div class="field">
      <label>ER Operation Mode</label>
      <select id="editErStatus">
        <option value="Normal" ${currentStatus === 'Normal' ? 'selected' : ''}>Normal (Ready for incoming ambulances)</option>
        <option value="Elevated" ${currentStatus === 'Elevated' ? 'selected' : ''}>Elevated (High triage volume)</option>
        <option value="Surge" ${currentStatus === 'Surge' ? 'selected' : ''}>Surge (Critical capacity reached)</option>
        <option value="Divert" ${currentStatus === 'Divert' ? 'selected' : ''}>Divert (Reroute non-trauma inbound cases)</option>
      </select>
    </div>
    <div class="formgrid">
      <div class="field">
        <label>Current ER Beds Occupied</label>
        <input id="editErOccupied" type="number" min="0" value="18">
      </div>
      <div class="field">
        <label>Triage Waiting Queue</label>
        <input id="editTriageQueue" type="number" min="0" value="5">
      </div>
    </div>
    <button class="btn primary" style="width:100%;margin-top:12px" onclick="saveErStatus(${id})">
      SAVE STATUS & BROADCAST TO DISPATCH
    </button>
  `);
}

async function saveErStatus(id) {
  try {
    await api(`/emergency/services/${id}/er-load`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        erStatus: $('editErStatus').value,
        erOccupied: Number($('editErOccupied').value),
        triageQueue: Number($('editTriageQueue').value)
      })
    });
    closeModal();
    toast('ER Load status successfully updated and broadcasted.');
    await refreshEmergencyTelemetry();
    await renderEmergTabContent();
  } catch (e) {
    toast('Error: ' + e.message);
  }
}

// -------------------------------------------------------------
// TAB 4: PATIENT TRANSFER COORDINATION
// -------------------------------------------------------------
async function renderTransfersTab(container) {
  let list = [];
  try {
    const d = await api(`/emergency/transfers?city=${encodeURIComponent(emergCityFilter)}`);
    list = d.patientTransfers || [];
  } catch (e) {
    console.error(e);
  }

  container.innerHTML = `
    <div class="heading">
      <div>
        <h2>Inter-Hospital Patient Referral & Transfer Coordination (${list.length})</h2>
        <p class="muted" style="margin:4px 0 0">
          Coordinate authorized patient transfers between facilities for specialized care (Cath Lab, specialized Trauma, PICU, Burn care) with bed reservation.
        </p>
      </div>
      <button class="btn primary" onclick="openNewTransferModal()">+ Initiate Referral Transfer</button>
    </div>

    ${list.length ? list.map(trf => renderTransferCard(trf)).join('') : `
      <div class="empty">
        No active patient referral transfers recorded in this region.<br>
        <button class="btn primary" style="margin-top:12px" onclick="openNewTransferModal()">Initiate New Referral Transfer</button>
      </div>
    `}
  `;
}

function renderTransferCard(trf) {
  return `
    <article class="card" style="padding:18px;margin-bottom:14px;border-left:5px solid #2563eb">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
        <div>
          <div style="display:flex;align-items:center;gap:8px">
            <b style="font-size:17px">${trf.patientName}</b>
            <span class="muted" style="font-size:12px">(${trf.age} yrs • ${trf.gender})</span>
            <span class="badge-status badge-fresh" style="font-size:11px">${trf.status}</span>
          </div>
          <div style="font-size:13px;margin:4px 0;color:#1e293b">
            <b>Route:</b> ${trf.referringHospitalName} ➔ <b>${trf.receivingHospitalName}</b> (${trf.city})
          </div>
        </div>
        <div style="text-align:right">
          <span style="font-size:11px;color:#64748b;display:block">TRANSFER REFERENCE</span>
          <b>${trf.reference}</b>
        </div>
      </div>

      <!-- Clinical assessment note -->
      <div style="background:#f1f5f9;border-radius:8px;padding:12px;margin:12px 0;font-size:13px;line-height:1.45">
        <div><b>Reason for Transfer:</b> ${trf.transferReason}</div>
        <div style="margin-top:6px;color:#334155"><b>Authorized Assessment:</b> ${trf.clinicalAssessment}</div>
        <div style="margin-top:4px;font-size:11px;color:#64748b"><b>Attending Physician:</b> ${trf.authorizedDoctor}</div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:12px">
        <div>
          <span>Reserved Bed: <b>${trf.reservedRoomType}</b></span> • 
          <span>Assigned Transport: <b>${trf.ambulanceAssigned}</b></span>
        </div>
        <div style="display:flex;gap:6px">
          ${trf.status !== 'Arrived & Admitted' ? `
            <button class="btn" style="font-size:12px" onclick="updateTransferStatus('${trf.id}', 'Ambulance En Route')">Dispatch Ambulance</button>
            <button class="btn primary" style="font-size:12px" onclick="updateTransferStatus('${trf.id}', 'Arrived & Admitted')">Mark Admitted at Destination</button>
          ` : `
            <span style="color:#16a34a;font-weight:800">✓ Transfer Completed & Patient Admitted</span>
          `}
        </div>
      </div>
    </article>
  `;
}

async function updateTransferStatus(id, status) {
  try {
    await api(`/emergency/transfers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    toast('Transfer status updated to ' + status);
    await refreshEmergencyTelemetry();
    await renderEmergTabContent();
  } catch (e) {
    toast('Error: ' + e.message);
  }
}

function openNewTransferModal() {
  const cityHospitals = (hospitals || []);
  openModal(`
    <button class="close" onclick="closeModal()">×</button>
    <h2>Initiate Inter-Facility Patient Transfer</h2>
    <p class="muted">Hospital referral workflow based on certified medical assessment and authorized clinical documentation.</p>
    <div class="formgrid">
      <div class="field">
        <label>Patient Full Name *</label>
        <input id="trfPatientName" placeholder="Patient name" value="Rajeshwari Nair">
      </div>
      <div class="formgrid">
        <div class="field">
          <label>Age *</label>
          <input id="trfAge" type="number" min="0" value="48">
        </div>
        <div class="field">
          <label>Gender *</label>
          <select id="trfGender"><option>Female</option><option>Male</option><option>Other</option></select>
        </div>
      </div>
    </div>
    <div class="formgrid">
      <div class="field">
        <label>Origin (Referring Facility) *</label>
        <select id="trfOrigin">
          ${cityHospitals.map(h => `<option value="${h.id}">${h.name} (${h.city})</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label>Destination (Receiving Facility) *</label>
        <select id="trfDestination">
          ${cityHospitals.map((h, i) => `<option value="${h.id}" ${i === 1 ? 'selected' : ''}>${h.name} (${h.city})</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="field">
      <label>Clinical Reason for Transfer *</label>
      <input id="trfReason" placeholder="e.g. Acute STEMI requiring 24/7 Primary Angioplasty / Cath Lab" value="Acute STEMI requiring immediate 24/7 Primary Angioplasty Cath Lab">
    </div>
    <div class="formgrid">
      <div class="field">
        <label>Authorized Referring Physician *</label>
        <input id="trfDoctor" placeholder="Doctor Name & Reg Number" value="Dr. M. S. Venkatesh (Reg #KMC-44812)">
      </div>
      <div class="field">
        <label>Reserved Bed Class</label>
        <select id="trfBedType"><option>ICU</option><option>Cardiac ICU</option><option>Trauma High Dependency Unit</option><option>Private Room</option></select>
      </div>
    </div>
    <div class="field">
      <label>Clinical Assessment & En-Route Stabilization Protocol *</label>
      <textarea id="trfAssessment" placeholder="Authorized clinical notes...">Patient is hemodynamically stable on dual antiplatelet therapy. ALS monitored transfer required with oxygen and defibrillator on standby.</textarea>
    </div>
    <button class="btn primary" style="width:100%;margin-top:10px" onclick="submitNewTransfer()">
      SUBMIT REFERRAL & RESERVE RECEIVING BED
    </button>
  `);
}

async function submitNewTransfer() {
  try {
    const payload = {
      patientName: $('trfPatientName').value.trim(),
      age: Number($('trfAge').value),
      gender: $('trfGender').value,
      referringHospitalId: Number($('trfOrigin').value),
      receivingHospitalId: Number($('trfDestination').value),
      transferReason: $('trfReason').value.trim(),
      authorizedDoctor: $('trfDoctor').value.trim(),
      reservedRoomType: $('trfBedType').value,
      clinicalAssessment: $('trfAssessment').value.trim(),
      city: emergCityFilter === 'All' ? 'Bengaluru' : emergCityFilter
    };

    await api('/emergency/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    closeModal();
    toast('✓ Referral transfer created & bed reserved at receiving hospital!');
    await refreshEmergencyTelemetry();
    await renderEmergTabContent();
  } catch (e) {
    toast('Error: ' + e.message);
  }
}

// -------------------------------------------------------------
// TAB 5: CRITICAL MEDICAL INVENTORY & RE-ALLOCATION
// -------------------------------------------------------------
async function renderSuppliesTab(container) {
  let list = [];
  let transfers = [];
  try {
    const [supRes, trfRes] = await Promise.all([
      api(`/emergency/supplies?city=${encodeURIComponent(emergCityFilter)}`),
      api(`/emergency/supply-transfers?city=${encodeURIComponent(emergCityFilter)}`)
    ]);
    list = supRes.supplies || [];
    transfers = trfRes.supplyTransfers || [];
  } catch (e) {
    console.error(e);
  }

  container.innerHTML = `
    <div class="heading">
      <div>
        <h2>Critical Medical Inventory & Re-allocation (${list.length})</h2>
        <p class="muted" style="margin:4px 0 0">
          Real-time tracking of oxygen, ventilators, antivenom, blood units, and automated inter-hospital supply transfers during shortages.
        </p>
      </div>
      <button class="btn amber" onclick="openSupplyTransferModal()">+ Request Inter-Facility Supply Transfer</button>
    </div>

    <!-- Active Re-allocations in Transit -->
    ${transfers.length ? `
      <div class="card" style="padding:16px;margin-bottom:20px;border-left:5px solid #16a34a">
        <h3 style="margin-top:0;font-size:16px;color:#15803d">🚚 Active Inter-Hospital Supply Dispatches (${transfers.length})</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
          ${transfers.map(st => `
            <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;font-size:12px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <b>${st.item}</b>
                <span class="badge-status badge-fresh">${st.status}</span>
              </div>
              <div class="muted">Qty: <b>${st.quantity} ${st.unit}</b> • Courier: ${st.courierOrAmbulance || 'Rapid Logistics'}</div>
              <div style="margin-top:4px">From: <b>${st.supplyingHospitalName}</b> ➔ To: <b>${st.requestingHospitalName}</b></div>
              ${st.status !== 'Delivered' ? `
                <button class="btn" style="margin-top:8px;padding:4px 8px;font-size:11px" onclick="markSupplyDelivered('${st.id}')">✓ Mark Delivered</button>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Supply Table -->
    <div class="card" style="overflow-x:auto">
      <table class="emerg-table">
        <thead>
          <tr>
            <th>Hospital & Region</th>
            <th>Critical Supply Item</th>
            <th>Category</th>
            <th>Available Stock</th>
            <th>Safety Threshold</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(s => {
            let badgeClass = 'badge-fresh';
            if (s.status === 'Critical Shortage') badgeClass = 'badge-stale';
            if (s.status === 'Surplus') badgeClass = 'badge-aging';

            return `
              <tr>
                <td><b>${s.hospitalName}</b><div class="muted" style="font-size:11px">${s.city}</div></td>
                <td><b>${s.item}</b></td>
                <td><span class="tag">${s.category}</span></td>
                <td><b style="font-size:15px;color:${s.status === 'Critical Shortage' ? '#dc2626' : '#0f172a'}">${s.available}</b> <span class="muted" style="font-size:11px">${s.unit}</span></td>
                <td>${s.minThreshold} ${s.unit}</td>
                <td>
                  <span class="badge-status ${badgeClass}" style="${s.status === 'Critical Shortage' ? 'background:#fee2e2;color:#b91c1c' : ''}">
                    ${s.status}
                  </span>
                </td>
                <td>
                  ${s.status === 'Critical Shortage' ? `
                    <button class="btn amber" style="font-size:11px;padding:5px 9px" onclick="quickReallocate('${s.item}', ${s.hospitalId}, '${s.city}')">
                      ⚡ Request Re-allocation
                    </button>
                  ` : s.status === 'Surplus' ? `
                    <span style="font-size:11px;color:#16a34a;font-weight:700">Surplus Available</span>
                  ` : `
                    <span class="muted" style="font-size:11px">Stock Stable</span>
                  `}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function markSupplyDelivered(id) {
  try {
    await api(`/emergency/supply-transfers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Delivered' })
    });
    toast('✓ Supply shipment delivered and added to recipient hospital stock.');
    await refreshEmergencyTelemetry();
    await renderEmergTabContent();
  } catch (e) {
    toast('Error: ' + e.message);
  }
}

function quickReallocate(item, requestingHospitalId, city) {
  openSupplyTransferModal(item, requestingHospitalId, city);
}

function openSupplyTransferModal(preItem = '', preReqHospitalId = null, city = '') {
  const cityHospitals = (hospitals || []);
  openModal(`
    <button class="close" onclick="closeModal()">×</button>
    <h2>Request Inter-Hospital Supply Transfer</h2>
    <p class="muted">Automate the transfer of essential emergency medicines, blood, or equipment from facilities with surplus stock.</p>
    <div class="field">
      <label>Supply Item in Shortage *</label>
      <input id="strfItem" value="${preItem || 'Polyvalent Snake Antivenom (Lyophilized)'}">
    </div>
    <div class="formgrid">
      <div class="field">
        <label>Receiving Facility (In Shortage) *</label>
        <select id="strfReq">
          ${cityHospitals.map(h => `<option value="${h.id}" ${h.id === preReqHospitalId ? 'selected' : ''}>${h.name} (${h.city})</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label>Supplying Facility (With Surplus) *</label>
        <select id="strfSup">
          ${cityHospitals.map((h, i) => `<option value="${h.id}" ${i === 0 && h.id !== preReqHospitalId ? 'selected' : ''}>${h.name} (${h.city})</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="formgrid">
      <div class="field">
        <label>Quantity to Transfer *</label>
        <input id="strfQty" type="number" min="1" value="5">
      </div>
      <div class="field">
        <label>Urgency Level</label>
        <select id="strfUrgency">
          <option>Immediate Emergency (&lt; 45 mins)</option>
          <option>Critical (Same Day)</option>
          <option>Routine Re-stock</option>
        </select>
      </div>
    </div>
    <div class="field">
      <label>Clinical Justification</label>
      <textarea id="strfReason">Emergency replenishment for incoming trauma admissions; local stock near depletion.</textarea>
    </div>
    <button class="btn amber" style="width:100%;margin-top:10px" onclick="submitSupplyTransfer()">
      AUTHORIZE & DISPATCH SUPPLY COURIER
    </button>
  `);
}

async function submitSupplyTransfer() {
  try {
    const payload = {
      item: $('strfItem').value.trim(),
      requestingHospitalId: Number($('strfReq').value),
      supplyingHospitalId: Number($('strfSup').value),
      quantity: Number($('strfQty').value),
      urgency: $('strfUrgency').value,
      clinicalReason: $('strfReason').value.trim()
    };

    await api('/emergency/supplies/reallocate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    closeModal();
    toast('✓ Supply transfer approved and rapid courier dispatched!');
    await refreshEmergencyTelemetry();
    await renderEmergTabContent();
  } catch (e) {
    toast('Error: ' + e.message);
  }
}

// -------------------------------------------------------------
// TAB 6: AI RESOURCE OPTIMIZER (ADMIN COMMAND CENTER)
// -------------------------------------------------------------
async function renderAiRecommendationsTab(container) {
  let recsData = null;
  try {
    recsData = await api(`/emergency/ai-recommendations?city=${encodeURIComponent(emergCityFilter)}`);
  } catch (e) {
    console.error(e);
  }

  const recs = recsData?.recommendations || [];

  container.innerHTML = `
    <div class="heading">
      <div>
        <h2>🤖 AI-Powered Emergency Resource Optimizer</h2>
        <p class="muted" style="margin:4px 0 0">
          Algorithmic load balancing, predictive diversion protocols, and automated inventory re-allocation recommendations.
        </p>
      </div>
      <button class="btn ai-action" onclick="renderAiRecommendationsTab($('emergTabContent'))">
        ⚡ Re-evaluate Engine
      </button>
    </div>

    <!-- Prominent Disclaimer -->
    <div class="disclaimer-banner notto">
      <div>
        <b>🤖 Clinical Decision Support Governance Disclaimer:</b>
        <div style="font-size:12px;margin-top:4px">
          ${recsData?.medicalDisclaimer || 'AI recommendations assist administrative logistics and resource allocation only. Not intended to diagnose conditions, prescribe treatments, or replace authorized medical assessments.'}
        </div>
      </div>
    </div>

    <!-- Recommendations Feed -->
    ${recs.length ? recs.map(r => `
      <article class="ai-rec-card ${r.priority.toLowerCase()}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
          <div>
            <div style="display:flex;align-items:center;gap:8px">
              <span class="ai-rec-badge">${r.category}</span>
              <span class="badge-status ${r.priority === 'Critical' ? 'badge-stale' : 'badge-aging'}" style="${r.priority === 'Critical' ? 'background:#fee2e2;color:#b91c1c' : ''}">
                ${r.priority} Priority
              </span>
              <span class="muted" style="font-size:12px">📍 ${r.city}</span>
            </div>
            <h3 style="margin:8px 0 4px;font-size:17px;font-family:Georgia,serif">${r.title}</h3>
          </div>
          <span style="font-size:11px;color:#64748b">Engine: v2.4</span>
        </div>

        <p style="margin:6px 0;font-size:13px;color:#475569;line-height:1.45">${r.description}</p>

        <!-- Recommended Action Box -->
        <div class="ai-rec-action-box">
          <b style="color:#1e293b;display:block;margin-bottom:4px">💡 Recommended Action Plan:</b>
          ${r.actionPlan}
          <div style="margin-top:6px;font-size:12px;color:#16a34a"><b>Expected Outcome:</b> ${r.impact}</div>
        </div>

        <!-- One-Click Execution for Auto-Initiate Recommendations -->
        ${r.canAutoInitiate ? `
          <div style="margin-top:10px;display:flex;justify-content:flex-end">
            <button class="btn ai-action" style="font-size:12px" onclick="executeAiReallocation(${r.destinationId}, ${r.sourceId}, '${r.item}', ${r.suggestedQty})">
              ⚡ Execute Recommended Transfer (${r.suggestedQty} ${r.item.split(' ')[0]})
            </button>
          </div>
        ` : ''}
      </article>
    `).join('') : `
      <div class="empty">
        No active anomalies or critical bottlenecks detected. Regional resources are currently in optimal balance.
      </div>
    `}
  `;
}

async function executeAiReallocation(reqHospitalId, supHospitalId, item, qty) {
  try {
    await api('/emergency/supplies/reallocate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item,
        requestingHospitalId: reqHospitalId,
        supplyingHospitalId: supHospitalId,
        quantity: qty,
        urgency: 'Emergency',
        clinicalReason: 'AI Algorithmic Re-allocation: Automated balancing of critical emergency inventory.'
      })
    });
    toast('✓ AI Recommendation executed! Medical supply courier dispatched.');
    await refreshEmergencyTelemetry();
    await renderEmergTabContent();
  } catch (e) {
    toast('Error: ' + e.message);
  }
}
