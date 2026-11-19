// Global setup runs once in the main process before any worker spawns, so every
// worker inherits this zone regardless of import order. It lives outside src/ so the
// app tsconfig does not need Node types.
export default function setup(): void {
  process.env.TZ = 'America/Los_Angeles'
}
