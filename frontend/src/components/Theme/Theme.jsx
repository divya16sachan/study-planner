import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Colors from "./Colors";
import Radius from "./Radius";
import CssVariables from "./CssVariables";


const Theme = () => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cutomize Theme</CardTitle>
        <p className="text-xs text-muted-foreground">
          Pick a style and color for your components.
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        <Colors/>
        <Radius/>
        <CssVariables/>
      </CardContent>

    </Card>
  );
};

export default Theme;
