import React from "react";

const LoadingScreen: React.FC<{ message?: string; fullScreen?: boolean }> = ({ message = "Loading…", fullScreen = true }) => {
  return (
    <div
      className={
        (fullScreen ? "fixed inset-0 " : "w-full h-full ") +
        "z-[998] grid place-items-center bg-background/60 backdrop-blur-sm"
      }
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-card shadow-md border">
        <div className="flex items-center gap-3 select-none" aria-hidden>
          <span className="text-3xl animate-[bob_1.6s_ease-in-out_infinite]">💧</span>
          <span className="text-3xl animate-[flicker_1.1s_ease-in-out_infinite_alternate]">⚡</span>
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
