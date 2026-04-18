# DESNZ Case Management Prototypes

This repository contains stateful, clickable HTML prototypes for the DESNZ Salesforce implementation. These are purely front-end prototypes that demonstrate workflow, UX, and cross-screen state without needing a real backend.

---

## 1. CPO Journey 1 — Case Officer Workflow 

**File:** `DESNZ_CPO_Journey1_Prototype.html`

This prototype wires the base Salesforce wireframes into a connected, stateful flow for a CPO Case Officer managing a case from initial Validation through to Decision and Closure. (See file directly, open in browser).

---

## 2. DCO Multi-Disciplinary Case Management Journey

**Location:** Inside the `/prototype` folder (Node.js/Express app).

This updated prototype implements heavily-interlinked **DCO Cross-Functional Journeys** mapping a massive eight-persona network that collectively forms the overarching case pipeline:

1. **Case Manager:** Reviewing evidence, making consultation adequacy judgments, resolving issues, and contributing text drafting.
2. **Team Leader:** Surfacing aggregated risk at the Portfolio Dashboard level, drilling down contextually, attaching string-based leadership notes, and flagging/endorsing issues natively.
3. **Support Coordinator (Admin):** Processing metadata and recording extensions across key records to unblock the Case Manager.
4. **Planning Orchestrator:** The case aggregator—monitoring the Pack components, confirming readiness, monitoring cross-team clearances, and initiating the final Executive Decision publishing workflow.
5. **Legal Reviewer:** Evaluating Draft Orders (Statutory Instruments), acknowledging Submission Packs from a compliance perspective, and granting discrete Legal Certification required for final Master Clearance.
6. **Decision Support Coordinator:** The checkpoint officer who evaluates physical pack compilation structure and oversees the distribution logic of the final Case outputs.
7. **Admin / Archive Support:** The definitive terminus node. This user sweeps the application verifying Metadata storage, auditing the Publication transmission paths, and permanently locking the Case into read-only History status.
8. **Portfolio Oversight / Executive:** The high-level monitor traversing horizontally across everything above. This user utilizes filters and MI dashboards to flag systemic bottlenecks, attaching Director-level Executive overrides that cascade down into the operational silos beneath them.

### How to Run:
```bash
cd prototype
npm install
npm start
```
Then navigate to `http://localhost:3000` in your browser.

### How to Demo the Flow (Portfolio Oversight UX - Happy Path):
**Initial state:** Active cases are populating. The DCO-2026-012 case is structurally underway.

1. Start at the **Shared / Cross-Team -> Portfolio Dash** (or the new **Leadership -> Master Portfolio** route). Check out the aggregate KPIs displaying `38 Active Cases`. Click **"Deep Dive: Senior Oversight ->"**.
2. From the `Senior Oversight Dashboard`, the executive interacts with the `Portfolio Risk Filters`. 
   - Click `🔴 High Risk / Blocked`. Our active test case `DCO-2026-012` natively appears here mathematically because the 'Master Clearance' module has not yet successfully resolved. 
3. Click into `DCO-2026-012` from the filter table. 
4. Inside the main `DCO Case Workspace`, a new orange `Executive Oversight & Intervention Logs` panel dominates the top of the interface. 
   - Click **"Red Flag Case"**. 
   - Observe the `Overall State` field instantly snap to a hostile Red override, denoting that Executive presence actively supersedes localized algorithmic metrics (such as Env/Legal individual status tags which might be Green).
5. Click the top-right local Return button to drop back to the `Senior Dashboard`. Note that your case table re-evaluates the mathematical flag logic, confirming that `DCO-2026-012` is locked into the 'escalated' bucket.
6. Finally, click `"Deep Dive: Reporting & MI ->"`. Here, the Executive breaks away from individualized application tracing, reviewing the overall pipeline structure (`12.4 mo Average App Cycle Time`, `Sub Pack Completion Rates`, and constraints pointing to an overloaded Habitats processing team). 

*(If you ever get stuck, just press the red **Reset Journey State** button at the top!)*
