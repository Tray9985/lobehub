export class TraceClient {
  constructor() {
    // Langfuse 已彻底关闭，无论环境变量如何设置都不会初始化
  }

  createEvent(_traceId: string) {
    return;
  }

  createTrace(_param: Record<string, unknown>) {
    return;
  }

  async shutdownAsync() {
    // no-op
  }
}
