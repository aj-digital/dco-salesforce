// Mock State DCO Cross-Functional Journey
let state = {
  // Env Officer State
  evidenceReviewed: false,
  consAdequacy: 'Pending', 
  issueStatus: 'In Review',
  draftDone: false,
  envCleared: false,
  masterCleared: false,
  // Env Lead State 
  leadFlagged: false,
  leadReviewed: false,
  leadNote: '',
  leadEndorsed: false,
  // Env Support Coordinator State
  taskConsAdminComplete: false,
  taskDocAdminComplete: false,
  consDueDate: '2026-05-18',
  consExtended: false,
  // Planning Case Manager State
  planDraftAck: false,
  planPackRev: false,
  planOnTrack: false
};

function initState() {
  let saved = localStorage.getItem('dco_cross_journey');
  if(saved) {
      try { state = JSON.parse(saved); } catch(e){}
  }
  updateUI();
}

function saveState() {
  localStorage.setItem('dco_cross_journey', JSON.stringify(state));
  updateUI();
}

function resetState() {
  localStorage.removeItem('dco_cross_journey');
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
      consExtended: false,
      planDraftAck: false,
      planPackRev: false,
      planOnTrack: false
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

// Actions -- Env Officer
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

// Actions -- Env Lead
function actionLeadFlag() { state.leadFlagged = true; state.leadReviewed = false; saveState(); }
function actionLeadReview() { state.leadReviewed = true; state.leadFlagged = false; saveState(); }

// Actions -- Env Coordinator
function actionConsUpdate() {
  let dVal = document.getElementById('cons_due_in').value;
  if(dVal) state.consDueDate = dVal;
  state.consExtended = document.getElementById('cons_ext_in').checked;
  saveState();
}
function actionConsAdmin() { state.taskConsAdminComplete = true; saveState(); }
function actionDocAdmin() { state.taskDocAdminComplete = true; saveState(); }

// Actions -- Planning Case Manager
function actionPlanDraftAck() { state.planDraftAck = true; saveState(); }
function actionPlanPackRev() { state.planPackRev = true; saveState(); }
function actionPlanTrack() { state.planOnTrack = true; saveState(); }
function actionMasterClear() { state.masterCleared = true; saveState(); navigateTo('shared_case_work', 'shared'); alert("Master Case Cleared for Decision Timeline!"); }

// UI Sync
function updateUI() {
  let issueReady = (state.issueStatus === 'Resolved');
  let consReady = (state.consAdequacy === 'Sufficient');
  let adminReady = (state.taskConsAdminComplete && state.taskDocAdminComplete);
  let envReady = (state.evidenceReviewed && consReady && issueReady && state.draftDone && adminReady);
  
  let packReady = state.planPackRev;
  let trackReady = state.planOnTrack;
  let masterReady = (state.envCleared && packReady && consReady); // Simplified rules

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

  // Planning / Orchestra Workspace Updates
  let pwDraftAck = document.getElementById('pw_draft_ack');
  if(pwDraftAck) {
     if(state.planDraftAck) {
         pwDraftAck.innerHTML = '<span class="tag-green">Yes</span>';
         document.getElementById('pw_btn_ack').style.display = 'none';
     } else {
         pwDraftAck.innerHTML = '<span class="tag-amber">No</span>';
         document.getElementById('pw_btn_ack').style.display = 'inline-block';
     }
     
     let pwEnvStat = document.getElementById('pw_env_stat');
     if(state.envCleared) pwEnvStat.innerHTML = '<span class="tag-green">Cleared</span>';
     else if(envReady) pwEnvStat.innerHTML = '<span class="tag-amber">Env Validation Ready</span>';
     else pwEnvStat.innerHTML = '<span class="tag-red">In Review / Blocked</span>';
     
     let pwConsStat = document.getElementById('pw_cons_stat');
     if(state.consAdequacy === 'Sufficient') pwConsStat.innerHTML = '<span class="tag-green">Complete</span>';
     else pwConsStat.innerHTML = '<span class="tag-amber">Pending Admin/Assessment</span>';
  }

  // Submission Pack Coordination Updates
  let ppEnvDraft = document.getElementById('pp_env_draft');
  if(ppEnvDraft) {
     if(state.draftDone) ppEnvDraft.innerHTML = '<span class="tag-green">Submitted</span>';
     else ppEnvDraft.innerHTML = '<span class="tag-red">Awaiting Draft</span>';
     
     let ppStat = document.getElementById('pp_stat');
     let ppBan = document.getElementById('pp_banner');
     let btnPpRev = document.getElementById('btn_pp_rev');
     if(state.planPackRev) {
         ppStat.innerHTML = '<span class="tag-green">Compiled & Validated</span>';
         ppBan.className = 'sf-banner success'; ppBan.innerHTML = '&#10003; Submission Pack components have been structurally validated.';
         btnPpRev.style.display = 'none';
     } else if (state.draftDone) {
         ppStat.innerHTML = '<span class="tag-amber">Ready for Review</span>';
         ppBan.className = 'sf-banner info'; ppBan.innerHTML = 'All components submitted. Awaiting Planning verification.';
         btnPpRev.style.display = 'inline-block';
     } else {
         ppStat.innerHTML = '<span class="tag-amber">Drafting / Compiling</span>';
         ppBan.className = 'sf-banner warn'; ppBan.innerHTML = 'Review draft contributions from cross-functional teams prior to pack compilation.';
         btnPpRev.style.display = 'none';
     }
  }

  // Master Clearance Updates
  let prSumm = document.getElementById('pr_summ');
  if(prSumm) {
     if(state.masterCleared) {
         prSumm.innerHTML = '<span class="tag-green">Master Case Cleared</span>';
         document.getElementById('pr_banner').className = 'sf-banner success';
         document.getElementById('pr_banner').innerHTML = '&#10003; Final Case Decision Released.';
         document.getElementById('btn_master_clear').style.display = 'none';
         document.getElementById('btn_pr_track').style.display = 'none';
     } else {
         let mmban = document.getElementById('pr_banner');
         if(masterReady) {
             prSumm.innerHTML = '<span class="tag-green">Ready To Publish</span>';
             mmban.className = 'sf-banner info'; mmban.innerHTML = 'Core dependencies cleared. Awaiting Orchestrator Final Sign-off.';
             document.getElementById('btn_master_clear').disabled = false;
         } else {
             prSumm.innerHTML = state.planOnTrack ? '<span class="tag-amber">On Track</span>' : '<span class="tag-amber">Trending Positive</span>';
             mmban.className = 'sf-banner error'; mmban.innerHTML = 'Master clearance cannot proceed. Core dependencies are incomplete.';
             document.getElementById('btn_master_clear').disabled = true;
         }
         if(state.planOnTrack) {
             let tkBtn = document.getElementById('btn_pr_track');
             tkBtn.innerText = '✅ Endorsed On Track';
             tkBtn.style.color = '#2e844a'; tkBtn.style.borderColor = '#2e844a';
         }
     }
     
     document.getElementById('pr_chk_cons').innerHTML = consReady ? '✅ Active Consultations tracking Sufficient' : '❌ Active Consultations tracking Sufficient';
     document.getElementById('pr_chk_env').innerHTML = state.envCleared ? '✅ Environmental Workspace Sign-off Received' : '❌ Environmental Workspace Sign-off Received';
     document.getElementById('pr_chk_pack').innerHTML = state.planPackRev ? '✅ Submission Pack Reviewed & Compiled' : '❌ Submission Pack Reviewed & Compiled';
  }

  // Master / Shared Case Work Updates
  let cwBan = document.getElementById('cw_banner');
  if(cwBan) {
      if(state.masterCleared) {
          cwBan.className = 'sf-banner success'; cwBan.innerHTML = '&#10003; Case complete. Master Decision Published.';
          document.getElementById('case_env_block_ind').innerHTML = '<span class="tag-green">No</span>';
          document.getElementById('case_plan_track_ind').innerHTML = '<span class="tag-green">Published</span>';
          document.getElementById('case_overall_rag').innerHTML = '<span class="tag-green">Green</span>';
          document.getElementById('case_plan_status').innerHTML = '<span class="tag-green">Cleared</span>';
      } else if(masterReady) {
          cwBan.className = 'sf-banner info'; cwBan.innerHTML = 'Ready for Master Clearance.';
          document.getElementById('case_env_block_ind').innerHTML = '<span class="tag-green">No</span>';
          document.getElementById('case_plan_track_ind').innerHTML = state.planOnTrack ? '<span class="tag-green">Confirmed On Track</span>' : '<span class="tag-amber">Pending Check</span>';
          document.getElementById('case_overall_rag').innerHTML = '<span class="tag-green">Green</span>';
          document.getElementById('case_plan_status').innerHTML = '<span class="tag-green">Awaiting Clearance</span>';
      } else {
          if(state.leadFlagged) {
            cwBan.className = 'sf-banner error'; cwBan.innerHTML = '&#9888; Master Clearance requires final Environmental sign-off. (🚩 Flagged by Lead)';
            document.getElementById('case_env_block_ind').innerHTML = '<span class="tag-red">Yes</span>';
            document.getElementById('case_overall_rag').innerHTML = '<span class="tag-red">Red</span>';
          } else {
            cwBan.className = 'sf-banner warn'; cwBan.innerHTML = '&#9888; Master Clearance requires final Environmental sign-off.';
            document.getElementById('case_env_block_ind').innerHTML = '<span class="tag-amber">Trending</span>';
            document.getElementById('case_overall_rag').innerHTML = '<span class="tag-amber">Amber</span>';
          }
          document.getElementById('case_plan_track_ind').innerHTML = state.planOnTrack ? '<span class="tag-green">Confirmed On Track</span>' : '<span class="tag-amber">Pending Check</span>';
          document.getElementById('case_plan_status').innerHTML = '<span class="tag-amber">In Progress</span>';
      }
      
      let tAdm = document.getElementById('case_admin_tasks');
      if(adminReady) tAdm.innerHTML = '<span class="tag-green">Complete</span>';
      else tAdm.innerHTML = `<span class="tag-amber">${adminTaskCount} Open</span>`;
  }
}

document.addEventListener('DOMContentLoaded', initState);
