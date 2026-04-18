// Mock State DCO Env Journey
let state = {
  evidenceReviewed: false,
  consAdequacy: 'Pending', // 'Pending', 'Insufficient', 'Partially Sufficient', 'Sufficient'
  issueStatus: 'Open',     // 'Open', 'In Review', 'Resolved'
  draftDone: false,
  envCleared: false,
  masterCleared: false
};

function initState() {
  let saved = localStorage.getItem('dco_env_journey');
  if(saved) {
      try { state = JSON.parse(saved); } catch(e){}
  }
  updateUI();
}

function saveState() {
  localStorage.setItem('dco_env_journey', JSON.stringify(state));
  updateUI();
}

function resetState() {
  localStorage.removeItem('dco_env_journey');
  state = {
      evidenceReviewed: false,
      consAdequacy: 'Pending',
      issueStatus: 'Open',
      draftDone: false,
      envCleared: false,
      masterCleared: false
  };
  saveState();
  navigateTo('shared_case_work', 'shared');
}

// Navigation Logic
function setCategory(catId) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.screen-nav').forEach(n => n.classList.remove('active'));
  let navId = document.getElementById('nav_' + catId);
  if(navId) navId.classList.add('active');
}

function navigateTo(screenId, forceCat) {
  if (forceCat) {
    document.querySelectorAll('.cat-btn').forEach(b => {
      if (b.getAttribute('onclick').includes(forceCat)) b.click();
    });
  }
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  let sc = document.getElementById(screenId);
  if(sc) sc.classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.nav-btn[data-target='${screenId}']`);
  if (btn) btn.classList.add('active');
  updateUI();
  window.scrollTo(0,0);
}

// Actions
function actionEvidence() {
  state.evidenceReviewed = true;
  saveState();
}

function actionAdequacy(val) {
  state.consAdequacy = val;
  saveState();
}

function actionIssue(val) {
  if (val === 'Resolved') {
      if(state.consAdequacy !== 'Sufficient' || !state.evidenceReviewed) {
          alert('Cannot resolve issue. Consultation adequacy must be Sufficient and Evidence must be reviewed.');
          return;
      }
  }
  state.issueStatus = val;
  saveState();
}

function actionDraft() {
  let val = document.getElementById('ed_text').value;
  if(val.trim() === '') {
      alert("Please enter some text before submitting.");
      return;
  }
  state.draftDone = true;
  saveState();
}

function actionEnvClearance() {
  state.envCleared = true;
  saveState();
  navigateTo('shared_case_work', 'shared');
  alert("Environmental Clearance signed off! Overall Case Unblocked.");
}

// UI Sync
function updateUI() {
  // Check conditions
  let issueReady = (state.issueStatus === 'Resolved');
  let consReady = (state.consAdequacy === 'Sufficient');
  let envReady = (state.evidenceReviewed && consReady && issueReady && state.draftDone);

  // Cross-screen elements
  // Evidence
  let btnEv = document.getElementById('btn_ev_review');
  let lblEv = document.getElementById('lbl_ev_review');
  if(btnEv && lblEv) {
      if(state.evidenceReviewed) {
          btnEv.style.display = 'none';
          lblEv.className = 'tag-green';
          lblEv.innerHTML = '&#10003; Reviewed';
      } else {
          btnEv.style.display = 'inline-flex';
          lblEv.className = 'tag-red';
          lblEv.innerText = 'Awaiting Review';
      }
  }

  // Consultation Tracker
  let adqStat = document.getElementById('ec_adeq_stat');
  if(adqStat) {
      if(state.consAdequacy === 'Sufficient') adqStat.innerHTML = '<span class="tag-green">Sufficient</span>';
      else if(state.consAdequacy === 'Partially Sufficient') adqStat.innerHTML = '<span class="tag-amber">Partially Sufficient</span>';
      else if(state.consAdequacy === 'Insufficient') adqStat.innerHTML = '<span class="tag-red">Insufficient</span>';
      else adqStat.innerHTML = '<span class="tag-red">Pending Assessment</span>';

      ['btn_adq_i', 'btn_adq_p', 'btn_adq_s'].forEach(id => {
          let b = document.getElementById(id);
          if(b) b.style.outline = 'none';
      });
      
      let btnMap = { 'Insufficient':'btn_adq_i', 'Partially Sufficient':'btn_adq_p', 'Sufficient':'btn_adq_s' };
      if(state.consAdequacy !== 'Pending') {
          document.getElementById('ec_resp_stat').innerHTML = '<span class="tag-green">Received & Reviewed</span>';
          let actBtn = document.getElementById(btnMap[state.consAdequacy]);
          if(actBtn) actBtn.style.outline = '2px solid #000';
      } else {
          document.getElementById('ec_resp_stat').innerHTML = '<span class="tag-amber">Received, Not Reviewed</span>';
      }
  }

  // Env Issue Detail
  let eiStat = document.getElementById('ei_status');
  if(eiStat) {
      if(state.issueStatus === 'Resolved') eiStat.innerHTML = '<span class="tag-green">Resolved</span>';
      else if(state.issueStatus === 'In Review') eiStat.innerHTML = '<span class="tag-amber">In Review</span>';
      else eiStat.innerHTML = '<span class="tag-red">Open</span>';

      let evStat = document.getElementById('ei_ev_stat');
      if(state.evidenceReviewed) { evStat.className='tag-green'; evStat.innerHTML='&#10003; Reviewed'; }
      
      let consAdq = document.getElementById('ei_cons_adequacy');
      if(state.consAdequacy === 'Sufficient') { consAdq.className='tag-green'; consAdq.innerHTML='Sufficient'; }
      else if(state.consAdequacy === 'Pending') { consAdq.className='tag-amber'; consAdq.innerHTML='Adequacy Pending'; }
      else { consAdq.className='tag-red'; consAdq.innerHTML=state.consAdequacy; }

      // Can we resolve?
      let btnRes = document.getElementById('btn_ei_res');
      let eiBan = document.getElementById('ei_banner');
      if(state.issueStatus === 'Resolved') {
          btnRes.disabled = true;
          eiBan.className = 'sf-banner success';
          eiBan.innerHTML = '&#10003; Issue Resolved and mitigation confirmed.';
      } else {
          if(state.evidenceReviewed && state.consAdequacy === 'Sufficient') {
              btnRes.disabled = false;
              eiBan.className = 'sf-banner info';
              eiBan.innerHTML = 'Prior requirements met. This issue is ready to be resolved.';
          } else {
              btnRes.disabled = true;
              eiBan.className = 'sf-banner warn';
              eiBan.innerHTML = 'This issue requires consultation adequacy and evidence review before it can be resolved.';
          }
      }
  }

  // Env Review Workspace
  let ewStat = document.getElementById('ew_iss_stat');
  if(ewStat) {
      if(state.issueStatus === 'Resolved') ewStat.innerHTML = '<span class="tag-green">Resolved</span>';
      else if(state.issueStatus === 'In Review') ewStat.innerHTML = '<span class="tag-amber">In Review</span>';
      else ewStat.innerHTML = '<span class="tag-red">Open (Blocking)</span>';

      let ewCons = document.getElementById('ew_iss_cons');
      if(state.consAdequacy === 'Sufficient') ewCons.innerHTML = '<span class="tag-green">Sufficient</span>';
      else if(state.consAdequacy === 'Pending') ewCons.innerHTML = '<span class="tag-amber">Pending</span>';
      else ewCons.innerHTML = `<span class="tag-red">${state.consAdequacy}</span>`;

      document.getElementById('ew_blocking_n').innerHTML = issueReady ? '<span class="tag-green">0</span>' : '<span class="tag-red">1</span>';
      document.getElementById('ew_ready').innerHTML = state.envCleared ? '<span class="tag-green">Cleared</span>' : (envReady ? '<span class="tag-green">Ready for Sign-off</span>' : '<span class="tag-red">Blocked</span>');
      
      let ewBan = document.getElementById('ew_banner');
      if(state.envCleared) {
          ewBan.className = 'sf-banner success'; ewBan.innerHTML = '&#10003; Environmental Workspace Cleared.';
      } else if(envReady) {
          ewBan.className = 'sf-banner success'; ewBan.innerHTML = '&#10003; All environmental inputs complete. Ready for clearance page.';
      } else {
          ewBan.className = 'sf-banner error'; ewBan.innerHTML = '&#9888; Environmental progression is currently blocked by outstanding items.';
      }

      let dstat = document.getElementById('ew_draft_stat');
      if(state.draftDone) { dstat.className='tag-green'; dstat.innerText='Drafting Submitted'; }
      else { dstat.className='tag-red'; dstat.innerText='Submission Required'; }
  }

  // Drafting
  let dBan = document.getElementById('ed_stat_banner');
  if(dBan) {
      if(state.draftDone) {
          dBan.className = 'sf-banner success';
          dBan.innerHTML = '&#10003; Drafting contribution submitted directly to Recommendation Report.';
          document.getElementById('ed_btn').innerText = 'Update Submission';
      } else {
          dBan.className = 'sf-banner error';
          dBan.innerHTML = 'Drafting not yet submitted.';
      }
  }

  // Readiness
  let rEv = document.getElementById('er_chk_ev');
  if(rEv) {
      rEv.innerHTML = state.evidenceReviewed ? '✅ Key evidence (APP-044) reviewed' : '❌ Key evidence (APP-044) reviewed';
      document.getElementById('er_chk_cons').innerHTML = consReady ? '✅ Consultation adequacy achieved' : '❌ Consultation adequacy achieved';
      document.getElementById('er_chk_iss').innerHTML = issueReady ? '✅ Blocking issue ENV-ISS-001 resolved' : '❌ Missing sign-off: ENV-ISS-001 is blocking';
      document.getElementById('er_chk_draft').innerHTML = state.draftDone ? '✅ Report drafting submitted' : '❌ Report drafting not submitted';

      let eqReady = document.getElementById('er_overall');
      let erBtn = document.getElementById('er_btn_clear');
      if(state.envCleared) {
          eqReady.innerHTML = '<span class="tag-green">Cleared</span>';
          erBtn.disabled = true;
          erBtn.innerText = 'Cleared ✓';
      } else {
          if(envReady) {
              eqReady.innerHTML = '<span class="tag-green">Ready to Sign-off</span>';
              erBtn.disabled = false;
              erBtn.innerText = 'Sign-off Env Clearance';
          } else {
              eqReady.innerHTML = '<span class="tag-red">Blocked</span>';
              erBtn.disabled = true;
              erBtn.innerText = 'Requirements Not Met';
          }
      }
  }

  // Master / Shared
  let cwBan = document.getElementById('cw_banner');
  if(cwBan) {
      if(state.envCleared) {
          cwBan.className = 'sf-banner success';
          cwBan.innerHTML = '&#10003; Environmental clearance received. Case ready for final decision publication.';
          document.getElementById('case_env_block_ind').innerHTML = '<span class="tag-green">No</span>';
          document.getElementById('case_env_status').innerHTML = '<span class="tag-green">Cleared</span>';
          document.getElementById('case_overall_rag').innerHTML = '<span class="tag-green">Green</span>';
      } else {
          cwBan.className = 'sf-banner error';
          cwBan.innerHTML = '&#9888; Master Clearance blocked by incomplete Environmental sign-off.';
          document.getElementById('case_env_block_ind').innerHTML = '<span class="tag-red">Yes</span>';
          document.getElementById('case_env_status').innerHTML = '<span class="tag-red">Blocked</span>';
          document.getElementById('case_overall_rag').innerHTML = '<span class="tag-red">Red</span>';
      }
  }
  
  let prBan = document.getElementById('pr_banner');
  if(prBan) {
      let bMc = document.getElementById('btn_master_clear');
      if(state.envCleared) {
          prBan.className = 'sf-banner success';
          prBan.innerHTML = '&#10003; All clearances granted. Validated for minister submission.';
          bMc.disabled = false;
      } else {
          prBan.className = 'sf-banner error';
          prBan.innerHTML = 'Master clearance cannot proceed. Waiting on Environmental.';
          bMc.disabled = true;
      }
  }
}

// Ensure init on DOM content load
document.addEventListener('DOMContentLoaded', initState);
// Note: We use window.onload or DOMContentLoaded to execute updateUI() after the elements are parsed.
