import React from "react";

const GridBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,#f0f9ff,transparent_42%),radial-gradient(ellipse_at_bottom,#ecfeff,transparent_48%),linear-gradient(120deg,#f8fafc,#f0fdfa)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f030_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f030_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GridBackground;
