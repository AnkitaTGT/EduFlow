"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm as useRHForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useAuthStore } from "@/lib/store/authStore";
import { MOCK_USERS } from "@/lib/mock/mock-data";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useRHForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError("");
    setLoading(true);

    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
        // Mock Login Logic
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        const mockUser = MOCK_USERS.find(u => u.email === data.email);

        if (mockUser) {
          document.cookie = "session=mock_session_token; path=/";
          setUser(mockUser as any);
          router.push(`/dashboard/${mockUser.role}`);
        } else {
          setError("Invalid mock credentials. Try admin@eduflow.com");
        }
      } else {
        // Real Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          document.cookie = "session=active; path=/"; // In real prod, call API to set httpOnly cookie
          setUser({ uid: userCredential.user.uid, ...userData } as any);
          router.push(`/dashboard/${userData.role}`);
        } else {
          setError("User role not found.");
          auth.signOut();
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-sky-100 dark:bg-sky-950">
      {/* Emoji Background Pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none text-4xl leading-[3rem] select-none break-words flex flex-wrap content-start" aria-hidden="true">
        {Array.from({ length: 200 }).map((_, i) => (
          <span key={i} className="inline-block p-4">
            {['🎓', '📚', '🖍️', '🎒', '✏️', '🎨', '🍎', '🌟'][Math.floor(Math.random() * 8)]}
          </span>
        ))}
      </div>

      {/* Container to bring content above background */}
      <div className="relative z-10 w-full max-w-md">
      <Card className="w-full shadow-xl bg-background/60 backdrop-blur-md border-primary/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">Edu Flow</CardTitle>
          <CardDescription>Track. Learn. Grow.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                className={errors.email ? "border-risk" : ""}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && <p id="email-error" className="text-sm text-risk">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-risk" : ""}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && <p id="password-error" className="text-sm text-risk">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">Contact admin to register</p>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}
