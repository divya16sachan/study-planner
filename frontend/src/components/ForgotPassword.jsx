import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useAuthStore } from "@/stores/authStore";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { toast } from "sonner";

const validatePassword = (password) => password.trim().length >= 8;
const validateConfirmPassword = (password, confirmPassword) => password === confirmPassword;

const ForgotPassword = ({ trigger }) => {
    const { authUser } = useAuthStore();
    const {
        requestResetPasswordOtp,
        resetPassword,
        isSendingOtp,
        isResettingPassword,
    } = useAuthStore();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        let interval;
        if (cooldown > 0) {
            interval = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [cooldown]);


    const handleResetPassword = async () => {
        setPasswordError("");
        setConfirmPasswordError("");

        if (!validatePassword(password)) {
            setPasswordError("Password must be at least 8 characters.");
            return;
        }

        if (!validateConfirmPassword(password, confirmPassword)) {
            setConfirmPasswordError("Passwords do not match.");
            return;
        }

        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }

        const res = await resetPassword({
            email: authUser.email,
            newPassword: password.trim(),
            otp,
        });

        if (res) {
            setIsOpen(false);
            setPassword("");
            setConfirmPassword("");
            setOtp("");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px] z-[60]">
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                        We'll send an OTP to your registered email address to reset your password.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">

                    {/* Password Field */}
                    <div className="grid relative items-center gap-1">
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                className="pr-10"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError("");
                                }}
                                disabled={isResettingPassword}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-1 transform -translate-y-1/2 h-8 w-8"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
                            </Button>
                        </div>
                        {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="grid relative items-center gap-1">
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                className="pr-10"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setConfirmPasswordError("");
                                }}
                                disabled={isResettingPassword}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-1 transform -translate-y-1/2 h-8 w-8"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
                            </Button>
                        </div>
                        {confirmPasswordError && <p className="text-xs text-red-500">{confirmPasswordError}</p>}
                    </div>

                    {/* OTP Field */}
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
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
                            <Button
                                variant="outline"
                                onClick={() => requestResetPasswordOtp(authUser.email)}
                                disabled={cooldown > 0 || isSendingOtp}
                                className="min-w-[100px]"
                            >
                                {isSendingOtp ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : cooldown > 0 ? (
                                    `${cooldown}s`
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
                        disabled={
                            isResettingPassword ||
                            passwordError ||
                            confirmPasswordError ||
                            otp.length !== 6 ||
                            !password ||
                            !confirmPassword
                        }
                    >
                        {isResettingPassword ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Reset Password
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPassword;
