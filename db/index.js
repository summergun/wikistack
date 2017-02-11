const Sequelize=require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL);

//create modells

const Author = db.define('author',{
    name:Sequelize.STRING,
});

const Story = db.define('story',{
    title:Sequelize.STRING,
    story:Sequelize.TEXT,
},{
    classMethods:{
        getStories:(name)=>{
            let filter = {};
            if(name){
                filter.name = name;
            }
            return Story.findAll({
                include:[{
                    model:Author,
                    where:filter
                }
                ]
            })
        },
        createStory:(author,title,story)=>{
            return Author.findOne({where:{name:author}})
            .then((_author)=>{
                if(_author) return _author;
                return Author.create({name: author});
            })
            .then(__author => Story.create({title:title,story:story,authorId:__author.id}));
        }
    }
});

const seed = ()=>{
    return connect()   
    .then(()=>{
        return Author.create({name:'Summer'});
    })
    .then((author)=>{
        Story.create({title:'Fullstack',story:'I am learning',authorId:author.id});
        Story.create({title:'Fullstack2',story:'I am learning2',authorId:author.id});

    })
    
    .catch(err=> { console.log(err)});
}




Story.belongsTo(Author);
Author.hasMany(Story);

let _conn;
const connect = ()=>{
    if(_conn) return _conn; //if i have connection, return connection
    _conn=db.authenticate(); //connecting db
    return _conn;
}

const sync = ()=>{
    return connect()
    .then(()=>{
        return db.sync({force:true})//force to recreate a table everytime we run this
    })
}

module.exports={
    sync,
    seed,
    models:{
        Author,
        Story
    }
}