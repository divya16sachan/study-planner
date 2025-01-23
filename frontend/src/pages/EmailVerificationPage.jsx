"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Card, CardContent } from "@/components/ui/card"

import { useAuthStore } from "@/stores/useAuthStore"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const FormSchema = z.object({
  emailVerificationCode: z.string().min(6, {
    message: "Your OTP must be 6 characters.",
  }),
})
// =====================================================
// =================== main function ===================
// =====================================================

const EmailVerificationPage = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      emailVerificationCode: "",
    },
  })
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const { verifyEmail, isVerifyingEmail, resendOTP, checkEmailStatus, emailStatus } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
        console.log(timer);
      }, 1000);
      return () => clearInterval(interval);
    }
    else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  useEffect(() => {
    const check = async()=>{
      await checkEmailStatus();
      if (emailStatus !== "pending") {
        navigate('/signup');
      }
    }

    check();
  }, []);

  const onSubmit = async (data) => {
    await verifyEmail(data);
  }
  const handleResendOTP = async () => {

  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6">
      <Card>
        <CardContent className="grid p-6">
          <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="emailVerificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Verification</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the OTP sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-sm flex items-center justify-between">
                <span>Don't get the OTP?</span>
                <Button
                  variant="link"
                  disabled={isResendDisabled}
                  onSend={handleResendOTP}
                >
                  {
                    isResendDisabled ? `${timer.toString().padStart(2, '0')} s` : "resend"
                  }
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={isVerifyingEmail}>
                {
                  isVerifyingEmail ?
                    <>
                      <Loader2 className="animate-spin" />
                      Please wait
                    </>
                    :
                    "Verify OTP"
                }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailVerificationPage
