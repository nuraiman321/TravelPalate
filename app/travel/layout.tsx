"use client";
import React, { useState, useEffect, use, ReactElement } from "react";
import { Button } from "@nextui-org/button";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon, SearchIcon } from "@/components/icons";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import ShopCard from "../card/shopcard";
import TravelCard from "../card/travelcard";
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
  TravelPlaceItem,
  StateItem,
  AccommodationType,
  NatureDestination,
} from "@/config/model";
import { Selection as LibrarySelection } from "@react-types/shared/src/selection";
type MySelectionType = Set<string>;

export default function TravelLayout() {
  const defaultState = "All State";
  const defaultAccommodation = "All Accommodation";
  const defaultNature = "All Nature Type";
  const [isFilterState, setIsFilterState] = useState(false);
  const [isFilterAccommodation, setIsFilterAccommodation] = useState(false);
  const [isFilterNatureDest, setIsFilterNatureDest] = useState(false);
  const [isDefaultState, setIsDefaultState] = useState(false);
  const [isDefaultAccommodation, setIsDefaultAccommodation] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [stateApi, setStateApi] = useState<StateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [oriTravelPlace, setOriTravelPlace] = useState<TravelPlaceItem[]>([]);
  const [TravelPlace, setTravelPlace] = useState<TravelPlaceItem[]>([]);
  const client = createDirectus(endpoint.url).with(rest());
  const [noDataMessage, setNoDataMessage] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<MySelectionType>(
    new Set([defaultState])
  );
  const [selectedKeysAcccommodation, setSelectedKeysAccommodation] =
  useState<MySelectionType>(new Set([defaultAccommodation]));
  const [selectedKeysNatureDest, setSelectedKeysNatureDest] = useState<MySelectionType>(
    new Set([defaultNature])
  );
  const [accommodation, setAccommodation] = useState<AccommodationType[]>([]);
  const [natureDestination, setNatureDestination] = useState<
    NatureDestination[]
  >([]);
  const selectedState = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  const selectedAccommodation = React.useMemo(
    () => Array.from(selectedKeysAcccommodation).join(", ").replaceAll("_", " "),
    [selectedKeysAcccommodation]
  );
  const selectedNatureDest = React.useMemo(
    () => Array.from(selectedKeysNatureDest).join(", ").replaceAll("_", " "),
    [selectedKeysNatureDest]
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

  const renderDropdownAccommodation = (
    accommodationType: AccommodationType[]
  ): ReactElement[] => {
    const defaultItem = (
      <MyDropdownItem value={defaultAccommodation} key={defaultAccommodation}>
        {defaultAccommodation}
      </MyDropdownItem>
    );
    const AccommodationItems = accommodationType.map((item, index) => (
      <MyDropdownItem key={item.accommodationName}>
        {item.accommodationName}
      </MyDropdownItem>
    ));
    return [defaultItem, ...AccommodationItems];
  };
  const renderDropdownNatureDestination = (
    natureDest: NatureDestination[]
  ): ReactElement[] => {
    const defaultItem = (
      <MyDropdownItem value={defaultNature} key={defaultNature}>
        {defaultNature}
      </MyDropdownItem>
    );
    const categoryItems = natureDest.map((item, index) => (
      <MyDropdownItem key={item.natureName}>{item.natureName}</MyDropdownItem>
    ));
    return [defaultItem, ...categoryItems];
  };

  function filteringDestinationType(data: TravelPlaceItem[], selectedCat: string) {
    return data.filter(
      (data) => data.natureDestination?.natureName === selectedCat
    );
  }

  function filteringState(data: TravelPlaceItem[], selectedSt: string) {
    return data.filter((data) => data.states?.state === selectedSt);
  }
  function filteringAccommodation(data: TravelPlaceItem[], selectedAccom: string) {
    return data.filter((data) => data.accommodationType?.accommodationName === selectedAccom);
  }

  const filterTravelPlaceCat = () => {
    if (selectedAccommodation !== defaultAccommodation) {
      //Accommodation no equal to all
      setIsDefaultAccommodation(false);
      setIsFilterAccommodation(true);
      // setNoDataMessage("No food places available in " + defaultAccommodation)
      if (!isFilterState) {
        //user not filtering state
        let newData = filteringAccommodation(oriTravelPlace, selectedAccommodation);
        setTravelPlace(newData);
      } else {
        //user filtering state
        let newData = filteringAccommodation(
          filteringState(oriTravelPlace, selectedState),
          selectedAccommodation
        );
        setTravelPlace(newData);
      }
    } else {
      setIsDefaultAccommodation(true);
      setIsFilterAccommodation(false);
      // Accommodation equal to all
      if (!isFilterState) {
        //not filtering state
        setTravelPlace([...oriTravelPlace]);
      } else {
        //filtering state
        let newData = filteringState(oriTravelPlace, selectedState);
        setTravelPlace(newData);
      }
    }
  };
  const filterTravelPlace = () => {
    if (selectedState !== defaultState) {
      setIsDefaultState(false); // user choose state
      setIsFilterState(true);
      if (!isFilterAccommodation) {
        //check if user is not filtering Accommodation
        setNoDataMessage("No food places available in " + selectedState);
       let newData = filteringState(oriTravelPlace, selectedState);
        setTravelPlace(newData);
      } else {
        //user filtering Accommodation
        //
        let newData = filteringState(
          filteringDestinationType(oriTravelPlace, selectedAccommodation),
          selectedState
        );
        setTravelPlace(newData);
      }
    } else {
      setIsDefaultState(true); // state equal to all
      setIsFilterState(false);
      if (!isFilterAccommodation) {
        //check if user is filtering Accommodation
        setTravelPlace([...oriTravelPlace]);
      } else {
        let newData = filteringDestinationType(oriTravelPlace, selectedAccommodation);
        setTravelPlace(newData);
      }
    }
  };
  const filterTravelPlaceNatureDest = () => {
    if (selectedNatureDest !== defaultNature) {
    //   setIsDefaultState(false); // user choose state
      setIsFilterNatureDest(true);
      if (!isFilterAccommodation) {
        //check if user is not filtering Accommodation
        setNoDataMessage("No food places available in " + selectedState);
       let newData = filteringState(oriTravelPlace, selectedState);
        setTravelPlace(newData);
      } else {
        //user filtering Accommodation
        //
        let newData = filteringState(
          filteringDestinationType(oriTravelPlace, selectedAccommodation),
          selectedState
        );
        setTravelPlace(newData);
      }
    } else {
    //   setIsDefaultState(true); // state equal to all
      setIsFilterNatureDest(false);
      if (!isFilterAccommodation) {
        //check if user is filtering Accommodation
        setTravelPlace([...oriTravelPlace]);
      } else {
        let newData = filteringDestinationType(oriTravelPlace, selectedAccommodation);
        setTravelPlace(newData);
      }
    }
  };

  const fetchAccommodationType = async () => {
    try {
      const result = await client.request(
        readItems(collection.accommodationType, {
          fields: ["accommodationName"],
        })
      );
      setAccommodation(result as any as AccommodationType[]);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };
  const fetchNatureDestination = async () => {
    try {
      const result = await client.request(
        readItems(collection.natureDestination, {
          fields: ["natureName"],
        })
      );
      setNatureDestination(result as any as NatureDestination[]);
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
      setStateApi(result as any as StateItem[]);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchTravelPlace = async () => {
    try {
      setLoading(true);
      const result = await client.request(
        readItems(collection.travelPlace, {
          filter: { status: { _eq: "published" } },
          fields: [
            "name",
            "image",
            "intagram_reference",
            "tiktok_reference",
            "facebook_reference",
            "website_link",
            "City",
            "non_malaysia_state",
            "placeDescription",
            {
              states: ["state"],
              accommodationType: ["accommodationName"],
              country: ["countryName"],
              natureDestination: ["natureName"],
            },
          ],
        })
      );

      setLoading(false);
      setTravelPlace(result as any as TravelPlaceItem[]);
      setOriTravelPlace(result as any as TravelPlaceItem[]);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    filterTravelPlace();
  }, [selectedKeys]);
  useEffect(() => {
    filterTravelPlaceCat();
  }, [selectedKeysAcccommodation]);
  

  useEffect(() => {
    fetchTravelPlace();
  }, []);

  useEffect(() => {
    fetchAccommodationType();
  }, []);
  useEffect(() => {
    fetchNatureDestination();
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
              {selectedKeysAcccommodation}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeysAcccommodation}
            onSelectionChange={(keys: LibrarySelection) => {
              setSelectedKeysAccommodation(keys as MySelectionType);
            }}
          >
            {renderDropdownAccommodation(accommodation)}
          </DropdownMenu>
        </Dropdown>
        {/* <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="capitalize">
              {selectedKeysNatureDest}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeysNatureDest}
            onSelectionChange={(keys: LibrarySelection) => {
              setSelectedKeysNatureDest(keys as MySelectionType);
            }}
          >
            {renderDropdownNatureDestination(natureDestination)}
          </DropdownMenu>
        </Dropdown> */}
      </div>
      <div className="grid sm:grid-cols-1 lg:grid-cols-4  gap-4">
        <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-4">
          {loading ? (
            <Spinner />
          ) : TravelPlace.length === 0 ? (
            <p>{noDataMessage}</p>
          ) : (
            TravelPlace.map((item) => (
              <div key={item.id}>
                <TravelCard info={item} state="state" />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8"></div>
    </section>
  );
}
