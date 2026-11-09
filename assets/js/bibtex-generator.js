/* Shared normalization preserves the site's established BibTeX formatting. */
(() => {
  'use strict';

  const parseBibTex = (source) => {
    const bib = source.trim();
    const header = bib.match(/^@(\w+)\s*\{\s*([^,]+),/);
    if (!header) throw new Error('The source did not return a BibTeX entry.');
    const fields = {};
    const body = bib.slice(header[0].length, bib.lastIndexOf('}'));
    let position = 0;
    while (position < body.length) {
      while (/[\s,]/.test(body[position] || '') && position < body.length) position++;
      if (position === body.length) break;
      const key = body.slice(position).match(/^([\w-]+)\s*=\s*/);
      if (!key) throw new Error('Cannot read a BibTeX field.');
      position += key[0].length;
      const start = position;
      let depth = 0;
      let quoted = false;
      for (; position < body.length; position++) {
        const char = body[position];
        if (char === '\\') { position++; continue; }
        if (char === '"' && depth === 0) quoted = !quoted;
        if (char === '{') depth++;
        if (char === '}') depth--;
        if (char === ',' && depth === 0 && !quoted) break;
      }
      if (depth !== 0 || quoted) throw new Error('Unbalanced BibTeX field.');
      let value = body.slice(start, position).trim();
      if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('"') && value.endsWith('"'))) value = value.slice(1, -1);
      fields[key[1].toLowerCase()] = value;
      position++;
    }
    return { type: header[1], key: header[2].trim(), fields };
  };

  const formatBibTex = (bibtex) => {
    const parsed = typeof bibtex === 'string' ? parseBibTex(bibtex) : bibtex;
    const fields = Object.fromEntries(Object.entries(parsed.fields).map(([key, value]) => [key.toLowerCase(), String(value)]));
    const entries = Object.entries(fields).filter(([key]) => key !== 'month' && !(fields.doi?.trim() && key === 'url'));
    return `@${parsed.type}{${parsed.key},\n` + entries.map(([key, value]) => `  ${key} = {${value.replace(/–/g, '--')}}`).join(',\n') + '\n}';
  };

  const plainText = (html) => new DOMParser().parseFromString(html, 'text/html').body.textContent.replace(/\s+/g, ' ').trim();
  const citationKey = (name, year) => {
    const surname = name.includes(',') ? name.split(',')[0] : name.trim().split(/\s+/).pop();
    return surname.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-]/g, '') + year;
  };
  const request = async (url, options = {}) => {
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`The reference service returned HTTP ${response.status}. Check the reference and try again.`);
    return response;
  };

  const identify = (input) => {
    let value = input.trim();
    if (!value) throw new Error('Enter a DOI, arXiv ID, or article URL.');
    if (/^(?:www\.)?(?:arxiv\.org|export\.arxiv\.org|optimization-online\.org)\//i.test(value)) value = 'https://' + value;
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      const host = url.hostname.toLowerCase().replace(/^www\./, '');
      if (host === 'optimization-online.org') {
        const id = url.searchParams.get('p');
        if (id && /^\d+$/.test(id)) return { type: 'optimization', id };
        const slug = url.pathname.match(/^\/(?:\d{4}\/\d{2}\/)([^/]+)\/?$/)?.[1];
        if (slug) return { type: 'optimization', slug: decodeURIComponent(slug) };
        throw new Error('Use the Optimization Online article page or its ?p= reference, rather than the PDF link.');
      }
      if (host === 'arxiv.org' || host === 'export.arxiv.org') value = decodeURIComponent(url.pathname).replace(/^\/(abs|pdf|html)\//, '').replace(/\.pdf$/, '');
      else if (host === 'doi.org' || host === 'dx.doi.org') value = decodeURIComponent(url.pathname.slice(1));
      else throw new Error('Use a DOI, arXiv URL, or Optimization Online article URL.');
    }
    value = value.replace(/^arxiv:\s*/i, '').replace(/^doi:\s*/i, '');
    const arxiv = value.match(/^(\d{4}\.\d{4,5}|[a-z-]+(?:\.[A-Z]{2})?\/\d{7})(?:v\d+)?$/i);
    if (arxiv) return { type: 'arxiv', id: arxiv[1] };
    if (/^10\.\d{4,9}\/\S+$/i.test(value)) return { type: 'doi', id: value };
    throw new Error('That reference is not a recognized DOI or arXiv ID.');
  };

  const getDOI = async (doi) => (await request(`https://doi.org/${encodeURI(doi)}`, { headers: { Accept: 'application/x-bibtex' } })).text();

  const getArXiv = async (id) => {
    // arXiv's Atom and BibTeX endpoints do not permit browser CORS requests.
    // DataCite exposes arXiv's registered metadata through a CORS-enabled API.
    const data = (await (await request(`https://api.datacite.org/dois/10.48550/arXiv.${encodeURIComponent(id)}`)).json()).data?.attributes;
    if (!data?.titles?.length || !data.creators?.length) throw new Error('No arXiv citation metadata was found.');
    const authors = data.creators.map((author) => author.givenName && author.familyName ? `${author.givenName} ${author.familyName}` : author.name);
    const revisions = (data.dates || []).filter((date) => date.dateType === 'Submitted').map((date) => date.date).sort();
    const year = revisions.length ? revisions.at(-1).slice(0, 4) : data.publicationYear;
    const fields = { title: data.titles[0].title, author: authors.join(' and '), year, eprint: id, archiveprefix: 'arXiv' };
    const subject = data.subjects?.find((subject) => subject.subjectScheme === 'arXiv');
    const category = subject?.subject.match(/\(([^)]+)\)$/)?.[1];
    if (category) fields.primaryclass = category;
    if (data.doi) fields.doi = data.doi;
    fields.url = `https://arxiv.org/abs/${id}`;
    return { type: 'misc', key: citationKey(authors[0], year), fields };
  };

  const getOptimizationOnline = async (reference) => {
    const base = 'https://optimization-online.org/wp-json/wp/v2/';
    const endpoint = reference.id ? `posts/${reference.id}?_embed` : `posts?slug=${encodeURIComponent(reference.slug)}&_embed`;
    let post = await (await request(base + endpoint)).json();
    if (Array.isArray(post)) post = post[0];
    if (!post?.id || !post.title?.rendered) throw new Error('No Optimization Online article was found.');
    const terms = (post._embedded?.['wp:term'] || []).flat().filter((term) => term.taxonomy === 'author');
    // Preserve the source's coauthor ordering, not the taxonomy's display order.
    const ordered = post.coauthors?.length ? post.coauthors.map((id) => terms.find((term) => term.id === id)).filter(Boolean) : terms;
    const users = post._embedded?.author || [];
    const names = await Promise.all(ordered.map(async (term) => {
      const slug = term.slug.replace(/^cap-/, '');
      let user = users.find((user) => user.slug === slug);
      if (!user && !term.name.includes(' ')) {
        // Public post embeddings expose full display names even when the users
        // collection is disabled. Never guess missing spaces in account names.
        try {
          const posts = await (await request(`${base}posts?coauthors=${term.id}&per_page=10&_embed=author`)).json();
          user = posts.flatMap((item) => item._embedded?.author || []).find((author) => author.slug === slug);
        } catch { /* Retain the source's author label if enrichment is unavailable. */ }
      }
      const name = plainText(user?.name || term.name);
      return name.includes(' ') ? name : name.replace(/[._]/g, ' ').replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
    }));
    if (!names.length) throw new Error('The article has no coauthor metadata; a complete citation cannot be generated.');
    const year = (post.date || post.date_gmt || '').slice(0, 4);
    if (!/^\d{4}$/.test(year)) throw new Error('The article has no publication year.');
    return { type: 'misc', key: citationKey(names[0], year), fields: {
      title: plainText(post.title.rendered), author: names.join(' and '), year,
      archiveprefix: 'Optimization Online', url: `https://optimization-online.org/?p=${post.id}`
    } };
  };

  const generate = async (input) => {
    const ref = identify(input);
    const bib = ref.type === 'arxiv' ? await getArXiv(ref.id) : ref.type === 'optimization' ? await getOptimizationOnline(ref) : await getDOI(ref.id);
    return formatBibTex(bib);
  };
  // Exposed for regression checks without coupling them to the page's UI.
  window.BibtexGenerator = { parseBibTex, formatBibTex, identify, generate };

  const button = document.getElementById('bib-button');
  const input = document.getElementById('doi-entry');
  if (!button || !input) return;
  const output = document.getElementById('bib-output');
  const block = document.getElementById('bib-block');
  const status = document.getElementById('bib-status');
  button.addEventListener('click', async () => {
    button.disabled = true;
    block.style.display = 'block';
    output.textContent = 'Loading…';
    status.textContent = 'Looking up reference…';
    try {
      output.textContent = await generate(input.value);
      status.textContent = 'BibTeX ready.';
    } catch (error) {
      output.textContent = error.name === 'TimeoutError' ? 'The reference service took too long. Please try again.' : error.message;
      status.textContent = 'Could not generate BibTeX.';
    } finally { button.disabled = false; }
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !button.disabled) { event.preventDefault(); button.click(); }
  });
})();
