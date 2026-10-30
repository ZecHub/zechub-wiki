import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TutorialCard from "../TutorialCard";

const tutorial = {
  id: 1,
  title: "Zingo! Mobile Wallet",
  videoId: "test-video",
  category: "Wallets",
};

describe.each(["thumbnail", "play link"])("tutorial opened from %s", (opener) => {
  async function openVideo() {
    const user = userEvent.setup();
    render(<TutorialCard tutorial={tutorial} />);
    const trigger = screen.getByRole("button", {
      name: opener === "thumbnail" ? `Play ${tutorial.title} here` : "Play here",
    });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: tutorial.title });
    return { user, trigger, dialog };
  }

  it("focuses Close video and keeps keyboard navigation inside the modal", async () => {
    const { user, dialog } = await openVideo();
    expect(within(dialog).getByRole("button", { name: "Close video" })).toHaveFocus();

    for (const shift of [false, true]) {
      for (let i = 0; i < 20; i++) {
        await user.tab({ shift });
        expect(dialog).toContainElement(document.activeElement as HTMLElement);
      }
    }
  });

  it.each(["Escape", "close button", "backdrop"])(
    "returns focus to the exact opener after dismissing with %s",
    async (dismissal) => {
      const { user, trigger, dialog } = await openVideo();
      if (dismissal === "Escape") {
        await user.keyboard("{Escape}");
      } else if (dismissal === "close button") {
        await user.click(within(dialog).getByRole("button", { name: "Close video" }));
      } else {
        await user.click(dialog.parentElement!);
      }

      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
      expect(screen.queryByTitle(tutorial.title)).not.toBeInTheDocument();
    },
  );
});

it("only loads the privacy-enhanced video iframe after opening", async () => {
  const user = userEvent.setup();
  render(<TutorialCard tutorial={tutorial} />);
  expect(screen.queryByTitle(tutorial.title)).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Play here" }));

  expect(screen.getByTitle(tutorial.title)).toHaveAttribute(
    "src", "https://www.youtube-nocookie.com/embed/test-video?rel=0",
  );
});
