import { FileSelector } from './FileSelector';
import { Transfer } from './Transfer';

const transfer = new Transfer('connectBtn', 'signaling', 'progress');
transfer.init();

const selector = new FileSelector('fileInput');
selector.init().then(() => {
  selector.input.addEventListener('change', async () => {
    const file = selector.input.files?.[0];
    if (file) {
      await transfer.sendFile(file);
    }
  });
});