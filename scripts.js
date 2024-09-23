document.getElementById('generate-btn').addEventListener('click', function () {
    var qrText = document.getElementById('text-input').value;
    var colorDark = document.getElementById('color-dark').value;
    var colorLight = document.getElementById('color-light').value;
    var transparentBg = document.getElementById('transparent-bg').checked;

    if (qrText) {
        var qrCodeElement = document.getElementById('qr-code');
        qrCodeElement.innerHTML = ''; 

        // Handle transparent background option
        var lightColor = transparentBg ? "rgba(0, 0, 0, 0)" : colorLight;

        // Check if it's a UPI ID and handle accordingly (no URL encoding here)
        var qrTextToUse = qrText;  // Use the text directly for UPI or any other input

        var qr = new QRCode(qrCodeElement, {
            text: qrTextToUse, // Pass the text as-is for UPI and other inputs
            width: 256,
            height: 256,
            colorDark: colorDark,
            colorLight: lightColor,  // Set transparent or light color
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

                // Handle background depending on transparency checkbox
                if (!transparentBg) {
                    context.fillStyle = '#ffffff'; 
                    context.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
                } else {
                    context.clearRect(0, 0, paddedCanvas.width, paddedCanvas.height);
                }

                context.drawImage(qrCanvas, padding, padding);

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