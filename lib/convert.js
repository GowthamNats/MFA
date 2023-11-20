// Image onto base64
export function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)

        fileReader.onload = () => {
            resolve(fileReader.result)
        }

        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}

export function convertToUint8Array(file) {
    return new
   
  Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
  
      fileReader.onload = () => {
        const arrayBuffer = fileReader.result;
        const uint8Array = new
   
  Uint8Array(arrayBuffer);
        resolve(uint8Array);
      };
  
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }