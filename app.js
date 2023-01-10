

const express = require("express");
const bodyParser = require("body-parser");
 // const date = require(__dirname + "/date.js");
const moongoose = require("mongoose");
const { default: mongoose } = require("mongoose");
const { name } = require("ejs");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

  mongoose.set('strictQuery', true);

moongoose.connect("mongodb+srv://Admin_Deepak27:Deep%40189251@cluster0.iszifkf.mongodb.net/todoDB?retryWrites=true&w=majority"); 

const itemSchema = mongoose.Schema({
 
  name: String
 
});



 

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({
  name: "Welcome to the todolist."
});

const item2 = new Item ({
  name: "Enter the name and hit the + button to create new item."
});

const item3 = new Item ({
  name: "<---- Check the box to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = mongoose.Schema({

  name: String,
  items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

/*
Item.insertMany(defaultItems, (err)=>{
  if(err) {
    console.log(err);
  } else {
    console.log("succesfully inserted");
  } ben stokes
});
*/

/*
const items = ["Buy Food", "Cook Food", "Eat Food"];  */
const workItems = [];  

app.get("/", function(req, res) {

 
Item.find((err, founditem)=>{
  
  if(founditem.length === 0){
    Item.insertMany(defaultItems, (err)=>{
      if(err){
        console.log(err);
      }
    
      else{
         console.log("Succesfully inserted");
      }
    });
 
  res.redirect("/");
}
else{
  res.render("list", {listTitle: "Today", newListItems: founditem});
}
});

   

});

app.get("/:value",(req,res)=>{
   
  const route_name = _.capitalize(req.params.value);

 /* switch (route_name){
    case "work" :
       
      res.render("list", {listTitle: "Work List", newListItems: workItems});
    break ;

    case "about" :
      res.render("about");
      break ;
  }  */
  
  
 
 /* 
  List.find((err, foundlist)=>{
   
    foundlist.forEach((lists)=>{
      if(lists.name === route_name){
        res.render("list", {listTitle: lists.name , newListItems: lists.items});
      }
      else{
        const list = new List ({
          name: route_name,
          items: defaultItems
        });
      
        list.save();
        
        res.redirect(route_name);
      }
  
    })
  
  })

  */

  List.findOne({name: route_name},(err, foundlist)=>{
    if(err){
      console.log(err);
    }
    else{
        if(!foundlist){
         const list = new List ({
          name: route_name,
          items: defaultItems
        });
      
        list.save(); 
        res.redirect("/" + route_name);
       // console.log("doesnot exist");
      }
      
      else{
         res.render("list", {listTitle: foundlist.name , newListItems: foundlist.items});
       // console.log("already exist");
      }
      
    }
    
  })
 
   



  

});


app.post("/", function(req, res){

  const itemname = req.body.newItem;
  const listname = req.body.list;
 

 /* if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  } */

   const new_item = new Item ({
    name: itemname
  });

  if(listname === "Today"){
    new_item.save();
    res.redirect ("/");  
  }
  else{
    List.findOne({name: listname}, (err, foundlist)=>{
      foundlist.items.push(new_item); 
      foundlist.save();
      res.redirect("/" + listname);
    })
  }
      
    
/*
  Item.insertMany(new_item, (err)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log("Succesfully inserted");
    }
  }); */
  


});

app.post("/delete", (req, res)=>{
  const removeitem = req.body.checkbox ;
  const pagelocation = req.body.listname;

  console.log(removeitem);

  if(pagelocation === "Today"){
    Item.findByIdAndRemove(removeitem, (err)=>{
      if(err){
        console.log(err); 
  
      }  
      else{
        console.log("Succesfully deleted");
      }
    })
    res.redirect("/");
  }

  else{
    List.findOneAndUpdate({name: pagelocation}, {$pull: {items: {_id: removeitem}}}, (err, foundlist)=>{
      if(!err){
        res.redirect("/" + pagelocation);
      }
    });
  }
  }); 
/*
app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
}); 

app.get("/about", function(req, res){
  res.render("about");
});
*/

app.listen(3000 || process.env.port , function() {
  console.log("Server started on port 3000");
});

