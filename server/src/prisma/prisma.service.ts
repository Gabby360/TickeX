import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter } as any);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Database connected');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('⚠️ Database connection warning during onModuleInit:', msg);
    }
  }
}
