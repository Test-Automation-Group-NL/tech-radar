const content = [
  {
    name: 'WebdriverIO',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'Moved In',
    description: `
      <H4>Description:</H4>
      <p>WebdriverIO is a robust, open-source automation framework based on W3C WebDriver standards, enabling reliable cross-platform testing for web and mobile applications.
      It supports emulators, simulators, real devices, and virtual machines, making it a versatile choice for comprehensive automation needs.</p>
      <H4>Pros</h4>
      <ul>
          <li><strong>Standards-based</strong> compatibility ensures reliability across browsers and devices.</li>
          <li><strong>Extensive plugins</strong> and services enable seamless customization and CI/CD integration.</li>
          <li><strong>BiDi protocol</strong> support offers advanced, real-time testing capabilities.</li>
      </ul>
      <H4>Cons</h4>
      <ul>
          <li><strong>Steeper learning curve</strong> compared to tools like Cypress and Playwright.</li>
          <li><strong>Requires more setup and maintenance</strong>, particularly for non-developer teams.</li>
      </ul>
      <h4>Conclusion:</h4>
      <p>WebdriverIO is ideal for teams seeking a standards-compliant, future-proof framework with robust community support and advanced features.</p>
      `,
  },
  {
    name: 'Playwright',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'Moved In',
    description: `
      <H4>Description:</H4>
<p>Playwright, released in January 2020, has quickly established itself as a strong alternative to tools like Cypress. It supports all major browser engines, operating systems, and programming languages. What sets Playwright apart are its automatic waiting features and web-first assertions.</p>
<H4>Pros</h4>
<ul>
    <li><strong>Actionability checks</strong> before interacting with elements, includes auto-waiting</li>
    <li><strong>Web first assertions</strong> automatically retry the assertion until condition is met reducing flakyness.</li>
</ul>
<H4>Cons</h4>
<ul>
    <li>Uses modified browser engines, not <strong>real browsers</strong>.</li>
    <li>Limited support for <strong>component tests</strong>.</li>
</ul>
<h4>Conclusion:</h4>
<p>Playwright is an excellent conder for E2E style tests with it's automatic waiting capabilities and web first assertions as well as network interception, mocking and tracing capabilities</p>
`,
  },
  {
    name: 'Cypress',
    ring: 'Hold',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'No Change',
    description: `
    <h4>Description:</h4>
    <p>Cypress, until April 2024, was the most downloaded end-to-end (e2e) testing tool according to npmtrends.com, showcasing its popularity.
    It is a commercially maintained tool with excellent free resources to get started, including extensive documentation.
    However, scaling tests in CI/CD environments often requires a Cypress Cloud subscription for features like parallel test execution, which can be a limitation for larger teams.</p>
    <h4>Pros:</h4>
    <ul>
      <li><strong>Beginner-friendly:</strong> Easy to start with, even for those unfamiliar with JavaScript or asynchronous programming concepts.</li>
      <li><strong>Comprehensive free features:</strong> Offers everything needed for initial test automation without requiring payment.</li>
    </ul>
    <h4>Cons:</h4>
    <ul>
      <li><strong>Scaling limitations:</strong> Parallel test execution in CI/CD requires a paid Cypress Cloud subscription.</li>
      <li><strong>Potential bottleneck:</strong> Limited parallelism out of the box may slow down lead time in CI/CD practices with frequent builds and deployments.</li>
    </ul>
    <h4>Conclusion:</h4>
    <p>Cypress is an excellent choice for beginners or smaller teams looking to start with e2e or component testing.
    Its ease of use and extensive free resources make it accessible for test engineers. However, for teams with complex CI/CD needs, the limitations around parallel testing may become a challenge without investing in Cypress Cloud.</p>
`,
  },
  {
    name: 'Appium',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'No Change',
    description: `<h4>Description:</h4>
<p>Appium is a cross-platform automation tool for mobile applications, enabling black-box testing by interacting with apps as a user would, without requiring source code. It supports both Android and iOS, making it ideal for comprehensive mobile testing.</p>

<h4>Pros:</h4>
<ul>
    <li><strong>Cross-platform:</strong> Supports Android and iOS for versatile automation.</li>
    <li><strong>Multi-language support:</strong> Compatible with JavaScript, TypeScript, Java, Ruby, and Python.</li>
    <li><strong>Black-box approach:</strong> Simulates real user interactions without source code access.</li>
</ul>

<h4>Cons:</h4>
<ul>
    <li><strong>Lacks framework features:</strong> Requires additional setup for reporting and orchestration.</li>
    <li><strong>Learning curve:</strong> Challenging for teams new to automation.</li>
    <li><strong>Developer-focused tools preferred:</strong> Tools like Espresso or XCUITest may better suit developers.</li>
</ul>

<h4>Conclusion:</h4>
<p>Appium is a strong choice for QA teams needing cross-platform, standard-based automation. While developers may prefer platform-specific tools, Appium remains a top option for QA-focused black-box testing.</p>  `,
  },
  {
    name: 'XCUITest',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'No Change',
    description: `<h4>Description:</h4>
<p>XCUITest is a developer-focused testing framework designed for iOS applications. It requires access to the app's source code, making it ideal for precise, code-level testing but challenging for QA teams without iOS development expertise.</p>

<h4>Pros:</h4>
<ul>
    <li><strong>Deep integration:</strong> Access to source code enables highly tailored, architecture-specific tests.</li>
    <li><strong>Swift and Objective-C support:</strong> Aligns with iOS development languages for consistency.</li>
    <li><strong>Xcode integration:</strong> Fully integrated with Apple’s Xcode for efficient testing.</li>
</ul>

<h4>Cons:</h4>
<ul>
    <li><strong>Developer-centric:</strong> Best suited for developers, not QA teams unfamiliar with coding.</li>
    <li><strong>Programming required:</strong> Proficiency in Swift or Objective-C is necessary, limiting accessibility for non-developers.</li>
</ul>

<h4>Conclusion:</h4>
<p>XCUITest is a powerful tool for development-heavy teams requiring precise, developer-driven testing of iOS applications. Its integration with Xcode and reliance on Swift or Objective-C make it highly effective for developers but less suitable for QA teams without programming skills.</p>  `,
  },
  {
    name: 'Espresso',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'No Change',
    description: `<h4>Description:</h4>
<p>Espresso is a developer-focused testing framework tailored for Android applications. Unlike black-box tools, it requires access to source code, making it ideal for precise, architecture-specific testing but less accessible for QA-centric teams.</p>

<h4>Pros:</h4>
<ul>
    <li><strong>Deep code integration:</strong> Enables accurate, architecture-aligned testing with direct access to source code.</li>
    <li><strong>Java and Kotlin support:</strong> Uses Android's primary development languages for seamless integration.</li>
    <li><strong>Fast feedback:</strong> Tight coupling with Android’s environment ensures quick and reliable test execution.</li>
</ul>

<h4>Cons:</h4>
<ul>
    <li><strong>Developer-centric:</strong> Best suited for developer-heavy teams, limiting accessibility for QA-only teams.</li>
    <li><strong>Programming required:</strong> Proficiency in Java or Kotlin is necessary, posing challenges for non-developers.</li>
</ul>

<h4>Conclusion:</h4>
<p>Espresso is a powerful tool for development-heavy teams needing precise, code-level testing for Android projects. Its deep integration with Android’s environment and reliance on Java or Kotlin make it highly effective for developers but less suitable for QA teams without programming experience.</p>  `,
  },
  {
    name: 'Puppeteer',
    ring: 'Hold',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'Moved Out',
    description: `<h4>Description:</h4>
<p>Puppeteer, developed by Google, is a browser automation tool popular for Chrome and Firefox automation. While it provides rich tracing capabilities and WebDriver BiDi support, its limited browser support and need for additional tools make it less ideal for comprehensive test automation.</p>

<h4>Pros:</h4>
<ul>
    <li><strong>Rich tracing capabilities:</strong> Provides detailed browser tracing for debugging and performance analysis.</li>
    <li><strong>WebDriver BiDi support:</strong> Enables advanced browser interaction features.</li>
</ul>

<h4>Cons:</h4>
<ul>
    <li><strong>Limited browser support:</strong> Works primarily with Chrome for Testing and Firefox.</li>
    <li><strong>Requires additional tools:</strong> Needs integration with libraries like Mocha and Chai for full test automation functionality.</li>
</ul>

<h4>Conclusion:</h4>
<p>Puppeteer is a powerful tool for browser automation but falls short for modern test automation due to its limited browser support and reliance on external libraries. For new projects, tools like Playwright, which offer broader browser support and integrated features, are often a better choice.</p>  `,
  },
  {
    name: 'rest-assured.net',
    ring: 'Assess',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'FALSE',
    description:
      '<strong>VOLLEDIG HERSCHRIJVEN</strong>Bas Dijkstra’s C#/.NET implementation of the famous library for testing REST APIs in Java. It appears to be a welcome newcomer to the ecosystem. It is still relatively young but has been in rapid development since its inception. Also, it is free and open source.',
  },
  {
    name: 'Wiremock',
    ring: 'Adopt',
    quadrant: 'FALSE',
    isNew: 'FALSE',
    status: 'FALSE',
    description: '<strong>VOLLEDIG HERSCHRIJVEN</strong>',
  },
  {
    name: 'TestCafe',
    ring: 'Hold',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'Moved Out',
    description: '<strong>VOLLEDIG HERSCHRIJVEN</strong>Niet meer aan beginnen, betere alternatieven ',
  },
  {
    name: 'Robot Framework',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'FALSE',
    description: `<h4>Description:</h4>
<p>Robot Framework is an open-source automation framework widely used in the industry. Its extensibility is supported by numerous libraries in Python, Java, and other languages, making it highly adaptable to various testing needs.</p>

<h4>Pros:</h4>
<ul>
    <li><strong>Human-friendly syntax:</strong> Simplifies communication with stakeholders through readable and descriptive test cases.</li>
    <li><strong>Easy integration:</strong> Seamlessly works with Python, Java, and other programming languages.</li>
    <li><strong>Active community:</strong> A large, supportive community provides extensive resources and assistance.</li>
</ul>

<h4>Cons:</h4>
<ul>
    <li><strong>Verbose test cases:</strong> The human-readable syntax can lead to longer test scripts, which may be harder to maintain in large projects.</li>
    <li><strong>Learning curve for customization:</strong> Customizing libraries or creating complex tests may require strong programming skills.</li>
</ul>

<h4>Conclusion:</h4>
<p>Robot Framework is an excellent choice for teams prioritizing stakeholder communication and flexibility. While it may require more effort for customization, its extensibility and community support make it a valuable tool for test automation.</p>  `,
  },
  {
    name: 'Selenium',
    ring: 'Hold',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'No Change',
    description: `<h4>Description:</h4>
<p>Selenium, first released in 2004, is a cornerstone of web automation, offering extensive REAL browser support. It supports multiple programming languages, making it accessible to developers with diverse expertise and an excellent choice for cross-browser testing.</p>

<h4>Pros:</h4>
<ul>
    <li><strong>W3C standards compliant:</strong> Ensures reliability and compatibility with modern web browsers.</li>
    <li><strong>Cross-browser support:</strong> Works with all major browsers for versatile automation.</li>
    <li><strong>Upcoming WebDriver BiDi support:</strong> Promises advanced interaction capabilities.</li>
    <li><strong>Large community:</strong> Extensive resources and active contributor base for support.</li>
</ul>

<h4>Cons:</h4>
<ul>
    <li><strong>Additional tooling required:</strong> Needs integration with external tools for a complete test automation setup.</li>
    <li><strong>Less intuitive:</strong> Compared to some newer tools, it can be harder for beginners to learn and use efficiently.</li>
</ul>

<h4>Conclusion:</h4>
<p>Selenium remains a strong choice for projects requiring extensive cross-browser testing and a mature, well-supported framework. While it may lack some of the modern features and streamlined usability of newer tools like Playwright, its reliability, versatility, and large community make it a viable option for many automation needs.</p>  `,
  },
]

exports.languagesFrameworks = {
  content,
}
