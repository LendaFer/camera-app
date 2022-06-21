//Hardcoded example people
const data = [
    {person:{
        name: "Nils Folkerts",
        company: "CGI"
    }},
    {person:{
        name: "Matthias Folkerts",
        company: "CGI"
    }},
    {person:{
        name: "Carsten Müller",
        company: "HHU"
    }},
    {person:{
        name: "Albert Einstein",
        company: "Long Complicated Company Name"
    }},
    {person:{
        name: "Simone de Beauvoir",
        company: "Philosophy"
    }},
    {person:{
        name: "Mandelbrot",
        company: "Mathematic"
    }}
]

const names = data.map(obj => obj.person.name)
const companys = data.map(obj => obj.person.company)
/*console.log(names)
if(names.includes("Nils Folkerts")){
    if(companys[names.indexOf("Nils Folkerts")] == "Company"){
        console.log("YES")
    }
}*/



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
    const stream = await navigator.mediaDevices.getUserMedia({video: { facingMode: "environment", focusMode: "continuous" },audio: false})
    video.srcObject = stream
    video.play()
    await worker.load()
    await worker.loadLanguage("deu")
    await worker.initialize("deu")
    requestAnimationFrame(tick)
}

const processTest = async (lines) => {
    const line1 = lines[0].text
    const name = line1.substring(0, line1.length-1)
    const line2 = lines[1].text
    const company = line2.substring(0, line2.length-1)
    console.log(name)
    if(names.includes(name)){
        console.log(name)
        console.log(company)
        console.log("TEST")
        if(companys[names.indexOf(name)] == company){
            alert(name)
        }        
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
    const { data: { lines } } = await worker.recognize(canvasTest);
    //const regex = /[a-zA-Z0-9]/gi;
    //const scannedText = text && text.match(regex) && text.match(regex).filter(x => x).join("");

    processTest(lines)
    requestAnimationFrame(tick);
    
}
video.play()
scanning()
