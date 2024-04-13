"use client";
import { FadeInAnimation } from "@/components/ui/FadeInAnimation";
import MemberCards from "@/components/ui/MemberCards";
import { daoMembers } from "@/constants/membersDao";
// import  Metadata from 'next';


// interface Metadata {
//   title: string;
//   description: string;
//   icons?: string; 
//   ogTitle?: string;
//   ogDescription?: string;
//   ogImage?: string;
// }

// export const metadata: Metadata = {
//   title: 'Hello',
//   description: 'An open source education hub for Zcash',
//   ogTitle: 'Hello',
//   ogDescription: 'An open source education hub for Zcash',
//   ogImage: 'https://i.ibb.co/ysPDS9Q/Zec-Hub-blue-globe.png',
// };

const DaoMembers = () => {
  return (
    <main>
      <FadeInAnimation>
        <h1 className="text-3xl font-bold text-center my-5 ">DAO Members</h1>
      </FadeInAnimation>
      <div className="w-full grid grid-cols-1 space-x-2 md:grid-cols-3 md:gap-4 justify-items-center  mt-4 p-2">
        {daoMembers &&
          daoMembers.map((e) => (
            <FadeInAnimation key={e.name}>
              <div className="flex justify-center space-y-4 w-full space-x-3 md:space-y-2 ">
                <MemberCards
                  imgUrl={e.imgUrl}
                  description={e.description}
                  name={e.name}
                  linkName={e.linkName}
                  urlLink={e.urlLink}
                />
              </div>
            </FadeInAnimation>
          ))}
      </div>
    </main>
  );
};

export default DaoMembers;
