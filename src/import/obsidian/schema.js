import path from 'node:path';
import {
  ALLOWED_METADATA_FIELDS,
  APPROVED_READY_DIR,
  DEFAULT_AUTHOR,
  MIN_CONTENT_CHARACTERS,
} from './constants.js';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const KEBAB_CASE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function normalizeSourcePath(filePath) {
  return String(filePath ?? '')
    .replaceAll('\\', '/')
    .replace(/^\/+/, '')
    .replace(/^\.\//, '');
}

export function isPublishReadyNotePath(filePath) {
  const normalized = normalizeSourcePath(filePath);
  return normalized.startsWith(APPROVED_READY_DIR) && /\.(md|mdx)$/i.test(normalized);
}

function createReason(code, field, message) {
  return { code, field, message };
}

function fieldCode(field) {
  return field.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function parseIsoDate(value, field) {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) {
    return {
      reason: createReason(
        `invalid-${fieldCode(field)}`,
        field,
        `${field} must use YYYY-MM-DD ISO date format.`,
      ),
    };
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) {
    return {
      reason: createReason(
        `invalid-${fieldCode(field)}`,
        field,
        `${field} must be a real calendar date.`,
      ),
    };
  }

  return { value };
}

function normalizeTags(tags, reasons) {
  if (tags === undefined) {
    return [];
  }

  if (!Array.isArray(tags)) {
    reasons.push(createReason('invalid-tags', 'tags', 'tags must be an array of non-empty strings.'));
    return [];
  }

  const normalizedTags = [];

  for (const tag of tags) {
    if (typeof tag !== 'string' || tag.trim().length === 0) {
      reasons.push(createReason('invalid-tags', 'tags', 'tags must be an array of non-empty strings.'));
      return [];
    }

    normalizedTags.push(tag.trim());
  }

  return normalizedTags;
}

function normalizeOptionalString(value, field, reasons) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    reasons.push(
      createReason(
        `invalid-${fieldCode(field)}`,
        field,
        `${field} must be a non-empty string when provided.`,
      ),
    );
    return undefined;
  }

  return value.trim();
}

export function validatePublishReadyNote(note, { importedAt } = {}) {
  const reasons = [];
  const normalizedPath = normalizeSourcePath(note.path);
  const metadata = isPlainObject(note.metadata) ? note.metadata : {};

  if (!isPlainObject(note.metadata)) {
    reasons.push(createReason('invalid-metadata', 'metadata', 'Metadata must be an object.'));
  }

  for (const field of Object.keys(metadata)) {
    if (!ALLOWED_METADATA_FIELDS.has(field)) {
      reasons.push(createReason('unknown-field', field, `${field} is not allowed in strict import mode.`));
    }
  }

  const title = normalizeOptionalString(metadata.title, 'title', reasons);
  const description = normalizeOptionalString(metadata.description, 'description', reasons);
  if (description && description.length < 10) {
    reasons.push(createReason('description-too-short', 'description', 'description must be at least 10 characters.'));
  }

  const author = typeof metadata.author === 'string' && metadata.author.trim().length > 0
    ? metadata.author.trim()
    : DEFAULT_AUTHOR;

  const pubDate = parseIsoDate(metadata.pubDate, 'pubDate');
  if (pubDate.reason) {
    reasons.push(pubDate.reason);
  }

  const updatedDate = metadata.updatedDate === undefined
    ? { value: undefined }
    : parseIsoDate(metadata.updatedDate, 'updatedDate');
  if (updatedDate.reason) {
    reasons.push(updatedDate.reason);
  }

  const slug = normalizeOptionalString(metadata.slug, 'slug', reasons);
  if (slug && !KEBAB_CASE_PATTERN.test(slug)) {
    reasons.push(createReason('invalid-slug', 'slug', 'slug must be kebab-case.'));
  }

  const heroImage = normalizeOptionalString(metadata.heroImage, 'heroImage', reasons);
  const heroImageAlt = normalizeOptionalString(metadata.heroImageAlt, 'heroImageAlt', reasons);
  const tags = normalizeTags(metadata.tags, reasons);

  const featured = metadata.featured === undefined ? false : metadata.featured;
  if (typeof featured !== 'boolean') {
    reasons.push(createReason('invalid-featured', 'featured', 'featured must be a boolean when provided.'));
  }

  const body = typeof note.body === 'string' ? note.body.trim() : '';
  if (body.replace(/\s+/g, ' ').length < MIN_CONTENT_CHARACTERS) {
    reasons.push(
      createReason(
        'too-short-content',
        'body',
        `body must be at least ${MIN_CONTENT_CHARACTERS} non-whitespace characters.`,
      ),
    );
  }

  if (reasons.length > 0) {
    return {
      ok: false,
      skip: {
        path: normalizedPath,
        reasons,
      },
    };
  }

  return {
    ok: true,
    post: {
      title,
      description,
      author,
      pubDate: pubDate.value,
      updatedDate: updatedDate.value,
      heroImage,
      heroImageAlt,
      tags,
      featured,
      slug,
      sourceFile: normalizedPath,
      importedAt: importedAt?.toISOString() ?? new Date().toISOString(),
      body,
      extension: path.posix.extname(normalizedPath).toLowerCase() === '.mdx' ? '.mdx' : '.md',
    },
  };
}
