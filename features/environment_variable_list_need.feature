Feature: Environment variable list needs
  Scenario: None of the environment variables are defined
    Given a needs file that checks for a list of environment variables
    And those environment variables are not defined
    When I check the needs
    Then the needs check fails
    And outputs the unsatisfied need

  Scenario: Some of the environment variables are defined
    Given a needs file that checks for a list of environment variables
    And only one environment variable is defined
    When I check the needs
    Then the needs check fails
    And outputs the unsatisfied need

  Scenario: All of the environment variables are defined
    Given a needs file that checks for a list of environment variables
    And those environment variables are defined
    When I check the needs
    Then the needs check passes
