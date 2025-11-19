const beliefs = [
  "Privacy is a human right",
  "Education should be open-source and accessible worldwide",
  "Community members have a right to earn ZEC privately",
  "Global collaboration drives innovation",
];

export default function BeliefsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {beliefs.map((belief, index) => (
        <div
          key={index}
          className="dark:bg-slate-800/50 border border-amber-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="text-2xl mb-3 text-amber-400">✓</div>
          <p className="font-semibold dark:text-slate-100">{belief}</p>
        </div>
      ))}
    </div>
  );
}
