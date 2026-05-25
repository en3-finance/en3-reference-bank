# Reference Bank Architecture

The reference bank combines mock core banking data with En3 sandbox API concepts.

| Area | Public mock responsibility |
| --- | --- |
| Core banking | Users and fiat account references. |
| En3 wallet layer | Wallets, deposit addresses, transaction lifecycle. |
| Control plane | Approval and audit events. |
| Payment operations | Stablecoin deposit, outgoing payment, settlement, reconciliation. |
| Compliance adapter | Mock review state only. |

This repository is a reference flow, not production banking or custody infrastructure.
