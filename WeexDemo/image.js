register("img", {
         template:{
         type:"div",
         children:[{
                   type:"image",
                   attr:{
                   src:"https://img.alicdn.com/tps/i3/TB1kqfeKVXXXXXxXXXXy3n6HXXX-990-459.jpg"
                   },
                   classList:["image"]
                   }
         ]
         },
         deps:["div", "image"],
         style:{
            "image":{
                width:200,
                height:200,
                backgroundColor:"#ff0000"
            }
         }
         });

render("img", {})