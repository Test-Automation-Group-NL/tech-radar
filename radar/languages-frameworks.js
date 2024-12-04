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
    description:
      "<p>Until April 2024 Cypress was the most downloaded e2e testing tool according to npmtrends.com. Of course, downloads don’t tell us anything about how intensively people are using it. There still seems to be a lot of interest in learning how to use Cypress. <br><br>This commercially (and well) maintained tool has initially not many features behind their paywall. Everything you need (to get started) is out there for free and documentation is really extensive and easy to use. However, when you get to the point of scaling e2e testing and running tests in parallel in CI/CD, you will want (or need) to have a Cypress Cloud subscription to make it all integrate. This is the biggest downside to Cypress.<br><br>To start automating your e2e (or component) tests is really easy with Cypress. You don’t even have to be familiar with Javascript/Typescript or the NodeJS runtime in order to start automating tests which makes it a perfect tool for ‘test engineers’ interested in test automation. This is a big pro for any (JS/TS) beginner, because you don’t need to learn concepts like asynchronous coding (promises, callbacks, async/await) to start automating e2e tests.</p> <br><br><p>Why 'Hold' ring? We believe using Cypress in a CI/CD practice with many builds/deployments a day Cypress could cause a bottleneck for your leadtime. Teste can't run (out of the box) in parallel, unless you start paying...</p>",
  },
  {
    name: 'Appium',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'No Change',
    description:
      "In a landscape often dominated by platform-specific tools like Espresso and XCUITest, Appium stands out as a versatile, cross-platform automation tool that operates as a black-box testing tool. Unlike some competitors, Appium interacts with applications as a user would, without requiring access to the app's source code, making it a powerful option for comprehensive end-to-end testing.</p>\n<br />\n<p><strong>Pros:</strong></p>\n<ul>\n  <li><strong>Cross-platform flexibility:</strong> Appium supports both Android and iOS platforms, making it a versatile tool for mobile automation.</li>\n  <li><strong>Language variety:</strong> It supports multiple languages (JavaScript, TypeScript, Java, Ruby, Python), catering to QA engineers with diverse skill sets.</li>\n  <li><strong>Black-box testing:</strong> As a black-box tool, it simulates user interactions without requiring access to source code, enabling comprehensive testing.</li>\n</ul>\n<br /><br />\n<p><strong>Cons:</strong></p>\n<ul>\n  <li><strong>Not a framework:</strong>Appium is not a framework, but a <em>robot</em>. It represents the part of a framework responsible for executing the automated tasks. It coordinates test execution, but you must still build the reporting/configuration/orchestration.</li>\n  <li><strong>Challenging learning curve:</strong> Appium can be difficult to learn, especially for teams without prior experience in automation.</li>\n  <li><strong>QA-centric focus:</strong> While great for QA teams, developers may prefer more integrated tools like Espresso or XCUITest, which offer deeper control.</li>\n</ul>\n<br /><br />\n<p><strong>Conclusion:</strong><br />\nAppium is an excellent choice for QA teams looking for a cross-platform, black-box testing tool. It is fully open-source and adheres to W3C WebDriver standards, making it reliable and future-proof. However, development-heavy teams might benefit more from exploring Espresso or XCUITest, which provide deeper integration into the development process. For QA-focused teams, Appium remains a highly recommended option for standard-based mobile automation.</p>",
  },
  {
    name: 'XCUITest',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'No Change',
    description:
      "XCUITest is a robust, developer-focused testing framework designed specifically for iOS applications. Similar to Espresso for Android, XCUITest requires direct access to the app's source code, making it crucial for teams to have a deep understanding of the app’s structure and flow.</p>\n<br />\n<p><strong>Pros:</strong></p>\n<ul>\n  <li><strong>Deep code integration:</strong> XCUITest requires access to the app’s source code, allowing for precise, code-level tests tailored to the app’s architecture.</li>\n  <li><strong>Swift and Objective-C support:</strong> It integrates tightly with iOS development by using the same languages as the app, providing consistency in the development and testing process.</li>\n  <li><strong>Xcode integration:</strong> XCUITest is fully integrated with Apple’s Xcode, enabling fast and reliable testing directly on the iOS UI layer.</li>\n</ul>\n<br /><br />\n<p><strong>Cons:</strong></p>\n<ul>\n  <li><strong>Developer-centric:</strong> XCUITest is primarily designed for developers, and teams composed of QA engineers might struggle with the code access requirements.</li>\n  <li><strong>Requires programming skills:</strong> Teams need to be proficient in Swift or Objective-C, which may present a challenge for those unfamiliar with iOS development.</li>\n</ul>\n<br /><br />\n<p><strong>Conclusion:</strong><br />\nXCUITest is an ideal solution for development-heavy teams that require rigorous, code-level testing of iOS applications. Its tight integration with Xcode and reliance on Swift or Objective-C makes it a powerful tool for developers, but it may not be suitable for QA teams without programming experience. For iOS projects needing precise, developer-driven testing, XCUITest is a top recommendation.</p>",
  },
  {
    name: 'Espresso',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'No Change',
    description:
      "Espresso is a powerful, developer-centric testing framework designed specifically for Android applications. Unlike black-box tools like Appium, Espresso requires direct access to the source code, making it essential for teams to have a deep understanding of the app's internal structure and flow.</p>\n<br />\n<p><strong>Pros:</strong></p>\n<ul>\n  <li><strong>Deep code integration:</strong> Espresso requires access to the app's source code, allowing for highly accurate tests that align closely with the app’s architecture.</li>\n  <li><strong>Java and Kotlin support:</strong> Espresso utilizes the primary languages of Android development, providing consistency in testing and development.</li>\n  <li><strong>Fast, reliable feedback:</strong> Tight integration with Android's development environment ensures immediate feedback and precise control over UI interactions.</li>\n</ul>\n<br /><br />\n<p><strong>Cons:</strong></p>\n<ul>\n  <li><strong>Developer-centric:</strong> Espresso is best suited for developer-heavy teams, making it less accessible for teams focused primarily on QA.</li>\n  <li><strong>Requires programming skills:</strong> Teams need proficiency in Java or Kotlin, which can be a barrier for those not familiar with Android development.</li>\n</ul>\n<br /><br />\n<p><strong>Conclusion:</strong><br />\nEspresso is an excellent choice for developer-heavy teams looking to implement rigorous, code-level testing within their Android projects. Its deep integration with the app’s architecture and Android’s development environment makes it a powerful tool, but it may not be the best option for QA teams lacking programming expertise. For teams seeking precise, developer-driven testing, Espresso is a top recommendation.</p>\n",
  },
  {
    name: 'Puppeteer',
    ring: 'Hold',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'Moved Out',
    description:
      'Puppeteer, actively developed by Google and first released in January 2018, has been a popular choice for various types of browser automation. However, its browser support is limited to Chrome for Testing and Firefox. At its core, Puppeteer excels in browser automation but requires additional libraries like Mocha and Chai to be fully suited for comprehensive test automation.\n\nPro’s:\nRich tracing capabilities (similar to playwright)\nSupport for Webdriver BiDi\n\nCon’s:\nLimited browser support\nRequires additional tools to be fully usable as a test automation tool\n\nPuppeteer’s limited browser support and the necessity of integrating additional libraries for full testing capabilities can be restrictive. As a result, for new projects, there are often better alternatives available that provide broader browser support and more integrated features. Tools like Playwright, which supports multiple browsers out of the box, may offer a more comprehensive solution for modern test automation needs.\n',
  },
  {
    name: 'AssertJ',
    ring: 'Trial',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'FALSE',
    description:
      '<p>AssertJ is library that provides fluent assertions for tests in Java. Using AssertJ makes unit tests easier to read, while its error messages help identify where the actual results differ from the expectation.</p>\n<p>While AssertJ is already widely adopted, we recommend everyone working with it to learn about its lesser known features like custom Assertions (great for domain-specific assertions) and Conditions.</p>',
  },
  {
    name: 'rest-assured.net',
    ring: 'Assess',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'FALSE',
    description:
      'Bas Dijkstra’s C#/.NET implementation of the famous library for testing REST APIs in Java. It appears to be a welcome newcomer to the ecosystem. It is still relatively young but has been in rapid development since its inception. Also, it is free and open source.',
  },
  {
    name: 'Wiremock',
    ring: 'Adopt',
    quadrant: 'FALSE',
    isNew: 'FALSE',
    status: 'FALSE',
    description: 'FALSE',
  },
  {
    name: 'TestCafe',
    ring: 'Hold',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'Moved Out',
    description: 'Niet meer aan beginnen, betere alternatieven ',
  },
  {
    name: 'Robot Framework',
    ring: 'Adopt',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'FALSE',
    description:
      '<p>Robot Framework is an open source automation framework for test automation. Is widely used in the industry and there are many libraries developed to enhance its functionality in Python, Java and other languages. </p> <ol><li>+ human-friendly syntax that makes the communication with the stakeholders easier </li>\n<li>+ easy to integrate with Python or Java </li>\n<li>+ big community of contributors willing to support </li>',
  },
  {
    name: 'Selenium',
    ring: 'Hold',
    quadrant: 'languages-and-frameworks',
    isNew: 'FALSE',
    status: 'No Change',
    description:
      '\nSelenium, actively developed by the Selenium Project and first released in 2004, has long been a cornerstone of web automation. Unlike some newer tools, Selenium boasts extensive browser support, including Chrome, Firefox, Safari, Edge, and Internet Explorer, making it a versatile choice for cross-browser testing. At its core, Selenium excels in automating web applications and supports multiple programming languages such as Java, C#, Python, Ruby, JavaScript, and Kotlin, making it highly accessible to developers with varied expertise.\n\nPros:\nCompliant with W3C standards\nCross browser support\nWebdriver BiDi support is coming\nLarge community\n\nCon’s:\nRequires additional tooling to be fully usable as a test automation tool\nNot as intuitive as some competitors\n\nSelenium remains a strong choice due to its broad browser support, mature ecosystem, and extensive community resources. For projects requiring extensive cross-browser testing and leveraging a well-established framework, Selenium is a highly viable option. However, for new projects seeking built-in support for modern web features and more streamlined interactions, tools like Playwright might offer a more comprehensive solution for contemporary test automation needs.\n',
  },
]

exports.languagesFrameworks = {
  content,
}
