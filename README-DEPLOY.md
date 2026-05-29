# TK Service Public Pages Deployment

This version removes login from the main workflow and is designed for Cloudflare Pages + GitHub deployment.

## What changed

- No Render dependency.
- No laptop/Cloudflare Tunnel dependency.
- No login required for generating/updating the daily report.
- Daily report storage uses Cloudflare KV through Pages Functions.
- Reset is public in this emergency version, so anyone with the link can reset the report.

## Cloudflare Pages setup

1. Push this folder to a new GitHub repository.
2. Cloudflare Dashboard -> Workers & Pages -> Create -> Pages -> Connect to Git.
3. Select the repo.
4. Build settings:
   - Framework preset: None
   - Build command: leave empty
   - Build output directory: `/`
5. Deploy.

## Add KV storage

1. Cloudflare Dashboard -> Workers & Pages -> KV -> Create namespace.
2. Name it: `tkservice_daily_report`.
3. Open your Pages project.
4. Settings -> Functions -> KV namespace bindings -> Add binding.
5. Variable name must be exactly:

```text
TKS_DAILY_REPORT
```

6. Select the namespace you created.
7. Redeploy the Pages project.

## Test

Open:

```text
https://YOUR-DOMAIN/api/health
```

Expected:

```json
{"ok":true,"publicAccessMode":true,"kvBound":true}
```

If `kvBound` is false, daily report storage will not work until the KV binding is added.

## Domain

Use a fresh subdomain first, for example:

```text
tkservice-public.lknzmzd.xyz
```

Do not reuse `tkservice.lknzmzd.xyz` until the old Tunnel/DNS record is removed.
