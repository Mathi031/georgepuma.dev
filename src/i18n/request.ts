import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// Sin messages: el copy vive en src/content por locale; next-intl solo
// hace routing (middleware, pathnames, Link).
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // NextIntlClientProvider exige messages aunque estén vacíos.
  return { locale, messages: {} };
});
