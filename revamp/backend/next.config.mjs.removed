/** @type {import('next').NextConfig} */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.resolve(__dirname),
  // Ensure the server can be reached from Docker networking
  serverExternalPackages: ['@swc/core', 'drizzle-kit', '@libsql/linux-x64-gnu', '@libsql/darwin-arm64', '@libsql/win32-x64-msvc'],
};

export default nextConfig;