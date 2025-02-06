const content = [
  {
    name: 'Sauce Labs',
    ring: 'Hold',
    quadrant: 'Platforms',
    isNew: 'FALSE',
    status: 'No Change',
    description: `
      <h4>Description:</h4>
      <p>
        <strong>Sauce Labs</strong> is a cloud-based platform for cross-browser and cross-device testing, offering a virtual browser/(real)device cloud. It has been a trusted solution in the industry for years, providing extensive browser and (real) device coverage with strong documentation and support.
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Established Platform:</strong> A reliable name in the industry with a proven track record.</li>
        <li><strong>Reliable Real Device Features:</strong> While it offers fewer features for real devices compared to competitors, the existing features are more stable and reliable, making it a strong option for scaling large test suites.</li>
        <li><strong>Wide Coverage:</strong> Supports a variety of browsers and devices, making it versatile for compatibility testing.</li>
      </ul>
      <br/>
      <br/>
      <h4>Cons:</h4>
      <ul>
        <li><strong>Delayed iOS Support:</strong> Newer iOS versions, such as iOS 16, 17, and 18, have experienced significant delays in adoption, limiting testers' ability to validate apps against the latest simulators.</li>
        <li><strong>Lack of Performant Infrastructure:</strong> Sauce Labs struggles with delivering high-performing virtual environments for Safari, Android, and iOS testing, leading to slower execution times and inefficiencies in mobile testing workflows.</li>
        <li><strong>Slow Innovation and Market Timing:</strong> While Sauce Labs is developing a more affordable alternative for visual testing, the pace of innovation has lagged behind competitors, and new features may arrive too late to compete effectively in a rapidly evolving market.</li>
      </ul>
      <br/>
      <br/>
      <h4>Conclusion:</h4>
      <p>Sauce Labs remains a reliable platform with strong real-device stability, making it a good choice for scaling large test suites. However, the lack of performant infrastructure for virtual Safari, Android, and iOS environments, combined with the slow adoption of new iOS versions, reduces its effectiveness for modern testing needs. While efforts to introduce new features, such as an affordable visual testing solution, are promising, the slower pace of innovation may hinder its competitiveness in the current market.
       <br/>We recommend placing Sauce Labs on hold for new projects and exploring alternatives like BrowserStack or LambdaTest, which offer faster support, more modern infrastructure, and competitive features for mobile and web testing.</p>
    `,
  },
  {
    name: 'Lambda Test',
    ring: 'Trial',
    quadrant: 'Platforms',
    isNew: 'FALSE',
    status: 'No Change',
    description: `
      <h4>Description:</h4>
      <p>
        <strong>LambdaTest</strong> is a cloud-based testing platform that has quickly emerged as a strong contender in the test automation space. Known for its rapid feature development, LambdaTest offers a performant infrastructure for virtual browsers, emulators, and simulators. However, its unique implementation of capabilities and differences in defaults compared to tools like Selenium and Appium can make migrations more complex. Its recent introduction of Kane AI, a powerful AI-driven solution, sets it apart from competitors by enhancing test analysis and efficiency.
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Rapid Feature Development:</strong> Continuously rolling out innovative tools and capabilities, providing users with cutting-edge features.</li>
        <li><strong>Performant Emulator/Simulator Infrastructure:</strong> Offers reliable and fast environments for Android and iOS testing.</li>
        <li><strong>Kane AI:</strong> A unique AI solution that enhances workflows, accelerates test analysis, and improves efficiency.</li>
      </ul>
      <br/>
      <br/>
      <h4>Cons:</h4>
      <ul>
        <li><strong>Migration Complexity:</strong> Differences in capabilities and defaults compared to tools like Selenium and Appium can complicate transitions from local grids or other platforms.</li>
        <li><strong>Documentation Challenges:</strong> Documentation lacks clarity and depth in certain areas, making it harder for users to fully leverage the platform's features.</li>
        <li><strong>Stability for Large Test Suites:</strong> While suitable for smaller projects and organizations, stability concerns with large-scale test suites or enterprise-level testing make it riskier without thorough evaluation.</li>
      </ul>
      <br/>
      <br/>
      <h4>Conclusion:</h4>
      <p>LambdaTest is a fast-growing platform with a strong focus on innovation, highlighted by its performant infrastructure and Kane AI solution, which offers a significant competitive advantage in test execution/analysis and efficiency. It is particularly well-suited for smaller projects or organizations looking for a feature-rich and modern testing platform.
       However, teams considering LambdaTest for larger projects or enterprise use should evaluate it carefully, given migration complexities, documentation gaps, and stability concerns. We recommend trialing LambdaTest to assess its fit, especially for teams aiming to leverage its cutting-edge AI capabilities and scalable infrastructure.</p>
    `,
  },

  {
    name: 'Applitools',
    ring: 'Trial',
    quadrant: 'Platforms',
    isNew: 'FALSE',
    status: 'No Change',
    description: `
      <h4>Description:</h4>
      <p>
        <strong>Applitools</strong> is a visual testing platform that leverages AI-powered algorithms to perform visual regression testing. It focuses exclusively on visual testing and requires integration with a cloud vendor or local grid for test execution, as it does not include a (proper) execution environment. By sending test data to Applitools for analysis, teams can ensure UI consistency across multiple browsers and devices.
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul>
        <li><strong>AI-Powered Accuracy:</strong> Reduces false positives by intelligently detecting meaningful visual differences.</li>
        <li><strong>Broad Framework Compatibility:</strong> Works seamlessly with tools like Selenium, Playwright, and WebdriverIO.</li>
        <li><strong>Cross-Platform Testing:</strong> Ensures consistent UI experiences across browsers and devices.</li>
      </ul>
      <br/>
      <br/>
      <h4>Cons:</h4>
      <ul>
        <li><strong>Requires External Grid:</strong> Teams must pair it with a cloud vendor or local grid for executing tests, as Applitools only handles the visual validation aspect.</li>
        <li><strong>Data Dependency:</strong> All test data must be sent to Applitools, which could be a concern for teams with strict data security policies.</li>
        <li><strong>Expensive for Scaling:</strong> Costs can escalate quickly for teams with large-scale or enterprise-level visual testing needs.</li>
      </ul>
      <br/>
      <br/>
      <h4>Conclusion:</h4>
      <p>Applitools offers an exceptional visual testing solution, backed by AI for accuracy and efficiency. However, its reliance on external execution environments and its pricing structure may pose challenges for some teams. It is best suited for teams that already have access to a test execution grid or cloud vendor and are looking to enhance their visual regression testing capabilities.
       <br/>We recommend trialing Applitools to determine its value for your workflows, especially if visual consistency is a high priority for your projects.</p>
    `,
  },

  {
    name: 'BrowserStack',
    ring: 'Adopt',
    quadrant: 'Platforms',
    isNew: 'FALSE',
    status: 'No Change',
    description: `
      <h4>Description:</h4>
      <p>
        <strong>BrowserStack</strong> is a cloud-based testing platform that has been a trusted name in the industry for nearly as long as Sauce Labs. Unlike its competitors, BrowserStack focuses heavily on developer and small-team workflows, offering extensive integrations and features designed for streamlined testing. However, it does not provide support for emulators and simulators, differentiating it from alternatives like LambdaTest or Sauce Labs.
      </p>
      <br/>
      <h4>Pros:</h4>
      <ul>
        <li><strong>Developer-Focused:</strong> Tailored for developers and small teams with features and integrations that simplify workflows and testing processes.</li>
        <li><strong>Stability and Reliability:</strong> Provides a stable and consistent experience, particularly for browser and real device testing.</li>
        <li><strong>Extensive Browser and Device Coverage:</strong> Supports a wide range of browsers and physical devices, ensuring compatibility testing across diverse environments.</li>
      </ul>
      <br/>
      <br/>
      <h4>Cons:</h4>
      <ul>
        <li><strong>No Emulator/Simulator Support:</strong> Lacks virtual emulators and simulators for Android and iOS, which limits flexibility for teams that rely on these for mobile testing.</li>
        <li><strong>Limited Focus on Enterprise Scaling:</strong> While excellent for small teams, it may lack some of the advanced enterprise-level features available in other platforms.</li>
      </ul>
      <br/>
      <br/>
      <h4>Conclusion:</h4>
      <p>BrowserStack remains a reliable and trusted option, particularly for developers and smaller teams focused on browser and physical device testing. Its stability, integrations, and broad coverage make it an excellent choice for compatibility testing. However, the lack of emulator and simulator support limits its utility for teams requiring virtual environments for mobile testing.</p>
    `,
  },
]

exports.platforms = {
  content,
}
