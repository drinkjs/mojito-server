# Mojito 服务端

## 环境要求
- Node.js >= 16.0.0
- MongoDB >= 4.2.0

## 开发
``` bash
npm install
npm run dev
```
## 生产

### 创建环境变量文件
.env.production

```
GITHUB_CLIENT_SECRETS=github secrets
GITHUB_CLIENT_ID=github client id
GITEE_CLIENT_SECRETS=gitee secrets
GITEE_CLIENT_ID=gitee client id
JWT_SECRET=jwt secret
```

``` bash
npm install
npm start
```
## OAuth 配置说明
[Github OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

[Gitee OAuth](https://gitee.com/api/v5/oauth_doc#/list-item-1)

## Docker

```
docker pull drinkjs/mojito-server
```

``` bash
docker run --env-file=./.env.production -p 3840:3840 --name=mojito_server -d -e MONGO_CONNECTION=mongodb://MyHost:27017/ drinkjs/mojito-server
```