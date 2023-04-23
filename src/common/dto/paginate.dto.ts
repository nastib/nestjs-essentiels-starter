import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max } from 'class-validator';

export class PaginateDto {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Max(20)
  limit: number = 10;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Max(100)
  offset: number = 0;
}
