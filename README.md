# Groverlaw - Modern Legal Website

A modern, responsive, high-performance website for **Groverlaw (Advocates & Solicitors)**, meticulously crafted from the original firm website (`https://groverlaw.in/`).

---

## 🏛️ Firm Overview Preserved & Reimagined

- **Leadership**: Led by **Vikram Grover**, dual-qualified lawyer enrolled as an **Advocate in India (1996)** and admitted on the **Roll of Solicitors in England & Wales (2002)**.
- **Offices**:
  - **Delhi Chamber**: H 36 Green Park Extension, New Delhi 110016, India
  - **Gurgaon Office**: A 592 Sushant Lok – I, Gurgaon, NCR Haryana 122009, India
- **Contact Channels**:
  - Telephone: `+91-124-4145520`
  - Fax: `+91-124-4145521`
  - Inquiries: `info@groverlaw.in`
  - Recruitment: `recruitment@groverlaw.in`
- **Affiliations & Memberships**: INTA (International Trademark Association), APAA (Asian Patent Attorneys Association), ECTA (European Communities Trade Mark Association), IPAA, INBA, and High Court Bar Associations.
- **Accolades & Recognition**:
  - **WTR 1000** (World Trademark Review): 2017, 2018, 2019, 2020, 2021 — Vikram Grover recommended as an expert in IP Enforcement and Litigation.
  - **IAM Patent 1000**: Recommended for Patent Prosecution.
  - **WIPR Leaders 2020**: Leading IP Practitioner.
  - **IP Stars Handbook** & Academic Publications (*Plant Varieties & Farmers' Rights: A Balancing Act*).

---

## ✨ Features & Architecture

1. **Bar Council of India Regulatory Disclaimer Modal**:
   - Built in compliance with Bar Council of India Rule 36 prohibiting solicitation and advertisement.
   - Interactive acknowledgement with `localStorage` memory and footer review trigger.
2. **Modern Luxury Legal Design**:
   - Executive dark navy (`#081225`) and warm gold/amber accents matching Groverlaw’s identity.
   - Crisp serif headlines (`Cinzel` & `Playfair Display`) paired with clean readable body copy (`Plus Jakarta Sans`).
   - Glassmorphic navigation bar with mobile responsive drawer.
3. **Comprehensive Practice Coverage**:
   - **Intellectual Property**: Patents (PCT, CRI Section 3(k) guidelines, Form 27 working statements, compulsory licensing, oppositions), Trademarks (TM-A, Madrid Protocol, well-known marks, non-traditional marks), Industrial Designs (Kolkata Design Wing, Locarno classification), Copyright, Domain Name Disputes (INDRP under NIXI, UDRP), Enforcement & Anti-Counterfeiting (Anton Piller search & seizure orders, interim injunctions, police raids), Border Controls & Customs Recordal (Imported Goods Enforcement Rules 2007/2018, parallel imports & exhaustion of rights).
   - **Corporate & Commercial**: Foreign Direct Investment (FDI Automatic & Approval route via FIFP, FEMA compliance), Company Incorporation under the Companies Act 2013 (Private/Public Limited, LLPs under 2008 Act, DIN/DSC, ROC filings), Technology Transfer & Licensing, Franchising & Distribution agreements, Commercial Dispute Resolution & mandatory pre-institution mediation under the Commercial Courts Act, 2015.
4. **Interactive Google Maps**: Real embed frames for both Delhi Chamber and Gurgaon Office.
5. **Official Legal Directory**: Categorized quick links to IP India, Trade Marks Registry, Copyright Office, Designs Wing Kolkata, SICLDR, PPV&FR Authority, Supreme Court of India, and Delhi High Court.
6. **Zero-Dependency Local Preview Server**: Includes `server.js` using native Node.js.

---

## 🛡️ Security Hardening & Defense-in-Depth Implementation

The website has been comprehensively hardened following enterprise DevSecOps and OWASP standards across every tier:

### 1. HTTP Security Headers (Grade A+ Configuration)
- **Content-Security-Policy (CSP)**: Restricts script, style, and font execution exclusively to `'self'` and authorized CDNs (Tailwind, Google Fonts). Blocks dangerous plugins (`object-src 'none'`) and frame hijacking (`frame-ancestors 'self'`).
- **Strict-Transport-Security (HSTS)**: Set to `max-age=63072000; includeSubDomains; preload` (2 years) enforcing HTTPS everywhere.
- **X-Content-Type-Options**: `nosniff` prevents MIME-type confusion attacks.
- **X-Frame-Options**: `SAMEORIGIN` to eliminate clickjacking risks.
- **X-XSS-Protection**: `1; mode=block` enables browser XSS filtering.
- **Referrer-Policy**: `strict-origin-when-cross-origin` to prevent data and query leakage.
- **Permissions-Policy**: Restricts access to sensitive browser features (`camera=(), microphone=(), geolocation=(), payment=()`).
- **Cross-Origin Protections**: `Cross-Origin-Opener-Policy: same-origin-allow-popups` and `Cross-Origin-Resource-Policy: same-origin`.
- **Banner Masking**: Stripped `X-Powered-By` header to prevent server technology fingerprinting.

### 2. Application-Level Defenses
- **Anti-CSRF Verification**: Cryptographically secure tokens (`crypto.randomBytes`) generated via `GET /api/csrf-token` and required for inquiry processing.
- **Rate Limiting**: Sliding window rate limiter (max 5 submissions per 10 minutes per IP) to mitigate form spam, credential stuffing, and DoS.
- **Honeypot Anti-Bot Field**: Hidden decoy field (`website_fax_confirm`) silently drops automated bot submissions.
- **Strict Input Validation & Output Encoding**: RFC-5322 email regex, whitelist validation on practice areas, length constraints, and HTML entity sanitization (`sanitizeHtml`) preventing Stored and Reflected XSS.
- **DoS Payload Limits**: Strict 15KB request body cap rejecting oversized payloads (`HTTP 413`).
- **Path Traversal Shield**: Canonical path resolution strictly confining file access to the workspace root.
- **Safe Error Handling**: Generic user-facing errors with zero exposure of stack traces, internal paths, or environment data.

### 3. Standards & Server Deployment Templates
- **RFC 9116 Vulnerability Disclosure**: Public security disclosure file at [/.well-known/security.txt](file:///f:/Grovar%20law/.well-known/security.txt) and [/security.txt](file:///f:/Grovar%20law/security.txt).
- **Apache Hardening**: [`.htaccess`](file:///f:/Grovar%20law/.htaccess) with HTTPS rewrite, directory listing disabled (`Options -Indexes`), and all security headers.
- **Nginx Hardening**: [`nginx.conf.template`](file:///f:/Grovar%20law/nginx.conf.template) with TLS 1.2/1.3 ciphers, rate limiting zones (`limit_req_zone`), and proxy pass rules.
- **Cloudflare / Netlify Headers**: [`_headers`](file:///f:/Grovar%20law/_headers) ready for edge deployments.

---

## 🚀 How to Run & Preview Locally

### Option 1: Directly in Any Web Browser
Simply double-click or open [index.html](file:///f:/Grovar%20law/index.html) in Chrome, Edge, Safari, or Firefox.

### Option 2: Using the Built-in Node Server
Open PowerShell in `f:\Grovar law` and run:
```powershell
node server.js
```
Then visit:
```text
http://localhost:3000
```

---

## 📂 File Directory

```text
f:\Grovar law\
├── index.html                  # Flagship modern website with all sections & interactive features
├── about.html                  # Dedicated About Us page
├── expertise.html              # Dedicated Practice Areas & Legal Services page
├── news.html                   # Dedicated Accolades, WTR 1000 Rankings & Press page
├── links.html                  # Curated Official Indian Legal Portals directory
├── contact.html                # Chambers directory, embedded maps & inquiry form
├── Aboutus.htm                 # Backwards-compatible legacy redirect
├── OurExpertise.htm            # Backwards-compatible legacy redirect
├── Contact Us.htm              # Backwards-compatible legacy redirect
├── News.htm                    # Backwards-compatible legacy redirect
├── Links.htm                   # Backwards-compatible legacy redirect
├── server.js                   # Zero-dependency local HTTP preview server
├── assets/
│   ├── css/
│   │   └── style.css           # Custom styles, luxury typography & animations
│   ├── js/
│   │   └── main.js             # BCI modal, tabs, form validation & mobile nav
│   └── images/                 # Downloaded firm assets and image files
└── legacy_source_archive/      # Safely archived raw source files scraped from groverlaw.in
```
