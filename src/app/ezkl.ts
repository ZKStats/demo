import init, { init_panic_hook, init_logger, verify, poseidonHash, floatToFelt, serialize, deserialize } from '@ezkljs/engine/web'

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

function feltsToPoseidonInput(felts: Uint8ClampedArray[]): Uint8ClampedArray {
    const feltsStr = '[' + felts.map(felt => {
        return Array.from(felt).map(x => String.fromCharCode(x)).join('');
    }).join(',') + ']';
    return new Uint8ClampedArray(feltsStr.split('').map(x => x.charCodeAt(0)));
}


// Crafting this because `serialize` is not working well
export async function generateDataCommitment(dataPath: string, possible_scales: number[]) {
    // dataJSON is `{"x": [1.2, 3.4], "y": [5.6, 7.8}`
    const dataJSON = await fetch(dataPath).then((res) => res.json())
    const res = {} as any
    for (const scale of possible_scales) {
        const commitments = {} as any
        for (const column in dataJSON) {
            const columnData: number[] = dataJSON[column]
            const commitment = generateDataCommitmentForColumn(columnData, scale)
            commitments[column] = commitment
        }
        res[scale] = commitments
    }
    // res is `{"0": {"x": "9d0e3bc6dc4150cd8c9ff58b7b3794ade425e5c0d5f4e6f7617c38ea6d28ba03", "y": "9d0e3bc6dc4150cd8c9ff58b7b3794ade425e5c0d5f4e6f7617c38ea6d28ba03"}, "1": {"x": "9d0e3bc6dc4150cd8c9ff58b7b3794ade425e5c0d5f4e6f7617c38ea6d28ba03", "y": "9d0e3bc6dc4150cd8c9ff58b7b3794ade425e5c0d5f4e6f7617c38ea6d28ba03"}}`
    return res
}


function generateDataCommitmentForColumn(column: number[], scale: number) {
    // a list of string (in Uint8ClampedArray): `['"b900000000000000000000000000000000000000000000000000000000000000"','"b900000000000000000000000000000000000000000000000000000000000000"']`
    const felts = column.map((x: number) => floatToFelt(x, scale)) as Uint8ClampedArray[]
    // a string (in Uint8ClampedArray): `["b900000000000000000000000000000000000000000000000000000000000000","b900000000000000000000000000000000000000000000000000000000000000"]`
    // basically just the `felts` json stringified
    const feltsStrInBytes = feltsToPoseidonInput(felts)
    const output = poseidonHash(feltsStrInBytes)
    // [['9d0e3bc6dc4150cd8c9ff58b7b3794ade425e5c0d5f4e6f7617c38ea6d28ba03']]
    const deserializedOutput = deserialize(output)
    return deserializedOutput[0][0] as string
}

