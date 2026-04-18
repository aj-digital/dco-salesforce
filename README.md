# DESNZ Case Management Prototypes

This repository contains two sets of stateful, clickable HTML prototypes for the DESNZ Salesforce implementation. These are purely front-end prototypes that demonstrate workflow, UX, and cross-screen state without needing a real backend.

---

## 1. CPO Journey 1 — Case Officer Workflow 

**File:** `DESNZ_CPO_Journey1_Prototype.html`

This prototype wires the base Salesforce wireframes into a connected, stateful flow for a CPO Case Officer managing a case from initial Validation through to Decision and Closure.

### How to Demo the Journey:
1. **Queue (Screen 1):** Start here. You will see case "CPO-2026-0041" blocked in Validation. Click the row to open the Case Record.
2. **Case Record (Screen 2):** Note the RAG status (Red), Stage (Validation), and that there are 2 open RFIs blocking progress. Click **"Enter Validation Workspace"**.
3. **Validation Workspace (Screen 3):** See that document completeness is stuck at 5/7 mandatory. Click **"View RFI-002"** to manage the missing Environmental Statement.
4. **RFI Workspace (Screen 4):** Simulate receiving the document by clicking **"Mark Resolved"**.
5. **Validation Workspace (Screen 3):** Notice that:
   - Completeness is now 6/7.
   - The Environmental Statement is checked off.
   - You can also click **"Simulate Resolve"** for RFI-003. When both are resolved, the Validation status becomes unblocked (100% complete) and the red banner turns green.
6. **Progression:** Click the newly enabled **"Mark Valid & Advance Stage"** button.
7. **Subsequent Stages:** The app smoothly transitions you through the **Consultation**, **Objections**, and **Decision & Publication** screens using the "Advance/Close" buttons on each highlighted banner.
8. **Closure:** On the Decision page, completing the final action returns you to the Queue, where CPO-2026-0041 is now correctly labelled as "Closed" with a grey indicator.

### What State Changes are Supported:
- **RFIs System:** It tracks two specific blocking RFIs (`rfi2` and `rfi3`).
- **Validation Progress:** Automatically calculates doc completeness (e.g. 5/7 vs 7/7) dynamically from the RFI state.
- **Stage Navigation:** Progression (Validation -> Consultation -> Objections -> Decision -> Closed).
- **RAG Status / Banners:** The top-level case health reacts instantly depending on whether items are missing or cleared.

To restart the demo, click the red **"Reset State"** button in the top right header.

---

## 2. DCO Environmental Case Manager Journey

**Location:** Inside the `/prototype` folder (Node.js/Express app).

This updated prototype implements the comprehensive **Environmental Case Manager Journey**. It illustrates a complete workflow showing how an environmental issue blocking a case can be progressed by reviewing evidence, managing consultations, inputting drafting, and securing clearance. 

### How to Run:
```bash
cd prototype
npm install
npm start
```
Then navigate to `http://localhost:3000` in your browser.

### How to Demo the Flow:
**Initial state:** The case is blocked, waiting on Environmental clearance.

1. Start at the **DCO Case Workspace**. Observe the red banner noting clearance is blocked. Click through to the **Env Review Workspace**.
2. Notice there is 1 blocking issue on the dashboard. Click on **ENV-ISS-001 (Habitats)** to open the Issue Detail screen.
3. Observe the "Linked Evidence" is Unreviewed and "Linked Consultation" is Adequacy Pending. Try to click "Resolve Issue" natively—it is blocked!
4. Click **"View Evidence"**. Open the Habitats Reg Assessment. Click **"Mark Evidence as Reviewed"**. Click **"Back to Issue"**. Notice the Evidence status is now green/Reviewed.
5. Click **"View Consultation"** from the issue detail screen. Select **"✅ Sufficient"** on the adequacy assessment. Notice the status immediately leaps to "Received & Reviewed".
6. Click **"Back to Issue"**. Since Evidence is reviewed and Adequacy is Sufficient, you can now hit the green **"Resolve Issue"** button natively!
7. Navigate back to the **Env Review Workspace**. The issue is resolved, but we aren't completely done... you still need to submit the drafting.
8. Click **"Open Drafting Page"** on the workspace. Type some text and click **"Submit Drafting"**.
9. Click **"View Env Readiness"**. Because drafting is submitted, consultation adequacy achieved, the issue resolved, and evidence checked, the clearance checklist is 100% complete! Click **"Sign-off Env Clearance"**.
10. You will be routed back to the main **DCO Case Workspace** natively! The red banner is instantly replaced with a green banner denoting master case clearance is now unlocked!

### What State Changes are Supported:
- **Evidence Review Toggle:** Boolean status connecting D&E views to specific issues.
- **Consultation Adequacy Dropdown/Selection:** Explicit progression metrics ("Pending", "Insufficient", "Partially Sufficient", "Sufficient").
- **Issue Workflow Protection:** Issues can only be moved to 'Resolved' iff linked Consultation and Evidence components validate fully first.
- **Textual Record Validation:** Tracking "report drafting submitted/not submitted".
- **Nested Signoffs:** "Env Clearance" rolls directly up to unblock "Master Case Clearance".

*(If you ever get stuck, just press the red **Reset Journey State** button at the top!)*
