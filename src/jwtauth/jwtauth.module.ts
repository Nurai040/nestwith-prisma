import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    JwtModule.register({
      secret: 'MySecretKEY',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  exports: [JwtModule],
})
export class JwtauthModule {}
