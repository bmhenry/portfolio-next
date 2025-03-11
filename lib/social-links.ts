import { IconDefinition, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faBluesky, faGithub, faInstagram, faLinkedin, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { FC, ReactElement } from "react";

export interface SocialLink {
  name: string;
  url: string;
  icon: IconDefinition;
  defaultSize: SizeProp;
  ariaLabel: string;
}

// Define all social links in one place
export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/brandonhenrycmpengr/",
    icon: faLinkedinIn,
    defaultSize: "1x",
    ariaLabel: "LinkedIn",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/wayoutofstyle/",
    icon: faInstagram,
    defaultSize: "1x",
    ariaLabel: "Instagram",
  },
  {
    name: "GitHub",
    url: "https://github.com/bmhenry",
    icon: faGithub,
    defaultSize: "1x",
    ariaLabel: "GitHub",
  },
  {
    name: "BlueSky",
    url: "https://bsky.app/profile/bmhenry.com",
    icon: faBluesky,
    defaultSize: "1x",
    ariaLabel: "BlueSky",
  }
];

// Types for the social link components
export interface SocialLinkProps {
  link: SocialLink;
  size?: SizeProp;
  className?: string;
}

export interface SocialLinksProps {
  links?: SocialLink[];
  size?: SizeProp;
  className?: string;
  containerClassName?: string;
}
