import Theme from "@/components/Theme/Theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Outlet } from "react-router-dom";

const SettingsPage = () => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="p-4 max-w-screen-md w-full m-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage;
