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
  const defaultState = "All State";
  const defaultCategory = "All Category";
  const [isFilterState, setIsFilterState] = useState(false);
  const [isFilterCategory, setIsFilterCategory] = useState(false);
  const [isDefaultState, setIsDefaultState] = useState(false);
  const [isDefaultCategory, setIsDefaultCategory] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [stateApi, setStateApi] = useState<StateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [oriFoodPlace, setOriFoodPlace] = useState<FoodPlaceItem[]>([]);
  const [foodPlace, setFoodPlace] = useState<FoodPlaceItem[]>([]);
  const client = createDirectus(endpoint.url).with(rest());
  const [noDataMessage, setNoDataMessage] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<MySelectionType>(
    new Set([defaultState])
  );
  const [selectedKeysCategory, setSelectedKeysCategory] =
    useState<MySelectionType>(new Set([defaultCategory]));
  const [diningCatagory, setDiningCategory] = useState<DiningCategoryItem[]>(
    []
  );
  const selectedState = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  const selectedCategory = React.useMemo(
    () => Array.from(selectedKeysCategory).join(", ").replaceAll("_", " "),
    [selectedKeysCategory]
  );

  let arr = [1, 2, 3, 4, 5];

  const renderDropdownState = (stateApi: StateItem[]): ReactElement[] => {
    const defaultItem = (
      <MyDropdownItem value={defaultState} key={defaultState}>
        {defaultState}
      </MyDropdownItem>
    );
    const apiItems = stateApi.map((item, index) => (
      <MyDropdownItem key={item.state}>{item.state}</MyDropdownItem>
    ));
    return [defaultItem, ...apiItems];
  };

  const renderDropdownCategory = (
    diningCategory: DiningCategoryItem[]
  ): ReactElement[] => {
    const defaultItem = (
      <MyDropdownItem value={defaultCategory} key={defaultCategory}>
        {defaultCategory}
      </MyDropdownItem>
    );
    const categoryItems = diningCategory.map((item, index) => (
      <MyDropdownItem key={item.category}>{item.category}</MyDropdownItem>
    ));
    return [defaultItem, ...categoryItems];
  };

  function filteringCategory(data: FoodPlaceItem[], selectedCat: string) {
    return data.filter((data) => data.diningcategory?.category === selectedCat);
  }

  function filteringState(data: FoodPlaceItem[], selectedSt: string) {
    return data.filter((data) => data.states?.state === selectedSt);
  }

  const filterFoodPlaceCat = () => {
    if (selectedCategory !== defaultCategory) {
      //category no equal to all
      setIsDefaultCategory(false);
      setIsFilterCategory(true);
      // setNoDataMessage("No food places available in " + defaultCategory)
      if (!isFilterState) {
        //user not filtering state
        let newData = filteringCategory(oriFoodPlace, selectedCategory);
        setFoodPlace(newData);
      } else {
        //user filtering state
        let newData = filteringCategory(
          filteringState(oriFoodPlace, selectedState),
          selectedCategory
        );
        setFoodPlace(newData);
      }
    } else {
      setIsDefaultCategory(true);
      setIsFilterCategory(false);
      // category equal to all
      if (!isFilterState) {
        //not filtering state
        setFoodPlace([...oriFoodPlace]);
      } else {
        //filtering state
        let newData = filteringState(oriFoodPlace, selectedState);
        setFoodPlace(newData);
      }
    }
  };
  const filterFoodPlace = () => {
    if (selectedState !== defaultState) {
      setIsDefaultState(false); // user choose state
      setIsFilterState(true);
      if (!isFilterCategory) {
        //check if user is not filtering category
        setNoDataMessage("No food places available in " + selectedState);
        // let newData = oriFoodPlace.filter(
        //   (data) => data.states?.state === selectedState
        // );
        let newData = filteringState(oriFoodPlace, selectedState);
        setFoodPlace(newData);
      } else {
        //user filtering category
        //
        let newData = filteringState(
          filteringCategory(oriFoodPlace, selectedCategory),
          selectedState
        );
        setFoodPlace(newData);
      }
    } else {
      setIsDefaultState(true); // state equal to all
      setIsFilterState(false);
      if (!isFilterCategory) {
        //check if user is filtering category
        setFoodPlace([...oriFoodPlace]);
      } else {
        let newData = filteringCategory(oriFoodPlace, selectedCategory);
        setFoodPlace(newData);
      }
    }
  };

  const fetchDiningCategory = async () => {
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
  const fetchState = async () => {
    try {
      const result = await client.request(
        readItems(collection.state, {
          fields: ["state"],
        })
      );
      // console.log(result, "cattt");
      setStateApi(result as any as StateItem[]);
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
          filter: { status: { _eq: "published" } },
          fields: [
            "name",
            "image",
            "category",
            "intagram_reference",
            "tiktok_reference",
            "facebook_reference",
            "website_link",
            "city",
            "locationLink",
            "state",
            {
              states: ["state"],
              diningcategory: ["category"],
            },
          ],
        })
      );
      console.log(result, "FP");

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
    filterFoodPlaceCat();
  }, [selectedKeysCategory]);

  useEffect(() => {
    fetchFoodPlace();
  }, []);

  useEffect(() => {
    fetchDiningCategory();
  }, []);

  useEffect(() => {
    fetchState();
  }, []);
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="grid w-full gap-2">
        {/* <Input
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
        /> */}

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
            {renderDropdownState(stateApi)}
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="capitalize">
              {selectedKeysCategory}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeysCategory}
            onSelectionChange={(keys: LibrarySelection) => {
              setSelectedKeysCategory(keys as MySelectionType);
            }}
          >
            {renderDropdownCategory(diningCatagory)}
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
