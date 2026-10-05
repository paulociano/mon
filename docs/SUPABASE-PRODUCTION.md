# MON Supabase production handoff

## Observed environment

- Supabase project: `MON`
- Project ref: `gpmobddlexssivfxzzjw`
- Region: `sa-east-1`
- Project API URL: `https://gpmobddlexssivfxzzjw.supabase.co`
- GitHub Pages production URL: `https://paulociano.github.io/mon/`
- `public.mon_user_state`: RLS enabled, anonymous table access revoked, authenticated CRUD ownership-scoped by `auth.uid()`
- Edge Function `delete-account`: deployed and JWT verification enabled

## Frontend public-key injection

The repository does not commit the publishable key.

`config/cloud.js` reads it from either:

1. `globalThis.MON_CLOUD_RUNTIME_CONFIG.publishableKey`; or
2. the empty meta tag `<meta name="mon-supabase-publishable-key" content="">`.

The hosting/deploy layer should inject the project's active `sb_publishable_...` value into one of those public-runtime channels. This key is intended for public clients, but privileged secret/service-role material must never enter the browser or repository.

## Supabase Auth URL configuration

For the hosted production project, configure in Authentication → URL Configuration:

- Site URL: `https://paulociano.github.io/mon/`
- Allowed Redirect URL: `https://paulociano.github.io/mon/`

MON currently calls `signInWithOtp` and supplies an `emailRedirectTo` based on the current page. The production site uses hash routing, so authentication should return to the same Pages root.

Do not add wildcard production redirects when the exact URL is sufficient.

## Verification still required

After the publishable key and Auth URLs are configured, use disposable test accounts and prove:

1. magic-link sign-in creates a valid browser session;
2. user A can create/read/update/delete only A's `mon_user_state`;
3. user B cannot access A's row;
4. optimistic revision conflicts are detected;
5. cloud-data deletion removes the row while retaining local progress;
6. full account deletion removes the Auth identity and cascades the cloud state;
7. the browser session is cleared locally;
8. function/database logs contain no leaked tokens or personal payloads.

Do not mark these gates complete until the behavior is observed end to end.
