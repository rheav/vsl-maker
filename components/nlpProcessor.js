//#Wink
const fs = require("fs").promises;
const winkNLP = require("wink-nlp");
const its = require("wink-nlp/src/its.js");
const model = require("wink-eng-lite-web-model");
const nlp = winkNLP(model);

async function processMarkdownFile(filePath) {
	const text = await fs.readFile(filePath, "utf8");
	const doc = nlp.readDoc(text);
	/* console.table(doc.sentences().out(its.text));
	console.table(doc.tokens().out(its.text));
	console.log("aqui"); */
	return doc.sentences().out(its.text);
}

//# Natural npm
/* const fs = require("fs").promises;
const natural = require("natural");
const tokenizer = new natural.SentenceTokenizer();

async function processMarkdownFile(filePath) {
	const text = await fs.readFile(filePath, "utf8");

	const sentences = tokenizer.tokenize(text);
	console.table(sentences);
	return sentences;
} */

module.exports = {
	processMarkdownFile,
};
