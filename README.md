# DESNZ Case Management Prototypes

This repository contains stateful, clickable HTML prototypes for the DESNZ Salesforce implementation. These are purely front-end prototypes that demonstrate workflow, UX, and cross-screen state without needing a real backend.

---

## 1. CPO Journey 1 — Case Officer Workflow 

**File:** `DESNZ_CPO_Journey1_Prototype.html`

This prototype wires the base Salesforce wireframes into a connected, stateful flow for a CPO Case Officer managing a case from initial Validation through to Decision and Closure. (See file directly, open in browser).

---

## 2. DCO Multi-Disciplinary Case Management Journey

**Location:** Inside the `/prototype` folder (Node.js/Express app).

This updated prototype implements heavily-interlinked **DCO Cross-Functional Journeys** for five distinct operating Personas:
1. **Case Manager:** Reviewing evidence, making consultation adequacy judgments, resolving issues, and contributing text drafting.
2. **Team Leader:** Surfacing aggregated risk at the Portfolio Dashboard level, drilling down contextually, attaching string-based leadership notes, and flagging/endorsing issues natively.
3. **Support Coordinator (Admin):** Processing metadata and recording extensions across key records to unblock the Case Manager.
4. **Planning Orchestrator:** The case aggregator—monitoring the Pack components, confirming readiness, monitoring cross-team clearances, and initiating the final Executive Decision publishing workflow.
5. **Legal Reviewer:** Evaluating Draft Orders (Statutory Instruments), acknowledging Submission Packs from a compliance perspective, and granting discrete Legal Certification required for final Master Clearance.

### How to Run:
```bash
cd prototype
npm install
npm start
```
Then navigate to `http://localhost:3000` in your browser.

### How to Demo the Flow (Legal Reviewer UX - Happy Path):
**Initial state:** Environmental team is working through their issues, and Planning is tracking the case, but Legal has not yet reviewed the statutory dependencies.

1. Start at the **Shared / Cross-Team -> DCO Case Workspace**. Observe the high-level overview. Notice the new "Legal Readiness" KPI reads "Pending". Click the bottom row inside the Rollup section: **"Legal Review Workspace ->"**.
2. Inside the **Legal Workspace**, Legal Counsel has an isolated view of their specific dependencies. 
   - Observe the "Legal Dependencies & Core Issues" panel. 
   - Click "Draft Order / Statutory Instrument [APP-045]" to navigate to the Document view.
3. You are now in the generic Docs/Evidence Viewer. Scroll down to Doc 2 and observe the newly injected purple `Legal Reviewer Assessment` panel. Click **"Mark Draft Order Legally Reviewed"**. Note the inline change. 
4. Return back to the **Legal Workspace** (via back-button or nav). 
   - Click **"Review Submission Pack ->"** from the Evaluation Action Items.
5. Inside the **Submission Pack Assembly** view, notice the Legal row says "Pending Sign-off". A specialized button appears exclusively for the Legal trace: **"Ack Pack is Complete (Legal View)"**. Click it!
6. Navigate to the **"Evaluate Case Readiness ->"** menu (or via the Sidebar's `Master Readiness` button).
7. Here you can definitively review all cross-team components before granting certification. 
   - If planning needs an interim update, click **"Confirm Legally On Track"** to visually update Master Dashboards.
   - Because you checked off both the statutory document (APP-045) AND acknowledged the Submission Pack, the final heavy gate **"Grant Legal Clearance ✓"** is now enabled. Click it!
8. Returning to the **DCO Case Workspace**, the master Case Overview RAG legally lights up green for the Legal division.

### What State Changes are Supported (Legal additions):
- **Role-Gated Verifications:** The Final Legal sign-off is mathematically blocked until the user navigates into both the micro Document-level (APP-045) and the macro Pack-assembly level to ensure dual-layered oversight is fulfilled. 
- **Concurrent Tracking:** The Legal track (Counsel/Compliance) exists safely isolated from, but parallel to, the Planning track (Logistics/Case Management) and Environmental track (Discipline Output). They merge at the final `plan_ready` node where all three vectors must collide perfectly via the `masterCleared` variable `(state.envCleared && state.planPackRev && state.consAdequacy && state.legalCleared)`.

*(If you ever get stuck, just press the red **Reset Journey State** button at the top!)*
