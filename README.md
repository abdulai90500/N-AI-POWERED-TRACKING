# BeverageTrack AI
## AI-Powered Tracking Information System for Beverage Bottling Companies in Freetown, Sierra Leone

> **Project Title:** *Design and Development of an AI-Powered Tracking Information System for Enhancing Quality Control and Distribution in Beverage Bottling Companies in Freetown, Sierra Leone.*

---

## 1. Executive Summary

**BeverageTrack AI** is a full-stack, enterprise-grade, multi-tenant digital tracking and quality assurance information system built specifically to modernize beverage manufacturing in Freetown, Sierra Leone. The platform unifies **production registration, laboratory quality inspection, AI-driven anomaly and risk detection, inventory management, batch-level QR code traceability, and distribution fulfillment** into a single software platform.

### Core Research & Operational Objectives
1. **Digitize Manufacturing Operations:** Replace manual paper inspection logs and physical manifests with real-time digital batch records.
2. **End-to-End Batch Traceability:** Connect raw bottling lines to retail distributors with unique, tamper-proof QR code passports.
3. **AI Quality Anomaly Detection:** Leverage **Isolation Forest** algorithms to automatically catch sensor and parameter deviations (pH spikes, filling volume errors, cap seal hermeticity).
4. **Predictive Failure Modeling:** Employ **Random Forest** supervised classification to calculate batch failure risk percentages (0%–100%) prior to official release.
5. **Strict Release Gatekeeping:** Enforce regulatory food-safety standards—no batch enters saleable warehouse inventory until certified by authorized Quality Control officers.
6. **Multi-Tenant Factory Isolation:** Support distinct bottling enterprises (e.g., *Sierra Springs & Beverages Ltd*, *Lion Soft Drinks Co.*) with total logical data isolation.

---

## 2. System Architecture & Technology Stack

| Layer | Technology | Operational Role |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Lucide Icons | Responsive manufacturing dashboard optimized for factory tablets and mobile browsers |
| **Backend** | Python 3.11+ / FastAPI | High-performance asynchronous REST API (`/api/v1`) |
| **Database** | PostgreSQL 17 / SQLite | ACID relational data model across 18 core entity tables |
| **ORM & Engine** | SQLAlchemy 2.0 | Entity relationship mapping and transactional integrity |
| **AI / Machine Learning** | Scikit-Learn (Isolation Forest & Random Forest) | Multivariate anomaly detection and quality failure risk scoring |
| **Batch Traceability** | Python `qrcode` + Cryptographic UUID tokens | Internal full lifecycle audit trail & consumer public authenticity verification |
| **Security & Auth** | PyJWT + Passlib (PBKDF2-SHA256 & Argon2) | Role-based access control (RBAC) across 6 operational factory personas |
| **Deployment** | Docker & Docker Compose | Containerized orchestration of PostgreSQL, Backend API, and Frontend |

---

## 3. The 6 Factory User Personas & Demo Accounts

All demo accounts use the standard password: `Password123!`

| Role | Demo Email | Core Responsibilities |
| :--- | :--- | :--- |
| **Company Administrator** | `admin@sierrasprings.sl` | Factory settings, staff accounts, company profile, audit logs |
| **Production Manager** | `production@sierrasprings.sl` | Line scheduling, batch registration, auto-numbering, rejections |
| **Quality Control Officer** | `quality@sierrasprings.sl` | Sensor logs, parameter testing, AI scan review, batch release / rejection |
| **Warehouse Manager** | `warehouse@sierrasprings.sl` | Stock receipts, bay storage, transfers, low-stock monitoring |
| **Distribution Officer** | `distribution@sierrasprings.sl` | Distributor orders, vehicle fleet dispatch, driver logs, delivery proof |
| **Super Administrator** | `superadmin@beveragetrack.sl` | Multi-company tenant onboarding, platform oversight |
| *Tenant 2 Admin (Test)* | `admin@lionsoftdrinks.sl` | Demonstrates multi-tenant isolation (*Lion Soft Drinks Co.*) |

---

## 4. Key Functional Modules

### 1. Production Management
- Auto-generates standardized sequential batch numbers (e.g., `BTL-2026-001`, `BTL-2026-002`).
- Logs production quantities, line rejections, production dates, and expiry dates.
- Automatically generates a unique cryptographic QR token linked to each batch upon creation.

### 2. Quality Control & Release Gatekeeping
- Configurable parameter limits per product category (Bottled Water, Carbonated Soft Drink, Malt, Fruit Juice).
- Monitored variables: **pH Level, Filling Volume (ml), Cap Torque (Nm), Turbidity (NTU), Visual Defects**.
- **Batch Release Gate:** Batches strictly remain in `pending_quality` or `inspecting` status until an authorized QC officer authorizes release. Only approved batches can enter saleable warehouse inventory.

### 3. AI Quality Hub
- **Isolation Forest Multivariate Anomaly Detector:** Flags unusual drifts in pH and volume tolerances before product packaging is complete.
- **Random Forest Failure Risk Estimator:** Estimates failure probability (0% to 100%) and categorizes risk into *Routine Inspection, Moderate Caution, Priority Inspection,* or *Immediate Quarantine*.
- Model diagnostic explanations with feature contribution breakdown.

### 4. Inventory & Multi-Warehouse Tracking
- Real-time stock visibility across **Kissy Central Plant Warehouse** and **Lumley West Distribution Hub**.
- Inventory movements recorded as immutable transactions (`STOCK_IN`, `DISPATCH`, `TRANSFER`, `RETURN`).
- Automated low-stock alerts when finished goods fall below 2,000 bottles.

### 5. Distribution & Fleet Logistics
- Customer and wholesale distributor directory across Greater Freetown, Bo, Kenema, and Makeni.
- Delivery lifecycle tracking: `Pending` → `Dispatched` → `In Transit` → `Delivered`.
- Assigns drivers, phone numbers, and vehicle registration numbers (e.g., `SL-AA-4892`).
- Automatic inventory dispatch deduction upon vehicle loading.

### 6. Dual-View QR Traceability
1. **Internal Factory Traceability Timeline:** 5-stage chronological audit trail (Production Line → Laboratory QC → AI Risk Assessment → Warehouse Ingestion → Fleet Delivery).
2. **Public Consumer Verification Portal:** Clean, mobile-first view accessed when scanning a bottle in a shop, showing product name, bottling company, manufacturing date, expiry date, and official safety certification without revealing proprietary factory costs.

---

## 5. How to Run the Application

### Option A: Quick Local Run (Windows 11 / PowerShell)

1. Open PowerShell in the project directory:
   ```powershell
   cd c:\Users\hp\Desktop\aitracking
   ```

2. Run the automated starter script:
   ```powershell
   .\run_dev.ps1
   ```
   *(Or double-click `run_dev.bat`)*

3. Access the services:
   - **Frontend UI:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:8000](http://localhost:8000)
   - **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option B: Docker Compose Deployment

1. Ensure Docker Desktop is running.
2. In PowerShell or Command Prompt, run:
   ```bash
   docker compose up --build
   ```
3. Docker Compose will automatically start:
   - PostgreSQL 17 on `localhost:5432`
   - FastAPI Backend on `localhost:8000`
   - Next.js / React Frontend on `localhost:3000`

---

## 6. Research Performance Targets & Indicators

| Evaluation Indicator | Manual Paper Log Benchmark | BeverageTrack AI Target |
| :--- | :--- | :--- |
| **Batch Traceability Time** | 35 – 60 minutes searching paper books | **< 3 seconds** via QR token lookup |
| **Quality Anomaly Detection** | Manual delayed discovery at end of shift | **Real-time inline inference** (< 8ms) |
| **Inventory Variance** | Discrepancies due to untracked breakage | **100% audit ledger** with movement types |
| **Data Isolation** | Paper manifests shared or lost | **Row-Level Tenant Isolation** (Zero cross-access) |
| **Regulatory Compliance** | Slow verification during SLSB audits | **Instant 1-click printable PDF/CSV report** |

---

*BeverageTrack AI — Freetown, Sierra Leone.*
