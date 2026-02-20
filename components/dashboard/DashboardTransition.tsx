"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface DashboardTransitionProps {
  pathname: string;
  children: ReactNode;
}

export default function DashboardTransition({
  pathname,
  children,
}: DashboardTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}