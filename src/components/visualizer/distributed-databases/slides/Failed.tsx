import { motion } from "framer-motion";

type FailedProps = {
  label: string;
  css?: string;
};
export default function FailedComp(props: FailedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`absolute bottom-4 min-w-68 left-1/2 -translate-x-1/2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-center md:-bottom-2.5 ${props.css}`}
    >
      {props.label}
    </motion.div>
  );
}
