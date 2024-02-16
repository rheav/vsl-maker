// Presentation styling variables
const fontSize = 30;
const textColor = "#111";
const backgroundColor = "#fdfdfd";
const fontFamily = "Poppins";
const textBoxHeight = 67;
const textBoxWidth = 670.96063;

// Create a new presentation if no ID is provided
async function createPresentation(slidesService) {
	const newPresentation = await slidesService.presentations.create({
		requestBody: { title: "Markdown Presentation" },
	});
	console.log(`Created new presentation with ID: ${newPresentation.data.presentationId}`);
	return newPresentation.data.presentationId;
}
// Helper function to create requests for a single slide
function createSlideRequest(slideId, textboxId, slideText) {
	const textColorRGB = {
		red: parseInt(textColor.substring(1, 3), 16) / 255,
		green: parseInt(textColor.substring(3, 5), 16) / 255,
		blue: parseInt(textColor.substring(5, 7), 16) / 255,
	};

	const backgroundColorRGB = {
		red: parseInt(backgroundColor.substring(1, 3), 16) / 255,
		green: parseInt(backgroundColor.substring(3, 5), 16) / 255,
		blue: parseInt(backgroundColor.substring(5, 7), 16) / 255,
	};

	return [
		{
			createSlide: {
				objectId: slideId,
				slideLayoutReference: {
					predefinedLayout: "BLANK",
				},
			},
		},
		{
			updatePageProperties: {
				objectId: slideId,
				pageProperties: {
					pageBackgroundFill: {
						solidFill: {
							color: {
								rgbColor: backgroundColorRGB,
							},
							alpha: 1.0, // Fully opaque
						},
					},
				},
				fields: "pageBackgroundFill.solidFill.color,pageBackgroundFill.solidFill.alpha",
			},
		},
		{
			createShape: {
				objectId: textboxId,
				shapeType: "TEXT_BOX",
				elementProperties: {
					pageObjectId: slideId,
					size: {
						// Adjust these values to match the desired height and width
						height: { magnitude: textBoxHeight, unit: "PT" },
						width: { magnitude: textBoxWidth, unit: "PT" },
					},
					transform: {
						scaleX: 1,
						scaleY: 1,
						// Adjust these values to center the textbox
						translateX: (720 - textBoxWidth) / 2,
						translateY: (405.07087 - textBoxHeight) / 2,
						unit: "PT",
					},
				},
			},
		},

		{
			insertText: {
				objectId: textboxId,
				insertionIndex: 0,
				text: slideText,
			},
		},
		{
			updateTextStyle: {
				objectId: textboxId,
				fields: "fontFamily,fontSize,foregroundColor",
				textRange: { type: "ALL" },
				style: {
					fontFamily: fontFamily,
					fontSize: { magnitude: fontSize, unit: "PT" },
					foregroundColor: { opaqueColor: { rgbColor: textColorRGB } },
				},
			},
		},
		{
			updateParagraphStyle: {
				objectId: textboxId,
				fields: "lineSpacing, alignment",
				textRange: { type: "ALL" },
				style: { lineSpacing: 115, alignment: "CENTER" },
			},
		},
		{
			updateShapeProperties: {
				objectId: textboxId,
				fields: "contentAlignment",
				shapeProperties: {
					contentAlignment: "MIDDLE",
				},
			},
		},
	];
}

// Function to append dots based on ending character
function appendDots(text) {
	// Trim the text to remove any empty space before the last character
	text = text.trim();
	const lastChar = text.slice(-1);
	switch (lastChar) {
		case "!":
		case "?":
			return text;
		case ".":
			return text + "..";
		default:
			return text + "...";
	}
}

// Assume each line can hold up to 100 characters and we want max 2 lines per slide
const maxCharsPerSlide = 75;

function generateSlideRequests(sentences, startIndex) {
	let requests = [];
	let slideText = "";
	let charCount = 0;
	let slideIndex = startIndex; // Start from the given index

	sentences.forEach((sentence) => {
		if (charCount + sentence.length > maxCharsPerSlide) {
			if (slideText.length > 0) {
				slideText = appendDots(slideText);
				const slideId = `slide_${slideIndex}`;
				const textboxId = `textbox_${slideIndex}`;
				requests.push(...createSlideRequest(slideId, textboxId, slideText));
				slideText = "";
				charCount = 0;
				slideIndex++;
			}
		}
		slideText += sentence.trim() + " ";
		charCount += sentence.length;
	});

	if (slideText.length > 0) {
		slideText = appendDots(slideText);
		const slideId = `slide_${slideIndex}`;
		const textboxId = `textbox_${slideIndex}`;
		requests.push(...createSlideRequest(slideId, textboxId, slideText));
	}

	return requests;
}

module.exports = {
	generateSlideRequests,
	createPresentation,
};
