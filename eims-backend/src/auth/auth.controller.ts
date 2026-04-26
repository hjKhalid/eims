import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Request, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req: any, @Body() body: { currentPassword: string; newPassword: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const valid = await bcrypt.compare(body.currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');
    const hash = await bcrypt.hash(body.newPassword, 10);
    await this.prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });
    return { message: 'Password updated successfully' };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req: any, @Body() body: { name?: string; phone?: string }) {
    const updated = await this.prisma.user.update({
      where: { id: req.user.userId },
      data: { ...(body.name && { name: body.name }), ...(body.phone && { phone: body.phone }) },
      select: { id: true, name: true, email: true, phone: true },
    });
    return updated;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, phone: true, avatar: true, createdAt: true, roles: { include: { role: true } } },
    });
    return user;
  }
}
