export function encode(secretMessage, imageData) {
    const secretMessageBytes = new TextEncoder().encode(secretMessage.trim());
    const encodedImageData = new Uint8Array(imageData);
  
    for (let i = 0; i < secretMessageBytes.length; i++) {
      encodedImageData[i] = secretMessageBytes[i];
    }
  
    return encodedImageData;
  }
  
  export function decode(encodedImageData) {
    const secretMessageBytes = [];
    const imageDataBytes = new Uint8Array(encodedImageData);
  
    for (let i = 0; i < imageDataBytes.length; i++) {
      secretMessageBytes.push(imageDataBytes[i]);
    }
  
    const secretMessage = new TextDecoder().decode(new Uint8Array(secretMessageBytes));
    const firstUnrecognized = secretMessage.search(/[^\w\s]/g);
    
    return secretMessage.substring(0, firstUnrecognized).trim()
  }