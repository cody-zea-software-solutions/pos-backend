import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Service } from '../services/service.entity';
import { ServiceResource } from '../service-resources/service-resources.entity';

@Entity('service_resource_requirements')
export class ServiceResourceRequirement {
  @PrimaryGeneratedColumn()
  requirement_id: number;

  // Unidirectional FK to Service
  @ManyToOne(() => Service)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  // Unidirectional FK to Resource
  @ManyToOne(() => ServiceResource)
  @JoinColumn({ name: 'resource_id' })
  resource: ServiceResource;

  @Column()
  quantity_required: number;

  @Column()
  duration_minutes: number;

  @Column({ default: false })
  is_mandatory: boolean;

  @Column({ default: false })
  is_consumable: boolean;

  @Column({ type: 'text', nullable: true })
  usage_notes: string;
}
