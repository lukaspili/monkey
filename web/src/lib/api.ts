import "server-only";

import { Http } from "@/lib/http";
import Recase from "better-recase";
import { chain, isNull, isUndefined } from "lodash";
import { cookies } from "next/headers";
import { CustomError } from "ts-custom-error";

declare var process: {
  env: {
    NEXT_PUBLIC_API_URL: string;
  };
};

export type ApiResponse<T = any> = {
  status: number;
  data: T | null;
  errors: string[];
  simpleError: string;
  meta: Record<string, any>;
  successful: boolean;
  failed: boolean;
  hasData: boolean;
  hasErrors: boolean;
  isConnectionError: boolean;
};

export class ApiError extends CustomError {
  public constructor(protected _response: ApiResponse) {
    super(_response.simpleError);
  }

  public get response(): ApiResponse {
    return this.response;
  }
}

// export class AccessDeniedError extends ApiError {
//   public constructor() {
//     super(401, "Access denied");
//   }
// }

export interface ApiRequest {
  path: string;
  method?: Http;
  query?: Record<string, any>;
  headers?: Record<string, any>;
  body?: any;
  noSession?: boolean;
  tags?: string[];
}

export async function api<T>({
  path,
  method = "get",
  query,
  headers: extraHeaders,
  body,
  noSession: noSession,
  tags = [],
}: ApiRequest): Promise<ApiResponse<T>> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  let url = `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  if (query != undefined) {
    url += `?${new URLSearchParams(chain(query).omitBy(isUndefined).omitBy(isNull).value())}`;
  }

  console.log(`[api] ${method} ${url}`);

  if (process.env.NEXT_PUBLIC_API_URL.startsWith("http://localhost")) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const cookiesStore = await cookies();
  const accessToken = noSession ? undefined : cookiesStore.get("access_token")?.value;

  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    ...(accessToken != undefined ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(extraHeaders != undefined ? extraHeaders : {}),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      headers,
      method: method.toUpperCase(),
      body: JSON.stringify(body),
      next: { tags },
    });
  } catch (e) {
    let message: string;
    if (e instanceof Error) message = e.message;
    else message = String(e);

    console.error("[api] fetch error: ", message);

    const errors = [
      "Failed to connect to the server.\nMaybe it's your internet? Otherwise it's on us, sorry. Please try again.",
    ];
    return {
      status: -1,
      data: null,
      errors: errors,
      simpleError: errors[0],
      meta: {},
      successful: false,
      failed: true,
      hasData: false,
      hasErrors: false,
      isConnectionError: true,
    };
  }

  console.log(`[api] ${method} ${url} <- ${response.status}`);
  return parseResponse(response);
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const status = response.status;
  let data: T | null = null;
  let errors: string[] = [];
  let simpleError = "";
  let meta: Record<string, any> = {};

  let body = null;
  try {
    body = await response.json();
    body = Recase.camelCopy(body);
  } catch (e) {
    // Successful response but doesn't include any data
    body = {};
  }

  if (response.ok) {
    data = body.data != null ? (body.data as T) : null;
  } else {
    errors = body.errors != null ? (body.errors as string[]) : [];
    simpleError = errors.isNotEmpty()
      ? errors[0]
      : "Something went wrong on our side, sorry. Please try again.";
  }

  if (body.meta != undefined && typeof body.meta === "object") {
    meta = body.meta;
  }

  return {
    status,
    data,
    errors,
    simpleError,
    meta,
    successful: response.ok,
    failed: !response.ok,
    hasData: data != null,
    hasErrors: errors.length > 0,
    isConnectionError: false,
  };
}
