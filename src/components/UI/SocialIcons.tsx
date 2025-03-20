import Link from "next/link";
import { Icon } from "./Icon";
import { socialNav } from "@/constants/navigation";
import type { Socials } from "@/types";

const SocialIcons = (newTab: Socials) => {
  return (
    <div className="flex gap-6">
      {socialNav?.map(({ url, icon }, index) => {
        return (
          <Link
            key={index}
            href={url}
            className=" hover:text-brand-ui-primary hover:scale-125"
            target={newTab ? "_blank" : "_self"}
          >
            <Icon  icon={icon} className="md:w-6 w-4 h-4 md:h-6" />
          </Link>
        );
      })}
    </div>
  );
};

export default SocialIcons;
