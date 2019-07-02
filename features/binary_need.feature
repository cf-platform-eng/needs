Feature: Binary needs
  Scenario: Binary path exists
    Given a needs file that checks for a binary using a path
    And that binary exists
    When I check the needs
    Then the needs check passes

  Scenario: Binary path exists, but is not executable
    Given a needs file that checks for a binary using a path
    And that binary exists, but it is not executable
    When I check the needs
    Then the needs check fails
    And outputs the unsatisfied need

  Scenario: Binary path does not exist
    Given a needs file that checks for a binary using a path
    And that binary does not exist
    When I check the needs
    Then the needs check fails
    And outputs the unsatisfied need

  Scenario: Binary name is found in the path
    Given a needs file that checks for a binary using a name
    And that binary exists in the PATH
    When I check the needs
    Then the needs check passes

  Scenario: Binary name is not found in the path
    Given a needs file that checks for a binary using a name
    And that binary does not exist
    When I check the needs
    Then the needs check fails
    And outputs the unsatisfied need