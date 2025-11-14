(() => {
  const codeReader = new ZXing.BrowserMultiFormatReader();
  const videoElem = document.getElementById('preview');
  const cameraSelect = document.getElementById('camera');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const resultElem = document.getElementById('result');

  let currentStream = null;

  async function listCameras() {
    const devices = await ZXing.BrowserMultiFormatReader.listVideoInputDevices();
    cameraSelect.innerHTML = '';
    devices.forEach(device => {
      const opt = document.createElement('option');
      opt.value = device.deviceId;
      opt.textContent = device.label || `Camera ${cameraSelect.length + 1}`;
      cameraSelect.appendChild(opt);
    });
    if (devices.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No camera found';
      cameraSelect.appendChild(opt);
      startBtn.disabled = true;
    }
  }

  async function start() {
    const deviceId = cameraSelect.value || undefined;
    resultElem.textContent = 'Scanning...';
    startBtn.disabled = true;
    stopBtn.disabled = false;

    try {
      // Start continuous decode from camera
      await codeReader.decodeFromVideoDevice(deviceId, videoElem, (result, err) => {
        if (result) {
          resultElem.textContent = `${result.getText()}`;
          // Optional: Vibrate on success (mobile)
          if (navigator.vibrate) navigator.vibrate(50);
        } else if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error('Decode error:', err);
        }
      });
      // Save stream reference
      currentStream = videoElem.srcObject;
    } catch (e) {
      console.error(e);
      resultElem.textContent = `Error: ${e.message || e}`;
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  }

  function stop() {
    codeReader.reset();
    if (currentStream) {
      currentStream.getTracks().forEach(t => t.stop());
      currentStream = null;
    }
    videoElem.srcObject = null;
    resultElem.textContent = 'Scanning stopped.';
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }

  // Initialize
  (async () => {
    await listCameras();
  })();

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);

  // Permissions prompt helper
  navigator.mediaDevices?.getUserMedia?.({ video: true })
    .then(stream => {
      // Immediately stop; we just want the permission so labels load
      stream.getTracks().forEach(t => t.stop());
      listCameras();
    })
    .catch(() => {
      // Permission denied or not supported
      console.warn('Camera permission not granted yet.');
    });
})();