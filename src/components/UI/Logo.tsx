import Image from "next/image";

const Logo = () => (
  <Image
    priority
    src={"/ZecHubBlue.png"}
    alt={"Logo"}
    width={60}
    height={60}
    className="rounded-full md:h-50"
  />
);

export default Logo;
