// import wasm from "rust-code"

export interface WasmModule {
    chunkize(data: Uint8Array): Array<Uint8Array>,
    hash_chunk(chunk: Uint8Array): string,
}

export async function initWasm(): Promise<WasmModule> {
    const wasm = await import('../../rustcode/pkg/rustcode.js');
    wasm.default();

    return {
        chunkize: wasm.chunkize,
        hash_chunk: wasm.hash_chunk,
    }
}