"use client";
import { title } from "@/components/primitives";
import StuffCard from "../card/stuffcard";
import { useState } from "react";
import { StuffCardInterface } from "@/config/model";

export default function PricingPage() {
	const [stuf, setStuff] = useState<StuffCardInterface[]>([]);
const dummyData = [
	{
		imageId: "https://www.mycs.com.my/media/catalog/product/cache/6c25d84052640a1ad9f1bda306b5a86d/_/c/_chipsmore1.jpg",
		price: "23.34",
		id: 1,
		prodcutTitle: "Chips More"
	},
	{
		imageId: "https://cdn.worldofbuzz.com/wp-content/uploads/2022/04/LEXUS-Chocolate-Chip-CookiesA.jpg",
		price: "23.34",
		id: 2,
		prodcutTitle: "Lexus"
	}
]
	return (
		<div>
			<h1 className={title()}>Stuff to buy</h1>
			{dummyData.map(item => (
				<StuffCard key={item.id} data={item}/>
			))}
		</div>
	);
}
