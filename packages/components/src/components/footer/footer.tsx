"use client";

import { type ReactNode } from "react";
import "./footer.css";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  links?: FooterLink[];
  copyright?: string;
  children?: ReactNode;
}

export function Footer({ links = [], copyright, children }: FooterProps) {
  return (
    <footer className="m-footer" data-mono="footer">
      <div className="m-footer-inner">
        {links.length > 0 ? (
          <ul className="m-footer-links">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="m-footer-link">{link.label}</a>
              </li>
            ))}
          </ul>
        ) : null}
        {children ? <div className="m-footer-extra">{children}</div> : null}
        {copyright ? <p className="m-footer-copy">{copyright}</p> : null}
      </div>
    </footer>
  );
}
