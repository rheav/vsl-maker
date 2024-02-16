const { google } = require("googleapis");

// Load the service account key JSON file
const serviceAccount = require("../secret.json"); // Replace with your JSON file

// Authenticate with the Google Slides API using a JWT client
async function authenticateWithGoogleSlides() {
	const jwtClient = new google.auth.JWT(serviceAccount.client_email, null, serviceAccount.private_key, ["https://www.googleapis.com/auth/presentations", "https://www.googleapis.com/auth/drive"]);

	await jwtClient.authorize();
	return google.slides({ version: "v1", auth: jwtClient });
}

module.exports = {
	authenticateWithGoogleSlides,
};
