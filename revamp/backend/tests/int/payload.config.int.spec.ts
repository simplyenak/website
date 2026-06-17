import { test, expect, describe } from 'vitest'

describe('Payload Configuration File', () => {
  test('payload.config.ts should be a valid TypeScript file', async () => {
    // Just test that we can import it without syntax errors
    const configModule = await import('../../src/payload.config.ts')
    expect(configModule).toBeDefined()
  })
  
  test('payload.config.ts should export a default object', async () => {
    const configModule = await import('../../src/payload.config.ts')
    expect(configModule.default).toBeDefined()
    expect(typeof configModule.default).toBe('object')
  })
})

describe('Payload Configuration Structure (using require)', () => {
  // Use require instead of import to avoid triggering collection imports
  let config: any = null
  
  beforeAll(() => {
    try {
      config = require('../../src/payload.config.ts').default
    } catch (e) {
      console.error('Failed to require payload config:', e)
      config = null
    }
  })
  
  test('should have a config object', () => {
    expect(config).not.toBeNull()
    if (config) {
      expect(typeof config).toBe('object')
    }
  })
  
  test.skipIf(!config)('should have collections', () => {
    expect(config.collections).toBeDefined()
    expect(Array.isArray(config.collections)).toBe(true)
    expect(config.collections.length).toBeGreaterThan(0)
  })
  
  test.skipIf(!config)('should have required properties', () => {
    expect(config.editor).toBeDefined()
    expect(config.secret).toBeDefined()
    expect(config.typescript).toBeDefined()
    expect(config.db).toBeDefined()
  })
})
