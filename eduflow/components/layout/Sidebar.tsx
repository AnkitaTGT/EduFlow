"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import {
  LayoutDashboard, Users, BookOpen, BarChart3,
  Calendar, FileText, Settings, GraduationCap
} from "lucide-react";

const getNavItems = (role?: string) => {
  const baseItems = [
    { name: "Dashboard", href: `/dashboard/${role}`, icon: LayoutDashboard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  if (role === "admin") {
    return [
      baseItems[0],
      { name: "Students", href: "/dashboard/students", icon: Users },
      { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
      { name: "Quizzes", href: "/dashboard/admin/quizzes", icon: FileText },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      baseItems[1],
    ];
  }

  if (role === "teacher") {
    return [
      baseItems[0],
      { name: "My Students", href: "/dashboard/students", icon: Users },
      { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
      { name: "Assignments", href: "/dashboard/assignments", icon: FileText },
      { name: "Attendance", href: "/dashboard/attendance", icon: Calendar },
      baseItems[1],
    ];
  }

  if (role === "student") {
    return [
      baseItems[0],
      { name: "My Courses", href: "/dashboard/student/courses", icon: BookOpen },
      { name: "Assignments", href: "/dashboard/student/assignments", icon: FileText },
      { name: "Quizzes", href: "/dashboard/student/quizzes", icon: FileText },
      baseItems[1],
    ];
  }

  return baseItems;
};

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const navItems = getNavItems(user?.role);

  return (
    <div className="hidden border-r bg-card md:block md:w-64 md:flex-shrink-0">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl">Edu Flow</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-2 text-sm font-medium">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={index} href={item.href}>
                  <span
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                      isActive ? "bg-muted text-primary" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
