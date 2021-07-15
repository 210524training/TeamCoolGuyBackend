import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import getCardCollection from '@functions/getCardCollection';

const serverlessConfiguration: AWS = {
  service: 'tcswap-backend',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    // esbuild: {
    //   bundle: true,
    //   minify: true,
    //   sourcemap: true,
    //   external: [
    //     'aws-sdk',
    //     'pg-native'
    //   ],
    //   watch: {
    //     pattern: ['src/**/*'],
    //     ignore: ['.serverless/**/*', '.build', 'node_modules']
    //   }
    // }
  },
  plugins: ['serverless-webpack', 'serverless-plugin-resource-tagging'],
  provider: {
    name: 'aws',
    stackTags: {
      Created_For: 'TCG_Swap Application'
    },
    runtime: 'nodejs14.x',
    region: 'us-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  
  // import the function via paths
  functions: { 
    hello,
    getCardCollection 
  },
};

module.exports = serverlessConfiguration;
