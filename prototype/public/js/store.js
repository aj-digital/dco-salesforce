// Mock State
const s = {
  issueRes: false,
  consStage: 0, // 0 await, 1 rev, 2 cleared
  draftDone: false,
  envCleared: false,
  masterCleared: false
};

function resetState() {
  s.issueRes = false; s.consStage = 0; s.draftDone = false; s.envCleared = false; s.masterCleared = false;
  updateUI();
  alert('State Reset');
}

// Navigation Logic
function setCategory(catId) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.screen-nav').forEach(n => n.classList.remove('active'));
  document.getElementById('nav_' + catId).classList.add('active');
  // Auto-open first screen in this category
  const firstBtn = document.querySelector('#nav_' + catId + ' .nav-btn');
  if(firstBtn) firstBtn.click();
}

function navigateTo(screenId, forceCat) {
  if (forceCat) {
    document.querySelectorAll('.cat-btn').forEach(b => {
      if (b.getAttribute('onclick').includes(forceCat)) b.click();
    });
  }
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.nav-btn[data-target='${screenId}']`);
  if (btn) btn.classList.add('active');
  updateUI();
}

document.querySelectorAll('.nav-btn').forEach(b => {
  b.addEventListener('click', (e) => { navigateTo(e.target.dataset.target); });
});

// Action logic
function toggleEnvIssue() { s.issueRes = !s.issueRes; updateUI(); }
function updateEnvCons() { 
  if (s.consStage === 0) s.consStage = 1;
  else if (s.consStage === 1) s.consStage = 2;
  updateUI();
}
function submitEnvDraft() { s.draftDone = true; updateUI(); }
function clearEnv() { s.envCleared = true; updateUI(); }
function clearMaster() { s.masterCleared = true; updateUI(); }

// UI Sync Machine
function updateUI() {
  const envReady = s.issueRes && s.consStage === 2 && s.draftDone;
  const overallReady = s.envCleared; // In this mock, legal is already cleared

  // Env Issue
  document.getElementById('ei_status').innerHTML = s.issueRes ? '<span class="tag-green">Resolved</span>' : '<span class="tag-red">Open (Blocking)</span>';
  document.getElementById('ei_btn').innerText = s.issueRes ? 'Reopen Issue' : 'Mark as Resolved';
  document.getElementById('ei_btn').className = s.issueRes ? 'sf-btn' : 'sf-btn success';

  // Env Cons
  const cLbl = s.consStage===0 ? '<span class="tag-amber">Awaiting</span>' : (s.consStage===1 ? '<span class="tag-blue">Received. Needs Review</span>' : '<span class="tag-green">Reviewed & Cleared</span>');
  document.getElementById('ec_status').innerHTML = cLbl;
  const cBtn = document.getElementById('ec_btn');
  if(s.consStage===0) { cBtn.innerText='Record Response Received'; cBtn.style.display='inline-flex'; }
  else if(s.consStage===1) { cBtn.innerText='Mark as Reviewed / Adequate'; cBtn.style.display='inline-flex'; }
  else { cBtn.style.display='none'; }

  // Env Draft
  document.getElementById('ed_status').innerHTML = s.draftDone ? '<span class="tag-green">Submitted</span>' : '<span class="tag-red">Not Submitted</span>';
  document.getElementById('ed_btn').innerText = s.draftDone ? 'Update Draft' : 'Submit Drafting';

  // Env Readiness
  document.getElementById('er_chk_iss').innerText = s.issueRes ? '✅ Issue ENV-ISS-001 Resolved' : '❌ Issue ENV-ISS-001 Resolved';
  document.getElementById('er_chk_cons').innerText = s.consStage===2 ? '✅ Consultation CONS-001 Reviewed' : '❌ Consultation CONS-001 Reviewed';
  document.getElementById('er_chk_draft').innerText = s.draftDone ? '✅ Drafting Submitted' : '❌ Drafting Submitted';
  
  if (s.envCleared) {
    document.getElementById('er_status').innerHTML = '<span class="tag-green">Cleared</span>';
    document.getElementById('er_btn').innerText = 'Cleared ✓';
    document.getElementById('er_btn').disabled = true;
  } else if (envReady) {
    document.getElementById('er_status').innerHTML = '<span class="tag-green">Ready to Sign-off</span>';
    document.getElementById('er_btn').disabled = false;
  } else {
    document.getElementById('er_status').innerHTML = '<span class="tag-red">Blocked</span>';
    document.getElementById('er_btn').disabled = true;
  }

  // Cross-rollups
  // Env Dash
  document.getElementById('env_dash_blocks').innerText = envReady ? '1' : '2'; // mock reducing the total
  document.getElementById('env_dash_iss_count').innerText = s.issueRes ? '0' : '1';
  document.getElementById('env_dash_ready').innerHTML = envReady ? '<span class="tag-green">Ready</span>' : '<span class="tag-red">Blocked</span>';
  
  // Env Work
  document.getElementById('ew_ready').innerHTML = envReady ? '<span class="tag-green">Ready for Clearance</span>' : '<span class="tag-red">Not Ready</span>';
  document.getElementById('ew_iss_tag').innerText = s.issueRes ? 'Resolved' : 'Open';
  document.getElementById('ew_iss_tag').className = s.issueRes ? 'tag-green' : 'tag-red';
  document.getElementById('ew_cons_tag').innerText = s.consStage===2 ? 'Cleared' : 'Pending';
  document.getElementById('ew_cons_tag').className = s.consStage===2 ? 'tag-green' : 'tag-amber';
  document.getElementById('ew_draft_tag').innerText = s.draftDone ? 'Done' : 'Pending';
  document.getElementById('ew_draft_tag').className = s.draftDone ? 'tag-green' : 'tag-red';

  // Plan Workspace & Pack
  document.getElementById('pw_env_stat').innerHTML = s.envCleared ? '<span class="tag-green">Cleared</span>' : '<span class="tag-red">Pending Env Clearance</span>';
  document.getElementById('pc_iss_stat').innerHTML = s.issueRes ? '<span class="tag-green">Resolved</span>' : '<span class="tag-red">Open (Env Team)</span>';
  document.getElementById('pp_draft_stat').innerHTML = s.draftDone ? '<span class="tag-green">Submitted</span>' : '<span class="tag-red">Pending from Env</span>';

  // Plan Ready
  document.getElementById('pr_chk_env').innerText = s.envCleared ? '✅ Environmental Clearance Signed-off' : '❌ Environmental Clearance Signed-off';
  if (s.masterCleared) {
    document.getElementById('pr_status').innerHTML = '<span class="tag-green">Submitted to Minister</span>';
    document.getElementById('pr_btn').innerText = 'Submitted ✓';
    document.getElementById('pr_btn').disabled = true;
  } else if (s.envCleared) {
    document.getElementById('pr_status').innerHTML = '<span class="tag-green">Ready for Submission</span>';
    document.getElementById('pr_btn').disabled = false;
  } else {
    document.getElementById('pr_status').innerHTML = '<span class="tag-red">Blocked by Env Team</span>';
    document.getElementById('pr_btn').disabled = true;
  }

  // Shared / Case Work / Timeline
  document.getElementById('case_env_status').innerHTML = s.envCleared ? '<span class="tag-green">Cleared</span>' : '<span class="tag-red">Blocked</span>';
  document.getElementById('case_plan_status').innerHTML = s.masterCleared ? '<span class="tag-green">Cleared</span>' : '<span class="tag-amber">In Progress</span>';
  document.getElementById('task_env').innerHTML = s.draftDone ? '<span class="tag-green">Done</span>' : '<span class="tag-red">Overdue</span>';
  
  const overallRag = s.masterCleared ? 'tag-green' : (envReady ? 'tag-amber' : 'tag-red');
  document.getElementById('case_overall_rag').innerHTML = `<span class="${overallRag}">${s.masterCleared?'Green':envReady?'Amber':'Red'}</span>`;
  document.getElementById('port_case1_rag').innerHTML = `<span class="${overallRag}">${s.masterCleared?'Green':envReady?'Amber':'Red'}</span>`;

  // Leadership
  document.getElementById('ld_case1_stat').innerHTML = s.masterCleared ? '<span class="tag-green">Cleared - Ready for Pub</span>' : '<span class="tag-red">Blocked in Review</span>';
  const pubBtn = document.getElementById('l_dec_btn');
  if (s.masterCleared) {
    pubBtn.disabled = false;
    pubBtn.className = 'sf-btn success';
    document.getElementById('l_dec_msg').innerText = "Clearance received. Ready to publish.";
  } else {
    pubBtn.disabled = true;
    pubBtn.className = 'sf-btn';
    document.getElementById('l_dec_msg').innerText = "Requires Master Clearance submission first.";
  }
}

// Ensure init on DOM content load
document.addEventListener('DOMContentLoaded', updateUI);
