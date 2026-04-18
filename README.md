# DESNZ Case Management Prototypes

This repository contains stateful, clickable HTML prototypes for the DESNZ Salesforce implementation. These are purely front-end prototypes that demonstrate workflow, UX, and cross-screen state without needing a real backend.

---

## 1. CPO Journey 1 — Case Officer Workflow 

**File:** `DESNZ_CPO_Journey1_Prototype.html`

This prototype wires the base Salesforce wireframes into a connected, stateful flow for a CPO Case Officer managing a case from initial Validation through to Decision and Closure. (See file directly, open in browser).

---

## 2. DCO Multi-Disciplinary Case Management Journey

**Location:** Inside the `/prototype` folder (Node.js/Express app).

This updated prototype implements heavily-interlinked **DCO Cross-Functional Journeys** mapping six intertwined personas that form the overarching case resolution workflow:

1. **Case Manager:** Reviewing evidence, making consultation adequacy judgments, resolving issues, and contributing text drafting.
2. **Team Leader:** Surfacing aggregated risk at the Portfolio Dashboard level, drilling down contextually, attaching string-based leadership notes, and flagging/endorsing issues natively.
3. **Support Coordinator (Admin):** Processing metadata and recording extensions across key records to unblock the Case Manager.
4. **Planning Orchestrator:** The case aggregator—monitoring the Pack components, confirming readiness, monitoring cross-team clearances, and initiating the final Executive Decision publishing workflow.
5. **Legal Reviewer:** Evaluating Draft Orders (Statutory Instruments), acknowledging Submission Packs from a compliance perspective, and granting discrete Legal Certification required for final Master Clearance.
6. **Decision Support / Submission Coordinator:** The final checkpoint officer who evaluates physical pack compilation structure and oversees the distribution logic of the final Case outputs.

### How to Run:
```bash
cd prototype
npm install
npm start
```
Then navigate to `http://localhost:3000` in your browser.

### How to Demo the Flow (Decision Support UX - Happy Path):
**Initial state:** Environmental team is cleared, Planning is validated, Legal is endorsed, and the case sits structurally verified. The executives have granted signoff. The Decision Support Coordinator comes in to execute the physical publish event.

*(Developer Note: First simulate the prior teams' checks by clicking the quick mock buttons nested in the unlisted shells at the bottom of the HTML, or simply execute the other user pathways to trace the entire E2E route!)*

1. Start at the **Shared / Cross-Team -> DCO Case Workspace**. At the bottom of the "Clearance Status Rollup", you will see a newly injected tracker for: **"Decision Issue Tracker ->"**. The `Publication Ready` state natively floats at "Pending". 
2. Click through to the **Submission Pack Assembly** (via the Sidebar or the generic `nav` tree).
3. The Submission Pack view now houses a new overlay at the bottom: `"Decision Coordinator Oversight"`. The Decision Support Officer looks at the compiled components across Teams and explicitly clicks: **"Acknowledge Pack Complete Enough"**. 
4. The user then navigates to the core routing view: **"Decision Issue / Publication Hub"**.
   - Review the final Preparation Checklist. You will see `Submission Pack & Clearances Finalized internally` instantly shift to `✅`.
   - Now click **"Mark Issue Prep Reviewed"** to denote that all physical issuance materials (envelopes, digital notifications, mass-mailing architectures) are instantiated.
5. With those two checks marked, and the Exec signoffs in place, the massive **"Confirm Decision Ready for Issue ✓"** button unlocks.
6. Click it! The user is returned to the `DCO Case Workspace`.
7. The master Case RAG completely closes out. The system flashes a `Success` state indicating the final cycle for `DCO-2026-012` has officially physically ended and been issued into the public record!

### What State Changes are Supported (Decision Support additions):
- **Post-Signoff Routing:** Validates that `state.masterCleared` is NOT the final node. `state.coordPubReady` exists as a rigid procedural layer preventing a structurally valid application from being mistakenly "mailed" to stakeholders before packaging teams execute physical issuance tests.

*(If you ever get stuck, just press the red **Reset Journey State** button at the top!)*
