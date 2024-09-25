function randomColor(){
    r = Math.floor(Math.random()*255);
    g = Math.floor(Math.random()*255);
    b = Math.floor(Math.random()*255);
    return {r,g,b};
}

function toRad(deg){
    return deg * (Math.PI /180.0);
}

function randomRange(min, max){
    return Math.floor(Math.random()*(max - min +1)) + min;
}

function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}
// get percent between 2 number
function getPercent(input,min,max){
    return (((input - min) * 100) / (max - min))/100
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = document.getElementById("canvas").width;
const height = document.getElementById("canvas").height;

const centerX = width/2;
const centerY = height/2;
let radius = width/2;

let items = document.getElementsByTagName("textarea")[0].value.trim().split("\n");

let currentDeg = 0;
let step = 360/items.length;
let colors = [];
let itemDegs = {};

for(let i = 0 ; i < items.length + 1;i++){
    colors.push(randomColor())
}



function createWheel(){
    items = document.getElementsByTagName("textarea")[0].value.split("\n");
    step = 360/items.length;
    colors = [];
    for(let i = 0 ; i < items.length + 1;i++){
        colors.push(randomColor());
    }
    draw();
}
draw()

function draw(){
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRad(0), toRad(360))
    ctx.fillStyle = `rgb(${33},${33},${33})`
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    let startDeg = currentDeg;
    for(let i = 0 ; i < items.length; i++, startDeg += step){
        let endDeg = startDeg + step;

        color = colors[i]
        let colorStyle = `rgb(${color.r},${color.g},${color.b})`;

        ctx.beginPath();
        rad = toRad(360/step);
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
        let colorStyle2 = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;
        ctx.fillStyle = colorStyle2;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        ctx.beginPath();
        rad = toRad(360/step);
        ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = colorStyle;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(toRad((startDeg + endDeg)/2));
        ctx.textAlign = "center";
        if(color.r > 150 || color.g > 150 || color.b > 150){
            ctx.fillStyle = "#000";
        }
        else{
            ctx.fillStyle = "#fff";
        }
        ctx.font = 'bold 18px poppins';
        ctx.fillText(items[i], 130, 10);
        ctx.restore();

        itemDegs[items[i]] = 
            {
            "startDeg": startDeg,
            "endDeg" : endDeg
            }
    }
}

let speed = 0;
let maxRotation = randomRange(360* 3, 360 * 6);
let pause = false;
function animate(){
    if(pause){
        return
    }
    speed = easeOutSine(getPercent(currentDeg ,maxRotation ,0)) * 20;
    if(speed < 0.01){
        speed = 0;
        pause = true;

        showwinner();
    }
    currentDeg += speed;
    draw();
    window.requestAnimationFrame(animate);
}

function showwinner(){
    const secondChoice = items[1];
    document.getElementById("modalWinner").innerHTML= `The winner is ${secondChoice}`;  
    
    document.getElementById("winnerModal").style.display = 'flex';
}

function closeModal() {
    document.getElementById('winnerModal').style.display = 'none';
}

function spin(){
    if(speed != 0){
        return;
    }

    maxRotation = 0;
    currentDeg = 0;
    createWheel();
    draw();

    // Get the end degree for the second choice in the items list
    const secondChoice = items[1]; // Second choice in the textarea
    const endDegForSecondChoice = itemDegs[secondChoice].endDeg;

    // Calculate the required maxRotation to land on the second choice
    maxRotation = (360 * 6) - endDegForSecondChoice + 10; // 6 full rotations + exact positioning

    console.log("maxRotation:", maxRotation);
    console.log("Second choice:", secondChoice, "End Deg:", endDegForSecondChoice);
    pause = false
    window.requestAnimationFrame(animate);
}

