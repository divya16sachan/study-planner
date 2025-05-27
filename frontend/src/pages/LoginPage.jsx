import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Eye, EyeClosed, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Label } from "@radix-ui/react-dropdown-menu";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const { login, isLoggingIn } = useAuthStore();

    const validate = () => {
        const newErrors = {};
        if (!formData.email.includes("@")) {
            newErrors.email = "Invalid email format";
        }
        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }
        return newErrors;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        try {
            await login(formData);
        } catch (error) {
            setErrors({ general: error.message || "Login failed" });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className={cn("flex flex-col gap-7 w-[380px]")}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleFormSubmit}>
                            <div className="flex flex-col gap-6">
                                {/* Email Field */}
                                <div className="flex flex-col gap-1 relative">
                                    <div className="flex gap-2 relative">
                                        <Mail className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                                        <Input
                                            className={cn("pl-8", errors.email && "ring-2 ring-red-500")}
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Email address"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && (
                                            <p className="text-xs absolute left-0 -bottom-4 text-red-500">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="flex flex-col gap-1 relative">
                                    <div className="flex gap-2 relative">
                                        <Lock className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                                        <Input
                                            className={cn("pl-8", errors.password && "ring-2 ring-red-500")}
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="p-1 h-min absolute top-[50%] translate-y-[-50%] right-2"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <Eye className="text-muted-foreground size-4" />
                                            ) : (
                                                <EyeClosed className="text-muted-foreground size-4" />
                                            )}
                                        </Button>
                                        {errors.password && (
                                            <p className="text-xs absolute -bottom-4 text-red-500">{errors.password}</p>
                                        )}
                                    </div>
                                    <Link to={'/forgot-password'} className="text-sm mt-2 ml-auto underline cursor-pointer">Forgot Your Password?</Link>
                                </div>

                                {/* General Error */}
                                {errors.general && (
                                    <p className="text-sm text-center text-red-500">
                                        {errors.general}
                                    </p>
                                )}

                                {/* Login Button */}
                                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                                    {isLoggingIn ? "Logging in..." : "Login"}
                                </Button>
                            </div>
                        </form>
                        <GoogleLoginButton className={"my-6"} />
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to={"/signup"} className="underline">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
