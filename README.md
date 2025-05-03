本次教程，我们将使用 Nextjs + Shadcn/UI + Zod + SendGrid + Prisma 实现账号的登陆，注册和密码找回功能；

P.S. 不使用任何的第三方账号管理框架例如clerk.js之类；

- Shadcn/UI Form是基于react-hook-form进行封装
    - 用户注册方案实现：
        1. 用户输入邮箱，发送注册申请；
        2. 我们通过sendgrid sdk发送verify token给用户，用户输入token后进行鉴权，通过后即可创建用户账号并且保存到user表中；
        3. 需要注意的是，token需要一个过期时间，因此在发送token前需要先将对应的token,email,expireTime保存到另一张数据表中。
        4. 在用户注册的鉴权阶段需要先去token表中查找对应email的token，核实下过期时间和一致性，通过后即可完成新用户的注册。
    - 用户登陆方案实现：
        1. 用户输入邮箱，密码，发送登陆申请
        2. 从user表中检查邮箱和密码是否符合；如果符合，服务端通过私钥生成JWT签名并且保存到cookie中
        3. 当用户访问诸如home, dashboard这些需要登陆才能访问的页面时，会走一遍middleware.ts中的鉴权逻辑：也就是查看jwt是否合法以及是否过期。如果验证成功就放行，否则redirect到登陆页面
    - 用户重置密码方案实现：
        1. 用户输入注册时的邮箱，发送重置密码申请
        2. 去user表中查询对应邮箱是否曾经注册过账号
        3. 如果注册过，就先生成一个token，并且将token的值作为url地址的一个params，让用户点击进入指定的重制密码页面；例如（http://localhost:3000/password-reset/token）
        4. 进入页面前，先获取对应的token去数据表中查看：一 - 该token是否存在，二 - 该token是否过期；如果都没问题，让用户进入该页面
        5. 进入页面后，用户输入新密码，接着更新user表中的密码，完成后redirect到登陆页面即可