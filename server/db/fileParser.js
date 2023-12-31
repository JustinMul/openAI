const fs = require('fs');
const path = require('path');

const readFilesInFolder = async (folderPath) => {
  try {
    const fileNames = await fs.promises.readdir(folderPath);
    const textArray = [];

    for (const fileName of fileNames) {
      const filePath = path.join(folderPath, fileName);
      const stats = await fs.promises.stat(filePath);

      if (stats.isFile()) {
        try {
          const fileContent = await fs.promises.readFile(filePath, 'utf-8');
          const chunkSize = 16000;
          const overlap = 500;

          let startIndex = 0;

          while (startIndex < fileContent.length) {
            let endIndex = startIndex + chunkSize;

            // Move the endIndex back to complete the last word if needed
            if (endIndex < fileContent.length) {
              while (
                endIndex > startIndex + overlap &&
                !/\s/.test(fileContent.charAt(endIndex))
              ) {
                endIndex--;
              }
            }

            // Include the last word if endIndex is at the end of a word
            while (endIndex < fileContent.length && /\s/.test(fileContent.charAt(endIndex))) {
              endIndex++;
            }

            // Move the startIndex to the beginning of the word if necessary
            while (startIndex > 0 && !/\s/.test(fileContent.charAt(startIndex - 1))) {
              startIndex--;
            }

            const chunk = fileContent.substring(startIndex, endIndex);
            const chunkWithoutNewlines = chunk.replace(/\n/g, ''); // Remove newlines

            // Get the first 4 characters from the file name
            const yearPrefix = '(the year is ' + fileName.substring(0, 4) + ')';

            // Append the year prefix to the chunk of text
            const chunkWithYear = yearPrefix + ' ' + chunkWithoutNewlines;

            textArray.push(chunkWithYear);
            startIndex += chunkSize - overlap;
          }
        } catch (error) {
          console.error(`Error reading file ${filePath}:`, error);
        }
      }
    }
    textArray.splice(0, 2);

    return textArray;
  } catch (error) {
    console.error('Error reading files:', error);
    return [];
  }
};

module.exports = readFilesInFolder;
