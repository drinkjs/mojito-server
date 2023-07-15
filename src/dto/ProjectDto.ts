import { IsMongoId, IsNotEmpty, MaxLength } from "ngulf/class-validator";

export class ProjectDto {
  @IsNotEmpty({ groups: ["update"] })
  @IsMongoId({ groups: ["update"] })
  id!: string;

  @IsNotEmpty({ groups: ["add", "update"] })
  @MaxLength(30, { groups: ["add", "update"] })
  name!: string;

  userId!: string;

  createAt?: string;

  updateAt?: string;
}
