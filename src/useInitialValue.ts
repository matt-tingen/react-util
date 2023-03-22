import { useState } from 'react';

export const useInitialValue = <T>(initializer: () => T) =>
  useState(initializer)[0];
