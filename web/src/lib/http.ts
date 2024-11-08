export type Http = (typeof HttpMethods)[keyof typeof HttpMethods];

const HttpMethods = {
  Get: "get",
  Post: "post",
  Put: "put",
  Patch: "patch",
  Delete: "delete",
} as const;
