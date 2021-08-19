Package.describe({
  name: 'quave:resolvers',
  version: '1.0.3',
  summary: 'Utility package to create Resolvers',
  git: 'https://github.com/quavedev/resolvers',
});

Package.onUse(function(api) {
  api.versionsFrom('1.10.2');
  api.use('ecmascript');
  api.use('quave:settings@1.0.0');

  api.mainModule('resolvers.js');
});
