import vine from "@vinejs/vine";

const updateName = vine.compile(
  vine.object({
    name: vine.string().trim(),
  })
);

const MeAccountValidators = {
  updateName,
};

export default MeAccountValidators;
