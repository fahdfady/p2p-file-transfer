import { initWasm } from "./utils/wasm";
import PeerConnection from "./PeerConnection";

const fileInput = document.querySelector("input#fileInput") as HTMLInputElement;
const textarea = document.querySelector("textarea#signaling") as HTMLTextAreaElement;
const button = document.querySelector("button#connectBtn") as HTMLButtonElement;

const onData = (rawBinaryData: ArrayBuffer) => {
    console.log("rawBinaryData    ", rawBinaryData);
}

const peerConnection = new PeerConnection(onData);

button?.addEventListener("click", () => {
    const signalingData = textarea.value;
    console.log(signalingData);
    peerConnection.setup()
});
