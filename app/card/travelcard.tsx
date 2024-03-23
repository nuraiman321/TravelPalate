import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { FaTiktok, FaInstagram, FaShopware } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { TiktokData, TravelPlaceItem } from "@/config/model";
import { generateImageUrl, generateTiktokThumbnail } from "@/config/API";
import Tooltips from "@/components/tooltip";

interface TravelCardProps {
  info: TravelPlaceItem;
  state: string;
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

const TravelCard = ({ info, state }: TravelCardProps) => {
  const [stateDisplay, setStateDisplay] = useState("");
  const [thumbnail, setThumbnail] = useState<String | null| undefined>(null);
  const [title, setTitle] = useState<String | undefined | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // let filterState = state.filter(data => data.id == info?.state4)
  // setStateDisplay(filterState[0]?.state);
  // setStateDisplay(stt);
  // console.log(filterState, "res")

  const fetchData = async () => {
    // try {
    //   const response = await fetch(`https://www.tiktok.com/oembed?url=${info.tiktok_reference}`);
    //   if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //   }
    //   const jsonData = await response.json();
    //   // console.log(jsonData, "RESULT");
    //   setThumbnail(jsonData?.thumbnail_url);
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // } finally {
    //   setLoading(false);
    // }

    try {
      const ttUrl = "..."; // Provide the TikTok URL here
      const tiktokData:TiktokData | null = await generateTiktokThumbnail(info.tiktok_reference);
      // console.log("Tiktok:", tiktokData );
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
    <Card className="py-4">
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl "
          // src={generateImageUrl(info.image)}
          src={`${thumbnail != null ? thumbnail : generateImageUrl(info.image)}`}
          style={{ width: "100%" }}
        />
      </CardBody>
      <CardFooter className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny font-bold">
          {info.accommodationType?.accommodationName}
        </p>
        <small className="text-default-500">
          {info.City != null ? info.City + "," : ""}{" "}
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
        </div>
      </CardFooter>
    </Card>
  );
};
export default TravelCard;
