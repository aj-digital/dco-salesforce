// Mock State DCO Cross-Functional Journey
let state = {
  // Env Officer State
  evidenceReviewed: false, consAdequacy: 'Pending', issueStatus: 'In Review', draftDone: false, envCleared: false, masterCleared: false,
  // Env Lead State 
  leadFlagged: false, leadReviewed: false, leadNote: '', leadEndorsed: false,
  // Env Support Coordinator State
  taskConsAdminComplete: false, taskDocAdminComplete: false, consDueDate: '2026-05-18', consExtended: false,
  // Planning Case Manager State
  planDraftAck: false, planPackRev: false, planOnTrack: false,
  // Legal State
  legalDocReviewed: false, legalPackRev: false, legalOnTrack: false, legalCleared: false,
  // Decision Support / Submission Coordinator State
  coordPackReviewed: false, coordIssuePrep: false, coordPubReady: false
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
      leadFlagged: false, leadReviewed: false, leadNote: '', leadEndorsed: false,
      taskConsAdminComplete: false, taskDocAdminComplete: false, consDueDate: '2026-05-18', consExtended: false,
      planDraftAck: false, planPackRev: false, planOnTrack: false,
      legalDocReviewed: false, legalPackRev: false, legalOnTrack: false, legalCleared: false,
      coordPackReviewed: false, coordIssuePrep: false, coordPubReady: false
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
  state.issueStatus = val; saveState();
}
function actionDraft() { state.draftDone = true; saveState(); }
function actionEnvClearance() { state.envCleared = true; saveState(); navigateTo('shared_case_work', 'shared'); }

// Actions -- Env Lead
function actionLeadFlag() { state.leadFlagged = true; state.leadReviewed = false; saveState(); }
function actionLeadReview() { state.leadReviewed = true; state.leadFlagged = false; saveState(); }

// Actions -- Env Coordinator
function actionConsUpdate() {
  let dVal = document.getElementById('cons_due_in').value; if(dVal) state.consDueDate = dVal;
  state.consExtended = document.getElementById('cons_ext_in').checked; saveState();
}
function actionConsAdmin() { state.taskConsAdminComplete = true; saveState(); }
function actionDocAdmin() { state.taskDocAdminComplete = true; saveState(); }

// Actions -- Planning Case Manager
function actionPlanDraftAck() { state.planDraftAck = true; saveState(); }
function actionPlanPackRev() { state.planPackRev = true; saveState(); }
function actionPlanTrack() { state.planOnTrack = true; saveState(); }
function actionMasterClear() { state.masterCleared = true; saveState(); navigateTo('shared_case_work', 'shared'); alert("Master Case Cleared for Decision Timeline!"); }

// Actions -- Legal Reviewer
function actionLegalDoc() { state.legalDocReviewed = true; saveState(); }
function actionLegalPackRev() { state.legalPackRev = true; saveState(); }
function actionLegalTrack() { state.legalOnTrack = true; saveState(); }
function actionLegalClear() { 
  if(!state.legalPackRev || !state.legalDocReviewed) { alert("Legal cannot grant clearance until the Draft Order is reviewed and the Pack is certified."); return; }
  state.legalCleared = true; saveState(); navigateTo('plan_ready', 'plan');
}

// Actions -- Decision Support / Submission Coordinator
function actionCoordPack() { state.coordPackReviewed = true; saveState(); }
function actionCoordPrep() { state.coordIssuePrep = true; saveState(); }
function actionCoordPub() { state.coordPubReady = true; saveState(); navigateTo('shared_case_work', 'shared'); alert("Publication marked as internally ready!"); }


// UI Sync
function updateUI() {
  let issueReady = (state.issueStatus === 'Resolved');
  let consReady = (state.consAdequacy === 'Sufficient');
  let adminReady = (state.taskConsAdminComplete && state.taskDocAdminComplete);
  let envReady = (state.evidenceReviewed && consReady && issueReady && state.draftDone && adminReady);
  
  let packReady = state.planPackRev;
  let masterReady = (state.envCleared && packReady && consReady && state.legalCleared); 
  let finalPubReady = (state.masterCleared && state.coordPackReviewed && state.coordIssuePrep);

  let adminTaskCount = (state.taskConsAdminComplete ? 0 : 1) + (state.taskDocAdminComplete ? 0 : 1);

  // === Submission Pack Coordination (Planning/Legal Multi-View) ===
  let ppEnvDraft = document.getElementById('pp_env_draft');
  if(ppEnvDraft) {
     if(state.draftDone) ppEnvDraft.innerHTML = '<span class="tag-green">Submitted</span>';
     else ppEnvDraft.innerHTML = '<span class="tag-red">Awaiting Draft</span>';
     
     let ppLegStat = document.getElementById('pp_leg_stat');
     if(ppLegStat) {
       if(state.legalPackRev) ppLegStat.innerHTML = '<span class="tag-green">Legal Endorsed</span>';
       else ppLegStat.innerHTML = '<span class="tag-amber">Pending Sign-off</span>';
     }
     
     let ppStat = document.getElementById('pp_stat');
     let ppBan = document.getElementById('pp_banner');
     let btnPpRev = document.getElementById('btn_pp_rev');
     let btnPpLegRev = document.getElementById('btn_pp_leg_rev');
     
     if(btnPpLegRev) { if(state.legalPackRev) btnPpLegRev.style.display = 'none'; else btnPpLegRev.style.display = 'inline-block'; }
     if(btnPpRev) { if(state.planPackRev) btnPpRev.style.display = 'none'; else btnPpRev.style.display = 'inline-block'; }

     if(state.planPackRev && state.legalPackRev) {
         ppStat.innerHTML = '<span class="tag-green">Compiled, Supported & Validated</span>';
         ppBan.className = 'sf-banner success'; ppBan.innerHTML = '&#10003; Submission Pack components structurally validated and legally backed.';
     } else if (state.draftDone) {
         ppStat.innerHTML = '<span class="tag-amber">Ready for Review</span>';
         ppBan.className = 'sf-banner info'; ppBan.innerHTML = 'Components submitted. Awaiting dual-discipline verifications.';
     } else {
         ppStat.innerHTML = '<span class="tag-amber">Drafting / Compiling</span>';
         ppBan.className = 'sf-banner warn'; ppBan.innerHTML = 'Review draft contributions from cross-functional teams prior to pack compilation.';
     }

     // Decision Support Overlayer inside Pack view
     let cPackTxt = document.getElementById('coord_pack_stat_txt');
     let cPackAct = document.getElementById('coord_pack_act');
     if(cPackTxt) {
       if(state.coordPackReviewed) {
         cPackTxt.innerHTML = '✅ Final Pack Confirmed for Exec Progression'; 
         cPackAct.innerHTML = '';
       } else {
         cPackTxt.innerHTML = '❌ Final Pack Completeness Assessment Pending';
       }
     }
  }

  // === Decision Issue / Publication Hub ===
  let decChkPack = document.getElementById('dec_chk_pack');
  if(decChkPack) {
    if(state.coordPackReviewed) {
      decChkPack.innerHTML = '✅ Submission Pack & Clearances Finalized internally';
    } else {
      decChkPack.innerHTML = '❌ Submission Pack & Clearances Finalized internally';
    }

    let decChkPrep = document.getElementById('dec_chk_prep');
    let btnIssuePrep = document.getElementById('btn_issue_prep');
    if(state.coordIssuePrep) {
      decChkPrep.innerHTML = '✅ Issue / Notification Materials Verified';
      if(btnIssuePrep) btnIssuePrep.style.display = 'none';
    } else {
      decChkPrep.innerHTML = '❌ Issue / Notification Materials Verified';
      if(btnIssuePrep) btnIssuePrep.style.display = 'inline-block';
    }

    let btnPubReady = document.getElementById('btn_pub_ready');
    let decSumm = document.getElementById('dec_summ');
    let decBan = document.getElementById('dec_banner');

    if(state.coordPubReady) {
      decSumm.innerHTML = '<span class="tag-green">Publication Assets Complete ✓</span>';
      decBan.className = 'sf-banner success'; decBan.innerHTML = '&#10003; Case marked physically ready for publication and issuance.';
      if(btnPubReady) { btnPubReady.innerText = 'Publication Ready ✓'; btnPubReady.disabled = true; }
    } else {
      if(finalPubReady) {
         decSumm.innerHTML = '<span class="tag-green">Ready to Publish</span>';
         decBan.className = 'sf-banner info'; decBan.innerHTML = 'Assets structurally verified. Confirm final readiness to end internal workflows.';
         if(btnPubReady) { btnPubReady.disabled = false; }
      } else {
         decSumm.innerHTML = '<span class="tag-amber">Preparing Assets</span>';
         decBan.className = 'sf-banner warn'; decBan.innerHTML = 'Coordinate final preparation steps before authorizing internal release.';
         if(btnPubReady) { btnPubReady.disabled = true; }
      }
    }
  }

  // === Master Clearance / Decision Readiness ===
  let prSumm = document.getElementById('pr_summ');
  if(prSumm) {
     if(state.masterCleared) {
         prSumm.innerHTML = '<span class="tag-green">Master Case Cleared</span>';
         document.getElementById('pr_banner').className = 'sf-banner success';
         document.getElementById('pr_banner').innerHTML = '&#10003; Final Case Decision Released.';
         document.getElementById('btn_master_clear').style.display = 'none';
         document.getElementById('btn_pr_track').style.display = 'none';
         document.getElementById('btn_lr_track').style.display = 'none';
         document.getElementById('btn_legal_clear').style.display = 'none';
     } else {
         let mmban = document.getElementById('pr_banner');
         
         let lBtnC = document.getElementById('btn_legal_clear');
         let lBtnT = document.getElementById('btn_lr_track');
         if(state.legalCleared) {
            lBtnC.disabled = true; lBtnC.innerText = 'Legal Cleared ✓';
            lBtnT.style.display = 'none';
         } else {
            if(state.legalPackRev && state.legalDocReviewed) { lBtnC.disabled = false; } else { lBtnC.disabled = true; }
            if(state.legalOnTrack) { lBtnT.innerText = '✅ Legally On Track'; lBtnT.style.background = '#fdfafb'; }
         }

         if(masterReady) {
             prSumm.innerHTML = '<span class="tag-green">Ready To Publish</span>';
             mmban.className = 'sf-banner info'; mmban.innerHTML = 'Core dependencies mathematically cleared. Awaiting Executive Final Sign-off.';
             document.getElementById('btn_master_clear').disabled = false;
         } else {
             prSumm.innerHTML = (state.planOnTrack && state.legalOnTrack) ? '<span class="tag-green">Strong Forecast</span>' : '<span class="tag-amber">Trending</span>';
             mmban.className = 'sf-banner error'; mmban.innerHTML = 'Master clearance cannot proceed. Core dependencies are incomplete.';
             document.getElementById('btn_master_clear').disabled = true;
         }

         if(state.planOnTrack) {
             let pBtnT = document.getElementById('btn_pr_track');
             pBtnT.innerText = '✅ Planning On Track';
             pBtnT.style.color = '#2e844a'; pBtnT.style.borderColor = '#2e844a';
         }
     }
     
     document.getElementById('pr_chk_cons').innerHTML = consReady ? '✅ Active Consultations tracking as Sufficient' : '❌ Active Consultations tracking as Sufficient';
     document.getElementById('pr_chk_env').innerHTML = state.envCleared ? '✅ Environmental Workspace Sign-off Received' : '❌ Environmental Workspace Sign-off Received';
     document.getElementById('pr_chk_pack').innerHTML = state.planPackRev ? '✅ Submission Pack Reviewed & Compiled' : '❌ Submission Pack Reviewed & Compiled';
     document.getElementById('pr_chk_legal').innerHTML = state.legalCleared ? '✅ Legal Team Certification Complete' : '❌ Legal Team Certification Complete';
  }

  // === Master / Shared Case Work Updates ===
  let cwBan = document.getElementById('cw_banner');
  if(cwBan) {
      if(state.coordPubReady) {
          cwBan.className = 'sf-banner success'; cwBan.innerHTML = '&#10003; Case marked fully ready for physical issuance. Cycle complete.';
          document.getElementById('case_pub_ready').innerHTML = '<span class="tag-green">Ready</span>';
          document.getElementById('case_pub_status').innerHTML = '<span class="tag-green">Ready ✓</span>';
          document.getElementById('case_env_status').innerHTML = '<span class="tag-green">Cleared</span>';
          document.getElementById('case_plan_status').innerHTML = '<span class="tag-green">Cleared</span>';
          document.getElementById('case_legal_status').innerHTML = '<span class="tag-green">Cleared</span>';
          document.getElementById('case_plan_track_ind').innerHTML = '<span class="tag-green">Published</span>';
          document.getElementById('case_overall_rag').innerHTML = '<span class="tag-green">Green</span>';
      } else if(state.masterCleared) {
          cwBan.className = 'sf-banner success'; cwBan.innerHTML = '&#10003; Case logic complete. Master Decision Published. Awaiting Coordinator physical issuance.';
          document.getElementById('case_pub_ready').innerHTML = (state.coordPackReviewed && state.coordIssuePrep) ? '<span class="tag-green">Verifications Checked</span>' : '<span class="tag-amber">Reviewing Materials</span>';
          document.getElementById('case_pub_status').innerHTML = '<span class="tag-amber">Approaching Issuance</span>';
          document.getElementById('case_env_status').innerHTML = '<span class="tag-green">Cleared</span>';
          document.getElementById('case_plan_status').innerHTML = '<span class="tag-green">Cleared</span>';
          document.getElementById('case_legal_status').innerHTML = '<span class="tag-green">Cleared</span>';
          document.getElementById('case_plan_track_ind').innerHTML = '<span class="tag-green">Published</span>';
          document.getElementById('case_overall_rag').innerHTML = '<span class="tag-green">Green</span>';
      } else if(masterReady) {
          cwBan.className = 'sf-banner info'; cwBan.innerHTML = 'Ready for Master Clearance.';
          document.getElementById('case_plan_track_ind').innerHTML = state.planOnTrack ? '<span class="tag-green">Confirmed On Track</span>' : '<span class="tag-amber">Pending Check</span>';
          document.getElementById('case_pub_ready').innerHTML = '<span class="tag-amber">Tracking</span>';
          document.getElementById('case_overall_rag').innerHTML = '<span class="tag-green">Green</span>';
      } else {
          cwBan.className = 'sf-banner warn'; cwBan.innerHTML = '&#9888; Master Clearance requires final cross-departmental sign-offs.';
          document.getElementById('case_overall_rag').innerHTML = '<span class="tag-amber">Amber</span>';
          document.getElementById('case_plan_track_ind').innerHTML = state.planOnTrack ? '<span class="tag-green">Confirmed On Track</span>' : '<span class="tag-amber">Pending Check</span>';
          
          document.getElementById('case_legal_status').innerHTML = state.legalCleared ? '<span class="tag-green">Cleared</span>' : '<span class="tag-amber">Reviewing</span>';
      }
  }

  // Document/Issue views remain mostly same
  let btnEv = document.getElementById('btn_ev_review');
  let lblEv = document.getElementById('lbl_ev_review');
  if(btnEv && lblEv) {
      if(state.evidenceReviewed) { btnEv.style.display = 'none'; lblEv.className = 'tag-green'; lblEv.innerHTML = '&#10003; Reviewed'; }
      else { btnEv.style.display = 'inline-flex'; lblEv.className = 'tag-red'; lblEv.innerText = 'Awaiting Review'; }
  }
}

document.addEventListener('DOMContentLoaded', initState);
