const content = [
  {
    name: 'Postman',
    ring: 'Hold',
    quadrant: 'Tools',
    isNew: 'FALSE',
    status: 'FALSE',
    description: `
<H4>Description:</H4>
<p>Postman is a tool that allows users to interact with APIs and supports the most used variants such as RESTGraphQL and
  SOAP. It's easy-to-use interface allows just about anyone to perform tests quickly. Using the Newman CLI, Postman does
  offer integration in CI/CD pipelines. It allows for writing tests in Javascript directly in Postman.</p>
<H4>Pros</h4>
<ul>
  <li>
    <strong>User friendly:</strong> Regardless of technical skills, most testers should find their way in Postman very
    quickly.
  </li>
  <li>
    <strong>Request History:</strong> It maintains a history of requests, which is especially useful when testing an API
    and can make the reproduction of potential issues easier.
  </li>
  <li>
    <strong>Environment Variables:</strong> Postman allows you to easily set and change environment variables.
  </li>
</ul>
<H4>Cons</h4>
<ul>
  <li>
    <strong>Developers usually prefer more code-oriented tools:</strong> In most cases, it makes sense to store API
    tests as close to the API source as possible. In that case, it might make sense to use the same language that the
    API is built in, which is usually not Javascript.
  </li>
  <li>
    <strong>Performance:</strong> Especially when dealing with very large APIs and datasets, the Postman UI can become
    less responsive.
  </li>
  <li>
    <strong>Paid:</strong> Postman is not free for enterprises and with many other very good alternatives around.
  </li>
</ul>
<h4>Conclusion:</h4>
<p>Postman is a good choice for testers who need an easy-to-use interface for API testing, especially for quick manual
  validations. However, from an automation perspective, there are more efficient and scalable alternatives that
  integrate better with development workflows. We do not recommend starting new <strong>automation</strong> projects
  with Postman, but if you are already using it, there is no immediate need to migrate. </p>`,
  },
  {
    name: 'Storybook',
    ring: 'Adopt',
    quadrant: 'Tools',
    isNew: 'False',
    status: 'FALSE',
    description: `
<H4>Description:</H4>
<p>Storybook is a front-end workshop for building UI components and pages in isolation. Storybook can be used with
  React, Vue, Angular, Web Components, and more. Storybook serves as a library of components that can be shared and
  interacted with by developers, designers, and other stakeholders, making it a valuable tool for collaboration and
  reusability.</p>
<H4>Pros</h4>
<ul>
  <li>
    <strong>Develop in Isolation:</strong> No need to spin up an entire app. No need to spin up an entire app;
    components can be developed and tested independently.
  </li>
  <li>
    <strong>Uniform Apps:</strong> Make it easier to create a large number of apps with a uniform look and feel and
    reduce effort in implementing reusable components.
  </li>
  <li>
    <strong>Testability:</strong> Standardized UI components make testing (e.g., unit, integration, and visual) more
    efficient and reliable.
  </li>
</ul>
<H4>Cons</h4>
<ul>
  <li>
    <strong>Expensive:</strong> Creating UI library is expensive and likely not worth it for smaller projects.
  </li>
  <li>
    <strong>Steep Learning Curve:</strong> Initial setup tends to be challenging. Storybook has a steep learning curve
    when maximizing it's use.
  </li>
</ul>
<h4>Conclusion:</h4>
<p>Storybook is an excellent tool for large-scale projects or organizations with multiple applications, offering
  reusability, collaboration, and consistency. It aligns well with component testing principles and supports visual
  testing to validate both behavior and appearance. Additionally, it includes a Playwright-based Test Runner that
  enables component, UI, and visual testing directly within the Storybook environment. While the setup cost and learning
  curve make it less ideal for smaller projects, we recommend it for teams aiming to scale and maintain high-quality,
  uniform UI systems.</p>
    `,
  },
  {
    name: 'Chromatic',
    ring: 'Assess',
    quadrant: 'Tools',
    isNew: 'False',
    status: 'FALSE',
    description: `
<H4>Description:</H4>
<p>Chromatic is a SaaS platform that simplifies Visual Regression Testing by automatically generating visual snapshots
  for every story in your Storybook. It provides an intuitive interface for detecting and managing changes, making it
  easy for developers to identify visual regressions and approve updates. Chromatic supports a seamless integration with
  Storybook, and its free tier makes it accessible for smaller projects or initial trials.</p>
<H4>Pros</h4>
<ul>
  <li>
    <strong>Automatically</strong> generate tests for each individual story with Storybook.
  </li>
  <li>
    <strong>Updating snapshots</strong> is extremely easy and does not require jumping through hoops with docker
    containers.
  </li>
  <li>
    <strong>The integration</strong> with Storybook is straightforward and requires minimal configuration to get
    started.
  </li>
</ul>
<H4>Cons</h4>
<ul>
  <li>
    <strong>A subscription</strong> is required to unlock all features and browsers.
  </li>
  <li>
    <strong>Requires storybook</strong> to work.
  </li>
</ul>
<h4>Conclusion:</h4>
<p>For teams already using Storybook, adopting Chromatic is a natural choice. It provides instant visual regression
  testing capabilities with minimal effort, allowing developers to detect and manage visual changes efficiently. Its
  free tier is ideal for smaller teams or initial experiments, and its subscription unlocks advanced features for
  larger-scale projects. If you’re looking for an easy way to incorporate visual regression testing into your workflow,
  Chromatic is definitely worth exploring.</p>
`,
  },
  {
    name: 'AI Assistants (such as Github Co-pilot and JetBrains AI Assistant)',
    ring: 'trial',
    quadrant: 'Tools',
    isNew: 'False',
    status: 'FALSE',
    description: `
<H4>Description:</H4>
<p>AI Assistants are transforming the development landscape by acting as intelligent helpers, capable of providing
  real-time code suggestions, generating boilerplate code, and even acting as a rubber duck for debugging. By leveraging
  large language models trained on vast amounts of code, these tools can significantly speed up development workflows
  and reduce repetitive tasks. However, they come with notable challenges, particularly in areas like code quality,
  privacy, and potential over-reliance.</p>
<H4>Pros</h4>
<ul>
  <li>
    <strong>Increased productivity:</strong> Developers can work faster with intelligent suggestions, auto-completion,
    and context-aware code explanations.
  </li>
  <li>
    <strong>Wide language support:</strong> Due to training on existing material, there is a wide range of languages
    that AI assistants can understand and provide suggestions for.
  </li>
  <li>
    <strong>Boilerplate generation:</strong> Quickly generates boilerplate code to help developers get started or focus
    on more complex tasks.
  </li>
</ul>
<H4>Cons</h4>
<ul>
  <li>
    <strong>Dependency Risk:</strong> Over-reliance on AI assistants may lead to reduced problem-solving skills and
    overdependence on automated suggestions among developers, especially beginners.
  </li>
  <li>
    <strong>Code Quality:</strong> AI Assistants still make mistakes and the code they generate should never be blindly
    accepted without verifying the output.
  </li>
  <li>
    <strong>Privacy:</strong> AI assistants are trained on public repositories and will use your code to improve their
    models without Enterprise Subscriptions. Enterprise solutions that do not use your code to improve its model and
    that filter responses based on license types exist but are costly.
  </li>
</ul>
<h4>Conclusion:</h4>
<p>AI Assistants are powerful tools that can significantly boost productivity, streamline development, and reduce
  repetitive tasks. However, they require careful adoption due to risks like dependency, code quality issues, and
  privacy concerns. OpenAI and similar companies have faced legal challenges over the use of copyrighted material in
  training models, underscoring the need for caution. For organizations or developers who can mitigate these
  risks—whether through enterprise-level tools or strict validation processes—AI assistants can be a valuable addition
  to the modern development toolkit. We recommend exploring AI assistants to enhance workflows, especially in repetitive
  or boilerplate-heavy tasks, while keeping risks in check.</p>
`,
  },
  {
    name: 'TestContainers',
    ring: 'adopt',
    quadrant: 'Tools',
    isNew: 'False',
    status: 'FALSE',
    description: `
<H4>Description:</H4>
<p>Testcontainers attempt to solve complex environment configurations by providing ready-made docker containers for
  commonly used databases, message brokers, and/or browsers. It allows you to define these dependencies as code making
  it easier to maintain. it supports a ton of tooling out of the box</p>
<H4>Pros</h4>
<ul>
  <li>
    <strong>Rich tool support:</strong> Over 50 commonly used databases, message brokers, and other tools readily
    available!
  </li>
  <li>
    <strong>Productivity:</strong> Can be increased by offloading the complexity of managing the test environment to
    test containers.
  </li>
  <li>
    <strong>Rich support for programming languages:</strong> Just about any language is supported.
  </li>
</ul>
<H4>Cons</h4>
<ul>
  <li>
    <strong>Black Box:</strong> Can be slightly challenging to debug the black box test containers.
  </li>
  <li>
    <strong>Resource-Intensive:</strong> Running multiple containers simultaneously can be resource-heavy, potentially
    impacting system performance during test runs.
  </li>
</ul>
<h4>Conclusion:</h4>
<p>In most cases running tests is complicated due to having a lot of dependencies, such as a database and/or message
  broker or sometimes even both. TestContainers comes with almost all industry standard tools pre-packaged in a
  container and includes orchestration logic. This significantly reduces the effort required to set up and maintain test
  environments while improving reliability and reproducibility. While debugging and resource use can pose challenges,
  the benefits far outweigh the drawbacks.</p>
<p>We highly recommend adopting TestContainers to streamline your testing workflow and simplify dependency
  management—especially if you're not already using it.
</p>
`,
  },
  {
    name: 'k6',
    ring: 'trial',
    quadrant: 'Tools',
    isNew: 'False',
    status: 'FALSE',
    description: `
<H4>Description:</H4>
<p>k6 is an open-source performance testing tool designed for modern developers and DevOps teams.
Built with a focus on load testing, k6 enables users to write tests in JavaScript and execute them efficiently at scale.
It is particularly well-suited for testing APIs, microservices, and web applications, offering smooth integration with CI/CD pipelines.
k6 is scriptable, lightweight, and can be run locally or in the cloud.</p>
<H4>Pros</h4>
<ul>
  <li>
    <strong>Developer-friendly:</strong> Written in JavaScript, making it easy for developers to script and maintain tests.
  </li>
  <li>
    <strong>High performance:</strong> Efficiently handles large-scale load tests with low resource consumption.
  </li>
  <li>
    <strong>CI/CD Integration:</strong> Works with modern CI/CD workflows for automated performance testing.
  </li>
    <li>
    <strong>Detailed Metrics:</strong> Provides detailed insights into response times, request rates, and system behavior under load.
  </li>
    <li>
    <strong>Open-source:</strong> Free to use, with an active community contributing to improvements and new features.
  </li>
</ul>
<H4>Cons</h4>
<ul>
  <li>
    <strong>UI:</strong> k6 provides a user interface with Grafana k6 Studio. Currently, this is under public preview.
    Making k6 more suitable for an audience with a development background.
  </li>
    <li>
    <strong>Grafana Cloud k6:</strong> Grafana Cloud k6 is a paid service that offers additional features like cloud execution and advanced analytics.
    This means that for additional possibilities, you will have to pay.
  </li>
</ul>
<h4>Conclusion:</h4>
<p>k6 is a powerful and efficient tool for load testing, particularly for teams looking to integrate performance testing into their CI/CD pipelines.
While it lacks a UI and built-in functional testing features, its scripting capabilities and high performance make it an excellent choice for developers focused on API and application performance.
For organizations needing extensive protocol support or non-technical users, alternative solutions like JMeter might be more suitable.</p>
`,
  },
]

exports.tools = {
  content,
}
