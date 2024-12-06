import * as tf from '@tensorflow/tfjs';

const cifar10Classes = [
    'airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck'
];

interface Prediction {
    className: string;
    probability: number;
}

class Model {
    private model: tf.GraphModel | null = null;
    private modelUrl: string;

    constructor(modelUrl: string) { 
        this.modelUrl = modelUrl;
    }
    
    private async loadModel(): Promise<void> {
        if (this.model) {
            return;
        }
        this.model = await tf.loadGraphModel(this.modelUrl);
    }


    async predict(canvas: HTMLCanvasElement): Promise<Prediction[]> {
        await this.loadModel();
        if (!this.model) {
            throw new Error('Model not loaded');
        }

        const p: Prediction[] = [];

        tf.tidy(() => {
            // (H, W, 3) -> (1, H, W, 3) -> (1, 32, 32, 3) -> (1, 32, 32, 3) -> (1, 32, 32, 3)
            const image = tf.browser.fromPixels(canvas).expandDims(0).resizeBilinear([32, 32]).toFloat().div(255);

            // Predykcja obrazu
            const prediction = this.model!.predict(image) as tf.Tensor;

            

            // (1, 10) -> (10)
            // squeeze() - usuwa wymiary o wielkości 1
            // dataSync() - zwraca tablicę wartości tensora jako tablicę JavaScript
            const values = prediction.squeeze().softmax().dataSync() as Float32Array;

            // Przypisanie wartości prawdopodobieństwa do odpowiednich klas
            for (let i = 0; i < values.length; i++) {
                p[i] = {
                    className: cifar10Classes[i],
                    probability: values[i]
                }
            }
        });

        return p;
    }

}

export default Model;