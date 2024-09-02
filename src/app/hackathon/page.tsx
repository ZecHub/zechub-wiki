import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zechub Hackathon',
  description: 'Join the Zechub Hackathon and showcase your skills in building with Zcash. Participate, innovate, and win up to 15 ZEC!',
  openGraph: {
    title: 'Zechub Hackathon',
    description: 'Join the Zechub Hackathon and showcase your skills in building with Zcash. Participate, innovate, and win up to 15 ZEC!',
    url: 'https://zechub.wiki/hackathon',
    images: [
      {
        url: 'https://i.ibb.co/KzP6QGp/zechub-hackathon-3.png',
        width: 1200,
        height: 630,
        alt: 'Zechub Hackathon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zechub Hackathon',
    description: 'Join the Zechub Hackathon and showcase your skills in building with Zcash. Participate, innovate, and win up to 15 ZEC!',
    images: ['https://i.ibb.co/KzP6QGp/zechub-hackathon-3.png'],
  },
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '16px',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  backgroundColor: '#F3F4F6',
  color: '#000',
  cursor: 'pointer',
  margin: '10px',
  transition: 'background-color 0.3s, color 0.3s',
};

const prizeBoxStyle: React.CSSProperties = {
  padding: '20px',
  border: '2px solid #E5E7EB',
  borderRadius: '10px',
  backgroundColor: '#F9FAFB',
  textAlign: 'center',
  marginBottom: '20px',
};

const prizeItemStyle: React.CSSProperties = {
  fontSize: '18px',
  marginBottom: '10px',
};

const Hackathon: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center p-8"
      style={{
        backgroundImage: 'url()',
      }}
    >
      <h1 className="text-3xl font-bold text-center mb-4">Zechub Hackathon</h1>
      <p className="text-xl text-center mb-8">
        Welcome to the Zechub Hackathon! Join the challenge and showcase your skills in building with Zcash. Here’s everything you need to know:
      </p>

      <h2 className="text-2xl font-semibold text-center mb-6">Challenge Overview</h2>

      <h3 className="text-xl font-semibold mb-4">Run a Zcash Node</h3>
      <p className="mb-4">Set up and run a Zcash node. To ensure you understand the fundamentals of the Zcash network:</p>
      <a href="https://zcash.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">
        <button
          style={buttonStyle}
          className="hover:bg-blue-500 hover:text-white"
        >
          Read Zcash Documentation
        </button>
      </a>
      <a href="https://zcash.github.io/rpc/" target="_blank" rel="noopener noreferrer">
        <button
          style={buttonStyle}
          className="hover:bg-blue-500 hover:text-white"
        >
          RPC Docs
        </button>
      </a>
      <p className="mb-8">Here is our guide to set up a zcashd node:</p>
      <a href="https://github.com/ZecHub/zechub/blob/main/site/guides/How_to_run_zcashd_on_Akash_Network.md" target="_blank" rel="noopener noreferrer">
        <button
          style={buttonStyle}
          className="hover:bg-blue-500 hover:text-white"
        >
          Akash Network Guide
        </button>
      </a>

      <h3 className="text-xl font-semibold mt-8 mb-4">Create a Zcash App</h3>
      <p className="mb-4">Develop an application that leverages the Zcash network. Zcash enables fast private payments (~75 seconds) and encrypted messages up to 512 bytes per transaction.</p>
      <p className="mb-4">Here are some ideas:</p>
      <a href="https://github.com/ZecHub/zechub/blob/main/site/contribute/Build_on_Zcash.md" target="_blank" rel="noopener noreferrer">
        <button
          style={buttonStyle}
          className="hover:bg-blue-500 hover:text-white"
        >
          Build on Zcash
        </button>
      </a>
      <p className="mb-8">It could be a simple game that requires Zcash payment to play or something more complex like a messenger. Be creative—think about privacy, security, and usability!</p>

      <h3 className="text-xl font-semibold mt-8 mb-4">Show Us How It Works</h3>
      <p className="mb-8">Document your process and demonstrate how your application functions. This can be in the form of a simple markdown document / illustrated representation of the system or some combination.</p>

      <h3 className="text-xl font-semibold mt-8 mb-4">Voting Process</h3>
      <p className="mb-4">The <a href="https://zechub.wiki/dao" target="_blank" rel="noopener noreferrer">ZecHub DAO</a> will have an informal public poll on all entries submitted for the hackathon. To be considered in the voting, post your completed project to the Zcash Global Discord server:</p>
      <a href="https://discord.gg/zcash" target="_blank" rel="noopener noreferrer">
        <button
          style={buttonStyle}
          className="hover:bg-blue-500 hover:text-white"
        >
          Join Zcash Global Discord
        </button>
      </a>

      <h3 className="text-xl font-semibold mt-8 mb-4">DAO Vote Date:</h3>
      <p className="mb-8">The voting will take place on October 12th. Make sure your project is posted before this date to be considered.</p>

      <h3 className="text-xl font-semibold mt-8 mb-4">Prizes</h3>
      <div style={prizeBoxStyle}>
        <p style={prizeItemStyle}>🏆 1st Prize: 15 ZEC</p>
        <p style={prizeItemStyle}>🥈 2nd Prize: 7 ZEC</p>
        <p style={prizeItemStyle}>🥉 3rd Prize: 5 ZEC</p>
        <p style={prizeItemStyle}>🏅 4th Prize: 3 ZEC</p>
        <p style={prizeItemStyle}>🎖 5th Prize: 2 ZEC</p>
      </div>

      <p className="font-semibold mb-8">Documentation is Required</p>
      <p className="mb-8">To be eligible for a prize, you must provide some basic documentation of your project - setup, execution, and final presentation of your Zcash app.</p>

      <h3 className="text-xl font-semibold mt-8 mb-4">How to Participate</h3>
      <p>If you need assistance with your project, feel free to give us a shout in the Zcash Global Discord. Akash Network Zcash nodes can be requested as well.</p>

      {/* Donation Request */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Support the Hackathon with Your Donations!</h3>
      <p className="mb-8">
        Your contributions can help us 1) run nodes for contestants to build on the Zcash network, 2) increase the prize pool. If you’d like to support our efforts, please consider making a donation. 
        <br /><br />
        We gladly accept ZEC via our <a href="https://zechub.wiki/donation" className="text-blue-500 hover:underline" rel="noopener noreferrer">Donations page</a>, and AKT (Akash Token) via the <a href="https://daodao.zone/dao/juno1nktrulhakwm0n3wlyajpwxyg54n39xx4y8hdaqlty7mymf85vweq7m6t0y/treasury" className="text-blue-500 hover:underline" rel="noopener noreferrer">DAO</a>.
      </p>
      <p>Thank you for your support!</p>
    </div>
  );
};

export default Hackathon;
