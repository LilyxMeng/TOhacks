var socket = io();
let cnv;


  cnv = document.getElementById("cnv");
  cnv.width = 2000; 
  cnv.height = 2000;
  const padding = 47;
  //cnv.style.backgroundColor = "black";
  cnv.style.border = "1px solid black";
  cnv.style.padding.top = padding + "px";


  var ctx = cnv.getContext("2d");
  ctx.fillStyle = "#FF0000";
  ctx.lineWidth = 2;
  //for loop to draw the grid
  for (var i = 0; i < cnv.width; i += 10) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, cnv.height);
      ctx.moveTo(0, i);
      ctx.lineTo(cnv.width, i);
  }
  ctx.stroke();

  var data;
  Papa.parse("/static/filled.csv", 
  {
      delimiter: ",",
      download: true,
      header: false,
      skipEmptyLines: true,
  complete: function(results){
      console.log(results);
      data = results.data;
  }
  });

  console.log(data);
  //for loop over results
  //for (var x = 0; x < 2000; x++) {
    //for (var y = 0; y < 2000; y++) {
      //console.log(data?.[x]?.[y])
      //if (typeof data?.[x]?.[y] !== 'undefined') {
        //ctx.fillStyle = data[x][y];
      //  ctx.fillRect(i * 10, i * 10, 10, 10);
      console.log("YAYAYAY")
      //}
   // }
 // }
      
  

  //add event listener to canvas

  var timeout = Date.now() - 2000;
  console.log("timeout", timeout);

  cnv.addEventListener("click", function(event) {
    console.log(Date.now(), timeout);

    if (Date.now() - timeout >= 2000) {
        var x = Math.floor((event.pageX) / 10) * 10;
        var y = Math.floor((event.pageY - padding) / 10) * 10;
        socket.emit('chat message', { X: x, Y: y, F: ctx.fillStyle});
        console.log(x, y);
        timeout = Date.now();
    } else {
        console.log("Too soon!");
    }
  });


socket.on('chat message', function(msg) {
  ctx.fillRect(msg.X, msg.Y, 10, 10);
  console.log(msg);
});

