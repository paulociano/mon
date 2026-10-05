# MON — Supabase E2E Evidence

**Date:** 5 October 2026  
**Project:** MON (`gpmobddlexssivfxzzjw`)  
**Method:** production database verification with synthetic identities inside rollback-only transactions.

## RLS isolation

Expected:
- authenticated user can operate on its own row;
- authenticated user cannot observe or mutate another user's row.

Observed:
- own row visible;
- other row invisible;
- cross-user update affected 0 rows;
- cross-user delete affected 0 rows;
- own-row update affected 1 row.

Result: **PASS**

## Optimistic concurrency

Expected:
- update using the current `revision` succeeds;
- repeating the update with a stale expected revision affects no row.

Observed:
- revision 1 → 2 update affected 1 row;
- stale revision 1 update affected 0 rows.

Result: **PASS**

## Auth identity cascade

Expected:
- deleting an Auth identity removes its `mon_user_state` row through `ON DELETE CASCADE`.

Observed:
- after synthetic Auth deletion, matching cloud-state row count was 0.

Result: **PASS**

## Cleanup

All test users and state records existed only inside transactions followed by `ROLLBACK`.

Result: **PASS**

## Still unverified

## Real production Auth follow-up

A subsequent real production test verified:

- email/password account creation;
- email confirmation;
- successful password sign-in;
- creation of a matching `mon_user_state` row;
- client-driven cloud revision reaching 2;
- a cloud update occurring after the recorded login.

At that point the project contained two real Auth identities and two cloud-state rows: one historical account and one newly created account. No email address or token is recorded here.

Result: **PASS — signup/login/client push**

## Still unverified

The following still require real browser-session checks or a destructive test:

- real client pull on a second device;
- real two-account cross-access denial through browser sessions;
- cloud-data deletion through the UI;
- browser-side local cleanup after deletion;
- post-operation log review.


## Session persistence and legacy-account cleanup

Observed after the new email/password account was created:

- the user explicitly reloaded the production MON page and remained authenticated;
- session persistence across reload therefore passed;
- the earlier historical Auth identity was then deleted with explicit user approval;
- readback after deletion showed exactly one Auth identity remaining;
- readback showed exactly one `mon_user_state` row remaining;
- the remaining row belongs to the current account and retained revision 2;
- the historical cloud row disappeared through the existing cascade.

Result: **PASS — session persistence and legacy-account cleanup**


## Real authenticated account deletion

The current production account was deleted through the MON UI by the authenticated user.

Fresh backend readback after the operation showed:

- Auth users: 0;
- Auth sessions: 0;
- `mon_user_state` rows: 0.

This verifies removal of the Auth identity, server-side session cleanup, and cascade deletion of the cloud learning state.

The Supabase log-query backend returned an error when attempting post-operation log inspection, so log review remains open.

Result: **PASS — full real account deletion**
