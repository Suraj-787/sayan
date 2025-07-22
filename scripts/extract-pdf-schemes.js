const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

async function extractPDFContent() {
  try {
    const pdfPath = path.join(__dirname, '../GOVERNMENT-SCHEMES.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      console.error('PDF file not found at:', pdfPath);
      return;
    }

    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    
    console.log('PDF Content extracted:');
    console.log('='.repeat(50));
    console.log(data.text);
    console.log('='.repeat(50));
    
    // Save extracted text to a file for easier processing
    const outputPath = path.join(__dirname, 'extracted-schemes.txt');
    fs.writeFileSync(outputPath, data.text);
    console.log(`\nExtracted content saved to: ${outputPath}`);
    
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF:', error);
  }
}

extractPDFContent();
