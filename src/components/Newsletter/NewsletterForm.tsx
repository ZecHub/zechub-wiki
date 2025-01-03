import { useState } from 'react';

export default function NewsletterForm() {
  const [address, setAddress] = useState('');
  const [activeNewsletter, setActiveNewsletter] = useState(null);

  const handleButtonClick = (newsletterType) => {
    setActiveNewsletter(
      activeNewsletter === newsletterType ? null : newsletterType
    );
    setAddress('');
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();

    if (!address) {
      alert('Please enter a Zcash Unified Address');
      return;
    }

    const apiEndpoint =
      type === 'networkstats'
        ? '/api/saveNetworkStatsAddress'
        : '/api/saveEcosystemNewsAddress';

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (response.ok) {
        alert('Your address has been saved successfully!');
        setAddress('');
        setActiveNewsletter(null);
      } else {
        alert('There was an error saving your address. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => handleButtonClick('networkstats')}
          className={`newsletter-button ${
            activeNewsletter === 'networkstats' ? 'active' : ''
          }`}
        >
          Sign Up for Network Stats
        </button>
        <button
          onClick={() => handleButtonClick('ecosystemnews')}
          className={`newsletter-button ${
            activeNewsletter === 'ecosystemnews' ? 'active' : ''
          }`}
          style={{ marginLeft: '10px' }}
        >
          Sign Up for Ecosystem News
        </button>
      </div>

      {activeNewsletter && (
        <form
          onSubmit={(e) =>
            handleSubmit(
              e,
              activeNewsletter === 'networkstats' ? 'networkstats' : 'ecosystemnews'
            )
          }
          style={{ margin: '20px auto', maxWidth: '400px' }}
        >
          <label>
            Enter your Zcash Unified Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '100%',
                margin: '10px 0',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
              placeholder="Unified Address..."
            />
          </label>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
