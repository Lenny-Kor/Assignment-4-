const express = require('express');
const app = express();
const blogData = require('./blogData');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', async (req, res) => {
    try{
        let latestPost = await blogData.getLatestPost();
        res.render("index", {post: latestPost})
    }catch(err){
        res.status(500).send({error: err});
    }
});

app.get('/about', (req, res) => {
    res.render("about");
});

app.get('/blog', async (req, res) => {
    let viewData = {};

    try{
        let posts = [];

        if(req.query.category){
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            posts = await blogData.getPublishedPosts();
        }

        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        let post = posts[0]; 

        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        let categories = await blogData.getCategories();

        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    res.render("blog", {data: viewData})
});

app.get('/blog/:id', async (req, res) => {
    let viewData = {};

    try{
        let posts = [];

        if(req.query.category){
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            posts = await blogData.getPublishedPosts();
        }

        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        viewData.post = await blogData.getPostById(req.params.id);
    }catch(err){
