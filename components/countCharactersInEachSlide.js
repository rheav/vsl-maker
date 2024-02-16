async function countCharactersInEachSlide(presentationId, slidesService) {
	try {
		const presentation = await slidesService.presentations.get({ presentationId });
		let slideCharacterCounts = [];

		for (const slide of presentation.data.slides) {
			let slideCharacterCount = 0;
			const slideTextElements = slide.pageElements.map((element) => element.shape?.text?.textElements).filter(Boolean);

			for (const textElements of slideTextElements) {
				for (const textElement of textElements) {
					if (textElement.textRun) {
						slideCharacterCount += textElement.textRun.content.trim().length;
					}
				}
			}
			slideCharacterCounts.push(slideCharacterCount);
		}

		return slideCharacterCounts;
	} catch (error) {
		console.error("Error counting characters in each slide:", error);
		throw error;
	}
}

module.exports = { countCharactersInEachSlide };
