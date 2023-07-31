let priceTags = [];
let priceTag = [];
pdfMake.fonts = {
  Helvetica: {
    normal: 'https://corsproxy.io/?https://candyfonts.com/wp-data/2018/10/26/11538/HELR45W.ttf',
    bold: 'https://corsproxy.io/?https://candyfonts.com/wp-data/2019/04/06/51645/HELR65W.ttf',
  }
};

async function sendRequest(sku, token) {
  try {
    const response = await axios.post(
      'https://corsproxy.io/?https://connect.squareup.com/v2/catalog/search-catalog-items',
      {
        'text_filter': sku,
        "limit": 1,
      },
      {
        headers: {
          'Square-Version': '2023-07-20',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data);
    for (var item of response.data.items) {
      for (var variations of item.item_data.variations) {
        if (variations.id == response.data.matched_variation_ids) {
          var product_name = item.item_data.name;
          var product_var = variations.item_variation_data.name;
          var price = variations.item_variation_data.price_money.amount;
          price /= 100;
          var sku = variations.item_variation_data.sku;
          return [product_name, product_var, price, sku];
        }
      }
    }
    // If the loop doesn't find any matching variation, you may want to handle this case as well.
    throw new Error("No matching variation found.");
  } catch (error) {
    // Display the error in the responseContainer div
    alert('No matching SKU found.');
    throw error; 
  }
}


async function searchItem() {
  const skuInput = document.getElementById('skuInput').value.trim();
  const tokenInput = document.getElementById('tokenInput').value.trim();
  if (tokenInput !== '' && skuInput !== '') {
      const item = await sendRequest(skuInput, tokenInput);
      console.log(item[0]);
      priceTag = [{ product: item[0], var: item[1], price: item[2], sku: item[3] }];
      generatePDF(priceTag, 0);
  }
  document.getElementById('skuInput').value = '';
}

function printItems() {
  generatePDF(priceTags, 1);
  }

function addPriceTag() {
priceTags.push(priceTag[0]);
}

// Function to generate and save the PDF
function generatePDF(priceTags, print) {
  if (priceTags.length === 0) {
    alert('No price tags to generate.');
    return;
  }

  const content = [];

  priceTags.forEach(tag => {
    content.push(
      { text: tag.product, fontSize: 13, bold: true, alignment: 'center', font: 'Helvetica' },
      { text: tag.var, fontSize: 12, alignment: 'center', font: 'Helvetica'  },
      { text: `$${tag.price}`, fontSize: 36, bold: true,  alignment: 'center', font: 'Helvetica'  },
    );

    const barcodeCanvas = document.createElement('canvas');
    JsBarcode(barcodeCanvas, tag.sku, {
      displayValue: false,
    });

    // Convert the barcode canvas to an image and add it to the content
    content.push({ image: barcodeCanvas.toDataURL(), width: 200, height: 50, alignment: 'center' },
      { text: tag.sku, fontSize: 10, alignment: 'center', characterSpacing: 2 , font: 'Helvetica' },
    );
  });


  const documentDefinition = {
    content: content,

    // Set page size and orientation for printing
    pageSize: { width: 226, height: 151 }, // You can also use other page sizes like 'letter' (8.5x11 inches) or custom sizes like { width: 595, height: 842 } in points.
    pageOrientation: 'landscape', // 'landscape' is also an option.

    // Set margins (optional, defaults to 40 points on all sides)
    pageMargins: [5, 5, 5, 5], // [left, top, right, bottom] in points.

    defaultStyle: {
      font: 'Helvetica'
    }// You can also specify other properties like header, footer, etc. if needed.
  };
  const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
  pdfDocGenerator.getBase64((dataUrl) => {
    // Set the data URL as the source of the iframe to display the PDF
    const iframe = document.getElementById('pdfViewer');
    iframe.src = `data:application/pdf;base64,${dataUrl}`;
  });

  if(print == true) {
  pdfMake.createPdf(documentDefinition).print();
}
}

function checkInputLength() {
  const inputElement = document.getElementById('skuInput');
  
  if (inputElement.value.length > 11) {
    searchItem();
  }
}

// Attach the addPriceTag function to the "Add Price Tag" button click event
document.getElementById('addBtn').addEventListener('click', addPriceTag);

// Attach the generatePDF function to the "Generate Price Tags" button click event
document.getElementById('printBtn').addEventListener('click', printItems);
