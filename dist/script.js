(async () => {
  // get the video
  const video = document.querySelector('video');

  // setup facemesh
  const model = await facemesh.load({
      backend: 'wasm',
      maxFaces: 1,
  });

  async function detectFaces() {
      const faces = await model.estimateFaces(video);
      
      // dev stuff
      renderPrediction(video, faces);

      if (faces.length === 0) {
          // is somebody out there?
          return requestAnimationFrame(detectFaces);
      }

      const [face] = faces;
    
      let mesh = math.matrix(face.scaledMesh);
      let leftEyeCoords = math.squeeze(math.row(mesh, 33)).toArray();
      let rightEyeCoords = math.squeeze(math.row(mesh, 263)).toArray();
      let midPointCoords = [
        (leftEyeCoords[0] + rightEyeCoords[0]) / 2,
        leftEyeCoords[1],
        leftEyeCoords[2],
      ];
      let chinCoords = math.squeeze(math.row(mesh, 152)).toArray();

      let rx = math.subtract(leftEyeCoords, rightEyeCoords);
          rx = math.divide(rx, math.norm(rx));
      let ry = math.subtract(midPointCoords, chinCoords);
          ry = math.divide(ry, math.norm(ry));
      let rz = math.cross(rx, ry);

      let rotationMatrix = math.matrix([rx, ry, rz]).toArray();
      let sy = Math.sqrt(Math.pow(rotationMatrix[0][0], 2) + Math.pow(rotationMatrix[1][0], 2));

      let angle;
      if (sy < 0.000001) {
        angle = Math.atan2(rotationMatrix[1][2], rotationMatrix[1][1]);
      } else {
        angle = Math.atan2(rotationMatrix[2][1], rotationMatrix[2][2]);
      }

      document.documentElement.style.setProperty('--angle', Math.round(angle * 10) / 10);

      // recursively detect faces
      requestAnimationFrame(detectFaces);
  }
  
  // enable autoplay
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  // start face detection when ready
  video.addEventListener('canplaythrough', detectFaces);
  // stream the camera
  video.srcObject = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
          facingMode: 'user',
      },
  });
  // let’s go!
  video.play();
})();

async function renderPrediction(video, predictions) {
    const canvas = document.querySelector('canvas');
    if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);

    predictions.forEach(prediction => {
        const keypoints = prediction.scaledMesh;
        for (let i = 0; i < keypoints.length; i++) {
            const x = keypoints[i][0];
            const y = keypoints[i][1];
            ctx.fillStyle = '#32EEDB';
            ctx.strokeStyle = '#32EEDB';
            ctx.beginPath();
            ctx.arc(x, y, 1 /* radius */ , 0, 2 * Math.PI);
            ctx.fill();
        }
    });
}