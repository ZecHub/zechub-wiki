// Types for Google Sheets gviz structure
interface GvizCell {
    v: string | number | null;
    f?: string;
}

interface GvizRow {
    c: GvizCell[];
}

interface GvizTable {
    cols: unknown[];
    rows: GvizRow[];
}

interface GvizResponse {
    table: GvizTable;
}

type KeyRemap = {
    zec?: string;
    um?: string;
    nam?: string;
    usd?: string;
};

function cell(row: GvizRow, i: number): GvizCell | null {
    const c = row?.c?.[i];
    if (!c || c.v === undefined || c.v === null) return null;
    return c;
}

function strVal(row: GvizRow, i: number): string | null {
    const c = cell(row, i);
    if (c == null) return null;
    if (typeof c.v === "string") return c.v.trim();
    if (typeof c.v === "number") return String(c.v);
    return String(c.v);
}

function numVal(row: GvizRow, i: number): number | null {
    const c = cell(row, i);
    if (c == null || c.v === null || c.v === undefined) return null;
    const n = Number(c.v);
    return Number.isFinite(n) ? n : null;
}

function normalizeLabel(s: string | null | undefined): string {
    if (s == null) return "";
    return String(s).replace(/\s+/g, " ").trim().replace(/:\s*$/, "");
}

function roundMantissa(n: number, decimals: number): number {
    const f = 10 ** decimals;
    return Math.round(n * f) / f;
}

function sheetsDateToISO(bCell: GvizCell | null): string | null {
    if (bCell?.f) {
        const m = String(bCell.f).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (m) {
            const mm = m[1].padStart(2, "0");
            const dd = m[2].padStart(2, "0");
            return `${m[3]}-${mm}-${dd}`;
        }
    }
    if (typeof bCell?.v === "number") {
        const ms = (bCell.v - 25569) * 86400 * 1000;
        const d = new Date(ms);
        if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    }
    return null;
}

/** Default spreadsheet when `NEXT_PUBLIC_TREASURY_SPREADSHEET_ID` is unset */
const DEFAULT_TREASURY_SPREADSHEET_ID =
    "19Zy5hp3dMix8pyP8_PxMF32vkl-OyNWU07jrlCTFfso";

/** gviz `sheet=` query value (tab name as shown in the Sheets UI, e.g. `2026`) */
const DEFAULT_TREASURY_GVIZ_SHEET = "2026";

function getTreasurySheetGvizUrl(): string {
    const id =
        process.env.NEXT_PUBLIC_TREASURY_SPREADSHEET_ID?.trim() ||
        DEFAULT_TREASURY_SPREADSHEET_ID;
    return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(id)}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(DEFAULT_TREASURY_GVIZ_SHEET)}`;
}

/**
 * Strips the optional O_o banner and wraps JSON in setResponse(...);
 * Pure JSON (e.g. saved fixture) is also accepted.
 */
function parseGvizResponseText(rawText: string): GvizResponse {
    const prefix = "google.visualization.Query.setResponse(";
    const text = String(rawText).trim();
    const at = text.indexOf(prefix);
    if (at === -1) {
        return JSON.parse(text);
    }
    const from = at + prefix.length;
    const close = text.lastIndexOf(");");
    if (close <= from) {
        throw new Error("Invalid gviz response: missing closing );");
    }
    const jsonStr = text.slice(from, close).trim();
    return JSON.parse(jsonStr);
}

async function fetchTreasuryFromSheet(
    url: string = getTreasurySheetGvizUrl(),
): Promise<any[]> {
    const res = await fetch(url, {
        headers: { Accept: "application/json,text/plain,*/*" },
    });
    if (!res.ok) {
        throw new Error(`Sheet fetch failed: ${res.status} ${res.statusText}`);
    }
    const gviz = parseGvizResponseText(await res.text());
    return parseTreasuryDashboard(gviz);
}

/**
 * Parses Google Sheets treasury dashboard response
 * @param gviz - Parsed JSON (table.rows / table.cols)
 */
function parseTreasuryDashboard(gviz: GvizResponse): any[] {
    const rows = gviz?.table?.rows ?? [];
    const normalizedRows = rows.map((r) => {
        const get = (i: number) => strVal(r, i);
        const getN = (i: number) => numVal(r, i);
        return {
            raw: r,
            a: normalizeLabel(get(0)),
            b: getN(1),
            c: get(2) ? String(cell(r, 2)?.v ?? "") : null,
        };
    });

    const out: any[] = [];

    // --- Header: prices & last updated ---
    const header: Record<string, string> = {};
    for (const { raw, a } of normalizedRows) {
        if (a === "Last Updated") {
            const iso = sheetsDateToISO(cell(raw, 1));
            if (iso) header["Last Updated"] = iso;
        } else if (a === "Zcash Price") {
            const n = numVal(raw, 1);
            if (n != null) header["Zcash Price"] = String(n);
        } else if (a === "Penumbra Price") {
            const n = numVal(raw, 1);
            if (n != null) header["Penumbra Price"] = String(n);
        } else if (a === "Namada Price") {
            const n = numVal(raw, 1);
            if (n != null) header["Namada Price"] = String(n);
        } else if (a === "FPF") {
            break;
        }
    }
    if (Object.keys(header).length) out.push(header);

    const SECTION_BREAK_LABELS = [
        "ZecHub Donations",
        "ZecHub Treasury (ZecHub Inc)",
        "Penumbra Threshold Custody",
        "Namada Treasury",
    ] as const;

    const FPF_SUMMARY_LABELS = new Set([
        "Total ZEC Remaining (FPF)",
        "Total USD Value",
        "Unreserved ZEC (Spendable)",
        "USD Reserved",
        "Current ZEC Value",
    ]);

    // --- FPF: core categories only, then numeric summary objects ---
    const fpfStart = normalizedRows.findIndex((r) => r.a === "FPF");
    const fpfCategories: string[] = [];
    const fpfAmounts: number[] = [];
    const fpfAllocations: number[] = [];

    if (fpfStart !== -1) {
        let i = fpfStart + 2; // skip "FPF" and "Category / Allocation" header

        while (i < normalizedRows.length) {
            const { raw, a } = normalizedRows[i];
            if (!a) {
                i += 1;
                continue;
            }
            if (SECTION_BREAK_LABELS.includes(a as (typeof SECTION_BREAK_LABELS)[number])) {
                break;
            }
            if (FPF_SUMMARY_LABELS.has(a)) {
                break;
            }
            if (a === "Category") {
                i += 1;
                continue;
            }
            const amount = numVal(raw, 1);
            const allocCell = cell(raw, 2);
            let allocNum: number | null = null;
            if (allocCell && typeof allocCell.v === "string") {
                const m = allocCell.v.match(/([\d.]+)/);
                if (m) allocNum = Number(m[1]);
            } else if (allocCell && typeof allocCell.v === "number") {
                allocNum = allocCell.v;
            }
            fpfCategories.push(a);
            if (amount != null) fpfAmounts.push(roundMantissa(amount, 2));
            if (allocNum != null) fpfAllocations.push(roundMantissa(allocNum, 2));
            i += 1;
        }

        if (fpfCategories.length) {
            out.push({
                FPF: {
                    Category: fpfCategories,
                    "Amount (ZEC)": fpfAmounts,
                    Allocation: fpfAllocations,
                },
            });
        }

        while (i < normalizedRows.length) {
            const { raw, a } = normalizedRows[i];
            if (!a) {
                i += 1;
                continue;
            }
            if (SECTION_BREAK_LABELS.includes(a as (typeof SECTION_BREAK_LABELS)[number])) {
                break;
            }

            if (a === "Total ZEC Remaining (FPF)") {
                const z = numVal(raw, 1);
                const next = normalizedRows[i + 1];
                const obj: Record<string, number> = {};
                if (z != null) {
                    obj["Total ZEC Remaining (FPF)"] = roundMantissa(z, 2);
                }
                if (next?.a === "Total USD Value") {
                    const u = numVal(next.raw, 1);
                    if (u != null) {
                        obj["Total USD Value"] = roundMantissa(u, 2);
                    }
                    i += 2;
                } else {
                    i += 1;
                }
                if (Object.keys(obj).length) {
                    out.push(obj);
                }
                continue;
            }

            if (a === "Total USD Value") {
                const u = numVal(raw, 1);
                if (u != null) {
                    out.push({ "Total USD Value": roundMantissa(u, 2) });
                }
                i += 1;
                continue;
            }

            if (a === "Unreserved ZEC (Spendable)") {
                const u = numVal(raw, 1);
                if (u != null) {
                    out.push({
                        "Unreserved ZEC (Spendable)": roundMantissa(u, 2),
                    });
                }
                i += 1;
                continue;
            }

            if (a === "USD Reserved") {
                const ur = numVal(raw, 1);
                const next = normalizedRows[i + 1];
                const obj: Record<string, number> = {};
                if (ur != null) {
                    obj["USD Reserved"] = roundMantissa(ur, 2);
                }
                if (next?.a === "Current ZEC Value") {
                    const cz = numVal(next.raw, 1);
                    if (cz != null) {
                        obj["Current ZEC Value"] = roundMantissa(cz, 2);
                    }
                    i += 2;
                } else {
                    i += 1;
                }
                if (Object.keys(obj).length) {
                    out.push(obj);
                }
                continue;
            }

            if (a === "Current ZEC Value") {
                const cz = numVal(raw, 1);
                if (cz != null) {
                    out.push({
                        "Current ZEC Value": roundMantissa(cz, 2),
                    });
                }
                i += 1;
                continue;
            }

            i += 1;
        }
    }

    function takePairSection(
        startLabel: string,
        keyRemap: KeyRemap,
    ) {
        const idx = normalizedRows.findIndex((r) => r.a === startLabel);
        if (idx === -1) return;
        const obj: Record<string, string> = {};
        for (let j = idx + 1; j < normalizedRows.length; j++) {
            const { raw, a } = normalizedRows[j];
            if (!a) continue;
            const nextSection = [
                "ZecHub Donations",
                "ZecHub Treasury (ZecHub Inc)",
                "Penumbra Threshold Custody",
                "Namada Treasury",
                "FPF",
                "Total Paid Out USD | ZEC",
                "To Be Paid Out USD | ZEC",
            ].includes(a);
            if ((nextSection || a === "Global Ambassador Proposals") && j > idx + 1) {
                break;
            }
            const n = normalizeLabel(a);
            if (n.startsWith("Total ZEC Remaining")) {
                const v = numVal(raw, 1);
                if (v != null)
                    obj[keyRemap?.zec ?? "Total ZEC Remaining"] = String(roundMantissa(v, 4));
            } else if (n.startsWith("Total UM Remaining")) {
                const v = numVal(raw, 1);
                if (v != null)
                    obj[keyRemap?.um ?? "Total UM Remaining"] = String(roundMantissa(v, 2));
            } else if (n.startsWith("Total NAM Remaining")) {
                const v = numVal(raw, 1);
                if (v != null)
                    obj[keyRemap?.nam ?? "Total NAM Remaining"] = String(Math.round(v));
            } else if (n.startsWith("Total USD Value")) {
                const v = numVal(raw, 1);
                if (v != null)
                    obj[keyRemap?.usd ?? "Total USD Value"] = String(roundMantissa(v, 2));
            }
        }
        if (Object.keys(obj).length) out.push({ [startLabel]: obj });
    }

    takePairSection("ZecHub Donations", {
        zec: "Total ZEC Remaining",
        usd: "Total USD Value",
    });
    takePairSection("ZecHub Treasury (ZecHub Inc)", {
        zec: "Total ZEC Remaining",
        usd: "Total USD Value",
    });
    takePairSection("Penumbra Threshold Custody", {
        um: "Total UM Remaining",
        usd: "Total USD Value",
    });
    takePairSection("Namada Treasury", {
        nam: "Total NAM Remaining",
        usd: "Total USD Value",
    });

    // --- Total Paid Out block ---
    const paidIdx = normalizedRows.findIndex(
        (r) => r.a === "Total Paid Out USD | ZEC",
    );
    if (paidIdx !== -1) {
        const paid: Record<string, string> = {};
        const total = numVal(normalizedRows[paidIdx].raw, 1);
        if (total != null)
            paid["Total Paid Out | ZEC"] = String(Math.round(total));
        for (let j = paidIdx + 1; j < normalizedRows.length; j++) {
            const { raw, a } = normalizedRows[j];
            if (!a) continue;
            if (a === "To Be Paid Out USD | ZEC") break;
            const n = numVal(raw, 1);
            if (n != null) paid[a] = String(Math.round(n));
        }
        out.push(paid);
    }

    const todoIdx = normalizedRows.findIndex(
        (r) => r.a === "To Be Paid Out USD | ZEC",
    );
    if (todoIdx !== -1) {
        const todo: Record<string, string> = {};
        const todoTotal = numVal(normalizedRows[todoIdx].raw, 1);
        if (todoTotal != null)
            todo["To Be Paid Out USD | ZEC"] = String(Math.round(todoTotal));
        for (let j = todoIdx + 1; j < normalizedRows.length; j++) {
            const { raw, a } = normalizedRows[j];
            if (!a) continue;
            if (a === "Global Ambassador Proposals") break;
            const n = numVal(raw, 1);
            if (n != null) todo[a] = String(Math.round(n));
        }
        out.push(todo);
    }

    return out;
}

export { parseTreasuryDashboard, fetchTreasuryFromSheet, getTreasurySheetGvizUrl };