class Car{
    constructor(x,y,w,h,controlType,maxSpeed=10){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.controls = new Controls(controlType);

        this.maxSpeed = maxSpeed;
        this.speed = 0;
        this.acceleration = 0.2;
        this.friction = 0.05;
        this.angle = 0;
        

        this.polygon = this.createPolygon();
        this.damaged=false;
        this.controlType=controlType;

        this.useBrain=controlType=='AI';

        if(controlType!="DUMMY"){

            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.count,10,4]);
        }

    }

    update(roadBorders,traffic){
        if(!this.damaged){
            this.#move();
            this.polygon=this.createPolygon();
            this.damaged=this.assessDamage(roadBorders);
        }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets=this.sensor.readings.map(e=>e==null?0:1-e.offset)
            const outputs=NeuralNetwork.feedForward(offsets,this.brain);
            // log(outputs);
            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];



            }
        }
    }

    assessDamage(roadBorders){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        if(this.controlType!="DUMMY"){
            for(let i=0;i<traffic.length;i++){
                if(polysIntersect(this.polygon,traffic[i].polygon)){
                    return true;
                }
            }
        }

        return false
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }
        if(this.speed>this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }
        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed = 0;
        }
        this.y-=this.speed*Math.cos(this.angle);
        this.x-=this.speed*Math.sin(this.angle);

        
        
        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle += 0.03*flip;
            }
            if(this.controls.right){
                this.angle -= 0.03*flip;
            }
        }
    }

    createPolygon(){
        const points = [];
        const rad = Math.hypot(this.w,this.h);
        const angle = Math.atan2(this.h,this.w);
        points.push({
            x:this.x-Math.cos(this.angle-angle)*rad,
            y:this.y+Math.sin(this.angle-angle)*rad
        })

        points.push({
            x:this.x-Math.cos(this.angle+angle)*rad,
            y:this.y+Math.sin(this.angle+angle)*rad
        })
        points.push({
            x:this.x-Math.cos(Math.PI+this.angle-angle)*rad,
            y:this.y+Math.sin(Math.PI+this.angle-angle)*rad
        })
        points.push({
            x:this.x-Math.cos(Math.PI+this.angle+angle)*rad,
            y:this.y+Math.sin(Math.PI+this.angle+angle)*rad
        })

        return points

    }

    draw(ctx,drawSensor=false){
        if(this.controlType!="DUMMY" && drawSensor){
            this.sensor.draw(ctx);
        }
        ctx.fillStyle=this.controlType=="DUMMY"?"blue":"black";
        
        if(this.damaged){
            ctx.fillStyle='gray';
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y)
        }

        ctx.fill();


        // ctx.save()
        // ctx.translate(this.x,this.y);
        // ctx.rotate(-this.angle);
        // ctx.beginPath();
        // ctx.rect(
        //     -this.w/2,
        //     -this.h/2,
        //     this.w,
        //     this.h
        // );
        // ctx.fill();

        // ctx.beginPath();
        // ctx.rect(
        //     -this.w/2-10,
        //     -this.h/2,
        //     this.w+20,
        //     this.h/2
        // );
        // ctx.fill();

        // ctx.restore();

        
    }

}