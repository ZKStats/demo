import init, { init_panic_hook, init_logger, verify } from '@ezkljs/engine/web'

async function loadFileToBuffer(path: string) {
    return await fetch(path).then((res) => res.arrayBuffer());
}

export async function initialize() {
  // Initialize the WASM module. Here we are overriding the default memory allocation with the recommend allocation for the best performance across all mobile browsers.
  await init(
      undefined,
      new WebAssembly.Memory({ initial: 20, maximum: 4096, shared: true }),
  )
  // Initialize the panic hook and logger
  init_panic_hook()
  init_logger()
}

export async function verifyProof(
    proofPath: string,
    settingsPath: string,
    verificationKeyPath: string,
    srsPath: string,
) {
    const proof = await loadFileToBuffer(proofPath)
    const settings = await loadFileToBuffer(settingsPath)
    const verificationKey = await loadFileToBuffer(verificationKeyPath)
    const srs = await loadFileToBuffer(srsPath)
    const output = verify(
        new Uint8ClampedArray(proof),
        new Uint8ClampedArray(verificationKey),
        new Uint8ClampedArray(settings),
        new Uint8ClampedArray(srs),
    )
    // const [proof, settings, verificationKey, srs] = await Promise.all([
    //     loadFileToBuffer(proofPath),
    //     loadFileToBuffer(settingsPath),
    //     loadFileToBuffer(verificationKeyPath),
    //     loadFileToBuffer(srsPath),
    // ]);
    // // * @param {Uint8ClampedArray} proof_js
    // // * @param {Uint8ClampedArray} vk
    // // * @param {Uint8ClampedArray} settings
    // // * @param {Uint8ClampedArray} srs
    // console.log("!@# proof=", proof)
    // console.log("!@# settings=", settings)
    // console.log("!@# verificationKey=", verificationKey)
    // console.log("!@# srs=", srs)
    // const output = verify(
    //     new Uint8ClampedArray(proof),
    //     new Uint8ClampedArray(verificationKey),
    //     new Uint8ClampedArray(settings),
    //     new Uint8ClampedArray(srs),
    // );
    return output
}
