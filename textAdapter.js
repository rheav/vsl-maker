const fs = require("fs");
const path = require("path");

// Define the paths for the input and output files
const inputFilePath = path.join(__dirname, "content_source", "placeholder.txt");
const outputFilePath = path.join(__dirname, "content_source", "content.md");

// Function to capitalize the first letter of a sentence
function capitalizeFirstLetter(sentence) {
	return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

// Function to process the text according to the rules
function processText(inputText) {
	// Split the input text by new lines and filter out any empty lines
	const lines = inputText.split("\n").filter((line) => line.trim() !== "");

	const processedLines = lines.map((line) => {
		// Trim whitespace from the line
		let trimmedLine = line.trim();

		// Capitalize the first letter of the sentence
		trimmedLine = capitalizeFirstLetter(trimmedLine);

		// Check for various ending conditions and adjust punctuation as necessary
		if (trimmedLine.endsWith("...")) {
			// Replace "..." with "."
			trimmedLine = trimmedLine.slice(0, -2);
		} else if (trimmedLine.endsWith(":")) {
			// Replace ":" with "."
			trimmedLine = trimmedLine.slice(0, -1) + ".";
		} else if (trimmedLine.endsWith(",")) {
			// Replace "," with "."
			trimmedLine = trimmedLine.slice(0, -1) + ".";
		} else if (!trimmedLine.endsWith(".") && !trimmedLine.endsWith("?") && !trimmedLine.endsWith("!")) {
			// Add "." if there's no punctuation at the end
			trimmedLine += ".";
		}

		// Remove a period if followed by another punctuation
		trimmedLine = trimmedLine.replace(/\.([?!])/g, "$1");

		return trimmedLine;
	});

	// Join the processed lines with a double new line character for spacing
	return processedLines.join("\n\n");
}

// Read the content from placeholder.txt
fs.readFile(inputFilePath, "utf8", (err, data) => {
	if (err) {
		console.error("Error reading the file:", err);
		return;
	}

	// Process the text
	const processedText = processText(data);

	// Write the processed text into content.md
	fs.writeFile(outputFilePath, processedText, "utf8", (err) => {
		if (err) {
			console.error("Error writing to the file:", err);
		} else {
			console.log("The file has been saved!");
		}
	});
});
