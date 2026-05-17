import { describe, it, expect } from 'vitest';
import { projects } from './projects.js';

describe('projects data — required shape', () => {
  it('all projects have required fields', () => {
    for (const p of projects) {
      expect(p.id, `${p.id} missing id`).toBeTruthy();
      expect(p.name, `${p.id} missing name`).toBeTruthy();
      expect(p.description, `${p.id} missing description`).toBeTruthy();
      expect(Array.isArray(p.stack), `${p.id} stack must be array`).toBe(true);
      expect(p.href, `${p.id} missing href`).toBeTruthy();
      expect(p.iconType, `${p.id} missing iconType`).toBeTruthy();
    }
  });
});

describe('projects data — demo branch (win95-demo)', () => {
  it('does not contain personal GitHub repo links', () => {
    for (const p of projects) {
      expect(p.href).not.toContain('IsliBasha/');
    }
  });

  it('includes the Minesweeper feature', () => {
    expect(projects.map((p) => p.id)).toContain('minesweeper');
  });

  it('includes the Snake feature', () => {
    expect(projects.map((p) => p.id)).toContain('snake');
  });

  it('includes the screensaver feature', () => {
    expect(projects.map((p) => p.id)).toContain('screensaver');
  });

  it('includes the terminal / DOS shell feature', () => {
    expect(projects.map((p) => p.id)).toContain('terminal');
  });
});
