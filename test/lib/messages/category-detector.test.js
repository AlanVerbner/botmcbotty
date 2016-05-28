const natural = require('natural')

const expect = require('chai').expect

const classifierInputData = require('../../../data/classifier-input.json')

describe.skip('Classify Categories', function () {
    it('Train categories and check results', function (done) {
        const classifier = new natural.BayesClassifier();
        classifierInputData.forEach(function (element) {
            classifier.addDocument(element.description, element.category)
        }, this);

        classifier.train();

        expect(classifier.classify('cerveza')).to.equal('Salida')
        expect(classifier.classify('rosa')).to.equal('Limpieza casa')

        classifier.save('data/classifier.json', function (err, classifier) {
            console.log(err)
            done()
        });

    })
})