# SUBIDHA — Essential Personal Concierge & Business Logistics Platform

[![Built with Expo](https://img.shields.io/badge/Built%20with-Expo%20%26%20React%20Native%20Web-0C831F?style=flat-square&logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-2563EB?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20iOS%20%7C%20Android-0F172A?style=flat-square)]()

**SUBIDHA** is a unified, subscription-based platform bridging **B2C Personal Assistance & Elder/Tourist Concierge Services** with **B2B Local Merchant Logistics & Fleet Dispatch**. Built with **React Native, Expo Router, and TypeScript (`.tsx`)**, the frontend adapts seamlessly between a widescreen desktop web experience and a native-style mobile app interface.

> **Live Demo (`github.io`):** `https://<your-username>.github.io/subidha/`  
> **Full Technical Documentation:** See [`documentation.md`](./documentation.md) for complete architecture, data models, user flows, and Django REST API contracts.

---

## Key Features

- **Adaptive Desktop & Mobile UI:** Full-width Blinkit-inspired web layout on desktop (`>= 900px`) that automatically transforms into a mobile app shell with a 4-icon bottom navigation grid (`Home`, `Tasks`, `Bills`, `Profile`), slide-out drawer, and smart app banner on mobile screens (`< 900px`).
- **Two Strictly Separated Portals:**
  - **Customer / Individual Portal (B2C):** Personal escort booking, non-clinical medical checkup accompaniment, pick & drop errands, live agent radar preview, itemized store receipt approval (`$0.00 / ₹0.00` subscriber platform fee), and a 1-tap Emergency SOS workflow.
  - **Business / Partner Console (B2B):** Merchant operations dashboard, active fleet metrics, single & batch CSV task dispatch, cargo attributes, and multi-agent fleet tracking.
- **Role-Guarded Mobile Authentication:** `+91` Indian mobile number lookup, an unregistered-number detection modal with role-preserved registration prefill, and a **6-Box Segmented OTP Input** with brute-force/DoS attempt rate-limiting.
- **Location Permission Bottom Sheet:** Industry-standard (Rapido / Blinkit style) post-login GPS permission prompt with manual address fallback.
- **Light & Dark Theme System:** Defaults to a high-contrast white & pastel light theme with 1-click switching to the dark theme.

---

## Demo Credentials (Local & Public Preview)

| Portal Role | Registered Mobile (`+91`) | Account Holder | Demo 6-Box OTP |
| :--- | :--- | :--- | :--- |
| **Customer (B2C)** | `9876543210` | Aarav Sen | `123456` |
| **Business Partner (B2B)** | `9876501234` | Calcutta Apothecary & Co. | `123456` |
| **Unregistered Flow Test** | Any other 10-digit number (e.g., `9123456789`) | *Triggers Unregistered Modal* | `123456` *(after signup)* |

---

## Quick Start

### 1. Clone & Install
```bash
git clone [https://github.com/](https://github.com/)<your-username>/subidha.git
cd subidha
npm install