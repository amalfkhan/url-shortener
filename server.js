var mongoose = require('mongoose');
const Scheme = mongoose.Schema;
mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true, 
   useUnifiedTopology: true 
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlScheme = new Scheme({
  originalUrl: String,
  hash: String,
});
const Url = mongoose.model('Url', urlScheme);

app.post('/api/shorturl', function(req, res) {  
  console.log(req);
  res.json({ 
    originalUrl: 'url-example',
    hash: 'hash-example'
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
