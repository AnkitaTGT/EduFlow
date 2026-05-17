"use client";

import { useStudents, useCourses } from "@/lib/hooks/useData";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, BookOpen, AlertTriangle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { students, loading: studentsLoading } = useStudents();
  const { courses, loading: coursesLoading } = useCourses();

  if (studentsLoading || coursesLoading) return <div>Loading...</div>;

  const totalStudents = students.length;
  const atRiskCount = students.filter(s => s.riskFlag).length;
  const totalCourses = courses.length;

  const completionData = courses.map(c => ({
    name: c.title.substring(0, 10) + '...',
    rate: c.completionRate
  }));

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard title="Total Students" value={totalStudents} icon={Users} />
        <StatCard title="Active Courses" value={totalCourses} icon={BookOpen} />
        <StatCard title="Avg Completion" value="68%" icon={Activity} />
        <StatCard title="At-Risk Students" value={atRiskCount} icon={AlertTriangle} alert={atRiskCount > 0} />
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Course Completion Rates</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Placeholder for Recent Enrollments Table */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">List of recent student enrollments goes here.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
