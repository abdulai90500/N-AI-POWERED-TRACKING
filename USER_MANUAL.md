# BeverageTrack AI — Comprehensive System User Manual & Operational Guide

> **Project Title:** *Design and Development of an AI-Powered Tracking Information System for Enhancing Quality Control and Distribution in Beverage Bottling Companies in Freetown, Sierra Leone.*  
> **Target Facility:** Kissy Industrial Estate, Freetown, Sierra Leone  
> **Compliance Standard:** Sierra Leone Standards Bureau (SLSB-CS-022)  
> **Version:** 2.1.0-Production  
> **System Access:** [https://n-ai-powered-tracking.vercel.app](https://n-ai-powered-tracking.vercel.app/)

---

## Table of Contents
1. [System Overview & Architecture](#1-system-overview--architecture)
2. [Login & Authentication Guide](#2-login--authentication-guide)
3. [Master User Credentials Directory](#3-master-user-credentials-directory)
4. [Step-by-Step Operator Manual by Role](#4-step-by-step-operator-manual-by-role)
   - [Phase 1: Water Intake & Treatment](#phase-1-water-intake--treatment-samuel-koroma)
   - [Phase 2: Production & Batch Registration](#phase-2-production--batch-registration-ibrahim-kamara)
   - [Phase 3: Quality Control & AI Copilot](#phase-3-quality-control--ai-copilot-fatmata-bangura)
   - [Phase 4: AI Quality Intelligence Hub](#phase-4-ai-quality-intelligence-hub)
   - [Phase 5: Warehouse & Inventory Control](#phase-5-warehouse--inventory-control-mohamed-turay)
   - [Phase 6: Fleet Distribution & Logistics](#phase-6-fleet-distribution--logistics-alhaji-conteh)
   - [Phase 7: Administrative Governance & Batch Abort](#phase-7-administrative-governance--batch-abort-umu-shaw--team)
   - [Phase 8: Consumer & Retail QR Verification](#phase-8-consumer--retail-qr-verification)
5. [Special System Features](#5-special-system-features)
   - [AI Audio Voice Assistant (Salone Krio & English)](#ai-audio-voice-assistant-salone-krio--english)
   - [Account Settings & Password Change](#account-settings--password-change)
   - [Factory Process Steps Walkthrough](#factory-process-steps-walkthrough)
6. [Troubleshooting & Emergency Quality Protocols](#6-troubleshooting--emergency-quality-protocols)

---

## 1. System Overview & Architecture

**BeverageTrack AI** is an industrial IoT and artificial intelligence information system engineered to digitize beverage manufacturing, eliminate counterfeit products, and optimize distribution in Sierra Leone. 

```
[Raw Water Treatment (Kissy Intake)] ──▶ [Preform Blow Molding (Line 1/2)] ──▶ [Sterile Filling & Capping (500ml/1.8Nm)]
                                                                                             │
[Consumer Scan Verification] ◀── [Fleet Dispatch (Freetown, Bo)] ◀── [Warehouse Ingestion] ◀── [AI Sensor QC & QR Passport]
```

### Key Performance Targets:
- **Traceability Latency:** Instantaneous batch history lookup (< 3 seconds via QR scan) vs. 45-minute manual paper logbooks.
- **Inline Anomaly Detection:** Real-time machine learning inference (< 5ms) on multi-sensor streams.
- **Food Safety Gatekeeping:** Automated quarantine locks preventing non-compliant batches from being released for warehouse intake.
- **National Regulatory Oversight:** One-click compliance audit generation for Sierra Leone Standards Bureau (SLSB) inspectors.

---

## 2. Login & Authentication Guide

Access the platform at `https://n-ai-powered-tracking.vercel.app` using any desktop, factory tablet, or mobile browser.

### The Side-by-Side Login Screen
The login screen features a split layout:
- **Left Column:** Dual-mode authentication card.
- **Right Column:** Animated AI Computer Vision bottle inspection telemetry display (showing active laser sweeps, optical fill levels, and cap torque).

### 3 Methods to Authenticate:
1. **Manual Email & Password:**  
   Enter your staff work email and password (`Password123!`), then click **"Sign in to BeverageTrack AI"**.
2. **1-Click Quick Autofill:**  
   Tap any of the role badges above the form (`👑 Admin`, `🔬 QC Lead`, `🏭 Production`, `📦 Warehouse`, `🚚 Fleet Driver`, `🌐 Super Admin`). The system fills the credentials instantly.
3. **Staff ID Badge Scan (Contactless):**  
   Click the **"Scan Badge to Login"** tab and tap your digital ID badge card (e.g. *Umu Shaw & Team — STAFF-ADMIN-001*). The system authenticates your role in 300ms.

---

## 3. Master User Credentials Directory

> [!IMPORTANT]
> All pre-configured demo and testing accounts use the universal dissertation password: **`UmuShawTeam2026!`** (or `Password123!`).

| Staff Member | Assigned Role | Work Email Address | Staff Badge ID | Department & Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Umu Shaw & Team** | **Company Administrator & Dissertation Lead** *(Default)* | `admin@sierrasprings.sl` | `STAFF-ADMIN-001` | Executive governance, staff roster, batch aborts, SLSB oversight |
| **Fatmata Bangura** | **Quality Control Lead** | `quality@sierrasprings.sl` | `STAFF-QC-002` | Laboratory inspections, recording pH/volume/torque, batch release |
| **Ibrahim Kamara** | **Production Manager** | `production@sierrasprings.sl` | `STAFF-PROD-003` | Factory floor oversight, batch registration, Line 1 & 2 bottling |
| **Mohamed Turay** | **Warehouse Manager** | `warehouse@sierrasprings.sl` | `STAFF-WH-004` | Kissy Central Depot and Lumley hub inventory receipts & dispatch |
| **Alhaji Conteh** | **Distribution Officer** | `distribution@sierrasprings.sl` | `STAFF-DIST-005` | Fleet driver logistics, wholesale delivery verification |
| **Dr. Alpha Bah** | **Super Administrator** | `superadmin@beveragetrack.sl` | `STAFF-GLOBAL-000` | Multi-tenant authority, database audits, national regulatory oversight |

---

## 4. Step-by-Step Operator Manual by Role

### Phase 1: Water Intake & Treatment (Samuel Koroma)
* **Goal:** Extract and purify raw spring water to baseline drinking specifications.
* **Location:** Kissy Plant Borehole Pumps & RO Silos.
* **Standard Operating Procedure:**
  1. Inspect borehole intake pressure gauges (maintain 4.2 – 5.0 bar).
  2. Activate filtration sequence: Quartz sand media ➔ Activated carbon bed ➔ 5-micron pre-filter ➔ Dual-pass Reverse Osmosis membranes.
  3. Engage inline Ultraviolet (UV) germicidal sterilization lamps.
  4. Verify that finished water conductivity is < 50 µS/cm and baseline pH is between **6.95 and 7.15**.
  5. Fill Silo Tank 01 and confirm release to the bottling manifold.

---

### Phase 2: Production & Batch Registration (Ibrahim Kamara)
* **Goal:** Schedule line bottling, blow preforms into bottles, and serialize the batch.
* **Software Module:** `Production` tab.
* **Standard Operating Procedure:**
  1. Log in as `production@sierrasprings.sl`.
  2. Click the blue **"Register New Batch"** button.
  3. Fill the registration dialog:
     - **Product Line:** Choose *Sierra Pure Water 500ml*, *Lion Ginger Malt 330ml*, or *Salone Cola 500ml*.
     - **Production Line:** Select *High-Speed Line 01 (Bottling)* or *Line 02*.
     - **Planned Quantity:** Enter target bottle run (e.g. `25000`).
     - **Shift Supervisor:** Enter your name.
  4. Click **"Confirm & Initialize Batch"**. The system generates a sequential batch code (e.g., `BTL-2026-005`) and sets initial status to `pending_quality`.
  5. Power on infrared preform heating ovens (120°C) and 35-bar blow molders. Bottles form and pass into the sterile isobaric filling carousel (500ml) and capping chuck (1.8 Nm torque).

---

### Phase 3: Quality Control & AI Copilot (Fatmata Bangura)
* **Goal:** Conduct laboratory tests on sample bottles and execute AI-assisted batch release.
* **Software Module:** `Quality Control` tab.
* **Standard Operating Procedure:**
  1. Log in as `quality@sierrasprings.sl`.
  2. Pull a mandatory 24-bottle sample pull after the first 10 minutes of production.
  3. Click **"Conduct New Inspection"** in the Quality Control view.
  4. Select the active batch number from the dropdown.
  5. Enter physical test measurements:
     - **pH Level:** Enter calibrated reading (e.g. `7.05`).
     - **Filling Volume:** Enter measured fill in milliliters (e.g. `500.2`).
     - **Cap Torque:** Enter closure tension in Nm (e.g. `1.85`).
     - **Visual Defects:** Enter defective bottle count (e.g. `0`).
     - **Inspector Remarks:** Enter routine compliance notes.
  6. **Observe the Real-Time AI Quality Copilot:**
     - **Green Banner (Optimal):** Values match historical envelopes; batch is certified safe.
     - **Red/Amber Banner (Warning):** Anomaly detected (e.g. pH > 7.6 or volume < 495ml). Root-cause diagnostics display immediately.
  7. Click **"Submit Quality Inspection"**.
  8. If safe, click **"Release Batch"** in the table row. The system unlocks warehouse intake and activates laser marking of the cryptographic SLSB QR code.

---

### Phase 4: AI Quality Intelligence Hub
* **Goal:** Test multivariate machine learning models and explore predictive quality scenarios.
* **Software Module:** `AI Quality Hub` tab.
* **Operating Instructions:**
  - **Interactive Anomaly Simulator:** Adjust sliders for pH (2.0 – 10.0), Fill Volume (475 – 525 ml), and Cap Torque (0.5 – 3.5 Nm). The **Isolation Forest** engine runs live inference in < 5ms.
  - **1-Click Test Scenarios:**
    - *Optimal Water:* Resets parameters to nominal baseline (pH 7.05, 500.2ml).
    - *CIP Rinse Leak:* Simulates alkaline wash chemical ingress (pH 8.42, high risk).
    - *Loose Cap Seal:* Simulates cap chuck under-torque (0.85 Nm, leakage risk).
  - **Failure Probability Gauge:** Displays Random Forest supervised risk percentage (0% to 100%) and feature importance weights.

---

### Phase 5: Warehouse & Inventory Control (Mohamed Turay)
* **Goal:** Ingest finished pallets, manage storage bay capacity, and track FIFO stock movements.
* **Software Module:** `Inventory` tab.
* **Standard Operating Procedure:**
  1. Log in as `warehouse@sierrasprings.sl`.
  2. Finished cases (18 bottles/carton) arrive stretch-wrapped on wooden pallets.
  3. Click **"Receive Stock"**:
     - Choose target depot: *Kissy Central Distribution Warehouse* or *Lumley Depot*.
     - Select approved batch code and input quantity (e.g. `25000` bottles).
  4. The system logs an immutable `STOCK_IN` transaction and updates warehouse occupancy gauges.

---

### Phase 6: Fleet Distribution & Logistics (Alhaji Conteh)
* **Goal:** Fulfill wholesale distributor purchase orders and dispatch commercial delivery vehicles.
* **Software Module:** `Distribution` tab.
* **Standard Operating Procedure:**
  1. Log in as `distribution@sierrasprings.sl`.
  2. View pending orders under **"Active Wholesale Orders"**.
  3. Click **"Dispatch Order"**:
     - Assign fleet vehicle (e.g. *Mercedes-Benz Atego 1518 — SL-AA-4892*).
     - Enter driver name and contact number.
     - Select delivery destination route (e.g. *Choithram Supermarket, Freetown* or *Bo Highway Depot*).
  4. Click **"Confirm Fleet Dispatch"**. The order transitions to `in_transit`, and finished goods are deducted from warehouse stock.
  5. When the driver arrives and receives sign-off, click **"Mark Delivered"** to record digital proof-of-delivery.

---

### Phase 7: Administrative Governance & Batch Abort (Umu Shaw & Team)
* **Goal:** Supervise staff users, monitor open incidents, and execute emergency recalls.
* **Software Module:** `Admin Console` tab.
* **Operating Instructions:**
  - **Add New Staff User:** Click **"Add New Staff User"**, enter full name, work email, temporary password, role, and department. The system auto-generates a staff badge ID.
  - **Delete / Revoke User:** Click the trash icon next to any employee row to terminate system access.
  - **Emergency Batch Abort:** If a batch fails chemical assays or customer complaints occur, find the batch in the **Case Monitor** table and click **"Abort Batch"**. Enter the official reason. The system flags the batch as `ABORTED / RECALLED`, locking warehouse transfer and triggering an alert on consumer QR scans.

---

### Phase 8: Consumer & Retail QR Verification
* **Goal:** Enable shoppers and health inspectors to verify authentic Sierra Leone beverages.
* **Access Point:** Any smartphone camera or the **"Consumer Scan"** button.
* **Operating Instructions:**
  1. Point smartphone camera at the QR code etched on the bottle.
  2. The mobile browser opens the **SLSB National Verification Portal**.
  3. Displays:
     - **SLSB Certification Badge:** Green checkmark confirming certified authentic beverage.
     - **Laboratory Telemetry:** Tested pH and filling volume.
     - **Production Details:** Manufacturing timestamp, expiration date, and Kissy facility origin.

---

## 5. Special System Features

### AI Audio Voice Assistant (Salone Krio & English)
Located in the top navigation header as **`[ 🇸🇱 Krio Voice ]`**:
- **Listen to Page Summary:** Click **`[ 🇸🇱 Krio Voice ]`** on any view to hear an executive audio overview spoken in Sierra Leone Krio or English.
- **Switch Languages:** Click the **`Krio` / `Eng`** toggle pill.
- **Hover-to-Read Mode:** Click the **`✨`** options button and toggle **"Touch Button Mek E Talk"** to **ON**. Moving your cursor over any button or table cell reads its function aloud.
- **Stop / Mute:** Click **`[ ◼ Stop Voice ]`** at any time.

### Account Settings & Password Change
Click the **`⚙️` (Settings)** icon in the header or in the sidebar user card:
- **Edit Profile:** Update your full name, work email, contact phone number, and view your badge ID.
- **Change Password:** Enter current password (`Password123!`), specify a new password (min. 6 characters), and confirm to save.

### Factory Process Steps Walkthrough
Click the **`[ 🏭 Process Steps 1-8 ]`** button in the header or sidebar:
- Opens an interactive visual journey explaining the complete transformation of borehole water into consumer-certified bottles across all 8 factory stages.

---

## 6. Troubleshooting & Emergency Quality Protocols

| Scenario | Symptom / Error | Immediate Action |
| :--- | :--- | :--- |
| **Alkaline pH Drift** | AI flags pH > 8.0 with critical warning | Do not authorize release. Halt Line 1 filling manifold. Inspect Clean-in-Place (CIP) caustic rinse valve seals and conduct titration re-test. |
| **Volumetric Underfill** | Optical cameras detect fill height < 495ml | Check manifold counter-pressure air supply (must be ≥ 6 bar). Inspect filling valves for nozzle scaling. |
| **Cap Hermeticity Failure** | Cap torque reads < 1.4 Nm | Stop capping chuck. Recalibrate magnetic torque chuck clutch to 1.8 Nm (21.5 in-lb). Reject affected bottles. |
| **Consumer Recall Alert** | Quarantined bottle scanned in public | System displays red **"Quality Quarantine Alert"** warning consumer not to consume. Admin investigates batch history in QR Traceability tab. |

---

*BeverageTrack AI — Sierra Springs & Beverages Ltd • Kissy Industrial Estate, Freetown, Sierra Leone.*
