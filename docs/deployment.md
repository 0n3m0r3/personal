# Telalucis deployment

## Release path
- Source: 0n3m0r3/personal, reviewed PR to main.
- CI: .github/workflows/container.yaml, ARM64 build, TypeScript/chat tests and
  HTTP smoke checks before publishing ghcr.io/0n3m0r3/personal:sha-<commit>.
- Runtime: Node 24 / Next.js 15.5.25 standalone, UID 1000, read-only root,
  no capabilities or privilege escalation, bounded temporary cache/tmp volumes.
- GitOps: 0n3m0r3/infra-cluster projects/enabled/personal.yaml pins an immutable
  digest. Argo CD creates personal-staging (internal) and personal-prod (public).
  Per-environment runtime ConfigMaps come from k8s/staging and k8s/prod.
- No database or persistent volume. Public AI is disabled and its launcher hidden.
  Activating a provider later requires the controls in chat-security.md.

## Domains
Initial verification URL: https://personal.telalucis.com, through the existing
Cloudflare public tunnel and traefik-public. No new public node ports.
Vercel currently uses www.louka-altdorfreynes.com with an apex redirect.
The owner is transferring this domain to Cloudflare independently.

Before switching traffic:
1. Confirm the zone is active in the correct Cloudflare account.
2. Import the existing zone in the infra-cluster Cloudflare OpenTofu stack.
3. Review a saved plan adding the zone's apex/www tunnel routes and proxied
   CNAMEs. Preserve mail and verification records. Never point at the node IP.
4. Add exact apex/www ingress hosts to the personal production app and preserve
   the canonical www redirect. Validate the certificate and all localized routes.
5. Retire Vercel routing only after the new path responds correctly.

The existing telalucis.com wildcard already reaches the public tunnel. The
custom-domain migration is separate from first deployment; do not claim it
complete until authoritative DNS, TLS and HTTP are verified.

## Checks and rollback
Run yarn build, yarn tsc --noEmit, node --test tests/chat.test.mjs, and
node tests/deployment-smoke.mjs http://localhost:3003 against the restricted
container. For infrastructure run make test and CI, then verify all four
personal Argo CD applications, readiness, logs and the public URL.
Rollback through a reviewed infra-cluster PR restoring the preceding digest;
keep the previous image. Do not patch live Deployments around Argo CD.
