import { motion } from "framer-motion";
import { ReactNode } from 'react';

const fadeDownAnimation = () => ({
  hidden: {
    y: 20,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.25,
      delayChildren: 1,
      staggerChildren: 1
    },
  }
})

export const FadeInAnimation = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    className={className ?? ''}
    variants={fadeDownAnimation()}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.25 }}
  >
    {children}
  </motion.div>
)