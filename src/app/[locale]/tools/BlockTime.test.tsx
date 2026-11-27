import { act, within } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import BlockTime from "./BlockTime";

const { renderToString } =
  jest.requireActual<typeof import("react-dom/server")>("react-dom/server.node");
const resolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;

it.each(["Asia/Shanghai", "America/New_York"])(
  "hydrates a UTC server render and shows the visitor's %s timezone",
  async (browserZone) => {
    const container = document.createElement("div");
    document.body.append(container);
    let timezone = "UTC";
    const mock = jest
      .spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions")
      .mockImplementation(function (this: Intl.DateTimeFormat) {
        return { ...resolvedOptions.call(this), timeZone: timezone };
      });
    const onRecoverableError = jest.fn();
    let root: Root | undefined;

    try {
      container.innerHTML = renderToString(<BlockTime />);
      timezone = browserZone;
      await act(async () => {
        root = hydrateRoot(container, <BlockTime />, { onRecoverableError });
      });

      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(within(container).getByText(browserZone)).toBeVisible();
      expect(within(container).getByLabelText("Block height or hash")).toBeEnabled();
    } finally {
      if (root) await act(async () => root?.unmount());
      mock.mockRestore();
      container.remove();
    }
  },
);
