              <span
                title="Nym mixnet support"
                className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
              >
                Nym: {nymMixnet}
              </span>
            )}
            {hasSource ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open source repository"
                className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
              >
                Open Source
              </a>
            ) : (
              <span
                title="No source code repository listed"
                className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              >
                Closed Source
              </span>
            )}
          </div>
        )}

        {/* Labelled sections: Devices, Pools, Features */}
        <div className="mt-4 divide-y divide-slate-200 border-t border-slate-200 dark:divide-white/10 dark:border-white/10">
          {tags
            .filter((t) => ["Devices", "Pools"].includes(t.category) && t.values.length > 0)
            .map((tag) => (
              <div key={tag.category} className="py-3">
                <div className={sectionLabel}>{tag.category}</div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {tag.values.map((value, vIndex) => (
                    <span key={vIndex} className={chip}>
                      {typeof value === "string" ? value : (value as FeatureLink).name}
                    </span>
                  ))}
                </div>
              </div>
            ))}

          {tags.some((t) => t.category === "Features" && t.values.length > 0) && (
            <div className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div className={sectionLabel}>Features</div>
                <button
                  type="button"
                  onClick={() => setFeaturesOpen((v) => !v)}
                  className="inline-flex cursor-pointer items-center gap-1 text-[13px] font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  aria-expanded={featuresOpen}
                  aria-controls={`${title}-features`}
                >
                  <span>{featuresOpen ? "Hide" : "Show all"}</span>
                  <Icon
                    icon={MdKeyboardArrowDown}
                    className={`transition ${featuresOpen ? "rotate-180" : ""}`}
                    size="small"
                  />
                </button>
              </div>
              <div id={`${title}-features`} className="mt-1.5 flex flex-wrap gap-1.5">
                {(featuresOpen ? allFeatures : collapsedFeatures).map((value, index) => {
                  const displayValue = typeof value === "string" ? value : (value as FeatureLink).name;
                  const linkUrl =
                    typeof value === "string" ? getFeatureLink(value, link) : (value as FeatureLink).url;
                  return (
                    <Link
                      key={index}
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${chip} no-underline transition hover:bg-slate-300 dark:hover:bg-slate-600`}
                    >
                      {displayValue}
                    </Link>
                  );
                })}
                {featuresOpen && hasSource && (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open source repository"
                    className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[13px] text-emerald-700 no-underline transition hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
                  >
                    Source Code
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating pinned at bottom */}
      <div className="mt-auto flex items-center border-t border-slate-200 px-4 py-3 dark:border-white/10">
        <div className="flex-grow text-sm text-gray-400">Rating: {likes}</div>
        <div className="pr-2 text-xs text-pink-700 dark:text-red-300">{error}</div>
        <div className="pr-2 text-xs text-green-700 dark:text-green-300">{success}</div>
        <div className="flex gap-4">
          <button onClick={handleLike} className={`cursor-pointer text-gray-600 hover:text-blue-500 ${liked ? "text-blue-500" : ""}`}>
            <Icon icon={Like} size="small" />
          </button>
          <button onClick={handleDislike} className={`cursor-pointer text-gray-600 hover:text-red-500 ${disliked ? "text-red-500" : ""}`}>
            <Icon icon={Dislike} size="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletItem;
