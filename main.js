const { processMarkdownFile } = require("./components/nlpProcessor");
const { createAndAddSlides } = require("./components/createAndAddSlides");
const { countCharactersInEachSlide } = require("./components/countCharactersInEachSlide");

// Start the process
const markdownFilePath = "./content_source/content.md"; // Replace with your markdown file path
const presentationId = "1NT5_DIzfNU6CQk9GJyihnndkUEetUy39WB600irRqM0"; // Replace with your presentation ID or null

async function processMarkdownAndCreateSlides() {
	try {
		const sentences = await processMarkdownFile(markdownFilePath);
		const slidesService = await createAndAddSlides(presentationId, sentences);
		const slideCharacterCounts = await countCharactersInEachSlide(presentationId, slidesService);

		slideCharacterCounts.forEach((count, index) => {
			console.log(`Slide ${index + 1}: ${count} characters`);
		});
	} catch (error) {
		console.error(error);
	}
}

// Call the main workflow function
processMarkdownAndCreateSlides();

//# Função apenas para testar os retornos das NLPs
/* processMarkdownFile(markdownFilePath)
	.then((sentences) => console.log(sentences))
	.then(() => console.log("Process completed successfully."))
	.catch(console.error); */
