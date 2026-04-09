export default [
  {
    name: 'drop-console-debugger-plugin',
    setup(build) {
      const options = build.initialOptions;
      options.pure = ['console.log'];
      options.drop = ['debugger'];
    },
  },
];
