// Logo tile that blends with the card: no white box, transparent icon with an
// optional dark-mode variant, initial letter when there is no clean logo.
export default function VenueIcon({ name, icon, iconDark }: { name: string; icon?: string; iconDark?: string }) {
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
      {icon ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon} alt="" loading="lazy" className={`!my-0 h-full w-full object-contain p-2 ${iconDark ? "dark:hidden" : ""}`} />
          {iconDark ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={iconDark} alt="" loading="lazy" className="!my-0 hidden h-full w-full object-contain p-2 dark:block" />
          ) : null}
        </>
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </span>
  );
}
