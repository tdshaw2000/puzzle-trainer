# The site is static, so it builds once on the runner's own platform and only the served
# stage is built per platform (amd64 for local runs, arm64 for the OCI A1 VM).
FROM --platform=$BUILDPLATFORM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html tsconfig.json vite.config.ts ./
COPY src src
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine

LABEL org.opencontainers.image.source=https://github.com/tdshaw2000/puzzle-trainer

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/

# The Compose project and deploy scripts, so the VM can copy them out of the image
# (docs/runbook.md) instead of needing a checkout of the repository.
COPY deploy /opt/puzzle-trainer/deploy

# The base image's own unprivileged user, named here so the image never runs as root.
USER 101:101

EXPOSE 8000

# The pull deploy (deploy/pull_deploy.py) waits for this before keeping a new image.
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
    CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8000/healthz"]
