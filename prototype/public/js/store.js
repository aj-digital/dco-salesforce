// Mock State DCO Env Manager, Lead & Support Coordinator Journey
let state = {
  // Officer State
  evidenceReviewed: false,
  consAdequacy: 'Pending', // 'Pending', 'Sufficient'
  issueStatus: 'In Review',// 'Open', 'In Review', 'Resolved'
  draftDone: false,
  envCleared: false,
  masterCleared: false,
  // Lead State overrides
  leadFlagged: false,
  leadReviewed: false,
  leadNote: '',
  leadEndorsed: false,
  // Support Coordinator State
  taskConsAdminComplete: false,
  taskDocAdminComplete: false,
  consDueDate: '2026-05-18',
  consExtended: false
};

function initState() {
  let saved = localStorage.getItem('dco_env_journey_coord');
  if(saved) {
      try { state = JSON.parse(saved); } catch(e){}
  }
  updateUI();
}

function saveState() {
  localStorage.setItem('dco_env_journey_coord', JSON.stringify(state));
  updateUI();
}

function resetState() {
  localStorage.removeItem('dco_env_journey_coord');
  state = {
      evidenceReviewed: false,
      consAdequacy: 'Pending',
      issueStatus: 'In Review',
      draftDone: false,
      envCleared: false,
      masterCleared: false,
      leadFlagged: false,
      leadReviewed: false,
      leadNote: '',
      leadEndorsed: false,
      taskConsAdminComplete: false,
      taskDocAdminComplete: false,
      consDueDate: '2026-05-18',
      consExtended: false
  };
  saveState();
  navigateTo('shared_case_work', 'shared');
}

// Navigation Logic
function setCategory(catId) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  let act = event ? document.querySelector(`.cat-btn[onclick*="${catId}"]`) : null;
  if(act) act.classList.add('active');
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

// Actions -- Officer
function actionEvidence() { state.evidenceReviewed = true; saveState(); }
function actionAdequacy(val) { state.consAdequacy = val; saveState(); }
function actionIssue(val) {
  if (val === 'Resolved') {
      if(state.consAdequacy !== 'Sufficient' || !state.evidenceReviewed || !state.taskConsAdminComplete || !state.taskDocAdminComplete) {
          alert('Cannot resolve issue. Admin tasks must be completed, Consultation adequacy must be Sufficient and Evidence must be reviewed.');
          return;
      }
  }
  state.issueStatus = val;
  saveState();
}
function actionDraft() {
  let val = document.getElementById('ed_text').value;
  if(val.trim() === '') { alert("Please enter some text before submitting."); return; }
  state.draftDone = true; saveState();
}
function actionEnvClearance() {
  state.envCleared = true; saveState(); navigateTo('shared_case_work', 'shared');
  alert("Environmental Clearance signed off! Overall Case Unblocked.");
}

// Actions -- Lead
function actionLeadFlag() { state.leadFlagged = true; state.leadReviewed = false; saveState(); }
function actionLeadReview() { state.leadReviewed = true; state.leadFlagged = false; saveState(); }

// Actions -- Coordinator
function actionConsUpdate() {
  let dVal = document.getElementById('cons_due_in').value;
  if(dVal) state.consDueDate = dVal;
  state.consExtended = document.getElementById('cons_ext_in').checked;
  saveState();
}
function actionConsAdmin() { state.taskConsAdminComplete = true; saveState(); }
function actionDocAdmin() { state.taskDocAdminComplete = true; saveState(); }

// UI Sync
function updateUI() {
  let issueReady = (state.issueStatus === 'Resolved');
  let consReady = (state.consAdequacy === 'Sufficient');
  let adminReady = (state.taskConsAdminComplete && state.taskDocAdminComplete);
  let envReady = (state.evidenceReviewed && consReady && issueReady && state.draftDone && adminReady);

  let adminTaskCount = (state.taskConsAdminComplete ? 0 : 1) + (state.taskDocAdminComplete ? 0 : 1);

  // Cross-screen elements
  // Evidence
  let btnEv = document.getElementById('btn_ev_review');
  let lblEv = document.getElementById('lbl_ev_review');
  if(btnEv && lblEv) {
      if(state.evidenceReviewed) { btnEv.style.display = 'none'; lblEv.className = 'tag-green'; lblEv.innerHTML = '&#10003; Reviewed'; }
      else { btnEv.style.display = 'inline-flex'; lblEv.className = 'tag-red'; lblEv.innerText = 'Awaiting Review'; }
  }
  
  let btnDocAdm = document.getElementById('btn_doc_admin');
  let lblDocAdm = document.getElementById('lbl_doc_admin');
  if(btnDocAdm && lblDocAdm) {
      if(state.taskDocAdminComplete) {
          btnDocAdm.style.display = 'none'; lblDocAdm.className = 'tag-green'; lblDocAdm.innerHTML = '&#10003; Metadata Complete';
      } else {
          btnDocAdm.style.display = 'inline-flex'; lblDocAdm.className = 'tag-red'; lblDocAdm.innerText = 'Metadata Incomplete';
      }
  }

  // Consultation Tracker
  let adqStat = document.getElementById('ec_adeq_stat');
  if(adqStat) {
      if(state.consAdequacy === 'Sufficient') adqStat.innerHTML = '<span class="tag-green">Sufficient</span>';
      else adqStat.innerHTML = '<span class="tag-red">Pending Assessment</span>';

      let actBtn = document.getElementById('btn_adq_s');
      if(actBtn) { actBtn.style.outline = (state.consAdequacy === 'Sufficient') ? '2px solid #000' : 'none'; }
      
      document.getElementById('ec_resp_stat').innerHTML = (state.consAdequacy !== 'Pending') ? '<span class="tag-green">Received & Reviewed</span>' : '<span class="tag-amber">Received, Not Reviewed</span>';
      
      let dueStr = new Date(state.consDueDate).toLocaleDateString('en-GB') || '18 May 2026';
      document.getElementById('ec_due_val').innerText = dueStr;
      document.getElementById('ec_ext_val').innerHTML = state.consExtended ? '<span class="tag-amber">Yes</span>' : 'No';
      
      document.getElementById('cons_due_in').value = state.consDueDate;
      document.getElementById('cons_ext_in').checked = state.consExtended;
      
      let btnConsAdm = document.getElementById('btn_cons_admin');
      let lblConsAdm = document.getElementById('ec_admin_lbl');
      if(state.taskConsAdminComplete) {
          if(btnConsAdm) btnConsAdm.style.display = 'none';
          lblConsAdm.innerHTML = '<span class="tag-green">Complete</span>';
      } else {
          if(btnConsAdm) btnConsAdm.style.display = 'inline-flex';
          lblConsAdm.innerHTML = '<span class="tag-red">Incomplete Metadata</span>';
      }
  }

  // Env Issue Detail
  let eiStat = document.getElementById('ei_status');
  if(eiStat) {
      if(state.issueStatus === 'Resolved') eiStat.innerHTML = '<span class="tag-green">Resolved</span>';
      else if(state.issueStatus === 'In Review') eiStat.innerHTML = '<span class="tag-amber">In Review</span>';
      else eiStat.innerHTML = '<span class="tag-red">Open</span>';

      document.getElementById('ei_ev_stat').className = state.evidenceReviewed ? 'tag-green' : 'tag-red';
      document.getElementById('ei_ev_stat').innerHTML = state.evidenceReviewed ? '&#10003; Reviewed' : 'Unreviewed';
      
      let consAdq = document.getElementById('ei_cons_adequacy');
      if(state.consAdequacy === 'Sufficient') { consAdq.className='tag-green'; consAdq.innerHTML='Sufficient'; }
      else { consAdq.className='tag-amber'; consAdq.innerHTML='Adequacy Pending'; }

      let btnRes = document.getElementById('btn_ei_res');
      let eiBan = document.getElementById('ei_banner');
      if(state.issueStatus === 'Resolved') {
          btnRes.disabled = true; eiBan.className = 'sf-banner success'; eiBan.innerHTML = '&#10003; Issue Resolved and mitigation confirmed.';
      } else {
          if(state.evidenceReviewed && state.consAdequacy === 'Sufficient' && adminReady) {
              btnRes.disabled = false; eiBan.className = 'sf-banner info'; eiBan.innerHTML = 'Prior requirements met. This issue is ready to be resolved.';
          } else {
              btnRes.disabled = true; eiBan.className = 'sf-banner warn'; eiBan.innerHTML = 'This issue requires admin checks, consultation adequacy, and evidence review before it can be resolved.';
          }
      }
  }

  // Env Review Workspace
  let ewStat = document.getElementById('ew_iss_stat');
  if(ewStat) {
      if(state.issueStatus === 'Resolved') ewStat.innerHTML = '<span class="tag-green">Resolved</span>';
      else ewStat.innerHTML = '<span class="tag-amber">In Review</span>';

      document.getElementById('ew_admin_ready').innerHTML = adminReady ? '<span class="tag-green">Current & Verified</span>' : `<span class="tag-red">${adminTaskCount} Incomplete Tasks</span>`;
      document.getElementById('ew_blocking_n').innerHTML = issueReady ? '<span class="tag-green">0</span>' : '<span class="tag-amber" style="background:transparent;padding:0;color:#ba6400">1 (Manageable)</span>';
      document.getElementById('ew_ready').innerHTML = state.envCleared ? '<span class="tag-green">Cleared</span>' : (envReady ? '<span class="tag-green">Ready for Sign-off</span>' : '<span class="tag-amber">Trending Positive</span>');
      
      let ewBan = document.getElementById('ew_banner');
      if(state.envCleared) {
          ewBan.className = 'sf-banner success'; ewBan.innerHTML = '&#10003; Environmental Workspace Cleared.';
      } else if(envReady) {
          ewBan.className = 'sf-banner success'; ewBan.innerHTML = '&#10003; All environmental inputs complete. Ready for clearance page.';
      } else {
          ewBan.className = 'sf-banner warn'; ewBan.innerHTML = '&#9888; Action required: Admin items and issue resolution required for clearance.';
      }

      let dstat = document.getElementById('ew_draft_stat');
      if(state.draftDone) { dstat.className='tag-green'; dstat.innerText='Drafting Submitted'; }
      else { dstat.className='tag-amber'; dstat.innerText='Awaiting Draft'; }
  }

  // Drafting
  let dBan = document.getElementById('ed_stat_banner');
  if(dBan) {
      if(state.draftDone) {
          dBan.className = 'sf-banner success'; dBan.innerHTML = '&#10003; Drafting contribution submitted directly to Recommendation Report.';
          document.getElementById('ed_btn').innerText = 'Update Submission';
      } else {
          dBan.className = 'sf-banner error'; dBan.innerHTML = 'Drafting not yet submitted.';
      }
  }

  // Tasks & Actions Panel
  let tskCons = document.getElementById('tsk_cons_wrap');
  let tskDoc = document.getElementById('tsk_doc_wrap');
  let tskAll = document.getElementById('tsk_all_done');
  if(tskCons) {
      if(state.taskConsAdminComplete) tskCons.style.display = 'none'; else tskCons.style.display = 'flex';
      if(state.taskDocAdminComplete) tskDoc.style.display = 'none'; else tskDoc.style.display = 'flex';
      if(adminReady) tskAll.style.display = 'block'; else tskAll.style.display = 'none';
  }

  // Readiness
  let rEv = document.getElementById('er_chk_ev');
  if(rEv) {
      rEv.innerHTML = state.evidenceReviewed ? '✅ Key evidence (APP-044) reviewed' : '❌ Key evidence (APP-044) reviewed';
      document.getElementById('er_chk_cons').innerHTML = consReady ? '✅ Consultation adequacy achieved' : '❌ Consultation adequacy achieved';
      document.getElementById('er_chk_iss').innerHTML = issueReady ? '✅ Blocking issue ENV-ISS-001 resolved' : '❌ Missing sign-off: ENV-ISS-001 is blocking';
      document.getElementById('er_chk_draft').innerHTML = state.draftDone ? '✅ Report drafting submitted' : '❌ Report drafting not submitted';
      
      document.getElementById('er_chk_adm_cons').innerHTML = state.taskConsAdminComplete ? '✅ Consultation metadata validation complete' : '❌ Consultation metadata validation complete';
      document.getElementById('er_chk_adm_doc').innerHTML = state.taskDocAdminComplete ? '✅ Evidence & document metadata verified' : '❌ Evidence & document metadata verified';

      let eqReady = document.getElementById('er_overall');
      let erBtn = document.getElementById('er_btn_clear');
      if(state.envCleared) {
          eqReady.innerHTML = '<span class="tag-green">Cleared</span>'; erBtn.disabled = true; erBtn.innerText = 'Cleared ✓';
      } else {
          if(envReady) { eqReady.innerHTML = '<span class="tag-green">Ready to Sign-off</span>'; erBtn.disabled = false; erBtn.innerText = 'Sign-off Env Clearance'; }
          else { eqReady.innerHTML = '<span class="tag-amber">Trending Positive</span>'; erBtn.disabled = true; erBtn.innerText = 'Requirements Not Met'; }
      }
  }

  // Master / Shared Case Work
  let cwBan = document.getElementById('cw_banner');
  if(cwBan) {
      let tAdm = document.getElementById('case_admin_tasks');
      if(adminReady) tAdm.innerHTML = '<span class="tag-green">Complete</span>';
      else tAdm.innerHTML = `<span class="tag-amber">${adminTaskCount} Open</span>`;

      if(state.envCleared) {
          cwBan.className = 'sf-banner success'; cwBan.innerHTML = '&#10003; Environmental clearance received. Case ready for final decision publication.';
          document.getElementById('case_env_block_ind').innerHTML = '<span class="tag-green">No</span>';
          document.getElementById('case_env_status').innerHTML = '<span class="tag-green">Cleared</span>';
          document.getElementById('case_overall_rag').innerHTML = '<span class="tag-green">Green</span>';
      } else {
          if(state.leadFlagged) {
            cwBan.className = 'sf-banner error'; cwBan.innerHTML = '&#9888; Master Clearance requires final Environmental sign-off. (🚩 Flagged by Lead)';
            document.getElementById('case_env_block_ind').innerHTML = '<span class="tag-red">Yes</span>';
            document.getElementById('case_env_status').innerHTML = '<span class="tag-red">Flagged</span>';
            document.getElementById('case_overall_rag').innerHTML = '<span class="tag-red">Red</span>';
          } else {
            cwBan.className = 'sf-banner warn'; cwBan.innerHTML = '&#9888; Master Clearance requires final Environmental sign-off.';
            document.getElementById('case_env_block_ind').innerHTML = '<span class="tag-amber">Trending</span>';
            document.getElementById('case_env_status').innerHTML = '<span class="tag-amber">Trending Positive</span>';
            document.getElementById('case_overall_rag').innerHTML = '<span class="tag-amber">Amber</span>';
          }
      }
      
      // Update quick tasks list
      let ttl = '';
      if(!state.taskConsAdminComplete) ttl += `<tr onclick="navigateTo('env_cons', 'env')" style="cursor:pointer;background:#fff8ed"><td class="link">Process NE Consultation Admin Data</td><td>Action Coordinator</td></tr>`;
      if(!state.taskDocAdminComplete) ttl += `<tr onclick="navigateTo('shared_docs', 'shared')" style="cursor:pointer;background:#fff8ed"><td class="link">Verify APP-044 Document Metadata</td><td>Action Coordinator</td></tr>`;
      if(adminReady) ttl = `<tr><td style="color:#2e844a;font-weight:600">&#10003; All current coordination tasks complete</td><td></td></tr>`;
      document.getElementById('cw_task_table').innerHTML = `<tbody>${ttl}</tbody>`;
  }
}

document.addEventListener('DOMContentLoaded', initState);
