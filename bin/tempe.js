#!/usr/bin/env node

import { main } from '../dist/index.js';

main().catch(err => {
  console.error('[Tempe Fatal Error]:', err);
  process.exit(1);
});
