import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-role.enum';

/**
 * Helper: Create a realistic mock User entity
 * (satisfies all required fields but uses dummy values)
 */
function createMockUser(role: UserRole = UserRole.SUPER_ADMIN): User {
  return {
    user_id: 1,
    username: 'john',
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone: '1234567890',
    role,
    is_active: true,
    // unused fields in your entity (set to null or empty)
    password_hash: 'hashedpassword',
    assigned_shop: null,
    permissions: '',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null,
    counters: [],
    shifts: [],
    sales: [],
    audit_logs: [],
    shop_admins: [],
    issued_gift_cards: [],
  } as unknown as User;
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            getMe: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    })
      // Disable actual JWT guard logic for test simplicity
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('login', () => {
    it('should call AuthService.validateUser and AuthService.login', async () => {
      const dto = { username: 'john', password: '123', counter_code: 'C001' };
      const mockUser = createMockUser(UserRole.SUPER_ADMIN);

      authService.validateUser.mockResolvedValue(mockUser);
      authService.login.mockResolvedValue({
        access_token: 'mock-token',
        role: UserRole.SUPER_ADMIN,
      });

      const result = await controller.login(dto);

      expect(authService.validateUser).toHaveBeenCalledWith('john', '123');
      expect(authService.login).toHaveBeenCalledWith(mockUser, 'C001');
      expect(result).toEqual({
        access_token: 'mock-token',
        role: UserRole.SUPER_ADMIN,
      });
    });
  });

  describe('getMe', () => {
    it('should return the current user data', async () => {
      const req = { user: { user_id: 1 } };
      const mockUser = createMockUser(UserRole.SUPER_ADMIN);

      authService.getMe.mockResolvedValue(mockUser);

      const result = await controller.getMe(req);

      expect(authService.getMe).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout and return message', async () => {
      const req = { user: { user_id: 1, role: UserRole.CASHIER } };

      authService.logout.mockResolvedValue({ message: 'Logged out successfully' });

      const result = await controller.logout(req);

      expect(authService.logout).toHaveBeenCalledWith(req.user);
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
