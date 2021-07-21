import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import getCardCollection from '@functions/getCardCollection';
import addCardToCollection from '@functions/addCardToCollection';
import removeCardFromCollection from '@functions/removeCardFromCollection';
import getFeaturedCard from '@functions/getFeaturedCard'
import getUsersStore from '@functions/getUsersStore';
import getOffers from '@functions/getOffers'
import acceptOffer from '@functions/acceptOffer'
import rejectOffer from '@functions/rejectOffer';
import getRequests from '@functions/getRequests'
import getAllStores from '@functions/getAllStores'
import login from '@functions/login';
import postFeatureCard from '@functions/postFeatureCard';
import register from '@functions/register';
import getMessages from '@functions/getMessages';
import addMessage from '@functions/addMessage';
import searchCards from '@functions/searchCards';
import searchCardsAll from '@functions/searchCardsAll';
import createOffer from '@functions/createOffer';

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
    region: 'us-west-2',
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
    getCardCollection,
    getFeaturedCard,
    addCardToCollection,
    removeCardFromCollection,
    getUsersStore,
    getAllStores,
    getOffers,
    acceptOffer,
    rejectOffer,
    getRequests,
    login,
    postFeatureCard,
    register,
    getMessages,
    addMessage,
    searchCards,
    searchCardsAll,
    createOffer
  },
};

module.exports = serverlessConfiguration;
