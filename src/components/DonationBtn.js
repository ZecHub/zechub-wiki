import React from 'react'
import '@/components/Donation/donation.css';
const DonationBtn = () => {
    
    const handleClick = () => {
    window.location.href = "/donation";
  };
  return (
    <div className='nav-donate-btn'>
        <button onClick={handleClick} style={{width: "100px", background:"#1984c7", height: "40px", fontWeight: "600", borderRadius: "0.4rem"}}>Donate</button>
    </div>
  )
}

export default DonationBtn
