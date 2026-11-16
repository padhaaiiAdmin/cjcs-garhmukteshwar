export const environment = {
  production: true,
  /**
   * Where the enquiry forms POST their JSON payload.
   * Leave empty until a form backend is chosen (e.g. Formspree, Web3Forms,
   * Netlify Forms, a Google Apps Script web app, or the school's own API).
   * While empty, forms validate and show a success state, then offer
   * WhatsApp / phone so no enquiry is silently lost. See README → "Forms".
   */
  enquiryEndpoint: '',
  siteUrl: 'https://cjcsgarh.com',
};
