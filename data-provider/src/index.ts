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

  // TODO: return proof, settings, verification key
  /*

    Settings path: /Users/mhchia/projects/work/pse/demo/data-provider/out/settings.json
    Verification key path: /Users/mhchia/projects/work/pse/demo/data-provider/out/model.vk
   */
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
