"use client";
import React, { useState, useEffect, use } from "react";
import { Button } from "@nextui-org/button";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon, SearchIcon } from "@/components/icons";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import ShopCard from "./card/shopcard";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { endpoint, generateImageUrl } from "@/config/API";
import {
  Dropdown,
  DropdownItem,
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
import { FoodPlaceItem, StateItem } from "@/config/model";
import { Selection as LibrarySelection } from "@react-types/shared/src/selection";

type MySelectionType = Set<string>;

export default function Home() {
  const [selectedKeys, setSelectedKeys] = useState<MySelectionType>(new Set());
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [stateApi, setStateApi] = useState<StateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [oriFoodPlace, setOriFoodPlace] = useState<FoodPlaceItem[]>([]);
  const [foodPlace, setFoodPlace] = useState<FoodPlaceItem[]>([]);
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  let arr = [1, 2, 3, 4, 5];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Now imageUrl is available, and you can use it in your API call
        const response = await fetch(endpoint.foodPlaceEndpoint);
        const data = await response.json();
        setOriFoodPlace(data.data);
        setFoodPlace(data.data);
        setLoading(false);
        // data.data.map(item => {

        // })
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint.stateEndpoint);
        const data = await response.json();
        setStateApi(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {/* <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>
          websites regardless of your design experience.
        </h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Beautiful, fast and modern React UI library.
        </h2>
      </div> */}
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
              {selectedValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={(keys: LibrarySelection) => {
              // Handle the selection change if needed
              setSelectedKeys(keys as MySelectionType);
            }}
          >
            {/* <DropdownItem key={"All"}>All</DropdownItem> */}
            {stateApi.map((item, index) => 
             <DropdownItem key={item.state}>{item.state}</DropdownItem>
            )}
            {/* Dropdown items */}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="grid sm:grid-cols-1 lg:grid-cols-4  gap-4">
        <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-4">
          {loading ? (
            <Spinner />
          ) : (
            foodPlace.map((item) => (
              <div key={item.id}>
                <ShopCard info={item} />
              </div>
            ))
            //   arr.map((item) => (
            //     <div>
            //     <ShopCard />
            //   </div>
            // ))
          )}
        </div>
      </div>

      <div className="mt-8"></div>
    </section>
  );
}
