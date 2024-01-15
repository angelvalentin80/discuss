"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";

interface FormButtonProps {
  children: React.ReactNode;
}

// Children is a special prop that allows you to pass components or JSX directly between the opening and closing tags of a component
export default function FormButton({ children }: FormButtonProps) {
  // pending starts off as false, and then as soon as you submit the form it goes to true
  // That will be the sign that we want to show the loading spinner to the user
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending}>
      {/* So this {children} is replaced by "Save" */}
      {children}
    </Button>
  );
}
