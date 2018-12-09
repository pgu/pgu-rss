/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START gae_node_request_example]
const express = require('express');
const path = require('path');
const feedparser = require('feedparser-promised');

const app = express();

// routes
app.get('/api/feeds/:feedId', handleApiFeed)
app.use('/', express.static(path.join(__dirname, 'public')))

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

const feeds = {
  bbc: 'http://feeds.bbci.co.uk/news/world/rss.xml',
  el_diario: 'https://www.eldiario.es/rss/',
  el_pais: 'http://ep00.epimg.net/rss/elpais/portada.xml',
  le_monde: 'https://www.lemonde.fr/rss/une.xml',
  lenta: 'http://lenta.ru/rss/news',
  nyt: 'https://www.nytimes.com/services/xml/rss/nyt/HomePage.xml',
  gigazine: 'https://gigazine.net/news/rss_2.0/',
  repubblica: 'http://www.repubblica.it/rss/homepage/rss2.0.xml',
  spiegel: 'http://www.spiegel.de/schlagzeilen/tops/index.rss',
};

const httpOptions = {
  timeout: 3000,
  gzip: true,
  // ...
};

async function handleApiFeed (req, res) {
  const feedId = req.params.feedId;
  const result = await handleFeed(feedId);
  return res.end(JSON.stringify(result));
}
 
async function handleFeed (feedId) {
  const feedUrl = feeds[feedId];
  if (feedUrl) {
    const feedOptions = { ...httpOptions, uri: feedUrl };
    const items = await feedparser.parse(feedOptions);
    return items;
  } else {
    throw `Unknown feedId ${feedId}`;
  }
}

