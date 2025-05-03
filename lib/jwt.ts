import { SignJWT, jwtVerify, JWTPayload, importPKCS8, importSPKI } from 'jose';

const ENCODE_ALGORITHM = 'RS256'; // 可选：使用 ECDSA 算法（ES256）或 RSA 算法（RS256）

// 2. 签发 JWT
async function signJWT(payload: JWTPayload, privateKey: string, expiresIn: Date) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ENCODE_ALGORITHM }) // 算法需与密钥类型匹配
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(await importPKCS8(privateKey, ENCODE_ALGORITHM));
}

// 3. 验证 JWT
async function verifyJWT(token: string | Uint8Array, publicKey: string) {
  try {
    const { payload } = await jwtVerify(token, await importSPKI(publicKey, ENCODE_ALGORITHM));
    return { valid: true, payload };
  } catch (error) {
    console.log(error)
    return { valid: false, error };
  }
}

export { signJWT, verifyJWT };