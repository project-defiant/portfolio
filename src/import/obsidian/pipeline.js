import { isPublishReadyNotePath, validatePublishReadyNote } from './schema.js';

export async function runObsidianImport({ source, materializer, importedAt = new Date() }) {
  const snapshot = await source.load();
  const consideredNotes = [];
  const ignoredPaths = [];

  for (const note of snapshot.notes ?? []) {
    if (isPublishReadyNotePath(note.path)) {
      consideredNotes.push(note);
    } else {
      ignoredPaths.push(note.path);
    }
  }

  const importedPosts = [];
  const skippedPosts = [];

  for (const note of consideredNotes) {
    const validation = validatePublishReadyNote(note, { importedAt });
    if (validation.ok) {
      importedPosts.push(validation.post);
    } else {
      skippedPosts.push(validation.skip);
    }
  }

  const report = {
    repo: snapshot.repo,
    fetchedAt: snapshot.fetchedAt ?? null,
    importedAt: importedAt.toISOString(),
    ignoredPaths,
    skippedPosts,
    importedPosts: importedPosts.map(({ slug, sourceFile, pubDate, updatedDate }) => ({
      slug,
      sourceFile,
      pubDate,
      updatedDate: updatedDate ?? null,
    })),
    stats: {
      discovered: snapshot.notes?.length ?? 0,
      considered: consideredNotes.length,
      imported: importedPosts.length,
      skipped: skippedPosts.length,
    },
  };

  const materialized = await materializer.writeImportArtifacts({
    posts: importedPosts,
    report,
  });

  return {
    ignoredPaths,
    skippedPosts,
    importedPosts,
    stats: report.stats,
    materialized,
    report,
  };
}
