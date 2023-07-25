document.addEventListener("DOMContentLoaded", function () {
  // Function to send cURL request using Axios
  function sendCurlRequest(sku, token) {
  axios.post(
  'https://corsproxy.io/?https://connect.squareup.com/v2/catalog/search-catalog-items',
  // '{\n    "text_filter": sku\n  }',
  {
    'text_filter': sku,
  },
  {
    headers: {
      'Square-Version': '2023-07-20',
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json'
    }
  }
)
      .then((response) => {
        // Display the response in the responseContainer div
        document.getElementById("responseContainer").innerText = JSON.stringify(response.data, null, 2);
      })
      .catch((error) => {
        // Display the error in the responseContainer div
        document.getElementById("responseContainer").innerText = "Error: " + JSON.stringify(error.response.data, null, 2);
      });
  }

  // Event listener for the button click
  document.getElementById("sendButton").addEventListener("click", function () {
    var token = document.getElementById("tokenInput").value;
    var sku = document.getElementById("skuInput").value;
    sendCurlRequest(sku, token);
  });
});
