"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/lib/store/authStore";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Role Protection
  useEffect(() => {
    if (!loading && user && mounted) {
      const isStudentPath = pathname.includes('/dashboard/student');
      const isTeacherPath = pathname.includes('/dashboard/teacher');
      const isAdminPath = pathname.includes('/dashboard/admin');

      if (user.role === 'student' && (isTeacherPath || isAdminPath)) {
        router.push('/dashboard/student');
      } else if (user.role === 'teacher' && (isStudentPath || isAdminPath)) {
        router.push('/dashboard/teacher');
      } else if (user.role === 'admin' && (isStudentPath || isTeacherPath)) {
        router.push('/dashboard/admin');
      }
    }
  }, [user, loading, pathname, router, mounted]);

  if (!mounted || loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-muted/40">
      <Sidebar />
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-4">
        <Header />
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
