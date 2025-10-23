import React from "react";

const Health: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="rounded-lg border p-8 shadow-lg bg-white">
        <h1 className="text-3xl font-bold mb-2">Health Check</h1>
        <p className="text-sm text-muted-foreground">The React app rendered successfully.</p>
        <p className="mt-4 text-xs text-muted-foreground">If you see this page, the dev server and routing are working.</p>
      </div>
    </div>
  );
};

export default Health;
