class Sensor{
    constructor(car){
        this.car = car;
        this.count = 10;
        this.range = Math.PI / 2;
        this.length = 500;
        this.rays = [];
        this.readings = [];

        // this.level = new Level(5,4);
        this.test = 1;
        // this.network = new NeuralNetwork([5,8,3,4]);
    }

    update(roadBorders,traffic){
        this.castRays();

        this.readings=[];
        for(let i=0;i<this.rays.length;i++){
            this.readings.push(this.getReading(this.rays[i],roadBorders,traffic));
        }

        // this.offsets = [];
        // for(let i=0;i<this.readings.length;i++){
        //     if(this.readings[i]){
        //         this.offsets.push(this.readings[i].offset.toPrecision(2));
        //     }else{
        //         this.offsets.push(1);
        //     }
        // }

        // this.offsets=this.readings.map(e=>e==null?0:Math.round((1-e.offset)*100)/100);

        // this.offsets.reverse();
        // log(this.offsets.join('\n'))
        // log(this.network.levels[2].outputs.length)
        // log(NeuralNetwork.feedForward(this.offsets,this.network))
        // console.log(this.offsets)

    }

    getReading(ray,roadBorders,traffic){
    
        let touches = [];
        for(let i=0;i<roadBorders.length;i++){
            let touch=getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1],
            );
            if(touch){
                touches.push(touch);
            }
        }

        for(let i=0;i<traffic.length;i++){
            const poly=traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                let touch=getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length],
                );
                if(touch){
                    touches.push(touch);
                }
            }
            
        }


        if(touches.length==0){
            return null
        }else{
            const offsets=touches.map(e=>e.offset);
            let minOffset = Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset)
        }
    }

    castRays(){
        this.rays = [];
        for(let i=0;i<this.count;i++){
            const angle = lerp(
                    -this.range/2,
                    this.range/2,
                    this.count==1?0.5:i/(this.count-1)
                ) + this.car.angle;
            const start = {x:this.car.x,y:this.car.y};
            const end = {
                x:this.car.x-this.length*Math.sin(angle),
                y:this.car.y-this.length*Math.cos(angle)
            };
            this.rays.push([start,end]);
        }

        this.rays = this.rays.reverse()
    }

    draw(ctx){
        for(let i=0;i<this.rays.length;i++){
            let end=this.rays[i][1];

            if(this.readings[i]){
                end=this.readings[i];
            }

            ctx.strokeStyle = 'yellow';
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.moveTo(this.rays[i][0].x,this.rays[i][0].y);
            ctx.lineTo(end.x,end.y);
            ctx.moveTo(0,0);
            ctx.moveTo(100,100);
            ctx.stroke();



            ctx.strokeStyle = 'black';
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.moveTo(this.rays[i][1].x,this.rays[i][1].y);
            ctx.lineTo(end.x,end.y);
            ctx.moveTo(0,0);
            ctx.moveTo(100,100);
            ctx.stroke();

        }

    }
}