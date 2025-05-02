import { generateKeyPair, exportJWK, SignJWT, jwtVerify, JWTPayload, JWK } from 'jose';

const ENCODE_ALGORITHM = 'RS256'; // 可选：使用 ECDSA 算法（ES256）或 RSA 算法（RS256）

// 1. 生成 RSA 密钥对（或 ECDSA）
async function generateKeys() {
  const { privateKey, publicKey } = await generateKeyPair(ENCODE_ALGORITHM, {
    modulusLength: 2048, // RSA 密钥长度
  });

  return { privateKey, publicKey };
}

// 2. 签发 JWT
async function signJWT(payload: JWTPayload, privateKey: CryptoKey, expiresIn: Date) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ENCODE_ALGORITHM }) // 算法需与密钥类型匹配
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(privateKey);
}

// 3. 验证 JWT
async function verifyJWT(token: string | Uint8Array, publicKey: CryptoKey) {
  try {
    const { payload } = await jwtVerify(token, publicKey);
    return { valid: true, payload };
  } catch (error) {
    return null;
  }

  return null;
}

export { generateKeys, signJWT, verifyJWT };