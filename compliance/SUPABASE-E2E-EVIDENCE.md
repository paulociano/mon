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

The following require a real authenticated browser session and remain open:

- magic-link email delivery and redirect;
- persisted browser session;
- real client push/pull;
- real two-account interaction through Supabase Auth;
- cloud-data deletion through the UI;
- `delete-account` invocation with a real user JWT;
- browser-side sign-out/local cleanup;
- post-operation log review.

No real Auth users existed in the project at the time of this test.
