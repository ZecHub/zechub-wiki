"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle, Vote } from "lucide-react";

export const CoinholderGrantsContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-4xl mx-auto"
    >
      <h2 className="text-4xl font-bold mb-6 text-foreground">
        Coinholder Directed Retroactive Grants
      </h2>
      <div className="space-y-6 text-left">
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Quarterly Cadence
          </h3>
          <p className="text-muted-foreground">
            Grants are awarded on a quarterly basis, with proposals submitted and voted on by the community.
          </p>
        </div>
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Eligible Criteria
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Projects that have already delivered value to the Zcash ecosystem
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Retroactive funding for completed work
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Community-approved initiatives
            </li>
          </ul>
        </div>
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
            <Vote className="w-6 h-6" />
            Voting Process
          </h3>
          <p className="text-muted-foreground mb-4">
            ZEC holders vote on proposals through the community forum and governance process.
          </p>
          <a
            href="https://forum.zcashcommunity.com/t/call-for-proposals-coinholder-directed-retroactive-grants-program-q1-2026/54208"
            className="text-primary hover:text-primary/80 underline flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Vote className="w-4 h-4" />
            Current Call for Proposals (Q1 2026)
          </a>
        </div>
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary">Resources</h3>
          <a
            href="https://github.com/ZecHub/zechub/blob/main/site/Zcash_Organizations/CoinHolder_Directed_Retroactive_Grants.md"
            className="text-primary hover:text-primary/80 underline flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CheckCircle className="w-4 h-4" />
            Coinholder Directed Retroactive Grants Documentation
          </a>
        </div>
      </div>
    </motion.div>
  );
};