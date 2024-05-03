const laneCount = 3;
const carCanvas = document.getElementById('carCanvas')
const networkCanvas = document.getElementById('networkCanvas')

carCanvas.height = window.innerHeight;
carCanvas.width = 100*laneCount;

networkCanvas.height = window.innerHeight;
networkCanvas.width=300

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2,carCanvas.width*0.9,laneCount);

const traffic = [
    new Car(road.getLaneCenter(1),-100,20,30,"DUMMY",3),
    new Car(road.getLaneCenter(0),-300,20,30,"DUMMY",3),
    new Car(road.getLaneCenter(2),-300,20,30,"DUMMY",3),
    new Car(road.getLaneCenter(1),-1000,20,30,"DUMMY",3),
    new Car(road.getLaneCenter(0),-3000,20,30,"DUMMY",3),
    new Car(road.getLaneCenter(2),-3000,20,30,"DUMMY",3),

]

for(let i=0;i<30;i++){
    traffic.push(new Car(
        road.getLaneCenter(getRandomInt(0,2)),
        getRandomInt(-8000,-200),
        20,30,"DUMMY",4
    ))
}

const N=1;
const cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem('bestBrain')){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem('bestBrain')
        )
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
    
}

animate();

function getRandomInt(min, max) {
    min = Math.ceil(min);  // 向上取整
    max = Math.floor(max); // 向下取整
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  

function save(){
    localStorage.setItem('bestBrain',JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem('bestBrain');
}

function generateCars(N){
    const cars=[];
    for(let i=0;i<N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,20,30,"KEYS"));
    }
    return cars
}

function animate(time) {
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    for(let car of cars){
        car.update(road.borders,traffic);
    }

    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );

    carCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+0.7*carCanvas.height)
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }

    carCtx.globalAlpha=0.2;
    for(let car of cars){
        car.draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);



    carCtx.restore();

    // networkCtx.lineDashOffset=-time/5000;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);


    requestAnimationFrame(animate);
    
}


