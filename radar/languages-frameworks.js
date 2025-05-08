const content = [
  {
    name: 'WebdriverIO',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'Moved In',
    description: `
<H4>Description:</H4>
<p>WebdriverIO is a robust, open-source automation framework based on W3C WebDriver standards, enabling reliable
  cross-platform testing for web and mobile applications. It supports emulators, simulators, real devices, and virtual
  machines, making it a versatile choice for comprehensive automation needs.</p>
<H4>Pros</h4>
<ul>
  <li>
    <strong>Standards-based</strong> compatibility ensures reliability across browsers and devices.
  </li>
  <li>
    <strong>Extensive plugins</strong> and services enable seamless customization and CI/CD integration.
  </li>
  <li>
    <strong>BiDi protocol</strong> support offers advanced, real-time testing capabilities.
  </li>
</ul>
<H4>Cons</h4>
<ul>
  <li>
    <strong>Steeper learning curve</strong> compared to tools like Cypress and Playwright.
  </li>
  <li>
    <strong>Reliance on WebDriver:</strong> While WebDriver is standards-compliant, it may lag behind proprietary
    protocols like Playwrights in terms of speed and advanced browser-specific features.
  </li>
</ul>
<h4>Conclusion:</h4>
<p>WebdriverIO is ideal for teams seeking a standards-compliant, future-proof framework with robust community support
  and advanced features. With the addition of BiDI, WebDriver has all the observability features you have become
  accustomed to with other tools like Playwright. We hope and expect that this puts WebDriver back on the map!</p>
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
<p>Playwright, released in January 2020, has quickly established itself as a strong alternative to tools like Cypress.
  It supports all major browser engines (Chromium, WebKit, and Firefox), operating systems, and programming languages.
  What sets Playwright apart are its automatic waiting features, actionability checks, and web-first assertions, making
  it a highly reliable tool for end-to-end (E2E) testing. Playwright also supports testing on real, unmodified browsers,
  including Google Chrome and Microsoft Edge, though with some feature limitations.</p>
<H4>Pros</h4>
<ul>
  <li>
    <strong>Actionability checks:</strong> Ensure elements are actionable (e.g., visible, attached to the DOM) before
    interactions, significantly reducing flaky tests.
  </li>
  <li>
    <strong>Web first assertions</strong> Automatically retries assertions until conditions are met, minimizing test
    failures due to timing issues.
  </li>
  <li>
    <strong>Features for Debugging and Testing:</strong> Includes powerful tools like network interception, mocking, and
    tracing, giving developers granular control over their tests.
  </li>
</ul>
<H4>Cons</h4>
<ul>
  <li>
    <strong>Proprietary Protocol:</strong> Playwright uses a proprietary protocol for its enhanced features, relying on
    modified browser engines. While it supports real browsers like Google Chrome and Microsoft Edge, features such as
    network interception may not work fully with these unmodified browsers. Additionally, for Safari, Playwright relies
    on the WebKit engine rather than testing the real, unmodified Safari browser, which may lead to minor
    inconsistencies in Safari-specific environments.
  </li>
  <li>
    <strong>Open Source Uncertainty:</strong> While excellent for E2E testing, its support for component testing is not
    as mature as some alternatives.
  </li>
  <li>
    <strong>Limited Component Testing Support:</strong> Although open to contributions, Playwright is developed and
    controlled by
    Microsoft, making its future subject to corporate decisions.
  </li>
</ul>
<h4>Conclusion:</h4>
<p>Playwright is an excellent contender for E2E style tests with its automatic waiting capabilities and web-first
  assertions as well as network interception, mocking, and tracing capabilities Its ability to support both real
  browsers (e.g., Chrome and Edge) and modified engines provides flexibility for testing needs. However, its reliance on
  a proprietary protocol, including the use of WebKit for Safari-like testing, introduces some limitations when aiming
  for true browser fidelity. Additionally, while Playwright is open source, its development is controlled by Microsoft,
  meaning its long-term future is tied to corporate priorities.</p>
<p>Despite these trade-offs, Playwright’s rich feature set, reliability, and active development make it a strong
  contender for modern cross-browser automation. We strongly recommend Playwright for teams looking for a versatile and
  robust component testing / E2E testing framework.
</p>
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
<p>Cypress, until April 2024, was the most downloaded end-to-end (e2e) testing tool according to npmtrends.com,
  showcasing its popularity. It is a commercially maintained tool with excellent free resources to get started,
  including extensive documentation. However, after being lured in by the free features, once you really want to
  integrate it into your pipeline and start running tests in parallel you’ll have to grab the credit card for paid
  features.</p>
<h4>Pros:</h4>
<ul>
  <li>
    <strong>Beginner-friendly:</strong> Offers a smooth learning curve with extensive documentation, free training
    resources, and practical examples, making it easy to adopt.
  </li>
  <li>
    <strong>Comprehensive free features:</strong> Offers everything needed for initial test automation without
    requiring payment.
  </li>
  <li>
    <strong>Integrated Debugging Tools:</strong> Built-in debugging capabilities simplify troubleshooting during test
    development.
  </li>
</ul>
<h4>Cons:</h4>
<ul>
  <li>
    <strong>Scaling limitations:</strong> Parallel test execution in CI/CD requires a paid Cypress Cloud subscription.
  </li>
  <li>
    <strong>Commercially Locked Features:</strong> Valuable advanced features, such as analytics and parallelism, are
    paywalled, reducing its appeal compared to free alternatives.
  </li>
  <li>
    <strong>Potential bottleneck:</strong> Limited parallelism out of the box may slow down lead time in CI/CD practices
    with frequent builds and deployments.
  </li>
</ul>
<h4>Conclusion:</h4>
<p>Cypress is a great choice for teams starting their automation journey, offering robust free features and a
  beginner-friendly experience. However, its reliance on paid subscriptions for key capabilities, like Cypress Cloud and
  parallel test execution, makes it less attractive for scaling projects compared to free competitors.</p>
<p>While Cypress is not a bad tool, it falls short in comparison to open-source alternatives that provide more
  scalability without added costs. For new projects, we do not recommend Cypress as the best option, but for teams
  already using it, migration may not be immediately necessary if the tool meets current needs.
</p>
`,
  },
  {
    name: 'Appium',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'No Change',
    description: `
    <h4>Description:</h4>
<p>Appium is a cross-platform automation tool for mobile applications, enabling black-box testing by interacting with
  apps as a user would, without requiring source code. It supports both Android and iOS, making it ideal for
  comprehensive mobile testing.</p>
<h4>Pros:</h4>
<ul>
  <li>
    <strong>Cross-platform:</strong> Supports Android and iOS for versatile automation.
  </li>
  <li>
    <strong>Multi-language support:</strong> Compatible with JavaScript, TypeScript, Java, Ruby, and Python.
  </li>
  <li>
    <strong>Black-box approach:</strong> Simulates real user interactions without source code access.
  </li>
</ul>

<h4>Cons:</h4>
<ul>
  <li>
    <strong>Lacks framework features:</strong> Requires additional setup for reporting and orchestration.
  </li>
  <li>
    <strong>Learning curve:</strong> Challenging for teams new to automation due to its complexity and different app
    (source) interpretation/feature support for platforms.
  </li>
  <li>
    <strong>Developer-focused tools preferred:</strong> Tools like Espresso or XCUITest may better suit developers.
  </li>
</ul>

<h4>Conclusion:</h4>
<p>Appium is a strong choice for QA teams requiring cross-platform, standard-based automation for black-box testing. Its
  ability to simulate real user interactions without requiring source code access makes it particularly valuable for
  testing diverse mobile applications. However, Appium may not be the best fit for developer-driven testing workflows,
  where tools like Espresso and XCUITest offer tighter platform integration.</p>
<p>Despite its learning curve and the need for supplementary tools, Appium remains a top option for QA-focused
  automation, especially for teams seeking flexibility and cross-platform compatibility.
</p>
`,
  },
  {
    name: 'Puppeteer',
    ring: 'Hold',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'Moved Out',
    description: `
    <h4>Description:</h4>
<p>Puppeteer, developed by Google, is a browser automation tool popular for Chrome and Firefox automation. While it
  provides rich tracing capabilities and WebDriver BiDi support, its limited browser support and need for additional
  tools make it less ideal for comprehensive test automation.</p>
<h4>Pros:</h4>
<ul>
  <li>
    <strong>Rich tracing capabilities:</strong> Provides detailed browser tracing for debugging and performance
    analysis.
  </li>
  <li>
    <strong>WebDriver BiDi support:</strong> Enables advanced browser interaction features.
  </li>
</ul>

<h4>Cons:</h4>
<ul>
  <li>
    <strong>Limited browser support:</strong> Works primarily with Chrome for Testing and Firefox.
  </li>
  <li>
    <strong>Requires additional tools:</strong> Needs integration with libraries like Mocha and Chai for full test
    automation functionality.
  </li>
</ul>

<h4>Conclusion:</h4>
<p>Puppeteer is a powerful tool for browser automation but falls short for modern test automation due to its limited
  browser support and reliance on external libraries. For new projects, tools like Playwright, which offer broader
  browser support and integrated features, are often a better choice.</p>
`,
  },
  {
    name: 'rest-assured.net',
    ring: 'Assess',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'FALSE',
    description: `
<h4>Description:</h4>
<p>Rest-Assured.NET is a C#/.NET implementation inspired by the widely popular Rest-Assured library for testing REST
  APIs in Java. Developed by Bas Dijkstra, it offers a fluent and expressive syntax for testing RESTful APIs, making it
  a promising tool for .NET developers. While still relatively young, it has been under rapid development and is gaining
  attention as a welcome addition to the .NET ecosystem. Being free and open-source, Rest-Assured.NET provides an
  accessible and cost-effective solution for API testing.</p>
<h4>Pros:</h4>
<ul>
  <li>
    <strong>Expressive Syntax:</strong> Enables intuitive and human-readable API testing, reducing boilerplate
    code.
  </li>
  <li>
    <strong>Rapid Development:</strong> Continues to evolve quickly, adding features and improving functionality.

  </li>
  <li>
    <strong>Open source:</strong> Free to use, with transparent contributions and an opportunity for developers to help
    shape its future.
  </li>
</ul>
<h4>Cons:</h4>
<ul>
  <li>
    <strong>Relatively New:</strong> As a young tool, it may lack the maturity and extensive ecosystem of more
    established API testing frameworks.
  </li>
  <li>
    <strong>Limited Resources:</strong> Documentation and community support are still growing, which may pose challenges
    for teams adopting it.
  </li>
  <li>
    <strong>Potential Gaps in Features:</strong> May not yet have all the capabilities found in more mature API testing
    tools.
  </li>
</ul>

<h4>Conclusion:</h4>
<p>Rest-Assured.NET is an exciting newcomer for .NET developers seeking a fluent and expressive way to test REST APIs.
  Its free and open-source nature makes it accessible, while its rapid development promises a growing feature set.
  However, as a relatively new tool, it may lack the maturity and ecosystem support required for highly complex or
  large-scale API testing projects.</p>
<p>We recommend assessing Rest-Assured.NET for smaller projects or teams looking for a modern, .NET-native API testing
  solution. For more established projects with advanced requirements, consider evaluating other mature tools while
  keeping an eye on the continued growth of this promising framework.</p>
<p>As an open-source project, contributions are highly valued, and developers interested in strengthening the .NET API
  testing ecosystem are encouraged to support the project. If you want to help improve Rest-Assured.NET, consider
  reaching out to Bas Dijkstra and contributing to the community to make this a strong alternative for .NET API testing.
</p>
`,
  },
  {
    name: 'TestCafe',
    ring: 'Hold',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'Moved Out',
    description: `
<h4>Description:</h4>
<p>TestCafe is a Node.js-based, open-source end-to-end (E2E) testing framework designed for modern web applications. It
  uses a proprietary protocol instead of relying on WebDriver or browser extensions, offering a simpler setup and
  execution process. While TestCafe provides cross-browser support and ease of use, its proprietary approach and lack of
  advanced features make it less competitive in today’s automation landscape.</p>
<h4>Pros:</h4>
<ul>
  <li>
    <strong>Easy Setup and Usage:</strong> Doesn’t require browser plugins or WebDriver, making it straightforward
    to install and run tests.
  </li>
  <li>
    <strong>Cross-Browser Support:</strong> Works out of the box with modern browsers, simplifying compatibility
    testing.
  </li>
  <li>
    <strong>Built-in Parallel Execution:</strong> Offers parallel test execution without requiring additional tools or
    configurations.
  </li>
</ul>

<h4>Cons:</h4>
<ul>
  <li>
    <strong>Proprietary Protocol:</strong> This relies on its own protocol instead of standardized tools like WebDriver,
    which may result in inconsistent browser behavior and limited flexibility.
  </li>
  <li>
    <strong>Limited Ecosystem and Community Support:</strong> Compared to tools like Playwright or WebdriverIO,
    TestCafe’s library and community are smaller, limiting available resources and extensions.
  </li>
  <li>
    <strong>Performance Issues in Large Test Suites:</strong> TestCafe can struggle with large-scale or complex test
    suites, leading to slower execution times.
  </li>
</ul>

<h4>Conclusion:</h4>
<p>TestCafe’s proprietary protocol and ease of use make it an appealing choice for teams with minimal requirements or
  simpler workflows. However, its lack of advanced features, smaller community, and scalability challenges place it at a
  disadvantage compared to modern alternatives. For teams seeking robust, scalable testing tools with open standards,
  TestCafe may not be the best fit.</p>
<p>We recommend putting TestCafe on hold for now and considering alternatives like Playwright or WebdriverIO, which
  offer broader capabilities, better performance, and adherence to industry standards.</p>
`,
  },
  {
    name: 'Robot Framework',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'FALSE',
    description: `
<h4>Description:</h4>
<p>Robot Framework is an open-source automation framework widely used for its versatility and simplicity. It supports
  numerous libraries written in Python, Java, and other programming languages, making it adaptable to a variety of
  testing needs. Its human-readable, keyword-driven syntax is designed to simplify test creation and foster
  collaboration between technical and non-technical stakeholders.</p>
<h4>Pros:</h4>
<ul>
  <li>
    <strong>Human-friendly syntax:</strong> Simplifies communication with stakeholders through readable and
    descriptive test cases.
  </li>
  <li>
    <strong>Easy integration:</strong> Integrates seamlessly with Python, Java, and other languages, enabling teams to
    customize and expand their capabilities to fit project requirements.
  </li>
  <li>
    <strong>Active community:</strong> A large, supportive community provides extensive resources and assistance.
  </li>
</ul>

<h4>Cons:</h4>
<ul>
  <li>
    <strong>Verbose test cases:</strong> The human-readable syntax can lead to longer test scripts, which may be
    harder to maintain in large projects.
  </li>
  <li>
    <strong>Learning curve for customization:</strong> Customizing libraries or creating complex tests may require
    strong programming skills.
  </li>
</ul>

<h4>Conclusion:</h4>
<p>Robot Framework is an excellent choice for teams seeking a versatile and easy-to-use test automation solution,
  especially for projects where collaboration between technical and non-technical stakeholders is a priority. While its
  verbose syntax and customization requirements can pose challenges for large or highly technical projects, its
  extensibility and strong community support make it a powerful tool for test automation. For teams looking for
  flexibility, readability, and community-driven resources, Robot Framework is highly recommended.</p>
`,
  },
  {
    name: 'Selenium',
    ring: 'Hold',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'No Change',
    description: `
<h4>Description:</h4>
<p>Selenium, first released in 2004, is the foundation of modern web automation and the driving force behind the W3C
  WebDriver standard. Its widespread adoption has helped establish industry-wide best practices for cross-browser
  automation. With support for multiple programming languages and real browser automation, Selenium remains a key tool
  in the test automation ecosystem.</p>
<h4>Pros:</h4>
<ul>
  <li>
    <strong>W3C standards compliant:</strong> As the foundation of the WebDriver standard, Selenium ensures reliability
    and compatibility across modern browsers.
  </li>
  <li>
    <strong>Cross-browser support:</strong> Works with all major browsers, making it a versatile solution for
    automation.
  </li>
  <li>
    <strong>Upcoming WebDriver BiDi support:</strong> Promises advanced interaction capabilities.
  </li>
  <li>
    <strong>Large community and Ecosystem:</strong> Extensive resources, integrations, and an active contributor base
    provide strong
    long-term support.
  </li>
</ul>
<h4>Cons:</h4>
<ul>
  <li>
    <strong>Additional tooling required:</strong> Requires integration with other tools for reporting, parallelization,
    and a full automation setup.
  </li>
  <li>
    <strong>Less intuitive:</strong> Compared to newer tools like Playwright or Cypress, Selenium’s setup and API can be
    more complex to learn.
  </li>
</ul>

<h4>Conclusion:</h4>
<p>Selenium has been instrumental in shaping web automation standards, and its reliability and broad ecosystem continue
  to make it a viable choice for cross-browser testing. While it may not have the streamlined usability of newer tools,
  its adherence to industry standards and strong community support keep it relevant in many automation strategies.</p>
<p>We put Selenium on hold for starting new projects, as other tools may offer a more modern and streamlined experience
  today. However, if you are already using Selenium, we recommend evaluating BiDi support and considering it on your
  feature roadmap to assess how it could enhance your project in the future.
</p>
`,
  },
]

exports.languagesFrameworks = {
  content,
}
