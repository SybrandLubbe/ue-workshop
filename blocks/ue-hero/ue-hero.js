export default function decorate(block) {
  const rows = Array.from(block.children);

  const imgRow = rows[0];
  const crumbsRow = rows[1];
  const titleRow = rows[2];
  const ctaRow = rows[3];

  // --- Image
  const picture = imgRow?.querySelector('picture') || imgRow?.querySelector('img')?.closest('picture');
  if (picture) {
    picture.setAttribute('data-aue-prop', 'image');
    picture.setAttribute('data-aue-type', 'media');
  }

  // --- Breadcrumbs
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'ue-hero-breadcrumbs';
  breadcrumbs.setAttribute('aria-label', 'Breadcrumb');
  breadcrumbs.setAttribute('data-aue-prop', 'breadcrumbs');
  breadcrumbs.setAttribute('data-aue-type', 'richtext');

  if (crumbsRow) {
    const frag = document.createDocumentFragment();
    Array.from(crumbsRow.childNodes).forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'P') {
        Array.from(n.childNodes).forEach((c) => frag.appendChild(c.cloneNode(true)));
      } else {
        frag.appendChild(n.cloneNode(true));
      }
    });

    // Auto-insert separators if none authored
    if (!frag.textContent.includes('›') && !frag.textContent.includes('/')) {
      const anchors = [...crumbsRow.querySelectorAll('a')];
      if (anchors.length) {
        while (frag.firstChild) frag.removeChild(frag.firstChild);
        anchors.forEach((a, i) => {
          const span = document.createElement('span');
          const link = document.createElement('a');
          link.href = a.href;
          link.textContent = a.textContent.trim();
          span.append(link);
          frag.append(span);
          if (i < anchors.length - 1) {
            const sep = document.createElement('span');
            sep.className = 'sep';
            sep.setAttribute('aria-hidden', 'true');
            sep.textContent = ' › ';
            frag.append(sep);
          }
        });
      }
    }
    breadcrumbs.append(frag);
  }

  // --- Title (force to h2)
  const titleEl = titleRow?.querySelector('h1,h2,h3,h4,h5,h6') || titleRow?.querySelector('*');
  const h2 = document.createElement('h2');
  h2.className = 'ue-hero-title';
  h2.textContent = (titleEl?.textContent || '').trim();
  h2.setAttribute('data-aue-prop', 'title');
  h2.setAttribute('data-aue-type', 'text');

  // --- CTA (robust: create one even if no <a> exists yet)
  let cta = ctaRow?.querySelector('a');
  const bottom = document.createElement('div');
  bottom.className = 'ue-hero-bottom';

  if (!cta) {
    // Build a placeholder button so it always shows up
    cta = document.createElement('a');
    cta.href = '#'; // UE will overwrite via data-aue-prop
    const span = document.createElement('span');
    const fallbackText = (ctaRow?.textContent || '').trim() || 'Learn more';
    span.textContent = fallbackText;
    cta.append(span);
  } else {
    // Normalize existing link into <a><span>Text</span></a>
    const span = document.createElement('span');
    span.textContent = cta.textContent.trim() || 'Learn more';
    cta.textContent = '';
    cta.append(span);
  }

  // Make it look like a button and be editable in UE
  cta.classList.add('button');
  cta.setAttribute('data-aue-prop', 'ctaLink');
  cta.setAttribute('data-aue-type', 'reference');
  const textSpan = cta.querySelector('span');
  textSpan.setAttribute('data-aue-prop', 'buttontext');
  textSpan.setAttribute('data-aue-type', 'text');
  bottom.append(cta);

  // --- Final structure
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'ue-hero-image-wrapper';
  if (picture) imageWrapper.append(picture);

  const top = document.createElement('div');
  top.className = 'ue-hero-top';
  top.append(breadcrumbs, h2);

  const inner = document.createElement('div');
  inner.className = 'ue-hero-inner';
  inner.append(top, bottom);

  block.setAttribute('data-aue-label', 'UE Hero');
  block.textContent = '';
  block.append(imageWrapper, inner);
}
