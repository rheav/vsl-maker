const { authenticateWithGoogleSlides } = require("./googleAuth");
const { createPresentation, generateSlideRequests } = require("./googleSlideDesigner");

async function createAndAddSlides(presentationId, sentences) {
	const slidesService = await authenticateWithGoogleSlides();
	let currentSlideIndex = 0;

	if (!presentationId) {
		presentationId = await createPresentation(slidesService);
	} else {
		const presentation = await slidesService.presentations.get({ presentationId });
		currentSlideIndex = presentation.data.slides.length;
		console.log(`Adding slides to existing presentation ID: ${presentationId}`);
	}

	const requests = generateSlideRequests(sentences, currentSlideIndex);
	if (requests.length > 0) {
		await slidesService.presentations.batchUpdate({
			presentationId: presentationId,
			requestBody: { requests: requests },
		});
		console.log(`Updated presentation with ID: ${presentationId}`);
	} else {
		console.log("No content to add to the presentation.");
	}

	return slidesService;
}

module.exports = { createAndAddSlides };
