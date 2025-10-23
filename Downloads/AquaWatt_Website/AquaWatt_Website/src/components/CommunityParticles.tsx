import React, { useRef, useEffect } from "react";

// Modern, interactive, clear, aligned particles illustration for community
export function CommunityParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let dpr = window.devicePixelRatio || 1;
    let width = 400, height = 340;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Node positions (center + 10 nodes in a circle)
    const center = { x: 200, y: 170 };
    const nodeCount = 10;
    const nodeRadius = 32;
    const nodes = Array.from({ length: nodeCount }).map((_, i) => {
      const angle = (2 * Math.PI * i) / nodeCount;
      return {
        x: center.x + 120 * Math.cos(angle),
        y: center.y + 100 * Math.sin(angle),
        color: [
          "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6",
          "#06b6d4", "#f43f5e", "#a3e635", "#6366f1", "#f472b6"
        ][i % 10],
      };
    });

    // Particle data
    const particles = Array.from({ length: 24 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 2.5,
      dx: -0.3 + Math.random() * 0.6,
      dy: -0.3 + Math.random() * 0.6,
      color: ["#bae6fd", "#f0abfc", "#bbf7d0", "#fef08a", "#fca5a5", "#ddd6fe"][Math.floor(Math.random()*6)]
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      // Draw particles
      for (const p of particles) {
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        // Move
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;
      }
      // Draw lines between nodes
      ctx.save();
      ctx.globalAlpha = 0.18;
      for (let i = 0; i < nodes.length; ++i) {
        for (let j = i + 1; j < nodes.length; ++j) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = "#6366f1";
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 6]);
          ctx.stroke();
        }
      }
      ctx.restore();
      // Draw nodes
      for (const node of nodes) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = 0.95;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
        // Draw icon (SVG path)
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.scale(1.5, 1.5);
        ctx.beginPath();
        ctx.moveTo(-6, 2);
        ctx.arc(-6, 0, 2, 0, 2 * Math.PI);
        ctx.moveTo(6, 2);
        ctx.arc(6, 0, 2, 0, 2 * Math.PI);
        ctx.moveTo(0, 6);
        ctx.arc(0, 0, 6, 0, Math.PI, true);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2.2;
        ctx.globalAlpha = 0.95;
        ctx.stroke();
        ctx.restore();
      }
      // Draw central hub
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(center.x - 36, center.y - 36);
      ctx.lineTo(center.x + 36, center.y - 36);
      ctx.lineTo(center.x + 36, center.y + 36);
      ctx.lineTo(center.x - 36, center.y + 36);
      ctx.closePath();
      ctx.fillStyle = "#6366f1";
      ctx.shadowColor = "#6366f1";
      ctx.shadowBlur = 18;
      ctx.globalAlpha = 0.98;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
      // Draw central icon
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.scale(2.1, 2.1);
      ctx.beginPath();
      ctx.moveTo(-6, 2);
      ctx.arc(-6, 0, 2, 0, 2 * Math.PI);
      ctx.moveTo(6, 2);
      ctx.arc(6, 0, 2, 0, 2 * Math.PI);
      ctx.moveTo(0, 6);
      ctx.arc(0, 0, 6, 0, Math.PI, true);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2.8;
      ctx.globalAlpha = 0.98;
      ctx.stroke();
      ctx.restore();
      requestAnimationFrame(draw);
    }
    draw();
    return () => { ctx && ctx.clearRect(0, 0, width, height); };
  }, []);
  return (
    <div className="relative w-[400px] h-[340px] mx-auto">
      <canvas ref={canvasRef} className="block rounded-2xl" style={{ background: "radial-gradient(ellipse at 60% 40%, #f1f5f9 80%, #fff 100%)" }} />
    </div>
  );
}
