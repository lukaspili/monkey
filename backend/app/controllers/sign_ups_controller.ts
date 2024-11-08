import db from "#db";
import e from "#db/edgeql/index";
import { NotFoundException } from "#exceptions/not_found_exception";
import { CreateSignUpRequestPayload, VerifySignUpRequestPayload } from "#payloads/sign_up_payloads";
import { Result } from "#utils/result";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import { SignUpRequestTask } from "../tasks/sign_up_request_task.js";

@inject()
export default class SignUpsController {
  constructor(protected signUpRequestTask: SignUpRequestTask) {}

  async create({ request }: HttpContext) {
    const payload = await request.validateUsing(CreateSignUpRequestPayload);
    const data = await this.signUpRequestTask.create(db.client, payload);
    return Result.ok(data);
  }

  async show({ params }: HttpContext) {
    const { slug } = params;

    const data = await e
      .select(e.SignUpRequest, (_) => ({
        ...e.SignUpRequest["*"],
        password_hash: false,
        email_verification_request: {
          ...e.EmailVerificationRequest["*"],
          token: false,
        },
        filter_single: { slug: slug },
      }))
      .run(db.client);

    if (!data || data.completed) {
      throw NotFoundException.of("Sign-up request");
    }

    return Result.ok(data);
  }

  async verify({ request }: HttpContext) {
    const payload = await request.validateUsing(VerifySignUpRequestPayload);
    const data = await this.signUpRequestTask.verify(db.client, payload);
    return Result.ok(data);
  }
}
