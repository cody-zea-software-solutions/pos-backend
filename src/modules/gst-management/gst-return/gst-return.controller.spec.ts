import { Test, TestingModule } from '@nestjs/testing';
import { GstReturnController } from './gst-return.controller';
import { GstReturnService } from './gst-return.service';
import { CreateGstReturnDto } from './dto/create-gst-return.dto';
import { UpdateGstReturnDto } from './dto/update-gst-return.dto';

describe('GstReturnController', () => {
  let controller: GstReturnController;
  let service: GstReturnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GstReturnController],
      providers: [
        {
          provide: GstReturnService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GstReturnController>(GstReturnController);
    service = module.get<GstReturnService>(GstReturnService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a GST return', async () => {
      const dto: CreateGstReturnDto = {
        shop_id: 1,
        return_type: 'GSTR3B',
        period_month: '09',
        period_year: '2025',
        status: 'DRAFT',
        total_taxable_sales: 50000,
        total_cgst_collected: 2500,
        total_sgst_collected: 2500,
        total_igst_collected: 0,
        total_cess_collected: 0,
        total_taxable_purchases: 20000,
        total_cgst_paid: 1000,
        total_sgst_paid: 1000,
        total_igst_paid: 0,
        total_cess_paid: 0,
        net_tax_liability: 3000,
        filed_by_user: 10,
      };
      const result = { return_id: 1, ...dto };

      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(dto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return array of GST returns', async () => {
      const result = [{ return_id: 1 }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single GST return', async () => {
      const result = { return_id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a GST return', async () => {
      const dto: UpdateGstReturnDto = { status: 'FILED' };
      const result = { return_id: 1, status: 'FILED' };

      jest.spyOn(service, 'update').mockResolvedValue(result as any);

      expect(await controller.update('1', dto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should delete a GST return', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove('1')).toBeUndefined();
    });
  });
});
