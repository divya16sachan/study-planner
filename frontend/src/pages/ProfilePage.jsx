import { cn } from "@/lib/utils";

import React, { useState } from 'react';
import { DrawerDialog } from "../components/EditProfile";
import { Button } from '@/components/ui/button';
import { Camera, Pencil } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import defaultAvatar from "../../public/avatar.png";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  return (
    <div className="p-4">
      <Card className="max-w-screen-md mx-auto overflow-hidden">
        <div className="h-52 bg-muted/50 relative">
          <img
            src="https://ui.shadcn.com/placeholder.svg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
        <CardContent>
          <div className="border-b pb-8 mb-8 flex items-center space-x-4">
            <Avatar className="relative shadow-md size-48 shrink-0 border-8 border-background -mt-14 rounded-full">
              <AvatarImage
                className="w-full h-full object-cover rounded-full"
                // src={"https://github.com/shadcn.png"}
                alt="@shadcn"
              />
              <AvatarFallback className="text-4xl">
                <img
                  className="w-full h-full object-cover dark:brightness-[0.2]"
                  src={defaultAvatar}
                  alt="shadcn"
                />
              </AvatarFallback>
              <Button variant="secondary" size="icon" className="p-0 absolute bottom-2 right-2 z-10 pointer">
                <label htmlFor="upload-photo" className="p-4 flex items-center space-x-2 cursor-pointer">
                  <Camera />
                  <input type="file" hidden id="upload-photo" accept="image/*" />
                </label>
              </Button>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{authUser?.fullName}</h2>
              <p className="text-gray-500">@{authUser?.userName}</p>
            </div>
          </div>


          <div className="space-y-4">
            <div>
              <Label className="text-zinc-500 mb-2 inline-block">Username</Label>
              <div className="relative overflow-hidden rounded-lg select-none flex bg-sidebar border border-sidebar-border justify-between items-center px-4 py-3">
                {authUser?.userName}
                <DrawerDialog
                  triggerButton={
                    <Button
                      className="border-l absolute h-full rounded-none top-0 right-0" variant="ghost">
                      <Pencil />
                    </Button>
                  }
                >
                  <ProfileForm
                    apiEndPoint="user/update-username"
                    dataKey="userName"
                    field="Username"
                    defaultValue={authUser?.userName}
                  />
                </DrawerDialog>
              </div>
            </div>

            <div>
              <Label className="text-zinc-500 mb-2 inline-block">Full Name</Label>
              <div className="relative overflow-hidden rounded-lg select-none bg-sidebar border border-sidebar-border flex justify-between items-center px-4 py-3">
                {authUser?.fullName}
                <DrawerDialog
                  triggerButton={
                    <Button
                      className="border-l absolute h-full rounded-none top-0 right-0" variant="ghost">
                      <Pencil />
                    </Button>
                  }
                >
                  <ProfileForm
                    apiEndPoint="user/update-fullname"
                    dataKey="fullName"
                    field="Full Name"
                    defaultValue={authUser?.fullName}
                  />
                </DrawerDialog>
              </div>
            </div>

            <div>
              <Label className="text-zinc-500 mb-2 inline-block">Email</Label>
              <div className="relative overflow-hidden rounded-lg select-none bg-sidebar border border-sidebar-border flex justify-between items-center px-4 py-3">
                {authUser?.email}
                <DrawerDialog
                  triggerButton={
                    <Button
                      className="border-l absolute h-full rounded-none top-0 right-0" variant="ghost">
                      <Pencil />
                    </Button>
                  }
                >
                  <ProfileForm
                    apiEndPoint="user/update-email"
                    dataKey="email"
                    field="Email"
                    defaultValue={authUser?.email}
                  />
                </DrawerDialog>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function ProfileForm({ className, field, defaultValue, apiEndPoint, dataKey }) {
  const [value, setValue] = useState(defaultValue);
  const handleSubmit = async (e) => {
    console.log(dataKey, value);
    const data = {[dataKey] : value}
    try {
      const res = await axiosInstance.put(apiEndPoint, data);
      toast.success(res.data.message);
    } catch (error) {
      toast.success(error.response.data.message);
      console.log(error);
    }
  }
  return (
    <form onSubmit={handleSubmit} className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor={field}>{field}</Label>
        <Input
          type="text"
          id={field}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}

export default ProfilePage;
