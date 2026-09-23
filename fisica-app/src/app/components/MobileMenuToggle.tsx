"use client";

export default function MobileMenuToggle({ children }: { children: React.ReactNode }) {
  function toggle() {
    document.getElementById("nav-links")?.classList.toggle("open");
  }

  return (
    <>
      <button className="menu-toggle" onClick={toggle} aria-label="Abrir menu">
        ☰
      </button>
      {children}
    </>
  );
}
