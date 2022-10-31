import Link from "next/link";
import Image from "next/image";
import React, { useState } from 'react';

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
  const [menuOpen, setMenuOpen] = useState(false);

  function NavItem({ href, openInNewTab, children }: NavItemProps): JSX.Element {
    return (
      <Link passHref href={href} target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noreferrer" : undefined}>
        <p
          className={`${menuOpen ? 'block' : 'hidden'} md:block uppercase tracking-widest font-[500] text-base hover:text-primary p-2`}
        >
          {children}
        </p>
      </Link>
    );
  }

  return (
    <>
      <nav className={`${styles.navbar} ${darkMode && styles.darkMode} flex justify-between items-center`} >
        <Image width={60} height={60} src="/images/ai-robot.png" alt="icon" />
        {/* <NavItem href="/" openInNewTab>Dashboard</NavItem> */}
      </nav>
    </>

  );
};

export default Navbar;