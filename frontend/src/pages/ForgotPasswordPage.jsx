import React, { useEffect, useState } from 'react'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useAuthStore } from "@/stores/authStore";
import { Eye, EyeClosed, Loader2, Lock, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ForgotPasswordPage = () => {
    const {
        sendResetPasswordOtp,
        isSendingOtp,
        isResettingPassword,
        resetPassword
    } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        const res = await sendResetPasswordOtp(email); // Pass the email here
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
        await resetPassword({ newPassword: password.trim(), otp });
    };

    return (
        <div className='max-w-screen-lg flex items-center justify-center mx-auto w-full p-4 mt-16'>
            <Card>
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>Generate an otp to you email before signup.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className='flex gap-2 bg-accent/10 p-2 rounded-xl items-center'>
                            <div className='size-10 rounded-full bg-accent'></div>
                            <div className='text-sm'>
                                <strong className='font-semibold'>Abhijeet Singh</strong>
                                <p className='text-muted-foreground text-xs'>abhijeet62008@gmail.com</p>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="grid relative items-center gap-4">
                            <div className="flex gap-2 relative">
                                <Mail className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-8"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="grid relative  items-center gap-4">
                            <div className="flex gap-2 relative">
                                <Lock className="absolute top-[50%] translate-y-[-50%] left-2 text-muted-foreground size-4" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="px-8"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordError(validatePassword(e.target.value) ? "" : "Password must be at least 6 characters.");
                                    }}
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
                            {passwordError && <p className="absolute -bottom-4 text-xs text-red-500">{passwordError}</p>}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="grid relative items-center gap-4">
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
                            {confirmPasswordError && <p className="absolute -bottom-4 text-xs text-red-500">{confirmPasswordError}</p>}
                        </div>

                        {/* OTP Field */}
                        <div className="relative grid grid-cols-[3fr_1fr] items-center gap-4">
                            <InputOTP maxLength={6} value={otp} onChange={setOtp} pattern={REGEXP_ONLY_DIGITS}>
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
                                disabled={cooldown > 0 || isSendingOtp}
                            >
                                {isSendingOtp ? (
                                    <>
                                        Sending... <Loader2 className="animate-spin ml-2" />
                                    </>
                                ) : cooldown > 0 ? (
                                    `Resend in ${cooldown}s`
                                ) : (
                                    "Get OTP"
                                )}
                            </Button>
                        </div>


                        {/* Reset Password Button */}
                        <Button
                            variant="outline"
                            onClick={handleResetPassword}
                            disabled={isResettingPassword || passwordError || confirmPasswordError || otp.length !== 6}
                        >
                            {isResettingPassword ? "Resetting..." : "Reset Password"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPasswordPage
