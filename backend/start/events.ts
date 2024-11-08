import emitter from "@adonisjs/core/services/emitter";

emitter.on("mail:sent", (event) => {
  console.log(`Mail sent to ${event.message.to}: ${event.message.subject}`);
});

emitter.on("queued:mail:error", (event) => {
  console.log(`Mail error`, event.error);
});
