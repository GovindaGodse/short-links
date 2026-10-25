import React from "react";
import Link from "next/link";
import Image from "next/image";

function Navbar() {
  return (
    <header>
      <nav className="app-navbar justify-evenly items-center px-5 max-sm:justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold max-sm:text-base">
          <Image
            src="/short-links-logo.svg"
            alt=""
            width={25}
            height={25}
            className="shrink-0"
          />
          Short Links
        </h2>
        <ul className="flex-centered gap-4 text-[#c4c8cf] text-sm max-sm:gap-2">
          <Link href="/">
            <li className="app-link transition-colors mr-2 max-sm:mr-1">Home</li>
          </Link>
          <Link
            href="https://govindagodse.netlify.app"
            target="_blank"
            rel="noreferrer"
            className="flex-centered gap-0.5 app-link transition-colors"
          >
            <li className="app-link transition-colors">Credits</li>
            <span className="external-icon" />
          </Link>
          <Link
            target="_blank"
            href="https://github.com/GovindaGodse/bit-links"
            rel="noreferrer"
            className="flex-centered gap-0.5 app-link transition-colors"
          >
            <li className="app-link transition-colors">GitHub</li>
            <span className="external-icon" />
          </Link>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
