# Screen matrix — Vidya Pragati Setu

Updated: 2026-11-26. `API wired` describes current frontend behavior with `NEXT_PUBLIC_USE_MOCK=false`. `Endpoint(s)` lists the live resource path used by the screen or the endpoint available for future wiring. An endpoint existing in FastAPI does not make a fixture screen API-wired. Full status and browser coverage are in [`STATUS.md`](STATUS.md).

| Code | Route | API hooks used in page | Endpoint(s) | API wired | Cross-role dependency | Tier |
|---|---|---|---|---|---|---:|
| P1 | `/` | — | Static | No | — | 3 |
| P2 | `/login` | Auth resource | `POST /auth/otp/send` | Yes | — | 1 |
| P3 | `/login/verify` | Auth resource | `POST /auth/otp/verify` | Yes | — | 1 |
| S1 | `/student` | `useMe`, `useMySchemes`, `useApplications`, `useNotifications`, `useMyCycle` | `/students/me`, `/students/me/schemes`, `/applications`, `/notifications`, `/students/me/cycle` | Yes | Reads S5, SC3, SC5, A3 changes | 1 |
| S2 | `/student/schemes/[id]` | `useExplain`, `useMySchemes`, `useMe` | `/ai/explain/{code}` and student scheme/profile reads | Yes | — | 1 |
| S3 | `/student/vault` | Fixture | `GET /documents` exists | No | Displays S4 uploads when wired | 3 |
| S4 | `/student/vault/upload` | `useUploadDocument`, `useDocuments`, `useMe` | `POST /documents`, `GET /documents` | Yes | Upload is persisted in API | 1 |
| S5 | `/student/apply` | `useMySchemes`, `useApplications`, `useSendGuardianOtp`, `useBulkApply` | `POST /applications/guardian-otp/send`, `POST /applications/bulk` | Yes | Creates SC2/SC3/D2/S6 records | 1 |
| S6 | `/student/applications` | `useApplications`, `useApplicationTimeline`, `useMe` | `GET /applications`, `GET /applications/{code}/timeline` | Yes | Reads SC3/D2 state changes | 1 |
| S7 | `/student/cycle` | `useMyCycle`, `useMe` | `GET /students/me/cycle` | Yes | Reads SC5 handover | 1 |
| S8 | `/student/payments` | `usePayments`, `useMe` | `GET /students/me/payments` | Yes | Reads A3 DBT result | 1 |
| S9 | `/student/grievances` | Fixture | `GET/POST /grievances` exists | No | D5 when wired | 3 |
| S10 | `/student/notifications` | `useNotifications`, read/read-all mutations | `/notifications`, `/notifications/{id}/read`, `/notifications/read-all` | Yes | Reads X1 and DBT notifications | 1 |
| S11 | `/student/profile` | Fixture | Profile, consent, export endpoints exist | No | — | 3 |
| S12 | `/student/assistant` | Fixture | `POST /ai/chat` exists | No | — | 3 |
| SC1 | `/school` | Fixture | `GET /analytics/school` exists | No | Aggregates school activity | 2 |
| SC2 | `/school/queue` | `useApplications`, `useApprove`, `useBulkApprove` | `GET /applications`, application approval routes | Yes | Reads S5; actions update S6/D2 | 1 |
| SC3 | `/school/queue/[id]` | `useApplication`, `useApprove`, `useReject`, `useRequestCorrection` | `GET /applications/{code}`, approval/reject/correction routes | Yes | Updates S6 and D2 queue | 1 |
| SC4 | `/school/records` | Fixture | `/records/{attendance,marks}/upload` and `/confirm` exist | No | — | 3 |
| SC5 | `/school/cycles` | `useCycleOverview`, `useReceiveBatch`, `useHandover` | `/cycles/overview`, `/batches/{id}/receive`, `/handover/initiate`, `/handover/confirm` | Yes | Reads V1 dispatch; updates S7 | 1 |
| SC6 | `/school/reports` | Fixture | `GET /analytics/school/reports` exists (partial) | No | Aggregates school activity | 3 |
| D1 | `/deo` | Fixture | `GET /analytics/district` exists | No | Aggregates district activity | 2 |
| D2 | `/deo/approvals` | `useApplications`, `useBulkApprove`, delegation hooks | `/applications`, `/applications/bulk-approve`, `/delegations/me`, `/delegations` | Yes | Reads SC3; advances to A3 | 1 |
| D3 | `/deo/cycles` | Fixture | `GET /cycles/overview` exists | No | Reads V1/SC5 logistics | 2 |
| D4 | `/deo/at-risk` | Fixture | `GET /ml/dropout/students` exists | No | — | 2 |
| D5 | `/deo/grievances` | Fixture | `GET /grievances` exists | No | Reads S9 when wired | 3 |
| A1 | `/admin` | Fixture | State analytics and forecast endpoints exist | No | Aggregates all roles | 2 |
| A2 | `/admin/schemes/builder` | Fixture | Admin scheme and eligibility test endpoints exist | No | Scheme changes affect later evaluations | 2 |
| A3 | `/admin/funds` | Funds and DBT hooks | `/funds/overview`, `/dbt/reconciliation`, `/dbt/sanction`, `/dbt/initiate`, retry | Yes | Updates S8/S10 | 1 |
| A4 | `/admin/fraud` | Fixture | `/fraud/flags` endpoints exist | No | — | 2 |
| A5 | `/admin/audit` | Fixture | `/audit/logs`, `/audit/verify-chain` exist | No | Observes other role actions | 2 |
| V1 | `/vendor` | `useVendorBatches`, `useCreateBatch`, `useDispatchBatch` | `/vendor/batches`, `/batches/{id}/dispatch` | Yes | Dispatch is received by SC5 | 1 |
| X1 | `/demo/simulate` | `useDemoPromote` | `POST /demo/promote/{cts_id}` | Partial | Promotion creates S10 notice and renewal diff | 1 |

## Acceptance evidence

- `make check-contract`: 80 endpoint calls passed across six seeded roles. This does not verify that all 33 pages call those endpoints.
- `make e2e`: browser Golden Path passed three consecutive times against separate temporary SQLite databases.
- `make qa`: authenticated route screenshots cover 33/33 routes. The screenshots check browser loading, console/page and API errors, broken images, font availability, and document-level horizontal overflow; they do not certify pixel-level design fidelity.
- Current E2E completes mock DBT deterministically through the demo simulator API after the admin initiates payment. It does not prove an external PFMS transfer or guarantee background-task timing.
