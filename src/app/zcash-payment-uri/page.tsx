import { ZcashPaymentURINextJs } from "../tools/zcash-payment-widget/adapters/nextjs";

export default function ZcashPaymentClient() {
  return (
    <>
      <h1>Payment URI</h1>
      <ZcashPaymentURINextJs
        apiBase="https://zechub.wiki/api"
        address="zs1r3pp4354ewt5g970uc5r6gu4g8p0egmwwrrd6a0dsduvx92jxj0j9zcjjrkyx9wphf5ggux9ssg"
        amount={0.0337276205547219}
        label="Donate to us"
        theme="dark"
        disabled={false}
      />
    </>
  );
}
