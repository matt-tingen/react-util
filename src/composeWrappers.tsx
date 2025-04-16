import { cloneElement, isValidElement, memo } from 'react';
import { Children } from './types';

type SimpleWrapper = React.FC<Partial<Children>> | React.FC<Children>;
type Wrapper = SimpleWrapper | React.MemoExoticComponent<SimpleWrapper>;

/**
 * Composes react wrappers such as stateful providers.
 *
 * The first wrapper specified will be the outermost.
 */
export const composeWrappers = (
  ...wrappers: (Wrapper | React.ReactElement<Children>)[]
) =>
  memo(
    ({ children }: Children) =>
      wrappers.reduceRight<React.JSX.Element | React.ReactNode>(
        (node, Wrapper) => {
          if (isValidElement(Wrapper)) {
            return cloneElement<Children>(Wrapper, { children: node });
          }

          return <Wrapper>{node}</Wrapper>;
        },
        children,
      ) as React.JSX.Element,
  );
