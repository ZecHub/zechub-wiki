import { Card, CardContent } from "@/components/UI/shadcn/card";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type Props = {
  statCards: {
    label: string;
    value: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    color: string;
  }[];
};
export function Stats(props: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {props.statCards.map((s) => (
        <Card
          key={s.label}
          className="border-border/30 bg-slate-800 backdrop-blur-sm"
        >
          <CardContent className="p-3 flex items-center gap-3">
            <s.icon
              className="h-6 w-6 shrink-0"
              style={{
                color: s.color.startsWith("hsl") ? s.color : undefined,
              }}
            />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {s.label}
              </p>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
