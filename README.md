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

## 2. DCO Environmental Case Manager 

**File:** The Node.js App in `/prototype` or the `DESNZ_DCO_E2E_Prototype.html`

This tackles the cross-functional communication between Planning, Environmental, and Leadership personas. (See previous instructions for running the NodeJS version via `npm start`).

### What state is remembered
- **Environmental Issue Status:** Open or Resolved.
- **Consultation State:** Awaiting, Received, Reviewed.
- **Clearance Readiness:** Automates sign-off logic for master clearance.
