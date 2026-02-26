import { Shield } from "lucide-react";

export function DashboardSection() {
  return (
    <section>
      <div className="container mx-auto flex items-center justify-center py-12 px-4">
        <div className="flex justify-center items-center gap-3">
          <div className="gradient-zcash rounded-lg p-2">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Zcash <span className="text-gradient-zcash">Governance</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              ZIPs · Grants Proposals
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
