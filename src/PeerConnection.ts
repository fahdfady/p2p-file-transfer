export class PeerConnection {
    private pc: RTCPeerConnection;
    channel: RTCDataChannel | null = null;
    private onData: (data: ArrayBuffer) => void;

    constructor(onData: (data: ArrayBuffer) => void) {
        this.pc = new RTCPeerConnection();
        this.onData = onData;
        this.setup();
    }

    private setup() {
        this.pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('Copy this:', JSON.stringify(this.pc.localDescription));
            }
        };
        this.pc.ondatachannel = (event) => {
            this.channel = event.channel;
            this.channel.binaryType = 'arraybuffer';
            this.channel.onmessage = (event) => this.onData(event.data);
        };
    }

    async createOffer() {
        this.channel = this.pc.createDataChannel('file-transfer');
        this.channel.binaryType = 'arraybuffer';
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        return JSON.stringify(this.pc.localDescription);
    }

    async setRemoteDescription(desc: string) {
        await this.pc.setRemoteDescription(JSON.parse(desc));
    }

    async createAnswer() {
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        return JSON.stringify(this.pc.localDescription);
    }

    send(data: ArrayBuffer) {
        if (this.channel?.readyState === 'open') {
            this.channel.send(data);
        }
    }
}