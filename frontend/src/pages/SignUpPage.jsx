import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import { useAuthStore } from "@/stores/useAuthStore"

import { z } from 'zod';
import { Loader2 } from "lucide-react"

const signUpSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required').transform((name) => name.trim().replace(/\s+/g, ' ')),
  userName: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match', path: ['confirmPassword'],
});

const SignUpPage = ({ className, ...props }) => {
  const { isSigningUp, signup } = useAuthStore();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      signUpSchema.parse(formData);
      const { fullName, userName, email, password } = formData;
      const res = await signup({ fullName, userName, email, password });
      if(res.success){
        navigate('/verify-email');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      }
    }
  }
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">

        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleFormSubmit}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">NoteHub</h1>
                    <p className="text-balance text-muted-foreground">
                      Create your NoteHub account
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Full Name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                    {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Username</Label>
                    <Input
                      id="userName"
                      placeholder="username"
                      required
                      value={formData.userName}
                      onChange={handleChange}
                    />
                    {errors.userName && <p className="text-red-500">{errors.userName}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="abhi@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {errors.password && <p className="text-red-500">{errors.password}</p>}
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                    </div>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
                  </div>

                  <Button disabled={isSigningUp}>
                    {
                      isSigningUp ?
                        <>
                          <Loader2 className="animate-spin" />
                          Please wait
                        </>
                        :
                        "Create Account"
                    }
                  </Button>

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/login" className="underline underline-offset-4">
                      Login
                    </Link>
                  </div>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="https://ui.shadcn.com/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our <Link to="#">Terms of Service</Link>{" "}
            and <Link to="#">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage;
