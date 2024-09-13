'use client';
import React, { useEffect } from 'react';

import { initialize, verifyProof, generateDataCommitment} from "./ezkl";

const host = "http://localhost:3000";
const assetsURL = `${host}/assets`;
const outDir = `${assetsURL}/out`;
const proofPath = `${outDir}/model.pf`;
const settingsPath = `${outDir}/settings.json`;
const verificationKeyPath = `${outDir}/model.vk`;
// NOTE: kzg.srs is printed from the jupyter notebook
const srsPath = `${outDir}/kzg.srs`;

const dataPath = `${assetsURL}/data.json`;
// [0, 20)
const possibleScales = Array.from({ length: 20 }, (_, i) => i);

// template notebook settings
const templateNotebook = `${assetsURL}/template.ipynb`;
const cellForUserComputation = 4;

/**
 * Generate the notebook for the computation
 *
 */
export async function generateJupyterNotebookForComputation(
  computation: string,
  templateURL: string,
) {
  const splitCode = computation.split("\n").map((line) => `${line}\n`);
  const response = await fetch(templateURL);
  const template = await response.json();
  // Fill the user computation in the notebook
  const codeCell = template.cells[cellForUserComputation];
  codeCell.source = splitCode;
  return JSON.stringify(template);
}

async function exampleDownloadNotebook() {
  const name = "mean";
  const date = Date.now();
  const computation = `import torch
from zkstats.computation import State, Args

def computation(state: State, args: Args):
    x = args["x"]
    y = args["y"]
    return state.mean(x), state.mean(y)`
  const notebook = await generateJupyterNotebookForComputation(computation, templateNotebook)
  // Download for testing
  const element = document.createElement("a");
  const file = new Blob([notebook], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  // filename should be name and date
  element.download = `${name}_${date}.ipynb`;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}


const Page = () => {
  useEffect(() => {
    // Call verify function here
    const v = async () => {
      await exampleDownloadNotebook();
      await initialize();
      const dataCommitments = await generateDataCommitment(dataPath, possibleScales);
      console.log("!@# Data commitments:", dataCommitments);
      try {
        console.log("!@# loading files")
        console.log("!@# proofPath=", proofPath)
        console.log("!@# settingsPath=", settingsPath)
        console.log("!@# verificationKeyPath=", verificationKeyPath)
        const result = await verifyProof(
            proofPath,
            settingsPath,
            verificationKeyPath,
            srsPath,
        );
        console.log("Verification result:", result);
      } catch (error) {
        console.error("Failed to verify proof:", error);
      }
    };

    v();
  }, []);

  return (
    <div>
      <h1>Verification Page</h1>
      <p>This page will call the verify function when it loads.</p>
    </div>
  );
};

export default Page;
