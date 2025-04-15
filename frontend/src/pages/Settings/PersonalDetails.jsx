import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/useAuthStore";

const PersonalDetails = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Field
          label="Full Name"
          field="fullName"
          apiEndPoint="user/update-fullname"
          />

        <Field
          label="Username"
          field="userName"
          apiEndPoint="user/update-username"
        />

        <Field 
          label="Email" 
          field="email" 
          apiEndPoint="email/update" 
        />
      </CardContent>
      
    </Card>
  );
};

function Field({ label, field, apiEndPoint }) {
  const { authUser, updateUserField } = useAuthStore();
  const [immutable, setImmutable] = useState(true);
  const [value, setValue] = useState(authUser[field] || "");
  const inputRef = useRef(null);

  const handleUpdate = () => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    input.focus();
    input.select();

    setImmutable(false);
  };

  const handleSave = async () => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      setValue(authUser[field]);
      setImmutable(true);
      return;
    }
    if(trimmedValue === authUser[field]){
      setImmutable(true);
      return;
    }

    setImmutable(true);
    const data = { [field]: trimmedValue };
    const result = await updateUserField(apiEndPoint, data);
    if(!result){
      setValue(authUser[field]);
    }
  };

  const handleEnter = (e)=>{
    if(e.key === 'Enter'){
      e.preventDefault();
      inputRef.current?.blur();
    }
  }

  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="flex border border-input rounded-lg ">
        <Input
          className={`${immutable? 'focus-visible:ring-0 focus-visible:outline-none' : ''}border-none rounded-r-none`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          readOnly={immutable}
          onKeyDown={handleEnter}
          ref={inputRef}
        />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-l-none border border-l-input"
          onClick={handleUpdate}
        >
          <Pencil />
        </Button>
      </div>
    </div>
  );
}


export default PersonalDetails;
