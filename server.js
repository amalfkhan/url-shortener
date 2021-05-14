const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const app = express();

mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true, 
   useUnifiedTopology: true 
});

const Scheme = mongoose.Schema;

const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

const urlScheme = new Scheme({
  original_url: String,
  short_url: String
});
const Url = mongoose.model('Url', urlScheme);

app.post('/api/shorturl', (req, res) => {  
  //add handling of invalid urls
  Url.estimatedDocumentCount((docCountError, count) => {
    if (docCountError){
        console.error(docCountError)
    }else{
      const url = new Url({ original_url: req.body.url, short_url: count });
      url.save((saveError, data) => {
        if(saveError) { 
          return console.error(saveError)
        } else {
          res.json({ 
            original_url: data.original_url,
            short_url: data.short_url
          });
        }
      });
    }
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const searchUrl = req.params.short_url;
  Url.findOne({ short_url: searchUrl }, (searchError, data) => {
    if (searchError) return console.error(err);
    res.redirect(data.original_url)
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
