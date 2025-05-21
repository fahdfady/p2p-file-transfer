export class PeerConnection {
    private pc: RTCPeerConnection;
    channel: RTCDataChannel | null = null;
    private onData: (data: ArrayBuffer) => void;

    constructor(onData: (data: ArrayBuffer) => void) {
        console.log('PeerConnection constructor');
        this.pc = new RTCPeerConnection();
        this.onData = onData;
        this.setup();
    }

    private setup() {
        this.pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('ICE candidate:', JSON.stringify(this.pc.localDescription));
            }
        };
        this.pc.ondatachannel = (event) => {
            console.log('Received data channel');
            this.channel = event.channel;
            this.channel.binaryType = 'arraybuffer';
            this.channel.onmessage = (event) => {
                console.log('Received message, size:', event.data.byteLength);
                this.onData(event.data);
            };
            this.channel.onopen = () => {
                console.log('Data channel opened, state:', this.channel?.readyState);
            };
            this.channel.onclose = () => {
                console.log('Data channel closed');
            };
        };
    }

    async createOffer() {
        console.log('Creating offer');
        this.channel = this.pc.createDataChannel('file-transfer');
        this.channel.binaryType = 'arraybuffer';
        this.channel.onopen = () => {
            console.log('Data channel opened, state:', this.channel?.readyState);
        };
        this.channel.onclose = () => {
            console.log('Data channel closed');
        };
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        console.log('Offer set:', JSON.stringify(this.pc.localDescription));
        return JSON.stringify(this.pc.localDescription);
    }


    async setRemoteDescription(desc: string) {
        try {
            console.log('Setting remote description:', desc);
            await this.pc.setRemoteDescription(JSON.parse(desc));
        } catch (e) {
            console.error('Failed to set remote description:', e);
            throw e;
        }
    }

    async createAnswer() {
        console.log('Creating answer');
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        console.log('Answer set:', JSON.stringify(this.pc.localDescription));
        return JSON.stringify(this.pc.localDescription);
    }

    send(data: ArrayBuffer) {
        console.log('Sending, channel state:', this.channel?.readyState);
        if (this.channel?.readyState === 'open') {
            this.channel.send(data);
        } else {
            console.error('Cannot send: channel not open');
            throw new Error('Data channel not open');
        }
    }

    // Exposes channel state for Transfer.ts
    getChannelState(): string | undefined {
        return this.channel?.readyState;
    }
}