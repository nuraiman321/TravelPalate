import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { FaTiktok, FaInstagram, FaShopware } from "react-icons/fa";
import { FaShop, FaLocationDot } from "react-icons/fa6";
import { FoodPlaceItem, StateItem, TiktokData } from "@/config/model";
import { generateImageUrl, generateTiktokThumbnail } from "@/config/API";
import Tooltips from "@/components/tooltip";

interface ShopCardProps {
  info: FoodPlaceItem;
  state: string;
}

interface Data {
  html: string;
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

const ShopCard = ({ info, state }: ShopCardProps) => {
  const [stateDisplay, setStateDisplay] = useState("");
  const [thumbnail, setThumbnail] = useState<String | undefined | null>(null);
  const [title, setTitle] = useState<String | undefined | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // let filterState = state.filter(data => data.id == info?.state4)
  // setStateDisplay(filterState[0]?.state);
  // setStateDisplay(stt);
  // console.log(filterState, "res")
  const fetchData = async () => {
    try {
      const tiktokData: TiktokData | null = await generateTiktokThumbnail(
        info.tiktok_reference
      );
      // console.log("TIKTOK", tiktokData?.title);
      setThumbnail(tiktokData?.thumbnail_url);
      setTitle(tiktokData?.title);
      // Do something with the thumbnail URL
    } catch (error) {
      console.error("Failed to generate TikTok thumbnail:", error);
      // Handle errors
    }
  };

  useEffect(() => {
    fetchData();
  }, [info]);
  return (
    <Card className="py-4 ">
      <CardBody className="overflow-visible py-2">
        <Image
          isZoomed
          alt="Card background"
          className="object-fill rounded-xl img-height "
          // src={generateImageUrl(info.image)}
          src={`${
            thumbnail != null ? thumbnail : generateImageUrl(info.image)
          }`}
          // style={{ height: 300}}
        />
        <div className="relative "></div>
      </CardBody>
      <CardFooter className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny font-bold">{info.diningcategory?.category}</p>
        <small className="text-default-500">
          {info.city != null ? info.city + "," : ""}{" "}
          {/* {capitalizeFirstLetter(info.state) ?? ""} */}
          {info.states?.state}
        </small>
        <div className="w-full flex  justify-between">
          <h4 className="font-bold text-large">
            {capitalizeFirstLetter(info.name) ?? ""}
            {/* {stateDisplay} */}
          </h4>
          {title != null ? <Tooltips info={title} /> : ""}
        </div>
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
          {info.locationLink != null ? (
            <Button
              size="md"
              isIconOnly
              variant="faded"
              aria-label="Take a photo"
              onClick={() => handleButtonRefenrece(info.locationLink)}
            >
              <FaLocationDot />
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
