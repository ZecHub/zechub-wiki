const stats = [
  { number: "25", label: "Active Members" },
  { number: "🌍", label: "Global Reach" },
  { number: "100%", label: "Transparent" },
];

export default function StatsSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold dark:text-amber-400 flex items-center gap-3">
        <span className="w-1 h-10 bg-gradient-to-b  from-amber-400 to-yellow-300 rounded"></span>
        DAO Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-amber-400/10 to-yellow-300/5 border border-amber-400/20 rounded-lg p-8 text-center backdrop-blur-sm"
          >
            <div className="text-4xl font-bold dark:text-amber-400 mb-3">
              {stat.number}
            </div>
            <div className="dark:text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
