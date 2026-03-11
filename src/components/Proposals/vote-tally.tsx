"use client";

interface VoteTallyProps {
  yes: number;
  no: number;
  abstain: number;
}

type VoteEntry = {
  label: string;
  value: number;
  color: string;
  bgColor: string;
};

function getOrderedVotes(
  yes: number,
  no: number,
  abstain: number,
): VoteEntry[] {
  const yesEntry: VoteEntry = {
    label: "Y",
    value: yes,
    color: "text-vote-yes",
    bgColor: "bg-vote-yes/10",
  };
  const noEntry: VoteEntry = {
    label: "N",
    value: no,
    color: "text-vote-no",
    bgColor: "bg-vote-no/10",
  };
  const abstainEntry: VoteEntry = {
    label: "A",
    value: abstain,
    color: "text-vote-abstain",
    bgColor: "bg-vote-abstain/10",
  };

  // Abstain is max -> abstain first, then yes/no by descending
  if (abstain >= yes && abstain >= no) {
    const rest = yes >= no ? [yesEntry, noEntry] : [noEntry, yesEntry];
    return [abstainEntry, ...rest];
  }

  // Otherwise: sort yes/no by value descending, abstain always last
  const sorted = yes >= no ? [yesEntry, noEntry] : [noEntry, yesEntry];
  return [...sorted, abstainEntry];
}

export function VoteTally({ yes, no, abstain }: VoteTallyProps) {
  const ordered = getOrderedVotes(yes, no, abstain);

  return (
    <div className="flex items-center gap-1.5">
      {ordered.map((entry) => (
        <span
          key={entry.label}
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-mono font-semibold tabular-nums ${entry.bgColor} ${entry.color}`}
          title={`${entry.label === "Y" ? "Yes" : entry.label === "N" ? "No" : "Abstain"}: ${entry.value}`}
        >
          <span className="text-[10px] opacity-70">{entry.label}</span>
          {entry.value}
        </span>
      ))}
    </div>
  );
}
