FROM oven/bun:1 AS base

# Set the environment
ENV NODE_ENV production

# Build the app
FROM base AS build
WORKDIR /app
COPY . .
RUN bun install
RUN bun run next:build

# Expose the app port
EXPOSE 3008
ENV HOSTNAME="0.0.0.0"
ENV PORT=3008

CMD ["bun", "src/server.ts"]