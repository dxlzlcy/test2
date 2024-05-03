class NeuralNetwork{
    constructor(neuronCounts){
        this.levels=[];
        for(let i=0;i<neuronCounts.length-1;i++){
            this.levels.push(new Level(
                neuronCounts[i],neuronCounts[i+1]
            ));
        }
    }

    static feedForward(givenInputs,network){
        let firstLevel=network.levels[0];
        let output=Level.feedForward(givenInputs,firstLevel);
        for(let i=1;i<network.levels.length;i++){
            output=Level.feedForward(output,network.levels[i])
        }
        return output
    }

    static mutate(network,amount=1){
        network.levels.forEach(level=>{
            for(let i=0;i<level.biases.length;i++){
                level.biases[i] = lerp(
                    level.biases[i],Math.random()*2-1,amount
                )
            }
            for(let i=0;i<level.weights.length;i++){
                for(let j=0;j<level.weights[i].length;j++){
                    level.weights[i][j]=lerp(
                        level.weights[i][j],Math.random()*2-1,amount
                    )
                }
            }
        })
    }
}


class Level{
    constructor(inputCount,outputCount){
       this.inputs = new Array(inputCount);
       this.outputs = new Array(outputCount);
       this.biases = new Array(outputCount);
       this.weights = [];
       for(let i=0;i<inputCount;i++){
        this.weights[i] = new Array(outputCount);
       }

       Level.randomize(this);
    }

    static randomize(level){
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){

                level.weights[i][j] = Math.random()*2-1;
            }

        }

        for(let j=0;j<level.biases.length;j++){
            level.biases[j] = Math.random()*2-1;
        }
    }

    static feedForward(givenInputs,level){
        
        for(let i=0;i<givenInputs.length;i++){
            level.inputs[i] = givenInputs[i];
        }

        for(let i=0;i<level.outputs.length;i++){
            let sum=0;
            for(let j=0;j<level.inputs.length;j++){
                sum += level.weights[j][i]*level.inputs[j];
            }
            sum += level.biases[i]
            level.outputs[i] = sum>0?1:0 ;
        }
        return level.outputs
    }
}