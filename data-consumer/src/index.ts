
export async function verifyProof(
    proofPath: string,
    settingsPath: string,
    verificationKeyPath: string,
    srsPath: string,
) {
    // TODO: use @ezkljs/engine to verify the proof
    // Data consumer should already have srsPath instead of getting it
    // from the data provider.
    return true;
}
