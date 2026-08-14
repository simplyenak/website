# =============================================================================
# Hermes Agent v0.19.0 — Docker Swarm-optimized image
# =============================================================================
FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install hermes-agent v0.20.0 (git tag v2026.8.3 — 0.20.0 is not on PyPI)
RUN HERMES_NIX_BUILD=1 pip install --no-cache-dir \
    "git+https://github.com/NousResearch/hermes-agent.git@v2026.8.3#egg=hermes-agent[web,cron,voice]" && \
    pip install --no-cache-dir aiohttp[speedups] "python-telegram-bot[webhooks]" yt-dlp google-auth

# Create the hermes user and all needed directories
RUN useradd -m -s /bin/bash hermes && \
    mkdir -p \
      /home/hermes/.hermes \
      /home/hermes/workspace \
      /home/hermes/.ssh \
      /home/hermes/.local/state/hermes/gateway-locks && \
    # CRITICAL: make locks dir world-writable so root (without DAC_OVERRIDE)
    # can write to it even when Swarm drops all capabilities
    chmod 777 /home/hermes/.local/state/hermes/gateway-locks && \
    chmod 755 /home/hermes

WORKDIR /home/hermes

# Copy helper scripts (with hermes ownership for fallback compat)
COPY --chown=hermes:hermes entrypoint.py /entrypoint.py
COPY --chown=hermes:hermes bootstrap_config.py /bootstrap_config.py
COPY --chown=hermes:hermes entrypoint.sh /home/hermes/entrypoint.sh
COPY --chown=hermes:hermes health_server.py /home/hermes/health_server.py
COPY --chown=hermes:hermes healthcheck.py /home/hermes/healthcheck.py

# Copy config directory and scripts (ssh config, etc.)
COPY --chown=hermes:hermes config/ /home/hermes/
COPY --chown=hermes:hermes scripts/ /home/hermes/scripts/

# Note: SOUL.md is intentionally NOT baked into the image.
# It lives on the volume (backed up daily) and in the local
# build context at config/SOUL.md for reference.

# Set permissions
RUN chown -R hermes:hermes /home/hermes && \
    chmod +rx /entrypoint.py /bootstrap_config.py && \
    chmod +rx /home/hermes/entrypoint.sh && \
    chmod +rx /home/hermes/health_server.py /home/hermes/healthcheck.py && \
    # Ensure locks dir stays world-writable after chown
    chmod 777 /home/hermes/.local/state/hermes/gateway-locks && \
    # Ensure all copied files are world-readable (critical without DAC_OVERRIDE)
    chmod -R o+r /home/hermes/

ENV PATH="/home/hermes/.local/bin:${PATH}"

USER root

EXPOSE 8080 8443 8642 8644 9119

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD python3 /home/hermes/healthcheck.py

CMD ["python3", "/entrypoint.py"]
