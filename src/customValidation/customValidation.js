export function validateInputValue(value) {
  const keywords = value.trim().toLowerCase().split(" ");
  const uniqueKeyords = keywords.filter((word, index) => keywords.indexOf(word) === index);
  const regexCheck = /\s{2,}/g;
  if (!regexCheck.test(value) && (keywords.length === uniqueKeyords.length)) {
    return true;
  }
  return false;
}
