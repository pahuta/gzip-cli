class GeneratorUtils {
    static execute(generator, yieldValue) {
        return new Promise((resolve, reject) => {
            let next = generator.next(yieldValue);

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

module.exports = GeneratorUtils;
