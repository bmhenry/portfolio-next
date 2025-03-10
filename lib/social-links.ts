import { Github, Instagram, Linkedin } from "lucide-react";
import { FC, ReactElement } from "react";

export interface SocialLink {
  name: string;
  url: string;
  icon: typeof Linkedin | typeof Instagram | typeof Github;
  defaultSize: number;
  ariaLabel: string;
}

// Define all social links in one place
export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/brandonhenrycmpengr/",
    icon: Linkedin,
    defaultSize: 20,
    ariaLabel: "LinkedIn",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/wayoutofstyle/",
    icon: Instagram,
    defaultSize: 20,
    ariaLabel: "Instagram",
  },
  {
    name: "GitHub",
    url: "https://github.com/bmhenry",
    icon: Github,
    defaultSize: 20,
    ariaLabel: "GitHub",
  },
];

// Types for the social link components
export interface SocialLinkProps {
  link: SocialLink;
  size?: number;
  className?: string;
}

export interface SocialLinksProps {
  links?: SocialLink[];
  size?: number;
  className?: string;
  containerClassName?: string;
}
