import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'price must be a positive decimal string, for example 1500.00',
  })
  price: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  wood?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  size?: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl(
    {
      protocols: ['https'],
      require_protocol: true,
    },
    {
      message: 'managerLink must be a valid HTTPS URL',
    },
  )
  managerLink: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    {
      message: 'coverImage must be a valid image URL',
    },
  )
  coverImage: string;
}
