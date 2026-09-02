const config = {
  timeout: 120000,
  reporter: [['list']],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'edge',
      use: {
        browserName: 'chromium',
        channel: 'msedge',
        headless: false,
      },
    },
  ],
};

module.exports = config;
