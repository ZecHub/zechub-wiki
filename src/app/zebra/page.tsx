"use client";

import React, { useState } from 'react';

const Zebra: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false);

  const toggleGuide = () => {
    setShowGuide(!showGuide);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* Page Heading */}
      <h1>Zebra</h1>
      
      {/* Subheading */}
      <h3 style={{ margin: '10px 0', fontWeight: 'normal', fontSize: '18px', lineHeight: '1.5' }}>
        Zebra, the first Zcash node to be written entirely in Rust, can be used to join the Zcash peer-to-peer network. 
        This helps to strengthen the resilience of the network by validating and broadcasting transactions, 
        and maintaining the Zcash blockchain state in a more distributed manner.
      </h3>
      
      {/* YouTube Video */}
      <div style={{ marginBottom: '20px' }}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/ZGcaZQs_i0Y"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Raspberry Pi 4 Guide Button */}
      <button onClick={toggleGuide} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginBottom: '10px' }}>
        Raspberry Pi 4 Guide
      </button>

      {/* Full Node Tutorials Button */}
      <div>
        <a href="https://zechub.wiki/tutorials/full-node-tutorials#content" target="_blank" rel="noopener noreferrer">
          <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Full Node Tutorials
          </button>
        </a>
      </div>

      {/* Raspberry Pi 4 Guide Content */}
      {showGuide && (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h1>Raspberry Pi 4 Guide for Running Zebra</h1>
          <img
            src="https://i.ibb.co/V3rjKwv/image-2023-11-28-172907488.png"
            alt="raspberry pi"
            width="300"
            height="300"
          />
          <p>
            Running the Zebra node software on a Raspberry Pi 4 allows you to participate in the Zcash network as an independent,
            consensus-compatible node. This guide will walk you through the steps to set up and run Zebra on your Raspberry Pi 4.
          </p>

          <h2>Prerequisites</h2>
          <ul>
            <li>Raspberry Pi 4 (2GB RAM or higher recommended).</li>
            <li>MicroSD card (16GB or higher recommended) with Raspberry Pi OS (Raspbian) installed.</li>
            <li>Stable internet connection.</li>
            <li>Keyboard, mouse, and a monitor (for initial setup).</li>
            <li>SSH client (optional, for remote access).</li>
          </ul>

          <h2>Installation</h2>
          <ol>
            <li>
              <strong>Update Your System</strong>
              <pre>sudo apt update</pre>
              <pre>sudo apt upgrade</pre>
            </li>
            <li>
              <strong>Install Dependencies</strong>
              <p>You'll need to install some necessary dependencies for building and running Zebra:</p>
              <pre>sudo apt install build-essential cmake git clang libssl-dev pkg-config</pre>
            </li>
            <li>
              <strong>Clone the Zebra Repository</strong>
              <p>Open a terminal and clone the Zebra repository to your Raspberry Pi:</p>
              <pre>git clone https://github.com/ZcashFoundation/zebra.git</pre>
              <pre>cd zebra</pre>
            </li>
            <li>
              <strong>Build Zebra</strong>
              <p>To build Zebra, use the following commands:</p>
              <pre>cargo build --release</pre>
              <p>This process may take some time. Ensure that your Raspberry Pi is adequately cooled, as compiling can generate heat.</p>
            </li>
            <li>
              <strong>Configuration</strong>
              <p>Create a configuration file for Zebra. You can use the default configuration as a starting point:</p>
              <pre>cp zcash.conf.example zcash.conf</pre>
              <p>
                Edit the zcash.conf file to customize your node's settings. You can specify the network, enable mining, set up peer
                connections, and more.
              </p>
            </li>
            <li>
              <strong>Start Zebra</strong>
              <p>You can now start Zebra with your custom configuration:</p>
              <pre>./target/release/zebrad -c zcash.conf</pre>
            </li>
            <li>
              <strong>Monitoring</strong>
              <p>
                You can monitor the progress and status of your Zebra node by opening a web browser and navigating to{' '}
                <a href="http://127.0.0.1:8233/status">http://127.0.0.1:8233/status</a>.
              </p>
            </li>
          </ol>

          <img
            src="https://i.ibb.co/BCtKrGp/image-2023-11-28-173024853.png"
            alt="zebra logo"
            width="200"
            height="200"
          />

          <h2>Troubleshooting</h2>
          <p>
            If you encounter any issues with building or running Zebra, check the{' '}
            <a href="https://doc.zebra.zfnd.org/docs/intro.html">Zebra documentation</a> for troubleshooting tips and additional
            information.
          </p>
          <p>
            Make sure to keep your Raspberry Pi cool, as running a node can generate heat. You might want to use a cooling solution, such as
            a fan or a heat sink.
          </p>

          <h2>Conclusion</h2>
          <p>
            By following this guide, you should have successfully set up and run Zebra on your Raspberry Pi 4. You're now contributing to
            the Zcash network as an independent node, helping to secure the privacy of Zcash transactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default Zebra;
