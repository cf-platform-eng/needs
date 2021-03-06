Feature: Description
  Scenario: Using `list`
    Given a needs file with a description field
    When I list the needs
    Then the needs list passes
    And I see the description in the output

  Scenario: Using `check`
    Given a needs file with a description field
    When I check the needs
    Then the needs check passes
    And I see the description in the output

  Scenario: Using `list` with an incorrect description
    Given a needs file with an incorrect description field
    When I list the needs
    Then the needs list fails

