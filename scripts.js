document.getElementById('generate-btn').addEventListener('click', function() {
    var qrText = document.getElementById('text-input').value;
    var colorDark = document.getElementById('color-dark').value;
    var colorLight = document.getElementById('color-light').value;
    var transparentBg = document.getElementById('transparent-bg').checked;

    if (qrText) {
        var qrCodeElement = document.getElementById('qr-code');
        qrCodeElement.innerHTML = ''; 
        var qr = new QRCode(qrCodeElement, {
            text: qrText,
            width: 256,
            height: 256,
            colorDark: colorDark,
            colorLight: colorLight,
            correctLevel: QRCode.CorrectLevel.H
        });
        setTimeout(() => {
            var qrCanvas = qrCodeElement.querySelector('canvas');
            if (qrCanvas) {
                var padding = 20;
                var paddedCanvas = document.createElement('canvas');
                var context = paddedCanvas.getContext('2d');
                paddedCanvas.width = qrCanvas.width + 2 * padding;
                paddedCanvas.height = qrCanvas.height + 2 * padding;
                if (transparentBg) {
                    context.clearRect(0, 0, paddedCanvas.width, paddedCanvas.height); 
                } else {
                    context.fillStyle = '#ffffff'; 
                    context.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
                }
                context.drawImage(qrCanvas, padding, padding);
                if (transparentBg) {
                    var imgData = context.getImageData(0, 0, paddedCanvas.width, paddedCanvas.height);
                    var data = imgData.data;
                    for (var i = 0; i < data.length; i += 4) {
                        if (data[i] === parseInt(colorLight.substr(1, 2), 16) &&
                            data[i + 1] === parseInt(colorLight.substr(3, 2), 16) &&
                            data[i + 2] === parseInt(colorLight.substr(5, 2), 16)) {
                            data[i + 3] = 0;
                        }
                    }

                    context.putImageData(imgData, 0, 0);
                }
                var qrImage = paddedCanvas.toDataURL("image/png");
                var imgElement = document.createElement('img');
                imgElement.src = qrImage;
                imgElement.alt = 'Generated QR Code';
                qrCodeElement.innerHTML = '';
                qrCodeElement.appendChild(imgElement);
                qrCodeElement.classList.add('show');
                var timestamp = new Date().toISOString().replace(/[-:.]/g, "");
                var filename = "qrcode_" + timestamp + ".png";
                var downloadLink = document.getElementById('download-link');
                downloadLink.href = qrImage;
                downloadLink.download = filename;
                downloadLink.style.display = 'block'; 
                downloadLink.classList.add('show');
            
            }
        }, 100); 
    } else {
        alert("Please enter some text or a URL!");
    }
});