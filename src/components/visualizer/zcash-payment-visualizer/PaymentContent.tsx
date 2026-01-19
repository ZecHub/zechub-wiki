import { motion } from "framer-motion";
import { Store, CreditCard, Shield, Server } from "lucide-react";
import { Slide } from "./types";

interface PaymentContentProps {
  slide: Slide;
}

export const PaymentContent = ({ slide }: PaymentContentProps) => {
  const getCategoryIcon = () => {
    switch (slide.category) {
      case "why":
        return Shield;
      case "where":
        return Store;
      case "special":
        return CreditCard;
      case "accept":
        return Server;
    }
  };

  const Icon = getCategoryIcon();

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Image section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="order-2 md:order-1"
      >
        {slide.image && (
          <div className="rounded-xl overflow-hidden border-2 border-primary/20 bg-card/50 glow-gold">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Category badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30"
        >
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary capitalize">
            {slide.category === "why" && "Benefits"}
            {slide.category === "where" && "Merchants"}
            {slide.category === "special" && "Featured"}
            {slide.category === "accept" && "For Merchants"}
          </span>
        </motion.div>
      </motion.div>

      {/* Content section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="order-1 md:order-2 space-y-4"
      >
        <div className="space-y-3">
          {slide.content.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-card/30 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
              <p className="text-sm leading-relaxed text-foreground">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};