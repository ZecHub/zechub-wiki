import { useRouter } from 'next/navigation';
import '@/components/Donation/donation.css';

const DonationBtn = () => {
  
    const router = useRouter()
    const handleClick = () => {
    router.push("/donation");
  };
  return (
    <div className='nav-donate-btn'>
        <button onClick={handleClick}  className={"px-4 py-2 text-sm md:text-lg"} style={{ background:"#1984c7",  fontWeight: "600", borderRadius: "0.4rem"}}>Donate</button>
    </div>
  )
}

export default DonationBtn
