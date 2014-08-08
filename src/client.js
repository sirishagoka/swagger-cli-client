var clientGenerator = require('swagger-node-client'),
  minimist = require('minimist'),
  path = require('path'),

  columnLayout = require('./columnLayout'),
  print = require('./print'),
  printOperation = require('./printOperation'),
  printOperations = require('./printOperations'),
  printResources = require('./printResources');
  
module.exports = function(schema){
  var api = clientGenerator(schema);
  var authMethodName = api.authorization ? 'authorization' : 'auth';
  var authMethod = api[authMethodName];

  var args = minimist(process.argv.slice(2));
  var appName = path.basename(process.argv[1]);
    
  var resourceName = args._.shift();
  var operationName = args._.shift();
  
  if(args.v) return printVersion(schema);

  if(args.auth) authMethod(args.auth);

  if(resourceName){
    if(operationName){
      var operation = api[resourceName][operationName];

      printOperation(operation, args);
    } else {
      printOperations(api, resourceName);
    }
  } else {
    printUsage(schema, api);
  }

  function printVersion(schema){
    print(appName);
    
    if(schema.info && schema.info.title){
      if(schema.apiVersion) print(' v%s', schema.apiVersion);
      print(' (%s)', schema.info.title);
    }
    print.ln();
  }
};

function printUsage(schema, api){
  var appName = path.basename(process.argv[1]);
  
  print.ln('usage: %s [-v] [--auth <auth-token>] <resource> [<args>]', appName);
  print.ln()
  printInfo(schema);
  printResources(api);
}

function printInfo(schema){
  if(schema.info && schema.info.title){
    print(schema.info.title.bold);
    if(schema.apiVersion) print(' v' + schema.apiVersion.bold);
    print.ln();

    print.ln(columnLayout.wrap(schema.info.description, 80));
  }
  
  print.ln();
}
