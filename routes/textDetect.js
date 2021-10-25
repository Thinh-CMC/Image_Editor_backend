var express = require("express");
var router = express.Router();

const vison = require("@google-cloud/vision");
const client = new vison.ImageAnnotatorClient({
  keyFilename: "./myprojectfiverr-07547833e709.json",
});

router.get("/", async function (req, res) {
  try {
    const fileName = req.query.imgSrc;
    const [result] = await client.documentTextDetection(fileName);
    let detections = result.fullTextAnnotation;
    let data = [];

    detections &&
      detections.pages[0].blocks.forEach((text) => {
        let txtArray = [];
        text.paragraphs[0].words.forEach((t) => {
          let word = "";
          t.symbols.forEach((w) => (word = word + w.text));
          txtArray.push(word);
        });

        data.push({
          description: txtArray.join(" "),
          vertices: text.boundingBox.vertices,
        });
      });
    !detections || !data.length
      ? res.status(500).json({ result: "failed" })
      : res.status(200).json({ result: "succeed", data: data });
  } catch (error) {
    res.status(500).json({
      result: "failed",
      data: error.message,
    });
  }
});

module.exports = router;
