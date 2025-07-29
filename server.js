```js
const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { error: null });
});

app.post('/download', async (req, res) => {
  const url = req.body.url;
  const type = req.body.type;

  if (!ytdl.validateURL(url)) {
    return res.render('index', { error: 'Invalid YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    if (type === 'audio') {
      res.header('Content-Disposition', `attachment; filename="title.mp3"`);
      ytdl(url,  filter: 'audioonly', quality: 'highestaudio' ).pipe(res);
     else 
      res.header('Content-Disposition', `attachment; filename="{title}.mp4"`);
      ytdl(url, { quality: 'highestvideo' }).pipe(res);
    }
  } catch (error) {
    res.render('index', { error: 'Error downloading video' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
