"use client";

import { cn } from "@/lib/util";
import { Blocks, Calendar, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NetworkUpgrade } from "./networkUpgrade";

interface EvolutinCardProps {
  upgrade: NetworkUpgrade;
  index: number;
  id?: string;
}

export function EvolutinCard(props: EvolutinCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isCurrent = props.upgrade.status === "current";
  const isFuture = props.upgrade.status === "future";

  // Auto-expand and scroll when URL hash matches this card's ID
  useEffect(() => {
    if (!props.id || typeof window === "undefined") return;

    const hash = window.location.hash.replace("#", "");

    if (hash && hash === props.id) {
      setExpanded(true);

      // Wait for the card to expand before scrolling
      setTimeout(() => {
        const element = document.getElementById(props.id!);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 400);
    }
  }, [props.id]);

  return (
    <div
      id={props.id}
      className="relative flex gap-4 md:gap-8 scroll-mt-24"
    >
      {/* Timeline */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 z-10 shrink-0",
            isCurrent && "animate-pulse w-5 h-5",
            isFuture && "border-dashed",
          )}
          style={{
            borderColor: `hsl(${props.upgrade.eraColor})`,
            backgroundColor: isFuture
              ? "transparent"
              : `hsl(${props.upgrade.eraColor})`,
          }}
        />
        <div
          className={cn(
            "w-0.5 flex-1 min-h-8",
            isFuture && "border-dashed border-muted-foreground/30",
          )}
          style={
            !isFuture
              ? { backgroundColor: `hsl(${props.upgrade.eraColor}/0.3)` }
              : undefined
          }
        />
      </div>

      {/* Card Content */}
      <div
        className={cn(
          "flex-1 min-w-0 mb-6 rounded-lg border border-slate-300 dark:border-inherit bg-card p-5 text-left transition-all hover:border-primary/40",
          isCurrent && "glow-zcash border-primary/50",
          isFuture && "border-dashed border-muted-foreground/30 bg-card/50",
          "animate-fade-in",
        )}
        style={{
          animationDelay: `${props.index * 80}ms`,
        }}
      >
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-controls={`${props.upgrade.id}-features`}
          aria-label={`Toggle ${props.upgrade.name} details`}
          className="w-full text-left rounded-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {props.upgrade.logo && (
                <Image
                  src={props.upgrade.logo}
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 object-contain"
                />
              )}
              <div className="min-w-0">
                {isCurrent && (
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">
                    ● You Are Here
                  </span>
                )}
                {isFuture && (
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    {props.upgrade.networkRollout ? "Mainnet upcoming" : "Coming Soon"}
                  </span>
                )}
                <h3
                  className="text-base md:text-lg font-bold"
                  style={{ color: `hsl(${props.upgrade.eraColor})` }}
                >
                  {props.upgrade.title ?? props.upgrade.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {props.upgrade.subtitle}
                </p>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground shrink-0 transition-transform mt-1",
                expanded && "rotate-180",
              )}
            />
          </div>
        </button>

        {/* Meta Info */}
        {props.upgrade.networkRollout ? (
          <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
            {props.upgrade.networkRollout.map((rollout) => (
              <li key={rollout.network}>
                <strong>{rollout.network}</strong> — {rollout.state === "activated" ? "Activated" : "Tentative target"} {rollout.date} · Height {rollout.activationHeight?.toLocaleString("en-US") ?? "pending"}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {props.upgrade.date}
            </span>
            {props.upgrade.blockHeight !== null && (
              <span className="flex items-center gap-1 font-mono">
                <Blocks className="h-3 w-3" />#
                {props.upgrade.blockHeight.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-3 leading-relaxed">
          {props.upgrade.description}
        </p>

        {props.upgrade.notice && (
          <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-sm text-foreground">
            <p className="font-semibold leading-relaxed">{props.upgrade.notice.message}</p>
            <p className="mt-2 leading-relaxed">{props.upgrade.notice.guidance}</p>
            <ul className="mt-2 space-y-2">
              {props.upgrade.notice.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-10 items-center text-primary underline underline-offset-4 rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expanded Key Features */}
        <div id={`${props.upgrade.id}-features`} hidden={!expanded} className="mt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Key Features
          </h4>
          <ul className="space-y-1.5">
            {props.upgrade.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span
                  className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: `hsl(${props.upgrade.eraColor})` }}
                />
                {f}
              </li>
            ))}
          </ul>
          {props.upgrade.comparison && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {props.upgrade.comparison.label}
              </h4>
              <p className="text-base font-semibold text-foreground">
                {props.upgrade.comparison.before} → {props.upgrade.comparison.after}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {props.upgrade.comparison.explanation}
              </p>
            </div>
          )}
          {props.upgrade.sources && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Official sources
              </h4>
              <ul className="space-y-1 text-sm">
                {props.upgrade.zips.map((zip) => (
                  <li key={zip.number}>
                    <a
                      href={`https://zips.z.cash/zip-${String(zip.number).padStart(4, "0")}`}
                      className="inline-flex min-h-10 items-center text-primary underline underline-offset-4 rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                      ZIP {zip.number}: {zip.title}
                    </a>
                  </li>
                ))}
                {props.upgrade.sources.map((source) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      className="inline-flex min-h-10 items-center text-primary underline underline-offset-4 rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
