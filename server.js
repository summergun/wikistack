const express = require('express');
const app = express();
const path = require('path');
const swig = require('swig');
swig.setDefaults({cache:false});
const Sequalize = require('sequelize');
const db = require('./db');
const models = db.models;
const Author = db.models.Author;
const Story = db.models.Story;
const methodOverride = require('method-override');





var port = process.env.port||3000;

app.set('view engine','html');
app.engine('html',swig.renderFile);
app.use(require('body-parser').urlencoded({extended:false})) ;
app.use(methodOverride('_method'));

app.get('/:name?',(req,res,next)=>{
   Story.getStories(req.params.name)
    .then((stories)=>{ res.render("index",{stories:stories,author:req.params.name})});
})

app.get('/stories/:id',(req,res,next)=>{
    Story.getStory(req.params.id)
    .then((story)=>{res.render("stories",{story})

    })
})

app.post('/',(req,res,next)=>{
    Story.createStory(req.body.author,req.body.title,req.body.story)
    .then(story=>res.redirect(`/${req.body.author}`))
    .catch(err=>next(err));


})

app.delete('/stories/:id',(req,res,next)=>{
    Story.deleteStory(req.params.id)
    .then(()=>{res.redirect('/')})
        .catch(next);
})

app.delete('/author/:author',(req,res,next)=>{
    Author.deleteAuthor(req.params.author)
    .then(()=>{res.redirect('/')})
    .catch(next);
})




db.sync()
     .then(()=> db.seed())
    .catch(err=>console.log(err));

app.listen(port,()=>console.log(`listening on port ${port}`));