import express from 'express';
import { exec } from 'child_process';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  exec('zkstats-cli prove mean_model.py data.json', (error, stdout, stderr) => {
    if (error) {
      console.error(`: ${error}`);
      res.status(400).send(`Error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    res.send('Success');
  });

  // TODO:
  // - Return proof, settings, verification key
  // - Data consumer should already have srs, so with data above they can verify
  //  the proof.
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
