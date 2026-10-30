# Runbook: the Puzzle Trainer on the OCI VM

The app runs on the OCI VM it shares with the scramble challenge, WCA Records Analyser and Timer
App PR Tracker apps, behind the shared, standalone Caddy edge stack (its own `caddy` Compose
project, defined in the scramble-challenge repo's `edge/`). It is the Vite build served as static
files by an nginx container; there is no database, no volume and no secret on the VM besides the
pinned image digest. Everything the VM runs is in [`deploy/`](../deploy). The deploy mechanism is
the same as WCA Records Analyser's and Timer App PR Tracker's.

## What runs where

| Piece | Where | What it does |
|---|---|---|
| `publish` job in `.github/workflows/ci.yml` | GitHub-hosted runner | On `main`, pushes `ghcr.io/tdshaw2000/puzzle-trainer:main` (amd64 and arm64) |
| `deploy` job in `.github/workflows/ci.yml` | GitHub-hosted runner | After `publish`, on `main`: SSHes to the VM with a key restricted to one forced command. Never checks out the repo or holds any other credential |
| `~/apps/puzzle-trainer/deploy-launcher.sh` | VM, the forced command | git-updates `~/apps/puzzle-trainer/repo` to `origin/main`, then runs that checkout's `deploy/run_deploy.sh` |
| `deploy/run_deploy.sh` | VM, from the checkout | Installs the checkout's `deploy/` files into `/srv/puzzle-trainer`, then runs `pull_deploy.py` once |
| `pull_deploy.py` | VM, run by `run_deploy.sh` | Pulls `:main`; if its digest is new, pins it in `.env`, restarts `web`, keeps it if it turns healthy, otherwise rolls back and remembers the bad digest |
| `web` service (`compose.yaml`) | VM, container | The app on port 8000 of the edge Caddy stack's Docker network, alias `puzzle-trainer`. No host port |
| Site block in the scramble-challenge repo's `edge/Caddyfile` | VM, the edge Caddy stack | `puzzle-trainer.duckdns.org` to `puzzle-trainer:8000` |
| `/srv/puzzle-trainer/` | VM, owned by `ubuntu` | `deploy/` kept in sync from the checkout, plus `.env` and `bad-images` (never committed) |

## One-time setup

Steps 1, 5 and 6 (part) are done on GitHub in your browser; the rest on the VM as the `ubuntu`
user (`ssh -i ~/.ssh/oci.key ubuntu@<server-ip>`, the same way you reach it for the other apps).
Nothing here stops or changes the other three apps until step 7, and step 7 only recreates their
Caddy for a few seconds.

1. **Merge the PR** that adds `deploy/` and this runbook, from GitHub. The `publish` job then
   pushes `ghcr.io/tdshaw2000/puzzle-trainer:main`. The `deploy` job that follows will
   fail, because the VM isn't set up yet and a new package starts private. That is expected.

2. **Check the tools.** Both were set up for the other apps, so this should just pass.
   `docker compose version` must be v2.17 or later, `python3 --version` 3.10 or later, and
   `groups` must include `docker`.

3. **Set up the deploy checkout, the launcher and the install directory:**

   ```sh
   mkdir -p ~/apps/puzzle-trainer
   git clone --depth 1 https://github.com/tdshaw2000/puzzle-trainer \
       ~/apps/puzzle-trainer/repo
   cp ~/apps/puzzle-trainer/repo/deploy/deploy-launcher.sh ~/apps/puzzle-trainer/
   chmod +x ~/apps/puzzle-trainer/deploy-launcher.sh
   sudo install -d -o "$USER" -g "$USER" -m 755 /srv/puzzle-trainer
   ```

   The launcher lives beside `repo/`, not inside it: a `git reset --hard` would otherwise
   rewrite the very script that is running it.

4. **Make a deploy key for GitHub Actions** (a dedicated key, not a personal one), restricted
   server-side to running nothing but the launcher:

   ```sh
   ssh-keygen -t ed25519 -f ~/puzzle-deploy-key -C "puzzle-trainer deploy" -N ""
   mkdir -p ~/.ssh && touch ~/.ssh/authorized_keys
   RESTRICTION="command=\"$HOME/apps/puzzle-trainer/deploy-launcher.sh\",no-agent-forwarding,no-X11-forwarding,no-port-forwarding,no-pty"
   echo "$RESTRICTION $(cat ~/puzzle-deploy-key.pub)" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   cat ~/puzzle-deploy-key
   ```

5. **Add two secrets to the GitHub repo** (Settings, Secrets and variables, Actions, New
   repository secret), then delete the key files with `rm ~/puzzle-deploy-key ~/puzzle-deploy-key.pub`:

   - `DEPLOY_HOST`: the server's IP or hostname (the same value the other three repos use).
   - `DEPLOY_SSH_KEY`: the whole private key printed by `cat ~/puzzle-deploy-key`, including the
     `BEGIN` and `END` lines.

6. **Make the image public**, so the VM needs no credentials. On GitHub open your profile's
   *Packages*, then *puzzle-trainer*, then *Package settings*, then **Change visibility**,
   and pick **Public**. Check from the VM:

   ```sh
   sudo docker pull ghcr.io/tdshaw2000/puzzle-trainer:main
   ```

   Then in the repo's Actions tab, open the failed run and choose *Re-run failed jobs*. The
   `deploy` job should print `pull deploy: deployed`. If it fails its health check there is
   nothing to roll back to, so the unhealthy container is left running:
   `cd /srv/puzzle-trainer && docker compose logs web` says why.

7. **Route the hostname.** `puzzle-trainer.duckdns.org` must already point at the VM's IP.
   Merge the scramble-challenge PR that adds the site block (see
   [`deploy/caddy/puzzle-trainer.caddy`](../deploy/caddy/puzzle-trainer.caddy)), which adds
   a `PUZZLE_SITE_ADDRESS` setting to `edge/compose.yaml` and `edge/Caddyfile`. That stack has no
   CI/CD (see its `edge/README.md`), so on the VM, from a checkout of that repo's `edge/`
   directory:

   ```sh
   cp compose.yaml Caddyfile ~/apps/caddy/
   cd ~/apps/caddy
   echo 'PUZZLE_SITE_ADDRESS=puzzle-trainer.duckdns.org' >> .env
   docker compose up -d       # recreates Caddy: a few seconds of downtime for all four apps
   docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile
   curl -sI https://puzzle-trainer.duckdns.org/ | head -1    # HTTP/2 200
   ```

   Later changes to only the `Caddyfile` need no recreate: copy it, validate, then
   `docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile`.

8. **Uptime check.** Add a free external check (healthchecks.io, UptimeRobot or similar) on
   `https://puzzle-trainer.duckdns.org/healthz`.

## Everyday operations

- **Deploys are automatic.** A merge to `main` publishes the image, then the `deploy` job SSHes
  out and the VM runs it. The `deploy` job's logs in Actions say what happened; on the VM,
  `cat /srv/puzzle-trainer/.env` shows the digest now pinned.
- **Deploy now, without waiting for a push:** `~/apps/puzzle-trainer/deploy-launcher.sh`,
  the same thing the deploy key triggers.
- **Logs:** `cd /srv/puzzle-trainer && docker compose logs web --tail 50`.
- **When a PR changes `deploy/`:** nothing manual, with one exception. `run_deploy.sh` copies
  every file under `/srv/puzzle-trainer` (leaving `.env` and `bad-images` alone) on every
  deploy. The exception is `deploy-launcher.sh` itself, which lives outside the checkout by
  design, so a change to it is never picked up automatically. Repeat its install step by hand:
  `cp ~/apps/puzzle-trainer/repo/deploy/deploy-launcher.sh ~/apps/puzzle-trainer/
  && chmod +x ~/apps/puzzle-trainer/deploy-launcher.sh`.

## Rolling back by hand

`pull_deploy.py` rolls back an image that doesn't turn healthy and writes its digest to
`bad-images` so it isn't tried again. A later run that meets a listed digest fails with a message
saying so, rather than reporting success. If the failure was only transient (the edge network
missing during first setup, a slow start), clear it: delete that digest's line from
`/srv/puzzle-trainer/bad-images`, then run `~/apps/puzzle-trainer/deploy-launcher.sh`
(or re-run the failed `deploy` job). To go back to an older image yourself, put its digest in
`/srv/puzzle-trainer/.env` as `PUZZLE_IMAGE=ghcr.io/tdshaw2000/puzzle-trainer@sha256:...`
(the `sha-<commit>` tags in GHCR show which commit each came from) and run
`cd /srv/puzzle-trainer && docker compose up -d --wait web`. The next push to `main`
deploys the newest image again.
