/* eslint-disable @typescript-eslint/no-namespace */
import { expect } from '@playwright/test';
import AjvModule from 'ajv';
import addFormatsModule from 'ajv-formats';

const ajvModule = (AjvModule as any).default || AjvModule;
const addFormats = (addFormatsModule as any).default || addFormatsModule;
const ajv = new ajvModule({ allErrors: true });
addFormats(ajv);

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toMatchSchema(schema: object): R;
    }
  }
}

expect.extend({
  toMatchSchema(received: any, schema: object) {
    const validate = ajv.compile(schema);
    const valid = validate(received);

    if (valid) {
      return { message: () => 'JSON Schema matches', pass: true };
    } else {
      return {
        message: () =>
          `Schema validation errors:\n${validate.errors
            ?.map((err: any) => `Path: ${err.instancePath}, Error: ${err.message}`)
            .join('\n')}`,
        pass: false
      };
    }
  }
});

export { expect };
