# =============================================================================
# Hermes Agent v0.16 — Hardened Docker Image for Dokploy
# =============================================================================

# Stage 1: Build from source
FROM python:3.11-slim AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Clone v0.16 (latest stable as of June 2026)
RUN git clone --branch v2026.6.5 --depth 1 https://github.com/NousResearch/hermes-agent.git .

# Install core + extras needed for container environments
RUN pip install --no-cache-dir --prefix=/install . \
    && pip install --no-cache-dir --prefix=/install "hermes-agent[web,cron,voice]"

# Stage 2: Runtime (minimal, hardened)
FROM python:3.11-slim

LABEL maintainer="Simply Enak"
LABEL description="Hermes Agent v0.16 — Simply Enak deployment"

# Install Node.js for web dashboard + mcp-proxy
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    openssh-client \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
       | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
       > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g mcp-proxy \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=builder /install /usr/local

# Install dumb-init for proper signal handling + python-telegram-bot
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    && pip install --no-cache-dir --break-system-packages "python-telegram-bot[webhooks]" aiohttp pyyaml \
    && rm -rf /var/lib/apt/lists/*

# Create unprivileged user
RUN groupadd -g 1000 hermes && \
    useradd -u 1000 -g hermes -m -s /bin/bash hermes

# Create required directories
RUN mkdir -p /home/hermes/.hermes/sessions \
    /home/hermes/.hermes/logs \
    /home/hermes/.hermes/memories \
    /home/hermes/.hermes/skills \
    /home/hermes/.hermes/cron \
    /home/hermes/.hermes/plugins \
    /home/hermes/.local/state/hermes \
    /home/hermes/workspace/website \
    /home/hermes/.ssh \
    && chown -R hermes:hermes /home/hermes

# Copy config files
COPY --chown=hermes:hermes config/ /home/hermes/.hermes/

# Entrypoint, health check, bootstrap
COPY --chown=hermes:hermes entrypoint.py /entrypoint.py
COPY --chown=hermes:hermes healthcheck.py /home/hermes/healthcheck.py
COPY --chown=hermes:hermes health_server.py /home/hermes/health_server.py
COPY --chown=hermes:hermes bootstrap_config.py /bootstrap_config.py
COPY --chown=hermes:hermes entrypoint.sh /home/hermes/entrypoint.sh
RUN chmod +x /home/hermes/entrypoint.sh /home/hermes/health_server.py /bootstrap_config.py

# Run entrypoint as root so it can fix volume permissions
USER root

ENV PYTHONUNBUFFERED=1
ENV PATH="/home/hermes/.local/bin:${PATH}"

# Exposed ports
EXPOSE 8080
EXPOSE 8443
EXPOSE 8642
EXPOSE 8644
EXPOSE 9119

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD python3 /home/hermes/healthcheck.py

CMD ["python3", "/entrypoint.py"]