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

- persisted browser session after explicit reload;
- real client pull after reload/second device;
- real two-account cross-access denial through browser sessions;
- cloud-data deletion through the UI;
- `delete-account` invocation with a real user JWT;
- browser-side sign-out/local cleanup;
- post-operation log review.
