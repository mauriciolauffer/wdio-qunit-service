import { BaseReporter } from "vitest/reporters";

export default class CustomReporter extends BaseReporter {
  onRunStart() {
    this.ctx.logger.log("yoooo it has started");
  }

  onRunComplete() {
    this.ctx.logger.log("yessss, it's completed");
  }
}
