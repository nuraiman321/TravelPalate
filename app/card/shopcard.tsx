import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { FaTiktok, FaInstagram, FaShopware } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { FoodPlaceItem } from "@/config/model";
import { generateImageUrl } from "@/config/API";

interface ShopCardProps {
  info: FoodPlaceItem;
}

function capitalizeFirstLetter(sentence: string): string {
  if (sentence === null || sentence === "" || sentence === undefined) {
    return sentence;
  }
  const words = sentence.split(" ");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(" ");
}

const handleButtonRefenrece = (link: string | null) => {
  if (link != null) {
    window.open(link, "_blank"); // Opens the link in a new tab
  } else {
    return "";
  }
};

const ShopCard = ({ info }: ShopCardProps) => {
  return (
    <Card className="py-4">
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={generateImageUrl(info.image)}
        />
      </CardBody>
      <CardFooter className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">{info.category}</p>
        <small className="text-default-500">
          {info.city != null ? info.city + "," : ""}{" "}
          {capitalizeFirstLetter(info.state) ?? ""}
        </small>
        <h4 className="font-bold text-large">
          {capitalizeFirstLetter(info.name) ?? ""}
        </h4>
        <div className="flex gap-1 items-end">
          {info.website_link != null ? (
            <Button
              size="md"
              isIconOnly
              variant="faded"
              aria-label="Take a photo"
            >
              <FaShop />
            </Button>
          ) : (
            ""
          )}

          {info.tiktok_reference != null ? (
            <Button
              size="md"
              isIconOnly
              variant="faded"
              aria-label="Take a photo"
              onClick={() => handleButtonRefenrece(info.tiktok_reference)}
            >
              <FaTiktok />
            </Button>
          ) : (
            ""
          )}

          {info.instagram_reference != null ? (
            <Button
              size="md"
              isIconOnly
              variant="faded"
              aria-label="Take a photo"
              onClick={() => handleButtonRefenrece(info.instagram_reference)}
            >
              <FaInstagram />
            </Button>
          ) : (
            ""
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
export default ShopCard;
