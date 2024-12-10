import * as tf from '@tensorflow/tfjs';

class ModelLLM {
    private model: tf.GraphModel | null = null;
    private maxSequenceLength: number | null = null;

    private indexToWord: {[key: number]: string} | null = null;
    private wordToIndex: {[key: string]: number} | null = null;

    private modelUrl: string;
    private vocabUrl: string;

    constructor(modelUrl: string, vocabUrl: string) { 
        this.modelUrl = modelUrl;
        this.vocabUrl = vocabUrl;
    }
    
    private async loadModel(): Promise<void> {
        if (this.model) {
            return;
        }
        this.model = await tf.loadGraphModel(this.modelUrl);
        if (this.model.inputs[0].shape && this.model.inputs[0].shape[1]) {
            this.maxSequenceLength = this.model.inputs[0].shape[1];
        } else {
            throw new Error('Model input shape is not defined');
        }
    }

    private async loadVocab(): Promise<void> {
        if (this.indexToWord && this.wordToIndex) {
            return;
        }

        const response = (await fetch(this.vocabUrl));
        const vocab: {[key: string]: string} = await response.json();

        
        this.wordToIndex = {};
        this.indexToWord = {};

        for (const [key, values] of Object.entries(vocab)) {
            const index = parseInt(key);
            const word = values as string;

            this.wordToIndex[word] = index;
            this.indexToWord[index] = word;
        }
    }

    private sampleFromLogits(logits: tf.Tensor1D, topK: number = 10, temperature: number = 1.0): tf.Tensor1D {
        const {values, indices} = tf.topk(logits, topK);
        const probabilties = tf.softmax(values.div(temperature)) as tf.Tensor1D;
        const selected = tf.multinomial(probabilties, 1);
        return tf.gather(indices, selected);
    }

    private detokenize(tokens: number[]): string {
        if (!this.indexToWord) {
            throw new Error('Index to word mapping not loaded');
        }
        return tokens.map((index) => this.indexToWord![index]).join(' ');
    }
    
    async predict(input: string, tokensToGenerate: number = 50, topK: number = 10): Promise<string> {
        await this.loadModel();
        await this.loadVocab();

        if (!this.model || !this.wordToIndex || !this.indexToWord) {
            throw new Error('Model or vocab not loaded');
        }
        if (this.maxSequenceLength === null) {
            throw new Error('Max sequence length not defined');
        }

        // Przekształć wejście typu string na number
        const startTokens = input.split(/\s+/).map((word) => {
            const index = this.wordToIndex![word];
            if (index === undefined) {
                console.warn(`Word not in vocab: ${word}`);
                return 0;
            }
            return index;
        });

        const tokensGenerated: number[] = [];
        while (tokensGenerated.length < tokensToGenerate) {
            const padLength = this.maxSequenceLength! - startTokens.length;
            // Dodaj padding na początku lub obetnij wejście do maksymalnej długości
            // Ta operacja jest mało zasobożerna, więc można wykorzystać JavaScript
            let x: number[] = [...startTokens];
            if (padLength > 0) {
                x = x.concat(Array(padLength).fill(0));
            }
            else if (padLength < 0) {
                x = x.slice(-this.maxSequenceLength!);
            }
            

            // tf.tidy() automatycznie usuwa tensor z pamięci po zakończeniu funkcji
            // działa to podobnie do `free` w C
            tf.tidy(() => {
                // Przekształć wejście na tensor o wymiarach [1, maxSequenceLength]
                // 1 to batch size
                const inputTensor = tf.tensor2d([x], [1, this.maxSequenceLength!], 'int32');

                // Wykonaj predykcję - [1, maxSequenceLength, vocabSize]
                const y = this.model!.predict(inputTensor) as tf.Tensor2D;

                // Wyjście ma rozmiar [1, maxSequenceLength, vocabSize]
                // gatherND pozwoli nam na pobranie przewidzianego tokena
                const indices = [0, Math.min(startTokens.length - 1, this.maxSequenceLength! - 1)];
                const sampleToken = tf.gatherND(y, indices) as tf.Tensor1D;

                // Wybierz token na podstawie prawdopodobieństw z wyjścia
                const sampled = this.sampleFromLogits(sampleToken, topK);
                const sampledToken = sampled.dataSync()[0];
                
                // Dodaj wybrany token do wygenerowanego tekstu
                tokensGenerated.push(sampledToken);
                startTokens.push(sampledToken);
            });
        }

        // Przekształć wygenerowane tokeny na tekst
        const text = this.detokenize(tokensGenerated);
        return text;
    }
}

export default ModelLLM;
    