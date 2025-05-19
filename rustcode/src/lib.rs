use sha2::{Digest, Sha256};
use wasm_bindgen::prelude::*;
// use js_sys::{Array, Uint8Array};

// Chunk size in bytes (1MB)
const CHUNK_SIZE: usize = 1_048_576;

#[wasm_bindgen]
pub fn chunkize(data: &[u8]) -> js_sys::Array {
    let result = js_sys::Array::new();

    for chunk in data.chunks(CHUNK_SIZE) {
        let typed_array = js_sys::Uint8Array::new_with_length(chunk.len() as u32);
        typed_array.copy_from(chunk);
        result.push(&typed_array);
    }

    result
}

#[wasm_bindgen]
pub fn hash_chunk(chunk: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(chunk);
    let result = hasher.finalize();
    hex::encode(result)
}
