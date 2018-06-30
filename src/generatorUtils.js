class GeneratorUtils {
    static execute(generator, yieldValue) {
        let next = generator.next(yieldValue);

        if (!next.done) {
            next.value
                .then(result => GeneratorUtils.execute(generator, result))
                .catch(err => generator.throw(err));
        }
    }
}

module.exports = GeneratorUtils;