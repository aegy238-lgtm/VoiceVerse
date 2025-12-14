
// LOCAL STORAGE SIMULATION (No Server)

export const uploadFile = async (file: File, folder: string = 'uploads'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result); // Return Base64 string directly
      } else {
        reject(new Error("Failed to convert file to Base64"));
      }
    };
    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsDataURL(file);
  });
};
