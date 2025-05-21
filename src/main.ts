import { FileSelector } from './FileSelector';
import { Transfer } from './Transfer';

// Initialize Transfer and FileSelector
const transfer = new Transfer('connectBtn', 'signaling', 'progress');
transfer.init().then(() => {
    console.log('Transfer initialized');
});

const selector = new FileSelector('fileInput');
selector.init().then(() => {
    console.log('FileSelector initialized');
    selector.input.addEventListener('change', async () => {
        const file = selector.input.files?.[0];
        if (file && transfer.isConnected) { // Check connection
            console.log('Sending file:', file.name);
            await transfer.sendFile(file);
        } else {
            console.error('Cannot send: not connected or no file');
            document.getElementById('progress')!.textContent = 'Not connected. Complete signaling first.';
        }
    });
});