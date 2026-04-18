# DESNZ Case Management Prototypes

This repository contains stateful, clickable HTML prototypes for the DESNZ Salesforce implementation. These are purely front-end prototypes that demonstrate workflow, UX, and cross-screen state without needing a real backend.

---

## 1. CPO Journey 1 — Case Officer Workflow 

**File:** `DESNZ_CPO_Journey1_Prototype.html`

This prototype wires the base Salesforce wireframes into a connected, stateful flow for a CPO Case Officer managing a case from initial Validation through to Decision and Closure. (See file directly, open in browser).

---

## 2. DCO Environmental Case Manager & Lead Journey 

**Location:** Inside the `/prototype` folder (Node.js/Express app).

This updated prototype implements the comprehensive **Environmental Case Manager Journey** alongside an explicit **Environmental Lead / Team Leader Happy Path**. It illustrates a complete workflow showing how environmental evidence is reviewed, issues resolved, drafting input, and leadership oversight dynamically influences master case clearance state.

### How to Run:
```bash
cd prototype
npm install
npm start
```
Then navigate to `http://localhost:3000` in your browser.

### How to Demo the Flow (Lead / Team Leader UX):
**Initial state:** Case is "Amber", progressing nicely but not reviewed by a lead.

1. Start at the **Environmental Team -> Env Portfolio Dash**. Observe the top-level KPIs (8 active cases, 3 Amber, 1 Blocked, 0 Lead Reviewed). The list shows `DCO-2026-012` is Amber but Unreviewed.
2. Drill down into the specific portfolio case by clicking the **"DCO-2026-012"** case row.
3. You are now inside the specific **DCO Case Workspace**. Observe the high level overview. Click on the row denoting **"Environmental Review Workspace"** to dig deeper into the Env work.
4. You are presented with the Env Workspace. The case is "Trending Positive". Click into the single outstanding issue **ENV-ISS-001 (Habitats)**.
5. In the **Env Issue Detail** dashboard, you can view the context. The Lead can provide a light-touch direct intervention:
   - Type a note in the Leadership tools interface (e.g. "Spoke with Natural England, on track for this Friday") and click **"Save Note"**.
   - Click the green **"✅ Mark Case as Reviewed"** button.
6. Click **"Back to Env Workspace"**. Notice your actions dynamically updated the "Leadership Context" highlight panel.
7. Navigate into the **Env Readiness** panel from the dashboard. Notice `Trending Positive` is confirmed. 
8. The lead can explicitly click **"Leadership: Confirm Case on Track"** to lock endorsement. 
9. Return to the root **Env Portfolio Dashboard** using the main navigation. 
   - Observe that the case `Leadership Status` has now cleanly changed from "Unreviewed" to "✅ Reviewed".
   - The top-level KPI for "Lead Reviewed" dynamically increments from 0 to 1.

*(Note: In the issue detail menu, a lead could alternatively click '🚩 Flag for Attention', which propagates outwards instantly turning the Master Case Dashboard red/at-risk until remedied).*

### What State Changes are Supported (Lead additions):
- **Portfolio filtering state:** Start directly at the Portfolio level and retain case-level focus during drill-down.
- **Lead Oversight Actions:** Supports recording `Mark Reviewed`, `Flag for Attention`, explicit `Lead Endorsed Readiness`, and string-based text notes injected down into localized environments.
- **Dynamic Bubble-up:** Lead oversight directly intercepts the baseline Case Officer state machine. Flagging a localized issue automatically shifts the master case dashboard to Red/Blocked.

*(If you ever get stuck, just press the red **Reset Journey State** button at the top!)*
