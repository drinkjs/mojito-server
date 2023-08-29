import { UserHeader } from "@/config";
import { LoginDto } from "@/dto/LoginDto";
import UserService from "@/service/UserService";
import axios from "axios";
import {
	BaseController,
	Body,
	Controller,
	Get,
	Query,
	RouterContext,
	Validation,
	Headers,
	AppError,
} from "ngulf";

const DEV_USER_ID = "64d4a50ac89b1a65574670d2"

@Controller("/user")
export default class UserController extends BaseController {
	constructor(private readonly service: UserService) {
		super();
	}

	// @Get("/dev/auth")
	// async devAuth(ctx: RouterContext) {
	// 	if (process.env.NODE_ENV === "development") {
	// 		const id = DEV_USER_ID;
	// 		return this.success({
	// 			token: ctx.server.jwt.sign({ name: "local_dev", id }),
	// 			name: "local_dev",
	// 			id,
	// 		});
	// 	}
	// }

	@Get("/auth")
	async add(@Query(new Validation()) dto: LoginDto, ctx: RouterContext) {
		let loginRel: {
			token: string;
			name: string;
			id: string;
			avatarUrl?: string;
		} | null = null;

		let user = null;
		if (dto.from === "github") {
			user = await this.githubAuth(dto.code);
		} else if (dto.from === "gitee") {
			user = await this.giteeAuth(dto.code, dto.redirectUri);
		}

		if (user) {
			this.service.update(user.id, { lastLoginAt: new Date() });
			const token = ctx.server.jwt.sign({ name: user.name, id: user.id });
			loginRel = {
				token,
				name: user.name,
				id: user.id,
				avatarUrl: user.avatarUrl,
			};
		}

		if (loginRel) {
			return this.success(loginRel);
		}

		return this.fail("登录失败", 403);
	}

	@Get("/refresh")
	async refresh(@Headers(UserHeader) userId: string) {

    if (process.env.NODE_ENV === "development") {
			const id = DEV_USER_ID;
			return this.success({
				name: "local_dev",
				id,
			});
		}

		const user = await this.service.getUserById(userId);
		if (user) {
			this.service.update(user.id, { lastLoginAt: new Date() });
			return this.success({
				name: user.name,
				id: user.id,
				avatarUrl: user.avatarUrl,
			});
		}
		return this.fail("登录失败", 403);
	}

	async githubAuth(code: string) {
		const client_id = process.env.github_client_id;
		const client_secret = process.env.github_client_secrets;
		const response = await axios.post(
			"https://github.com/login/oauth/access_token",
			{ code, client_id, client_secret },
			{
				headers: {
					Accept: "application/json",
				},
				proxy:
					process.env.proxy_host && process.env.proxy_port
						? {
								protocol: "http",
								host: process.env.proxy_host,
								port: parseInt(process.env.proxy_port, 10),
						  }
						: undefined,
			}
		);

		if (response.status !== 200) {
			AppError.assert(
				`https://github.com/login/oauth/access_token ${response.statusText}`
			);
		}

		if (response && response.status === 200) {
			const { access_token } = response.data;
			const userInfo = await axios.get("https://api.github.com/user", {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
				proxy:
					process.env.proxy_host && process.env.proxy_port
						? {
								protocol: "http",
								host: process.env.proxy_host,
								port: parseInt(process.env.proxy_port, 10),
						  }
						: undefined,
			});

			if (response.status !== 200) {
				AppError.assert(
					`https://github.com/login/oauth/access_token ${response.statusText}`
				);
			}

			if (userInfo && userInfo.status === 200) {
				const { name, email, avatar_url, id } = userInfo.data;
				if (name && id) {
					return await this.service.add({
						from: "github",
						name,
						email,
						authUserId: id,
						avatarUrl: avatar_url,
					});
				}
			}
		}
	}

	async giteeAuth(code: string, redirectUri?: string) {
		const client_id = process.env.gitee_client_id;
		const client_secret = process.env.gitee_client_secrets;
		const response = await axios.post(
			`https://gitee.com/oauth/token?grant_type=authorization_code&code=${code}&client_id=${client_id}&redirect_uri=${redirectUri}`,
			{ client_secret },
			{
				headers: {
					Accept: "application/json",
				},
			}
		);

		if (response && response.status === 200) {
			const { access_token } = response.data;

			const userInfo = await axios.get(
				`https://gitee.com/api/v5/user?access_token=${access_token}`
			);
			if (userInfo && userInfo.status === 200) {
				const { name, email, avatar_url, id } = userInfo.data;
				if (name && id) {
					return await this.service.add({
						from: "gitee",
						name,
						email,
						authUserId: id,
						avatarUrl: avatar_url,
					});
				}
			}
		}
	}
}
