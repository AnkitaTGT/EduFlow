"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { useQuizzes } from "@/lib/hooks/useData";

export default function AdminQuizzesPage() {
  const { quizzes, setQuizzes, loading } = useQuizzes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Obfuscated trigger for file upload (e.g. double click the icon or specific hidden area)
  const handleSecretUploadTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus("Parsing...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Simple logic to append parsed CSV as a new mock quiz.
        // Expecting columns: question, option1, option2, option3, option4, correctIndex
        try {
          const questions = results.data.map((row: any, i) => ({
            id: `new_q_${i}`,
            text: row.question,
            options: [row.option1, row.option2, row.option3, row.option4].filter(Boolean),
            correctOptionIndex: parseInt(row.correctIndex, 10)
          }));

          const newQuiz = {
            id: `quiz_${Date.now()}`,
            title: `Uploaded Quiz - ${file.name}`,
            courseId: "course_1",
            teacherId: "teacher1",
            avgScore: 0,
            passRate: 0,
            totalAttempts: 0,
            questions
          };

          setQuizzes([...quizzes, newQuiz]);
          setUploadStatus(`Success! Added "${newQuiz.title}"`);
        } catch (error) {
          setUploadStatus("Error parsing file format.");
        }
      },
      error: () => {
        setUploadStatus("Error reading file.");
      }
    });
  };

  if (loading) return <div>Loading quizzes...</div>;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold tracking-tight">Manage Quizzes</h1>
         {/* Hidden/Obfuscated UI to upload quizzes - only admins who know to double click the badge can do it */}
         <div
           className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground cursor-pointer select-none hover:bg-muted/80"
           onDoubleClick={handleSecretUploadTrigger}
           title="System Version"
         >
           v1.0.4
         </div>
         <input
           type="file"
           accept=".csv,.txt"
           ref={fileInputRef}
           className="hidden"
           onChange={handleFileUpload}
         />
      </div>

      {uploadStatus && (
        <div className="p-3 bg-secondary text-secondary-foreground rounded-md text-sm">
          {uploadStatus}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map(quiz => (
          <Card key={quiz.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{quiz.title}</CardTitle>
              <CardDescription>Course ID: {quiz.courseId}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p>Questions: {quiz.questions?.length || 0}</p>
                <p>Avg Score: {quiz.avgScore}%</p>
                <p>Attempts: {quiz.totalAttempts}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
