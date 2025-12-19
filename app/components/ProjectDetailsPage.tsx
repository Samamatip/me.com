"use client";
import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useProfile } from "../contexts/profileContext";
import { videoUtils } from "../utilities/videoUtils";


const ProjectDetailsPage = ({ projectID }: { projectID: string }) => {
  const { profile } = useProfile();
  const project = profile?.projects?.find((p) => p.id === projectID);

  if (!project) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
            Project Not Found
          </h1>
          <p className="mb-8 text-zinc-600 dark:text-zinc-400">
            {`  The project you're looking for doesn't exist or has been removed.`}
          </p>
          <Link
            href="/pages/projects"
            className="rounded-md bg-[#f04e90] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d63d7a]"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const media = project.media ? videoUtils.getMediaElement(project.media) : null;
  const relatedProjects = profile?.projects?.filter(
    (p) => p.id !== projectID
  ).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <Link
          href="/pages/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-[#f04e90] dark:text-zinc-400 dark:hover:text-[#f04e90]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                {project.title}
              </h1>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#f04e90] bg-[#f04e90]/10 px-4 py-1.5 text-sm font-medium text-[#f04e90] dark:border-[#f04e90] dark:bg-[#f04e90]/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {project.source && (
              <Link
                href={project.source}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-md bg-[#f04e90] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d63d7a]"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View source code
              </Link>
            )}
            {project.href && project.href !== "#" && (
              <Link
                href={project.href}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-md border border-[#f04e90] px-5 py-2.5 text-sm font-semibold text-[#f04e90] transition hover:bg-[#f04e90]/10 dark:border-[#f04e90] dark:text-[#f04e90]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Live Demo
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Media Showcase */}
      {media && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-6xl px-6 pb-12"
        >
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="relative aspect-video w-full">
              {media.type === "image" ? (
                <Image
                  src={media.src}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              ) : media.type === "video" ? (
                <video
                  src={media.src}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : (
                <iframe
                  src={media.src}
                  className="h-full w-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Project Details */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid gap-12 md:grid-cols-3"
        >
          {/* Main Content */}
          <div className="space-y-8 md:col-span-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
                About This Project
              </h2>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                <p className="leading-relaxed">{project.description}</p>
                <p className="leading-relaxed">
                    {project.footnote || ""}
                </p>
              </div>
            </div>

            {project.keyFeatures && 
            <div>
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
                Key Features
              </h2>
              <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
                {project.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            }
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {(project.source || project.href) && (
              <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">
                  Links
                </h3>
                <div className="space-y-3">
                  {project.source && (
                    <Link
                      href={project.source}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-[#f04e90] hover:underline"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      Source Code
                    </Link>
                  )}
                  {project.href && project.href !== "#" && (
                    <Link
                      href={project.href}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-[#f04e90] hover:underline"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Live Demo
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Related Projects */}
      {relatedProjects && relatedProjects.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">
              More Projects
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p, i) => {
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
          </div>
        </section>
      )}
    </div>
  );
};

export default ProjectDetailsPage;