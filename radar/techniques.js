const content = [
  {
    name: 'Page Object Model',
    ring: 'Adopt',
    quadrant: 'Techniques',
    isNew: 'TRUE',
    status: 'Moved In',
    description: `
      <h4>Description</h4>
      <p>
      The Page Object Model (POM) is a design pattern commonly used to structure test code, typically reflecting the structure of the application under test. By encapsulating the logic for interacting with a page in a single location, POM reduces code duplication and enhances test maintainability.
      Typically, these page objects extend a base class that includes shared methods for interacting with common page elements, such as clicking buttons or filling out forms. However, modern test frameworks like Playwright and Cypress offer built-in functionality for interacting with page elements, rendering the need for base classes less critical.
      As frameworks like React have popularized the use of UI components, test frameworks should adopt a similar approach. Instead of relying on base pages, consider using Component Objects and applying composition to your Page Objects. This approach ensures your framework closely mirrors the system under test
      </p>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Reduced Code Duplication:</strong> POM helps centralize the logic for interacting with page elements in a single class. This minimizes code repetition, making it easier to maintain test scripts when the UI changes.</li>
        <li><strong>Improved Test Maintainability:</strong> Since the page logic is separated into different classes, updating the UI (e.g., changing button names or locations) only requires changes to the corresponding page object class, not throughout every test script.</li>
        <li><strong>Separation of Concerns:</strong> POM separates the test logic (what you are testing) from the interaction logic (how you interact with the page), making your tests cleaner, more organized, and easier to read.</li>
      </ul>
      <h4>Cons:</h4>
      <ul>
        <li><strong>Increased Complexity for Small Projects:</strong> For small projects, the overhead of creating and maintaining page objects may outweigh the benefits. In these cases, a simpler approach may be more appropriate.</li>
        <li><strong>Dependency on UI Structure:</strong> If the UI changes frequently, maintaining page objects can become time-consuming. In these cases, consider using more flexible selectors or alternative testing strategies.</li>
        <li><strong>Over-Abstraction:</strong> Overusing the Page Object Model can lead to overly complex test code, making it harder to understand and maintain. Be cautious of creating unnecessary levels of abstraction.
      </ul>
      <h4>Conclusion:</h4>
      <p>The Page Object Model (POM) can be an effective design pattern, especially for large and complex applications. However, it's important to be mindful of the potential drawbacks and strike a careful balance between principles like Don't Repeat Yourself (DRY) and Keep It Simple, Stupid (KISS). By considering these principles,
      POM can still be a valid and valuable choice for structuring your test code, as long as you apply it thoughtfully. Alternatively, if your application primarily consists of components, you could also apply the functional helper pattern</p>
      `,
  },
  {
    name: 'Functional Helpers',
    ring: 'Adopt',
    quadrant: 'Techniques',
    isNew: 'FALSE',
    status: 'Moved In',
    description: `
    <h4>Description</h4>
    <p>
      Functional helpers are a lightweight approach to interacting with web page elements in automated tests. Rather than abstracting interactions through page object classes, functional helpers use standalone functions to perform actions directly on the page (e.g., clicking buttons, filling out forms). This approach capitalizes on the composability of modern testing frameworks like Playwright and Cypress, where you directly call functions that interact with elements.
      While this approach offers a simpler structure compared to Page Object Models (POM), it can quickly lead to tests that lack clear structure and organization, especially in larger applications. Without careful management, functional helpers can lead to a lack of separation of concerns, where the test logic becomes tightly coupled with how the page is interacted with, making tests harder to read and maintain.
    </p>
    <h4>Pros:</h4>
    <ul>
      <li><strong>Simplicity:</strong> Functional helpers focus on straightforward, easy-to-understand functions that interact directly with elements, reducing the need for complex abstractions like base page classes.</li>
      <li><strong>Better Debugging:</strong> Since functional helpers are simple and typically self-contained, they are easier to debug. Test failures can be traced directly to the helper function without needing to navigate through multiple layers of abstraction.</li>
      <li><strong>Flexibility and Reusability:</strong> Tests become more flexible because functional helpers allow for easy composition and reuse of actions across different scenarios.</li>
    </ul>
    <h4>Cons:</h4>
    <ul>
      <li><strong>Harder to Read and Maintain:</strong> One of the key challenges with functional helpers is that they often lack clear separation of concerns. In large tests, this can make it difficult to distinguish between what you're testing (business logic) and how you're interacting with the page (UI logic). This overlap can make tests harder to read, especially when tests grow in complexity.</li>
      <li><strong>Lack of Structure and Organization:</strong> In larger applications, functional helpers might lead to disorganized code. While functional helpers might be effective for small, isolated tests, when tests begin to scale, the lack of a cohesive structure may lead to repetition, lack of context, and difficulty in understanding test scenarios.</li>
      <li><strong>Potential for Code Duplication:</strong> Without a clear abstraction layer like POM, it’s easy for helper functions to be duplicated across tests. Rewriting the same interactions for different tests can increase maintenance overhead, as changes to these actions must be made across multiple places in the codebase.</li>
    </ul>
    <h4>Conclusion:</h4>
    <p>
      Functional helpers may be an appealing choice for applications that heavily rely om UI components, where their lightweight and flexible nature can improve readability and speed of development. In larger applications or where tests become more complex, the lack of clear structure and separation of concerns can lead to maintainability challenges. The coupling of test logic and interaction logic might make tests more difficult to read, especially when working with large teams or scaling the test suite. In these cases, more structured approaches Page Object Models (POM), combined with composition, may be a better fit to keep tests readable and maintainable in the long term. Both POM and Functional Helpers can be excellent choices for your automation framework.
    </p>
  `,
  },
  {
    name: 'Observability Testing',
    ring: 'Adopt',
    quadrant: 'Techniques',
    isNew: 'TRUE',
    status: 'Moved In',
    description: `
    <h4>Description</h4>
    <p>
      <strong>Observability</strong> refers to monitoring the internal state of your system by collecting and analyzing telemetry data—such as logs, metrics, and traces—during both testing and production. This provides deep insights into what happens during test execution or real-world usage. <br>
      Rather than simply knowing that a test or deployment failed, Observability enables you to determine why it failed and where in the system the issue occurred. This supports rapid diagnosis, root cause analysis, and validation of system behavior under real conditions. <br>
      While observability has its roots in production monitoring, its application in testing is now becoming increasingly relevant in automated testing, especially within distributed systems and CI/CD pipelines. Integrating observability early in the software lifecycle (e.g., in test or staging environments) helps teams prepare for full lifecycle observability. It lays the foundation for practices like <strong>Progressive Delivery</strong> and helps to uncover bugs earlier, pinpoint test flakiness, and even detect problems in the test environment itself.
    </p>

    <p>
      Examples of common open-source tools and frameworks include:
      <ul>
        <li><strong>Tracetest:</strong> Enables trace-based testing using OpenTelemetry, allowing assertions on spans and integration with tools like Jaeger and Grafana.</li>
        <li><strong>Malabi:</strong> A trace-based testing library for Node.js applications that captures OpenTelemetry traces automatically during integration tests.</li>
        <li><strong>Prometheus:</strong> A metrics collection and alerting toolkit widely used for monitoring performance.</li>
        <li><strong>Grafana:</strong> A visualization platform often paired with Prometheus for real-time dashboarding.</li>
        <li><strong>Jaeger/Grafana Tempo:</strong> Tools for distributed tracing and analyzing request paths across services.</li>
        <li><strong>OpenSearch:</strong> A log and trace analysis engine built on Elasticsearch, often used with Kibana-style dashboards.</li>
        <li><strong>SigNoz:</strong> A unified observability platform supporting metrics, traces, and logs in one UI.</li>
      </ul>
    </p>

    <h4>Pros:</h4>
    <ul>
      <li><strong>Faster Diagnosis of Failures:</strong> By capturing detailed logs and trace information during test execution, teams can quickly identify the root cause of issues without reproducing them manually.</li>
      <li><strong>Improved Test Confidence:</strong> Helps differentiate between genuine application bugs and environment-related flakiness or instability in the test setup.</li>
      <li><strong>Insight into Trends:</strong> Allows teams to monitor long-term trends in test behavior and system reliability, offering data-driven insights for test optimization.</li>
      <li><strong>Enhanced Developer Feedback:</strong> Developers receive clearer signals from test failures, accelerating the development and debugging cycle.</li>
    </ul>

    <h4>Cons:</h4>
    <ul>
      <li><strong>Setup Complexity:</strong> Implementing observability requires consistent logging and monitoring infrastructure, which may be difficult to implement into legacy systems.</li>
      <li><strong>Tooling Overhead:</strong> Integrating observability tools (e.g., tracing systems, log aggregators) may require additional resources and operational support.</li>
      <li><strong>Data Volume:</strong> If you do not manage the volume of the data properly, it will become overwhelming and make analysis harder rather than easier.</li>
    </ul>

    <h4>Conclusion:</h4>
    <p>
      Observability is a great enabler for modern test strategies, especially in distributed, asynchronous, or event-driven systems. While often associated with production monitoring, its application during automated testing unlocks a deeper understanding of failure modes and test stability. <br>
      We recommend adopting observability practices in any system where test reliability, fast debugging, or system-level visibility are important. However, teams should carefully consider the infrastructure and skills required to implement it effectively. When integrated properly, observability transforms test automation from a black-box signal into a rich, actionable feedback loop.
    </p>
  `,
  },
  {
    name: 'Contract Testing',
    ring: 'Assess',
    quadrant: 'Techniques',
    isNew: 'TRUE',
    status: 'Moved In',
    description: `
      <h4>Description</h4>
      <p>
      Contract testing is a methodology for ensuring that two separate systems (such as two microservices) are compatible and can communicate with one another. It captures the interactions that are exchanged between each service, storing them in a contract, which then can be used to verify that both parties adhere to it. Contract testing goes beyond schema testing, requiring both parties to come to a consensus on the allowed set of interactions and allowing for evolution over time.
      </p>
      <p>
        What sets this form of testing apart from other approaches that aim to achieve the same thing is that each system can be tested independently from the other and that the contract is generated by the code itself, meaning the contract is always kept up to date.
      </p>
      <p>One of the tools mostly used for contract testing is Pactflow</p>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Fast</strong> Contract tests run fast and are not reliant on other systems Easy to maintain</li>
      </ul>
      <h4>Cons:</h4>
      <li><strong>Sharing:</strong> Contracts have to be shared between producer and consumer</li>
      <h4>Conclusion:</h4>
      <p>Contract Testing is a great addition to any project that deals with large-scale and highly distributed application(s). Integration issues between consumers and providers can be detected early without the need for setting up expensive integration environments. We would definitely recommend assessing contract testing as a technique.</p>
      `,
  },
  {
    name: 'BDD',
    ring: 'Adopt',
    quadrant: 'Techniques',
    isNew: 'FALSE',
    status: 'No Change',
    description: `
      <h4>Description</h4>
      <p>
        <strong>BDD</strong> (Behavior Driven Development) is a technique intended to prove that the desired behaviour of the application works as part of the development cycle. Acceptance criteria are written as a test to be automated. This makes it one of the easier Test First Approaches. <br>
        The technique is mostly used to enable easier collaboration between developer, tester, and (business) users. Applying BDD focusses on creating testable user stories that require a lower cognitive load from the developer. <br>
        Most popular automation frameworks support a BDD workflow. Tools that explicitly focus on BDD include:
      </p>
      <p>
        <ul>
          <li>Cucumber / Reqnroll (successor of Specflow)</li>
          <li>Behave / JBehave</li>
        </ul>
      </p>
      <h4>Pros:</h4>
      <ul>
        <li>BDD allows spec-files to serve as both living documented requirements and tests.</li>
        <li>BDD drives user stories to be clearly defined because of the testable acceptance criteria.</li>
        <li>BDD focusses on reducing functional complexity for the developers, reducing cognitive load.</li>
      </ul>
      <h4>Cons:</h4>
      <ul>
            <li>Doing BDD correctly is really difficult. It requires strong collaboration between developers, testers, and business stakeholders, which can be challenging to establish and maintain.</li>
            <li>BDD, in most projects, is often misused as merely a way to write tests in a human-readable language. Without the collaborative focus on shared understanding and behavior specification, it holds little value.</li>
            <li>In some projects, BDD is simplified to using Cucumber and is misinterpreted as a low-code automation solution, appealing to teams as a shortcut to start automating. However, BDD's purpose is not to simplify automation but to foster collaboration and ensure a shared understanding of the system's expected behaviors.</li>
      </ul>
      <h4>Conclusion:</h4>
      <p>
        While BDD is widely adopted, it is rarely done right. <br>
        In our experience, BDD is rarely applied for its intended purpose—facilitating collaboration and ensuring shared understanding between developers, testers, and business stakeholders. Instead, it often becomes an additional layer of complexity, where the Gherkin syntax adds little value beyond traditional testing approaches. <br>
        Where BDD is done right we see user stories delivered to production faster and a reduced need for other acceptance level tests. <br>
        We recommend BDD when it is supported by business stakeholders, developers and testers. In other circumstances it is a wasted effort.
      </p>
    `,
  },
  {
    name: 'TDD',
    ring: 'Assess',
    quadrant: 'Techniques',
    isNew: 'FALSE',
    status: 'No Change',
    description: `
      <h4>Description</h4>
      <p>
        <strong>TDD</strong> or Test Driven Development is a practice used in software development to make quality, neat, and errorless code, especially when there is change bound to happen later on. As the name suggests, TDD is a way to do development that is driven by tests rather than first writing your code and adding unit tests afterward.
      </p>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Test coverage:</strong> By writing tests before you code, you know all your written code is covered by unit tests</li>
        <li><strong>Quality:</strong> The quality of your code will improve because you need to think about scenarios and functionality before you write a single line of code</li>
      </ul>
      <h4>Cons:</h4>
      <ul>
        <li><strong>Learning curve</strong> It can be difficult to start with TDD, it takes time and effort to invest in this technique.</li>
      </ul>
      <h4>Conclusion:</h4>
      <p>TDD can dramatically improve the quality of your code as it forces you to think about tests before actually writing code and gives you rapid feedback when making changes.  We would recommend evaluating if TDD fits within the context of your organization, e.g. if your product is relatively well-defined and doesn’t change in extreme forms very rapidly.</p>
    `,
  },
  {
    name: 'Visual Regression Testing',
    ring: 'Trial',
    quadrant: 'Techniques',
    isNew: 'FALSE',
    status: 'No Change',
    description: `
      <h4>Description</h4>
      <p>
       If your team or company has a static component library, performing Visual Regression tests can provide massive value by providing visual validation of these components on every iteration.  Obviously, you could detect these differences manually but sometimes they’re extremely small and it’s quite time-consuming. Most tools offer a pixel-by-pixel comparison and work similarly. The difficulty comes with searching for a threshold that’s a perfect tradeoff between not having flaky tests, missed regression, or having to update the snapshots all the time.
      </p>
      <p>
        Examples of popular visual testing tools are
        <ul>
          <li>Chromatic</li>
          <li>Percy</li>
          <li>Test tool implementations, e.g. Playwright, WebdriverIO</li>
          <li>Applitools</li>
        </ul>
      </p>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Ease of Implementation:</strong> Many visual testing tools are simple to set up and integrate into existing workflows.</li>
        <li><strong>Automated Visual Monitoring:</strong> By using tools you can monitor visual regression more easily than by doing it manually</li>
      </ul>
      <h4>Cons:</h4>
      <ul>
        <li><strong>Flakiness:</strong> Visual comparisons can result in flaky tests if thresholds are not correctly set leading to time-consuming debugging tasks.</li>
        <li><strong>Pricing:</strong> High quality tools are often paid and doing a lot of comparisons could increase the licensing costs a lot.</li>
      </ul>
      <h4>Conclusion:</h4>
      <p>
        Visual Regression Testing can be very beneficial when implemented correctly, preventing unnoticed UI changes and improving overall design consistency. However, improper setup can turn it into a time sink.
        <br/>
        For teams using Storybook, visual testing is an especially natural fit, as it enables seamless validation of UI components in isolation. If your project includes a well-defined, static component library, investing in visual regression testing is highly recommended. Otherwise, teams may find better value in other QA activities.
      </p>
    `,
  },
  {
    name: 'Mutation testing',
    ring: 'Trial',
    quadrant: 'Techniques',
    isNew: 'FALSE',
    status: 'No Change',
    description: `
      <h4>Description</h4>
      <p>
        Conceptually, mutation testing is straightforward. Using specialized tools, small changes (mutations) are made to the source code of an application, creating a "mutant." When tests are executed against this mutant, the expectation is that one or more tests will fail, indicating that the mutation introduced an incorrect system behavior. This process is referred to as "killing the mutant." If no tests fail, it is a clear indication that the mutated part of the application lacks sufficient test coverage. Mutation testing is often referred to as "testing the tests."
      </p>
      <p>
        Here are a few examples of mutation testing tools (not an exhaustive list):
        <ul>
          <li>PIT (pitest.org)</li>
          <li>Arcmutate (arcmutate.com)</li>
          <li>Stryker Mutator (stryker-mutator.io)</li>
        </ul>
      </p>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Ensures Test Quality:</strong> Mutation testing helps determine not just test coverage but also test effectiveness, ensuring your tests can detect actual faults in the code.</li>
        <li><strong>Identifies Weak Tests:</strong> It can highlight weak or redundant tests that might be passing but are not effectively validating the application's behavior.</li>
      </ul>
      <h4>Cons:</h4>
      <ul>
        <li>Mutation testing can be computationally expensive, especially in large projects, as it requires running the test suite multiple times for each mutation.</li>
        <li>It may require additional configuration or tuning to integrate seamlessly with your existing testing pipelines</li>
      </ul>
      <h4>Conclusion:</h4>
      <p>
        Mutation Testing is an amazing technique to validate if you can actually rely on your tests to inform you of changed behavior. Traditional test coverage (i.e. line, statement, branch, etc.) measures only which code is executed by your tests. It does not check that your tests are actually able to detect faults in the executed code. It is therefore only able to identify code that is definitely not tested.
        Mutation testing is much better, as it is actually able to detect whether each
        statement is meaningfully tested. Therefore giving an accurate report on the quality of your tests.
        <br/>We would definitely recommend checking it out!
      </p>
    `,
  },
  {
    name: 'Component testing',
    ring: 'Trial',
    quadrant: 'Techniques',
    isNew: 'FALSE',
    status: 'FALSE',
    description: `
      <h4>Description</h4>
      <p>
       Component testing focuses on verifying the functionality of individual components or modules in isolation, independent of the overall system. This approach is particularly effective in modern, modular development practices, such as those using frameworks like React, Angular, or Vue. By isolating components, developers can ensure that each part behaves as expected, enabling faster and more reliable integration into larger systems.
      </p>
      <h4>Pros:</h4>
      <ul>
      <li><strong>Proven Effectiveness:</strong> Ensures each component functions correctly, reducing bugs during integration.</li>
      <li><strong>Fast Feedback Loop:</strong> Quickly detects issues, enabling rapid fixes during development.</li>
      <li><strong>Improved Debugging:</strong> Failures are scoped to the individual component, simplifying root-cause analysis.</li>
      </ul>
      <h4>Cons:</h4>
      <ul>
      <li><strong>Requires Complementary Testing:</strong> Must be supplemented with integration and end-to-end tests to ensure system-wide functionality.</li>
      <li><strong>Initial Setup Overhead:</strong> Requires tools and mocks for setup, though this effort pays off in the long term.</li>
      <li><strong>Limited Context:</strong> Testing in isolation might miss issues caused by component interactions.</li>
      </ul>
      <h4>Conclusion:</h4>
      <p>Component testing is a proven practice that delivers significant value, especially in projects using modular architectures. However, it should complement, not replace, unit testing (UT). Each layer of testing has its own purpose, and overlapping coverage between unit and component tests should be avoided to prevent redundancy. Additionally, component testing can be effectively combined with visual testing to verify both behavior and UI consistency. We strongly recommend adopting component testing for immediate use wherever it fits project requirements, as part of a comprehensive and efficient testing strategy.</p>
    `,
  },
  {
    name: 'Vibe Coding',
    ring: 'Trial',
    quadrant: 'Techniques',
    isNew: 'TRUE',
    status: 'Moved In',
    description: `
      <h4>Description</h4>
      <p>
      Vibe Coding is an innovative approach that leverages artificial intelligence and natural language processing to write and generate code. Instead of manually coding, developers and QA engineers utilize AI-powered tools to translate written natural language instructions into functional code snippets, functions, or even entire applications.
      This approach transforms the traditional coding process, making it more accessible, (possibly) faster, and aligned with human language, reducing the barriers for non-experts and increasing productivity for experienced developers.
      </p>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Accelerated Development:</strong> Significantly reduces the time required to write boilerplate code or implement features.</li>
        <li><strong>Fast(er) Refactoring:</strong> Refactor existing codebases more efficiently by using AI-generated suggestions.</li>
        <li><strong>Lower Barrier to Entry:</strong> Empowers non-developers or less experienced team members to contribute through natural language prompts.</li>
      </ul>
      <h4>Cons:</h4>
      <ul>
        <li><strong>AI is not always accurate:</strong> Generated code may require review, multiple iterations and adjustment to be correct, especially in large(r) existing codebases.</li>
        <li><strong>Potential for Over-Reliance:</strong> Developers may become overly dependent on AI tools, leading to a decline in traditional coding skills and problem-solving abilities.</li>
        <li><strong>Potential for Technical Debt, security and code quality issues:</strong> code might work initially but can sometimes be inefficient, difficult to understand, or hard to maintain in the long run, especially for complex systems. Without careful human review and refinement, it can lead to "spaghetti code" and future headaches. It might also overlook critical security measures, such as proper input validation or error handling. Relying solely on AI without thorough security reviews can introduce vulnerabilities into applications, leading to potential hacks or data breaches. This all refers to often missing the correct context which is not provided.</li>
        <li><strong>Potential for Ambiguity:</strong> Natural language instructions can sometimes be vague, leading to unintended code outputs.</li>
      </ul>
      <h4>Conclusion:</h4>
      <p>
      Vibe coding could potentially represent a paradigm shift in software development, enabling developers to focus more on high-level design and problem-solving rather than low-level coding tasks. 
      However, it is important to approach this technique with caution, AI generated code is not always accurate and may require multiple iterations to get right. This is exactly where it gets difficult, less experienced developers may not be able to determine whether the generated code is correct or not, leading to potential issues in the codebase.
      Simply put, Vibe coding can enhance productivity but a fool with a tool is still a fool. Vibe coding can be a powerful tool to create boilerplate code, refactor existing code, or even write entire applications. However, it should not be seen as a replacement for traditional coding practices, especially in complex systems where understanding the context and nuances of the code is crucial.
      We recommend assessing the potential of vibe coding in your organization, especially if you have a large codebase or complex systems. It can be a valuable tool for experienced developers, but it should not replace traditional coding practices entirely.
      </p>
    `,
  },
]

exports.techniques = {
  content,
}
