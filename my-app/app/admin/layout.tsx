"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex min-h-screen bg-white">
      <nav className="w-48 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Admin</h2>
          <ul className="mt-6 space-y-2">
            <li>
              <Link
                href="/admin/events"
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/admin/events")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                href="/admin/members"
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/admin/members")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Members
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
