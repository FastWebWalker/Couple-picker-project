"use client";

import { motion } from "framer-motion";

import { GridCard } from "@/components/grid-card";

type Section = {
  title: string;
  description: string;
  icon: string;
  href: string;
  tone?: "warm" | "cool" | "neutral";
};

export function HomeGrid({ sections }: { sections: Section[] }) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.08 },
        },
      }}
    >
      {sections.map((section) => (
        <motion.div key={section.title} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <GridCard {...section} />
        </motion.div>
      ))}
    </motion.div>
  );
}
