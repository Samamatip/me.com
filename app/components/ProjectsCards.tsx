"use client";
import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Profile } from "../contexts/profileContext";
import { videoUtils } from "../utilities/videoUtils";

const ProjectsCards = ({items: items, noSeeAll}: {items: Profile["projects"], noSeeAll?: boolean}) => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-semibold md:text-3xl">Featured Projects</h2>
        {items && !noSeeAll &&
          <Link
            href="/pages/projects"
            className="text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-[#f04e90] dark:text-zinc-300 dark:hover:text-white"
          >
            See all
          </Link>
        }
      </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items?.map((p, i) => {
                const relatedMedia = p.media ? videoUtils.getMediaElement(p.media) : null;
                return (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      {relatedMedia?.type === "image" ? (
                        <Image
                          src={relatedMedia.src}
                          alt={p.title}
                          fill
                          className="object-cover transition group-hover:scale-105"
                        />
                      ) : relatedMedia?.type === "video" ? (
                        <video
                          src={relatedMedia.src}
                          className="h-full w-full object-cover"
                        />
                      ) : relatedMedia?.type === "iframe" ? (
                        <iframe
                          src={relatedMedia.src}
                          className="h-full w-full border-0"
                        />
                      ) : (
                        <div className="h-full w-full bg-linear-to-br from-[#f04e90] to-[#8633aa]" />
                      )}
                    </div>
                    <div className="space-y-3 p-5">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {p.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {p.description}
                      </p>
                      <Link
                        href={`/pages/project-details/${p.id}`}
                        className="inline-block text-sm font-medium text-[#f04e90] hover:text-[#d63d7a]"
                      >
                        View Project →
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>
    </section>
  );
};

export default ProjectsCards;