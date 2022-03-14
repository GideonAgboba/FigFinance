const slug = (string) => string.trim()
  .toLowerCase()
  .split("'")
  .join('')
  .split(' ')
  .join('-')
  .replace(new RegExp('/', 'g'), '-')

const slugify = (name, fingerprint) => {
  if (fingerprint) return `${slug(name)}-${fingerprint}`;
  return slug(name);
}

module.exports = slugify
