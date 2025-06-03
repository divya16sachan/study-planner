import React, { useEffect, useState, useCallback } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useAuthStore } from "@/stores/authStore";
import { Eye, EyeClosed, Loader2, Lock, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const {
        requestResetPasswordOtp,
        resetPassword,
        isSendingOtp,
        isResettingPassword,
        getUserByEmail,
    } = useAuthStore();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [user, setUser] = useState(null);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    // Email validation regex
    const validateEmailFormat = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Password validation
    const validatePassword = (password) => {
        return password.length >= 8;
    };

    // Confirm password validation
    const validateConfirmPassword = (password, confirmPassword) => {
        return password === confirmPassword;
    };

    // Debounced email lookup
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (email && validateEmailFormat(email)) {
                setIsCheckingEmail(true);
                try {
                    const userData = await getUserByEmail(email);
                    setUser(userData);
                    console.log(userData);
                    setEmailError("");
                    setIsValidEmail(true);
                } catch (error) {
                    setUser(null);
                    setEmailError("No account found with this email");
                    setIsValidEmail(false);
                } finally {
                    setIsCheckingEmail(false);
                }
            } else if (email) {
                setEmailError("Please enter a valid email address");
                setIsValidEmail(false);
                setUser(null);
            } else {
                setEmailError("");
                setIsValidEmail(false);
                setUser(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [email, getUserByEmail]);

    // Cooldown timer
    useEffect(() => {
        let interval;
        if (cooldown > 0) {
            interval = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [cooldown]);

    const handleSendOtp = async () => {
        if (!isValidEmail) {
            setEmailError("Please enter a valid registered email");
            return;
        }
        const res = await requestResetPasswordOtp(email);
        if (res) {
            setCooldown(60);
        }
    };

    const handleResetPassword = async () => {
        if (!validatePassword(password)) {
            setPasswordError("Password must be at least 8 characters.");
            return;
        }
        if (!validateConfirmPassword(password, confirmPassword)) {
            setConfirmPasswordError("Passwords do not match.");
            return;
        }
        if (otp.length !== 6) {
            return;
        }
        const res = await resetPassword({
            email: user.email,
            newPassword: password.trim(),
            otp
        });

        if(res){
            navigate('/login');
        }
    };

    return (
        <div className='max-w-screen-lg flex items-center justify-center mx-auto w-full p-4 mt-16'>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>Enter your email to receive a password reset OTP</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        {/* User preview when email is valid */}
                        {user && (
                            <div className='flex gap-2 bg-accent/10 p-2 rounded-xl items-center'>
                                <Avatar className="size-10">
                                    <AvatarImage
                                        className="w-full h-full object-cover rounded-full"
                                        src={user.picture}
                                        alt={user.name}
                                        referrerPolicy="no-referrer"
                                    />
                                    <AvatarFallback className="bg-transparent">
                                        <img src="./avatar.png" alt="" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className='text-sm'>
                                    <strong className='font-semibold'>{user.name}</strong>
                                    <p className='text-muted-foreground text-xs'>{user.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="grid relative items-center gap-1">
                            <div className="flex gap-2 relative">
                                <Mail className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-8"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.trim())}
                                    disabled={isSendingOtp || isResettingPassword}
                                />
                                {isCheckingEmail && (
                                    <Loader2 className="absolute top-[10px] right-3 size-4 animate-spin" />
                                )}
                            </div>
                            {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="grid relative items-center gap-1">
                            <div className="flex gap-2 relative">
                                <Lock className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="px-8"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordError(validatePassword(e.target.value) ? "" : "Password must be at least 8 characters.");
                                    }}
                                    disabled={isResettingPassword}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="p-1 h-min absolute top-[50%] translate-y-[-50%] right-2"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <Eye className="text-muted-foreground size-4" /> : <EyeClosed className="text-muted-foreground size-4" />}
                                </Button>
                            </div>
                            {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="grid relative items-center gap-1">
                            <div className="flex gap-2 relative">
                                <Lock className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="px-8"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setConfirmPasswordError(validateConfirmPassword(password, e.target.value) ? "" : "Passwords do not match.");
                                    }}
                                    disabled={isResettingPassword}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="p-1 h-min absolute top-[50%] translate-y-[-50%] right-2"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <Eye className="text-muted-foreground size-4" /> : <EyeClosed className="text-muted-foreground size-4" />}
                                </Button>
                            </div>
                            {confirmPasswordError && <p className="text-xs text-red-500">{confirmPasswordError}</p>}
                        </div>

                        {/* OTP Field */}
                        <div className='space-y-2'>
                            <div className="relative grid grid-cols-[3fr_1fr] items-center gap-4">
                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={setOtp}
                                    pattern={REGEXP_ONLY_DIGITS}
                                    disabled={isResettingPassword}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                                {/* Send OTP Button */}
                                <Button
                                    variant="outline"
                                    onClick={handleSendOtp}
                                    disabled={!user || cooldown > 0 || isSendingOtp || !isValidEmail}
                                >
                                    {isSendingOtp ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 size-4" />
                                        </>
                                    ) : cooldown > 0 ? (
                                        `Resend in ${cooldown}s`
                                    ) : (
                                        "Get OTP"
                                    )}
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Enter the 6-digit OTP sent to your email
                            </p>
                        </div>

                        {/* Reset Password Button */}
                        <Button
                            onClick={handleResetPassword}
                            disabled={isResettingPassword || passwordError || confirmPasswordError || otp.length !== 6}
                        >
                            {isResettingPassword ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 size-4" />
                                    Resetting...
                                </>
                            ) : "Reset Password"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPasswordPage