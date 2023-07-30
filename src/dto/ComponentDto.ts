import { IsArray, IsMongoId, IsNotEmpty, IsUrl, MaxLength } from "ngulf/class-validator";

export class ComponentDto {
  @IsNotEmpty({ message: "id不能为空", groups: ["update"] })
  @IsMongoId({ message: "非法id", groups: ["update"] })
  id!: string;

  @IsNotEmpty({ message: "name不能为空", groups: ["add", "update"] })
  @MaxLength(20, { groups: ["add", "update"] })
  name!: string;

  @IsNotEmpty({ groups: ["add", "update"] })
  @IsUrl()
  packJson!: string;

  @IsNotEmpty({ message: "type不能为空", groups: ["add", "update"] })
  @IsMongoId({ message: "非法类型", groups: ["add", "update"] })
  // 组件类型的id
  type!: string;

  @IsNotEmpty({ message: "version不能为空", groups: ["add", "update"] })
  @MaxLength(10, { groups: ["add", "update"] })
  version!: string;

  coverImg?: string;

  createAt?: string;

  updateAt?: string;

  origin!: 1 | 2; // 来源:1系统2第三方

  @IsNotEmpty({ message: "components不能为空", groups: ["add", "update"] })
  @IsArray()
  components!:any
}
