import React from "react";
import Contact from "../../components/Contact";

export const metadata = {
  title: "Contact | Samson Olusola",
  description: "Get in touch with Samson Olusola for roles and collaborations.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Contact />
    </div>
  );
}
