# syntax=docker/dockerfile:1

# ===============================
# Stage 1: Dependencies
# ===============================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm config set registry https://registry.npmmirror.com

# Install dependencies
RUN pnpm install --frozen-lockfile

# ===============================
# Stage 2: Builder
# ===============================
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN pnpm run db:generate

# Set environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Create initial SQLite database with schema
RUN mkdir -p /app/data && \
    DATABASE_URL="file:/app/data/baby.db" pnpm run db:push

# Build the application
RUN pnpm run build

# Prepare Prisma client for production
# Remove any @prisma references from standalone that might conflict
RUN rm -rf .next/standalone/node_modules/@prisma .next/standalone/node_modules/.prisma 2>/dev/null || true && \
    cp -r node_modules/.pnpm/@prisma+client@*/node_modules/.prisma .next/standalone/node_modules/ && \
    cp -r node_modules/.pnpm/@prisma+client@*/node_modules/@prisma .next/standalone/node_modules/

# ===============================
# Stage 3: Runner (Production)
# ===============================
FROM node:20-alpine AS runner
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    ffmpeg \
    libc6-compat \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files from builder (standalone now includes Prisma)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Copy pre-built SQLite database (empty with schema)
COPY --from=builder /app/data/baby.db /app/data/baby.db.template

# Copy entrypoint script
COPY docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Create data directory for SQLite
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data /app/data/baby.db.template

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application with database initialization
CMD ["/app/entrypoint.sh"]
