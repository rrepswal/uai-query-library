# UAI Query Library

**19 ready-to-run queries from the UAI SRS Hands-On Activity and API Integrations demo materials — one click, no query syntax to learn.**

> **Built on the work of Ingmar VG.**
> This library is a companion to the original **[UAI Query Library](https://github.com/IngmarVG-IB/infoblox-uai-query-library)** by **[Ingmar VG (@IngmarVG-IB)](https://github.com/IngmarVG-IB)**. The query catalog structure, userscript architecture, build system, and the entire UI engine are his work. This repo contains only the queries from the UAI SRS Hands-On Activity Workbook and the API Integrations Queries reference — packaged into his format so they install the same way.
>
> If you want the full 28-query library, use Ingmar's repo. This one is for SEs running the SRS session or the API integrations demo.

---

## Getting started

### Step 1 — Install a userscript extension

- **Chrome or Edge** → [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Firefox** → [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/) or [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/)
- **Safari** → [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)

### Step 2 — Install the Query Library

**[⬇️ Click here to install](https://github.com/Infoblox-TME/uai-query-library/raw/main/dist/uai-query-library.user.js)**

Your userscript extension will open an installation page. Click **Install**.

### Step 3 — Open Asset Inventory

Go to your Infoblox portal → **Assets → Inventory**. A green **Query Library** button appears in the bottom-right corner.

### Step 4 — Run your first query

1. Click any query title to expand it.
2. Click **Apply & run**.
3. Results appear in the table.

> **Clear the default filter first.** Asset Inventory starts with `Managed IS "True"` applied. Clear it before running any query here — every query is already scoped correctly.

---

## The queries

### SRS Hands-On Activity Workbook (6 + 1 bonus)

| Query | Category |
|---|---|
| Assets Missing from ServiceNow | CMDB Reconciliation |
| Assets in EDR/MDM Fleet but Not in ServiceNow | CMDB Reconciliation |
| Asset Marked as Retired in CMDB but Seen on the Network | CMDB Reconciliation |
| BYOD / Personal Devices | Shadow IT |
| Windows and macOS End-of-Life Devices | Lifecycle & Patch Hygiene |
| Corporate Managed Laptops with Disk Encryption Off | Compliance |
| CrowdStrike Firewall Not Running and Prevention Policy Not Applied | Security Control Gaps |

### API Integrations Queries Reference (12)

| Query | Category |
|---|---|
| Enriched Assets (4+ Providers) | Asset Enrichment |
| Windows 11 End-of-Life Devices (22H2) | Lifecycle & Patch Hygiene |
| Windows 11 Nearing End of Life (23H2) | Lifecycle & Patch Hygiene |
| macOS End-of-Life Devices | Lifecycle & Patch Hygiene |
| Apple Fleet Missing Jamf Pro MDM | MDM Coverage |
| Windows Fleet Missing Microsoft Intune | MDM Coverage |
| BYOD Devices on Corporate Network | Shadow IT |
| Cloud Correlation Demo VMs | Cloud & Infrastructure |
| Windows CIs in CrowdStrike but Missing ServiceNow | CMDB Reconciliation |
| Assets Missing from ServiceNow (Demo Scoped) | CMDB Reconciliation |
| Windows Devices Missing CrowdStrike | Security Control Gaps |
| Medical / IoT Devices on Unexpected VLAN | IoT & OT Visibility |

---

## Credit

The entire technical foundation of this tool — the userscript architecture, the catalog JSON schema, the build system, the UI panel, the Saved Filters installer, and the LZ-string URL encoding — was designed and built by **[Ingmar VG (@IngmarVG-IB)](https://github.com/IngmarVG-IB)** in the original [infoblox-uai-query-library](https://github.com/IngmarVG-IB/infoblox-uai-query-library). This repo exists only to package a specific subset of queries in his format. All credit for the engineering goes to him.

---

## Privacy and safety

Same guarantees as the original library:

- Runs **only** on your Infoblox portal page.
- Makes **no network requests** of its own — no telemetry, no phoning home.
- Reads **no asset data**. It types into the filter box and clicks buttons.
- Apart from the clearly-marked *Install as Saved Filters* button, changes nothing in your tenant.

---

## Query language reference

See **[docs/query-language.md](docs/query-language.md)** and Ingmar's full reference at **[infoblox-uai-query-library/docs/query-language.md](https://github.com/IngmarVG-IB/infoblox-uai-query-library/blob/main/docs/query-language.md)**.

---

## Licence

[MIT](LICENSE)
