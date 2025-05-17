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

const EditProfile = ({ trigger }) => {
    const {
        authUser,
        updateName,
        updateEmail,
        sendEmailUpdateOtp,
        isSendingOtp,
        isUpdatingEmail,
    } = useAuthStore()

    const [name, setName] = useState(authUser.name)
    const [email, setEmail] = useState(authUser.email)

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
                    <div className="grid grid-cols-[3fr_1fr] items-center gap-4">
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full"
                            autoFocus
                        />
                        <Button variant="outline" className="w-full">
                            Rename
                        </Button>
                    </div>

                    {/* Email Field */}
                    <div className="grid grid-cols-[3fr_1fr] items-center gap-4">
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full"
                        />
                        <Button variant="outline" className="w-full">
                            Send OTP
                        </Button>
                    </div>

                    {/* OTP Field */}
                    <div className="grid grid-cols-[3fr_1fr] items-center gap-4">
                        <InputOTP maxLength={6} className="w-full">
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
                        <Button variant="outline" className="w-full">
                            Update Email
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfile
