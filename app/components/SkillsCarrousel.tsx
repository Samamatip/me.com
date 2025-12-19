"use client";
import React from "react";
import { motion } from "motion/react";
import { useProfile } from "../contexts/profileContext";

const SkillsCarrousel = () => {

  const [countDown, setCountDown] = React.useState<number>(0);
  const { profile } = useProfile();
  const skills = profile?.skills || [];
  // Duplicate skills for seamless looping
  const duplicatedSkills = [...skills, ...skills];

  // Change background color every 1 second
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCountDown((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    let style = "";
    if(countDown % 2 === 0) {
      style = "bg-red-500";
    }else if(countDown % 3 === 0) {
      style = "bg-yellow-500";
    } else {
        style = "bg-emerald-400";
    }

  return (
    <section className="relative w-screen overflow-hidden bg-linear-to-b from-[#2a2661] to-[#2a2661]/80 via-[#2a2661]/90">
      <div className="relative h-12 flex items-center">
        {/* Overlay gradient for smooth fade at edges */}
        <div className="absolute left-0 top-0 z-10 h-full w-20 " />
        <div className="absolute right-0 top-0 z-10 h-full w-20 " />

        {/* Scrolling container */}
        <motion.div
          className="flex gap-4 px-6"
          animate={{ x: [-0, -1000] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          {duplicatedSkills.map((skill, idx) => (
            <div
              key={`${skill}-${idx}`}
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors"
            >
              <span className={`h-2 w-2 rounded-full ${style}`} />
              <span className="whitespace-nowrap text-sm font-medium text-black">
                {skill}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsCarrousel;