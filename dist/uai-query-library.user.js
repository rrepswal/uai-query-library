// ==UserScript==
// @name         UAI SRS Query Library
// @namespace    https://github.com/Infoblox-TME/uai-query-library
// @version      0.1.0
// @description  Adds the UAI SRS Hands-On Activity and API Integrations queries to Infoblox UAI Asset Inventory. Based on Ingmar VG's UAI Query Library.
// @author       Infoblox SE Team
// @license      MIT
// @match        https://csp.infoblox.com/*
// @grant        none
// @run-at       document-idle
// @homepageURL  https://github.com/Infoblox-TME/uai-query-library
// @supportURL   https://github.com/Infoblox-TME/uai-query-library/issues
// @updateURL    https://github.com/Infoblox-TME/uai-query-library/raw/main/dist/uai-query-library.user.js
// @downloadURL  https://github.com/Infoblox-TME/uai-query-library/raw/main/dist/uai-query-library.user.js
// ==/UserScript==
/* Based on UAI Query Library by Ingmar VG (https://github.com/IngmarVG-IB).
 * Architecture, build system, and UI are entirely his work.
 * This companion repo contains only the queries from the UAI SRS Hands-On
 * Activity and API Integrations demo materials.
 */

/*
 * An Infoblox project, built by the Infoblox SE team. Not part of the shipping
 * product and carries no support SLA.
 *
 * Privacy: this script makes no network requests of its own while it runs. It
 * sends no telemetry, fetches no remote catalog, and reads no asset data. It
 * puts text into the page's own filter box and clicks the page's own buttons.
 * The whole catalog is baked into this file at build time, so you can read
 * exactly what it will run before you install it.
 *
 * The one exception is outside the script: @updateURL asks your userscript
 * manager to check GitHub periodically for a new version. That is the
 * extension talking to github.com, not this code, and you can turn it off in
 * the extension's settings.
 *
 * @grant none is deliberate: it runs the script in the page's own context,
 * which is what makes window.monaco reachable. Storage therefore uses
 * localStorage rather than GM_setValue.
 */

(function () {
  'use strict';

  /** Injected at build time from queries/catalog.json. */
  const CATALOG = {
  "$schema": "./schema.json",
  "catalogVersion": "0.1.0",
  "queries": [
    {
      "id": "missing-from-servicenow",
      "title": "Assets Missing from ServiceNow",
      "category": "CMDB Reconciliation",
      "query": "Providers NOTIN [\"ServiceNow\"]",
      "description": "Finds any asset type with no ServiceNow record at all, regardless of ownership or device class — the broadest CMDB-completeness check in the set. Not devices that are wrong in ServiceNow, but devices that are entirely absent from it.",
      "bestUsedFor": "Broad CMDB-hygiene conversations — a strong opener for customers who haven't questioned their CMDB's completeness.",
      "tags": [
        "cmdb",
        "servicenow",
        "coverage",
        "opener"
      ],
      "requiresProviders": [
        "ServiceNow"
      ],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "managed-fleet-missing-servicenow",
      "title": "Assets in EDR/MDM Fleet but Not in ServiceNow",
      "savedFilterName": "EDR/MDM Fleet Not in ServiceNow",
      "category": "CMDB Reconciliation",
      "query": "Type IN [\"Laptop\", \"Workstation\"] AND Providers CONTAINS \"CrowdStrike Falcon\" AND (Providers CONTAINS \"Microsoft Intune\" OR Providers CONTAINS \"Jamf Pro\") AND Providers NOTIN [\"ServiceNow\"]",
      "description": "Finds laptops and workstations that are already confirmed, managed devices — covered by CrowdStrike for security and by Intune or Jamf for device management — yet have no record in ServiceNow at all. Unlike a generic missing-from-CMDB check, this rules out the 'maybe it's just noise' objection: these are devices your own security and MDM stack already trusts.",
      "bestUsedFor": "CMDB-completeness conversations with IT and security leaders who assume anything actively managed is automatically tracked in ServiceNow.",
      "tags": [
        "cmdb",
        "servicenow",
        "edr",
        "mdm",
        "crowdstrike",
        "intune",
        "jamf"
      ],
      "requiresProviders": [
        "ServiceNow",
        "CrowdStrike Falcon"
      ],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "retired-cmdb-active-network",
      "title": "Asset Marked as Retired in CMDB but Seen on the Network",
      "savedFilterName": "Retired in CMDB, Seen on Network",
      "category": "CMDB Reconciliation",
      "query": "servicenow.servicenow_computers.install_status = \"retired\" AND asset.LastSeen AFTERDATE {{param:seenSince}}",
      "description": "Cross-references ServiceNow's CMDB lifecycle status with real-time network telemetry, flagging any device marked Retired that is still active on the network. A retired device is off the patch schedule, off the vulnerability scan roster, and has no assigned owner — but if it's still connected, it's a live, unmonitored attack surface.",
      "bestUsedFor": "IT Asset Management and CMDB-hygiene conversations — especially customers confident their CMDB is accurate. Requires two independent systems to agree, which a single provider console can't replicate on its own.",
      "proof": "Open one matching asset, expand its ServiceNow raw attributes, and point at install_status plus last_discovered — the two fields that produced the match.",
      "tags": [
        "cmdb",
        "servicenow",
        "lifecycle",
        "telemetry",
        "ghost-assets"
      ],
      "requiresProviders": [
        "ServiceNow"
      ],
      "params": [
        {
          "name": "seenSince",
          "label": "Seen on the network since (days ago)",
          "type": "relativeDate",
          "default": -14,
          "min": -365,
          "max": -1
        }
      ],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "byod-personal-devices",
      "title": "BYOD / Personal Devices",
      "category": "Shadow IT",
      "query": "Type IN [\"Laptop\", \"Workstation\", \"Smartphone\", \"Tablet\"] AND Providers NOTIN [\"CrowdStrike Falcon\", \"ServiceNow\", \"Tenable\", \"Jamf Pro\", \"Microsoft Intune\"]",
      "description": "Finds laptops, workstations, smartphones and tablets — the device types people actually bring to work — that show zero presence across five core providers at once: CrowdStrike Falcon, ServiceNow, Tenable, Jamf Pro, and Microsoft Intune. A device this invisible was never enrolled anywhere, which is the clearest signal of a personal device connecting to corporate resources.",
      "bestUsedFor": "BYOD and shadow-IT visibility conversations — customers who want to know what's connecting to their network outside of every managed channel.",
      "tags": [
        "byod",
        "shadow-it",
        "unmanaged",
        "coverage"
      ],
      "requiresProviders": [],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "windows-macos-eol",
      "title": "Windows and macOS End-of-Life Devices",
      "category": "Lifecycle & Patch Hygiene",
      "query": "(OperatingSystem IS [\"Windows 11\"] AND OSVersion = \"{{param:winVersion}}\") OR (OperatingSystem CONTAINS \"macOS\" AND OSVersion IS \"{{param:macVersion}}\")",
      "description": "Combines the Windows 11 build-level lifecycle check with the macOS point-release check into one cross-platform query, using normalised OS and version fields across both providers. Shows lifecycle risk on the whole fleet instead of one platform at a time.",
      "bestUsedFor": "Windows and Apple lifecycle / patch-hygiene conversations — customers running mixed fleets who track OS upgrades platform by platform today.",
      "tags": [
        "lifecycle",
        "eol",
        "patching",
        "windows",
        "macos",
        "cross-platform"
      ],
      "requiresProviders": [],
      "params": [
        {
          "name": "winVersion",
          "label": "Windows 11 build to flag",
          "type": "string",
          "default": "22H2"
        },
        {
          "name": "macVersion",
          "label": "macOS version to flag",
          "type": "string",
          "default": "13.7.8"
        }
      ],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "disk-encryption-off",
      "title": "Corporate Managed Laptops with Disk Encryption Off",
      "savedFilterName": "Laptops with Disk Encryption Off",
      "category": "Compliance",
      "query": "(intune.intune_managed_devices.device_health_attestation_state.bitLockerStatus = \"PROTECTION_OFF\") OR (jamf.jamf_computers_inventory.disk_encryption.bootPartitionEncryptionDetails.partitionFileVault2State != \"ENCRYPTED\")",
      "description": "Combines Jamf's FileVault state for Macs with Intune's BitLocker protection state for Windows into a single cross-provider query — one filter covering both platforms instead of two separate checks. Full-disk encryption is a regulatory baseline; MDM enrollment alone doesn't guarantee it's actually turned on.",
      "bestUsedFor": "Compliance-driven conversations (PCI-DSS, HIPAA, SOC 2, ISO 27001) with regulated customers running mixed Mac and Windows fleets.",
      "proof": "Open a Jamf-discovered asset and find partitionFileVault2State: NOT_ENCRYPTED in its raw attributes; open an Intune-discovered asset and find bitLockerStatus: PROTECTION_OFF.",
      "tags": [
        "compliance",
        "encryption",
        "bitlocker",
        "filevault",
        "intune",
        "jamf",
        "cross-platform"
      ],
      "requiresProviders": [
        "Microsoft Intune",
        "Jamf Pro"
      ],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "crowdstrike-firewall-prevention-off",
      "title": "CrowdStrike Firewall Not Running and Prevention Policy Not Applied",
      "savedFilterName": "CS Firewall + Prevention Off",
      "category": "Security Control Gaps",
      "query": "crowdstrike_falcon.crowdstrike_falcon_devices.device_policies.prevention.applied != \"true\" AND crowdstrike_falcon.crowdstrike_falcon_devices.device_policies.firewall.applied != \"true\"",
      "description": "Stacks two raw CrowdStrike policy attributes — firewall and prevention (real-time malware and threat blocking) — to isolate devices where both controls are inactive at once. A device missing both is a completely unprotected endpoint hiding inside your EDR tool.",
      "bestUsedFor": "Technical validation calls and POCs with security architects who want proof of compound, cross-attribute querying.",
      "proof": "Open one matching asset and confirm both prevention.applied and firewall.applied show false in the CrowdStrike raw attributes.",
      "tags": [
        "edr",
        "crowdstrike",
        "policy",
        "security-gap",
        "compound"
      ],
      "requiresProviders": [
        "CrowdStrike Falcon"
      ],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "enriched-assets",
      "title": "Enriched Assets (4+ Providers)",
      "category": "Asset Enrichment",
      "query": "asset.Providers.size >= 4",
      "description": "Finds highly correlated assets seen across four or more contributing providers. These are the records where UAI's multi-source reconciliation is working at full depth — ideal for showing what a unified asset record looks like when all integrations are firing.",
      "bestUsedFor": "Unified inventory and multi-source validation story — showing customers what full asset correlation looks like in practice.",
      "tags": [
        "enrichment",
        "correlation",
        "multi-source",
        "providers"
      ],
      "requiresProviders": [],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "windows-11-eol",
      "title": "Windows 11 End-of-Life Devices (22H2)",
      "category": "Lifecycle & Patch Hygiene",
      "query": "asset.OperatingSystem IS [\"Windows 11\"] and asset.OSVersion = \"22H2\"",
      "description": "Finds Windows 11 assets on the 22H2 release to support end-of-support lifecycle conversations. 22H2 reached end of support in October 2024.",
      "bestUsedFor": "Windows lifecycle risk and upgrade-priority story — customers who haven't moved off 22H2.",
      "tags": [
        "lifecycle",
        "eol",
        "windows",
        "patching"
      ],
      "requiresProviders": [],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "windows-11-nearing-eol",
      "title": "Windows 11 Nearing End of Life (23H2)",
      "category": "Lifecycle & Patch Hygiene",
      "query": "asset.OperatingSystem IS [\"Windows 11\"] and asset.OSVersion = \"23H2\"",
      "description": "Finds Windows 11 assets on the 23H2 release to show assets approaching end of support. Use alongside the 22H2 filter to show the full near-term Windows upgrade backlog.",
      "bestUsedFor": "Lifecycle planning and near-term remediation story — customers approaching their next required Windows upgrade.",
      "tags": [
        "lifecycle",
        "eol",
        "windows",
        "patching",
        "planning"
      ],
      "requiresProviders": [],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "macos-eol",
      "title": "macOS End-of-Life Devices",
      "category": "Lifecycle & Patch Hygiene",
      "query": "asset.OperatingSystem CONTAINS \"macOS\" AND asset.OSVersion IS \"13.7.8\"",
      "description": "Finds macOS devices on the Ventura 13.7.x baseline — the last release before Apple dropped security support. Pair with the Windows EOL filter for a cross-platform lifecycle view.",
      "bestUsedFor": "Apple lifecycle and patch-hygiene story — customers running mixed fleets who manage Mac upgrades separately.",
      "tags": [
        "lifecycle",
        "eol",
        "macos",
        "apple",
        "patching"
      ],
      "requiresProviders": [],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "apple-missing-mdm",
      "title": "Apple Fleet Missing Jamf Pro MDM",
      "category": "MDM Coverage",
      "query": "asset.OperatingSystem IN [\"iOS\", \"iPadOS\", \"macOS Sequoia\", \"macOS Sonoma\", \"macOS Tahoe\", \"macOS Ventura\"] and asset.Providers ISNOT \"Jamf Pro\" AND asset.Name STARTSWITH \"lsys\"",
      "description": "Finds Apple assets that appear company-managed (lsys- prefix) but do not have Jamf Pro as a contributing source. These are the Macs and iPhones that slipped through enrollment — visible on the network but outside MDM governance.",
      "bestUsedFor": "Missing MDM coverage and Apple fleet governance story — customers who assume all Apple devices are in Jamf.",
      "tags": [
        "mdm",
        "jamf",
        "apple",
        "coverage",
        "governance"
      ],
      "requiresProviders": [
        "Jamf Pro"
      ],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "windows-missing-mdm",
      "title": "Windows Fleet Missing Microsoft Intune",
      "category": "MDM Coverage",
      "query": "asset.Providers NOTIN [\"Microsoft Intune\"] and asset.OperatingSystem IN [\"Windows 11\", \"Windows Server 2019\", \"Windows Server 2022\", \"Windows Server 2025\"] and asset.Name STARTSWITH \"lsys\"",
      "description": "Finds Windows assets that appear company-managed (lsys- prefix) but do not have Microsoft Intune as a contributing source. These are the Windows machines outside policy enforcement — on the network but not enrolled.",
      "bestUsedFor": "Missing MDM coverage and Windows fleet governance story — customers who assume all Windows devices are in Intune.",
      "tags": [
        "mdm",
        "intune",
        "windows",
        "coverage",
        "governance"
      ],
      "requiresProviders": [
        "Microsoft Intune"
      ],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "byod-network-layer",
      "title": "BYOD Devices on Corporate Network",
      "savedFilterName": "BYOD on Corporate Network",
      "category": "Shadow IT",
      "query": "asset.Providers IN [\"Cisco Meraki\", \"Juniper Mist\"] and asset.Name DOESNOTCONTAIN \"lsys\"",
      "description": "Finds assets discovered on the wireless or network layer through Meraki or Mist whose names don't match the corporate naming convention — the clearest network-level signal of a personal device using the Corporate-BYOD SSID.",
      "bestUsedFor": "BYOD and unmanaged-on-network visibility story — customers who want to see what non-corporate devices are touching the wireless infrastructure.",
      "tags": [
        "byod",
        "shadow-it",
        "meraki",
        "mist",
        "wireless",
        "network"
      ],
      "requiresProviders": [
        "Cisco Meraki",
        "Juniper Mist"
      ],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "cloud-correlation-vms",
      "title": "Cloud Correlation Demo VMs",
      "category": "Cloud & Infrastructure",
      "query": "asset.Name IN [\"test-syslog-server\", \"svr-traffic-sim\", \"prod2-healthcheck\", \"awj-nova\", \"CIS Ubuntu (was nova-bastion-aws)\", \"demo-oregon-www\", \"www-east-01\", \"demo-bastion\", \"demo-dc2\", \"demo-dc1\", \"demo-cl5\", \"demo-cl4\", \"demo-cl3\", \"demo-cl2\", \"demo-cl1\"] and asset.Type = \"Virtual Machine\"",
      "description": "Finds the curated VM set used to demonstrate cloud instances discovered live and enriched through additional sources. These specific VMs are part of the Luminary Systems demo environment and show cloud correlation working end to end.",
      "bestUsedFor": "Cloud-correlation demo story using live discovery plus mocked enrichment — showing cloud assets pulled together across AWS, CrowdStrike, and ServiceNow.",
      "tags": [
        "cloud",
        "demo",
        "vms",
        "correlation",
        "aws"
      ],
      "requiresProviders": [],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "windows-crowdstrike-missing-sn",
      "title": "Windows CIs in CrowdStrike but Missing ServiceNow",
      "savedFilterName": "Windows: CrowdStrike Not in ServiceNow",
      "category": "CMDB Reconciliation",
      "query": "asset.OperatingSystem CONTAINS \"Windows\" AND asset.Providers IN [\"CrowdStrike Falcon\"] AND asset.Providers ISNOT \"ServiceNow\"",
      "description": "Finds Windows assets seen by CrowdStrike that do not have ServiceNow as a contributing source. Unlike the broad missing-from-ServiceNow filter, this requires CrowdStrike confirmation — so every result is a device you're already securing that your CMDB simply doesn't know about.",
      "bestUsedFor": "CMDB reconciliation story — assets confirmed present via CrowdStrike but absent from ServiceNow, making the objection 'maybe it's not real' impossible.",
      "tags": [
        "cmdb",
        "servicenow",
        "crowdstrike",
        "windows",
        "gap"
      ],
      "requiresProviders": [
        "CrowdStrike Falcon",
        "ServiceNow"
      ],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "missing-from-servicenow-demo",
      "title": "Assets Missing from ServiceNow (Demo Scoped)",
      "savedFilterName": "Assets Missing ServiceNow (Demo)",
      "category": "CMDB Reconciliation",
      "query": "asset.Providers ISNOT \"ServiceNow\" AND asset.Name STARTSWITH \"lsys\"",
      "description": "Finds any asset type that does not have ServiceNow as a contributing source, scoped to the Luminary Systems demo environment (lsys- prefix). Use this version in the API integrations demo to avoid noise from non-demo assets in the tenant.",
      "bestUsedFor": "Broad CMDB completeness story in the API integrations demo — any demo asset type absent from ServiceNow, independent of ownership or endpoint tooling.",
      "tags": [
        "cmdb",
        "servicenow",
        "coverage",
        "demo",
        "opener"
      ],
      "requiresProviders": [
        "ServiceNow"
      ],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "windows-missing-crowdstrike",
      "title": "Windows Devices Missing CrowdStrike",
      "savedFilterName": "Windows Missing CrowdStrike",
      "category": "Security Control Gaps",
      "query": "asset.OperatingSystem CONTAINS \"Windows\" AND asset.Providers ISNOT \"CrowdStrike Falcon\" AND asset.Name STARTSWITH \"lsys\"",
      "description": "Finds Windows assets that do not have CrowdStrike Falcon as a contributing source, surfacing endpoint detection coverage gaps in the Luminary Systems demo fleet.",
      "bestUsedFor": "EDR coverage-gap story — Windows assets with no CrowdStrike agent present, exposing blind spots in endpoint detection.",
      "tags": [
        "edr",
        "crowdstrike",
        "windows",
        "coverage-gap",
        "security"
      ],
      "requiresProviders": [
        "CrowdStrike Falcon"
      ],
      "source": "workbook",
      "verified": "counted"
    },
    {
      "id": "medical-devices-unexpected-vlan",
      "title": "Medical / IoT Devices on Unexpected VLAN",
      "savedFilterName": "IoT Devices on Unexpected VLAN",
      "category": "IoT & OT Visibility",
      "query": "asset.Category = \"IoT\"",
      "description": "Finds IoT-type assets (medical devices and other unmanaged hardware) discovered on a VLAN outside their expected network segment. These devices can't run agents, so network-layer discovery is the only way to find them — and network segmentation is the only control available.",
      "bestUsedFor": "IoT visibility and network-segmentation risk story — customers who need to know where medical or industrial devices are appearing on the network.",
      "tags": [
        "iot",
        "medical",
        "vlan",
        "segmentation",
        "agentless"
      ],
      "requiresProviders": [],
      "source": "workbook",
      "verified": "counted"
    }
  ]
};

  /** The page's real window, whether or not the manager sandboxed us. */
  const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  const NS = 'uaiql';
  const STORE_KEY = 'uaiql.local';
  const SAVED_FILTER_PREFIX = '[Library]';
  const INVENTORY_PATH = /\/workspace\/assets(?:\/(?:details|unified-details)\/|\?|$)/;

  /**
   * Saved Filter names are capped at 50 characters. Measured, not guessed: a
   * 50-character name saves and a 51-character one does not — and the UI gives
   * no error when it refuses, it just silently does nothing. Hence both the
   * truncation here and the read-back check in saveAsFilter.
   */
  const SAVED_FILTER_MAX_NAME = 50;

  function savedFilterNameFor(entry) {
    const base = entry.savedFilterName || entry.title;
    const full = `${SAVED_FILTER_PREFIX} ${base}`;
    return full.length <= SAVED_FILTER_MAX_NAME ? full : full.slice(0, SAVED_FILTER_MAX_NAME).trimEnd();
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------------------------------------------------------------------------
  // lz-string (compressToEncodedURIComponent only)
  //
  // The app stores filter state in the URL as
  //   LZString.compressToEncodedURIComponent(JSON.stringify(queryText))
  // so reproducing that encoding is what makes shareable query links possible.
  //
  // Extracted from lz-string by pieroxy, MIT licensed.
  // https://github.com/pieroxy/lz-string
  // ---------------------------------------------------------------------------

  const URI_KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$';

  function compressToEncodedURIComponent(input) {
    if (input == null) return '';
    return _compress(input, 6, (a) => URI_KEY.charAt(a));
  }

  function _compress(uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return '';
    const dictionary = {};
    const dictionaryToCreate = {};
    const data = [];
    let c = '', wc = '', w = '';
    let enlargeIn = 2, dictSize = 3, numBits = 2;
    let dataVal = 0, dataPosition = 0;

    const writeBits = (value, n) => {
      for (let i = 0; i < n; i++) {
        dataVal = (dataVal << 1) | (value & 1);
        if (dataPosition === bitsPerChar - 1) {
          dataPosition = 0;
          data.push(getCharFromInt(dataVal));
          dataVal = 0;
        } else {
          dataPosition++;
        }
        value >>= 1;
      }
    };

    const emit = (token) => {
      if (Object.prototype.hasOwnProperty.call(dictionaryToCreate, token)) {
        if (token.charCodeAt(0) < 256) {
          writeBits(0, numBits);
          writeBits(token.charCodeAt(0), 8);
        } else {
          writeBits(1, numBits);
          writeBits(token.charCodeAt(0), 16);
        }
        enlargeIn--;
        if (enlargeIn === 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
        delete dictionaryToCreate[token];
      } else {
        writeBits(dictionary[token], numBits);
      }
      enlargeIn--;
      if (enlargeIn === 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
    };

    for (let ii = 0; ii < uncompressed.length; ii++) {
      c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(dictionary, c)) {
        dictionary[c] = dictSize++;
        dictionaryToCreate[c] = true;
      }
      wc = w + c;
      if (Object.prototype.hasOwnProperty.call(dictionary, wc)) {
        w = wc;
      } else {
        emit(w);
        dictionary[wc] = dictSize++;
        w = String(c);
      }
    }

    if (w !== '') emit(w);

    writeBits(2, numBits);
    while (true) {
      dataVal <<= 1;
      if (dataPosition === bitsPerChar - 1) { data.push(getCharFromInt(dataVal)); break; }
      dataPosition++;
    }
    return data.join('');
  }

  // ---------------------------------------------------------------------------
  // Parameter substitution
  // ---------------------------------------------------------------------------

  /** UAI writes dates as MM-DD-YYYY. */
  function formatUaiDate(date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${mm}-${dd}-${date.getFullYear()}`;
  }

  function renderParamValue(param, raw) {
    if (param.type === 'relativeDate') {
      const d = new Date();
      d.setDate(d.getDate() + Number(raw));
      return formatUaiDate(d);
    }
    return String(raw);
  }

  function renderQuery(entry, values) {
    let out = entry.query;
    for (const param of entry.params || []) {
      const raw = values && param.name in values && values[param.name] !== ''
        ? values[param.name]
        : param.default;
      out = out.split(`{{param:${param.name}}}`).join(renderParamValue(param, raw));
    }
    const leftover = /\{\{param:(\w+)\}\}/.exec(out);
    if (leftover) throw new Error(`"${entry.id}" uses an undeclared parameter: ${leftover[1]}`);
    return out;
  }

  // ---------------------------------------------------------------------------
  // UAI adapter
  //
  // Everything coupling this script to the app lives here. Verified against the
  // live app: the filter bar is a Monaco editor with language id "filterel",
  // exposed on window.monaco, and Apply is a plain button.
  // ---------------------------------------------------------------------------

  const adapter = {
    onInventoryPage() {
      return INVENTORY_PATH.test(location.hash);
    },

    monaco() {
      return W.monaco;
    },

    /** The filter bar's model, or null when Advanced Mode is not open. */
    model() {
      const m = this.monaco();
      if (!m?.editor) return null;
      const models = m.editor.getModels();
      return models.find((x) => x.getLanguageId?.() === 'filterel') || models[0] || null;
    },

    button(label) {
      return [...document.querySelectorAll('button, a, span')].find(
        (e) => e.offsetParent && e.children.length === 0 && e.textContent.trim() === label,
      );
    },

    /** Advanced Mode hosts the Monaco editor; Basic Mode does not. */
    async ensureAdvancedMode() {
      if (this.model()) return true;
      const toggle = this.button('Advanced Mode');
      if (!toggle) return false;
      toggle.click();
      for (let i = 0; i < 20 && !this.model(); i++) await sleep(150);
      return !!this.model();
    },

    async setQuery(text) {
      if (!(await this.ensureAdvancedMode())) {
        throw new Error('Open Asset Inventory and switch to Advanced Mode first.');
      }
      this.model().setValue(text);
      await sleep(250);
    },

    async apply(text) {
      await this.setQuery(text);
      const btn = this.button('Apply');
      if (!btn) throw new Error('Could not find the Apply button.');
      if (btn.disabled) throw new Error('Apply is disabled — a query may still be running.');
      btn.click();
    },

    /**
     * Providers integrated in this tenant, read from the filter language's own
     * autocomplete. Returns null if it cannot be determined, which the UI reads
     * as "do not grey anything out".
     */
    async detectProviders() {
      const m = this.monaco();
      const model = this.model();
      if (!m || !model) return null;
      const editors = m.editor.getEditors?.() || [];
      const ed = editors[0];
      if (!ed) return null;

      const restore = model.getValue();
      try {
        const probe = 'asset.Providers IN [';
        model.setValue(probe);
        ed.setPosition({ lineNumber: 1, column: probe.length + 1 });
        ed.trigger('uaiql', 'editor.action.triggerSuggest', {});
        await sleep(900);
        const ctrl = ed.getContribution('editor.contrib.suggestController');
        const items = ctrl?.model?._completionModel?.items || [];
        ed.trigger('uaiql', 'hideSuggestWidget', {});
        const names = items
          .map((i) => i.completion?.label?.label ?? i.completion?.label ?? i.textLabel)
          .filter((s) => typeof s === 'string' && s !== 'EMPTY');
        return names.length ? names : null;
      } catch {
        return null;
      } finally {
        model.setValue(restore);
      }
    },

    /**
     * A URL that opens Asset Inventory with this query pre-loaded in the filter
     * bar. Verified against the live app: the recipient still has to press
     * Apply, and the URL is only read on a full page load — mutating the hash
     * in an already-open tab does nothing.
     */
    deepLink(queryText) {
      const encoded = compressToEncodedURIComponent(JSON.stringify(queryText));
      return `${location.origin}/#/workspace/assets/details/managed-assets`
        + `?hideBreadcrumbs=true&isAdvanced=true&advancedFilterValue=${encoded}`;
    },

    /** Names of the Saved Filters currently visible in the picker. */
    async listSavedFilterNames() {
      const link = this.button('Saved Filters');
      if (!link) return null;
      link.click();
      await sleep(1600);
      const seeAll = [...document.querySelectorAll('.cdk-overlay-container *')]
        .find((e) => e.offsetParent && !e.children.length && /see all/i.test(e.textContent.trim()));
      if (seeAll) { seeAll.click(); await sleep(2000); }

      // The list virtualises, so scroll it through to see every row.
      const pane = [...document.querySelectorAll('div')]
        .filter((d) => d.offsetParent && d.scrollHeight > d.clientHeight + 50)
        .pop();
      const names = new Set();
      const harvest = () => (document.body.innerText.match(/^.*\[Library\].*$/gm) || [])
        .forEach((s) => names.add(s.trim()));
      harvest();
      for (let i = 0; pane && i < 30; i++) {
        pane.scrollTop += pane.clientHeight * 0.8;
        await sleep(220);
        harvest();
      }
      [...document.querySelectorAll('.cdk-overlay-container button')]
        .find((b) => b.offsetParent && b.textContent.trim() === 'Close')?.click();
      await sleep(500);
      return names;
    },

    /**
     * Creates a native Saved Filter by driving the app's own Save popover.
     * Deliberately UI-driven rather than calling an undocumented API: it stays
     * inside whatever the signed-in user is actually allowed to do.
     */
    async saveAsFilter(queryText, name) {
      if (name.length > SAVED_FILTER_MAX_NAME) {
        throw new Error(`Name is ${name.length} characters; the limit is ${SAVED_FILTER_MAX_NAME}.`);
      }
      await this.setQuery(queryText);
      const save = this.button('Save');
      if (!save || save.disabled) throw new Error('Save is unavailable for this query.');
      save.click();
      await sleep(700);

      const input = [...document.querySelectorAll('input')].find(
        (i) => i.offsetParent && /saved filter/i.test(i.value || ''),
      ) || [...document.querySelectorAll('.cdk-overlay-container input')].find((i) => i.offsetParent);
      if (!input) throw new Error('Could not find the filter name field.');

      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, name);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      await sleep(250);

      const confirm = [...document.querySelectorAll('.cdk-overlay-container button, .cdk-overlay-container a')]
        .find((b) => b.offsetParent && b.textContent.trim() === 'Save');
      if (!confirm) throw new Error('Could not find the Save confirmation button.');
      confirm.click();
      await sleep(900);
    },

    async cancelOverlay() {
      const cancel = [...document.querySelectorAll('.cdk-overlay-container button, .cdk-overlay-container a, .cdk-overlay-container span')]
        .find((b) => b.offsetParent && b.textContent.trim() === 'Cancel');
      cancel?.click();
      await sleep(200);
    },
  };

  // ---------------------------------------------------------------------------
  // Local (user-added) queries
  // ---------------------------------------------------------------------------

  const store = {
    read() {
      try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
    },
    write(list) { localStorage.setItem(STORE_KEY, JSON.stringify(list)); },
  };

  const allQueries = () => [
    ...CATALOG.queries.map((q) => ({ ...q, origin: 'catalog' })),
    ...store.read().map((q) => ({ ...q, origin: 'local' })),
  ];

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  const CSS = `
  .${NS}-fab{position:fixed;right:22px;bottom:50px;z-index:2147483000;height:42px;padding:0 18px;
    border:0;border-radius:21px;background:#0d8b4d;color:#fff;font:600 13px/42px system-ui,-apple-system,sans-serif;
    cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.4)}
  .${NS}-fab:hover{background:#10a75d}
  .${NS}-panel{position:fixed;top:0;right:0;bottom:0;width:460px;max-width:100vw;z-index:2147483001;
    background:#1b1f24;color:#e6e9ec;box-shadow:-6px 0 28px rgba(0,0,0,.5);display:none;flex-direction:column;
    font:13px/1.55 system-ui,-apple-system,sans-serif;border-left:1px solid #2f353c}
  .${NS}-panel[data-open="1"]{display:flex}
  .${NS}-head{padding:14px 16px;border-bottom:1px solid #2f353c;display:flex;align-items:center;gap:10px}
  .${NS}-head h2{margin:0;font-size:14px;font-weight:700;flex:1;letter-spacing:.01em}
  .${NS}-x{border:0;background:none;font-size:22px;line-height:1;cursor:pointer;color:#8b949e;padding:0 4px}
  .${NS}-x:hover{color:#e6e9ec}
  .${NS}-search{margin:12px 16px 0;padding:8px 10px;border:1px solid #3a4149;border-radius:6px;
    background:#12161a;color:#e6e9ec;font:inherit}
  .${NS}-search::placeholder{color:#6e7781}
  .${NS}-list{flex:1;overflow:auto;padding:10px 16px 16px}
  .${NS}-cat{margin:16px 0 7px;font-size:10.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:#7d8892}
  .${NS}-item{border:1px solid #2f353c;border-radius:8px;padding:10px 12px;margin-bottom:8px;background:#20252b}
  .${NS}-item[data-off="1"]{opacity:.45}
  .${NS}-title{font-weight:600;cursor:pointer;display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}
  .${NS}-tag{font-weight:500;color:#8b949e;font-size:10.5px;border:1px solid #3a4149;border-radius:3px;padding:0 5px}
  .${NS}-tag.warn{color:#e3b341;border-color:#5c4a1a}
  .${NS}-desc{color:#a8b1ba;font-size:12px;margin-top:5px}
  .${NS}-more{display:none}
  .${NS}-item[data-open="1"] .${NS}-more{display:block}
  .${NS}-use{color:#8b949e;font-size:11.5px;margin-top:7px;font-style:italic}
  .${NS}-q{font:11.5px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#12161a;
    border:1px solid #2f353c;border-radius:5px;padding:7px 8px;white-space:pre-wrap;word-break:break-word;
    margin-top:8px;color:#c9d1d9}
  .${NS}-params{margin-top:8px}
  .${NS}-params label{display:flex;align-items:center;gap:8px;font-size:11.5px;margin-bottom:5px;color:#a8b1ba}
  .${NS}-params input{width:110px;padding:3px 7px;border:1px solid #3a4149;border-radius:4px;
    background:#12161a;color:#e6e9ec;font:inherit}
  .${NS}-btns{display:flex;gap:6px;margin-top:9px;flex-wrap:wrap}
  .${NS}-btn{border:1px solid #3a4149;background:#2a3038;color:#e6e9ec;border-radius:5px;padding:5px 11px;
    font-size:11.5px;cursor:pointer;font-family:inherit}
  .${NS}-btn:hover{background:#343b44}
  .${NS}-btn.p{background:#0d8b4d;border-color:#0d8b4d;color:#fff}
  .${NS}-btn.p:hover{background:#10a75d}
  .${NS}-foot{border-top:1px solid #2f353c;padding:10px 16px;display:flex;gap:8px;align-items:center;
    font-size:11.5px;color:#7d8892}
  .${NS}-toast{position:fixed;bottom:100px;right:22px;z-index:2147483002;background:#0d1117;color:#e6e9ec;
    padding:10px 14px;border-radius:6px;font:12.5px system-ui,sans-serif;max-width:400px;
    border:1px solid #3a4149;box-shadow:0 4px 16px rgba(0,0,0,.5)}
  `;

  function toast(msg, ms = 3400) {
    document.querySelector(`.${NS}-toast`)?.remove();
    const el = document.createElement('div');
    el.className = `${NS}-toast`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), ms);
  }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let providers = null; // null = unknown, array = detected

  function buildPanel() {
    const panel = document.createElement('div');
    panel.className = `${NS}-panel`;
    panel.innerHTML = `
      <div class="${NS}-head">
        <h2>UAI Query Library</h2>
        <button class="${NS}-x" title="Close">&times;</button>
      </div>
      <input class="${NS}-search" type="search" placeholder="Search title, description, tag or provider…">
      <div class="${NS}-list"></div>
      <div class="${NS}-foot">
        <span class="${NS}-count"></span>
        <span style="flex:1"></span>
        <button class="${NS}-btn" data-act="install">Install as Saved Filters…</button>
      </div>`;

    const list = panel.querySelector(`.${NS}-list`);
    const search = panel.querySelector(`.${NS}-search`);
    const count = panel.querySelector(`.${NS}-count`);

    const missingFor = (q) => {
      if (!providers || !q.requiresProviders?.length) return null;
      const missing = q.requiresProviders.filter((p) => !providers.includes(p));
      return missing.length ? missing : null;
    };

    function render() {
      const t = search.value.trim().toLowerCase();
      const all = allQueries();
      const matches = all.filter((q) => !t || [
        q.title, q.description, q.category, q.bestUsedFor || '',
        ...(q.tags || []), ...(q.requiresProviders || []),
      ].join(' ').toLowerCase().includes(t));

      count.textContent = t ? `${matches.length} of ${all.length} queries` : `${all.length} queries`;
      list.innerHTML = '';

      const groups = new Map();
      for (const q of matches) {
        if (!groups.has(q.category)) groups.set(q.category, []);
        groups.get(q.category).push(q);
      }
      for (const [category, entries] of groups) {
        const h = document.createElement('div');
        h.className = `${NS}-cat`;
        h.textContent = category;
        list.appendChild(h);
        entries.forEach((q) => list.appendChild(renderItem(q)));
      }
      if (!matches.length) {
        list.innerHTML = `<div class="${NS}-desc" style="margin-top:14px">No queries match that search.</div>`;
      }
    }

    function renderItem(q) {
      const missing = missingFor(q);
      const item = document.createElement('div');
      item.className = `${NS}-item`;
      if (missing) item.dataset.off = '1';

      const params = (q.params || []).map((p) => `
        <label><span style="flex:1">${esc(p.label)}</span>
          <input data-param="${esc(p.name)}" type="${p.type === 'string' ? 'text' : 'number'}"
                 value="${esc(String(p.default))}"
                 ${p.min !== undefined ? `min="${p.min}"` : ''} ${p.max !== undefined ? `max="${p.max}"` : ''}>
        </label>`).join('');

      item.innerHTML = `
        <div class="${NS}-title">
          <span style="flex:1">${esc(q.title)}</span>
          ${q.origin === 'local' ? `<span class="${NS}-tag">local</span>` : ''}
          ${q.verified === 'counted' ? `<span class="${NS}-tag">verified</span>` : ''}
          ${missing ? `<span class="${NS}-tag warn">needs ${esc(missing.join(', '))}</span>` : ''}
        </div>
        <div class="${NS}-desc">${esc(q.description)}</div>
        <div class="${NS}-more">
          ${q.bestUsedFor ? `<div class="${NS}-use">${esc(q.bestUsedFor)}</div>` : ''}
          ${params ? `<div class="${NS}-params">${params}</div>` : ''}
          <div class="${NS}-q"></div>
          <div class="${NS}-btns">
            <button class="${NS}-btn p" data-act="apply">Apply &amp; run</button>
            <button class="${NS}-btn" data-act="load">Load only</button>
            <button class="${NS}-btn" data-act="copy">Copy query</button>
            <button class="${NS}-btn" data-act="link">Copy link</button>
          </div>
        </div>`;

      const qBox = item.querySelector(`.${NS}-q`);
      const readParams = () => Object.fromEntries(
        [...item.querySelectorAll('[data-param]')].map((i) => [i.dataset.param, i.value]));
      const refresh = () => {
        try { qBox.textContent = renderQuery(q, readParams()); }
        catch (e) { qBox.textContent = `⚠ ${e.message}`; }
      };
      refresh();

      item.querySelector(`.${NS}-title`).addEventListener('click', () => {
        item.dataset.open = item.dataset.open === '1' ? '0' : '1';
      });
      item.querySelectorAll('[data-param]').forEach((i) => i.addEventListener('input', refresh));

      item.querySelector(`.${NS}-btns`).addEventListener('click', async (ev) => {
        const act = ev.target.dataset?.act;
        if (!act) return;
        let text;
        try { text = renderQuery(q, readParams()); }
        catch (e) { toast(e.message, 6000); return; }

        try {
          if (act === 'copy') {
            await navigator.clipboard.writeText(text);
            toast('Query copied.');
          } else if (act === 'link') {
            await navigator.clipboard.writeText(adapter.deepLink(text));
            toast('Link copied. It opens Asset Inventory with this query loaded — the recipient still clicks Apply to run it.', 5000);
          } else if (act === 'load') {
            await adapter.setQuery(text);
            toast(`Loaded: ${q.title}`);
          } else {
            await adapter.apply(text);
            toast(`Running: ${q.title}`);
          }
        } catch (e) {
          toast(e.message, 6000);
        }
      });

      return item;
    }

    search.addEventListener('input', render);
    panel.querySelector(`.${NS}-x`).addEventListener('click', () => { panel.dataset.open = '0'; });
    panel.querySelector('[data-act="install"]').addEventListener('click', () => installFlow());

    panel.render = render;
    render();
    return panel;
  }

  /**
   * Writes selected queries into the tenant as native Saved Filters. This is the
   * only thing the script does that changes the tenant, so it asks first, names
   * everything with a visible prefix, and skips anything parameterised (a saved
   * filter would freeze today's date into the query and quietly go stale).
   */
  async function installFlow() {
    const eligible = allQueries().filter((q) => !q.params?.length);
    const skipped = allQueries().length - eligible.length;

    const ok = W.confirm(
      `Create ${eligible.length} Saved Filters in the tenant you are signed in to?\n\n`
      + `Each is named with the "${SAVED_FILTER_PREFIX}" prefix so they are easy to find and remove.\n\n`
      + (skipped ? `${skipped} parameterised queries are skipped — saving them would freeze today's date into the filter.\n\n` : '')
      + `This writes to a shared tenant. Do not run it against a customer's production tenant without their agreement.`,
    );
    if (!ok) return;

    let attempted = 0;
    const failures = [];
    const wanted = new Map();
    for (const q of eligible) {
      const name = savedFilterNameFor(q);
      wanted.set(name, q.title);
      try {
        await adapter.saveAsFilter(q.query, name);
        attempted++;
        toast(`Saved ${attempted}/${eligible.length}: ${q.title}`, 1500);
      } catch (e) {
        failures.push(`${q.title}: ${e.message}`);
        await adapter.cancelOverlay();
      }
      await sleep(400);
    }

    // The app accepts a save silently and then discards it in some cases, so
    // read the list back rather than trusting that clicking Save worked.
    const actual = await adapter.listSavedFilterNames();
    if (actual) {
      for (const [name, title] of wanted) {
        const present = [...actual].some((n) => n.includes(name));
        if (!present && !failures.some((f) => f.startsWith(title))) {
          failures.push(`${title}: reported success but is not in the list`);
        }
      }
    }

    const created = wanted.size - failures.length;
    toast(
      failures.length
        ? `Created ${created} of ${eligible.length}. ${failures.length} did not stick — see console.`
        : `Created ${created} Saved Filters.`,
      7000,
    );
    if (failures.length) console.warn('[uaiql] Saved Filter failures:\n' + failures.join('\n'));
  }

  // ---------------------------------------------------------------------------
  // Bootstrap
  // ---------------------------------------------------------------------------

  let panel = null;

  function mount() {
    if (!adapter.onInventoryPage()) {
      document.querySelector(`.${NS}-fab`)?.remove();
      if (panel) { panel.remove(); panel = null; }
      return;
    }
    if (document.querySelector(`.${NS}-fab`)) return;

    const style = document.createElement('style');
    style.id = `${NS}-style`;
    style.textContent = CSS;
    if (!document.getElementById(`${NS}-style`)) document.head.appendChild(style);

    const fab = document.createElement('button');
    fab.className = `${NS}-fab`;
    fab.textContent = 'Query Library';
    document.body.appendChild(fab);

    panel = buildPanel();
    document.body.appendChild(panel);

    fab.addEventListener('click', async () => {
      const opening = panel.dataset.open !== '1';
      panel.dataset.open = opening ? '1' : '0';
      if (opening && providers === null) {
        providers = await adapter.detectProviders();
        if (providers) panel.render();
      }
    });
  }

  // Single-page app: the button has to survive client-side navigation.
  W.addEventListener('hashchange', () => setTimeout(mount, 400));
  const observer = new MutationObserver(() => mount());
  if (document.body) {
    mount();
    observer.observe(document.body, { childList: true });
  }
})();
