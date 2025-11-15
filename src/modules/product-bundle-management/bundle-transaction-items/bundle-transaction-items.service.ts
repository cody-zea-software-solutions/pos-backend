import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BundleTransactionItems } from './bundle-transaction-items.entity';
import { CreateBundleTransactionItemsDto } from './dto/create-bundle-transaction-items.dto';
import { UpdateBundleItemDto } from './dto/update-bundle-transaction-item.dto';
import { BundleTransaction } from '../bundle-transactions/bundle-transactions.entity';
import { BundleItem } from '../bundle-items/bundle-item.entity';
import { ProductBundle } from '../product-bundles/product-bundle.entity';
import { Service } from '../../service-management/services/service.entity';

@Injectable()
export class BundleTransactionItemsService {
  constructor(
    @InjectRepository(BundleTransactionItems)
    private readonly bundleTransactionItemsRepository: Repository<BundleTransactionItems>,

    @InjectRepository(BundleTransaction)
    private readonly bundleTransactionRepo: Repository<BundleTransaction>,

    @InjectRepository(BundleItem)
    private readonly bundleItemRepo: Repository<BundleItem>,

    @InjectRepository(ProductBundle)
    private readonly productBundleRepo: Repository<ProductBundle>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async create(createDto: CreateBundleTransactionItemsDto): Promise<BundleTransactionItems> {
    const bundleTransaction = await this.bundleTransactionRepo.findOne({ where: { bundle_transaction_id: createDto.bundle_id }});
    if (!bundleTransaction) throw new NotFoundException('BundleTransaction not found');

    const bundleItem = await this.bundleItemRepo.findOne({ where: { bundle_item_id: createDto.bundle_item_id }});
    if (!bundleItem) throw new NotFoundException('BundleItem not found');

    const productBundle = await this.productBundleRepo.findOne({ where: { bundle_id: createDto.bundle_id }});
    if (!productBundle) throw new NotFoundException('ProductBundle not found');

    const service = await this.serviceRepo.findOne({ where: { service_id: createDto.service_id }});
    if (!service) throw new NotFoundException('Service not found');

    const newItem = this.bundleTransactionItemsRepository.create({
      ...createDto,
      bundle_transactions: bundleTransaction,
      bundle_items: bundleItem,
      product_bundles: productBundle,
      service: service,
    });

    return this.bundleTransactionItemsRepository.save(newItem);
  }

  async findAll(): Promise<BundleTransactionItems[]> {
    return this.bundleTransactionItemsRepository.find({
      relations: ['bundle_transactions', 'bundle_items', 'product_bundles', 'service'],
    });
  }

  async findOne(id: number): Promise<BundleTransactionItems> {
    const item = await this.bundleTransactionItemsRepository.findOne({
      where: { bundle_transaction_item_id: id },
      relations: ['bundle_transactions', 'bundle_items', 'product_bundles', 'service'],
    });
    if (!item) {
      throw new NotFoundException(`BundleTransactionItem with ID ${id} not found`);
    }
    return item;
  }

  async update(id: number, updateDto: UpdateBundleItemDto): Promise<BundleTransactionItems> {
    const item = await this.findOne(id);

    // Optionally update relations if IDs are provided in updateDto
    if (updateDto.bundle_id) {
      const bundleTransaction = await this.bundleTransactionRepo.findOne({ where: { bundle_transaction_id: updateDto.bundle_id }});
      if (!bundleTransaction) throw new NotFoundException('BundleTransaction not found');
      item.bundle_transactions = bundleTransaction;
    }

    if (updateDto.bundle_item_id) {
      const bundleItem = await this.bundleItemRepo.findOne({ where: { bundle_item_id: updateDto.bundle_item_id }});
      if (!bundleItem) throw new NotFoundException('BundleItem not found');
      item.bundle_items = bundleItem;
    }

    if (updateDto.bundle_id) {
      const productBundle = await this.productBundleRepo.findOne({ where: { bundle_id: updateDto.bundle_id }});
      if (!productBundle) throw new NotFoundException('ProductBundle not found');
      item.product_bundles = productBundle;
    }

    if (updateDto.service_id) {
      const service = await this.serviceRepo.findOne({ where: { service_id: updateDto.service_id }});
      if (!service) throw new NotFoundException('Service not found');
      item.service = service;
    }

    Object.assign(item, updateDto);

    return this.bundleTransactionItemsRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const result = await this.bundleTransactionItemsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`BundleTransactionItem with ID ${id} not found`);
    }
  }
}
