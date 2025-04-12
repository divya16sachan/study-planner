import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { axiosInstance } from '@/lib/axios';
import { Label } from '@radix-ui/react-dropdown-menu';
import React, { useState } from 'react';

const ForgetPasswordPage = () => {
    const [formData, setFormData] = useState({ userName: '', otp: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(true);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axiosInstance.post('/password/forget', { userName: formData.userName });
            setOtpSent(true);
        } catch (error) {
            setErrors({ userName: error.response.data.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handFormSubmit} className="p-6 md:p-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="logo text-lg">NoteHub</h1>
                                <p className="text-balance text-muted-foreground">
                                    Forget Password
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="userName">Username</Label>
                                <Input
                                    id="userName"
                                    placeholder="username"
                                    value={formData.userName}
                                    autoComplete="username"
                                    required
                                    onChange={handleChange}
                                />
                                {errors.userName && <p className="text-red-500">{errors.userName}</p>}
                            </div>

                            {otpSent && (
                                <div className="space-y-2">
                                    <Label htmlFor="otp">OTP</Label>
                                    <InputOTP
                                        id="otp"
                                        maxLength={6}
                                        value={formData.otp}
                                        onChange={(value) => setFormData({ ...formData, otp: value })}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                    <div className='text-[0.8rem] text-muted-foreground'>
                                        Mail send to 
                                    </div>
                                </div>
                            )}

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    otpSent ? "Submit" : "Send OTP"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgetPasswordPage;
