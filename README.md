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
