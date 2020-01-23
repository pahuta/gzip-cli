export default class GeneratorUtils {
  static execute(generator: Generator<Promise<string>, Promise<string>, string>, yieldValue?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const next = generator.next(yieldValue);

      if (!next.done) {
        next.value
          .then(result => GeneratorUtils.execute(generator, result))
          .then(() => resolve())
          .catch(err => {
            generator.throw(err);
            reject(err);
          });
      } else {
        resolve();
      }
    });
  }
}
