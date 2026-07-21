import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ResolveImageUrlDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl(
    {
      protocols: ['https'],
      require_protocol: true,
    },
    {
      message: 'url must be a valid HTTPS URL',
    },
  )
  url: string;
}
