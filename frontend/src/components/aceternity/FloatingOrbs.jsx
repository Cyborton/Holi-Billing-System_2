import React from "react";

const FloatingOrbs = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-20 top-16 h-60 w-60 animate-pulse rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute right-0 top-28 h-72 w-72 animate-pulse rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 animate-pulse rounded-full bg-sky-300/25 blur-3xl" />
    </div>
  );
};

export default FloatingOrbs;
