import { AllLocales } from '../locales';

export type CensorLocale = 'en';

export enum CensorTier {
  Slurs = 1,
  CommonProfanity = 2,
  SexualTerms = 3,
  PossiblyOffensive = 4,
  UserAdded = 5
}

export class CensorSensor {

  private locale: CensorLocale|string = 'en';

  private blackList: { [word: string]: boolean } = {};

  private customDictionary: { [word: string]: CensorTier } = {};

  private enabledTiers: { [tier: string]: boolean } = {
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  };

  private defaultCleanFunction: (str: string) => string = (str: string) => '****';
  private customCleanFunction: (str: string) => string;

  private get currentDictionary(): { [word: string]: CensorTier } {
    return Object.assign({}, AllLocales[this.locale], this.customDictionary);
  }

  private get cleanFunction(): (str: string) => string {
    return this.customCleanFunction || this.defaultCleanFunction;
  }

  // locale functions
  public addLocale(newLocale: string, dict: { [word: string]: CensorTier }): void {
    AllLocales[newLocale] = dict;
  }

  public setLocale(locale: CensorLocale|string): void {
    this.locale = locale;
  }

  // tier functions
  public disableTier(tier: CensorTier): void {
    this.enabledTiers[tier] = false;
  }

  public enableTier(tier: CensorTier): void {
    this.enabledTiers[tier] = true;
  }

  // custom dict add/removal functions
  public addWord(word: string, tier: CensorTier = CensorTier.UserAdded): void {
    this.customDictionary[word] = tier;
    delete this.blackList[word];
  }

  public removeWord(word: string): void {
    delete this.customDictionary[word];
    this.blackList[word] = true;
  }

  // general phrase functions
  private prepareForParsing(phrase: string): string {
    return phrase.toLowerCase();
  }

  // profanity checking functions
  private _isProfane(word: string, dict: { [word: string]: CensorTier }): boolean {
    if(this.blackList[word]) return false;

    const wordTier = dict[word];

    if(!wordTier) return false;
    if(!this.enabledTiers[wordTier]) return false;

    return true;
  }

  public isProfane(phrase: string): boolean {
    const dict = this.currentDictionary;

    return this.prepareForParsing(phrase).split(' ').some(word => this._isProfane(word, dict));
  }

  private _isProfaneIsh(phrase: string, dict: { [word: string]: CensorTier }): boolean {
    let isAnyMatch = false;

    Object.keys(dict).forEach(dictWord => {
      if(isAnyMatch) return;
      if(this.blackList[dictWord]) return;

      const tier = dict[dictWord];

      if (phrase.indexOf(dictWord) !== -1 && this.enabledTiers[tier]) isAnyMatch = true;
    });

    return isAnyMatch;
  }

  public isProfaneIsh(phrase: string): boolean {
    const dict = this.currentDictionary;

    return this._isProfaneIsh(this.prepareForParsing(phrase), dict);
  }

  private _profaneIshWords(phrase: string, dict: { [word: string]: CensorTier }): string[] {
    const foundProfanity = [];

    Object.keys(dict).forEach(dictWord => {
      if(this.blackList[dictWord]) return;
      
      const tier = dict[dictWord];

      if(phrase.indexOf(dictWord) !== -1 && this.enabledTiers[tier]) foundProfanity.push(dictWord);
    });

    return foundProfanity;
  }

  public profaneIshWords(phrase: string) {
    const dict = this.currentDictionary;

    return this._profaneIshWords(phrase, dict);
  }

  public setCleanFunction(func: (str: string) => string): void {
    this.customCleanFunction = func;
  }

  public resetCleanFunction(): void {
    this.setCleanFunction(null);
  }

  // string cleanup functionality
  public cleanProfanity(phrase: string): string {
    const dict = this.currentDictionary;
    const cleanFunc = this.cleanFunction;

    const joinPhrase = phrase.split(' ').map(word => {
      if(!this._isProfane(word.toLowerCase(), dict)) return word;

      return cleanFunc(word);
    }).join(' ');

    return joinPhrase;
  }

  public cleanProfanityIsh(phrase: string): string {
    const cleanFunc = this.cleanFunction;

    const comparePhrase = this.prepareForParsing(phrase);
    const allProfanity = this.profaneIshWords(comparePhrase);

    allProfanity.forEach(word => {
      const regex = new RegExp(word, 'gi');
      phrase = phrase.replace(regex, cleanFunc(word));
    });

    return phrase;
  }

}
