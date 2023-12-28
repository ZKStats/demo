'use client';
import React, { useEffect } from 'react';

import { initialize, verifyProof } from "./ezkl";

const host = "http://localhost:3000";
const assetsURL = `${host}/assets`;
const proofPath = `${assetsURL}/model.pf`;
const settingsPath = `${assetsURL}/settings.json`;
const verificationKeyPath = `${assetsURL}/model.vk`;
const srsPath = `${assetsURL}/kzg.srs`;

// template notebook settings
const templateNotebook = `${assetsURL}/template.ipynb`;
const codeInCell = 2;

/**
 * Generate the notebook for the computation
 *
 */
export async function generateJupyterNotebookForComputation(computation: string, templateURL: string) {
  const splitCode = computation.split("\n").map((line) => `${line}\n`);
  const response = await fetch(templateURL);
  const template = await response.json();
  const codeCell = template.cells[codeInCell];
  codeCell.source = splitCode;
  return JSON.stringify(template);
}

async function exampleDownloadNotebook() {
  const name = "mean";
  const date = Date.now();
  const computation = `from zkstats.models import MeanModel
Model = MeanModel`
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
      // await exampleDownloadNotebook();
      try {
        await initialize();
        console.log("!@# loading files")
        console.log("!@# proofPath=", proofPath)
        console.log("!@# settingsPath=", settingsPath)
        console.log("!@# verificationKeyPath=", verificationKeyPath)
        console.log("!@# srsPath=", srsPath)
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
