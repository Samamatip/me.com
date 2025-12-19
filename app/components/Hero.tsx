"use client";
import { motion } from "motion/react";
import { useProfile } from "../contexts/profileContext";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const { profile } = useProfile();
  return (
    <section className="relative w-full overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-6 pb-16 md:pt-20 md:pb-16">
        <div
          className="grid items-center gap-10 md:grid-cols-2"
        >
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-6 justify-center items-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Available for opportunities
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-[#f04e90] text-center">
              {profile?.name}
            </h1>
            <p className="text-lg text-center">
              {profile?.summary}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#projects"
                className="rounded-md bg-[#f04e90] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-black animate-bounce"
              >
                View Projects
              </Link>
              <Link
                href="#contact"
                className="rounded-md border border-[#f04e90] px-5 py-2.5 text-sm font-semibold text-[#f04e90] transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-[#f04e90] dark:hover:bg-zinc-800 animate-bounce"
              >
                Contact Me
              </Link>
            </div>
            {
              profile?.socials?.map((social, idx) => (
                <div key={idx} className="flex flex-row items-center justify-between w-full">
                  <Link href={social.url} target="_blank" className="flex flex-row items-center gap-2 text-sm hover:text-zinc-600">
                    <Image
                      src={social.icon || ""}
                      alt={social.name}
                      width={24}
                      height={24}
                      className="bg-gray-500 rounded-lg"
                    />
                    {social.name}
                  </Link>
                </div>
              ))
            }
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto aspect-square w-64 overflow-hidden rounded-2xl border border-zinc-200 shadow shadow-[#f04e90] md:w-80"
          >
            <Image
              src={profile?.picture || "/assets/me.png"}
              alt={profile?.name || "Profile Picture"}
              fill
              sizes="(max-width: 768px) 256px, 320px"
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;