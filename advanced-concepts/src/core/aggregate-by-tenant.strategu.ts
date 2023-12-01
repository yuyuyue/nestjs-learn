import {
  ContextId,
  ContextIdFactory,
  ContextIdResolver,
  ContextIdResolverFn,
  ContextIdStrategy,
  HostComponentInfo,
} from '@nestjs/core';
import { Request } from 'express';

export class AggreteByTenantContextIdStrategy implements ContextIdStrategy {
  private readonly tenants = new Map<string, ContextId>();
  attach(
    contextId: ContextId,
    request: Request,
  ): ContextIdResolverFn | ContextIdResolver {
    const tenantId = request.headers['x-tenant-id'] as string;
    if (!tenantId) {
      return () => contextId;
    }

    let tenantSubTreeId: ContextId;
    if (this.tenants.has(tenantId)) {
      tenantSubTreeId = this.tenants.get(tenantId);
    } else {
      tenantSubTreeId = ContextIdFactory.create();
      this.tenants.set(tenantId, contextId);
    }
    return {
      payload: { tenantId },
      resolve: (info: HostComponentInfo) =>
        info.isTreeDurable ? tenantSubTreeId : contextId,
    };
  }
}
