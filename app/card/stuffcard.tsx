import React from "react";
import {Card, CardBody, CardFooter} from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { StuffCardInterface } from "@/config/model";



  interface stuffData{
    data: StuffCardInterface
  }
const StuffCard = ({data }: stuffData) => {
  const list = [
    {
      title: "Orange",
      img: "/images/fruit-1.jpeg",
      price: "$5.50",
    },
    {
      title: "Tangerine",
      img: "/images/fruit-2.jpeg",
      price: "$3.00",
    },
    {
      title: "Raspberry",
      img: "/images/fruit-3.jpeg",
      price: "$10.00",
    },
    {
      title: "Lemon",
      img: "/images/fruit-4.jpeg",
      price: "$5.30",
    },
    {
      title: "Avocado",
      img: "/images/fruit-5.jpeg",
      price: "$15.70",
    },
    {
      title: "Lemon 2",
      img: "/images/fruit-6.jpeg",
      price: "$8.00",
    },
    {
      title: "Banana",
      img: "/images/fruit-7.jpeg",
      price: "$7.50",
    },
    {
      title: "Watermelon",
      img: "/images/fruit-8.jpeg",
      price: "$12.20",
    },
  ];

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        <Card shadow="sm" key={data.id} isPressable onPress={() => console.log("item pressed")}>
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={data.prodcutTitle}
              className="w-full object-cover h-[140px]"
              src={data.imageId}
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{data.prodcutTitle}</b>
            <p className="text-default-500">{data.price}</p>
          </CardFooter>
        </Card>
    </div>
  );
}


export default StuffCard