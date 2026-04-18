# DESNZ Case Management Prototypes

This repository contains stateful, clickable HTML prototypes for the DESNZ Salesforce implementation. These are purely front-end prototypes that demonstrate workflow, UX, and cross-screen state without needing a real backend.

---

## 1. CPO Journey 1 — Case Officer Workflow 

**File:** `DESNZ_CPO_Journey1_Prototype.html`

This prototype wires the base Salesforce wireframes into a connected, stateful flow for a CPO Case Officer managing a case from initial Validation through to Decision and Closure. (See file directly, open in browser).

---

## 2. DCO Environmental Case Manager, Lead & Coordinator Journey 

**Location:** Inside the `/prototype` folder (Node.js/Express app).

This updated prototype implements the comprehensive **Environmental Case Journeys** for three interoperating Personas:
1. **Case Manager:** Reviewing evidence, making consultation adequacy judgments, resolving issues, and contributing text drafting.
2. **Team Leader:** Surfacing aggregated risk at the Portfolio Dashboard level, drilling down contextually, attaching string-based leadership notes, and flagging/endorsing issues natively.
3. **Support Coordinator (Admin):** Processing metadata and recording extensions across key records to unblock the Case Manager.

### How to Run:
```bash
cd prototype
npm install
npm start
```
Then navigate to `http://localhost:3000` in your browser.

### How to Demo the Flow (Coordinator UX - Happy Path):
**Initial state:** Case is waiting on Environmental admin tasks & clearance.

1. Start at the **Shared / Cross-Team -> DCO Case Workspace**. Observe the high-level overview. Notice the new "Admin/Coord Tasks" KPI reads explicitly "2 Open", and a specific actionable checklist sits on the Dashboard ("Process NE Consultation Admin Data", "Verify Document Metadata").
2. Click through to the **Tasks & Actions** page from the sidebar. You will see the Coordinator's open tasks. 
3. Click **"Open Document ->"**. Inside the Docs & Evidence viewer, at the bottom is a new Support Coordinator Admin Panel. Click **"Confirm Metadata Complete"**.
4. Click **"Back to Case"** at the top left. The first task is checked off! Now click through the remaining Consultation action item.
5. In the **Consultation Tracker**, look at the blue **Support Coordinator Admin Panel**. You can modify the Due Date calendar input or toggle the "Yes, Extended" checkbox which dynamically saves to the case.
6. Click **"Confirm Admin Metadata Complete"**.
7. Navigate back to **Tasks & Actions**. Look! *✓ All environmental coordination tasks are complete!* 
8. Navigate to **Environmental Team -> Env Readiness**. Note the new "Coordination & Admin Checklist" is now checked green. If you subsequently perform the "Case Manager" duties (Marking Evidence, Validating Adequacy, Submitting Drafts), the env clearance drops completely!

### What State Changes are Supported (Coordinator additions):
- **Dynamic Task Lists:** Tasks exist independently but roll-up cleanly to the root Case workspace when unfulfilled.
- **Micro-interactions:** Custom Date/Extension tracking parameters cleanly mapped across to states.
- **Admin Lockouts:** Case Managers definitively *cannot* "Resolve" their Environmental Issues until the Support Coordinator has verified the underlying Consultation metadata and Document storage indexing, proving rigid role-protection.

*(If you ever get stuck, just press the red **Reset Journey State** button at the top!)*
