const video = document.getElementById("camera-video")
const container = document.querySelector(".container")
const mediaBox = document.querySelector(".mediaBox")
const mediaBoxPos = mediaBox.getBoundingClientRect()
const canvasTest = document.getElementById("testcanvas")


// video config
const vidWidth = mediaBoxPos.width; 
const vidHeight = mediaBoxPos.height; 
const vidOffsetTop = mediaBoxPos.top; 
const vidOffsetLeft = mediaBoxPos.left; 

// indicator config
const marginX = 40; // margin left and right, can be controlled
const indWidth = vidWidth - marginX; // 100% width - margin, can be changed if you want
const indHeight = 80; // can be controlled
const indOffsetTop = vidOffsetTop + (vidHeight / 2) - (indHeight / 2); // is centered, if you want to change also can
const indOffsetLeft = (window.innerWidth / 2) - (indWidth / 2);


//scannerStack
const scannerStack = [0,1,3,2]

const worker = Tesseract.createWorker();


const testing = async () => {
    await worker.load()
    await worker.loadLanguage("eng")
    await worker.initialize("eng")
    const { data: { text } } = await worker.recognize("TestPicture3.png");
    const regex = /[a-zA-Z0-9]/gi;
    const scannedText = text && text.match(regex) && text.match(regex).filter(x => x).join("");
    console.log(text);
}

const scanning = async () => {
    console.log("test")
    const stream = await navigator.mediaDevices.getUserMedia({video: { facingMode: "environment" },audio: false})
    video.srcObject = stream
    video.play()
    await worker.load()
    await worker.loadLanguage("eng")
    await worker.initialize("eng")
    requestAnimationFrame(tick)
}

const processTest = async (words) => {
    console.log(words[0].choices[0].text)
    if(words[0].choices[0].text === 'SEINZ.'){
        alert(words[0].choices[0].text)
    }
}


const tick = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = indWidth;
    canvas.height = indHeight;

    const image = video;
    // source 
    const sx = (marginX / 2) / 2;
    const sy = vidHeight - indHeight;
    const sWidth = indWidth * 2;
    const sHeight = indHeight * 2;
    // destination
    const dx = 0;
    const dy = 0;
    const dWidth = indWidth;
    const dHeight = indHeight;

    //canvas.getContext("2d").drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    canvas.getContext("2d").drawImage(image, 0, 0)
    canvasTest.getContext("2d").drawImage(image,0,0)


    // tesseract
    const { data: { words } } = await worker.recognize(canvasTest);
    //const regex = /[a-zA-Z0-9]/gi;
    //const scannedText = text && text.match(regex) && text.match(regex).filter(x => x).join("");

    processTest(words)
    requestAnimationFrame(tick);
    
}
video.play()
scanning()
