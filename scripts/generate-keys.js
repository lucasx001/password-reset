#!/usr/bin/env node
import { generateKeyPair } from 'jose';
import { exportPKCS8, exportSPKI } from 'jose';
import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// 获取当前模块路径
const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
  try {
    // 1. 生成 RSA 密钥对
    const { privateKey, publicKey } = await generateKeyPair('RS256', {
      modulusLength: 2048,
      extractable: true,
    });

    // 2. 导出为 PEM 格式
    const [privateKeyPem, publicKeyPem] = await Promise.all([
      exportPKCS8(privateKey),
      exportSPKI(publicKey),
    ]);

    // 3. 准备环境变量内容
    const envContent = `
# JWT 密钥对 (自动生成 - 请勿手动修改)
JWT_PRIVATE_KEY="${privateKeyPem.replace(/\n/g, '\\n')}"
JWT_PUBLIC_KEY="${publicKeyPem.replace(/\n/g, '\\n')}"
    `.trim();

    // 4. 写入 .env.local 文件
    const envPath = join(__dirname, '../.env');
    await writeFile(envPath, envContent + '\n', { flag: 'a' }); // 追加模式

    console.log('✅ 密钥已成功生成并保存到 .env 文件');
    console.log('⚠️  请确保 .env 已添加到 .gitignore');
  } catch (error) {
    console.error('❌ 密钥生成失败:', error.message);
    process.exit(1);
  }
})();