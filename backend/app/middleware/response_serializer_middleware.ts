import { NotFoundException } from "#exceptions/not_found_exception";
import { Data } from "#utils/data";
import { Result } from "#utils/result";
import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

export default class ResponseSerializerMiddleware {
  async handle({ response }: HttpContext, next: NextFn) {
    await next();

    if (!response.hasContent) {
      return response;
    }

    const [content] = response.content!;
    if (!content) {
      return response;
    }

    if (Data.isInstance(content)) {
      if (!content.hasValue) {
        throw new NotFoundException();
      }

      if (content.value != null) {
        response.status(200).send({ data: content.value });
      } else {
        response.noContent();
      }
      return;
    }

    const result = content as Result<unknown, Error>;
    if (result.isErr) {
      throw result.error;
    }

    if (result.isOk) {
      if (result.value === undefined) {
        response.noContent();
      } else {
        response.status(200).send({ data: result.value });
      }
    }
  }
}
