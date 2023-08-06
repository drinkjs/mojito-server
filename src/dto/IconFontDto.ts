import { IsMongoId, IsNotEmpty, MaxLength } from "ngulf/class-validator";

export class IconFontDto {
  @IsNotEmpty({ message: "id不能为空", groups: ["update"] })
  @IsMongoId({ message: "非法id", groups: ["update"] })
  id!: string;

  @IsNotEmpty({ groups: ["add"] })
  @MaxLength(200, { groups: ["add", "update"] })
  url!: string;
}