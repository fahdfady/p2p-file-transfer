import { initWasm } from './utils/wasm';

export class FileSelector {
    input: HTMLInputElement;
    private wasm: any;

    constructor(inputId: string) {
        this.input = document.getElementById(inputId) as HTMLInputElement;
        this.init();
    }

    async init() {
        this.wasm = await initWasm();
        this.input.addEventListener('change', () => this.handleFile());
    }

    async handleFile() {
        const file = this.input.files?.[0];
        if (!file) return;

        const arrayBuffer = await file.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const chunks = this.wasm.chunkize(data);
        const hashes = chunks.map((chunk: Uint8Array) => this.wasm.hash_chunk(chunk));
        console.log('Chunks:', chunks.length, 'Hashes:', hashes);
    }
}