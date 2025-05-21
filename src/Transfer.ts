import { PeerConnection } from './PeerConnection';
import { initWasm } from './utils/wasm';

export class Transfer {
    private wasm: any;
    private pc: PeerConnection;
    private progress: HTMLElement;
    isConnected: boolean = false;

    constructor(connectBtnId: string, signalingId: string, progressId: string) {
        console.log('Transfer constructor');
        this.progress = document.getElementById(progressId) as HTMLElement;
        this.pc = new PeerConnection((data) => this.handleReceived(data));
        this.setup(connectBtnId, signalingId);
    }

    async init() {
        this.wasm = await initWasm();
    }

    private async setup(connectBtnId: string, signalingId: string) {
        const btn = document.getElementById(connectBtnId) as HTMLButtonElement;
        const signaling = document.getElementById(signalingId) as HTMLTextAreaElement;

        if (!btn || !signaling) {
            throw new Error('UI elements not found');
        };

        btn.addEventListener('click', async () => {
            const input = signaling.value.trim();
            try {
                if (!input) {
                    // step1: create offer
                    const offer = await this.pc.createOffer();
                    signaling.value = offer;
                    this.progress.textContent = 'Share the offer with the peer.';
                } else if (input.includes('"type":"offer"')) {
                    // step2: create answer
                    await this.pc.setRemoteDescription(input);
                    const answer = await this.pc.createAnswer();
                    signaling.value = answer;
                    this.progress.textContent = 'Share the answer with the peer.';
                } else if (input.includes('"type":"answer"')) {
                    // step3: set answer
                    await this.pc.setRemoteDescription(input);
                    setTimeout(() => {
                        this.progress.textContent = 'Connected! Ready to transfer.';
                    }, 1000);

                }
                // Check connection after each signaling step
                await this.handleConnection();
            } catch (e) {
                console.error('Signaling error:', e);
                this.progress.textContent = 'Signaling failed. Check console.';
            }
        });
    }

    async handleConnection() {
        await new Promise(resolve => setTimeout(resolve, 100));
        let readyState = this.pc.channel?.readyState;

        if (readyState === 'open') {
            this.isConnected = true;
            console.log(this.pc)
            // this.progress.textContent = 'Connected! Ready to transfer.';
        }
        else {
            this.isConnected = false;
            console.log(this.pc)

            // this.progress.textContent = 'Not connected to a peer.';
        }


    }

    async sendFile(file: File) {
        if (this.pc.channel?.readyState !== 'open') {
            this.progress.textContent = 'Not connected to a peer.';
            return;
        }
        const arrayBuffer = await file.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const chunks = this.wasm.chunkize(data, 1024 * 64);
        for (const chunk of chunks) {
            this.pc.send(chunk.buffer);
            this.progress.textContent = `Sent chunk ${chunks.indexOf(chunk) + 1}/${chunks.length}`;
        }
    }

    private handleReceived(data: ArrayBuffer) {
        const chunk = new Uint8Array(data);
        const hash = this.wasm.hash_chunk(chunk);
        this.progress.textContent = `Received chunk with hash: ${hash}`;
        console.log(chunk.buffer);
        // todo: collect chunks and reassemble the file
    }
}