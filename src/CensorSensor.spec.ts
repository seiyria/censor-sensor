
import test from 'ava-ts';

import { CensorSensor, CensorTier } from './CensorSensor';

test.beforeEach(t => {
  t.context.censorSensor = new CensorSensor();
});

test('Some words/phrases are (or are not) considered profane', t => {
  const censorSensor = t.context.censorSensor;

  t.true(censorSensor.isProfane('fuck'));
  t.true(censorSensor.isProfaneIsh('fuck this noise'));
  t.false(censorSensor.isProfane('hello'));
  t.true(censorSensor.isProfaneIsh('hello'));
});

test('Custom words are properly added to or removed from the custom dictionary, and they work for profanity filtering', t => {
  const censorSensor = t.context.censorSensor;

  t.false(censorSensor.isProfane('buffoon'));
  censorSensor.addWord('buffoon');
  t.true(censorSensor.isProfane('buffoon'));
  censorSensor.removeWord('buffoon');
  t.false(censorSensor.isProfane('buffoon'));
});

test('The profanity in a phrase can be retrieved', t => {
  const censorSensor = t.context.censorSensor;

  t.deepEqual(censorSensor.profaneIshWords('fuck'), ['fuck']);
  t.deepEqual(censorSensor.profaneIshWords('god damn this fucking shit'), ['damn', 'fucking', 'fuck', 'god damn', 'shit']);
});

test('Custom locales can be added, and work', t => {
  const censorSensor = t.context.censorSensor;

  const customLocale = { buffoon: 1 };

  t.false(censorSensor.isProfane('buffoon'));
  censorSensor.addLocale('custom', customLocale);
  censorSensor.setLocale('custom');
  t.true(censorSensor.isProfane('buffoon'));
  censorSensor.setLocale('en');
  t.false(censorSensor.isProfane('buffoon'));
});

test('Tiers can be disabled and enabled for word filtering', t => {
  const censorSensor = t.context.censorSensor;

  t.true(censorSensor.isProfane('fuck'));
  censorSensor.disableTier(CensorTier.CommonProfanity);
  t.false(censorSensor.isProfane('fuck'));
  censorSensor.enableTier(CensorTier.CommonProfanity);
  t.true(censorSensor.isProfane('fuck'));
});

test('Profanity can be "fixed"', t => {
  const censorSensor = t.context.censorSensor;

  t.is(censorSensor.cleanProfanity('fuck'), '****');
  t.is(censorSensor.cleanProfanity('fuck fuck'), '**** ****');
  t.is(censorSensor.cleanProfanity('bitch'), '****');
  t.is(censorSensor.cleanProfanity('bitch fuck'), '**** ****');
  t.is(censorSensor.cleanProfanity('What a fucking shithead.'), 'What a **** shithead.');
});

test('Profanity can be "fixed" using a loose check', t => {
  const censorSensor = t.context.censorSensor;

  t.is(censorSensor.cleanProfanityIsh('fuck'), '****');
  t.is(censorSensor.cleanProfanityIsh('bitchfuck'), '********');
  t.is(censorSensor.cleanProfanityIsh('What a fucking shithead.'), 'What a **** ****head.');
});

test('Profanity can be "fixed" with a custom function', t => {
  const censorSensor = t.context.censorSensor;

  t.is(censorSensor.cleanProfanity('fuck'), '****');

  // $ for every char in the list, instead of just four *
  censorSensor.setCleanFunction((str) => Array.from(str, x => '$').join(''));
  t.is(censorSensor.cleanProfanity('fuck'), '$$$$');
  t.is(censorSensor.cleanProfanity('fuck fuck'), '$$$$ $$$$');
  t.is(censorSensor.cleanProfanity('bitch'), '$$$$$');
  t.is(censorSensor.cleanProfanity('bitch bitch'), '$$$$$ $$$$$');
  t.is(censorSensor.cleanProfanity('What a fucking shithead.'), 'What a $$$$$$$ shithead.');

  censorSensor.resetCleanFunction();
  t.is(censorSensor.cleanProfanity('fuck'), '****');
});

test('Profanity can be "fixed" using a loose check and a custom function', t => {
  const censorSensor = t.context.censorSensor;

  censorSensor.setCleanFunction((str) => Array.from(str, x => '%').join(''));
  t.is(censorSensor.cleanProfanityIsh('fuck'), '%%%%');
  t.is(censorSensor.cleanProfanityIsh('bitchfuck'), '%%%%%%%%%');
  t.is(censorSensor.cleanProfanityIsh('What a fucking shithead.'), 'What a %%%%%%% %%%%head.');
});

