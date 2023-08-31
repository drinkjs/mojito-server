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

### .env.production

```
github_client_secrets=github secrets
github_client_id=github client id
gitee_client_secrets=gitee secrets
gitee_client_id=gitee client id
jwt_secret=jwt secret
```

``` bash
npm install
npm start
```

[Github OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

[Gitee OAuth](https://gitee.com/api/v5/oauth_doc#/list-item-1)

## Docker

```
docker pull drinkjs/mojito-server
```

``` bash
docker run --env-file=./.env.production -p 3840:3840 --name=mojito_server -d drinkjs/mojito-server
```

## 指定mongo
``` bash
docker run --env-file=./.env.production -p 3840:3840 --name=mojito_server -d -e MONGO_CONNECTION=mongodb://MyHost:27017/ drinkjs/mojito-server
```