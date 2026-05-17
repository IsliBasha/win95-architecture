import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Paint } from './Paint.jsx';

describe('Paint — structure', () => {
  it('renders a canvas element', () => {
    render(<Paint />);
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders a menubar', () => {
    render(<Paint />);
    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  it('includes a Colors menu item in the menubar', () => {
    render(<Paint />);
    expect(screen.getByRole('menuitem', { name: 'Colors' })).toBeInTheDocument();
  });

  it('renders the drawing toolbar', () => {
    render(<Paint />);
    expect(screen.getByRole('toolbar', { name: /drawing tools/i })).toBeInTheDocument();
  });

  it('renders a color palette group', () => {
    render(<Paint />);
    expect(screen.getByRole('group', { name: /color palette/i })).toBeInTheDocument();
  });

  it('color palette has at least 14 swatches', () => {
    render(<Paint />);
    const swatches = within(
      screen.getByRole('group', { name: /color palette/i }),
    ).getAllByRole('button');
    expect(swatches.length).toBeGreaterThanOrEqual(14);
  });

  it('renders a status region for cursor coordinates', () => {
    render(<Paint />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('Paint — tool selection', () => {
  it('has pencil selected by default', () => {
    render(<Paint />);
    expect(screen.getByRole('button', { name: 'pencil' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('all other tools start unpressed', () => {
    render(<Paint />);
    for (const tool of ['eraser', 'fill', 'line', 'rect', 'ellipse']) {
      expect(screen.getByRole('button', { name: tool })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    }
  });

  it('clicking a tool makes it active and deactivates the previous one', async () => {
    const user = userEvent.setup();
    render(<Paint />);

    await user.click(screen.getByRole('button', { name: 'eraser' }));

    expect(screen.getByRole('button', { name: 'eraser' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'pencil' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('clicking a different tool cycles correctly', async () => {
    const user = userEvent.setup();
    render(<Paint />);

    await user.click(screen.getByRole('button', { name: 'rect' }));
    await user.click(screen.getByRole('button', { name: 'fill' }));

    expect(screen.getByRole('button', { name: 'fill' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'rect' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});

describe('Paint — color palette', () => {
  it('first swatch (black) is active by default', () => {
    render(<Paint />);
    const [firstSwatch] = within(
      screen.getByRole('group', { name: /color palette/i }),
    ).getAllByRole('button');
    expect(firstSwatch).toHaveAttribute('aria-pressed', 'true');
  });

  it('clicking another swatch makes it active', async () => {
    const user = userEvent.setup();
    render(<Paint />);

    const swatches = within(
      screen.getByRole('group', { name: /color palette/i }),
    ).getAllByRole('button');

    await user.click(swatches[4]);

    expect(swatches[4]).toHaveAttribute('aria-pressed', 'true');
    expect(swatches[0]).toHaveAttribute('aria-pressed', 'false');
  });
});
