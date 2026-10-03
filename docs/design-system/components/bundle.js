/* @ds-bundle: {"format":4,"namespace":"RF","components":[{"name":"Button"},{"name":"Tag"},{"name":"StatusBadge"},{"name":"SectionHeading"},{"name":"StatCard"},{"name":"ProjectCard"},{"name":"TextField"},{"name":"NavBar"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }
  function omit(obj, keys) {
    var o = {};
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && keys.indexOf(k) < 0) o[k] = obj[k];
    return o;
  }

  /* Arrow that flips in RTL via CSS (.rf-flip) */
  function Arrow() {
    return h('svg', { className: 'rf-icon rf-flip', width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': 'true' },
      h('path', { d: 'M3 8h10M9 4l4 4-4 4', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'square' }));
  }

  function Button(props) {
    var variant = props.variant || 'secondary';
    var size = props.size || 'md';
    var rest = omit(props, ['variant', 'size', 'arrow', 'className', 'children', 'href']);
    var cls = cx('rf-btn', 'rf-btn--' + variant, size === 'sm' && 'rf-btn--sm', props.className);
    var kids = [h('span', { key: 'l' }, props.children), props.arrow ? h(Arrow, { key: 'a' }) : null];
    if (props.href) return h('a', Object.assign({ href: props.href, className: cls }, rest), kids);
    return h('button', Object.assign({ type: 'button', className: cls }, rest), kids);
  }

  function Tag(props) {
    var rest = omit(props, ['selected', 'className', 'children', 'onClick']);
    var cls = cx('rf-tag', props.selected && 'rf-tag--selected', props.className);
    if (props.onClick) return h('button', Object.assign({ type: 'button', className: cls, 'aria-pressed': !!props.selected, onClick: props.onClick }, rest), props.children);
    return h('span', Object.assign({ className: cls }, rest), props.children);
  }

  function StatusBadge(props) {
    var tone = props.tone || 'success';
    return h('span', { className: cx('rf-status', 'rf-status--' + tone, props.className) },
      h('span', { className: 'rf-status__dot', 'aria-hidden': 'true' }),
      props.children);
  }

  function SectionHeading(props) {
    var Tag_ = 'h' + (props.level || 2);
    return h('header', { className: cx('rf-sh', props.align === 'center' && 'rf-sh--center', props.className) },
      props.eyebrow ? h('p', { className: 'rf-eyebrow' }, props.index ? h('span', { className: 'rf-eyebrow__idx' }, props.index + ' / ') : null, props.eyebrow) : null,
      h(Tag_, { className: 'rf-sh__title' }, props.title),
      props.description ? h('p', { className: 'rf-sh__desc' }, props.description) : null);
  }

  function StatCard(props) {
    return h('div', { className: cx('rf-stat', props.className) },
      h('p', { className: 'rf-stat__value' }, props.value, props.unit ? h('span', { className: 'rf-stat__unit' }, props.unit) : null),
      h('p', { className: 'rf-stat__label' }, props.label));
  }

  function ProjectCard(props) {
    var tags = props.tags || [];
    var inner = [
      props.image
        ? h('div', { key: 'm', className: 'rf-pc__media' }, h('img', { src: props.image, alt: props.imageAlt || '' }))
        : h('div', { key: 'm', className: 'rf-pc__media rf-pc__media--empty', 'aria-hidden': 'true' }, h('span', null, props.monogram || (props.title || '').slice(0, 2))),
      h('div', { key: 'b', className: 'rf-pc__body' },
        h('div', { className: 'rf-pc__meta' },
          props.kind ? h('span', null, props.kind) : null,
          props.year ? h('span', null, props.year) : null),
        h('h3', { className: 'rf-pc__title' }, props.title, props.href ? h(Arrow) : null),
        props.description ? h('p', { className: 'rf-pc__desc' }, props.description) : null,
        tags.length ? h('ul', { className: 'rf-pc__tags' }, tags.map(function (t) { return h('li', { key: t }, h(Tag, null, t)); })) : null)
    ];
    if (props.href) return h('a', { href: props.href, className: cx('rf-pc', 'rf-pc--link', props.className) }, inner);
    return h('article', { className: cx('rf-pc', props.className) }, inner);
  }

  var fieldSeq = 0;
  function TextField(props) {
    var idRef = React.useRef(null);
    if (!idRef.current) idRef.current = props.id || 'rf-field-' + (++fieldSeq);
    var id = idRef.current;
    var rest = omit(props, ['label', 'hint', 'error', 'multiline', 'className', 'id']);
    var describedBy = props.error ? id + '-err' : props.hint ? id + '-hint' : undefined;
    var control = h(props.multiline ? 'textarea' : 'input', Object.assign({
      id: id,
      className: cx('rf-field__control', props.multiline && 'rf-field__control--area'),
      'aria-invalid': props.error ? true : undefined,
      'aria-describedby': describedBy,
      rows: props.multiline ? (props.rows || 4) : undefined
    }, rest));
    return h('div', { className: cx('rf-field', props.error && 'rf-field--error', props.className) },
      h('label', { className: 'rf-field__label', htmlFor: id }, props.label),
      control,
      props.error
        ? h('p', { id: id + '-err', className: 'rf-field__msg rf-field__msg--error' }, props.error)
        : props.hint ? h('p', { id: id + '-hint', className: 'rf-field__msg' }, props.hint) : null);
  }

  function NavBar(props) {
    var links = props.links || [];
    return h('nav', { className: cx('rf-nav', props.className), 'aria-label': props.ariaLabel || 'Main' },
      h('a', { className: 'rf-nav__brand', href: props.homeHref || '#' },
        props.logoSrc ? h('img', { className: 'rf-nav__logo', src: props.logoSrc, alt: '', width: 28, height: 28 }) : null,
        props.name),
      h('ul', { className: 'rf-nav__links' }, links.map(function (l) {
        var active = l.href === props.active || l.label === props.active;
        return h('li', { key: l.href || l.label },
          h('a', { href: l.href, className: cx('rf-nav__link', active && 'is-active'), 'aria-current': active ? 'page' : undefined }, l.label));
      })),
      props.action ? h('div', { className: 'rf-nav__action' }, props.action) : null);
  }

  window.RF = window.RF || {};
  Object.assign(window.RF, {
    Button: Button, Tag: Tag, StatusBadge: StatusBadge, SectionHeading: SectionHeading,
    StatCard: StatCard, ProjectCard: ProjectCard, TextField: TextField, NavBar: NavBar
  });
})();
