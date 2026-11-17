
            {/* Transparent-only wallets */}
            {transparentOnlyWallets.length > 0 && (
              <section className="mt-10">
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">
                  {transparentOnlyTitle} ({transparentOnlyWallets.length})
                </h3>
                <p className="mt-1 mb-4 text-sm text-slate-500 dark:text-slate-400">
                  {transparentOnlyNote}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transparentOnlyWallets.map(renderWalletCard)}
                </div>
              </section>
            )}

            {/* Nym Mixnet wallets */}
            {nymMixnetWallets.length > 0 && (
              <section className="mt-10">
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">
                  {nymMixnetTitle} ({nymMixnetWallets.length})
                </h3>
                <p className="mt-1 mb-4 text-sm text-slate-500 dark:text-slate-400">
                  {nymMixnetNote}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nymMixnetWallets.map(renderWalletCard)}
                </div>
              </section>
            )}

            {filteredDeprecated.length > 0 && (
              <details open className="wl-deprecated mt-10 rounded-2xl border border-rose-200 dark:border-rose-900/60">
                <summary className="cursor-pointer px-5 py-4 font-semibold text-rose-700 dark:text-rose-300">
                  {deprecatedTitle} ({filteredDeprecated.length})
                </summary>
                <p className="px-5 text-sm text-slate-500 dark:text-slate-400">{deprecatedNote}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
                  {filteredDeprecated.map((wallet) => (
                    <WalletItem
                      key={wallet.title}
                      title={wallet.title}
                      link={wallet.url}
                      logo={wallet.imageUrl}
                      tags={[
                        { category: "Devices", values: wallet.devices },
                        { category: "Pools", values: wallet.pools },
                        { category: "Features", values: wallet.features },
                      ]}
                      likes={likes[wallet.title] || 0}
                      syncSpeed={wallet.syncSpeed}
                      deprecated={wallet.statusReason ?? ""}
                      onLike={() => handleLike(wallet.title)}
                      onDislike={() => handleDislike(wallet.title)}
                      error={error[wallet.title]}
                      success={success[wallet.title]}
                    />
                  ))}
                </div>
              </details>
            )}
          </section>
        </div>

        {/* Mobile drawer */}
        {isFilterVisible && (
          // z-[300]: above the site header (Navigation, z-200), which otherwise
          // covers the top of the panel on phones. dvh, not vh: vh includes the
          // area behind the browser's own toolbars, pushing the panel's top
          // row off-screen.
          <Dialog
            open={isFilterVisible}
            onClose={() => setIsFilterVisible(false)}
            initialFocus={closeFilterRef}
            className="wl-root wl-mobile-drawer fixed inset-0 z-[300] bg-black/60 flex items-end"
          >
            <DialogPanel
              className="bg-white dark:bg-slate-900 w-full max-h-[85dvh] rounded-t-3xl overflow-hidden shadow-xl flex flex-col"
            >
              <div className="wl-drawer-header px-6 py-4 border-b flex items-center justify-between gap-3">
                <DialogTitle as="span" className="text-lg font-semibold">{filtersLabel}</DialogTitle>
                <div className="flex items-center gap-4">
                  {activeFilters.length > 0 && (
                    <button
                      type="button"
                      className="text-sm font-medium text-brand dark:text-brand-soft underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-brand rounded"
                      onClick={() => setActiveFilters([])}
                    >
                      {clearAllLabel}
                    </button>
                  )}
                  <button
                    type="button"
                    ref={closeFilterRef}
                    aria-label={closeLabel}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-brand"
                    onClick={() => setIsFilterVisible(false)}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </button>
                </div>
              </div>

              {/* Apply: at the top, before the filters, so it is visible without
                  scrolling; the count follows every toggle. */}
              <div className="px-6 pt-4 pb-2">
                <button
                  type="button"
                  className="wl-btn-apply w-full rounded-xl bg-brand hover:bg-brand-hover text-on-brand font-semibold py-3 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  onClick={() => setIsFilterVisible(false)}
                >
                  {showWalletsLabel(sortedWallets.length)}
                </button>
              </div>

              <div className="wl-drawer-content px-6 pb-6 pt-2 overflow-y-auto flex-1 min-h-0">
                <FilterToggle
                  filters={filters}
                  activeFilters={activeFilters}
                  toggleFilter={toggleFilter}
                  handleToggleFilter={handleToggleFilter}
                />
              </div>
            </DialogPanel>
          </Dialog>
        )}
      </div>
    </>