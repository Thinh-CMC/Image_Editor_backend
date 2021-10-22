var express = require("express");
var router = express.Router();

const vison = require("@google-cloud/vision");
const client = new vison.ImageAnnotatorClient({
  keyFilename: "./imageit-beta-86f51c259a3d.json",
});

router.get("/", async function (req, res) {
  try {
    const fileName = req.query.imgSrc;
    const [result] = await client.textDetection(fileName);
    let detections = result.textAnnotations;
    let arr = [];
    detections.forEach((text) => {
      arr.push(text);
    });
    !detections || !arr.length ? res.send("Plz try again") : res.send(arr);
  } catch (error) {
    console.log(error);
    return error;
  }
});

module.exports = router;
