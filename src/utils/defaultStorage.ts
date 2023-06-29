import { getLocales } from "expo-localization";

export const defaultAppLanguage = getLocales()[0].languageCode;

export const genders = ["Woman", "Man", "Transgender", "Non-Binary", "Prefer not to state"]

export const defaultMatchingConfig = {
  from: 18,
  to: 18,
  lang: defaultAppLanguage,
  genders: genders,
}

export default {
  defaultAppLanguage,
  genders,
  defaultMatchingConfig
}