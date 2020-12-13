export function accessWebcam(video: HTMLVideoElement) {
  return new Promise<MediaStream>((resolve, reject) => {
    const mediaConstraints = {
      audio: false,
      video: {
        width: 1280,
        height: 720,
        brightness: { ideal: 2 },
      },
    }

    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((mediaStream) => {
        video.srcObject = mediaStream
        video.setAttribute('playsinline', true as any)
        video.onloadedmetadata = (e) => {
          video.play()
          resolve(mediaStream)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
