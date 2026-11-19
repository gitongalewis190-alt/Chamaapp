Self-hosted OCR for "Import M-Pesa" screenshots, so it works without reaching a third-party CDN.
- tesseract.min.js, worker.min.js: tesseract.js 5.1.1 (Apache-2.0)
- core/*.wasm.js: tesseract.js-core 5.1.0, LSTM builds with and without SIMD (Apache-2.0)
- lang/eng.traineddata.gz: @tesseract.js-data/eng 4.0.0_best_int
Only downloaded when someone imports a screenshot. Not precached by the service worker.
