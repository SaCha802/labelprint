$(document).ready(function () {
  // Function to send cURL request
  function sendCurlRequest(curlCommand) {
    $.ajax({
      url: 'https://cors-proxy.htmldriven.com/?url=https://connect.squareup.com/v2/catalog/search-catalog-items',
      crossDomain: true,
      method: 'post',
      headers: {
        'Square-Version': '2023-07-20',
        'Authorization': 'Bearer EAAAERHGm_O9boKOGgOBZHsPW9Kz19K4DWJuTOO6kAmmR13mn2IDh5E2Q8GwZfbF'
      },
      contentType: 'application/json',
      // data: '{\n    "text_filter": "050000105229"\n  }',
      data: JSON.stringify({
        'text_filter': '050000105229'
      })
    }).done(function(response) {
      console.log(response);
    });
  }

  // Event listener for the button click
  $("#sendButton").on("click", function () {
    var curlCommand = $("#curlInput").val();
    sendCurlRequest(curlCommand);
  });
});
