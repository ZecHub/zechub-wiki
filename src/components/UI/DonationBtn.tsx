import '@/components/Donation/donation.css';
import Link from 'next/link';

const DonationBtn = () => {
    
  return (
    <div className='nav-donate-btn'>
        <Link href="/donation"  className={"px-4 py-2 text-sm md:text-lg"} style={{ background:"#1984c7",  fontWeight: "600", borderRadius: "0.4rem", color: 'white'}}>Donate</Link>
    </div>
  )
}

export default DonationBtn
