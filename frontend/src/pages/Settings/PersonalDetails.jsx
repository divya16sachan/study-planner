import { cn } from "@/lib/utils";

import React, { useState } from "react";
import { DrawerDialog } from "@/components/EditProfile";
import { Button } from "@/components/ui/button";
import { Camera, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import imageCompression from "browser-image-compression";

const PersonalDetails = () => {
  const { authUser, uploadUserAvatar } = useAuthStore();
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const option = {
      maxSizeMB: 0.2,
      maxWidthOrheight: 1920,
      useWebWorker: true,
    };
    try {
      // Show a preview while compressing the image
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);

      // Compressing the image
      const compressedFile = await imageCompression(file, option);

      // Converting to base64 string
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        const imageBase64 = reader.result;
        await uploadUserAvatar({ avatarBase64: imageBase64 });
      };
    } catch (error) {
      console.error("Error compressing or uploading avatar:\n", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label className="text-zinc-500 mb-2 inline-block">Username</Label>
            <div className="relative overflow-hidden rounded-lg select-none flex bg-sidebar border border-sidebar-border justify-between items-center px-4 py-3">
              {authUser?.userName}
              <DrawerDialog
                triggerButton={
                  <Button
                    className="border-l absolute h-full rounded-none top-0 right-0"
                    variant="ghost"
                  >
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
                    className="border-l absolute h-full rounded-none top-0 right-0"
                    variant="ghost"
                  >
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
                    className="border-l absolute h-full rounded-none top-0 right-0"
                    variant="ghost"
                  >
                    <Pencil />
                  </Button>
                }
              >
                <ProfileForm
                  apiEndPoint="email/update"
                  dataKey="newEmail"
                  field="Email"
                  defaultValue={authUser?.email}
                />
              </DrawerDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function ProfileForm({ className, field, defaultValue, apiEndPoint, dataKey }) {
  const [value, setValue] = useState(defaultValue);
  const { updateUserField } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { [dataKey]: value };
    await updateUserField(apiEndPoint, data);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-4", className)}
    >
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

export default PersonalDetails;
