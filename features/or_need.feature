Feature: Boolean or needs
  Scenario: No passing needs
    Given a needs file that uses OR to combine two environment variable needs
    And those environment variables are not defined
    When I check the needs
    Then the needs check fails
    And outputs the unsatisfied need

  Scenario: Some passing needs
    Given a needs file that uses OR to combine two environment variable needs
    And only one environment variable is defined
    When I check the needs
    Then the needs check passes

  Scenario: All passing needs
    Given a needs file that uses OR to combine two environment variable needs
    And those environment variables are defined
    When I check the needs
    Then the needs check passes
