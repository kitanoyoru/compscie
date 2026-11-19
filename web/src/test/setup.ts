// Pin the zone so local-calendar behaviour is deterministic on any machine or CI runner.
process.env.TZ = 'America/Los_Angeles'

import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// The app tsconfig has no Node types; this is the only Node global the setup touches.
declare const process: { env: Record<string, string | undefined> }

afterEach(() => {
  cleanup()
})
