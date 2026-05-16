"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useCourses } from "@/lib/hooks/useData";
import { StatCard } from "@/components/dashboard/StatCard";
import { BookOpen, Award, CheckCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { courses, loading } = useCourses();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard title="Enrolled Courses" value={courses.length} icon={BookOpen} />
        <StatCard title="Overall Progress" value="45%" icon={CheckCircle} />
        <StatCard title="Attendance" value="92%" icon={Calendar} trend="up" trendValue="+2%" />
        <StatCard title="Quizzes Passed" value={4} icon={Award} />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">My Learning Path</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map(course => (
             <Card key={course.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.teacherName}</CardDescription>
                  </div>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                    {course.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.completionRate}%</span>
                  </div>
                  <Progress value={course.completionRate} className="h-2" />
                </div>
              </CardContent>
             </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
