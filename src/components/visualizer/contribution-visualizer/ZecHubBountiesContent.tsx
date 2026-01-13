"use client";

import { motion } from "framer-motion";
import { CheckCircle, MessageSquare, Settings, Users } from "lucide-react";

export const ZecHubBountiesContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-4xl mx-auto"
    >
      <h2 className="text-4xl font-bold mb-6 text-foreground">
        ZecHub Bounties
      </h2>
      <div className="space-y-6 text-left">
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
            <Users className="w-6 h-6" />
            Getting Started
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Join the Zcash Discord community
            </li>
            <li className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Connect your account to Dework for task management
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Review available bounties and task schedules
            </li>
          </ul>
        </div>
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Application Process
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Fill out the Contributor Application Form
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Submit your application for review
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Get assigned to tasks based on your skills
            </li>
          </ul>
        </div>
        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
          <h3 className="text-2xl font-semibold mb-4 text-primary">Resources</h3>
          <a
            href="https://zechub.wiki/contribute/help-build-zechub"
            className="text-primary hover:text-primary/80 underline flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CheckCircle className="w-4 h-4" />
            Help Build ZecHub - Contribution Guide
          </a>
        </div>
      </div>
    </motion.div>
  );
};