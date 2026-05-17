import { useCallback, useEffect, useRef, useState } from 'react';

const TOOLS = ['pencil', 'eraser', 'fill', 'line', 'rect', 'ellipse'];

const PALETTE = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080',
  '#000080', '#800080', '#808040', '#004040', '#0080ff', '#004080',
  '#8000ff', '#804000',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff',
  '#0000ff', '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff',
  '#ff0080', '#ff8040',
];

const CANVAS_W = 400;
const CANVAS_H = 270;

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function floodFill(ctx, startX, startY, fillColor) {
  const { width, height } = ctx.canvas;
  const img = ctx.getImageData(0, 0, width, height);
  const d = img.data;
  const [fr, fg, fb] = hexToRgb(fillColor);
  const i0 = (startY * width + startX) * 4;
  const [tr, tg, tb, ta] = [d[i0], d[i0 + 1], d[i0 + 2], d[i0 + 3]];
  if (tr === fr && tg === fg && tb === fb && ta === 255) return;

  const stack = [startX, startY];
  while (stack.length) {
    const sy = stack.pop();
    const sx = stack.pop();
    if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue;
    const i = (sy * width + sx) * 4;
    if (d[i] !== tr || d[i + 1] !== tg || d[i + 2] !== tb || d[i + 3] !== ta) continue;
    d[i] = fr; d[i + 1] = fg; d[i + 2] = fb; d[i + 3] = 255;
    stack.push(sx + 1, sy, sx - 1, sy, sx, sy + 1, sx, sy - 1);
  }
  ctx.putImageData(img, 0, 0);
}

function getCanvasPos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(CANVAS_W - 1, Math.round(e.clientX - rect.left))),
    y: Math.max(0, Math.min(CANVAS_H - 1, Math.round(e.clientY - rect.top))),
  };
}

function ToolIcon({ tool }) {
  const p = { width: 20, height: 20, viewBox: '0 0 20 20', shapeRendering: 'crispEdges', 'aria-hidden': true };
  switch (tool) {
    case 'pencil':
      return (
        <svg {...p}>
          <rect x="14" y="2" width="3" height="2" fill="#ffd700" />
          <rect x="13" y="4" width="3" height="2" fill="#ffd700" />
          {[0,1,2,3,4,5,6].map(i => (
            <rect key={i} x={12 - i} y={6 + i} width="3" height="1" fill="#000000" />
          ))}
          <rect x="5" y="13" width="3" height="2" fill="#000000" />
          <rect x="4" y="15" width="2" height="3" fill="#000000" />
        </svg>
      );
    case 'eraser':
      return (
        <svg {...p}>
          <rect x="2" y="10" width="8" height="7" fill="#ffffff" stroke="#808080" />
          <rect x="10" y="10" width="8" height="7" fill="#ff9999" stroke="#808080" />
          <rect x="2" y="17" width="16" height="1" fill="#808080" />
        </svg>
      );
    case 'fill':
      return (
        <svg {...p}>
          <rect x="9" y="1" width="3" height="2" fill="#808080" />
          <rect x="7" y="3" width="7" height="2" fill="#000080" />
          <rect x="5" y="5" width="5" height="7" fill="#000080" />
          <rect x="4" y="12" width="4" height="3" fill="#000080" />
          <rect x="2" y="14" width="4" height="3" fill="#000080" />
          <rect x="11" y="11" width="7" height="7" fill="#ff0000" />
        </svg>
      );
    case 'line':
      return (
        <svg {...p}>
          {[0,1,2,3,4,5,6,7].map(i => (
            <rect key={i} x={2 + i * 2} y={16 - i * 2} width="2" height="2" fill="#000000" />
          ))}
        </svg>
      );
    case 'rect':
      return (
        <svg {...p}>
          <rect x="2" y="4" width="16" height="12" fill="none" stroke="#000000" strokeWidth="2" />
        </svg>
      );
    case 'ellipse':
      return (
        <svg {...p}>
          <ellipse cx="10" cy="10" rx="8" ry="6" fill="none" stroke="#000000" strokeWidth="2" />
        </svg>
      );
    default:
      return null;
  }
}

export function Paint() {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const isDrawingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }, []);

  const getCtx = useCallback(() => canvasRef.current?.getContext('2d'), []);

  const handleMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = getCanvasPos(canvas, e);
      isDrawingRef.current = true;
      startRef.current = pos;

      const ctx = getCtx();
      if (!ctx) return;

      if (tool === 'fill') {
        floodFill(ctx, pos.x, pos.y, color);
        isDrawingRef.current = false;
        return;
      }

      if (tool === 'pencil' || tool === 'eraser') {
        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        ctx.lineWidth = tool === 'eraser' ? 10 : 2;
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        return;
      }

      snapshotRef.current = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
    },
    [tool, color, getCtx],
  );

  const handleMouseMove = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = getCanvasPos(canvas, e);
      setCoords(pos);

      if (!isDrawingRef.current) return;
      const ctx = getCtx();
      if (!ctx) return;

      if (tool === 'pencil' || tool === 'eraser') {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        return;
      }

      if (!snapshotRef.current) return;
      ctx.putImageData(snapshotRef.current, 0, 0);

      const { x: sx, y: sy } = startRef.current;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      if (tool === 'line') {
        ctx.lineCap = 'square';
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        return;
      }

      if (tool === 'rect') {
        ctx.strokeRect(sx, sy, pos.x - sx, pos.y - sy);
        return;
      }

      if (tool === 'ellipse') {
        const rx = Math.abs(pos.x - sx) / 2;
        const ry = Math.abs(pos.y - sy) / 2;
        ctx.beginPath();
        ctx.ellipse(sx + (pos.x - sx) / 2, sy + (pos.y - sy) / 2, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
    [tool, color, getCtx],
  );

  const handleMouseUp = useCallback(() => {
    isDrawingRef.current = false;
    snapshotRef.current = null;
  }, []);

  const handleClear = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }, [getCtx]);

  return (
    <>
      <div className="explorer-menubar" role="menubar">
        {['File', 'Edit', 'View', 'Image', 'Colors', 'Help'].map((item) => (
          <button
            key={item}
            type="button"
            className="explorer-menu-item"
            role="menuitem"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="paint-workspace">
        <div className="paint-toolbar" role="toolbar" aria-label="Drawing tools">
          {TOOLS.map((t) => (
            <button
              key={t}
              type="button"
              className={`win-btn paint-tool-btn${t === tool ? ' paint-tool-btn--active' : ''}`}
              aria-label={t}
              aria-pressed={t === tool}
              title={t}
              onClick={() => setTool(t)}
            >
              <ToolIcon tool={t} />
            </button>
          ))}
        </div>

        <div className="paint-canvas-area">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="paint-canvas"
            aria-label="Drawing canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>

      <div className="paint-bottom">
        <div className="paint-active-color-wrap">
          <div
            className="paint-color-fg"
            style={{ background: color }}
            title={`Active color: ${color}`}
          />
          <button
            type="button"
            className="win-btn paint-clear-btn"
            onClick={handleClear}
            title="Clear canvas"
          >
            New
          </button>
        </div>

        <div className="paint-palette" role="group" aria-label="Color palette">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              className={`paint-swatch${c === color ? ' paint-swatch--active' : ''}`}
              style={{ background: c }}
              aria-label={`Color ${c}`}
              aria-pressed={c === color}
              title={c}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        <div
          className="paint-coords"
          role="status"
          aria-live="off"
          aria-label="Cursor coordinates"
        >
          {coords.x}, {coords.y}
        </div>
      </div>
    </>
  );
}
