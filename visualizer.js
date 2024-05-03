class Visualizer{

    static drawNetwork(ctx,network){
        const margin=50;
        const left=margin;
        const top=margin;
        const width=ctx.canvas.width-2*margin;
        const height=ctx.canvas.height-2*margin;

        // Visualizer.drawLevel(ctx,network.levels[0],
        // left,top+height/2,width,height/2)

        const levelHeight = height / network.levels.length;
        for(let i=network.levels.length-1;i>=0;i--){
            // ctx.setLineDash([7,7]);
            Visualizer.drawLevel(
                ctx,network.levels[i],left,
                lerp(top+height-levelHeight,top,i/(network.levels.length-1)),
                width,levelHeight,
                i==network.levels.length-1?['↑','←','→','↓']:[]
            )
        }
    }

    static drawLevel(ctx,level,left,top,width,height,labels){
        const right=left+width;
        const bottom=top+height;
        const nodeRadius=18;

        const {inputs,outputs,weights,biases} = level;

        for(let i=0;i<inputs.length;i++){
            for(let j=0;j<outputs.length;j++){
                ctx.beginPath();
                ctx.lineWidth=2;
                
                ctx.strokeStyle=getRGBA(weights[i][j]);

                ctx.moveTo(
                    Visualizer.getNodeX(inputs,i,left,right),bottom);
                ctx.lineTo(
                    Visualizer.getNodeX(outputs,j,left,right),
                    top);
                ctx.stroke();
            }
        }

        for(let i=0;i<inputs.length;i++){
            const x=Visualizer.getNodeX(inputs,i,left,right);
            ctx.beginPath();
            ctx.fillStyle='black';
            ctx.arc(x,bottom,nodeRadius,0,Math.PI*2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle=getRGBA(inputs[i]);
            ctx.arc(x,bottom,nodeRadius*0.6,0,Math.PI*2);
            ctx.fill();


        }

        for(let i=0;i<outputs.length;i++){
            const x=Visualizer.getNodeX(outputs,i,left,right);

            ctx.beginPath();
            ctx.fillStyle='black';
            ctx.arc(x,top,nodeRadius,0,Math.PI*2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle=getRGBA(outputs[i]);
            ctx.arc(x,top,nodeRadius*0.6,0,Math.PI*2);
            ctx.fill();

            ctx.beginPath();
            ctx.strokeStyle=getRGBA(biases[i]);
            ctx.arc(x,top,nodeRadius*0.8,0,Math.PI*2);
            ctx.setLineDash([3,3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if(labels[i]){
                ctx.textAlign='center';
                ctx.textBaseline='middle'
                ctx.fillStyle='black';
                ctx.strokeStyle='white';
                ctx.font='20px Arial'
                ctx.fillText(labels[i],x,top);
                ctx.lineWidth=0.5;
                ctx.strokeText(labels[i],x,top);
            }

        }


    }

    static getNodeX(nodes,index,left,right){
        return lerp(
            left,
            right,
            nodes.length==1
                ?0.5
                :index/(nodes.length-1)
            )
    }
}