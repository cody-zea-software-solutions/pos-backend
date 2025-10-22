import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ShiftService } from '../shift/shift.service';
import { CounterService } from '../counter/counter.service';
import {
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/user-role.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let shiftService: jest.Mocked<ShiftService>;
  let counterService: jest.Mocked<CounterService>;

  beforeEach(async () => {
    // ✅ Strongly typed jest.Mocked versions — no undefined errors
    const usersServiceMock: jest.Mocked<UsersService> = {
      findByUsername: jest.fn(),
      findOne: jest.fn(),
    } as any;

    const jwtServiceMock: jest.Mocked<JwtService> = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    } as any;

    const shiftServiceMock: jest.Mocked<ShiftService> = {
      startShiftForCashier: jest.fn().mockResolvedValue({
        shift_id: 1,
        shift_start: new Date(),
        status: 'ACTIVE',
      }),
      endShiftForCashier: jest.fn(),
    } as any;

    const counterServiceMock: jest.Mocked<CounterService> = {
      findByCode: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: ShiftService, useValue: shiftServiceMock },
        { provide: CounterService, useValue: counterServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    shiftService = module.get(ShiftService);
    counterService = module.get(CounterService);
  });

  // ✅ validateUser Tests
  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = { username: 'john', password_hash: await bcrypt.hash('password', 10) };
      usersService.findByUsername.mockResolvedValue(mockUser as any);

      const result = await authService.validateUser('john', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException for invalid username', async () => {
      usersService.findByUsername.mockResolvedValue(null as any);
      await expect(authService.validateUser('john', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const mockUser = { username: 'john', password_hash: await bcrypt.hash('password', 10) };
      usersService.findByUsername.mockResolvedValue(mockUser as any);
      await expect(authService.validateUser('john', 'wrongpass')).rejects.toThrow(UnauthorizedException);
    });
  });

  // ✅ login Tests
  describe('login', () => {
    it('should login admin and return token', async () => {
      const user = { user_id: 1, username: 'admin', role: UserRole.SUPER_ADMIN } as any;
      const result = await authService.login(user);
      expect(result).toEqual({ access_token: 'mock-jwt-token', role: UserRole.SUPER_ADMIN });
    });

    it('should throw BadRequestException if cashier login without counter_code', async () => {
      const user = { user_id: 2, username: 'cashier1', role: UserRole.CASHIER } as any;
      await expect(authService.login(user)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if counter not found', async () => {
      const user = { user_id: 2, username: 'cashier1', role: UserRole.CASHIER } as any;
      counterService.findByCode.mockResolvedValue(null);
      await expect(authService.login(user, 'C001')).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if counter in use', async () => {
      const user = { user_id: 2, username: 'cashier1', role: UserRole.CASHIER } as any;
      counterService.findByCode.mockResolvedValue({ code: 'C001', current_user: 5 } as any);
      await expect(authService.login(user, 'C001')).rejects.toThrow(ConflictException);
    });

    it('should login cashier successfully', async () => {
      const user = { user_id: 2, username: 'cashier1', role: UserRole.CASHIER } as any;
      counterService.findByCode.mockResolvedValue({ code: 'C001', current_user: null } as any);
      const result = await authService.login(user, 'C001');

      expect(result).toHaveProperty('access_token');
      expect(result.role).toBe(UserRole.CASHIER);
      expect(result.shift).toBeDefined();
    });
  });

  // ✅ logout Tests
  describe('logout', () => {
    it('should call endShiftForCashier for cashier', async () => {
      const user = { user_id: 1, role: UserRole.CASHIER } as any;
      await authService.logout(user);
      expect(shiftService.endShiftForCashier).toHaveBeenCalledWith(1);
    });

    it('should return success message for admin', async () => {
      const user = { user_id: 1, role: UserRole.SUPER_ADMIN } as any;
      const result = await authService.logout(user);
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
