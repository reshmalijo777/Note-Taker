const express =require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid.js');
const app= express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


app.get("/",(req,res) =>
    res.sendFile(path.join(__dirname,"./public/index.html"))
);

app.get("/notes",(req,res) =>
    res.sendFile (path.join(__dirname,"./public/notes.html"))
);


// GET request for notes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json','utf-8',(err,data)=>{
    if(err){
      console.log(err)
    }else{
      res.json(JSON.parse(data));
    }
   })
   });


// POST request for notes
app.post('/api/notes', (req,res)=>{
    console.log(`${req.method} request received to add a note`);

    const {title,text}= req.body;

    if(title && text){
        const newNotes={
            title,
            text,
            id: uuid(),
        }

        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if(err) {
                console.log(err);
              } else {
                const dataFromFile = JSON.parse(data);
                // console.log(dataFromFile);
                dataFromFile.push(newNotes);
                // console.log(dataFromFile);
                const stringifiedData = JSON.stringify(dataFromFile, null, 4);
                  
                     fs.writeFile('./db/db.json', stringifiedData, (err) =>{
                     err
                       ? console.error(err)
                       : console.log( `Successfully added notes to note-taker!!!!`)
        })
    }
})

const response = {
    status: 'success',
    body: newNotes,
  };

  console.log(response);
  res.status(201).json(response);
} else {
  res.status(500).json('Error in adding notes');
}
});

// app.get('/',(req,res) =>
//     res.sendFile(path.join(__dirname,'./public/index.html'))
// );

app.listen(PORT,() =>
console.log(`App listening at http://localhost:${PORT}`)
);