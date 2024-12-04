const content = [
  {
    name: 'Postman',
    ring: 'Hold',
    quadrant: 'Tools',
    isNew: 'FALSE',
    status: 'FALSE',
    description: `
   <H4>Description:</H4>
<p>Postman is a tool that that allows users to interact with API's and supports the most used variants such as
    RESTGraphQL and SOAP. It's easy to use interface allows just about anyone to perform tests quickly. Using
    the Newman CLI, Postman does offer integration in CI/CD pipelines. It allows for writing tests in Javascript
    directly in
    Postman.</p>
<H4>Pros</h4>
<ul>
    <li><strong>User friendly</strong> Regardless of technical skills, most testers should find their way in Postman
        very quickly</li>
    <li><strong>Request History</strong> It maintains a history of requests, which is especially useful when testing an
        API and can make reperoduction of potential issues easier.</li>
    <li><strong>Environment Variables</strong> Postman allows you to eaily set and change environment variables</li>
</ul>
<H4>Cons</h4>
<ul>
    <li><strong>Developers usually prefer more code-oriented tools:</strong> In most cases it makes sense to store
        API
        tests as close to the API source as possible. In that case it might make sense to use the same
        language
        that the API is built in, which is usually not Javascript.</li>
    <li><strong>Performance</strong> Especially when dealing with very large API's and datasets, the Postman UI can
        become less responsive. </li>
    <li><strong>Paid:</strong> Postman is not free for enterprises and with many other very good alternatives
        around,</li>
</ul>
<h4>Conclusion:</h4>
<p>Postman is a good choice, especially when Testers lack development skills. If testers do have these skills, there are
    better alternatives We'd would not recommend starting a new project withpostman, but if you're already using it we
    wouldn't directly invest in a migration. An alternative could be Yaak with a similar feature set and easy to use interface. Also not free though.</p>
    `,
  },
  {
    name: 'Storybook',
    ring: 'Trial',
    quadrant: 'Tools',
    isNew: 'False',
    status: 'FALSE',
    description: `
    <H4>Description:</H4>
<p>Storybook is a frontend workshop for building UI components and pages in isolation. Storybook can be used with React,
Vue, Angular, Web Components and more. Storybook then serves as a library of components that various stakeholders can
interact with.</p>
<H4>Pros</h4>
<ul>
    <li><strong>Develop in Isolation</strong> No need to spin up an entire app.</li>
    <li><strong>Uniform Apps</strong> Makes it easier to create a large number of apps with a uniform look & feel and reduced effort in implementing reusable components.</li>
    <li><strong>Testability</strong> Using standardized UI components makes UI testing, generally, easier.</li>
</ul>
<H4>Cons</h4>
<ul>
    <li><strong>Expensive</strong> Creating UI library is expensive and likely not worth it for smaller projects.</li>
    <li><strong>Steep Learning Curve</strong> Initial setup tends to be challenging. Story book has a steep learning curve when maximizing it's use.</li>
</ul>
<h4>Conclusion:</h4>
<p>Especially in larger companies, Storybook can provide a lot of value and reusability but it's doesn't come without an
investment. For larger projects we would recommend checking out Storybook, for projects with only a few applications it
is likely not worth the effort.</p>
    `,
  },
  {
    name: 'Argo CD',
    ring: 'Adopt',
    quadrant: 'Tools',
    isNew: 'False',
    status: 'FALSE',
    description: `
<H4>Description:</H4>
<p>ArgoCD is a Continuous Deployment tool for Kubernetes. Unlike other tools that generally use a push mechanism to deploy,
ArgoCD can also pull in updated deployments from remote repositories and directly update them in a Kubernetes namespace.
It allows DevOps teams to implement GitOps.</p>
<H4>Pros</h4>
<ul>
    <li><strong>Continuous Deployment</strong> Actively monitor deployments for desired updates and automatically deploy them</li>
    <li><strong>Easy Rollbacks</strong> to previous state.</li>
</ul>
<H4>Cons</h4>
<ul>
    <li><strong>Scaling</strong>can become quite complex.</li>
    <li><strong>Only monitors resources it deploys</strong> it can't manage resources managed by deployed resources.</li>
</ul>
<h4>Conclusion:</h4>
<p>Even though ArgoCD does come with it's challenges, it's GitOps style way of working and integration with Helm and
Kustomize make it an excellent kandidate for those having to manage a large number of deployments on kubernetes
clusters.</p>
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
<p>Chromatic is a SaaS service that offloads the vast majority of effort for Visual Regression Testing. By automatically
    creating snapshots for every single story in Storybook and providing developers with an easy and intuitive interface
    to
    detect and accept changes. a free tier is available.</p>
<H4>Pros</h4>
<ul>
    <li><strong>Automatically</strong> generate tests for each individual story with Storybook</li>
    <li><strong>Updating snapshots</strong> is extremely easy and does not require jumping through hoops with docker containers.</li>
    <li><strong>Setup</strong> is extremely easy and straight forward.</li>
</ul>
<H4>Cons</h4>
<ul>
    <li><strong>Subscription</strong> required to unlock all features and browsers..</li>
    <li><strong>Requires storybook</strong> to work.
    </li>
</ul>
<h4>Conclusion:</h4>
<p>If you're already using Storybook, checking out Chromatic seems like a no-brainer. It'll give you instant access to
visual regression testing with a limited amount of effort. If you start small you might even be able to work with the
free tier!</p>
    `,
  },
  {
    name: 'AI Assistants (such as Github Co-pilot and Jetbrains AI Assistant)',
    ring: 'trial',
    quadrant: 'Tools',
    isNew: 'False',
    status: 'FALSE',
    description: `
      <H4>Description:</H4>
<p>AI Assistants are gaining ground and for good reason! Having an AI assistant that can act as a rubber duck or even
    provide code suggestions can speed up development but it does not come without it's challenges! Having all this
    knowledge available can be beneficial</p>
<H4>Pros</h4>
<ul>
    <li><strong>Increased productivity</strong> development due to intelligent code suggestions</li>
    <li><strong>Wide support</strong> of programming languages, due to training on existing material</li>
    <li><strong>Boilerplate generation</strong> These AI's can easily generate boilerplate code to help you get started
        quickly..</li>
</ul>
<H4>Cons</h4>
<ul>
    <li><strong>Dependency Risk</strong> Relying heavily on Copilot may lead to reduced problem-solving skills and
        overdependence on automated suggestions among
        developers, especially beginners.</li>
    <li><strong>Code Quality</strong> AI Assistants still make mistakes and code they generate should never be blindly accepted without verifying the output.</li>
    <li><strong>Pricacy</strong> AI assistants are trained on public repositories and without Enterprise Subscriptions will use your code to improve their models. Enterprise solutions that do not use your code to improve its model and that filter responses based on license-types exist, but are costly. </li>
</ul>
<h4>Conclusion:</h4>
<p>Using an AI Assistant can increase productivity, but not without some serious risks. If these risks are acceptable or mitigated, we would definitely recommend trying it out!</p>
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
<p>Test containers attempts to solve complex environment configuration by providing ready made docker containers for commonly used databases, mesage brokers and/or browsers. It allows you to define these depencies as code making it easier to maintain. it supports a ton of tooling out of the box</p>
<H4>Pros</h4>
<ul>
    <li><strong>Rich tool support</strong> Over 50 commonly used databases, message brokers and other tools readily available!</li>
    <li><strong>Productivity</strong> can be increased by offloading the complexity of managing the test environment to test containers.</li>
    <li><strong>Rich support for programming languages</strong> Just about any language is supported.</li>
</ul>
<H4>Cons</h4>
<ul>
    <li><strong>Black Box</strong> Can be slightly challenging to debug the black box test containers..</li>
</ul>
<h4>Conclusion:</h4>
<p>All in all, using testcontainers for setting up dependencies is fairly easy and could create a lot of standardisation in larger projects. We would definitely recommend Adopting testcontainers if you're not using it already.</p>
    `,
  },
  {
    name: 'ReportPortal',
    ring: 'hold',
    quadrant: 'Tools',
    isNew: 'False',
    status: 'FALSE',
    description: `
      <H4>Description:</H4>
<p>ReportPortal aims to provide a Test Automation dashboard, that collects results from various test automation frameworks and uses AI to identify the potential reason for any failures. Test Engineers can then update these reasons and the AI will learn over time to improve its classifications.</p>
<H4>Pros</h4>
<ul>
    <li><strong>Real-time Dashboarding</strong>Great for monitoring large number of tests that run very frequently or even continuously.</li>
    <li><strong>AI</strong> to identify reason for test failures</li>
    <li>Support> for most commonly used test automation frameworks</li>
</ul>
<H4>Cons</h4>
<ul>
    <li><strong>Complex iniital setup</strong> Setup can be overwhelming for new users as it uses a quite a few components to make up the application.</li>
    <li><strong>Learning Curve</strong> due to its extensive options,  customization can be overwhelming </li>
</ul>
<h4>Conclusion:</h4>
<p>If a one-stop shop for test results is desired, reportPortal can be a potential candidate but we can't directly recommend it due to it's extremely complex setup. Support for On-prem/SaaS solutions is available but is fairly expensive.</p>
    `,
  },
]

exports.tools = {
  content,
}
