import "./textarea.scss";

export const createTextArea = (text) => {
	const textarea = document.createElement("textarea");
	textarea.placeholder = "Add something here to remember...";
	textarea.value = text;
	textarea.autocomplete = false;
	textarea.spellcheck = false;
	return textarea;
};
  