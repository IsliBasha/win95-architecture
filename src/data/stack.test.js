import { describe, it, expect } from 'vitest';
import { stackTree } from './stack.js';

describe('stack data — demo project', () => {
  it('uses the C:\\WIN95\\ path prefix (not personal user path)', () => {
    expect(stackTree.startsWith('C:\\WIN95\\')).toBe(true);
  });

  it('lists React as the UI framework', () => {
    expect(stackTree).toContain('React');
  });

  it('lists Vite as the build tool', () => {
    expect(stackTree).toContain('Vite');
  });

  it('lists Vitest for testing', () => {
    expect(stackTree).toContain('Vitest');
  });

  it('does not reference a personal user directory', () => {
    expect(stackTree).not.toContain('ISLI');
  });
});
