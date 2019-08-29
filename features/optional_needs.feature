Feature: Optional
  Scenario: Using `list`
    Given a needs file with an optional need
    When I list the needs
    Then the needs list passes
    And I see the optional need in the output

  Scenario: Using `check`
    Given a needs file with an optional need
    And the needs are not satisfied
    When I check the needs
    Then the needs check passes
    And I see the unsatisfied optional need in the output

  Scenario: Using `list` with an incorrect description
    Given a needs file with an incorrect optional need
    When I check the needs
    Then the needs list fails

