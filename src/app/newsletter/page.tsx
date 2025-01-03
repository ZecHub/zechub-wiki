import NewsletterForm from '../components/NewsletterForm';

export default function Newsletter() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
        Sign Up to the Shielded Newsletter
      </h1>
      <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1rem', lineHeight: '1.5' }}>
        <p>🔒 <strong>Why Join?</strong></p>
        <p>
          Stay informed and connected, directly in your Zcash shielded wallet. With our newsletter,
          you can:
        </p>
        <ul style={{ textAlign: 'left', margin: '0 auto', padding: '0 20px' }}>
          <li>
            <strong>Ecosystem News:</strong> Get a concise weekly summary of notable updates,
            upcoming events, and community highlights—delivered straight to your shielded memo.
          </li>
          <li>
            <strong>Network Stats:</strong> Stay updated on key Zcash network metrics, including
            supply, transfers, approximate node counts, transactions, and shielded usage
            statistics—all in one weekly snapshot.
          </li>
        </ul>
        <p>✨ <strong>Reimagine Your Wallet</strong></p>
        <p>
          Your wallet isn't just for transactions anymore. It's now a hub for secure, meaningful
          updates.
        </p>
        <p>🛠️ <strong>Empower Your Community</strong></p>
        <p>
          We're also working on tools to let you create your own shielded newsletters, enabling
          more users to explore the potential of private, wallet-based communication.
        </p>
        <p>📬 <strong>Sign Up Now</strong></p>
        <p>
          Enter a unified address and choose the updates that matter most to you. Let’s redefine
          how we stay connected while protecting our privacy.
        </p>
      </div>
      <div style={{ marginTop: '40px' }}>
        <NewsletterForm />
      </div>
    </div>
  );
}
