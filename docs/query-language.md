# UAI Query Language Reference

This file is a pointer. The authoritative, maintained query language reference is in Ingmar VG's repo:

**[infoblox-uai-query-library / docs / query-language.md](https://github.com/IngmarVG-IB/infoblox-uai-query-library/blob/main/docs/query-language.md)**

## Quick reference

### Operators

| Operator | Example |
|---|---|
| `=` | `asset.Category = "IoT"` |
| `!=` | `partitionFileVault2State != "ENCRYPTED"` |
| `IS` | `asset.OSVersion IS "13.7.8"` |
| `ISNOT` | `asset.Providers ISNOT "ServiceNow"` |
| `IN` | `asset.Type IN ["Laptop", "Workstation"]` |
| `NOTIN` | `asset.Providers NOTIN ["CrowdStrike Falcon"]` |
| `CONTAINS` | `asset.Providers CONTAINS "CrowdStrike Falcon"` |
| `DOESNOTCONTAIN` | `asset.Name DOESNOTCONTAIN "lsys"` |
| `STARTSWITH` | `asset.Name STARTSWITH "lsys"` |
| `AFTERDATE` | `asset.LastSeen AFTERDATE 08-01-2026` |
| `BEFOREDATE` | `asset.LastSeen BEFOREDATE 07-01-2026` |

### Commonly used fields

| Field | Notes |
|---|---|
| `asset.Providers` | List of contributing sources (e.g. "CrowdStrike Falcon") |
| `asset.Type` | Device class: Laptop, Workstation, Smartphone, Tablet, Virtual Machine, etc. |
| `asset.Category` | Broader classification: IoT, etc. |
| `asset.OperatingSystem` | Normalised OS name |
| `asset.OSVersion` | Normalised OS version string |
| `asset.Name` | Hostname |
| `asset.LastSeen` | Most recent network sighting |
| `asset.Classifications` | UAI insight classifications: Zombie, Noncompliant, etc. |
| `asset.SubClassifications` | Finer insight tags: Unencrypted, Orphan, Public Access, etc. |

### Raw provider attributes

Prefix with the provider path to reach raw fields:

```
servicenow.servicenow_computers.install_status = "retired"
intune.intune_managed_devices.device_health_attestation_state.bitLockerStatus = "PROTECTION_OFF"
jamf.jamf_computers_inventory.disk_encryption.bootPartitionEncryptionDetails.partitionFileVault2State != "ENCRYPTED"
crowdstrike_falcon.crowdstrike_falcon_devices.device_policies.prevention.applied != "true"
crowdstrike_falcon.crowdstrike_falcon_devices.device_policies.firewall.applied != "true"
```
