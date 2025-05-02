import { generateKeys } from "./jwt"

(async (globalThis) => {
    const { privateKey, publicKey } = await generateKeys();
    // Store the keys in globalThis
    globalThis.privateKey = privateKey;
    globalThis.publicKey = publicKey;
})(globalThis as unknown as Global);