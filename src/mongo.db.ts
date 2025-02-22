'use strict';

import mongoose from 'mongoose';

mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

// Mongo Db connection class
export class Mongo {
  static async connect(uri: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      
      mongoose.connect(uri);
      mongoose.connection.on('connected', function () {
        console.log('MONGO_DATABASE_CONNECTION_SUCCESS');
        return resolve(true);
      });
      mongoose.connection.on('error', function (err: Error) {
        console.error('MONGO_DATABASE_CONNECTION_ERROR', { error: err });
        return reject(new Error('MONGO_DATABASE_CONNECTION_ERROR'));
      });
      mongoose.connection.on('disconnected', function () {
        console.error('MONGO_DATABASE_DISCONNECTED');
      });
    });
  }

  static async disconnect(): Promise<void> {
    await mongoose.connection.close();
    return;
  }
}
