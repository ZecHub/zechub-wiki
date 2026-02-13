import { Shield } from "lucide-react";

export function DashboardSection() {
  return (
    <section className="border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-5 px-4">
        <div className="flex items-center gap-3">
          <div className="gradient-zcash rounded-lg p-2">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
                Zcash <span className="text-gradient-zcash">Governance</span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
