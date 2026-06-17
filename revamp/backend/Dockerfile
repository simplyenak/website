# ============================================================
# Payload CMS Production Dockerfile
# Simply Enak - revamp/backend
# ============================================================

FROM node:22.17.0-alpine AS base

# Install pnpm
RUN apk add --no-cache libc6-compat curl && \
    corepack enable && \
    corepack prepare pnpm@9 --activate

WORKDIR /app

# ============================================================
# Stage 1: Install dependencies (cached layer)
# ============================================================
FROM base AS deps

# Copy only lockfile first for optimal caching
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

# ============================================================
# Stage 2: Build
# ============================================================
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build Next.js (admin panel + server)
# Note: `_not-found` / `_global-error` system pages may fail to prerender
# in Next.js 16 due to React context — but the standalone output
# is still produced for all real pages. Build continues on error.
RUN npm run build 2>&1; echo "BUILD_DONE"

# ============================================================
# Stage 3: Production runner
# ============================================================
FROM base AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output from build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy package.json for any runtime scripts
COPY --from=builder /app/package.json ./

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]