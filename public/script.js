

/**
 * When the clear-permutations button is clicked, empty
 * the list of permutations.
 */
$('#clear-permutations').on('click', function(event){
  event.preventDefault();
  $('#permutation-results').empty();
})

/**
 * When the calculate-in-main button is clicked,
 * calculate the permutations in the main thread.
 */
$('#permute-in-main').on('click', function(event) {
  event.preventDefault();
  var n = $('#n').val();

  // Prepare for permutations
  $('#permutation-message').text("Calculating in main...");
  $('#permutation-results').empty();

  // Perform permutatations
  permutations(n).forEach(function(perm) {
    $('<li>').text(perm).appendTo('#permutation-results');
  });

  // Finish by clearing the processing message
  $('#permutation-message').text('');
});

/**
 * When the calculate-in-web-worker button is clicked,
 * calculcate the permutations in a web worker.
 */
$('#permutate-in-web-worker').on('click', function(event){
  event.preventDefault();

  // Perform preparations
  $('#permutation-results').empty();
  $('#permutation-message').text("Calculating in web worker...");

  // TODO: Calculate permutations using a web worker
  var worker = new Worker('permutations.js');
  worker.postMessage($('#n').val());
  worker.onmessage = function(permutations) {
    permutations.forEach(function(perm) {
      $('<li>').text(perm).appendTo('#permutation-results');
    });
  };
});


$('#image-list > img').on('click', function(event){
  event.preventDefault();
  var image = this;
  // Create a canvas the same size as the image
  var canvas = document.createElement('canvas');
  canvas.width = this.width;
  canvas.height = this.height;
  // Create a 2D context
  var ctx = canvas.getContext('2d');
  // Draw the image into it
  ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
  // Get the image pixel data
  var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // TODO: Process Data
  var worker = new Worker("grayscale.js");
  worker.postMessage(data);
  worker.onmessage = function(event) {
    ctx.putImageData(event.data, 0, 0);
    image.src = canvas.toDataURL();
  };
});
