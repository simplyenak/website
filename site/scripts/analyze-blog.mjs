#!/usr/bin/env node

/**
 * Blog Quality Analyzer — deterministic checks for blog posts.
 *
 * Ports and adapts the best ideas from SAM (every-app/sam) analyzers:
 *   - Keyword analysis (occurrences, density, placement)
 *   - Readability (sentence/paragraph length, complex words)
 *   - Structure (heading hierarchy, links, long paragraphs)
 *   - Publish-readiness (process language, methodology notes, self-referential phrasing)
 *
 * Adapted for Simply Enak's YAML frontmatter format.
 *
 * Usage:
 *   node scripts/analyze-blog.mjs <file> [--keyword "primary keyword"]
 *   node scripts/analyze-blog.mjs src/data/post/my-post.md --keyword "malaysian street food"
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

// ──────────────────────────────────────────────
//  Parse arguments
// ──────────────────────────────────────────────

function parseArgs(args) {
  const result = { filePath: '', keyword: '' };
  for (let i = 0; i < args.length; i++) {
    if (!args[i]) continue;
    if (args[i] === '--keyword') {
      result.keyword = args[i + 1] ?? '';
      i++;
      continue;
    }
    if (!result.filePath) {
      result.filePath = args[i];
    }
  }
  return result;
}

// ──────────────────────────────────────────────
//  Frontmatter & body extraction
// ──────────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { frontmatter: {}, body: content.trim() };
  try {
    const frontmatter = yaml.load(match[1]) || {};
    return { frontmatter, body: content.slice(match[0].length).trim() };
  } catch {
    return { frontmatter: {}, body: content.trim() };
  }
}

// ──────────────────────────────────────────────
//  Markdown utilities
// ──────────────────────────────────────────────

function getWords(text) {
  return text.match(/[A-Za-z0-9\u00C0-\u024F][A-Za-z0-9\u00C0-\u024F'-]*/g) ?? [];
}

function getWordCount(text) {
  return getWords(text).length;
}

function getSentences(text) {
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function getParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
}

function getHeadings(text) {
  const headings = [];
  let inFence = false;
  for (const line of text.split('\n')) {
    const trimmed = line.trimStart();
    if (/^(```|~~~)/.test(trimmed)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (m) {
      headings.push({ level: m[1].length, text: m[2].trim() });
    }
  }
  return headings;
}

function countLinks(text) {
  const links = [...text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(m => ({
    text: m[1],
    url: m[2],
  }));
  const internal = links.filter(l => l.url.startsWith('/') || l.url.startsWith('#'));
  const external = links.filter(l => /^https?:\/\//i.test(l.url));
  return { total: links.length, internal: internal.length, external: external.length, links };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function firstNWords(text, n) {
  return getWords(text).slice(0, n).join(' ');
}

// ──────────────────────────────────────────────
//  Keyword Analysis
// ──────────────────────────────────────────────

export function analyzeKeyword(body, frontmatter, keyword) {
  if (!keyword || !keyword.trim()) return null;

  const normalized = keyword.trim().toLowerCase();
  const totalWords = Math.max(getWordCount(body), 1);
  const pattern = new RegExp(`(^|[^A-Za-z0-9])${escapeRegex(normalized).replace(/\s+/g, '\\s+')}(?=$|[^A-Za-z0-9])`, 'gi');
  const occurrences = (body.match(pattern) || []).length;
  const density = Number(((occurrences / totalWords) * 100).toFixed(2));

  const headings = getHeadings(body);
  const h1 = headings.find(h => h.level === 1)?.text ?? frontmatter.title ?? '';
  const metaTitle = frontmatter.metadata?.title ?? frontmatter.title ?? '';
  const metaDescription = frontmatter.metadata?.description ?? frontmatter.excerpt ?? '';

  const inTitle = h1.toLowerCase().includes(normalized);
  const inFirst100 = firstNWords(body, 100).toLowerCase().includes(normalized);
  const inMetaTitle = metaTitle.toLowerCase().includes(normalized);
  const inMetaDescription = metaDescription.toLowerCase().includes(normalized);
  const h2Matches = headings.filter(h => h.level === 2 && h.text.toLowerCase().includes(normalized)).length;

  // Check keyword usage per heading level
  const kwInHeadings = headings
    .filter(h => h.text.toLowerCase().includes(normalized))
    .map(h => ({ level: h.level, text: h.text }));

  return {
    keyword,
    occurrences,
    density,
    inTitle,
    inFirst100,
    inMetaTitle,
    inMetaDescription,
    h2Matches,
    kwInHeadings,
    // Self-assessment
    score: calculateKeywordScore({ inTitle, inFirst100, inMetaTitle, inMetaDescription, h2Matches, density, occurrences }),
    issues: generateKeywordIssues({ inTitle, inFirst100, inMetaTitle, inMetaDescription, h2Matches, density, occurrences }),
  };
}

function calculateKeywordScore(k) {
  let score = 0;
  if (k.inTitle) score += 20;
  if (k.inFirst100) score += 20;
  if (k.inMetaTitle) score += 15;
  if (k.inMetaDescription) score += 15;
  if (k.h2Matches >= 2) score += 15;
  else if (k.h2Matches >= 1) score += 8;
  if (k.density >= 0.5 && k.density <= 2.5) score += 15;
  else if (k.density < 0.5 && k.occurrences > 0) score += 5;
  return score; // /100
}

function generateKeywordIssues(k) {
  const issues = [];
  if (!k.inTitle) issues.push('Primary keyword missing from H1/title.');
  if (!k.inFirst100) issues.push('Primary keyword missing from first 100 words.');
  if (!k.inMetaTitle) issues.push('Primary keyword missing from meta title.');
  if (!k.inMetaDescription) issues.push('Primary keyword missing from meta description.');
  if (k.h2Matches === 0) issues.push('Primary keyword does not appear in any H2 heading.');
  if (k.density > 2.5) issues.push(`Keyword density is high (${k.density}%). Consider reducing usage.`);
  if (k.density === 0) issues.push('Primary keyword does not appear in the body text.');
  return issues;
}

// ──────────────────────────────────────────────
//  Readability Analysis
// ──────────────────────────────────────────────

const COMMON_LONG_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'as', 'you', 'do', 'at', 'this', 'but',
  'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an',
  'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'out',
  'about', 'who', 'get', 'which', 'when', 'make', 'can', 'like', 'time',
  'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good',
  'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
  'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
  'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new',
  'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
]);

export function analyzeReadability(body) {
  const words = getWordCount(body);
  const sentences = getSentences(body);
  const paragraphs = getParagraphs(body);

  const avgSentenceLen = sentences.length ? Number((words / sentences.length).toFixed(1)) : 0;
  const avgParagraphLen = paragraphs.length ? Number((sentences.length / paragraphs.length).toFixed(1)) : 0;

  // Complex words: 10+ chars and not in common list
  const allWords = getWords(body);
  const complexWords = allWords.filter(w => {
    const normalized = w.toLowerCase();
    return normalized.length >= 10 && !COMMON_LONG_WORDS.has(normalized);
  }).length;

  const longSentences = sentences.filter(s => wordCount(s) >= 25).length;
  const veryLongSentences = sentences.filter(s => wordCount(s) >= 35).length;
  const shortSentences = sentences.filter(s => wordCount(s) <= 8).length;

  // Sentence length variance (burstiness signal)
  const sentenceLengths = sentences.map(s => wordCount(s));
  const avgLen = sentenceLengths.length
    ? sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length
    : 0;
  const variance = sentenceLengths.length
    ? Math.sqrt(sentenceLengths.reduce((sum, len) => sum + (len - avgLen) ** 2, 0) / sentenceLengths.length)
    : 0;

  return {
    words,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    averageSentenceLength: avgSentenceLen,
    averageParagraphSentences: avgParagraphLen,
    complexWordRate: words ? Number(((complexWords / words) * 100).toFixed(1)) : 0,
    longSentences,
    veryLongSentences,
    shortSentences,
    sentenceLengthStdDev: Number(variance.toFixed(1)),
    score: calculateReadabilityScore(avgSentenceLen, longSentences, words, paragraphs),
    issues: generateReadabilityIssues(avgSentenceLen, longSentences, words, paragraphs),
  };
}

function wordCount(text) {
  return getWords(text).length;
}

function calculateReadabilityScore(avgSentenceLen, longSentences, totalWords, paragraphs) {
  let score = 100;
  if (avgSentenceLen > 20) score -= (avgSentenceLen - 20) * 3;
  if (avgSentenceLen < 10) score -= (10 - avgSentenceLen) * 2;
  score -= longSentences * 2;
  const longParas = paragraphs.filter(p => wordCount(p) >= 120).length;
  score -= longParas * 3;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function generateReadabilityIssues(avgSentenceLen, longSentences, totalWords, paragraphs) {
  const issues = [];
  if (avgSentenceLen > 22) issues.push(`Average sentence length is ${avgSentenceLen} words (target: 15-20).`);
  if (avgSentenceLen < 12) issues.push(`Average sentence length is ${avgSentenceLen} words — may feel choppy (target: 15-20).`);
  if (longSentences > 0) issues.push(`${longSentences} sentence(s) are 25+ words. Consider splitting.`);
  const longParas = paragraphs.filter(p => wordCount(p) >= 120).length;
  if (longParas > 0) issues.push(`${longParas} paragraph(s) exceed 120 words. Break them up.`);
  return issues;
}

// ──────────────────────────────────────────────
//  Structure Analysis
// ──────────────────────────────────────────────

export function analyzeStructure(body, frontmatter) {
  const headings = getHeadings(body);
  const links = countLinks(body);
  const paragraphs = getParagraphs(body);

  const h1Count = headings.filter(h => h.level === 1).length;
  const h2Count = headings.filter(h => h.level === 2).length;
  const h3Count = headings.filter(h => h.level === 3).length;

  // Detect heading level jumps
  const headingIssues = [];
  let lastLevel = 0;
  for (const h of headings) {
    if (lastLevel && h.level > lastLevel + 1) {
      headingIssues.push(`Heading jumps from H${lastLevel} to H${h.level} at "${h.text}".`);
    }
    lastLevel = h.level;
  }
  if (h1Count === 0 && !frontmatter.title) headingIssues.push('Missing H1 heading.');
  if (h1Count > 1) headingIssues.push(`Found ${h1Count} H1 headings (should be exactly 1).`);

  const longParagraphs = paragraphs.filter(p => wordCount(p) >= 120).length;
  const veryLongParagraphs = paragraphs.filter(p => wordCount(p) >= 200).length;

  // Internal link distribution (cluster detection)
  const paraBoundaries = [];
  const paras = getParagraphs(body);
  for (let i = 0; i < paras.length; i++) {
    const paraLinks = countLinks(paras[i]);
    if (paraLinks.total > 0) paraBoundaries.push({ paragraph: i + 1, links: paraLinks.total });
  }

  return {
    h1Count: h1Count || (frontmatter.title ? 1 : 0),
    h2Count,
    h3Count,
    totalHeadings: headings.length,
    headingIssues,
    longParagraphs,
    veryLongParagraphs,
    internalLinks: links.internal,
    externalLinks: links.external,
    totalLinks: links.total,
    linkDistribution: paraBoundaries,
    metadata: {
      title: frontmatter.title ?? '',
      description: frontmatter.excerpt ?? frontmatter.metadata?.description ?? '',
      image: frontmatter.image ?? '',
      category: frontmatter.category ?? '',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      author: frontmatter.author ?? '',
      publishDate: frontmatter.publishDate ?? '',
    },
    score: calculateStructureScore({ h1Count, h2Count, headingIssues, links, longParagraphs }),
    issues: generateStructureIssues({ h1Count, headingIssues, links, longParagraphs }),
  };
}

function calculateStructureScore(s) {
  let score = 100;
  if (s.h1Count !== 1) score -= 15;
  score -= s.headingIssues.length * 5;
  if (s.links.internal < 3) score -= 10;
  if (s.links.external < 2) score -= 8;
  if (s.links.internal < 1) score -= 7;
  score -= s.longParagraphs * 3;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function generateStructureIssues(s) {
  const issues = [];
  if (s.h1Count !== 1) issues.push(`Expected 1 H1, found ${s.h1Count}.`);
  issues.push(...s.headingIssues);
  if (s.links.internal < 3) issues.push(`Only ${s.links.internal} internal link(s). Target 3-10.`);
  if (s.links.external < 2) issues.push(`Only ${s.links.external} external link(s). Target 3+.`);
  if (s.links.internal < 1 && s.links.external < 1) issues.push('No links found at all.');
  if (s.longParagraphs > 0) issues.push(`${s.longParagraphs} paragraph(s) exceed 120 words.`);
  return issues;
}

// ──────────────────────────────────────────────
//  Publish-Readiness Analysis
// ──────────────────────────────────────────────

const PROCESS_PATTERNS = [
  { pattern: /\bthis (guide|article|roundup)\b/i, label: 'self-referential phrasing ("this guide/article")' },
  { pattern: /\bat the time of writing\b/i, label: '"at the time of writing"' },
  { pattern: /\b(inclusion bar|star bar|star filter)\b/i, label: 'selection-threshold language' },
  { pattern: /\b\d+\+\s*(github\s+)?stars?\b/i, label: 'GitHub star-threshold language' },
  { pattern: /\bi (used|chose|picked|left out|excluded)\b/i, label: 'writer-process language' },
  { pattern: /\bcurated shortlist\b/i, label: '"curated shortlist"' },
  { pattern: /\bmethodolog(?:y|ical)\b/i, label: 'methodology language' },
  { pattern: /\bexclusions?\b/i, label: 'exclusion language' },
  { pattern: /\bin today('s|\s+) digital (landscape|world|age)\b/i, label: '"in today\'s digital landscape"' },
  { pattern: /\bdive deep\b/i, label: '"dive deep"' },
  { pattern: /\b(it's|it is) important to note\b/i, label: '"it\'s important to note"' },
  { pattern: /\bnavigate the complexities?\b/i, label: '"navigate the complexity"' },
  { pattern: /\bunlock the potential\b/i, label: '"unlock the potential"' },
  { pattern: /\bharness the power\b/i, label: '"harness the power"' },
  { pattern: /\b(game.?changer|revolutionize|cutting.?edge)\b/i, label: 'overhyped language' },
  { pattern: /\bleverage\b(?!\s*(financial|debt|ratio|fund))/i, label: '"leverage" as buzzword' },
  { pattern: /\bembark (on|upon)\b/i, label: '"embark on"' },
];

const META_HEADING_PATTERN = /(how i chose|methodolog|inclusion|why .* not in|what .* left out|exclusions?|selection process)/i;

export function analyzePublishReadiness(body) {
  const intro = getIntro(body);
  const headings = getHeadings(body);
  const introWordsBeforeFirstH2 = getWordCount(intro);
  const introPatterns = collectMatches(firstNWords(body, 150));
  const bodyPatterns = collectMatches(body);
  const metaHeadings = headings
    .filter(h => h.level >= 2 && META_HEADING_PATTERN.test(h.text))
    .map(h => h.text);

  const issues = [];
  const wins = [];

  if (introWordsBeforeFirstH2 > 220) {
    issues.push(`Intro runs ${introWordsBeforeFirstH2} words before the first H2. Get to the answer faster.`);
  }
  if (introPatterns.length >= 2 || (introPatterns.length > 0 && introWordsBeforeFirstH2 > 160)) {
    issues.push(`Intro uses process/methodology language (${introPatterns.join(', ')}). Rewrite around the reader's problem.`);
  }
  if (metaHeadings.length > 0) {
    issues.push(`Sections read like internal notes: ${metaHeadings.map(h => `"${h}"`).join(', ')}.`);
  }
  if (bodyPatterns.length >= 3) {
    issues.push(`Repeated methodology/exclusion language (${bodyPatterns.join(', ')}). Keep notes internal.`);
  }

  if (introWordsBeforeFirstH2 > 0 && introWordsBeforeFirstH2 <= 140) {
    wins.push(`Intro gets to first H2 in ${introWordsBeforeFirstH2} words.`);
  }
  if (metaHeadings.length === 0 && bodyPatterns.length === 0) {
    wins.push('No methodology or exclusion sections detected.');
  }

  return {
    introWordsBeforeFirstH2,
    introPatterns,
    bodyPatterns,
    metaHeadings,
    wins,
    issues,
    score: calculateReadinessScore(introWordsBeforeFirstH2, metaHeadings.length, bodyPatterns.length),
  };
}

function calculateReadinessScore(introWords, metaHeadings, bodyPatterns) {
  let score = 100;
  if (introWords > 220) score -= 15;
  else if (introWords > 160) score -= 5;
  score -= metaHeadings * 10;
  score -= bodyPatterns * 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function collectMatches(text) {
  return [...new Set(
    PROCESS_PATTERNS
      .filter(p => p.pattern.test(text))
      .map(p => p.label)
  )];
}

function getIntro(content) {
  const lines = content.split('\n');
  const firstH2 = lines.findIndex(line => /^##\s+/.test(line));
  return (firstH2 === -1 ? lines : lines.slice(0, firstH2)).join('\n').trim();
}

// ──────────────────────────────────────────────
//  Frontmatter Quality Analysis
// ──────────────────────────────────────────────

export function analyzeFrontmatter(frontmatter) {
  const issues = [];
  const wins = [];

  const title = frontmatter.title ?? frontmatter.metadata?.title ?? '';
  const description = frontmatter.metadata?.description ?? frontmatter.excerpt ?? '';
  const image = frontmatter.image ?? '';

  if (!title) {
    issues.push('Missing title.');
  } else if (title.length > 70) {
    issues.push(`Title is ${title.length} characters — may truncate in SERPs (target: 40-60).`);
  } else if (title.length < 25) {
    issues.push(`Title is short (${title.length} chars). Consider more descriptive title (target: 40-60).`);
  } else {
    wins.push(`Title length: ${title.length} chars (good).`);
  }

  if (!description) {
    issues.push('Missing meta description.');
  } else if (description.length > 165) {
    issues.push(`Meta description is ${description.length} chars — may truncate (target: 150-160).`);
  } else if (description.length < 120) {
    issues.push(`Meta description is short (${description.length} chars). Target 150-160.`);
  } else {
    wins.push(`Meta description: ${description.length} chars (good range).`);
  }

  if (!image) {
    issues.push('Missing cover image.');
  } else {
    wins.push('Cover image present.');
  }

  if (!frontmatter.category) {
    issues.push('Missing category.');
  }

  const tags = frontmatter.tags;
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    issues.push('Missing or empty tags.');
  } else if (tags.length < 2) {
    issues.push(`Only ${tags.length} tag(s). Target 3-5.`);
  } else {
    wins.push(`${tags.length} tags present.`);
  }

  if (!frontmatter.author) {
    issues.push('Missing author attribution.');
  }

  return {
    issues,
    wins,
    score: 100 - issues.length * 12,
  };
}

// ──────────────────────────────────────────────
//  Main Analysis Pipeline
// ──────────────────────────────────────────────

function analyzeBlogPost(filePath, keyword) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);
  const absolutePath = path.resolve(filePath);

  // Run all analyzers
  const keywordReport = analyzeKeyword(body, frontmatter, keyword);
  const readability = analyzeReadability(body);
  const structure = analyzeStructure(body, frontmatter);
  const publishReadiness = analyzePublishReadiness(body);
  const frontmatterReport = analyzeFrontmatter(frontmatter);

  // Build summary
  const allIssues = [
    ...(keywordReport?.issues ?? []),
    ...readability.issues,
    ...structure.issues,
    ...publishReadiness.issues,
    ...frontmatterReport.issues,
  ];

  const allWins = [
    ...(keywordReport && keywordReport.score >= 60 ? [`Keyword placement: ${keywordReport.score}/100`] : []),
    ...readability.score >= 70 ? [`Readability: ${readability.score}/100`] : [],
    ...structure.score >= 70 ? [`Structure: ${structure.score}/100`] : [],
    ...publishReadiness.score >= 70 ? [`Publish-readiness: ${publishReadiness.score}/100`] : [],
    ...frontmatterReport.score >= 70 ? [`Frontmatter: ${frontmatterReport.score}/100`] : [],
    ...publishReadiness.wins,
  ];

  const totalScore = Math.round((
    (keywordReport?.score ?? 0) +
    readability.score +
    structure.score +
    publishReadiness.score +
    frontmatterReport.score
  ) / 5);

  const rating = totalScore >= 90 ? 'Exceptional' :
    totalScore >= 80 ? 'Strong' :
    totalScore >= 70 ? 'Acceptable' :
    totalScore >= 60 ? 'Below Standard' :
    'Rewrite';

  return {
    file: absolutePath,
    title: frontmatter.title ?? path.basename(filePath),
    score: totalScore,
    rating,
    breakdown: {
      keyword: { score: keywordReport?.score ?? 0, max: 100 },
      readability: { score: readability.score, max: 100 },
      structure: { score: structure.score, max: 100 },
      publishReadiness: { score: publishReadiness.score, max: 100 },
      frontmatter: { score: frontmatterReport.score, max: 100 },
    },
    keyword: keywordReport ? {
      keyword: keywordReport.keyword,
      occurrences: keywordReport.occurrences,
      density: keywordReport.density,
      inTitle: keywordReport.inTitle,
      inFirst100: keywordReport.inFirst100,
      inMetaTitle: keywordReport.inMetaTitle,
      inMetaDescription: keywordReport.inMetaDescription,
      h2Matches: keywordReport.h2Matches,
      kwInHeadings: keywordReport.kwInHeadings,
    } : null,
    readability: {
      words: readability.words,
      sentenceCount: readability.sentenceCount,
      paragraphCount: readability.paragraphCount,
      averageSentenceLength: readability.averageSentenceLength,
      averageParagraphSentences: readability.averageParagraphSentences,
      complexWordRate: readability.complexWordRate,
      longSentences: readability.longSentences,
      veryLongSentences: readability.veryLongSentences,
      shortSentences: readability.shortSentences,
      sentenceLengthStdDev: readability.sentenceLengthStdDev,
    },
    structure: {
      h1Count: structure.h1Count,
      h2Count: structure.h2Count,
      h3Count: structure.h3Count,
      headingIssues: structure.headingIssues,
      longParagraphs: structure.longParagraphs,
      veryLongParagraphs: structure.veryLongParagraphs,
      internalLinks: structure.internalLinks,
      externalLinks: structure.externalLinks,
      totalLinks: structure.totalLinks,
      linkDistribution: structure.linkDistribution,
    },
    frontmatter: {
      title: frontmatter.title ?? '',
      titleLength: (frontmatter.title ?? '').length,
      descriptionLength: (frontmatter.metadata?.description ?? frontmatter.excerpt ?? '').length,
      hasImage: !!frontmatter.image,
      category: frontmatter.category ?? '',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      author: frontmatter.author ?? '',
    },
    publishReadiness: {
      introWordsBeforeFirstH2: publishReadiness.introWordsBeforeFirstH2,
      processPatterns: publishReadiness.bodyPatterns,
      metaHeadings: publishReadiness.metaHeadings,
    },
    issues: allIssues,
    wins: allWins,
    fatal: allIssues.filter(i =>
      i.includes('Missing') ||
      i.includes('no links') ||
      i.includes('keyword missing') ||
      i.includes('0 link')
    ),
    summary: buildSummaryBlock(allIssues, allWins, totalScore, rating, keyword),
  };
}

function buildSummaryBlock(issues, wins, score, rating, keyword) {
  const lines = [];
  lines.push(`Score: ${score}/100 — ${rating}`);
  lines.push('');
  if (wins.length > 0) {
    lines.push('Wins:');
    wins.forEach(w => lines.push(`  + ${w}`));
    lines.push('');
  }
  if (issues.length > 0) {
    lines.push(`Issues (${issues.length}):`);
    issues.slice(0, 10).forEach(i => lines.push(`  - ${i}`));
    if (issues.length > 10) lines.push(`  ... and ${issues.length - 10} more`);
  }
  return lines.join('\n');
}

// ──────────────────────────────────────────────
//  CLI
// ──────────────────────────────────────────────

const { filePath, keyword } = parseArgs(process.argv.slice(2));

if (!filePath) {
  console.error(`Usage: node scripts/analyze-blog.mjs <file> [--keyword "primary keyword"]`);
  console.error(`       node scripts/analyze-blog.mjs src/data/post/my-post.md --keyword "malaysian street food"`);
  process.exit(1);
}

const result = analyzeBlogPost(filePath, keyword);
console.log(JSON.stringify(result, null, 2));
