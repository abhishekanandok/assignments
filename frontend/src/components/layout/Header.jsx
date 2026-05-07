"use client";

import { ChevronDown, Moon, Sun, BookOpen } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";

const platformDropdownItems = [
  { label: "AI Evaluation", href: "/features/ai-evaluation" },
  { label: "Plagiarism Detection", href: "/features/plagiarism" },
  { label: "Automated Feedback", href: "/features/feedback" },
  { label: "Analytics Dashboard", href: "/features/analytics" },
];

const solutionsDropdownGroups = [
  {
    title: "Roles",
    items: [
      { label: "For Faculty", href: "/faculty" },
      { label: "For Students", href: "/student" },
      { label: "For Institutions", href: "/institutions" },
    ],
  },
  {
    title: "Use Cases",
    items: [
      { label: "Essay Grading", href: "#" },
      { label: "Code Evaluation", href: "#" },
      { label: "Math & Science", href: "#" },
      { label: "Bulk Processing", href: "#" },
    ],
  },
];

export default function Header({
  navItems = [
    { label: "Features", href: "#", hasDropdown: true, dropdownItems: platformDropdownItems },
    { label: "Solutions", href: "#", hasDropdown: true, dropdownGroups: solutionsDropdownGroups },
    { label: "Pricing", href: "/pricing" },
  ],
  ctaText = "Get Started",
  onCtaClick,
}) {
  const { theme, toggleTheme } = useTheme();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logout } = useContext(AuthContext) || {};

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-6xl bg-white/95 dark:bg-[#1A1F2E]/95 backdrop-blur-xl rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-100/50 dark:border-white/10 px-8 py-3 transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              AIEval<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => (item.hasDropdown || item.dropdownGroups) && setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className={`text-[#2E3A62] dark:text-gray-200 hover:text-primary dark:hover:text-primary font-medium text-[15px] transition-all duration-200 flex items-center gap-1.5 py-2 ${activeDropdown === index ? 'text-primary dark:text-primary' : ''}`}
                >
                  {item.label}
                  {(item.hasDropdown || item.dropdownGroups) && (
                    <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-300 ${activeDropdown === index ? 'rotate-180' : ''}`} />
                  )}
                </a>

                {/* Dropdown Menu */}
                {(item.dropdownItems || item.dropdownGroups) && (
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-0.5 ${item.dropdownGroups ? 'w-[660px]' : 'w-80'} bg-white dark:bg-[#1A1F2E] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-white/10 overflow-hidden transition-all duration-300 ${
                      activeDropdown === index
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                  >
                    {item.dropdownGroups ? (
                      <div className="grid grid-cols-2 divide-x divide-gray-200/70 dark:divide-white/10 p-6">
                        {item.dropdownGroups.map((group, groupIndex) => (
                          <div key={group.title} className={groupIndex === 0 ? 'pr-8' : 'pl-8'}>
                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500 mb-4">
                              {group.title}
                            </p>
                            <div className="space-y-2.5">
                              {group.items.map((groupItem) => (
                                <a
                                  key={groupItem.label}
                                  href={groupItem.href}
                                  className="block text-base md:text-lg font-semibold text-[#3B4558] dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors duration-200"
                                >
                                  {groupItem.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3">
                        {item.dropdownItems?.map((dropItem, dropIndex) => (
                          <a
                            key={dropIndex}
                            href={dropItem.href}
                            className="block px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 group"
                          >
                            <div className="font-semibold text-[#3B4558] dark:text-gray-200 text-base md:text-lg group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200">
                              {dropItem.label}
                            </div>
                            {dropItem.description && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {dropItem.description}
                              </div>
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Theme Toggle & CTA - Right */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="icon"
              size="md"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-[18px] h-[18px] text-slate-700 dark:text-gray-200" />
              ) : (
                <Sun className="w-[18px] h-[18px] text-slate-700 dark:text-gray-200" />
              )}
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link href={user.role === 'teacher' ? '/faculty' : '/student'}>
                  <Button variant="outline" size="default" className="rounded-full px-4 font-semibold border-gray-200 dark:border-white/10 dark:text-gray-200">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="default"
                  className="rounded-full px-6 font-semibold"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="primary"
                  size="default"
                  className="rounded-full px-6 font-semibold"
                  onClick={onCtaClick}
                >
                  {ctaText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
