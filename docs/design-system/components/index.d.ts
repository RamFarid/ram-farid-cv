import type * as React from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: the one main action per view · secondary: outlined · ghost: violet text link-button */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'sm';
  /** Adds a trailing arrow that mirrors in RTL. */
  arrow?: boolean;
  /** Renders an <a> instead of a <button>. */
  href?: string;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): React.ReactElement;
export interface TagProps { selected?: boolean; onClick?: () => void; className?: string; children?: React.ReactNode }
export declare function Tag(props: TagProps): React.ReactElement;
export interface StatusBadgeProps { tone?: 'success' | 'warning' | 'danger' | 'neutral'; className?: string; children: React.ReactNode }
export declare function StatusBadge(props: StatusBadgeProps): React.ReactElement;
export interface SectionHeadingProps { eyebrow?: string; index?: string; title: React.ReactNode; description?: React.ReactNode; level?: 1 | 2 | 3; align?: 'start' | 'center'; className?: string }
export declare function SectionHeading(props: SectionHeadingProps): React.ReactElement;
export interface StatCardProps { value: React.ReactNode; unit?: string; label: React.ReactNode; className?: string }
export declare function StatCard(props: StatCardProps): React.ReactElement;
export interface ProjectCardProps { title: string; description?: string; kind?: string; year?: string | number; tags?: string[]; href?: string; image?: string; imageAlt?: string; monogram?: string; className?: string }
export declare function ProjectCard(props: ProjectCardProps): React.ReactElement;
export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; hint?: string; error?: string; multiline?: boolean; rows?: number }
export declare function TextField(props: TextFieldProps): React.ReactElement;
export interface NavLink { label: string; href: string }
export interface NavBarProps { name: string; /** URL of the icon (assets/Logos/ram-icon.svg) */ logoSrc?: string; links: NavLink[]; active?: string; action?: React.ReactNode; homeHref?: string; ariaLabel?: string; className?: string }
export declare function NavBar(props: NavBarProps): React.ReactElement;
declare global { interface Window { RF: { Button: typeof Button; Tag: typeof Tag; StatusBadge: typeof StatusBadge; SectionHeading: typeof SectionHeading; StatCard: typeof StatCard; ProjectCard: typeof ProjectCard; TextField: typeof TextField; NavBar: typeof NavBar } } }
