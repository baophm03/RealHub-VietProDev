import { defineConfig } from 'orval'
import config from './src/config';

const orvalConfig = defineConfig({
  'realhub': {
    output: {
      mode: 'tags',
      target: 'src/lib/api/endpoints',
      schemas: 'src/lib/api/models',
      client: 'react-query',
      clean: true,
      override: {
        query: {
          version: 5,
          useInfinite: true,
          usePrefetch: true,
          options: {
            retry: 3,
            retryDelay: 1000,
          }
        },
        mutator: {
          path: './src/lib/api/mutator/custom-instance.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: `${config.apiEndpoint}/api/swagger-json`,
      filters: {
        tags: undefined
      }
    }
  }
})

export default orvalConfig