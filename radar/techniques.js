const content = [
  {
    name: "Contract Testing",
    ring: "Assess",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "Moved In",
    description: `
      <h4>Description</h4>
      <p>
      Contract testing is a methodology for ensuring that two separate systems (such as two microservices) are compatible and can communicate with one another. It captures the interactions that are exchanged between each service, storing them in a contract, which then can be used to verify that both parties adhere to it. Contract testing goes beyond schema testing, requiring both parties to come to a consensus on the allowed set of interactions and allowing for evolution over time.
      </p>
      <br/>
      <p>
        What sets this form of testing apart from other approaches that aim to achieve the same thing is that each system can be tested independently from the other and that the contract is generated by the code itself, meaning the contract is always kept up to date.
      </p>
      <br/>
      <p>One of the tools mostly used for contract testing is Pactflow</p>
      <br/>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Fast</strong>&nbsp;Contact tests run fast and are not reliant on other systems Easy to maintain</li>
        Easy to maintain
      </ul>
      <br/>
      <br/>
      <h4>Cons:</h4>
      <li><strong>Sharing</strong> Contracts have to be shared between producer and consumer</li>
      <br/>
      <h4>Conclusion</h4>
      <p>Contract Testing is a great addition to any project that deals with large-scale and highly distributed application(s). Integration issues between consumers and providers can be detected early without the need for setting up expensive integration environments. We would definitely recommend assessing contract testing as a technique.</p>
    `
  },
  {
    name: "BDD",
    ring: "Hold",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "No Change",
    description: `
      <h4>Description</h4>
      <p>
        <strong>BDD</strong>, Behavior Driven Development is a technique mostly used to enable easier collaboration between developer, tester, and (business) users. Stories (features) are written in a human-readable form, focusing on the behavior of the system. Usually, these files are written in Gherkin, a special syntax used in BDD to allow tools like Cucumber and SpecFlow to automatically validate the “behaviors” encoded for a process.
        Every step in the stories or feature files are then translated to actions in the application under test via Page Object, Steps and Actions.
      </p>
      <p>
        Examples of popular BDD frameworks are
        <ul>
          <li>• Cucumber</li>
          <li>• Behave / JBehave</li>
          <li>• Specflow</li>
        </ul>
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul><li>BDD allows spec-files to serve as both living documented requirements and tests.</li></ul>
      <br/>
      <br/>
      <h4>Cons:</h4>
      <ul><li>Doing BDD correctly is actually extremely difficult. It requires strong collaboration between developers, testers, and business stakeholders, which can be challenging to establish and maintain.
         BDD, in most projects, is often misused as merely a way to write tests in a human-readable language. Without the collaborative focus on shared understanding and behavior specification, it holds little value.
         In some projects, BDD is misinterpreted as a low-code automation solution, appealing to teams as a shortcut to start automating. However, BDD's purpose is not to simplify automation but to foster collaboration and ensure a shared understanding of the system's expected behaviors.
</li></ul>
      <br/>
      <br/>
      <h4>Conclusion</h4>
      <p>
        While BDD is widely adopted, we do not recommend its use in most cases. In our experience, BDD is rarely applied for its intended purpose—facilitating collaboration and ensuring shared understanding between developers, testers, and business stakeholders. Instead, it often becomes an additional layer of complexity, where the Gherkin syntax adds little value beyond traditional testing approaches. Furthermore, tools like Cucumber often restrict access to the full feature set of underlying testing frameworks, leading to inefficient use of resources. For these reasons, we would not recommend starting new projects with BDD.
      </p>
    `
  },
  {
    name: "TDD",
    ring: "Assess",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "No Change",
    description: `
      <h4>Description</h4>
      <p>
        <strong>TDD</strong> or Test Driven Development is a practice used in software development to make quality, neat, and errorless code, especially when there is change bound to happen later on. As the name suggests, TDD is a way to do development that is driven by tests rather than first writing your code and adding unit tests afterward.
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Test coverage</strong>&nbsp;By writing tests before you code, you know all your written code is covered by unit tests</li>
        <li><strong>Quality</strong>&nbsp;The quality of your code will improve because you need to think about scenarios and functionality before you write a single line of code</li>
      </ul>
      <br/>
      <br/>
      <h4>Cons:</h4>
      <ul>
        <li><strong>Learning curve</strong>&nbsp;It can be difficult to start with TDD, it takes time and effort to invest in this technique.</li>
      </ul>
      <br/>
      <br/>
      <h4>Conclusion</h4>
      <p>TDD can dramatically improve the quality of your code as it forces you to think about tests before actually writing code and gives you rapid feedback when making changes.  We would recommend evaluating if TDD fits within the context of your organization, e.g. if your product is relatively well-defined and doesn’t change in extreme forms very rapidly.</p>
    `
  },
  {
    name: "Visual Regression Testing",
    ring: "Hold",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "No Change",
    description: `
      <h4>Description</h4>
      <p>
       If your team or company has a static component library, performing Visual Regression tests can provide massive value by providing visual validation of these components on every iteration.  Obviously, you could detect these differences manually but sometimes they’re extremely small and it’s quite time-consuming. Most tools offer a pixel-by-pixel comparison and work similarly. The difficulty comes with searching for a threshold that’s a perfect tradeoff between not having flaky tests, missed regression, or having to update the snapshots all the time.
      </p>
      <br/>
      <p>
        Examples of popular visual testing tools are
        <ul>
          <li>• Chromatic</li>
          <li>• Percy</li>
          <li>• Test tool implementations, e.g. Playwright, WebdriverIO</li>
          <li>• Applitools</li>
        </ul>
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Ease of Implementation:</strong>&nbsp;Many visual testing tools are simple to set up and integrate into existing workflows.</li>
        <li><strong>Automated Visual Monitoring:</strong> By using tools you can monitor visual regression more easily than by doing it manually</li>
      </ul>
      <br/>
      <br/>
      <h4>Cons:</h4>
      <ul>
        <li><strong>Flakiness:</strong>&nbsp;Visual comparisons can result in flaky tests if thresholds are not correctly set leading to time-consuming debugging tasks.</li>
        <li><strong>Pricing</strong> High quality tools are often paid and doing a lot of comparisons could increase the licensing costs a lot.</li>
      </ul>
      <br/>
      <br/>
      <h4>Conclusion</h4>
      <p>
        Visual Regression Testing can be very beneficial when implemented correctly, preventing unnoticed UI changes and improving overall design consistency. However, improper setup can turn it into a time sink.
        <br/>
        For teams using Storybook, visual testing is an especially natural fit, as it enables seamless validation of UI components in isolation. If your project includes a well-defined, static component library, investing in visual regression testing is highly recommended. Otherwise, teams may find better value in other QA activities.
      </p>
    `
  },
  {
    name: "PBT (property-based testing)",
    ring: "Trial",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "No Change",
    description: `
      <h4>Description</h4>
      <p>
        Property-based testing is a powerful testing methodology that allows developers to automatically generate and test a wide range of input data against specified properties of the software under test. Unlike traditional example-based testing, which uses specific, predefined inputs, property based testing explores the entire input space to uncover edge cases and potential bugs.
      </p>
      <br/>
      <p>
        Examples of frameworks
        <ul>
          <li>• QuickCheck</li>
          <li>• Hypothesis</li>
          <li>• ScalaCheck</li>
        </ul>
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul>
        <li><i>unknown</i></li>
      </ul>
      <br/>
      <br/>
      <h4>Cons:</h4>
      <ul>
        <li><i>unknown</i></li>
      </ul>
      <br/>
      <br/>
      <h4>Conclusion</h4>
      <p>
        Property-based testing is a robust and versatile testing methodology that complements traditional example-based testing.
        We would like to trial this technique and give a better judgment in a follow-up techradar.
      </p>
    `
  },
  {
    name: "Mutation testing",
    ring: "Hold",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "No Change",
    description: `
      <h4>Description</h4>
      <p>
        Mutation testing is conceptually quite simple.<br/>
        Faults (or mutations) are automatically seeded into your code, then your tests are run. If your tests fail then the mutation is killed, if your tests pass then the mutation lived.<br/>
        The quality of your tests can be gauged from the percentage of mutations killed.
      </p>
      <br/>
      <p>
        A short list of mutation testing tools (incomplete)
        <ul>
          <li>PIT (pitest.org)</li>
          <li>Arcmutate (arcmutate.com)</li>
          <li>Stryker Mutator (stryker-mutator.io)</li>
        </ul>
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Detect faults</strong>&nbsp;Mutation testing can check if your (unit) tests actually detects faults</li>
      </ul>
      <br/>
      <h4>Cons:</h4>
      <ul>
        <li><i>none</i></li>
      </ul>
      <br/>
      <h4>Conclusion</h4>
      <p>
        Traditional test coverage (i.e line, statement, branch, etc.) measures only which code is executed by your tests.
        It does not check that your tests are actually able to detect faults in the executed code. It is therefore only able to identify code that is definitely not tested.<br/>
        Mutation testing is much better, as it is actually able to detect whether each statement is meaningfully tested. Therefore giving an accurate report on the quality of your tests.
      </p>
    `
  },
  {
    name: "Shift Left",
    ring: "Adopt",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "FALSE",
    description: `
      <h4>Description</h4>
      <p>
        Description
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul><li><strong>pro</strong> description</li></ul>
      <br/>
      <h4>Cons:</h4>
      <ul><li><strong>con</strong> description</li></ul>
      <br/>
      <h4>Conclusion</h4>
      <p>This is the conclusion</p>
    `
  },
  {
    name: "Shift Right",
    ring: "Trial",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "FALSE",
    description: `
      <h4>Description</h4>
      <p>
        Description
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul><li><strong>pro</strong> description</li></ul>
      <br/>
      <h4>Cons:</h4>
      <ul><li><strong>con</strong> description</li></ul>
      <br/>
      <h4>Conclusion</h4>
      <p>This is the conclusion</p>
    `
  },
  {
    name: "Component testing",
    ring: "Trial",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "FALSE",
    description: `
      <h4>Description</h4>
      <p>
        Description
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul><li><strong>pro</strong> description</li></ul>
      <br/>
      <h4>Cons:</h4>
      <ul><li><strong>con</strong> description</li></ul>
      <br/>
      <h4>Conclusion</h4>
      <p>This is the conclusion</p>
    `
  },
]

exports.techniques = {
  content,
}
