# MON Supabase production handoff

## Observed environment

- Supabase project: `MON`
- Project ref: `gpmobddlexssivfxzzjw`
- Region: `sa-east-1`
- Project API URL: `https://gpmobddlexssivfxzzjw.supabase.co`
- GitHub Pages production URL: `https://paulociano.github.io/mon/`
- `public.mon_user_state`: RLS enabled, anonymous table access revoked, authenticated CRUD ownership-scoped by `auth.uid()`
- Edge Function `delete-account`: deployed and JWT verification enabled
- Edge Function `public-config`: public, read-only bootstrap endpoint for browser-safe Supabase configuration

## Frontend public configuration

The repository does not commit the publishable key. MON resolves browser-safe cloud configuration in this order:

1. `globalThis.MON_CLOUD_RUNTIME_CONFIG.publishableKey`;
2. the deploy-time meta tag `<meta name="mon-supabase-publishable-key" content="">`;
3. the public `public-config` Edge Function.

The Edge Function returns only the project URL and active `sb_publishable_...` key. Supabase documents publishable keys as safe for public clients when RLS and least-privilege grants protect the data. Secret/service-role material is never returned.

This removes the GitHub Pages key-injection blocker while preserving the ability to override/rotate browser configuration later.

## Supabase Auth URL configuration

Hosted production configuration:

- Site URL: `https://paulociano.github.io/mon/`
- Allowed Redirect URL: `https://paulociano.github.io/mon/`

The production flow now uses email + password as the primary authentication path. Account creation uses `signUp`, direct login uses `signInWithPassword`, and already-authenticated users can update their password through `updateUser`.

On 5 October 2026, a new real production account was created, its email was confirmed, a password login was observed, and the corresponding `mon_user_state` row was written and advanced to revision 2. This provides runtime evidence that the configured production Auth URLs and account flow are operational.

## Verification still required

After the Auth URLs are configured, use disposable test accounts and prove:

1. browser session survives an explicit reload and returns directly to the app;
2. user A can create/read/update/delete only A's `mon_user_state`;
3. user B cannot access A's row through real browser Auth sessions;
4. optimistic revision conflicts are detected;
5. cloud-data deletion removes the row while retaining local progress;
6. full account deletion removes the Auth identity and cascades the cloud state;
7. the browser session is cleared locally after sign-out/deletion;
8. function/database logs contain no leaked tokens or personal payloads.

Do not mark these gates complete until the behavior is observed end to end.


## Account deletion session behavior

Before deleting the Auth user, `delete-account` revokes the user's refresh sessions globally. Supabase access-token JWTs may remain cryptographically valid until their encoded expiry, so the database design also relies on deletion of the Auth identity plus the `ON DELETE CASCADE` removal of `mon_user_state`. New cloud rows cannot be recreated for a deleted identity because of the foreign key to `auth.users`.


## Database E2E evidence — 5 October 2026

Tests were executed directly against the production MON database inside explicit transactions that were rolled back. Synthetic Auth identities and state rows therefore did not persist.

Observed results:

- RLS identity simulation resolved `auth.uid()` to user A;
- user A could read its own `mon_user_state`;
- user A could not read user B's state;
- user A could not update user B's state;
- user A could not delete user B's state;
- user A could update its own state;
- an update with expected `revision=1` succeeded once;
- a second update using the now-stale `revision=1` matched zero rows, proving the database-side CAS contract used by MON;
- deleting the synthetic `auth.users` identity removed the corresponding `mon_user_state` row through the foreign-key cascade;
- all synthetic records were rolled back after verification.

These checks validate database authorization and concurrency contracts. They do **not** replace a real browser Auth flow, email delivery, persisted session, client sync, or the deployed `delete-account` HTTP path.

That earlier database-only verification preceded the real Auth flow. See the real production evidence below.


## Real Auth E2E evidence — 5 October 2026

Observed against the production Supabase project after the auth-first login rollout:

- a new real Auth identity was created at 07:34:08 UTC;
- its email was confirmed at 07:34:20 UTC;
- a real sign-in was recorded at 07:34:20 UTC;
- a matching `mon_user_state` row exists;
- the new row reached revision 2;
- the cloud row was updated again at 07:35:02 UTC, after the recorded login;
- the project currently contains two Auth identities and two cloud-state rows: one historical account and the newly created account.

No email address or token value is recorded in this handoff.

**Result:** real signup, confirmation, password login, and client-to-cloud state creation/update are verified. Browser session persistence across reload, real two-account cross-access, cloud-only deletion, full identity deletion, and post-operation log review remain open.
