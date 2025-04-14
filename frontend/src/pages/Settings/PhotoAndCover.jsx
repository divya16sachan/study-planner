import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Trash2 } from "lucide-react";
import React from "react";

const PhotoAndCover = () => {
  const { authUser } = useAuthStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-10">
        <div className="space-y-4">
          <Label className="text-base">Your Photo</Label>
          <div className="flex gap-8 items-center">
            <Avatar className="relative aspect-square shadow-md size-44 shrink-0 border-8 border-background rounded-full">
              <AvatarImage
                className="w-full h-full object-cover rounded-full bg-background"
                src={authUser?.avatarUrl}
                alt={authUser?.fullName || "user profile"}
              />
              <AvatarFallback className="text-4xl">
                <img
                  className="w-full h-full object-cover dark:brightness-[0.2]"
                  src="/avatar.png"
                  alt="shadcn"
                />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="font-semibold text-sm">
                  File smaller than 10MB and at least 400px by 400px
                </p>
                <p className="text-muted-foreground text-sm">
                  This image will be shwon in your profile page if you choose to
                  share it with other memeber it will also help us recognize you
                </p>
              </div>

              <div className="flex gap-2">
                <Button>Upload Photo</Button>
                <Button size="icon" variant="secondary">
                  <Trash2 />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base">Profile Page Cover</Label>
          <div className="flex gap-8 items-center">
            <div className="relative flex-shrink-0 size-44 overflow-hidden">
              <img
                src="/profile-cover.svg"
                alt="Image"
                className="h-full w-full object-cover dark:grayscale dark:brightness-[0.8] dark:invert"
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="font-semibold text-sm">
                  File smaller than 10MB and at least 1200px by 300px
                </p>
                <p className="text-muted-foreground text-sm">
                  This image will be shwon as background banner in your profile
                  page if you choose to share it with other members.
                </p>
              </div>

              <div className="flex gap-2">
                <Button>Upload Photo</Button>
                <Button size="icon" variant="secondary">
                  <Trash2 />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoAndCover;
