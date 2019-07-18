Feature: Checking needs
  Scenario: Satisfied needs file
    Given a needs file
    And the needs are satisfied
    When I check the needs
    Then the needs check passes
    And I see all of the needs

  Scenario: Satisfied needs file with --satisfied
    Given a needs file
    And the needs are satisfied
    When I check the needs with --satisfied
    Then the needs check passes
    And I see all of the needs

  Scenario: Satisfied needs file with --unsatisfied
    Given a needs file
    And the needs are satisfied
    When I check the needs with --unsatisfied
    Then the needs check passes
    And I don't see any needs

  Scenario: Unsatisfied needs file
    Given a needs file
    And a need is unsatisfied
    When I check the needs
    Then the needs check fails
    And I see all of the needs

  Scenario: Unsatisfied needs file with --satisfied
    Given a needs file
    And a need is unsatisfied
    When I check the needs with --satisfied
    Then the needs check fails
    And I see the satisfied need

  Scenario: Unsatisfied needs file with --unsatisfied
    Given a needs file
    And a need is unsatisfied
    When I check the needs with --unsatisfied
    Then the needs check fails
    And I see the unsatisfied need

  Scenario: Missing needs file
    Given no needs file
    When I check the needs
    Then the needs check fails
    And tells me that the needs file was missing

  Scenario: Invalid needs file
    Given a needs file that's not valid JSON
    When I check the needs
    Then the needs check fails
    And tells me that the needs file was invalid

  Scenario: Invalid needs file
    Given a needs file with invalid data
    When I check the needs
    Then the needs check fails
    And tells me that the needs file was invalid