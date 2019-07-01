Feature: File needs
  Scenario: File exists
    Given a needs file that checks for a file
    And that file exists
    When I check the needs
    Then the needs check passes

  Scenario: File missing
    Given a needs file that checks for a file
    And that file does not exist
    When I check the needs
    Then the needs check fails
    And outputs the unsatisfied need

  # Scenario: File glob exists
  #   Given a needs file that checks for a file with a glob
  #   And a matching file exists
  #   When I check the needs
  #   Then the needs check passes

  # Scenario: File glob missing
  #   Given a needs file that checks for a file with a glob
  #   And no matching file exists
  #   When I check the needs
    Then the needs check fails
    And outputs the unsatisfied need
