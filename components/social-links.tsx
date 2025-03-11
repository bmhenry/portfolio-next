import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SocialLink, SocialLinkProps, SocialLinksProps, socialLinks } from "@/lib/social-links";

// Component to render a single social link
export const SocialLinkComponent: React.FC<SocialLinkProps> = ({
  link,
  size,
  className,
}) => {
  const iconSize = size || link.defaultSize;
  
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <FontAwesomeIcon icon={link.icon} size={iconSize} />
      <span className="sr-only">{link.ariaLabel}</span>
    </a>
  );
};

// Component to render a group of social links
export const SocialLinks: React.FC<SocialLinksProps> = ({
  links = socialLinks,
  size,
  className,
  containerClassName,
}) => {
  return (
    <div className={containerClassName || "flex items-center gap-4"}>
      {links.map((link) => (
        <SocialLinkComponent
          key={link.name}
          link={link}
          size={size}
          className={className}
        />
      ))}
    </div>
  );
};
