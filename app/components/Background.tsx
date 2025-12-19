"use client";
import { motion } from "motion/react";
import { useProfile } from "../contexts/profileContext";

const Background = () => {
  const { profile } = useProfile();
  const skills = profile?.skills || [];

  return (
    <section className="mx-auto max-w-6xl p-5" id="about">
      <div className="mb-10 flex items-center justify-center gap-10 py-20">
        <hr className="border-2 border-[#f04e90] rounded-2xl w-1/3"/>
        <hr className="border-2 border-[#f04e90] rounded-2xl w-4 h-4"/>
        <hr className="border-2 border-[#f04e90] rounded-2xl w-1/3"/>
      </div>
      <div className="grid gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold md:text-3xl">Background</h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            {profile?.background?.length && profile?.background[0]}
          </p>
          <p className="text-zinc-600 dark:text-zinc-300">
            {profile?.background?.length && profile?.background.length > 1 && profile?.background[1]}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="relative rounded-2xl border border-zinc-200 px-5 py-1 dark:border-zinc-800 shadow-zinc-200 shadow-inner overflow-y-auto h-96 scrollbar-thin grid grid-rows-6 gap-1 pb-5"
        >
          <h3 className="py-2 text-lg font-semibold sticky top-0 dark:bg-black bg-black">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(skills)).map((s) => (
              <span
                key={s}
                className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="mb-10 flex items-center justify-center gap-10 py-20">
        <hr className="border-2 border-[#f04e90] rounded-2xl w-1/3"/>
        <hr className="border-2 border-[#f04e90] rounded-2xl w-4 h-4"/>
        <hr className="border-2 border-[#f04e90] rounded-2xl w-1/3"/>
      </div>
    </section>
  );
};

export default Background;