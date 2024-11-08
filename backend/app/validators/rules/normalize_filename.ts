import vine from "@vinejs/vine";
import filenamify from "filenamify";
import * as path from "node:path";

export const normalizeFilename = vine.createRule<string | string[] | undefined>(
  (value, _locales, field) => {
    if (typeof value !== "string") {
      return;
    }

    if (!field.isValid) {
      return;
    }

    const file = filenamify(value, { replacement: "_", maxLength: 100 });

    const basename = path.basename(file);
    const extension = path.extname(basename);
    if (extension === "") {
      field.report("The {{ field }} must have an extension.", "normalizeFilename", field);
      return;
    }

    field.mutate(basename, field);
  }
);
