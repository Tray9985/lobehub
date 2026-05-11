// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { TraceClient } from './index';

describe('TraceClient', () => {
  it('should never initialize Langfuse client', () => {
    const client = new TraceClient();

    expect(client.createTrace({ id: 'abc' })).toBeUndefined();
  });

  it('should expose no-op event and shutdown methods', async () => {
    const client = new TraceClient();

    expect(client.createEvent('trace-id')).toBeUndefined();
    await client.shutdownAsync();
  });
});
