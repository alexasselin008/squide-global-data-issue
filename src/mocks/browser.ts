import type { RequestHandler } from 'msw';
import { setupWorker } from 'msw/browser';

export async function startMsw(moduleRequestHandlers: RequestHandler[]) {
  console.log(moduleRequestHandlers);
  const worker = setupWorker(...moduleRequestHandlers);

  await worker.start({
    onUnhandledRequest: 'bypass',
  });
}
