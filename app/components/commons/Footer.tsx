'use client';
import React from "react";
import { useProfile } from "../../contexts/profileContext";

const Footer = () => {
  const { profile } = useProfile();
  return (
    <footer 
      className="mt-10 border-t border-zinc-200 py-8 dark:border-zinc-800 bg-[#fff0f5/50]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} {profile?.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-xs">
          {profile?.socials?.map((social, idx) => (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              className="hover:underline"
            >
              {social.name}
            </a>
          ))}
          <a href={`mailto:${profile?.email}`} className="hover:underline font-bold text-[#f04e90]">Email</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;