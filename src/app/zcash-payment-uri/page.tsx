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
        label="Donate with Zcash"
        theme="dark"
        disabled={false}
      />
    </div>
  );
}
