"use client";

import { motion } from "framer-motion";
import { Award, FileText, Search } from "lucide-react";

export const ZcashCommunityGrantsContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-4xl mx-auto"
    >
      <h2 className="text-4xl font-bold mb-6 text-foreground">
        Zcash Community Grants
      </h2>
      <div className="space-y-6 text-left">
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
            <Search className="w-6 h-6" />
            What is ZCG?
          </h3>
          <p className="text-muted-foreground">
            The Zcash Community Grants program provides funding for projects that benefit the Zcash ecosystem.
            It supports development, education, and community initiatives.
          </p>
        </div>
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
            <FileText className="w-6 h-6" />
            How to Apply
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Review the grant categories and eligibility
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Prepare your project proposal
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Submit through the official application process
            </li>
            <li className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Community review and voting period
            </li>
          </ul>
        </div>
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary">Resources</h3>
          <a
            href="https://github.com/ZecHub/zechub/blob/main/site/Zcash_Organizations/Zcash_Community_Grants.md"
            className="text-primary hover:text-primary/80 underline flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText className="w-4 h-4" />
            Zcash Community Grants Documentation
          </a>
        </div>
      </div>
    </motion.div>
  );
};