import { defineConfig } from 'orval';

export default defineConfig({
  realhub: {
    output: {
      target: 'src/lib/api/generated',
      client: 'react-query',
      schemas: 'src/lib/api/model',
      clean: true,
    },
    input: {
      target: 'http://localhost:5000/api/swagger-json',
    },
  },
});
