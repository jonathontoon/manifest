import { createCard } from "./card";

import "./cards.scss";

export const createCards = (width, height) => {
	const cards = document.createElement("div");
	cards.id = "cards";

	cards.style.width = width;
	cards.style.height = height;

    cards.appendChild(createCard("Donec id eros elementum, pellentesque nunc eget."));
	cards.appendChild(createCard("Donec id eros elementum, pellentesque nunc eget."));
	cards.appendChild(createCard("Donec id eros elementum, pellentesque nunc eget."));
	cards.appendChild(createCard("Donec id eros elementum, pellentesque nunc eget."));

	return cards;
};
