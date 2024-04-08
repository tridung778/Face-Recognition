const container = document.querySelector("#container");
const fileinput = document.querySelector("#file-input");

async function loadTrainingData() {
  const labels = [
    "Fukada Eimi",
    "Rina Ishihara",
    "Takizawa Laura",
    "Yua Mikami",
    "Thuận",
  ];

  const FaceDescriptors = [];
  for (const label of labels) {
    const descriptors = [];
    for (let i = 1; i <= 4; i++) {
      const image = await faceapi.fetchImage(`data/${label}/${i}.jpeg`);
      const detection = await faceapi
        .detectSingleFace(image)
        .withFaceLandmarks()
        .withFaceDescriptor();
      descriptors.push(detection.descriptor);
    }
    FaceDescriptors.push(
      new faceapi.LabeledFaceDescriptors(label, descriptors)
    );
  }
  return FaceDescriptors;
}

let faceMatcher;

async function init() {
  Toastify({
    text: "Chờ một chút để tải model nhận diện!",
  }).showToast();
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("models"),
  ]);

  const trainingData = await loadTrainingData();
  faceMatcher = new faceapi.FaceMatcher(trainingData, 0.6);
  Toastify({
    text: "Đã tải xong model nhận diện!",
  }).showToast();
}

init();

fileinput.addEventListener("change", async (e) => {
  const file = fileinput.files[0];

  const image = await faceapi.bufferToImage(file);
  const canvas = faceapi.createCanvasFromMedia(image);
  container.innerHTML = "";
  container.append(image);
  container.append(canvas);

  const size = {
    width: image.width,
    height: image.height,
  };
  faceapi.matchDimensions(canvas, size);

  const detections = await faceapi
    .detectAllFaces(image)
    .withFaceLandmarks()
    .withFaceDescriptors();
  const resizedDetections = faceapi.resizeResults(detections, size);

  for (const detection of resizedDetections) {
    const box = detection.detection.box;
    const drawBox = new faceapi.draw.DrawBox(box, {
      label: faceMatcher.findBestMatch(detection.descriptor),
    });
    drawBox.draw(canvas);
  }
});
