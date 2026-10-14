import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WalletList from "@/components/Wallet/WalletList";
import { parseMarkdown } from "@/lib/parseMarkdown";

jest.mock("@/context/LanguageContext", () => ({ useLanguage: () => ({ t: {} }) }));
jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...rest }: any) => <a href={href} {...rest}>{children}</a>,
}));
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));

const wallets = parseMarkdown(`
## [Synthetic Wallet](https://wallet.example)
- Devices: Mobile
- Pools: Orchard
- Ironwood: Ready
`);
const accepted = { ok: true, json: async () => ({}) } as Response;
const rejected = {
  ok: false,
  json: async () => ({ message: "Already voted for this wallet today" }),
} as Response;
let voteRequests: number[];

function mockVotes(respond: (delta: number) => Promise<Response>) {
  global.fetch = jest.fn(async (_url, options) => {
    const { title, delta } = JSON.parse(String(options?.body));
    if (title === "" && delta === 0) {
      return { ok: true, json: async () => ({ "Synthetic Wallet": 7 }) } as Response;
    }
    expect(title).toBe("Synthetic Wallet");
    voteRequests.push(delta);
    return respond(delta);
  });
}

async function renderWallet() {
  render(<WalletList allWallets={wallets} />);
  await screen.findByText("Rating: 7");
  // Select the real existing controls, so the baseline reproduces behavior
  // rather than failing only because new accessibility attributes are absent.
  const buttons = document.querySelectorAll<HTMLButtonElement>(".wallet-item button");
  return { like: buttons[buttons.length - 2], dislike: buttons[buttons.length - 1] };
}

beforeEach(() => { voteRequests = []; });

describe("wallet vote acceptance feedback", () => {
  it.each([1, -1])("retains an accepted %i vote when the opposite vote is rejected", async (delta) => {
    mockVotes(async () => voteRequests.length === 1 ? accepted : rejected);
    const user = userEvent.setup();
    const { like, dislike } = await renderWallet();
    const first = delta === 1 ? like : dislike;
    const opposite = delta === 1 ? dislike : like;
    const selectedClass = delta === 1 ? "text-blue-500" : "text-red-500";
    const oppositeClass = delta === 1 ? "text-red-500" : "text-blue-500";
    await user.click(first);
    await screen.findByText(`Rating: ${7 + delta}`);
    expect(first).toHaveClass(selectedClass);
    expect(screen.getByText("We saved your review!")).toBeInTheDocument();
    await user.click(opposite);
    await screen.findByText("Already voted for this wallet today");
    expect(screen.getByText(`Rating: ${7 + delta}`)).toBeInTheDocument();
    expect(first).toHaveClass(selectedClass);
    expect(opposite).not.toHaveClass(oppositeClass);
    expect(screen.queryByText("We saved your review!")).not.toBeInTheDocument();
    expect(voteRequests).toEqual([delta, -delta]);
  });

  it.each([1, -1])("does not select an initially rejected %i vote", async (delta) => {
    mockVotes(async () => rejected);
    const user = userEvent.setup();
    const { like, dislike } = await renderWallet();
    await user.click(delta === 1 ? like : dislike);
    await screen.findByText("Already voted for this wallet today");
    expect(screen.getByText("Rating: 7")).toBeInTheDocument();
    expect(like).not.toHaveClass("text-blue-500");
    expect(dislike).not.toHaveClass("text-red-500");
    expect(screen.queryByText("We saved your review!")).not.toBeInTheDocument();
  });

  it.each([true, false])("locks both controls until a delayed request settles (accepted=%s)", async (ok) => {
    let settle!: (response: Response) => void;
    mockVotes(() => new Promise<Response>((resolve) => { settle = resolve; }));
    const { like, dislike } = await renderWallet();
    // Same-turn clicks exercise the synchronous guard as well as rendered disabled state.
    act(() => { fireEvent.click(like); fireEvent.click(like); fireEvent.click(dislike); });
    expect(voteRequests).toEqual([1]);
    expect(like).toBeDisabled();
    expect(dislike).toBeDisabled();
    expect(like).not.toHaveClass("text-blue-500");
    expect(dislike).not.toHaveClass("text-red-500");
    expect(screen.getByText("Rating: 7")).toBeInTheDocument();
    await act(async () => { settle(ok ? accepted : rejected); });
    await waitFor(() => expect(like).toBeEnabled());
    expect(dislike).toBeEnabled();
    expect(screen.getByText(`Rating: ${ok ? 8 : 7}`)).toBeInTheDocument();
    if (ok) expect(like).toHaveClass("text-blue-500");
    else expect(like).not.toHaveClass("text-blue-500");
    expect(dislike).not.toHaveClass("text-red-500");
    expect(voteRequests).toEqual([1]);
  });

  it("leaves the selection unchanged after a network failure and permits a successful retry", async () => {
    mockVotes(async () => {
      if (voteRequests.length === 1) throw new Error("offline");
      return accepted;
    });
    const user = userEvent.setup();
    const { like, dislike } = await renderWallet();
    await user.click(like);
    await screen.findByText("Error updating rating: Error: offline");
    expect(screen.getByText("Rating: 7")).toBeInTheDocument();
    expect(like).not.toHaveClass("text-blue-500");
    expect(dislike).not.toHaveClass("text-red-500");
    expect(like).toBeEnabled();
    expect(dislike).toBeEnabled();
    await user.click(dislike);
    await screen.findByText("Rating: 6");
    expect(dislike).toHaveClass("text-red-500");
    expect(like).not.toHaveClass("text-blue-500");
    expect(voteRequests).toEqual([1, -1]);
  });
});
