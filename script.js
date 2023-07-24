document.addEventListener("DOMContentLoaded", function () {
  // Function to send cURL request using Axios
  function sendCurlRequest(curlCommand) {
  axios.post(
  'https://connect.squareup.com/v2/catalog/search-catalog-items',
  // '{\n    "text_filter": "050000105229"\n  }',
  {
    'text_filter': '050000105229'
  },
  {
    headers: {
      'Square-Version': '2023-07-20',
      'Authorization': 'Bearer EAAAERHGm_O9boKOGgOBZHsPW9Kz19K4DWJuTOO6kAmmR13mn2IDh5E2Q8GwZfbF',
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
    var curlCommand = document.getElementById("curlInput").value;
    sendCurlRequest(curlCommand);
  });
});
