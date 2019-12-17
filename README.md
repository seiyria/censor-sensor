# Censor Sensor

A better profanity filter.

# Why?

Every other profanity filter just seems to be an array of words, checked against every word in a phrase. This is ridiculous - it's an O(N^2) check when it only needs to be O(N). Of course, this library, by default, only requires an O(N) check (and that's against your phrase; not my words). You can opt in to a "like" check which will check every word and try to match it to a substring.

Every other profanity filter also seems to neglect "tiers" of words. You might want to filter out slurs, but not common profanity. You can do that here.

If you want, you can pass a function that lets you censor words how you want. By default, it will be replaced with the `*` character in quantity based on the word (so "fuck" translates to "****").

That said, this library only has a list for english (`en`), but could be extended to add more fairly easily.

You can remove or add words at run time. By default, they'll be assigned the lowest tier (5).

Words are shamelessly based on [profanity-cleanser](https://github.com/LDNOOBW/profanity-cleanser), because I'm not creative enough to think of some of these.

# Install

`npm i censor-sensor`

# Usage

```js
import { CensorSensor } from 'censor-sensor';

const censor = new CensorSensor();

// check for profanity (using equality)
censor.isProfane('bollocks'); // true
censor.isProfane('hello');    // false

// check for profanity (using string.includes)
censor.isProfaneIsh('bollockshead') // true
censor.isProfaneIsh('hello')        // true

// get the words that are profane from a phrase
censor.profaneIshWords('hello')     // ['hell']

// clean profanity (using equality)
censor.cleanProfanity('bollocks')   // '****' (by default)
censor.cleanProfanityIsh('hello')   // '****o' (by default)

// add a custom cleanup function
censor.setCleanFunction((str) => Array.from(str, x => '%').join('')); // replace all bad characters with '%'
censor.cleanProfanity('bollocks')   // '%%%%%%%%' (by default)

// reset the cleanup function
censor.resetCleanFunction()

// modify the banned words list
censor.isProfane('asdf')    // false
censor.addWord('asdf')
censor.isProfane('asdf')    // true
censor.removeWord('asdf')
censor.isProfane('asdf')    // false

// modify the banned "tier"
censor.isProfane('bollocks')    // true
censor.disableTier(4)
censor.isProfane('bollocks')    // false 
censor.enableTier(4);
censor.isProfane('bollocks')    // true

// add a custom locale (dict) and use it
censor.isProfane('uwotm8')                // false
censor.addLocale('custom', { uwotm8: 1 }) // the highest form of insult
censor.setLocale('custom')
censor.isProfane('uwotm8')                // true
censor.setLocale('en')
censor.isProfane('uwotm8')                // false

// remove an existing word from an existing tier
censor.isProfane('hell')  // true
censor.removeWord('hell')
censor.isProfane('hell')  // false
```

# Word Tiers

As stated before, every word has a tier associated with it. Here is what each tier number means:

1. slurs
2. common profanity
3. sexual terms
4. possibly offensive terms
5. user-created terms

# Contributing

Feel free to contribute words, locales, or features.
