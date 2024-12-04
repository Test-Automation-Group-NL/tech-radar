const content = [
  {
    name: "Cucumber",
    ring: "Hold",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "Moved Out",
    description: `
      <h4>Description</h4>
      <p>
        Aquired by Smartbear a few years ago, they kicked out the last developer, so it's not maintained anymore. Please don't use it anymore because it sucks like...
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
    name: "Contract Testing",
    ring: "Assess",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "Moved In",
    description: `
      <h4>Description</h4>
      <p>
        Contract testing is a methodology for ensuring that two separate systems (such as two microservices) are compatible and can communicate with one other.
        It captures the interactions that are exchanged between each service, storing them in a contract, which then can be used to verify that both parties adhere to it.
        Contract testing goes beyond schema testing, requiring both parties to come to a consensus on the allowed set of interactions and allowing for evolution over time.
      </p>
      <br/>
      <p>
        What sets this form of testing apart from other approaches that aim to achieve the same thing is that each system can be tested independently from the other and that
        the contract is generated by the code itself, meaning the contract is always kept up to date.
      </p>
      <br/>
      <p>One of the tools mostly used for contract testing is Pactflow</p>
      <br/>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Fast</strong>&nbsp;Contact tests run fast and are not relient on other systems</li>
        <li><strong>Easy to maintain</strong>&nbsp;</li>
      </ul>
      <br/>
      <h4>Cons:</h4>
      <li><strong>Sharing</strong>&nbsp;Contracts have to be shared between producer and consumer</li>
      <br/>
      <h4>Conclusion</h4>
      <p>We think contract testing can be used to complement unit and integration tests. It can give early warnings if or when systems won't be able to communicate with eachother.</p>
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
        <strong>BDD</strong>, Behavior Driven Development is a technique mostly used to enable easier collaboration between developer, tester and (business) users.
        Stories (features) are written in a human readable form, focussed on behavior of the system. Usually, these files are written in Gherkin, a special syntax used in
        BDD to allow tools like Cucumber and SpecFlow to automatically validate the “behaviors” encoded for a process.<br />
        Every step in the stories or feature files are then translated to actions in the application under test via Page Object, Steps and Actions.
      </p>
      <p>
        Examples of popular BDD frameworks are
        <ul>
          <li>Cucumber</li>
          <li>Behave / JBehave</li>
          <li>Serenity BDD</li>
          <li>Specflow</li>
        </ul>
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul><li><strong>pro</strong> description</li></ul>
      <br/>
      <h4>Cons:</h4>
      <ul><li><strong>con</strong> description</li></ul>
      <br/>
      <h4>Conclusion</h4>
      <p>
        Although this technique is widely used we don't recommend to use this technique anymore. Maintainability and ease of debugging / reporting are reasons to use other techniques and tools
        when testing you application. We notice that collaboration is not really happening at a lot of companies we work for. Acceptance criteria are mostly written by business stakeholder together
        with the dev team, but writing complete stories are not written by them. And this will then be the task of, for instance, the tester, negating the supposed pro of using this technique.
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
    name: "Visual Regression Testing",
    ring: "Hold",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "No Change",
    description: "<p>Is there a future in (AI driven) visual regression testing? Or are we still just scratching the surface of a technique not yet completely adopted</p>"
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
    name: "Mutation testing",
    ring: "Hold",
    quadrant: "Techniques",
    isNew: "FALSE",
    status: "No Change",
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
  {
    name: "Observability",
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
]

exports.techniques = {
  content,
}
