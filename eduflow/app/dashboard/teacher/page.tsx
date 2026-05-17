"use client";

import { useStudents } from "@/lib/hooks/useData";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, BookOpen, FileText, CheckCircle } from "lucide-react";

export default function TeacherDashboard() {
  const { students, loading } = useStudents();

  if (loading) return <div>Loading...</div>;

  // Mocking teacher's scope (in real app, useData hooks would filter by teacherId)
  const myStudents = students.slice(0, 45);

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold tracking-tight">Teacher Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard title="My Students" value={myStudents.length} icon={Users} />
        <StatCard title="My Courses" value={2} icon={BookOpen} />
        <StatCard title="Avg Progress" value="72%" icon={CheckCircle} />
        <StatCard title="Submissions to Grade" value={14} icon={FileText} alert />
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 mt-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">Students Needing Attention</h3>
          </div>
          <div className="p-6 pt-0">
             <ul className="space-y-4">
                {myStudents.filter(s => s.riskFlag).slice(0,5).map(s => (
                  <li key={s.uid} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-risk">{s.riskReason || "Low Engagement"}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{s.attendancePct}% Att.</span>
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
