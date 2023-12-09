"use client";
import React, { useState, useEffect, use, ReactElement } from "react";
import { Button } from "@nextui-org/button";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon, SearchIcon } from "@/components/icons";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import ShopCard from "./card/shopcard";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { endpoint, generateImageUrl, collection } from "@/config/API";
import { createDirectus, rest, readItems } from "@directus/sdk";
import {
  Dropdown,
  DropdownItem as MyDropdownItem,
  DropdownTrigger,
  DropdownMenu,
} from "@nextui-org/dropdown";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import {
  DiningCategory,
  DiningCategoryItem,
  FoodPlaceItem,
  StateItem,
} from "@/config/model";
import { Selection as LibrarySelection } from "@react-types/shared/src/selection";
import { log } from "console";

type MySelectionType = Set<string>;

const handleId = (selectedId: string) => {
  console.log("Selected Id:", selectedId);
  // Rest of your logic
};
export default function Home() {
  const [selectedKeys, setSelectedKeys] = useState<MySelectionType>(
    new Set(["All"])
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [stateApi, setStateApi] = useState<StateItem[]>([]);
  const [diningCatagory, setDiningCategory] = useState<DiningCategoryItem[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [oriFoodPlace, setOriFoodPlace] = useState<FoodPlaceItem[]>([]);
  const [foodPlace, setFoodPlace] = useState<FoodPlaceItem[]>([]);
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  const client = createDirectus(endpoint.url).with(rest());
  const [noDataMessage, setNoDataMessage] = useState("");
  let arr = [1, 2, 3, 4, 5];

  const renderDropdownItems = (stateApi: StateItem[]): ReactElement[] => {
    const defaultItem = (
      <MyDropdownItem value="All" key="All">
        All
      </MyDropdownItem>
    );
    const apiItems = stateApi.map((item, index) => (
      <MyDropdownItem key={item.state}>{item.state}</MyDropdownItem>
    ));
    return [defaultItem, ...apiItems];
  };

  const filterFoodPlace = () => {
    if (selectedValue !== "All") {
      setNoDataMessage("No food places available.")
      let newData = oriFoodPlace.filter(
        (data) => data.states?.state === selectedValue
      );
      setFoodPlace(newData);
    } else {
      setFoodPlace([...oriFoodPlace]);
    }
  };

  const fetcDiningCategory = async () => {
    try {
      const result = await client.request(
        readItems(collection.diningCatagory, {
          fields: ["category"],
        })
      );
      // console.log(result, "cattt");
      setDiningCategory(result as any as DiningCategoryItem[]);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchFoodPlace = async () => {
    try {
      setLoading(true);
      const result = await client.request(
        readItems(collection.foodPlace, {
          fields: [
            "name",
            "image",
            "category",
            "intagram_reference",
            "tiktok_reference",
            "facebook_reference",
            "website_link",
            "city",
            "state",
            {
              states: ["state"],
              diningcategory: ["name"],
            },
          ],
        })
      );
      // console.log(result, "FP");

      setLoading(false);
      setFoodPlace(result as any as FoodPlaceItem[]);
      setOriFoodPlace(result as any as FoodPlaceItem[]);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    filterFoodPlace();
  }, [selectedKeys]);

  useEffect(() => {
    fetchFoodPlace();
  }, []);

  useEffect(() => {
    fetcDiningCategory();
  }, []);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await fetch(endpoint.stateEndpoint);
        const data = await response.json();
        setStateApi(data.data);
        // console.log(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchState();
  }, []);
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="grid w-full gap-2">
        <Input
          aria-label="Search"
          classNames={{
            inputWrapper: "bg-default-100",
            input: "text-sm",
          }}
          labelPlacement="outside"
          placeholder="Location? Food? Category?"
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="search"
        />

        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="capitalize">
              {selectedKeys}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={(keys: LibrarySelection) => {
              setSelectedKeys(keys as MySelectionType);
            }}
          >
          
            {renderDropdownItems(stateApi)}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="grid sm:grid-cols-1 lg:grid-cols-4  gap-4">
        <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-4">
          {loading ? (
            <Spinner />
          ) : foodPlace.length === 0 ? (
            <p>{noDataMessage}</p>
          ) : (
            foodPlace.map((item) => (
              <div key={item.id}>
                <ShopCard info={item} state="state" />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8"></div>
    </section>
  );
}
