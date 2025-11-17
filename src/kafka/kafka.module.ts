import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'ACCOUNTING_KAFKA',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                    consumer: {
                        groupId: 'pos-producer',
                    },
                },
            },
        ]),
    ],
    exports: ['ACCOUNTING_KAFKA'],
})
export class KafkaModule {}
