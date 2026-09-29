
const express = require('express')
const path = require('path');
const expressLayouts = require('express-ejs-layouts')
const fileUpload = require("express-fileupload");
const session = require('express-session')
const cookieParse = require('cookie-parser')
const flash = require('connect-flash')

// Routes
const menuRoutes = require("./routes/menuRoutes");
const mejaRoutes = require("./routes/mejaRoutes");

const app = express()
const port = 3000

const { error } = require('console')

app.set('view engine', 'ejs'); //template engine EJS
app.set('views', path.join(__dirname, '../frontend'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(expressLayouts)
app.use(express.static('frontend/public'))

app.use(cookieParse('secret'))
app.use(session({
  cookie: { maxAge: 60000 }, 
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())

app.get('/', (req, res) => {
    
    res.render('index', {
        layout: 'layouts/main-layout',
        activePage: 'home',
        title: "Halaman Dashboard"
    })
})

app.use("/menu", menuRoutes);
app.use("/meja", mejaRoutes);

// app.get('/menu', async (req, res) => {
    
//     // console.log(data)
//     try {
//         const data = await findAll('tb_menu')
        
//         res.render('menu/index', {
//             layout: 'layouts/main-layout',
//             activePage: 'menu',
//             title: "Halaman Dashboard",
//             menus: data,
//             formatRupiah
//         })
//     }catch(error){
//         console.error(error);
//         res.status(500).send('Terjadi kesalahan server');
//     }
// })

// app.post('/menu/add', async (req, res) => {

//     try {
//         // res.send(req.body)
//         addMenu(req.body)
//         // generateQRCode(req.body.nama_meja)
//         res.redirect('/menu')
//         console.log('api tes')
//         // res.render('menu/index', {
//         //     layout: 'layouts/main-layout',
//         //     activePage: 'menu',
//         //     title: "Halaman Dashboard"
//         // })
//     }catch(error){
//         console.error(error);
//         res.status(500).send('Terjadi kesalahan server');
//     }
// })

// app.post('/menu/edit/:id', (req, res) => {
//     try {
//         editMenu(req.body)
//         res.redirect('/menu')
//         // res.render('menu/index', {
//         //     layout: 'layouts/main-layout',
//         //     activePage: 'menu',
//         //     title: "Halaman Dashboard"
//         // })
//     }catch(error){
//         console.error(error);
//         res.status(500).send('Terjadi kesalahan server');
//     }
// })

// app.get('/menu/delete/:id', (req, res) => {
//     try {
//         deleteMenu(req.params.id)
//         res.redirect('/menu')
//     }catch(error){
//         console.error(error);
//         res.status(500).send('Terjadi kesalahan server');
//     }
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})