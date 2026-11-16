import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateVendorApplicationDto {
  @IsString() @Length(2, 120) name!: string;
  @IsString() @Length(3, 80) storeSlug!: string;
  @IsIn(['INDIVIDUAL', 'BUSINESS']) type!: 'INDIVIDUAL' | 'BUSINESS';
  @IsString() @Matches(/^[6-9]\d{9}$/) mobile!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsBoolean() gstRegistered?: boolean;
  @IsOptional() @IsString() @Length(15, 15) gstin?: string;
}
