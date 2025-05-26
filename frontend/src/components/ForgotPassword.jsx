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

const validatePassword = (password) => password.trim().length >= 8;
const validateConfirmPassword = (password, confirmPassword) => password === confirmPassword;

const ForgotPassword = ({ trigger }) => {
    const {sendResetPasswordOtp, isSendingOtp, isResettingPassword, resetPassword } = useAuthStore();

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
        const res = await sendPasswordResetOtp();
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
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px] z-[60]">
                <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogDescription>Generate an otp to you email before signup.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                    {/* Password Field */}
                    <div className="grid relative  items-center gap-4">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="pr-8"
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
                        {passwordError && <p className="absolute -bottom-4 text-xs text-red-500">{passwordError}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="grid relative items-center gap-4">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="pr-8"
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
                            onClick={sendResetPasswordOtp}
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
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPassword;
