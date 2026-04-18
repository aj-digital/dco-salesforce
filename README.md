# DESNZ Case Management Prototypes

This repository contains stateful, clickable HTML prototypes for the DESNZ Salesforce implementation. These are purely front-end prototypes that demonstrate workflow, UX, and cross-screen state without needing a real backend.

---

## 1. CPO Journey 1 — Case Officer Workflow 

**File:** `DESNZ_CPO_Journey1_Prototype.html`

This prototype wires the base Salesforce wireframes into a connected, stateful flow for a CPO Case Officer managing a case from initial Validation through to Decision and Closure. (See file directly, open in browser).

---

## 2. DCO Environmental Case Manager, Lead, Coordinator & Planning Orchestrator Journeys

**Location:** Inside the `/prototype` folder (Node.js/Express app).

This updated prototype implements heavily-interlinked **DCO Cross-Functional Journeys** for four distinct operating Personas:
1. **Case Manager:** Reviewing evidence, making consultation adequacy judgments, resolving issues, and contributing text drafting.
2. **Team Leader:** Surfacing aggregated risk at the Portfolio Dashboard level, drilling down contextually, attaching string-based leadership notes, and flagging/endorsing issues natively.
3. **Support Coordinator (Admin):** Processing metadata and recording extensions across key records to unblock the Case Manager.
4. **Planning Case Manager:** The ultimate master aggregator—monitoring the Pack components, confirming readiness, monitoring cross-team clearances, and initiating the final Executive Decision publishing workflow.

### How to Run:
```bash
cd prototype
npm install
npm start
```
Then navigate to `http://localhost:3000` in your browser.

### How to Demo the Flow (Planning Case Manager - Orchestrator UX):
**Initial state:** Environmental team is working through their issues, but Planning needs to prepare for Master Clearance.

1. Start at the **Shared / Cross-Team -> DCO Portfolio Dash**. You immediately see macro states (e.g., Active Consultations are designated as "Receiving", Readiness is "Trending").
2. Click through to **DCO-2026-012**. You see high-level Case components. Observe the new "Clearance Status Rollup". Click the top row: **"Planning / Case Mgmt Workspace"**.
3. Inside the **Planning Workspace**, the Orchestrator has an x-ray view of Cross-Team Dependencies. 
   - Click "Acknowledge Cross-Functional Drafts Received". This stamps accountability checks directly.
   - Click **"Orchestrate Submission Pack ->"**
4. Inside the **Submission Pack Assembly** view, notice the "Pack Status" is "Drafting". This waits explicitly for the *Environmental Case Manager* to submit their drafts. 
   - *(Optional Demo Hook: Temporarily jump into `Env Drafting & Contrib.` as the Env Manager and click submit. When you return here, it will say "Ready for Review"!)*
5. Once Environmental drafts are present (or simulated via the codebase), a green button appears: **"Mark Pack Components Reviewed Validation"**. Click it!
6. Navigate back and enter the **"Evaluate Master Readiness ->"** menu (or via the Sidebar's `Master Clearance` button).
7. Here you can definitively review all cross-team components: Environment Sign-off, Pack Assembly, and Consultation Sufficiency. 
   - You can click **"Confirm Case On Track"** to assure stakeholders before clearance is legally permitted.
   - You **cannot** click "Submit Final Clearance" until every underlying team (Env Sign-off, Admin Tasks, Consultations, Pack Review) clears exactly mathematically. When they do, the Final button activates allowing you to publish and permanently unblock `DCO-2026-012`.

### What State Changes are Supported (Planning additions):
- **Complex Hierarchical States:** The final `masterCleared` variable now explicitly demands localized checks `(state.envCleared && state.planPackRev && state.consAdequacy === 'Sufficient')` mirroring dense Salesforce record rules seamlessly on the front-end!
- **Targeted Endorsements:** The "Mark On Track" buttons log soft-endosrements separate from hard legal clearances, projecting "Case On Track" text overlays across the master portfolios so unrelated teams can rest assured the Planning lead is engaged.

*(If you ever get stuck, just press the red **Reset Journey State** button at the top!)*
