import { Input } from "@nextui-org/react";

export default function StudentForm() {
  return (
    <>
      <div className="flex flex-row gap-4">
        <Input
          isRequired
          isClearable
          type="email"
          label="Email"
          labelPlacement="outside"
          style={{ borderWidth: 0, boxShadow: "none" }}
        />

        <Input
          type="email"
          label="Email"
          defaultValue="junior@nextui.org"
          description="We'll never share your email with anyone else."
          labelPlacement="outside"
          style={{ borderWidth: 0, boxShadow: "none" }}
        />
      </div>
    </>
  );
}
