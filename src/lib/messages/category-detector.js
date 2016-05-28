'use strict';

const natural = require('natural')

let classifier = undefined

natural.BayesClassifier.load('data/classifier.json', null, function (err, instance) {
    classifier = instance
});

module.exports = function classify(description) {
    if (classifier)
        return classifier.classify(description)

    throw new Error('Category Detector is not Ready!')
}