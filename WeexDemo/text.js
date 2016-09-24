register("label", {
  template:
  {
    type:"div",
    children:[
              {
              type:"text",
              attr:{
              value:"hello World!"
              },
              classList:["text"]
              }
    ]
  },
  deps:["div", "text"],
  style:{
    "text":{
      left:200,
      top:200,
      backgroundColor:"#00ff00",
      lines:1,
      fontSize:50,
      textWeight:"bold",
      textStyle:"italic",
      textDecoration:"line-through",
      borderColor:"#ff0000",
      borderWidth:1.0
    }
  }
});

render("label", {})
