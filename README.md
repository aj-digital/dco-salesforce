# DESNZ Case Management Prototypes

This repository contains stateful, clickable HTML prototypes for the DESNZ Salesforce implementation. These are purely front-end prototypes that demonstrate workflow, UX, and cross-screen state without needing a real backend.

---

## 1. CPO Journey 1 — Case Officer Workflow 

**File:** `DESNZ_CPO_Journey1_Prototype.html`

This prototype wires the base Salesforce wireframes into a connected, stateful flow for a CPO Case Officer managing a case from initial Validation through to Decision and Closure. (See file directly, open in browser).

---

## 2. DCO Multi-Disciplinary Case Management Journey

**Location:** Inside the `/prototype` folder (Node.js/Express app).

This updated prototype implements heavily-interlinked **DCO Cross-Functional Journeys** mapping a massive seven-persona network that collectively forms the overarching case pipeline:

1. **Case Manager:** Reviewing evidence, making consultation adequacy judgments, resolving issues, and contributing text drafting.
2. **Team Leader:** Surfacing aggregated risk at the Portfolio Dashboard level, drilling down contextually, attaching string-based leadership notes, and flagging/endorsing issues natively.
3. **Support Coordinator (Admin):** Processing metadata and recording extensions across key records to unblock the Case Manager.
4. **Planning Orchestrator:** The case aggregator—monitoring the Pack components, confirming readiness, monitoring cross-team clearances, and initiating the final Executive Decision publishing workflow.
5. **Legal Reviewer:** Evaluating Draft Orders (Statutory Instruments), acknowledging Submission Packs from a compliance perspective, and granting discrete Legal Certification required for final Master Clearance.
6. **Decision Support Coordinator:** The checkpoint officer who evaluates physical pack compilation structure and oversees the distribution logic of the final Case outputs.
7. **Admin / Archive Support:** The definitive terminus node. This user sweeps the application verifying Metadata storage, auditing the Publication transmission paths, and permanently locking the Case into read-only History status.

### How to Run:
```bash
cd prototype
npm install
npm start
```
Then navigate to `http://localhost:3000` in your browser.

### How to Demo the Flow (Archive & Closure UX - Happy Path):
**Initial state:** Environmental team is cleared, Planning is validated, Legal is endorsed. The executives have granted sign-off. The final outputs have been physically 'Published'. 

*(Developer Note: First simulate the prior teams' checks by clicking the quick mock buttons nested in the unlisted shells at the bottom of the HTML, or simply execute the other user pathways sequentially to trace the entirety of the project lifecycle!)*

1. Start at the **Shared / Cross-Team -> DCO Case Workspace**. Observe the dynamic "Path Bar" nodes transitioning to active Closure mode. 
2. Click through to the **Closure & Archive Tracker** view (either locally on the table row or via the main navigation sidebar).
3. The Admin/Archive view aggregates checks across wildly distinct parts of the logic tree. Let's trace them down manually:
   - Click `"Review Notification Pubs"`, bridging you directly to the `Decision Issue Hub`. Scroll down to `"Records Admin Handover Tracker"` and click **"Acknowledge Publication Output Recorded"**. 
   - Click back via Breadcrumbs to the `Archive Tracker`. The first tier now says `✅ Final Decision Published & Assessed`.
   - Now click `"Check Records Vault"`. Inside the Docs Viewer, skip down to doc three `[PUB-001]` and verify the Metadata in the purple admin box. Click **"Confirm Record Set Locked"**.
4. Returning back to the main `Closure Tracker`, the second tier verifies.
5. Finally, click **"Confirm Archive Established"** denoting the external long-term servers or internal physical files have accepted the final migration hand-off.
6. A massive **"Close Case File ✓"** button unlocks.
7. Click it! The user is returned to the `DCO Case Workspace`.
8. The entire Master layout permanently shifts from vibrant Active hues to a uniform **Gray (Closed/Archived)** state. All active nodes snap to Read-Only metadata formats. 

### What State Changes are Supported (Closure additions):
- **Deep Status Coupling:** Ensures that a case cannot be trivially deleted or moved linearly "Closed" simply because decision publication finished. Physical and digital record archiving nodes act as strict compliance checkpoints terminating the case state-machine cleanly without backend mutation edge-cases leaking.

*(If you ever get stuck, just press the red **Reset Journey State** button at the top!)*
