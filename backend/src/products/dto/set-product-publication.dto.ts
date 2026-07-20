import { IsBoolean } from 'class-validator';

export class SetProductPublicationDto {
  @IsBoolean()
  isPublished: boolean;
}
