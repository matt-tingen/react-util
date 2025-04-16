import { useLayoutEffect, useRef } from 'react';

export interface BrowserTranslatableProps {
  lang: string;
  children: string;
}

const style = {
  display: 'contents',
} satisfies React.CSSProperties;

export const BrowserTranslatable = ({
  children: text,
  lang,
}: BrowserTranslatableProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const span = document.createElement('span');

    // span.style = style
    span.lang = lang;
    span.translate = true;
    span.textContent = text;

    ref.current?.replaceChildren(span);
  }, [lang, text]);

  return <span ref={ref} style={style} />;
};
