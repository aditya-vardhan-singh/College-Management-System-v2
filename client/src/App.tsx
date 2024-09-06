import * as React from "react";
import Button from "@mui/joy/Button";

export default function App() {
  return (
    <>
      <div>
        <h1 className="px-8 py-8 font-bold text-xl">Hello</h1>
      </div>
      <div className="p-8">
        <Button variant="solid">Hello world</Button>
      </div>
    </>
  );
}
