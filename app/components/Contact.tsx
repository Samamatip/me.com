"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { useProfile } from "../contexts/profileContext";

const Contact = () => {
  const { profile } = useProfile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you as soon as possible.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch (e) {
      setStatus({
        type: "error",
        message: "Network error. Please try again later.",
      });
      console.error("Error sending email:", e);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div 
        style={{
          backgroundImage: "url('/assets/techy_wallpaper.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="h-12 my-20 text-left flex items-center rounded-md shadow-sm shadow-[#f04e90] px-10 animate-bounce"
      >
          <h2 className="text-2xl text-[#e5e9db] font-semibold md:text-3xl">Get in touch</h2></div>
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <p className="text-zinc-600 dark:text-zinc-300">
            {`I'm open to roles, collaborations, and interesting problems. The best
            way to reach me is via email.`}
          </p>
          <a
            href={`mailto:${profile?.email}`}
            className="inline-block rounded-md bg-[#f04e90] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d63d7a]"
          >
            Email Me
          </a>
        </motion.div>
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
          onSubmit={sendEmail}
        >
          {status.message && (
            <div
              className={`rounded-md p-4 text-sm ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {status.message}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
              placeholder="Tell me about your project…"
            />
          </div>
          <button
            type="submit"
            disabled={status.type === "loading"}
            className="rounded-md bg-[#f04e90] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d63d7a] disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
          >
            {status.type === "loading" ? "Sending..." : "Send Message"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;