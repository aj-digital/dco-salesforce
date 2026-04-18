// Mock State DCO Cross-Functional Journey
let state = {
  // Env Officer State
  evidenceReviewed: false, consAdequacy: 'Pending', issueStatus: 'In Review', draftDone: false, envCleared: false, masterCleared: false,
  // Env Lead / Executive Oversight State 
  leadFlagged: false, leadReviewed: false, leadNote: '', leadEndorsed: false, portFilter: 'All',
  // Env Support Coordinator State
  taskConsAdminComplete: false, taskDocAdminComplete: false, consDueDate: '2026-05-18', consExtended: false,
  // Planning Case Manager State
  planDraftAck: false, planPackRev: false, planOnTrack: false,
  // Legal State
  legalDocReviewed: false, legalPackRev: false, legalOnTrack: false, legalCleared: false,
  // Decision Support / Submission Coordinator State
  coordPackReviewed: false, coordIssuePrep: false, coordPubReady: false,
  // Admin / Records Closure State
  closurePubChecked: false, closureDocChecked: false, closureArchived: false, caseClosed: false
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
      evidenceReviewed: false, consAdequacy: 'Pending', issueStatus: 'In Review', draftDone: false, envCleared: false, masterCleared: false,
      leadFlagged: false, leadReviewed: false, leadNote: '', leadEndorsed: false, portFilter: 'All',
      taskConsAdminComplete: false, taskDocAdminComplete: false, consDueDate: '2026-05-18', consExtended: false,
      planDraftAck: false, planPackRev: false, planOnTrack: false,
      legalDocReviewed: false, legalPackRev: false, legalOnTrack: false, legalCleared: false,
      coordPackReviewed: false, coordIssuePrep: false, coordPubReady: false,
      closurePubChecked: false, closureDocChecked: false, closureArchived: false, caseClosed: false
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

// Actions -- Shared Mocks
function actionEvidence() { state.evidenceReviewed = true; saveState(); }
function actionAdequacy(val) { state.consAdequacy = val; saveState(); }
function actionIssue(val) { state.issueStatus = val; saveState(); }
function actionDraft() { state.draftDone = true; saveState(); }
function actionEnvClearance() { state.envCleared = true; saveState(); navigateTo('shared_case_work', 'shared'); }
function actionConsAdmin() { state.taskConsAdminComplete = true; saveState(); }
function actionDocAdmin() { state.taskDocAdminComplete = true; saveState(); }

// Actions -- Leadership / Oversight
function actionFilt(filtStr) { state.portFilter = filtStr; saveState(); }
function actionLeadFlag() { state.leadFlagged = true; state.leadReviewed = false; saveState(); }
function actionLeadReview() { state.leadReviewed = true; state.leadFlagged = false; saveState(); }

// Actions -- Planning
function actionPlanDraftAck() { state.planDraftAck = true; saveState(); }
function actionPlanPackRev() { state.planPackRev = true; saveState(); }
function actionPlanTrack() { state.planOnTrack = true; saveState(); }
function actionMasterClear() { state.masterCleared = true; saveState(); navigateTo('shared_case_work', 'shared'); alert("Master Case Cleared for Decision Timeline!"); }

// Actions -- Legal
function actionLegalDoc() { state.legalDocReviewed = true; saveState(); }
function actionLegalPackRev() { state.legalPackRev = true; saveState(); }
function actionLegalTrack() { state.legalOnTrack = true; saveState(); }
function actionLegalClear() { state.legalCleared = true; saveState(); navigateTo('plan_ready', 'plan'); }

// Actions -- Decision Support
function actionCoordPack() { state.coordPackReviewed = true; saveState(); }
function actionCoordPrep() { state.coordIssuePrep = true; saveState(); }
function actionCoordPub() { state.coordPubReady = true; saveState(); navigateTo('shared_case_work', 'shared'); alert("Publication marked as internally ready!"); }

// Actions -- Admin / Archive Support
function actionClosurePub() { state.closurePubChecked = true; saveState(); }
function actionClosureDoc() { state.closureDocChecked = true; saveState(); }
function actionArchPrep() { state.closureArchived = true; saveState(); }
function actionCaseClose() { state.caseClosed = true; saveState(); navigateTo('shared_case_work', 'shared'); alert("Success! The Case is permanently closed and archived."); }


// UI Sync
function updateUI() {
  let issueReady = (state.issueStatus === 'Resolved');
  let consReady = (state.consAdequacy === 'Sufficient');
  let adminReady = (state.taskConsAdminComplete && state.taskDocAdminComplete);
  let envReady = (state.evidenceReviewed && consReady && issueReady && state.draftDone && adminReady);
  
  let packReady = state.planPackRev;
  let masterReady = (state.envCleared && packReady && consReady && state.legalCleared); 
  let finalPubReady = (state.masterCleared && state.coordPackReviewed && state.coordIssuePrep);

  let archiveReady = (state.closurePubChecked && state.closureDocChecked && state.closureArchived);

  // === Leadership Workspace / Filters ===
  let ldTable = document.getElementById('lead_dash_table');
  if(ldTable) {
     let fBtns = ['btn_filt_all', 'btn_filt_risk', 'btn_filt_dead'];
     fBtns.forEach(id => { let b = document.getElementById(id); if(b) b.style.outline = 'none'; });
     
     let actBtn;
     if(state.portFilter === 'All') actBtn = document.getElementById('btn_filt_all');
     else if(state.portFilter === 'Risk') actBtn = document.getElementById('btn_filt_risk');
     else if(state.portFilter === 'Deadline') actBtn = document.getElementById('btn_filt_dead');
     if(actBtn) actBtn.style.outline = '2px solid #000';

     let tblHTML = '';
     
     // Evaluate logical risk state of Master DCO-2026-012
     let isR1 = state.leadFlagged || (!masterReady && !state.caseClosed);
     let isD1 = !state.caseClosed; // Near deadline boolean
     let l1Act = state.leadReviewed ? '<span class="tag-green">Director Mitigated</span>' : (state.leadFlagged ? '<span class="tag-red">Awaiting Escalation Resolution</span>' : '<span class="tag-amber">Pending Check</span>');

     let c2Vis = (state.portFilter === 'All' || state.portFilter === 'Risk' || state.portFilter === 'Deadline');
     let c1Vis = (state.portFilter === 'All') || (state.portFilter === 'Risk' && isR1) || (state.portFilter === 'Deadline' && isD1);

     if(c1Vis) {
        let warnLevelStr = isR1 ? '<span class="tag-amber">Core Module Dependencies Missing</span>' : '<span class="tag-green">On Track / Cleared</span>';
        if(state.leadFlagged) warnLevelStr = '<span class="tag-red">Director Override: Critical Path Disrupted</span>';
        tblHTML += `<tr onclick="navigateTo('shared_case_work', 'shared')" style="cursor:pointer">
                     <td class="link">DCO-2026-012</td><td>South Humber Bank</td><td>${warnLevelStr}</td><td>${l1Act}</td>
                    </tr>`;
     }
     
     if(c2Vis) {
        tblHTML += `<tr><td class="link">DCO-2025-081</td><td>Thames Estuary Wind</td><td><span class="tag-red">Statutory Deadline Missed (Legal Hold)</span></td><td><span class="tag-red">Ministerial Inquiry Ongoing</span></td></tr>`;
     }
     
     ldTable.innerHTML = tblHTML;

     let w = document.getElementById('ld_warn');
     if(w) { w.style.display = (state.portFilter === 'Risk' || state.leadFlagged) ? 'block' : 'none'; }
  }

  // === DCO Case Work (Executive Overlay Panel) ===
  let lpanelStatus = document.getElementById('lbl_lead_status');
  if(lpanelStatus) {
     if(state.leadFlagged) {
        lpanelStatus.className = 'tag-red'; lpanelStatus.innerHTML = 'FLAGGED FOR URGENT ATTENTION';
     } else if (state.leadReviewed) {
        lpanelStatus.className = 'tag-green'; lpanelStatus.innerHTML = '✅ Director Assessment Concluded';
     } else {
        lpanelStatus.className = 'tag-gray'; lpanelStatus.innerHTML = 'No overriding executive notes appended';
     }
  }


  // === Closure & Archive Workspace ===
  let clsCaseState = document.getElementById('cls_case_state');
  if(clsCaseState) {
    let clsBan = document.getElementById('cls_banner');
    if(state.caseClosed) {
      clsCaseState.innerHTML = '<span class="tag-gray" style="background:#5a5a5a;color:#fff">Archived & Closed</span>';
      clsBan.className = 'sf-banner success'; clsBan.innerHTML = '&#10003; The Case is permanently closed and immutable.';
    } else if (archiveReady && state.coordPubReady) {
      clsCaseState.innerHTML = '<span class="tag-green">Ready to Close</span>';
      clsBan.className = 'sf-banner info'; clsBan.innerHTML = 'All records verified. Legal closure can be executed.';
      document.getElementById('btn_case_close').disabled = false;
    } else {
      clsCaseState.innerHTML = '<span class="tag-amber">Active</span>';
      clsBan.className = 'sf-banner warn'; clsBan.innerHTML = 'Final records processing required before case can be formally closed and archived.';
      document.getElementById('btn_case_close').disabled = true;
    }
  }

  // === Master / Shared Case Work Updates ===
  let cwBan = document.getElementById('cw_banner');
  if(cwBan) {
      if(state.caseClosed) {
          cwBan.className = 'sf-banner info'; cwBan.innerHTML = '&#10003; The Case is permanently Closed and Archived. Read-only records state.';
          document.getElementById('case_arch_status').innerHTML = '<span class="tag-gray" style="background:#5a5a5a;color:#fff">Closed & Archived</span>';
          document.getElementById('case_cls_status').innerHTML = '<span class="tag-green">Locked</span>';
          document.getElementById('case_pub_ready').innerHTML = '<span class="tag-green">Issued</span>';
          document.getElementById('case_pub_status').innerHTML = '<span class="tag-green">Issued</span>';
          document.getElementById('case_overall_rag').innerHTML = '<span class="tag-gray" style="background:#5a5a5a;color:#fff">Closed</span>';
          
          document.getElementById('cw_icon').className = 'sf-obj-icon gray'; document.getElementById('cw_icon').style.background = '#5a5a5a';
          document.getElementById('path_cls').className = 'sf-path-node done';
          document.getElementById('path_rec').className = 'sf-path-node done';
          document.getElementById('path_dec').className = 'sf-path-node done';
      } else if(state.coordPubReady) {
          cwBan.className = 'sf-banner success'; cwBan.innerHTML = '&#10003; Case marked fully ready for physical issuance. Cycle complete.';
          document.getElementById('case_arch_status').innerHTML = archiveReady ? '<span class="tag-green">Ready to Close</span>' : '<span class="tag-amber">Pending Admin Verification</span>';
          document.getElementById('case_cls_status').innerHTML = archiveReady ? '<span class="tag-green">Ready</span>' : '<span class="tag-amber">Processing</span>';
          document.getElementById('case_pub_ready').innerHTML = '<span class="tag-green">Ready</span>';
          document.getElementById('case_pub_status').innerHTML = '<span class="tag-green">Ready ✓</span>';
          document.getElementById('case_overall_rag').innerHTML = state.leadFlagged ? '<span class="tag-red">Escalated</span>' : '<span class="tag-green">Green</span>';
          
          document.getElementById('path_rec').className = 'sf-path-node done';
          document.getElementById('path_dec').className = 'sf-path-node done';
          document.getElementById('path_cls').className = 'sf-path-node active';
      } else if(state.masterCleared) {
          cwBan.className = 'sf-banner success'; cwBan.innerHTML = '&#10003; Case logic complete. Master Decision Published. Awaiting Coordinator physical issuance.';
          document.getElementById('case_overall_rag').innerHTML = state.leadFlagged ? '<span class="tag-red">Escalated</span>' : '<span class="tag-green">Green</span>';
          document.getElementById('path_rec').className = 'sf-path-node done';
          document.getElementById('path_dec').className = 'sf-path-node active';
      } else if(masterReady) {
          cwBan.className = 'sf-banner info'; cwBan.innerHTML = 'Ready for Master Clearance.';
          document.getElementById('case_overall_rag').innerHTML = state.leadFlagged ? '<span class="tag-red">Escalated</span>' : '<span class="tag-green">Green</span>';
      } else {
          cwBan.className = 'sf-banner warn'; cwBan.innerHTML = '&#9888; Master Clearance requires final cross-departmental sign-offs.';
          document.getElementById('case_overall_rag').innerHTML = state.leadFlagged ? '<span class="tag-red">Escalated (Amber Base)</span>' : '<span class="tag-amber">Amber</span>';
      }
  }

}

document.addEventListener('DOMContentLoaded', initState);
