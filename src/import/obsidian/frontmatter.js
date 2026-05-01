function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // fall through to string handling
    }
  }

  if (trimmed === 'true') {
    return true;
  }

  if (trimmed === 'false') {
    return false;
  }

  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

export function parseFrontmatterDocument(document) {
  const raw = String(document ?? '');
  if (!raw.startsWith('---\n')) {
    return { metadata: {}, body: raw };
  }

  const lines = raw.split('\n');
  const metadata = {};
  let index = 1;

  while (index < lines.length) {
    const line = lines[index];
    if (line === '---') {
      index += 1;
      break;
    }

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const match = line.match(/^([A-Za-z0-9_]+):(?:\s+(.*))?$/);
    if (!match) {
      break;
    }

    const [, key, inlineValue = ''] = match;
    if (inlineValue.trim().length > 0) {
      metadata[key] = parseScalar(inlineValue);
      index += 1;
      continue;
    }

    const items = [];
    index += 1;
    while (index < lines.length) {
      const itemLine = lines[index];
      const itemMatch = itemLine.match(/^\s*-\s+(.*)$/);
      if (!itemMatch) {
        break;
      }

      items.push(parseScalar(itemMatch[1]));
      index += 1;
    }

    metadata[key] = items;
  }

  return {
    metadata,
    body: lines.slice(index).join('\n').replace(/^\n+/, ''),
  };
}
