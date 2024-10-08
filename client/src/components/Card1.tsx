import React from "react";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";

export default function Card1({
  img,
  pContent,
  btnContent,
  href,
}: {
  img: string;
  pContent: string;
  btnContent: string;
  href: string;
}) {
  return (
    <Card isFooterBlurred radius="lg" className="border-none">
      <Image
        alt="Woman listing to music"
        className="object-cover"
        height={200}
        src={img}
        width={200}
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/80">{pContent}</p>
        <Button
          className="text-tiny text-white bg-black/20"
          variant="flat"
          color="default"
          radius="lg"
          size="sm"
          onPress={() => {
            window.location.href = href;
          }}
        >
          {btnContent}
        </Button>
      </CardFooter>
    </Card>
  );
}

//
