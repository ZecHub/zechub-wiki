import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import AIAssistantPanel from "@/components/AIAssistant";

jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: {} }),
}));
jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("remark-gfm", () => ({ __esModule: true, default: () => {} }));

const HISTORY_KEY = "zechub_ai_search_history_v1";
const QUESTION = "What is Zcash?";
const ANSWER = "Zcash is a cryptocurrency with shielded payments.";
const originalFetch = global.fetch;
const originalScrollIntoView = Element.prototype.scrollIntoView;

function deferred<T>() {
  let resolve!: (response: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

function request() {
  const response = deferred<unknown>();
  global.fetch = jest.fn().mockReturnValue(response.promise);
  return response.resolve;
}

function submitQuestion(question = QUESTION, requestCount = 1) {
  fireEvent.change(screen.getByRole("textbox"), { target: { value: question } });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
  expect(global.fetch).toHaveBeenCalledTimes(requestCount);
  expect(JSON.parse((global.fetch as jest.Mock).mock.calls[requestCount - 1][1].body).message).toBe(question);
}

beforeEach(() => {
  sessionStorage.clear();
  Element.prototype.scrollIntoView = jest.fn();
});
afterEach(() => {
  jest.restoreAllMocks();
  global.fetch = originalFetch;
  Element.prototype.scrollIntoView = originalScrollIntoView;
});

describe("Clear conversation during an ordinary pending answer", () => {
  it("keeps cleared history empty when the old answer arrives", async () => {
    const resolve = request();
    render(<AIAssistantPanel />);
    submitQuestion();
    fireEvent.click(screen.getByRole("button", { name: "Clear conversation" }));
    expect(JSON.parse(sessionStorage.getItem(HISTORY_KEY)!)).toEqual([]);

    await act(async () => resolve({ ok: true, json: async () => ({ answer: ANSWER }) }));

    expect(screen.queryByText(ANSWER)).not.toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(HISTORY_KEY)!)).toEqual([]);
  });

  it("does not display an old request error after its conversation was cleared", async () => {
    const resolve = request();
    render(<AIAssistantPanel />);
    submitQuestion();
    fireEvent.click(screen.getByRole("button", { name: "Clear conversation" }));

    await act(async () => resolve({ ok: false, status: 503, json: async () => ({ error: "Temporarily unavailable" }) }));

    expect(screen.queryByText("Temporarily unavailable")).not.toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(HISTORY_KEY)!)).toEqual([]);
  });

  it("does not restore the cleared conversation's late answer after remount", async () => {
    const resolve = request();
    const view = render(<AIAssistantPanel />);
    submitQuestion();
    fireEvent.click(screen.getByRole("button", { name: "Clear conversation" }));
    await act(async () => resolve({ ok: true, json: async () => ({ answer: ANSWER }) }));
    view.unmount();
    render(<AIAssistantPanel />);
    expect(screen.queryByText(ANSWER)).not.toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(HISTORY_KEY)!)).toEqual([]);
  });

  it("control: appends and restores an ordinary completed reply", async () => {
    const resolve = request();
    const view = render(<AIAssistantPanel />);
    submitQuestion();
    await act(async () => resolve({ ok: true, json: async () => ({ answer: ANSWER }) }));
    expect(await screen.findByText(ANSWER)).toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(HISTORY_KEY)!)).toEqual([
      { role: "user", content: QUESTION },
      { role: "assistant", content: ANSWER },
    ]);
    view.unmount();
    render(<AIAssistantPanel />);
    expect(screen.getByText(ANSWER)).toBeInTheDocument();
  });

  it("control: clearing a completed conversation stays clear after remount", async () => {
    const resolve = request();
    const view = render(<AIAssistantPanel />);
    submitQuestion();
    await act(async () => resolve({ ok: true, json: async () => ({ answer: ANSWER }) }));
    fireEvent.click(screen.getByRole("button", { name: "Clear conversation" }));
    await waitFor(() => expect(JSON.parse(sessionStorage.getItem(HISTORY_KEY)!)).toEqual([]));
    view.unmount();
    render(<AIAssistantPanel />);
    expect(screen.queryByText(ANSWER)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: QUESTION })).toBeInTheDocument();
  });

  it.each(["success", "error"])("ignores an old %s while a new conversation is awaiting its answer", async (outcome) => {
    const oldResponse = deferred<unknown>();
    const newResponse = deferred<unknown>();
    global.fetch = jest.fn()
      .mockReturnValueOnce(oldResponse.promise)
      .mockReturnValueOnce(newResponse.promise);
    const onAssistantReply = jest.fn();
    render(<AIAssistantPanel onAssistantReply={onAssistantReply} />);
    submitQuestion();
    fireEvent.click(screen.getByRole("button", { name: "Clear conversation" }));
    expect(screen.getByRole("textbox")).toBeEnabled();

    const newQuestion = "What is ZecHub?";
    submitQuestion(newQuestion, 2);
    expect(JSON.parse((global.fetch as jest.Mock).mock.calls[1][1].body).history).toEqual([
      { role: "user", content: newQuestion },
    ]);
    await act(async () => oldResponse.resolve(outcome === "success"
      ? { ok: true, json: async () => ({ answer: ANSWER }) }
      : { ok: false, status: 503, json: async () => ({ error: "Old request failed" }) }));

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.getByText(newQuestion)).toBeInTheDocument();
    expect(screen.queryByText(ANSWER)).not.toBeInTheDocument();
    expect(screen.queryByText("Old request failed")).not.toBeInTheDocument();
    expect(onAssistantReply).not.toHaveBeenCalled();
    expect(JSON.parse(sessionStorage.getItem(HISTORY_KEY)!)).toEqual([
      { role: "user", content: newQuestion },
    ]);

    await act(async () => newResponse.resolve({ ok: true, json: async () => ({ answer: "ZecHub is a Zcash education hub." }) }));
    expect(screen.getByRole("textbox")).toBeEnabled();
    expect(onAssistantReply).toHaveBeenCalledTimes(1);
    expect(JSON.parse(sessionStorage.getItem(HISTORY_KEY)!)).toEqual([
      { role: "user", content: newQuestion },
      { role: "assistant", content: "ZecHub is a Zcash education hub." },
    ]);
  });

  it("keeps a completed new conversation intact when the older answer arrives last", async () => {
    const oldResponse = deferred<unknown>();
    const newResponse = deferred<unknown>();
    global.fetch = jest.fn()
      .mockReturnValueOnce(oldResponse.promise)
      .mockReturnValueOnce(newResponse.promise);
    const onAssistantReply = jest.fn();
    render(<AIAssistantPanel onAssistantReply={onAssistantReply} />);
    submitQuestion();
    fireEvent.click(screen.getByRole("button", { name: "Clear conversation" }));
    submitQuestion("What is ZecHub?", 2);
    await act(async () => newResponse.resolve({ ok: true, json: async () => ({ answer: "A Zcash education hub." }) }));
    const completedHistory = sessionStorage.getItem(HISTORY_KEY);
    await act(async () => oldResponse.resolve({ ok: true, json: async () => ({ answer: ANSWER }) }));
    expect(sessionStorage.getItem(HISTORY_KEY)).toBe(completedHistory);
    expect(screen.queryByText(ANSWER)).not.toBeInTheDocument();
    expect(onAssistantReply).toHaveBeenCalledTimes(1);
  });

  it("ignores an answer whose response body finishes after Clear", async () => {
    const body = deferred<{ answer: string }>();
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn(() => body.promise) });
    const onAssistantReply = jest.fn();
    render(<AIAssistantPanel onAssistantReply={onAssistantReply} />);
    submitQuestion();
    await act(async () => {});
    fireEvent.click(screen.getByRole("button", { name: "Clear conversation" }));
    await act(async () => body.resolve({ answer: ANSWER }));
    expect(screen.queryByText(ANSWER)).not.toBeInTheDocument();
    expect(onAssistantReply).not.toHaveBeenCalled();
    expect(JSON.parse(sessionStorage.getItem(HISTORY_KEY)!)).toEqual([]);
  });

  it("does not notify a disposed panel's caller when its answer arrives", async () => {
    const resolve = request();
    const onAssistantReply = jest.fn();
    const view = render(<AIAssistantPanel onAssistantReply={onAssistantReply} />);
    submitQuestion();
    view.unmount();
    render(<AIAssistantPanel />);
    const remountedHistory = sessionStorage.getItem(HISTORY_KEY);
    await act(async () => resolve({ ok: true, json: async () => ({ answer: ANSWER }) }));
    expect(onAssistantReply).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(HISTORY_KEY)).toBe(remountedHistory);
    expect(screen.queryByText(ANSWER)).not.toBeInTheDocument();
  });

  it("control: completes an automatic initial question through StrictMode effect replay", async () => {
    const resolve = request();
    const onAssistantReply = jest.fn();
    render(
      <StrictMode>
        <AIAssistantPanel autoSendQuery={QUESTION} autoSendNonce={1} onAssistantReply={onAssistantReply} />
      </StrictMode>,
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    await act(async () => resolve({ ok: true, json: async () => ({ answer: ANSWER }) }));
    expect(screen.getByText(ANSWER)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeEnabled();
    expect(onAssistantReply).toHaveBeenCalledTimes(1);
  });

  it("control: restores a current failed question for retry, then persists its answer", async () => {
    const failedResponse = deferred<unknown>();
    const retryResponse = deferred<unknown>();
    global.fetch = jest.fn()
      .mockReturnValueOnce(failedResponse.promise)
      .mockReturnValueOnce(retryResponse.promise);
    render(<AIAssistantPanel />);
    submitQuestion();
    await act(async () => failedResponse.resolve({ ok: false, status: 503, json: async () => ({ error: "Try again later" }) }));
    expect(screen.getByText("Try again later")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue(QUESTION);
    expect(screen.getByRole("textbox")).toBeEnabled();
    expect(JSON.parse(sessionStorage.getItem(HISTORY_KEY)!)).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(global.fetch).toHaveBeenCalledTimes(2);
    await act(async () => retryResponse.resolve({ ok: true, json: async () => ({ answer: ANSWER }) }));
    expect(screen.queryByText("Try again later")).not.toBeInTheDocument();
    expect(screen.getByText(ANSWER)).toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(HISTORY_KEY)!)).toEqual([
      { role: "user", content: QUESTION },
      { role: "assistant", content: ANSWER },
    ]);
  });
});
