import "reflect-metadata";
import { injectable, container, inject } from "tsyringe";

interface Loggable {
  log(message: string): void;
}

export class LogService implements Loggable {
  private counter = 0;
  constructor() {
    console.log("LogService instantiated.");
  }
  log(message: string) {
    console.log(`(${this.counter++}): ${message}`);
  }
}

container.register("Loggable", LogService);

@injectable()
export class Service {
  constructor(@inject("Loggable") private service: Loggable) {
    console.log("Service instantiated.");
  }
  execute() {
    console.log("Service executed.");
    this.service.log("test");
  }
}

export class Service2 {
  constructor() {
    console.log("Service2 instantiated.");
  }
  execute() {
    console.log("Service2 executed.");
  }
}

const svc = container.resolve(Service);
const svc2 = container.resolve(Service2);
svc.execute();
svc2.execute();
