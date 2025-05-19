type DataCallback = (rawBinaryData: ArrayBuffer) => void;

export default class PeerConnection {
    private pc: RTCPeerConnection;
    private channel: RTCDataChannel | null = null;
    private onData: DataCallback;

    constructor(onData: DataCallback) {
        this.pc = new RTCPeerConnection();
        this.onData = onData;
        this.setup();
    }

    setup() {
        console.log("setup peer connection");
        this.onData(new ArrayBuffer(8));
    }

}