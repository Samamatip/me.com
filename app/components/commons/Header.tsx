"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useProfile } from "@/app/contexts/profileContext";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { profile } = useProfile();

  const navContents = [
    { href: "/", label: "Home", style: "text-sm text-[#f04e90] hover:text-white" },
    { href: "/#about", label: "About", style: "text-sm text-[#f04e90] hover:text-white" },
    { href: "/#projects", label: "Projects", style: "text-sm text-[#f04e90] hover:text-white" },
    { href: "/#contact", label: "Contact", style: "text-sm text-[#f04e90] hover:text-white" },
    { href: profile?.cv || "/assets/cv.pdf", label: "Resume/CV", style: "rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white dark:bg-white dark:text-black animate-pulse" },
  ];

  return (
    <header 
      className="sticky top-0 z-50 w-full backdrop-blur supports-backdrop-filter:bg-[#2a2661] bg-[#2a2661] text-white shadow-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/me_logo.png" alt="Logo" width={36} height={36} />
          <span className="hidden text-sm font-semibold sm:inline">{profile?.name}</span>
        </Link>
        <div className="hidden sm:flex gap-5">
          {
            navContents.map((content, index) =>
            (
              <nav key={index} className="hidden items-center gap-6 sm:flex">
                <Link href={content.href} target={content.label === "Resume" ? "_blank" : undefined} className={content.style}>{content.label}</Link>
              </nav>
            ))
          }
        </div>
        
        <button
            className="sm:hidden"
            aria-label="Toggle Menu"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
        </button>
      </div>
      {open && (
        <div className="sm:hidden">
          {
            navContents.map((content, index) =>
            (
              <nav key={index} className="mx-auto flex max-w-6xl flex-col gap-2 px-6 pb-4 font-bold">
                <Link onClick={() => setOpen(false)} href={content.href} target={content.label === "Resume" ? "_blank" : undefined} className={``}>{content.label}</Link>
              </nav>
            ))
          }
        </div>
      )}
    </header>
  );
};

export default Header;