Feature: Environment variable needs
  Scenario: Environment variable defined
    Given a needs file that checks for an environment variable
    And that environment variable is defined
    When I check the needs
    Then the needs check passes

  Scenario: Environment variable not defined
    Given a needs file that checks for an environment variable
    And that environment variable is not defined
    When I check the needs
    Then the needs check fails
    And outputs the unsatisfied need
