"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/stores/authStore"
import { useEffect, useState } from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Loader2 } from "lucide-react"

const validateName = (name) => name.trim().length >= 3
const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

const EditProfile = ({ trigger }) => {
    const {
        authUser,
        updateName,
        updateEmail,
        sendEmailUpdateOtp,
        isRenaming,
        isSendingOtp,
        isUpdatingEmail,
    } = useAuthStore()

    const [name, setName] = useState(authUser.name)
    const [email, setEmail] = useState(authUser.email)
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [nameTouched, setNameTouched] = useState(false)
    const [emailTouched, setEmailTouched] = useState(false)
    const [otp, setOtp] = useState("")
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        let interval;
        if (cooldown > 0) {
            interval = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [cooldown]);

    const handleNameChange = async () => {
        setNameTouched(true)
        if (!validateName(name)) {
            setNameError("Name must be at least 3 characters.")
            return
        }
        if (name === authUser.name) return
        const response = await updateName(name.trim())
        if (response) {
            setName(response.user.name)
        }
    }

    const handleSendOtp = async () => {
        setEmailTouched(true)
        if (!validateEmail(email)) {
            setEmailError("Enter a valid email.")
            return
        }
        if (email === authUser.email) return;
        const res = await sendEmailUpdateOtp(email.trim());
        if(res){
            setCooldown(60); 
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px] z-[60]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                    {/* Name Field */}
                    <div className="grid relative grid-cols-[3fr_1fr] items-center gap-4">
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setNameTouched(true)
                                setName(e.target.value)
                                if (!validateName(e.target.value)) {
                                    setNameError("Name must be at least 3 characters.")
                                } else {
                                    setNameError("")
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === " ") {
                                    e.preventDefault()
                                    setName((prev) => prev + " ")
                                }
                            }}
                            placeholder="Enter your name"
                            className="w-full"
                        />
                        {nameTouched && nameError && (
                            <p className="absolute -bottom-4 text-xs text-red-500">{nameError}</p>
                        )}
                        <Button
                            variant="outline"
                            onClick={handleNameChange}
                            className="w-full"
                            disabled={isRenaming || name === authUser.name || !!nameError}
                        >
                            {isRenaming ? "Renaming..." : "Rename"}
                        </Button>
                    </div>

                    {/* Email Field */}
                    <div className="grid relative grid-cols-[3fr_1fr] items-center gap-4">
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmailTouched(true)
                                setEmail(e.target.value)
                                if (!validateEmail(e.target.value)) {
                                    setEmailError("Enter a valid email.")
                                } else {
                                    setEmailError("")
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === " ") {
                                    e.preventDefault()
                                    setEmail((prev) => prev + " ")
                                }
                            }}
                            placeholder="Enter your email"
                            className="w-full"
                        />
                        {emailTouched && emailError && (
                            <p className="absolute -bottom-4 text-xs text-red-500">{emailError}</p>
                        )}
                        <Button
                            className="w-full"
                            variant="outline"
                            type="button"
                            onClick={handleSendOtp}
                            disabled={cooldown > 0 || isSendingOtp || (email === authUser.email) || !!emailError}
                        >
                            {isSendingOtp ? (
                                <>
                                    Sending... <Loader2 className="animate-spin ml-2" />
                                </>
                            ) : cooldown > 0 ? (
                                `Resend in ${cooldown}s`
                            ) : (
                                "Send otp"
                            )}
                        </Button>
                    </div>

                    {/* OTP Field */}
                    <div className="grid grid-cols-[3fr_1fr] items-center gap-4">
                        <InputOTP
                            maxLength={6}
                            className="w-full"
                            value={otp}
                            onChange={setOtp}
                            pattern={REGEXP_ONLY_DIGITS}
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
                            className="w-full"
                            onClick={() => updateEmail({ newEmail: email.trim(), otp })}
                            disabled={
                                isUpdatingEmail || otp.length !== 6 || !validateEmail(email)
                            }
                        >
                            {isUpdatingEmail ? "Updating..." : "Update Email"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfile
