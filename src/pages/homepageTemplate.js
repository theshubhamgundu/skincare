import source from '../../code.html?raw';

const bodyMarkup = source.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? '';

export const homepageMarkup = bodyMarkup.replace(
  /<!-- BEGIN: CookieConsentModal -->[\s\S]*?<!-- END: CookieConsentModal -->/i,
  '',
);