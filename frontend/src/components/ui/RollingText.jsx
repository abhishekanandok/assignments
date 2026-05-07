"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const RollingText = ({ items = [], interval = 2500, className = "", style = {} }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items, interval]);

  if (!items.length) return null;

  return (
    <span className={`inline-block relative overflow-hidden align-bottom ${className}`} style={style}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="block"
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
