document.addEventListener("DOMContentLoaded", function () {
  // Function to send cURL request using Axios
  function sendCurlRequest(sku, token) {
      axios.post(
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
      )
          .then((response) => {
              var result = searchItem(response.data);
              document.getElementById("machedID").innerText = response.data.matched_variation_ids;
              document.getElementById("name").innerText = result[0];
              document.getElementById("var").innerText = result[1];
              document.getElementById("price").innerText = result[2];      
          })
          .catch((error) => {
              // Display the error in the responseContainer div
              document.getElementById("responseContainer").innerText = JSON.stringify(error.response.data, null, 2);
          });
  }


  // Event listener for the button click
  document.getElementById("sendButton").addEventListener("click", function () {
      var token = document.getElementById("tokenInput").value;
      var sku = document.getElementById("skuInput").value;
      sendCurlRequest(sku, token);
  });
});

function searchItem(body) {
  for (var item of body.items) {
    for (var variations of item.item_data.variations) {
      if (variations.id == body.matched_variation_ids) {
        console.log(item.item_data.name);
        var product_name = item.item_data.name;
        console.log(product_name);
        var product_var = variations.item_variation_data.name;
        var price = variations.item_variation_data.price_money.amount;
        price /= 100;
        var item_id = variations.item_variation_data.item_id;
        return [product_name,product_var,price,item_id];
      }
    }
  }
}