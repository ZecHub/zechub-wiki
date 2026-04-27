# Pay-With-Zcash Widget

A lightweight embeddable widget for accepting **Zcash payments** with QR codes, payment URIs, and sharable short-links.  
Supports **auto-mount**, **manual mount**, and **framework adapters** (React + Next.js).

---

## Installation

### Option 1 — Auto-mount (Simple)

```html
<div id="payment-widget-container"></div>

<script
  src="https://zechub.wiki/zcash-payment-request-widget.embed.v2.js"
  data-address="zs1abcd..."
  data-amount="0.25"
  data-label="Donate"
  data-theme="dark"
  data-api-base="https://zechub.wiki/api"
  data-target="#payment-widget-container"
></script>
```

### Option 2 — Manual Mount (Full Control)

```html
<div id="donate-target"></div>

<script src="https://zechub.wiki/zcash-payment-request-widget.embed.v2.js"></script>

<script>
  const instance = window.renderZcashButton("#donate-target", {
    address: "zs1abcd...",
    amount: "1.75",
    label: "Support",
    theme: "light",
    apiBase: "https://zechub.wiki/api",
    target: "#donate-target",
  });

  // instance.open();
  // instance.close();
  // instance.destroy();
</script>
```

### Configuration Options

| Option     | Type                | Required | Description                               |
| ---------- | ------------------- | -------- | ----------------------------------------- |
| `address`  | `string`            | Yes      | Zcash address (UA recommended)            |
| `amount`   | `number \| string`  | Yes      | ZEC amount                                |
| `label`    | `string`            | No       | Button label                              |
| `theme`    | `"light" \| "dark"` | No       | UI theme                                  |
| `memo`     | `string`            | No       | Optional memo field                       |
| `apiBase`  | `string`            | Yes      | Backend service root URL                  |
| `target`   | `string`            | Yes      | CSS selector for mount container          |
| `disabled` | `boolean`           | No       | Disable interactivity (preview mode only) |


### Instance Methods

| Method      | Description                      |
| ----------- | -------------------------------- |
| `open()`    | Opens modal programmatically     |
| `close()`   | Closes modal                     |
| `destroy()` | Removes widget entirely from DOM |


### Preview Mode (For Widget Generator)

When generating preview UIs (React, Next.js) you can disable the widget until all options are valid:

```javascript
window.renderZcashButton("#payment-preview", {
  address,
  amount,
  apiBase,
  target: "#payment-preview",
  disabled: true,
});
```
This prevents wallet opens, QR modal, copying, etc.


## **Framework Adapters**
These adapters wrap the global script API into clean components. Below are **ready-to-use** adapters for React and Next.js.

### Usage

```tsx
import { ZcashPaymentURINextJs } from "../tools/zcash-payment-widget/adapters/nextjs";

const API_BASE_URL =
  process.env.NODE_DEV === "production"
    ? `https://zechub.wiki/api`
    : `http://localhost:3000/api`;

export default function ZcashPaymentClient() {
  return (
    <div className="flex flex-col justify-center items-center mx-auto mt-12 gap-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-medium">Zcash Payment URI Widget </h1>
        <p className="text-[18px] font-md">
          This button component demostrates the usage of the Zcash payment uri
          sdk for Next.js Adapter demo
        </p>
      </div>

      <ZcashPaymentURINextJs
        apiBase={API_BASE_URL}
        address="zs1r3pp4354ewt5g970uc5r6gu4g8p0egmwwrrd6a0dsduvx92jxj0j9zcjjrkyx9wphf5ggux9ssg"
        amount={0.0337276205547219}
        label="Donate to us"
        theme="dark"
        disabled={false}
      />
    </div>
  );
}


```
