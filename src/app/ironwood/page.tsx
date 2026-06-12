"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export default function IronwoodTestPage() {
  const { theme, setTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waterActive, setWaterActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = 820;
    canvas.height = 720;

    const maze = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,0,1,1,1,1,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    const tileSize = 42;
    const offsetX = 95;
    const offsetY = 70;

    let buildProgress = 0;
    let waterProgress = 0;
    const totalWalls = maze.flat().filter(cell => cell === 1).length;

    const draw = () => {
      ctx.fillStyle = theme === "ironwood" ? "#0a0a0c" : "#111114";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let wallsDrawn = 0;

      // Draw maze walls slowly
      for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[0].length; x++) {
          if (maze[y][x] === 1) {
            if (wallsDrawn < buildProgress) {
              const px = offsetX + x * tileSize;
              const py = offsetY + y * tileSize;

              ctx.fillStyle = theme === "ironwood" ? "#3f2a1f" : "#27272a";
              ctx.fillRect(px, py, tileSize, tileSize);

              ctx.fillStyle = theme === "ironwood" ? "#5c4033" : "#3f3f46";
              ctx.fillRect(px, py, tileSize, 7);

              ctx.fillStyle = theme === "ironwood" ? "#7c5c4a" : "#52525b";
              ctx.fillRect(px, py, tileSize, 2);
            }
            wallsDrawn++;
          }
        }
      }

      // Water starts flowing while maze is still being built (after ~35%)
      if (waterActive && buildProgress > totalWalls * 0.35) {
        ctx.strokeStyle = theme === "ironwood" ? "#0ea5e9" : "#38bdf8";
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.shadowBlur = 16;
        ctx.shadowColor = theme === "ironwood" ? "#0ea5e9" : "#7dd3fc";

        const path = getWaterPath();
        ctx.beginPath();

        for (let i = 0; i < path.length; i++) {
          const t = Math.min(Math.max(waterProgress - i * 0.5, 0), 1);
          const px = offsetX + path[i].x * tileSize + tileSize / 2;
          const py = offsetY + path[i].y * tileSize + tileSize / 2;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.stroke();
        ctx.shadowBlur = 0;

        waterProgress += 0.35; // ← Slow water speed
        if (waterProgress > path.length + 20) waterProgress = 0;
      }

      // Very slow maze building
      if (buildProgress < totalWalls) {
        buildProgress += 0.4; // ← Slow building speed
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, [theme, waterActive]);

  // Verified valid path (only on open cells)
  const getWaterPath = () => [
    { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
    { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
    { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
    { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 },
    { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 10, y: 9 }, { x: 11, y: 9 },
    { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 12, y: 11 }, { x: 13, y: 11 },
    { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 12, y: 13 }, { x: 11, y: 13 },
    { x: 10, y: 13 }, { x: 9, y: 13 }, { x: 8, y: 13 }, { x: 7, y: 13 },
    { x: 6, y: 13 }, { x: 5, y: 13 }, { x: 4, y: 13 }, { x: 3, y: 13 },
    { x: 2, y: 13 }, { x: 1, y: 13 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Ironwood Theme Test</h1>
            <p className="text-sm text-muted-foreground">Current theme: {theme}</p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setTheme("light")} className={`px-4 py-2 rounded-lg text-sm ${theme === "light" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Light</button>
            <button onClick={() => setTheme("dark")} className={`px-4 py-2 rounded-lg text-sm ${theme === "dark" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Dark</button>
            <button onClick={() => setTheme("ironwood")} className={`px-4 py-2 rounded-lg text-sm ${theme === "ironwood" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Ironwood</button>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <canvas ref={canvasRef} className="drop-shadow-2xl" />
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setWaterActive(true)}
          disabled={waterActive}
          className={`px-8 py-3 rounded-2xl text-lg font-semibold transition-all
            ${waterActive 
              ? "bg-blue-600 text-white cursor-default" 
              : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600"
            }`}
        >
          {waterActive ? "Shielded ✓" : "Shield me"}
        </button>
      </div>

      <div className="text-center mt-4 text-muted-foreground text-sm">
        Click "Shield me" to start the water while the maze is still building.
      </div>
    </div>
  );
}