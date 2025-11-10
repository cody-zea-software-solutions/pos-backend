import { Test, TestingModule } from '@nestjs/testing';
import { GstItemDetailsController } from './gst-item-details.controller';
import { GstItemDetailsService } from './gst-item-details.service';

import { CreateGstItemDetailDto } from './dto/create-gst-item.dto';
import { UpdateGstItemDetailDto } from './dto/update-gst-item.dto';
describe('GstItemDetailsController', () => {
  let controller: GstItemDetailsController;
  let service: GstItemDetailsService;

  const mockService = {
    create: jest.fn(dto => ({ gst_item_id: 1, ...dto })),
    findAll: jest.fn(() => [{ gst_item_id: 1 }]),
    findOne: jest.fn(id => ({ gst_item_id: id })),
    update: jest.fn((id, dto) => ({ gst_item_id: id, ...dto })),
   remove: jest.fn(async id => undefined), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GstItemDetailsController],
      providers: [{ provide: GstItemDetailsService, useValue: mockService }],
    }).compile();

    controller = module.get<GstItemDetailsController>(GstItemDetailsController);
    service = module.get<GstItemDetailsService>(GstItemDetailsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a GST item', async () => {
    const dto: CreateGstItemDetailDto = { gst_transaction_id: 1, transaction_item_id: 1, product_id: 1, hsn_code: '1234', quantity: 1, unit_price: 100, discount_amount: 0, taxable_value: 100, cgst_rate: 5, sgst_rate: 5, igst_rate: 0, cess_rate: 0, cgst_amount: 5, sgst_amount: 5, igst_amount: 0, cess_amount: 0, total_tax_amount: 10 };
    expect(await controller.create(dto)).toEqual({ gst_item_id: 1, ...dto });
  });

  it('should return all GST items', async () => {
    expect(await controller.findAll()).toEqual([{ gst_item_id: 1 }]);
  });

  it('should return a single GST item', async () => {
    expect(await controller.findOne(1)).toEqual({ gst_item_id: 1 });
  });

  it('should update a GST item', async () => {
    const dto: UpdateGstItemDetailDto = { cgst_rate: 10 };
    expect(await controller.update(1, dto)).toEqual({ gst_item_id: 1, ...dto });
  });

  it('should remove a GST item', async () => {
    await expect(controller.remove(1)).resolves.toBeUndefined();
  });
});
