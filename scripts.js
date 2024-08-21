document.getElementById('generate-btn').addEventListener('click', function() {
    var qrText = document.getElementById('text-input').value;
    var colorDark = document.getElementById('color-dark').value;
    var colorLight = document.getElementById('color-light').value;
    var transparentBg = document.getElementById('transparent-bg').checked;

    if (qrText) {
        var qrCodeElement = document.getElementById('qr-code');
        qrCodeElement.innerHTML = ''; // Clear previous QR code

        // Generate QR code
        var qr = new QRCode(qrCodeElement, {
            text: qrText,
            width: 256,
            height: 256,
            colorDark: colorDark,
            colorLight: colorLight,
            correctLevel: QRCode.CorrectLevel.H
        });

        // Wait for QR code to be generated and available in the DOM
        setTimeout(() => {
            var qrCanvas = qrCodeElement.querySelector('canvas');
            if (qrCanvas) {
                // Create a new canvas with padding
                var padding = 20; // Padding in pixels
                var paddedCanvas = document.createElement('canvas');
                var context = paddedCanvas.getContext('2d');

                // Set dimensions for the new canvas
                paddedCanvas.width = qrCanvas.width + 2 * padding;
                paddedCanvas.height = qrCanvas.height + 2 * padding;

                // Draw transparent background if selected
                context.clearRect(0, 0, paddedCanvas.width, paddedCanvas.height);

                // Draw QR code onto new canvas with padding
                context.drawImage(qrCanvas, padding, padding);

                // If transparent background is selected, make light color transparent
                if (transparentBg) {
                    var imgData = context.getImageData(0, 0, paddedCanvas.width, paddedCanvas.height);
                    var data = imgData.data;

                    // Extract RGB values from colorLight (assuming it's in #RRGGBB format)
                    var lightR = parseInt(colorLight.substring(1, 3), 16);
                    var lightG = parseInt(colorLight.substring(3, 5), 16);
                    var lightB = parseInt(colorLight.substring(5, 7), 16);

                    // Loop through each pixel and set light color pixels to transparent
                    for (var i = 0; i < data.length; i += 4) {
                        if (data[i] === lightR && data[i + 1] === lightG && data[i + 2] === lightB) {
                            data[i + 3] = 0; // Set alpha to 0 (fully transparent)
                        }
                    }

                    // Apply modified image data back to the canvas
                    context.putImageData(imgData, 0, 0);
                }

                // Convert padded canvas to image data
                var qrImage = paddedCanvas.toDataURL("image/png");

                // Create an <img> element to display the QR code
                var imgElement = document.createElement('img');
                imgElement.src = qrImage;
                imgElement.alt = 'Generated QR Code';

                // Clear the QR code container and append the image
                qrCodeElement.innerHTML = '';
                qrCodeElement.appendChild(imgElement);

                // Generate a unique filename
                var timestamp = new Date().toISOString().replace(/[-:.]/g, "");
                var filename = "qrcode_" + timestamp + ".png";

                // Set up download link
                var downloadLink = document.getElementById('download-link');
                downloadLink.href = qrImage;
                downloadLink.download = filename;
                downloadLink.style.display = 'block'; // Show the download link
            }
        }, 100); // Small delay to ensure QR code is generated
    } else {
        alert("Please enter some text or a URL!");
    }
});