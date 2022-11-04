import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from "next/image";

import styles from "./navbar.module.css";

interface NavbarProps {
  darkMode?: boolean;
}

interface NavItemProps {
  href: string;
  children: string | JSX.Element;
  openInNewTab?: boolean;
}

const Navbar = ({ darkMode }: NavbarProps) => {

  function NavItem({ href, openInNewTab, children }: NavItemProps): JSX.Element {
    return (
      <Link passHref href={href} target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noreferrer" : undefined}>
        <p
          className={`uppercase tracking-widest font-[500] text-base hover:text-black text-white p-2`}
        >
          {children}
        </p>
      </Link>
    );
  }

  return (
    <>
      <nav className={`${styles.navbar} ${darkMode && styles.darkMode} w-full flex flex-wrap items-center sm:justify-between justify-center`} > 
        <div className="flex items-center justify-center">
          <NavItem href="https://github.com/cdsiren/ai-generated-nfts" openInNewTab><Image width={20} height={20} src="/images/github-icon.png" alt="icon" /></NavItem>
          <NavItem href="https://decent.xyz" openInNewTab>DECENT</NavItem>
            X
          <NavItem href="https://openai.com/dall-e-2/" openInNewTab>DALL·E 2</NavItem>
        </div>
        <ConnectButton />
      </nav>
    </>

  );
};

export default Navbar;