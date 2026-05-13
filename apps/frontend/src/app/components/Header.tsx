'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User } from '@github-web-integration/http-client';
import { GitHubIcon } from './GitHubIcon';
import { ChevronIcon } from './ChevronIcon';
import { DropdownItem } from './DropdownItem';
import httpClient from '../services/http-client.service';

export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    httpClient
        .get('/api/user/profile')
        .then((response) => {
          console.log(response);
          setUser(response as User)
        })
        .catch((error) => setUser(null));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    router.replace("/login");
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "GH";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1E2730] bg-[#0D1117]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">

        {/* Project name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3FB950]/10 border border-[#3FB950]/20">
            <GitHubIcon size={16} className="text-[#3FB950]" />
          </div>
          <span className="text-[14px] font-medium text-white tracking-tight">
            GitHub Integration
          </span>
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5"
            aria-label="Open profile menu"
            aria-expanded={open}
          >
            {/* Avatar */}
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="h-7 w-7 rounded-full border border-[#2A3540]"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#161B22] border border-[#2A3540] text-[11px] font-medium text-[#7D8590]">
                {initials}
              </div>
            )}
            {user?.username && (
              <span className="text-[13px] text-[#7D8590]">{user.username}</span>
            )}
            <ChevronIcon
              className={`text-[#7D8590] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#1E2730] bg-[#0D1117] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">

              {/* User info */}
              {user && (
                <div className="px-4 py-3 border-b border-[#1E2730]">
                  <p className="text-[13px] font-medium text-white truncate">{user.username}</p>
                  {user.username && (
                    <p className="text-[11px] text-[#7D8590] truncate mt-0.5">{user.username}</p>
                  )}
                </div>
              )}

              {/* Menu items */}
              <div className="p-1">
                <DropdownItem
                  icon="ti-user"
                  label="Profile"
                  onClick={() => { router.push("/profile"); setOpen(false); }}
                />
                <DropdownItem
                  icon="ti-layout-grid"
                  label="Repositories"
                  onClick={() => { router.push("/repos"); setOpen(false); }}
                />
                <DropdownItem
                  icon="ti-settings"
                  label="Settings"
                  onClick={() => { router.push("/settings"); setOpen(false); }}
                />
              </div>

              {/* Logout */}
              <div className="p-1 border-t border-[#1E2730]">
                <DropdownItem
                  icon="ti-logout"
                  label="Logout"
                  onClick={handleLogout}
                  danger
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
